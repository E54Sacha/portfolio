"""Sends contact messages by email through the Resend API.

Configuration (environment variables, set as secrets on Render):
- RESEND_API_KEY: the Resend API key
- CONTACT_TO: the address that receives the messages
- CONTACT_FROM: optional sender, defaults to Resend's test sender (works without your own domain)
"""

import os

import httpx

RESEND_URL = "https://api.resend.com/emails"


class MailNotConfigured(Exception):
    """RESEND_API_KEY or CONTACT_TO is missing."""


class MailFailed(Exception):
    """Resend refused or could not be reached."""


def is_configured() -> bool:
    return bool(os.getenv("RESEND_API_KEY") and os.getenv("CONTACT_TO"))


def send_contact_email(name: str, email: str, message: str) -> None:
    api_key = os.getenv("RESEND_API_KEY")
    to = os.getenv("CONTACT_TO")
    if not api_key or not to:
        raise MailNotConfigured
    payload = {
        "from": os.getenv("CONTACT_FROM", "Portfolio <onboarding@resend.dev>"),
        "to": [to],
        "reply_to": email,
        "subject": f"Portfolio message from {name}",
        "text": f"From: {name} <{email}>\n\n{message}",
    }
    try:
        response = httpx.post(
            RESEND_URL,
            json=payload,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=10,
        )
    except httpx.HTTPError as exc:
        raise MailFailed(str(exc)) from exc
    if response.status_code >= 300:
        raise MailFailed(f"Resend answered {response.status_code}")
