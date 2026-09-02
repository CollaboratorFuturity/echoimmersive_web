# Newsletters

Each newsletter issue is one HTML file in this folder. This is only the **body** of the
email — the API automatically appends a per-subscriber unsubscribe footer, so never add
your own unsubscribe link.

## Writing an issue

1. Copy `_template.html` to a new file, e.g. `2026-09-first-issue.html`.
2. Edit the content. Rules for email HTML:
   - Inline styles only (no `<style>` blocks, no external CSS) — most email clients strip them.
   - Absolute URLs for all links and images (`https://echoimmersive.eu/...`).
   - `{{first_name}}` anywhere in the body is replaced with the subscriber's first name
     (falls back to "there").
3. Unsubscribe link: if the issue contains `{{unsubscribe_url}}` (e.g. in its own designed
   footer, as `href="{{unsubscribe_url}}"`), each subscriber's personal link is substituted
   there. If not, a plain unsubscribe footer is appended automatically.
4. Fully designed issues (like `2026-09-first-issue.html`, generated from
   `Echo newsletter design 2/`) may be complete HTML documents with hosted image URLs.
   Simple text issues can be bare fragments like `_template.html`.
5. Newsletter images live in `public/img/newsletter/` so they're served at
   `https://echoimmersive.eu/img/newsletter/...` — deploying the frontend is what puts
   them online, so images must be deployed before sending.

## Sending

Requires `ADMIN_API_KEY` in your environment (same value as the API's `.env`), and the API
running (`make build` for local, or target production with `API_URL`).

**Always test first** — sends only to you, no subscribers are emailed:

```sh
make newsletter-test FILE=newsletters/2026-09-first-issue.html \
  SUBJECT="Immersive ECHO — First newsletter" EMAIL=you@example.com
```

Optionally do a real send to a single active subscriber first (their personal
unsubscribe link, but nobody else gets emailed):

```sh
make newsletter-send FILE=newsletters/2026-09-first-issue.html \
  SUBJECT="Immersive ECHO — First newsletter" ONLY=one@subscriber.com
```

Then send for real to all active subscribers:

```sh
make newsletter-send FILE=newsletters/2026-09-first-issue.html \
  SUBJECT="Immersive ECHO — First newsletter"
```

To send from your machine against production, add `API_URL=https://echoimmersive.eu`.

The command prints a JSON summary: `{"mode": "live", "sent": 42, "failed": 0, "failures": []}`.
Any addresses in `failures` errored at the SMTP level — check `make api-logs` for details.

## New subscribers get the current issue

Whoever subscribes receives two emails: the welcome email, then the **current issue**
(with their personal unsubscribe link). The current issue updates automatically on every
full `newsletter-send` (test and `ONLY=` sends don't touch it). To set it manually —
e.g. for an issue that already went out before this feature, or to correct it:

```sh
make newsletter-set-current FILE=newsletters/2026-09-first-issue.html \
  SUBJECT="Introducing ECHO — Newsletter No. 1" API_URL=https://echoimmersive.eu
```

To check what's stored: `curl -sS "$API_URL/api/v1/admin/newsletter/current" -H "X-API-Key: $ADMIN_API_KEY"`
(returns subject + last-updated, 404 if none stored).

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
