"""Portfolio API: one endpoint that receives the contact form and emails it to me."""

import logging
import os
import time
from collections import defaultdict, deque

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator

from app import mailer

log = logging.getLogger("portfolio-api")

DEFAULT_ORIGINS = "https://portfolio-five-khaki.vercel.app,http://localhost:3000"
RATE_LIMIT = 5  # messages
RATE_WINDOW = 10 * 60  # seconds

app = FastAPI(title="Portfolio API", docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",") if o.strip()],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(min_length=10, max_length=5000)
    # Honeypot: hidden in the form. People leave it empty, spam bots fill it in.
    website: str = Field(default="", max_length=200)

    @field_validator("name")
    @classmethod
    def one_line_name(cls, value: str) -> str:
        value = " ".join(value.split())  # no line breaks or repeated spaces (it goes in the subject)
        if not value:
            raise ValueError("name is required")
        return value

    @field_validator("message")
    @classmethod
    def not_blank(cls, value: str) -> str:
        if len(value.strip()) < 10:
            raise ValueError("message is too short")
        return value.strip()


# Very small in-memory rate limiter: fine for one free-tier instance.
_hits: dict[str, deque[float]] = defaultdict(deque)


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limited(ip: str, now: float | None = None) -> bool:
    now = time.monotonic() if now is None else now
    hits = _hits[ip]
    while hits and now - hits[0] > RATE_WINDOW:
        hits.popleft()
    if len(hits) >= RATE_LIMIT:
        return True
    hits.append(now)
    return False


@app.get("/health")
def health() -> dict:
    """Used by Render, and by the site to wake the server up before a message is sent."""
    return {"status": "ok", "email": "configured" if mailer.is_configured() else "not configured"}


@app.post("/contact", status_code=202)
def contact(msg: ContactMessage, request: Request) -> dict:
    if msg.website:
        # A bot filled the honeypot: pretend it worked, send nothing.
        return {"status": "sent"}
    if rate_limited(client_ip(request)):
        raise HTTPException(status_code=429, detail="Too many messages. Try again in a few minutes.")
    try:
        mailer.send_contact_email(msg.name, msg.email, msg.message)
    except mailer.MailNotConfigured:
        log.warning("Contact message received but email isn't configured")
        raise HTTPException(status_code=503, detail="Messages can't be delivered right now. Email me directly instead.")
    except mailer.MailFailed as exc:
        log.error("Sending failed: %s", exc)
        raise HTTPException(status_code=502, detail="Your message couldn't be delivered. Try again later.")
    return {"status": "sent"}
