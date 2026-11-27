import socket

import pytest

from app import mailer

ENV = ["RESEND_API_KEY", "CONTACT_TO", "CONTACT_FROM", "SMTP_USER", "SMTP_PASSWORD", "SMTP_HOST", "SMTP_PORT"]


@pytest.fixture(autouse=True)
def clean_env(monkeypatch):
    for key in ENV:
        monkeypatch.delenv(key, raising=False)


class FakeSMTP:
    """Records what would be sent, instead of talking to a real mail server."""

    sent: list = []
    fail_with: Exception | None = None

    def __init__(self, host, port, timeout=None, context=None):
        self.host, self.port = host, port

    def __enter__(self):
        if FakeSMTP.fail_with:
            raise FakeSMTP.fail_with
        return self

    def __exit__(self, *exc):
        return False

    def starttls(self, context=None):
        self.tls = True

    def login(self, user, password):
        self.login_as = (user, password)

    def send_message(self, msg):
        FakeSMTP.sent.append((self.host, self.port, self.login_as, msg))


@pytest.fixture
def fake_smtp(monkeypatch):
    FakeSMTP.sent, FakeSMTP.fail_with = [], None
    monkeypatch.setattr(mailer, "SMTP4", FakeSMTP)
    monkeypatch.setattr(mailer, "SMTP4_SSL", FakeSMTP)
    return FakeSMTP


def test_nothing_configured():
    assert mailer.method() is None
    with pytest.raises(mailer.MailNotConfigured):
        mailer.send_contact_email("Ada", "ada@example.com", "Hello there, nice site")


def test_gmail_smtp_sends_to_yourself_with_reply_to_the_visitor(monkeypatch, fake_smtp):
    monkeypatch.setenv("SMTP_USER", "me@gmail.com")
    monkeypatch.setenv("SMTP_PASSWORD", "app-password")
    assert mailer.method() == "smtp"
    mailer.send_contact_email("Ada", "ada@example.com", "Hello there, nice site")
    host, port, login, msg = fake_smtp.sent[0]
    assert (host, port) == ("smtp.gmail.com", 587)
    assert login == ("me@gmail.com", "app-password")
    assert msg["To"] == "me@gmail.com" and msg["From"] == "me@gmail.com"
    assert msg["Reply-To"] == "ada@example.com"
    assert "Hello there, nice site" in msg.get_content()


def test_smtp_errors_become_mail_failed(monkeypatch, fake_smtp):
    monkeypatch.setenv("SMTP_USER", "me@gmail.com")
    monkeypatch.setenv("SMTP_PASSWORD", "wrong")
    fake_smtp.fail_with = TimeoutError("port blocked")
    with pytest.raises(mailer.MailFailed, match="TimeoutError"):
        mailer.send_contact_email("Ada", "ada@example.com", "Hello there, nice site")


def test_resend_is_used_when_its_key_is_set(monkeypatch, fake_smtp):
    monkeypatch.setenv("SMTP_USER", "me@gmail.com")
    monkeypatch.setenv("SMTP_PASSWORD", "app-password")
    monkeypatch.setenv("RESEND_API_KEY", "re_x")
    monkeypatch.setenv("CONTACT_TO", "me@gmail.com")
    assert mailer.method() == "resend"


def test_resend_sends_to_you_and_explains_refusals(monkeypatch):
    import httpx

    monkeypatch.setenv("RESEND_API_KEY", "re_x")
    monkeypatch.setenv("CONTACT_TO", "me@gmail.com")
    calls = []

    def fake_post(url, json, headers, timeout):
        calls.append(json)
        return httpx.Response(calls_status.pop(0), text='{"message":"only your own address"}')

    calls_status = [200, 403]
    monkeypatch.setattr(mailer.httpx, "post", fake_post)
    mailer.send_contact_email("Ada", "ada@example.com", "Hello there, nice site")
    assert calls[0]["to"] == ["me@gmail.com"] and calls[0]["reply_to"] == "ada@example.com"
    with pytest.raises(mailer.MailFailed, match="403.*only your own address"):
        mailer.send_contact_email("Ada", "ada@example.com", "Hello there, nice site")


def test_connect_ipv4_asks_only_for_ipv4_addresses(monkeypatch):
    asked = {}

    def fake_getaddrinfo(host, port, family, type_):
        asked["family"] = family
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("142.250.1.108", port))]

    monkeypatch.setattr(socket, "getaddrinfo", fake_getaddrinfo)
    monkeypatch.setattr(socket, "create_connection", lambda addr, timeout, src: ("connected", addr))
    assert mailer.connect_ipv4("smtp.gmail.com", 587, 5) == ("connected", ("142.250.1.108", 587))
    assert asked["family"] == socket.AF_INET
