from __future__ import annotations

import os
from pathlib import Path
import socket
import subprocess
import tempfile
import threading
import time
from datetime import datetime, timedelta, timezone

import httpx
import pytest
import uvicorn
from jose import jwt

from auth_dependencies import create_access_token
from auth_service import create_user
from main import app
from models import UserCreate

pytestmark = pytest.mark.skipif(
    os.getenv("TRACKFLOW_BROWSER_TESTS") != "1",
    reason="Requiere Chromium y node_modules; activar con TRACKFLOW_BROWSER_TESTS=1.",
)


def free_port():
    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        return listener.getsockname()[1]


def check_landing_back_to_top(page, base):
    from playwright.sync_api import expect

    original_viewport = page.viewport_size
    for width, height in ((1440, 960), (390, 844)):
        page.set_viewport_size({"width": width, "height": height})
        page.goto(base)
        page.wait_for_load_state("networkidle")
        button = page.get_by_role("button", name="Volver al inicio de la página", exact=True)
        expect(button).to_have_count(0)
        page.mouse.wheel(0, 600)
        expect(button).to_be_visible()
        assert button.evaluate("element => getComputedStyle(element).position") == "fixed"
        assert button.evaluate("element => getComputedStyle(element).color") == "rgb(255, 255, 255)"
        bounds = button.bounding_box()
        assert bounds["width"] == bounds["height"] == 48
        assert bounds["x"] >= 0 and bounds["x"] + bounds["width"] <= width
        assert bounds["y"] >= 0 and bounds["y"] + bounds["height"] <= height
        button.click()
        page.wait_for_function("window.scrollY === 0")
        expect(button).to_have_count(0)
        page.get_by_role("link", name="Cobertura", exact=True).click()
        expect(button).to_be_visible()
        button.click()
        page.wait_for_function("window.scrollY === 0")
        page.emulate_media(reduced_motion="reduce")
        page.evaluate('window.scrollTo({top: 900, behavior: "instant"})')
        expect(button).to_be_visible()
        button.focus()
        page.keyboard.press("Enter")
        page.wait_for_function("window.scrollY === 0")
        expect(button).to_have_count(0)
        page.emulate_media(reduced_motion="no-preference")
    page.set_viewport_size(original_viewport)
    page.goto(base)
    page.wait_for_load_state("networkidle")


def check_section_navigation(page, base):
    sections = {
        "/inventory/products": [
            ("Registrar entrada", "/inventory/orders/inbound"),
            ("Registrar salida", "/inventory/orders/outbound"),
            ("Ver historial de órdenes", "/inventory/orders"),
        ],
        "/incidents": [("Registrar incidencia", "/incidents/new")],
        "/suppliers": [],
        "/candidates": [],
    }
    screenshots = Path(tempfile.gettempdir()) / "trackflow-sidebar-review"
    screenshots.mkdir(exist_ok=True)
    page.goto(base + "/ops")
    background = page.locator(".sidebar").evaluate("element => getComputedStyle(element).backgroundColor")
    for width in (1440, 900, 390):
        page.set_viewport_size({"width": width, "height": 960})
        for path, actions in sections.items():
            page.goto(base + path)
            page.wait_for_load_state("networkidle")
            assert page.locator(".back-to-top").count() == 0
            sidebar = page.locator(".ops-section-sidebar")
            assert sidebar.is_visible(), (width, path)
            assert sidebar.evaluate("element => getComputedStyle(element).backgroundColor") == background
            assert page.locator('main a[href="/ops"], main a[href="/"]').count() == 0
            sidebar_bounds = sidebar.bounding_box()
            main_bounds = page.locator("main").bounding_box()
            if width > 560:
                assert sidebar_bounds["x"] + sidebar_bounds["width"] <= main_bounds["x"] + 1
            else:
                assert sidebar_bounds["y"] + sidebar_bounds["height"] <= main_bounds["y"] + 1
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), (width, path)
            for label, target in actions + [("Volver al panel Ops", "/ops"), ("Volver al inicio", "/")]:
                link = sidebar.get_by_role("link", name=label, exact=True)
                assert link.count() == 1 and link.is_visible(), (width, path, label)
                assert link.get_attribute("href") == target
            if path == "/inventory/products":
                assert sidebar.get_by_role("link").count() == 5
                assert page.locator("main .inventory-actions").count() == 0
                assert page.get_by_role("button", name="Actualizar", exact=False).count() == 1
            elif path == "/incidents":
                with page.expect_response(lambda response: "/api/incidents?" in response.url and "origin=customer" in response.url):
                    page.get_by_label("Filtrar origen", exact=True).select_option("customer")
                page.get_by_label("Filtrar origen", exact=True).select_option("")
            elif path == "/suppliers":
                with page.expect_response(lambda response: "/api/suppliers?country=Spain" in response.url):
                    page.locator(".supplier-toolbar select").first.select_option("Spain")
                assert page.get_by_role("button", name="Registrar proveedor", exact=True).count() == 1
            elif path == "/candidates":
                page.get_by_role("button", name="Nueva candidatura", exact=True).click()
                page.get_by_role("button", name="Crear candidatura", exact=True).wait_for(state="visible")
                page.get_by_role("button", name="Cerrar formulario", exact=True).click()
            page.screenshot(path=str(screenshots / f"{path.strip('/').replace('/', '-')}-{width}.png"), full_page=True)
            for label, target in actions + [("Volver al panel Ops", "/ops"), ("Volver al inicio", "/")]:
                page.goto(base + path)
                page.locator(".ops-section-sidebar").get_by_role("link", name=label, exact=True).click()
                page.wait_for_url(base + target)
    page.set_viewport_size({"width": 1280, "height": 720})


def test_ops_session_and_public_form(isolated_database):
    playwright = pytest.importorskip("playwright.sync_api")
    backend_port = free_port()
    frontend_port = free_port()
    backend = uvicorn.Server(uvicorn.Config(app, host="127.0.0.1", port=backend_port, log_level="error"))
    thread = threading.Thread(target=backend.run, daemon=True)
    thread.start()
    frontend_path = Path(__file__).resolve().parents[2] / "frontend"
    generated_paths = [frontend_path / name for name in ("tsconfig.json", "next-env.d.ts")]
    original_files = {path: path.read_bytes() for path in generated_paths}
    environment = {
        **os.environ,
        "BACKEND_URL": f"http://127.0.0.1:{backend_port}",
        "TRACKFLOW_NEXT_DIST_DIR": f".next/ops-tests-{frontend_port}",
    }
    base = f"http://127.0.0.1:{frontend_port}"
    log = tempfile.TemporaryFile(mode="w+t")
    build = subprocess.run(
        ["node", "node_modules/next/dist/bin/next", "build"],
        cwd=frontend_path, env=environment, stdout=log, stderr=subprocess.STDOUT, timeout=180,
    )
    generated_files = {path: path.read_bytes() for path in generated_paths}
    if build.returncode:
        backend.should_exit = True
        thread.join(timeout=10)
        log.seek(0)
        pytest.fail(log.read())
    frontend = subprocess.Popen(
        ["node", "node_modules/next/dist/bin/next", "start", "-p", str(frontend_port)],
        cwd=frontend_path, env=environment, stdout=log, stderr=subprocess.STDOUT,
    )
    try:
        deadline = time.monotonic() + 120
        while time.monotonic() < deadline:
            if frontend.poll() is not None:
                log.seek(0)
                pytest.fail(log.read())
            try:
                if httpx.get(base, timeout=5).status_code == 200:
                    break
            except httpx.HTTPError:
                pass
        else:
            pytest.fail("Next.js no estuvo disponible a tiempo")

        user = create_user(UserCreate(email="browser@example.com", password="Correcta123"))
        with playwright.sync_playwright() as browser_api:
            browser = browser_api.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            check_landing_back_to_top(page, base)
            page.goto(base)
            page.wait_for_load_state("networkidle")
            assert page.locator('a[href="/ops"], a[href^="/candidates"]').count() == 0
            assert page.locator("#contacto form").is_visible()
            page.locator('#contacto button[type="submit"]').click()
            assert page.get_by_text("El nombre de la empresa debe tener al menos 2 caracteres").is_visible()
            for name, value in {"company": "Empresa demo", "contact": "Persona Demo", "email": "public@example.com", "phone": "+34 600 000 000"}.items():
                page.locator(f'[name="{name}"]').fill(value)
            for name in ("country", "product", "volume"):
                page.locator(f'[name="{name}"]').select_option(index=1)
            page.locator('[name="services"]').first.check()
            page.locator('[name="privacy"]').check()
            page.locator('#contacto button[type="submit"]').click()
            assert page.get_by_text("¡Gracias por tu interés en TrackFlow!").is_visible()

            page.goto(base + "/ops")
            page.wait_for_url("**/login?next=*")
            for path in ("/ops", "/ops?view=private", "/inventory/products", "/incidents", "/suppliers", "/candidates", "/candidates/1", "/account/change-password"):
                response = context.request.get(base + path, max_redirects=0)
                assert response.status == 307, path
                assert "/login?next=" in response.headers["location"]
            for path in ("/api/records", "/api/records/1/notes", "/api/incidents", "/api/inventory/products", "/api/suppliers"):
                assert context.request.get(base + path).status == 401, path
            assert context.request.post(base + "/api/records", data={}).status == 400
            for path in ("/register", "/forgot-password", "/reset-password"):
                assert context.request.get(base + path).status == 200, path

            page.goto(base + "/candidates")
            page.wait_for_url("**/login?next=*")
            page.locator('input[type="email"]').fill("browser@example.com")
            page.locator('input[type="password"]').fill("Correcta123")
            page.get_by_role("button", name="Entrar", exact=True).click()
            page.wait_for_url("**/candidates")
            page.wait_for_load_state("networkidle")
            assert page.get_by_role("heading", name="Talent Pipeline Tracker").is_visible()
            page.goto(base + "/ops")
            page.wait_for_load_state("networkidle")
            cookie = next(cookie for cookie in context.cookies() if cookie["name"] == "trackflow_access_token")
            assert cookie["httpOnly"] and cookie["sameSite"] == "Lax"
            assert context.request.get(base + "/api/records").status == 200
            assert context.request.get(base + "/api/incidents").status == 200
            page.get_by_role("link", name="Incidencias", exact=True).click()
            page.wait_for_url("**/incidents")
            page.wait_for_load_state("networkidle")
            assert not page.locator(".incident-error").count(), page.locator(".incident-error").all_text_contents()
            check_section_navigation(page, base)
            page.goto(base)
            assert page.locator('a[href="/ops"], a[href^="/candidates"]').count() == 0
            page.get_by_role("link", name="Acceder", exact=True).first.click()
            page.wait_for_url("**/ops")
            page.get_by_role("button", name="Cerrar sesión").click()
            page.wait_for_url("**/login")
            assert page.evaluate("localStorage.getItem('trackflow_access_token')") is None
            assert context.request.get(base + "/ops", max_redirects=0).status == 307
            assert context.request.get(base + "/candidates", max_redirects=0).status == 307
            assert context.request.get(base + "/api/records").status == 401

            token = create_access_token(user)
            page.goto(base + "/login")
            page.wait_for_load_state("networkidle")
            page.evaluate("token => localStorage.setItem('trackflow_access_token', token)", token)
            with page.expect_response(lambda response: response.url.endswith('/api/auth/session') and response.request.method == 'POST') as migration:
                page.goto(base + "/ops")
            assert migration.value.status == 200, migration.value.text()
            page.wait_for_url("**/ops")
            page.wait_for_load_state("networkidle")
            assert page.get_by_role("button", name="Cerrar sesión").is_visible()

            short_token = jwt.encode({"sub": str(user.id), "exp": datetime.now(timezone.utc) + timedelta(seconds=5)}, "test-secret-key", algorithm="HS256")
            page.evaluate("token => localStorage.setItem('trackflow_access_token', token)", short_token)
            context.add_cookies([{"name": "trackflow_access_token", "value": short_token, "url": base, "httpOnly": True}])
            page.reload()
            page.wait_for_url("**/login?next=*", timeout=15000)
            assert context.request.get(base + "/api/incidents").status == 401
            assert not errors, errors
            browser.close()
    finally:
        frontend.terminate()
        try:
            frontend.wait(timeout=20)
        except subprocess.TimeoutExpired:
            frontend.kill()
            frontend.wait()
        backend.should_exit = True
        thread.join(timeout=10)
        for path, generated in generated_files.items():
            if path.read_bytes() == generated:
                path.write_bytes(original_files[path])
        log.close()