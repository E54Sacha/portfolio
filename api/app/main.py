"""Portfolio API: one endpoint that receives the contact form and emails it to me."""

import logging
import os
import time
from collections import OrderedDict, deque

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator

from app import mailer

log = logging.getLogger("portfolio-api")

DEFAULT_ORIGINS = "https://portfolio-five-khaki.vercel.app,http://localhost:3000"
RATE_LIMIT = 5  # messages per visitor...
RATE_WINDOW = 10 * 60  # ...per 10 minutes
GLOBAL_LIMIT = 30  # messages from everyone together...
GLOBAL_WINDOW = 60 * 60  # ...per hour (protects the inbox and the free Resend quota)
MAX_TRACKED = 10_000  # visitors remembered at most (bounded memory)

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


# Small in-memory rate limiter: fine for one free-tier instance.
_hits: "OrderedDict[str, deque[float]]" = OrderedDict()  # visitor IP -> times of their recent messages
_global: deque[float] = deque()  # times of everyone's recent messages


def client_ip(request: Request) -> str:
    """The visitor's IP. Render's proxy appends the real client address as the LAST X-Forwarded-For
    entry; anything before it was sent by the client and can be faked, so it's ignored."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        last = forwarded.split(",")[-1].strip()
        if last:
            return last
    return request.client.host if request.client else "unknown"


def _expire(times: deque[float], now: float, window: float) -> None:
    while times and now - times[0] > window:
        times.popleft()


def rate_limited(ip: str, now: float | None = None) -> bool:
    now = time.monotonic() if now is None else now

    _expire(_global, now, GLOBAL_WINDOW)
    if len(_global) >= GLOBAL_LIMIT:
        return True

    hits = _hits.get(ip)
    if hits is not None:
        _expire(hits, now, RATE_WINDOW)
        if len(hits) >= RATE_LIMIT:
            return True
    else:
        # Bounded memory: forget visitors with no recent messages, then the least recent ones.
        if len(_hits) >= MAX_TRACKED:
            for key in [k for k, v in _hits.items() if not v or now - v[-1] > RATE_WINDOW]:
                del _hits[key]
            while len(_hits) >= MAX_TRACKED:
                _hits.popitem(last=False)
        hits = _hits[ip] = deque()

    hits.append(now)
    _hits.move_to_end(ip)
    _global.append(now)
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
