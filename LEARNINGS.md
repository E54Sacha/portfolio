# What I learned building portfolio

## 2026-11-27

- **Bug:** the contact form couldn't send email from Render → the free plan blocks outgoing SMTP ports (25/465/587); the IPv6 "Network is unreachable" error was only a first symptom → send through Resend, an HTTPS email API.
- **Bug:** the API worked with curl but the form would have failed → `ALLOWED_ORIGINS` had the wrong Vercel address, and the browser enforces CORS → use the exact site origin, and test it.
- **Concept:** rate limiting: limit messages per visitor (grouped by network, real IP = the last `X-Forwarded-For` entry), cap the memory used, and check-and-count under a lock so parallel requests can't slip through.
- **Concept:** static sites and i18n: one prebuilt page per language (`/en`, `/fr`); a small proxy picks the language from a cookie or the `Accept-Language` header; hreflang links need full URLs for SEO.
- **Concept:** dark mode without a flash: a tiny script in `<head>` adds the `dark` class before the page is painted; the toggle saves the choice in `localStorage`.
- **Decision:** no phone number or date of birth in the public CV, and git history rewritten to the GitHub noreply email before making repos public, because anything public gets scraped.
