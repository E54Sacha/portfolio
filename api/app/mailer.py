"""Sends contact messages by email.

Two ways, chosen from the environment variables (set as secrets on Render):

1. Your own mailbox over SMTP (e.g. Gmail):
   - SMTP_USER: your address (e.g. you@gmail.com)
   - SMTP_PASSWORD: an app password (Gmail: Google Account > Security > 2-Step Verification > App passwords),
     never your real password
   - SMTP_HOST / SMTP_PORT: optional, default smtp.gmail.com / 587
   - CONTACT_TO: optional, defaults to SMTP_USER (you send the message to yourself)

2. Resend (used instead if RESEND_API_KEY is set):
   - RESEND_API_KEY, CONTACT_TO, optional CONTACT_FROM
"""

import os
import smtplib
import ssl
from email.message import EmailMessage

import httpx

RESEND_URL = "https://api.resend.com/emails"
TIMEOUT = 10  # seconds


class MailNotConfigured(Exception):
    """No sending method is configured."""


class MailFailed(Exception):
    """The mail server refused the message or could not be reached."""


def method() -> str | None:
    if os.getenv("RESEND_API_KEY") and os.getenv("CONTACT_TO"):
        return "resend"
    if os.getenv("SMTP_USER") and os.getenv("SMTP_PASSWORD"):
        return "smtp"
    return None


def is_configured() -> bool:
    return method() is not None


def send_contact_email(name: str, email: str, message: str) -> None:
    how = method()
    if how == "resend":
        _send_resend(name, email, message)
    elif how == "smtp":
        _send_smtp(name, email, message)
    else:
        raise MailNotConfigured


def _subject(name: str) -> str:
    return f"Portfolio message from {name}"


def _body(name: str, email: str, message: str) -> str:
    return f"From: {name} <{email}>\n\n{message}"


def _send_smtp(name: str, email: str, message: str) -> None:
    user = os.environ["SMTP_USER"]
    msg = EmailMessage()  # refuses header values with line breaks, so nothing can be injected
    msg["From"] = user
    msg["To"] = os.getenv("CONTACT_TO") or user
    msg["Reply-To"] = email  # "Reply" in your inbox answers the visitor directly
    msg["Subject"] = _subject(name)
    msg.set_content(_body(name, email, message))

    host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    port = int(os.getenv("SMTP_PORT", "587"))
    context = ssl.create_default_context()
    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port, timeout=TIMEOUT, context=context) as smtp:
                smtp.login(user, os.environ["SMTP_PASSWORD"])
                smtp.send_message(msg)
        else:
            with smtplib.SMTP(host, port, timeout=TIMEOUT) as smtp:
                smtp.starttls(context=context)
                smtp.login(user, os.environ["SMTP_PASSWORD"])
                smtp.send_message(msg)
    except (smtplib.SMTPException, OSError, ValueError) as exc:
        raise MailFailed(f"SMTP {host}:{port}: {type(exc).__name__}: {exc}") from exc


def _send_resend(name: str, email: str, message: str) -> None:
    payload = {
        "from": os.getenv("CONTACT_FROM", "Portfolio <onboarding@resend.dev>"),
        "to": [os.environ["CONTACT_TO"]],
        "reply_to": email,
        "subject": _subject(name),
        "text": _body(name, email, message),
    }
    try:
        response = httpx.post(
            RESEND_URL,
            json=payload,
            headers={"Authorization": f"Bearer {os.environ['RESEND_API_KEY']}"},
            timeout=TIMEOUT,
        )
    except httpx.HTTPError as exc:
        raise MailFailed(str(exc)) from exc
    if response.status_code >= 300:
        raise MailFailed(f"Resend answered {response.status_code}")
