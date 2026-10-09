# Internationalisation (i18n) — Deployment & Maintenance

**Status:** Foundation shipped 2026-10-09. Machinery + routing + shared shell (Header/Footer) translated; **English is the only populated language**, the other 9 fall back to English until their files are filled.

**Commitment:** 10 EU languages for public-facing content (ECHO TRD constraint C7): English, French, German, Spanish, Italian, Dutch, Swedish, Danish, Slovenian, Romanian.

---

## Stack

| Piece | Package | Role |
|-------|---------|------|
| Core | `i18next` | translation engine |
| React binding | `react-i18next` | `useTranslation()` hook, `<Trans>` |
| Loader | `i18next-http-backend` | lazy-loads `/locales/{lng}/translation.json` at runtime |
| Detector | `i18next-browser-languagedetector` | seeds the `/` redirect (path → localStorage → navigator) |

Same stack as the ECHOsystem internal platform, intentionally, so the two codebases stay consistent.

Config lives in **`src/i18n.ts`** (supported languages, default/fallback `en`, `localizePath()` helper). Initialised in `src/main.tsx` before the app renders, wrapped in `<Suspense>` so no raw keys flash before a language file loads.

---

## How it works

### URL structure (path-prefix)
Every page lives under a language segment:

```
/en            /sv            /de   …
/en/about      /sv/about
/en/contact    /sv/contact
```

- `/` → redirects to the detected-or-default language (`<Navigate>` in `App.tsx`).
- A first segment that isn't a supported language (e.g. an old link `/about`) → redirected to `/en/about`. So existing inbound links keep working.
- Unknown sub-path under a valid language → that language's home.

This is handled by `LangRoutes` in `src/App.tsx`: it validates the `:lang` param, calls `i18n.changeLanguage(lang)`, and renders the page routes **relative** to the prefix.

### Per-route metadata
`PageMeta` in `App.tsx` keeps three things in sync with the route on every navigation:
- `document.title` (per-section — closes WCAG 2.4.2),
- `<html lang>` (correct language for screen readers — WCAG 3.1.1),
- `hreflang` alternate `<link>` tags for all 10 languages + `x-default`.

> **SEO caveat:** `hreflang` is injected at runtime (this is a client-rendered SPA). Google renders JS so it will see them, but the robust long-term answer is a prerender step or a static `sitemap.xml` with `<xhtml:link rel="alternate" hreflang>` entries. Not required for launch; note it if SEO becomes a priority.

### Language switcher
`src/components/LanguageSwitcher/LanguageSwitcher.tsx` — a native `<select>` (most accessible option). Switching swaps the language segment of the current path and navigates, so the user stays on the same page in the new language. Rendered in the header.

### Using translations in a component
```tsx
import { useTranslation } from 'react-i18next'
import { localizePath } from '@/i18n'

function Example() {
  const { t, i18n } = useTranslation()
  const lp = (p: string) => localizePath(i18n.language, p)
  return (
    <>
      <h1>{t('home.title')}</h1>
      <Link to={lp('/contact')}>{t('nav.contact')}</Link>
    </>
  )
}
```
- **All visible strings** go through `t('some.key')`.
- **All internal links** go through `localizePath(i18n.language, '/path')` (or the `lp` shorthand) so navigation stays in-language. Never hardcode `to="/about"`.
- Interpolation: `t('footer.rights', { year: 2026 })` with `"© {{year}} …"` in the JSON.

---

## Translation files

One JSON file per language: `public/locales/{lng}/translation.json`. Keys are nested (`nav.*`, `footer.*`, `home.*`, …). English (`public/locales/en/translation.json`) is the source of truth and the fallback — **every key must exist in `en` first**. Any key missing from another language automatically renders the English value.

### Adding / translating a language
1. Open `public/locales/{lng}/translation.json` (it already exists as `{}`).
2. Copy the structure from `en/translation.json` and translate the values (keep the keys identical).
3. Save, restart `make dev` (or hard-refresh) and switch to that language to verify.
4. Partial is fine — untranslated keys fall back to English, so you can ship incrementally.

No code changes are needed to add a language's content — it's data only. (Adding an entirely new *language code* beyond the 10 means also adding it to `SUPPORTED_LANGUAGES` in `src/i18n.ts`.)

---

## Production (Docker)

No special steps — a normal rebuild picks everything up:

```
sudo docker compose up -d --build
```

- The Docker build stage runs `npm ci` (installs the i18next deps from `package-lock.json`) then `npm run build` (`tsc -b && vite build`).
- Vite copies `public/locales/**` into `dist/`, so the JSON ships as static files served by nginx.
- `nginx.conf`'s SPA fallback (`try_files $uri $uri/ /index.html`) serves the client-side `/:lang/*` routes, so deep links and refreshes on e.g. `/sv/about` don't 404. The locale JSON is a real file, matched by `try_files $uri` before the fallback.

**Prerequisite:** the changed files (`package.json`, `package-lock.json`, `src/**`, `public/locales/**`) must be deployed to the server before the build, or `npm ci` will fail on a lockfile mismatch.

---

## Newsletter (multilingual, block-based) — BUILT (2026-10-09)

Each newsletter issue is a **block document** that is the single source of truth, rendered two ways: the web article (React) and the email (HTML). One content source → web + email, so they never diverge. Full issues are multilingual via the same per-language-file mechanism as the rest of the site.

**Content model.** An issue = header (id, kicker, date, subject, preheader, title, lead) + an ordered `blocks[]` array. Block types (`src/components/newsletter/blocks.ts`): `sectionLabel`, `divider`, `paragraph`, `heading`, `figure`, `pullQuote`, `callout`, `button`. Renderers ignore unknown types, so new block types can be added later without breaking old issues. Content lives per language at `public/locales/{lng}/newsletters/{id}.json`, loaded with English fallback.

**Web.** `src/pages/news/NewsletterIssue.tsx` loads the active language's block document (`useNewsletterIssue`) and renders blocks via `src/components/newsletter/NewsletterBlocks.tsx`. Routed at `/:lang/news/newsletter-1` (the old hand-coded `Newsletter01.tsx` is retired). Internal links in blocks (e.g. the Subscribe button's `/en/newsletter`) are localized per issue file.

**Email.** `src/newsletter-email/renderEmail.ts` renders the same blocks into email-safe HTML (600px column, inline styles, hex colours, bulletproof buttons, absolutised image/link URLs, hidden preheader). It keeps the `{{unsubscribe_url}}` token so the existing send pipeline injects each subscriber's personal link. Build: `npm run newsletter:build-emails -- <id>` (Node 22.6+ strip-types) → `newsletters/build/<id>/{lng}.html` for every translated language.

**Backend (per-language, create_all pattern — no Alembic).**
- `newsletter_issue_by_lang` table (PK = language) holds the current issue per language; legacy single-row `newsletter_current_issue` kept as an English fallback. (`api/app/models/newsletter.py`)
- `store_issue_for_language` / `get_issue_for_language` (exact → English → legacy) in `api/app/services/newsletter_content.py`.
- `POST /admin/newsletter/current` takes `language` (default `en`); `GET` takes `?language=`.
- `POST /admin/newsletter/send` (live) sends each active subscriber their language's stored issue, English fallback, issue lookups cached per language; subjects per language; test/`only_email` preview paths unchanged.
- Welcome email localized via `render_welcome` (English + Spanish populated, others fall back).

**Operator flow** (`make`): `newsletter-build ID=newsletter-1` → `newsletter-upload ID=newsletter-1` (uploads every translated language's HTML + subject via `/current`) → `newsletter-test` (preview to one address) → `newsletter-send` (grouped live send; `ONLY=` for one subscriber). `scripts/upload-newsletter-issues.py` does the per-language upload.

**Translation of an issue.** Author the block file in English, then copy to `public/locales/{lng}/newsletters/{id}.json` and translate the block text values (auto-translate + native review — same pipeline as the UI strings). Partial is fine: untranslated languages fall back to English on both web and email.

---

## Files touched by the foundation
- `src/i18n.ts` (new) — config + `localizePath`, `SUPPORTED_LANGUAGES`, `LANGUAGE_NAMES`
- `src/main.tsx` — import `./i18n`, Suspense boundary
- `src/App.tsx` — `/:lang` routing, `LangRoutes`, `PageMeta` (title/lang/hreflang)
- `src/components/LanguageSwitcher/LanguageSwitcher.tsx` (new)
- `src/components/Header/Header.tsx`, `src/components/Footer/Footer.tsx` — translated + language-aware links
- `public/locales/{en + 9}/translation.json` (new)
- `package.json` / `package-lock.json` — 4 new deps
