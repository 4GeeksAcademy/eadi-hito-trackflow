from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import quote

import resend
from resend.exceptions import ResendError
from dotenv import load_dotenv


load_dotenv(Path(__file__).resolve().parent / ".env", override=True)


class EmailConfigurationError(RuntimeError):
    pass


def ensure_email_configured() -> None:
    if not os.getenv("RESEND_API_KEY", "").strip():
        raise EmailConfigurationError("Falta RESEND_API_KEY en .env")


def send_password_reset_email(to_email: str, token: str) -> None:
    ensure_email_configured()
    resend.api_key = os.getenv("RESEND_API_KEY", "").strip()

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
    email_from = os.getenv("EMAIL_FROM", "TrackFlow <onboarding@resend.dev>")

    encoded_token = quote(token, safe="")
    reset_url = f"{frontend_url}/reset-password?token={encoded_token}"

    try:
        resend.Emails.send(
            {
                "from": email_from,
                "to": [to_email],
                "subject": "Restablece tu contraseña de TrackFlow",
                "html": (
                    "<div style='font-family:Arial,sans-serif;max-width:560px;margin:auto;line-height:1.5'>"
                    "<h1>Restablece tu contraseña</h1>"
                    "<p>Hemos recibido una solicitud para cambiar tu contraseña de TrackFlow.</p>"
                    f"<p><a href='{reset_url}' style='display:inline-block;padding:12px 18px;background:#152a35;color:#fff;text-decoration:none'>"
                    "Crear nueva contraseña</a></p>"
                    "<p>Este enlace caduca pronto y solo puede utilizarse una vez. Si no lo solicitaste, ignora este mensaje.</p>"
                    "</div>"
                ),
            }
        )
    except (ResendError, OSError) as error:
        raise RuntimeError("No se pudo enviar el email de restablecimiento.") from error
