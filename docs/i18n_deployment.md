# Internationalisation (i18n) — Deployment & Maintenance

**Status (audited 2026-10-16):** all 11 non-English languages (`fr de es it nl sv da sl ro fi uk`) have fully populated `translation.json` files — see [Translation files — shape & status](#translation-files--shape--status). Machinery, routing and the shared shell shipped 2026-10-09; Finnish and Ukrainian were added 2026-10-13. All translations are AI-drafted and **still need native-speaker review**; the public picker is live but offers only `en` and `es` (the reviewed ones).

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

### Public picker & review mode (`SHOW_LANGUAGE_SWITCHER` in `src/i18n.ts`)
**Live since 2026-10-16: `SHOW_LANGUAGE_SWITCHER = true`, `AVAILABLE_LANGUAGES = ['en', 'es']`** (the only human-reviewed languages).
- the **header language picker is shown** and lists only `AVAILABLE_LANGUAGES`;
- `/` goes to the visitor's remembered/browser language **if it is available**, otherwise English (a French browser gets `/en`, not unreviewed `/fr`);
- `hreflang` is advertised for `AVAILABLE_LANGUAGES` + `x-default`;
- **unreviewed languages stay URL-only**: `/fr/`, `/sv/`, `/de/`, … (any page, e.g. `/fr/about`, `/fr/news/newsletter-1`) still open for reviewers but carry `<meta name="robots" content="noindex, nofollow">` and are never auto-selected (a request to search engines, not access control);
- the **subscribe form's "Preferred language" picker** also offers `AVAILABLE_LANGUAGES` (en, es); the API still accepts all codes and existing subscribers keep theirs;
- `/locales/*` is served `no-cache` (see `nginx.conf`), so a corrected translation shows on the next load.
**Full review mode** (picker hidden, `/` always English, no hreflang, all non-English `noindex`): set `SHOW_LANGUAGE_SWITCHER = false`.
**To launch another language** after native review: add its code to `AVAILABLE_LANGUAGES` — it then appears in the picker, subscribe form and hreflang, and loses `noindex`. Rebuild, deploy.

### Which languages are offered (`AVAILABLE_LANGUAGES`)
`src/i18n.ts` has two lists. `SUPPORTED_LANGUAGES` is all 10 codes: every one routes (`/sv/about` works, falling back to English text) so a translation can be previewed by URL while it's being written. `AVAILABLE_LANGUAGES` (currently `en`, `es` — the human-reviewed ones; the other ten files are populated but held back for native review) is what visitors are *offered*: the header switcher, the newsletter form's "Preferred language" picker and the `hreflang` tags use only this list. **To launch a language, finish its files, then add its code to `AVAILABLE_LANGUAGES`.** The newsletter API still accepts all 10 codes.

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

## Translation files — shape & status

One JSON file per language: `public/locales/{lng}/translation.json`, lazy-loaded by `i18next-http-backend`. 2-space indent, UTF-8 (no `\uXXXX` escapes), trailing newline, nested keys.

### Two layers of keys
| Layer | Keys | In `en` file? | Where the English lives |
|-------|------|---------------|-------------------------|
| **UI chrome** | `home about experiences newsletter newsletterEmail underConstruction resources.* (chrome) news contact faq partners nav footer` — **231 leaves** | Yes — `en` is the source of truth | `en/translation.json` |
| **Grant data bodies** | `timeline.*` (124 leaves) and `resources.{wp,task,taskGroup,ms,d,dStatus,event}.*` (217 leaves) — **341 leaves** | **No** | In code, as the default argument: `t('resources.wp.WP1.title', wp.title)`, `t('timeline.heading', 'Thirty months, in public.')` (`src/pages/Resources.tsx`, `src/components/ProjectTimeline/ProjectTimeline.tsx`) |

So every non-English file has 231 + 341 = **572 leaves**, but `en` has only 231. That is **expected, not drift**: English grant data stays in code and is only keyed per language. (It does break the older rule "every key must exist in `en` first" for this layer — when you add a new milestone/deliverable/event, add its keys to every language file; `en` needs nothing.)

### Audit results (2026-10-16, script compares every file to `en` and to `es`)
| Lang | Leaves | Missing vs `en` | Extra vs `en` | Placeholder / tag mismatches | Empty | Notes |
|------|-------:|---:|---:|---:|---:|-------|
| en | 231 | – | – | – | 0 | source of truth |
| es, fr, de, it, nl, sv, da, ro, fi | 572 | 0 | 341 | 0 | 0 | exact key parity with each other |
| sl | 574 | 0 | 343 | 0 | 0 | +2 plural keys (`tasksCount_two`, `_few`) |
| uk | 574 | 0 | 343 | 0 | 0 | +2 plural keys (`tasksCount_few`, `_many`) |

- **Parity:** after stripping plural suffixes, all 11 languages have the identical key set. No missing keys, no empty values, no type mismatches (string/array), no `{{interpolation}}` or inline-tag differences vs `en`.
- **Order:** `en` keys appear in the same order in every file. `sl` and `uk` differ from `es` only by where their extra plural keys sit.
- **Strings identical to English** (5–13 per language) are legitimate: brand/place/partner names (`home.hero.titleLine1/2`, `about.details.gaValue`, `coordinatorValue`, image alts that are proper names), and cognates ("Newsletter", "Partners", "Contact", "Home", "Photos", "Organisation"). The `fr`/`de`/`it`/`nl` ones are the most numerous. `resources.event.E4.name` / `timeline.items.e4.title` are an event proper name, same everywhere. Worth a native glance, not a bug.
- **No length outliers** (no value is >2.2× or <0.4× its English length).

### Plural forms
`resources.tasksCount` is the only pluralised key. `en`, `es`, `fr`, `de`, `it`, `nl`, `sv`, `da`, `ro`, `fi` use `_one` + `_other`. Slovenian uses `_one/_two/_few/_other`; Ukrainian uses `_one/_few/_many/_other` (i18next picks the CLDR category per language; with only `_one/_other` counts like 2 or 5 would fall back to English text).

### Newsletters (`public/locales/{lng}/newsletters/newsletter-1.json`)
Only **`en`, `es`, `sv`** exist on disk. Every other language falls back to the English issue, per the 2026-10-15 decision not to translate newsletters per language. Shape: header keys `id kicker date subject preheader title lead` + `blocks[]`. `en` and `es` have 44 blocks with identical block types and keys; `sv` has 46 (consortium-supplied copy that differs from the English edition). `translation.json` still carries `newsletterEmail.{unsubscribe,footer}` in every language, so the email chrome (unsubscribe link, footer) is localised even when the body falls back to English.
> ⚠️ **Discrepancy:** `docs/TODO.md` says `fr` and `it` newsletter files exist ("translated earlier"). They are **not** in the working tree or in `git ls-files` — only `en/es/sv` are. Either they were never committed/were deleted, or the TODO is stale. Needs a decision.

### Other per-language content
- **About chart** — `public/charts/echo-dual-track.html` carries a `STRINGS` block for all 12 languages (`en es sv fr it de fi ro nl da sl uk`), selected via `?lang=`.
- **Languages offered** — `AVAILABLE_LANGUAGES` in `src/i18n.ts` is currently `en es`; the other ten are routable by URL for review but not offered in pickers/hreflang and are `noindex`.
- **Backend** — welcome email and unsubscribe page are localised for `en`/`es` only; other languages fall back to English.

### Adding a new key (UI chrome)
1. Add it to `en/translation.json` first.
2. Add the same key (same nesting, same `{{placeholders}}`) to all 11 other files — a missing key silently renders English.
3. Re-run the parity check (below).

### Adding / translating a new language
1. Add the code to `SUPPORTED_LANGUAGES` + `LANGUAGE_NAMES` in `src/i18n.ts` (not needed for the 12 already registered).
2. Create `public/locales/{lng}/translation.json`. Copy **a finished language file (e.g. `es`), not `en`** — `es` already contains the grant-data layer that `en` lacks. Translate values; keep keys identical.
3. If the language has plural categories beyond one/other (Slavic, Slovenian, Arabic, …), add the extra `tasksCount_*` forms.
4. Add a `STRINGS` block to `public/charts/echo-dual-track.html`.
5. Run the parity check, hard-refresh `/{lng}/…`, then add to `AVAILABLE_LANGUAGES` when reviewed.
Partial files are fine — untranslated keys fall back to English.

### Parity check (re-runnable)
```python
# python3 -I check_locales.py  (run from repo root)
import json, os, re
base = 'public/locales'
def flat(o, p=''):
    r = {}
    if isinstance(o, dict):
        for k, v in o.items(): r.update(flat(v, f'{p}.{k}' if p else k))
    elif isinstance(o, list):
        for i, v in enumerate(o): r.update(flat(v, f'{p}[{i}]'))
    else: r[p] = o
    return r
strip = lambda k: re.sub(r'_(zero|one|two|few|many|other)$', '', k)
ph = lambda s: sorted(re.findall(r'\{\{[^}]+\}\}|</?\w+[^>]*>', s)) if isinstance(s, str) else []
L = {l: flat(json.load(open(f'{base}/{l}/translation.json', encoding='utf-8'))) for l in sorted(os.listdir(base))}
en = L['en']; ref = {strip(k) for k in L['es']}
for l, d in L.items():
    miss = [k for k in en if k not in d]                       # must be empty
    skew = ref ^ {strip(k) for k in d} if l != 'en' else set() # grant-data layer must match es
    bad  = [k for k in en if k in d and ph(en[k]) != ph(d[k])] # placeholders/tags
    empty = [k for k in d if d[k] in ('', None)]
    print(l, len(d), 'missing', len(miss), 'skew', len(skew), 'placeholder', len(bad), 'empty', len(empty))
```
Expected: `missing 0 skew 0 placeholder 0 empty 0` for every language (`en` shows `skew 0` by construction).

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
- `public/locales/{lng}/translation.json` (new; all 12 populated as of 2026-10-16)
- `package.json` / `package-lock.json` — 4 new deps
