import pytest
from fastapi.testclient import TestClient

from app import mailer, main

client = TestClient(main.app)
REAL_SEND = mailer.send_contact_email  # saved before the fixture replaces it
GOOD = {"name": "Ada Lovelace", "email": "ada@example.com", "message": "Hello, I liked your projects!"}


@pytest.fixture(autouse=True)
def reset(monkeypatch):
    main._hits.clear()
    main._global.clear()
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


def test_faked_forwarded_for_entries_dont_bypass_the_limit(reset):
    # The client can put anything first; Render's proxy appends the real IP (9.9.9.9) last.
    for i in range(5):
        client.post("/contact", json=GOOD, headers={"x-forwarded-for": f"10.0.0.{i}, 9.9.9.9"})
    r = client.post("/contact", json=GOOD, headers={"x-forwarded-for": "10.0.0.99, 9.9.9.9"})
    assert r.status_code == 429


def test_addresses_in_the_same_network_share_a_limit(reset):
    for i in range(5):
        client.post("/contact", json=GOOD, headers={"x-forwarded-for": f"5.6.7.{i}"})
    assert client.post("/contact", json=GOOD, headers={"x-forwarded-for": "5.6.7.200"}).status_code == 429
    assert client.post("/contact", json=GOOD, headers={"x-forwarded-for": "5.6.8.1"}).status_code == 202
    assert main.visitor_key("2001:db8::1") == main.visitor_key("2001:db8::ffff")


def test_failed_sends_still_count_so_retries_stay_limited(monkeypatch):
    monkeypatch.setattr(mailer, "send_contact_email", _raise(mailer.MailFailed("timeout")))
    for _ in range(5):
        assert client.post("/contact", json=GOOD).status_code == 502
    assert client.post("/contact", json=GOOD).status_code == 429


def test_unconfigured_email_gives_the_slot_back(monkeypatch):
    monkeypatch.setattr(mailer, "send_contact_email", _raise(mailer.MailNotConfigured))
    for _ in range(10):
        assert client.post("/contact", json=GOOD).status_code == 503
    assert not main._global and not any(main._hits.values())


def test_parallel_requests_cannot_exceed_the_limit(monkeypatch):
    import threading
    import time as t

    def slow_send(*_args):
        t.sleep(0.2)  # like a real email API call

    monkeypatch.setattr(mailer, "send_contact_email", slow_send)
    codes = []
    threads = [threading.Thread(target=lambda: codes.append(client.post("/contact", json=GOOD).status_code)) for _ in range(12)]
    for th in threads:
        th.start()
    for th in threads:
        th.join()
    assert codes.count(202) == main.RATE_LIMIT
    assert codes.count(429) == 12 - main.RATE_LIMIT


def test_global_limit_across_all_visitors():
    for i in range(main.GLOBAL_LIMIT):
        assert not main.rate_limited(f"ip-{i}", now=float(i))
    assert main.rate_limited("someone-new", now=100.0)
    assert not main.rate_limited("someone-new", now=main.GLOBAL_WINDOW + 200.0)


def test_memory_is_bounded(monkeypatch):
    monkeypatch.setattr(main, "MAX_TRACKED", 50)
    for i in range(500):
        main.rate_limited(f"ip-{i}", now=0.0)
        main._global.clear()  # only test the per-visitor table here
    assert len(main._hits) <= 50


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
