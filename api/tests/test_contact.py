import pytest
from fastapi.testclient import TestClient

from app import mailer, main

client = TestClient(main.app)
REAL_SEND = mailer.send_contact_email  # saved before the fixture replaces it
GOOD = {"name": "Ada Lovelace", "email": "ada@example.com", "message": "Hello, I liked your projects!"}


@pytest.fixture(autouse=True)
def reset(monkeypatch):
    main._hits.clear()
    sent = []
    monkeypatch.setattr(mailer, "send_contact_email", lambda *args: sent.append(args))
    return sent


def test_health():
    r = client.get("/health")
    assert r.status_code == 200 and r.json()["status"] == "ok"


def test_valid_message_is_sent(reset):
    r = client.post("/contact", json=GOOD)
    assert r.status_code == 202
    assert reset == [("Ada Lovelace", "ada@example.com", "Hello, I liked your projects!")]


@pytest.mark.parametrize(
    "change",
    [{"email": "not-an-email"}, {"message": "short"}, {"message": "          x"}, {"name": ""}, {"name": "   "}],
)
def test_invalid_input_is_rejected(change, reset):
    r = client.post("/contact", json={**GOOD, **change})
    assert r.status_code == 422
    assert reset == []


def test_name_is_kept_on_one_line(reset):
    client.post("/contact", json={**GOOD, "name": "Ada\r\nBcc: evil@example.com"})
    assert reset[0][0] == "Ada Bcc: evil@example.com"


def test_honeypot_pretends_success_but_sends_nothing(reset):
    r = client.post("/contact", json={**GOOD, "website": "http://spam.example"})
    assert r.status_code == 202
    assert reset == []


def test_rate_limit_after_five_messages(reset):
    for _ in range(5):
        assert client.post("/contact", json=GOOD).status_code == 202
    r = client.post("/contact", json=GOOD)
    assert r.status_code == 429
    assert len(reset) == 5


def test_rate_limit_is_per_visitor(reset):
    for _ in range(5):
        client.post("/contact", json=GOOD, headers={"x-forwarded-for": "1.1.1.1"})
    assert client.post("/contact", json=GOOD, headers={"x-forwarded-for": "2.2.2.2"}).status_code == 202


def test_window_slides():
    for i in range(5):
        assert not main.rate_limited("9.9.9.9", now=float(i))
    assert main.rate_limited("9.9.9.9", now=10.0)
    assert not main.rate_limited("9.9.9.9", now=main.RATE_WINDOW + 5.0)


def test_unconfigured_email_returns_503(monkeypatch):
    monkeypatch.setattr(mailer, "send_contact_email", _raise(mailer.MailNotConfigured))
    assert client.post("/contact", json=GOOD).status_code == 503


def test_real_sender_needs_its_settings(monkeypatch):
    monkeypatch.delenv("RESEND_API_KEY", raising=False)
    monkeypatch.delenv("CONTACT_TO", raising=False)
    assert not mailer.is_configured()
    with pytest.raises(mailer.MailNotConfigured):
        REAL_SEND("Ada", "ada@example.com", "Hello there, nice site")


def test_resend_failure_returns_502(monkeypatch):
    monkeypatch.setattr(mailer, "send_contact_email", _raise(mailer.MailFailed("boom")))
    assert client.post("/contact", json=GOOD).status_code == 502


def test_cors_allows_only_the_site():
    ok = client.options("/contact", headers={"Origin": "https://portfolio-five-khaki.vercel.app", "Access-Control-Request-Method": "POST"})
    bad = client.options("/contact", headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"})
    assert ok.headers.get("access-control-allow-origin") == "https://portfolio-five-khaki.vercel.app"
    assert "access-control-allow-origin" not in bad.headers


def _raise(exc):
    def fn(*_args):
        raise exc

    return fn
