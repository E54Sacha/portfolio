# Portfolio: Requirements

> A personal website that presents my projects, my CV and a way to contact me, built with Next.js and a small FastAPI backend.

**Time budget:** 3 days × 8 hours/day = 24 hours total · **Written:** 2026-11-26

## Goal and audience

- **Problem:** recruiters need one place to see my projects, my CV and how to reach me, instead of scattered GitHub repos.
- **For whom:** recruiters and hiring managers for internships / junior roles, and other developers.
- **Why build it:** portfolio piece (every other project links back here) and learning goal (Next.js, REST API, deployment).

## Must-have (v1)

| # | Feature | Estimate |
|---|---|---|
| 1 | A visitor can browse my projects as cards (pitch, visual, 1-2 metrics, tech badges, links), with claude-dev-toolkit as the first real card and "coming soon" cards for the next projects; cards come from one data file so adding a project is easy | 4 h |
| 2 | A visitor can send me a message through a contact form: FastAPI endpoint with validation and anti-spam (honeypot + rate limit), delivered to my inbox with Resend, and a clear "sending, the server is waking up…" state | 5 h |
| 3 | A visitor can read a short About section, follow my GitHub and LinkedIn, and download my CV as a PDF | 2 h |
| 4 | A visitor can read a "How this site is built" page with the architecture diagram and the stack | 2 h |
| 5 | The site has a clean, distinctive design (layout, navigation, responsive on phone and desktop), with dark mode and subtle animations | 3 h + 3 h |
| 6 | A visitor can read the whole site in English or French (/en and /fr, browser language by default, EN/FR switch remembered), added on Day 2 | 2 h |
| | Setup, deployment, Lighthouse fixes (+20%) | 4 h |
| | **Total** | **25 h** / 24 h budget (animations trimmed if needed) |

## Nice-to-have (v1.1+)

- README written with `write-readme` and a demo GIF: not in the definition of done for v1, do it right after.
- Tests for the FastAPI endpoint and a GitHub Actions CI run: worth adding once the site is live.
- Own domain name with HTTPS (DNS records, TLS): skipped for v1 to keep it free; good learning for later.
- `add-project-to-portfolio` skill that writes a project card from a repo: useful once 2-3 more projects exist.

## Out of scope

- CMS or admin panel: one data file is enough for a handful of projects.
- User accounts or login: visitors only read and send a message.
- Blog: tempting, but it's a separate project.
- Paid hosting or a paid email service: everything stays on free tiers.

## Tech stack

| Part | Choice | Why |
|---|---|---|
| Frontend | Next.js + TypeScript | The main skills recruiters search for; static pages are fast for Lighthouse |
| Styling | CSS modules or Tailwind, with the `frontend-design` plugin | Distinctive look without a generic template |
| Backend | FastAPI (Python) | Small REST endpoint for the contact form; shows a second language and an API |
| Email | Resend (free tier) | One API call, 3,000 emails/month free, sends to my own address without a domain |
| Hosting | Vercel (frontend) + Render free tier (FastAPI) | Free; Render sleeps when idle, handled by the "waking up" state |
| Checks | Lighthouse, Playwright MCP screenshots | Proof metric (95+) and visual checks on phone and desktop |

## Day-by-day plan

Each day ends on something you can demo.

### Day 1: Site shell and projects
- [x] Create the Next.js + TypeScript app, layout, navigation, base design (with `frontend-design`)
- [x] Projects data file + project cards grid (toolkit card + 2-3 "coming soon" cards)
- [x] Deploy to Vercel: https://portfolio-five-khaki.vercel.app
- **Demo at the end of the day:** a live URL showing the home page and the projects grid on phone and desktop.

### Day 2: Contact form and backend
- [x] FastAPI app with a `POST /contact` endpoint: validation, honeypot field, rate limit
- [ ] Send the message with Resend (API key as a Render secret)
- [x] English / French versions with a language switch (scope added)
- [x] Deploy to Render (https://portfolio-api-1lil.onrender.com); connect the form, with the "sending, the server is waking up…" state and success / error messages
- **Demo at the end of the day:** sending the form on the live site delivers an email to my inbox.

### Day 3: About, "How it's built", polish
- [ ] About section, GitHub / LinkedIn links, CV PDF download
- [ ] "How this site is built" page with the architecture diagram
- [ ] Dark mode and subtle animations
- [ ] Lighthouse pass: fix performance, accessibility and SEO until each is 95+
- **Demo at the end of the day:** the full site live, Lighthouse report at 95+.

## Definition of done

Every item must be testable by someone else.

- [ ] The site is live on a public Vercel URL and works on a phone and a desktop browser.
- [ ] Sending the contact form on the live site delivers the message to my inbox (also after the backend has been asleep).
- [ ] The projects grid, About section, CV download and "How this site is built" page are all reachable from the navigation.
- [ ] Lighthouse scores 95 or more for performance, accessibility and SEO on the home page.

## Risks

| Risk | What to do if it happens |
|---|---|
| Two stacks (Next.js + FastAPI) slow me down | Keep FastAPI to one endpoint; ask the `tutor` for a lesson when stuck instead of guessing |
| Render cold start (30-50 s) makes the form look broken | The "waking up" message; if it's still bad, move the endpoint to a Vercel function and keep FastAPI for later |
| Resend setup or limits block sending | Fall back to logging messages on the server and showing a success message; fix email delivery after |
| Lighthouse below 95 because of images or fonts | Use Next.js `Image`, system fonts or `next/font`, lazy-load the visuals |
| No bio or photo ready | Use clear placeholders; write the 2-3 line bio before Day 3 ends |
