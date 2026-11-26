import smtplib

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
    monkeypatch.setattr(smtplib, "SMTP", FakeSMTP)
    monkeypatch.setattr(smtplib, "SMTP_SSL", FakeSMTP)
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
