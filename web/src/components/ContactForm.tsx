"use client";

import { useRef, useState } from "react";
import { site } from "@/content/site";

type Status =
  | { kind: "idle" }
  | { kind: "sending"; slow: boolean }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const SLOW_AFTER_MS = 3000; // after this, explain the free server is waking up
const TIMEOUT_MS = 70000; // a cold start can take up to about a minute

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const woke = useRef(false);

  // The free server sleeps when idle. Wake it as soon as someone starts filling the form,
  // so it's usually awake by the time they click Send.
  function wakeServer() {
    if (woke.current) return;
    woke.current = true;
    fetch(`${site.apiUrl}/health`).catch(() => {});
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setStatus({ kind: "sending", slow: false });
    const slowTimer = setTimeout(() => setStatus({ kind: "sending", slow: true }), SLOW_AFTER_MS);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(`${site.apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      if (response.ok) {
        form.reset();
        setStatus({ kind: "sent" });
        return;
      }
      const body = await response.json().catch(() => null);
      const detail = typeof body?.detail === "string" ? body.detail : null;
      setStatus({
        kind: "error",
        message:
          response.status === 422
            ? "Check the form: a valid email address and a message of at least 10 characters are needed."
            : (detail ?? "Your message couldn't be sent. Try again in a minute."),
      });
    } catch {
      setStatus({
        kind: "error",
        message: "The server didn't answer. Check your connection and try again.",
      });
    } finally {
      clearTimeout(slowTimer);
      clearTimeout(timeout);
    }
  }

  const sending = status.kind === "sending";
  const field =
    "mt-2 w-full rounded-2xl border-2 border-ink/15 bg-white px-4 py-3 text-lg text-ink placeholder:text-ink/40 focus:border-ultra focus:outline-none";

  return (
    <form onSubmit={onSubmit} onFocus={wakeServer} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block font-bold">
          Your name
          <input name="name" required maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="block font-bold">
          Your email
          <input name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block font-bold">
        Message
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} className={field} />
      </label>

      {/* Honeypot: hidden from people and screen readers; bots that fill it are ignored by the server. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-ultra px-8 py-3.5 font-display text-lg font-bold text-paper transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send message"}
        </button>
        <p role="status" aria-live="polite" className="text-base">
          {status.kind === "sending" && status.slow &&
            "Sending… the server is waking up after a nap, this can take up to a minute."}
          {status.kind === "sent" && <span className="font-bold">Message sent. Thanks, I&rsquo;ll reply by email.</span>}
          {status.kind === "error" && <span className="font-bold text-[#8A0F3C]">{status.message}</span>}
        </p>
      </div>
    </form>
  );
}
