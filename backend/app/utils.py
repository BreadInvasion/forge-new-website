import logging
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import emails  # type: ignore
from jinja2 import Template
from jose import JWTError, jwt

from app.core.config import settings
from app.models.user import User


@dataclass
class EmailData:
    html_content: str
    subject: str


def render_email_template(*, template_name: str, context: dict[str, Any]) -> str:
    template_str = (
        Path(__file__).parent / "email-templates" / "build" / template_name
    ).read_text()
    html_content = Template(template_str).render(context)
    return html_content


def send_email(
    *,
    email_to: str,
    subject: str = "",
    html_content: str = "",
) -> None:
    assert settings.emails_enabled, "no provided configuration for email variables"
    message = emails.Message(
        subject=subject,
        html=html_content,
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    elif settings.SMTP_SSL:
        smtp_options["ssl"] = True
    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD
    response = message.send(to=email_to, smtp=smtp_options)
    logging.info(f"send email result: {response}")


def generate_reset_password_email(user: User, token: str) -> EmailData:
    subject = f"The Forge - Password Recovery"
    link = f"{settings.server_host}/reset-password?token={token}"
    html_content = render_email_template(
        template_name="reset_password.html",
        context={
            "first_name": user.first_name,
            "email": user.RCSID + "@rpi.edu",
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "link": link,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_new_account_email(token: str) -> EmailData:
    subject = f"The Forge - Activate Your Account"

    html_content = render_email_template(
        template_name="new_account.html",
        context={
            "link": settings.server_host + "/activate?token={token}",
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_email_token(RCSID: str, expire_hours: int) -> str:
    delta = timedelta(hours=expire_hours)
    now = datetime.now()
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": RCSID},
        settings.SECRET_KEY,
        algorithm="HS256",
    )
    return encoded_jwt


def verify_password_reset_token(token: str) -> str | None:
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return str(decoded_token["sub"])
    except JWTError:
        return None
