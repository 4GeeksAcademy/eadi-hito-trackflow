from playwright.sync_api import sync_playwright

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    website = browser.new_page()
    website.goto('http://127.0.0.1:3100/', wait_until='networkidle')
    assert 'Logística que escala con tu e-commerce' in website.locator('h1').inner_text()
    assert website.locator('form').count() == 1

    backoffice = browser.new_page()
    backoffice.goto('http://127.0.0.1:3101/', wait_until='networkidle')
    assert 'Buenos días, Ana.' in backoffice.locator('h1').inner_text()
    assert backoffice.get_by_text('Inventario por almacén').count() == 1
    assert backoffice.locator('a[href="#main-content"]').count() == 1
    browser.close()
