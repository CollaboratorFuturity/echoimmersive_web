# Newsletters

Each newsletter issue is one HTML file in this folder. This is only the **body** of the
email — the API automatically appends a per-subscriber unsubscribe footer, so never add
your own unsubscribe link.

## Writing an issue

1. Copy `_template.html` to a new file, e.g. `2026-07-first-issue.html`.
2. Edit the content. Rules for email HTML:
   - Inline styles only (no `<style>` blocks, no external CSS) — most email clients strip them.
   - Absolute URLs for all links and images (`https://echoimmersive.eu/...`).
   - `{{first_name}}` anywhere in the body is replaced with the subscriber's first name
     (falls back to "there").
3. Do **not** include `<html>`, `<head>`, or `<body>` tags — just the content.

## Sending

Requires `ADMIN_API_KEY` in your environment (same value as the API's `.env`), and the API
running (`make build` for local, or target production with `API_URL`).

**Always test first** — sends only to you, no subscribers are emailed:

```sh
make newsletter-test FILE=newsletters/2026-07-first-issue.html \
  SUBJECT="Immersive ECHO — First newsletter" EMAIL=you@example.com
```

Then send for real to all active subscribers:

```sh
make newsletter-send FILE=newsletters/2026-07-first-issue.html \
  SUBJECT="Immersive ECHO — First newsletter"
```

To send from your machine against production, add `API_URL=https://echoimmersive.eu`.

The command prints a JSON summary: `{"mode": "live", "sent": 42, "failed": 0, "failures": []}`.
Any addresses in `failures` errored at the SMTP level — check `make api-logs` for details.

## Alternative: manual send via Gmail

For a quick manual send, export the active subscribers as CSV and email them yourself:

```sh
make newsletter-export API_URL=https://echoimmersive.eu
```

Put all addresses in **BCC** (never To/CC — that leaks every subscriber's email to everyone).
Caveats: Gmail has a ~500 recipients/day limit, there's no `{{first_name}}` personalisation,
and the automatic unsubscribe links don't work outside the API — include a line like
"Reply with 'unsubscribe' to stop receiving these" and manually mark anyone who does as
unsubscribed. Prefer `make newsletter-send` once the list grows.
