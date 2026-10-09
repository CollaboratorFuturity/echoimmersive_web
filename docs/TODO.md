# TODO - Tasks & Known Issues

> Small tasks, bugs, and improvements that shouldn't derail the main work.

Memory is fragile. AI context gets compressed at unpredictable intervals. If you spot something that needs fixing but it's not the current priority, drop it here immediately. Otherwise it will be forgotten during the next context compression.

---

## Pending

### i18n / translations

> Foundation shipped 2026-10-09 (react-i18next, `/:lang` routing, translated Header/Footer, EN populated, 9 stubs falling back to EN). Full setup + "how to add a language" in `docs/i18n_deployment.md`. Order of work: (1) extract all page bodies into `en` so there's a complete English source, (2) translate each language file, (3) newsletter language workstream.

- [x] **[i18n] Extract page bodies into `en`** ✅ DONE (2026-10-09) — All production pages converted to `t()` keys with internal links via `localizePath()`: Home, About, Partners, Experiences (+ Snapsting, Pavillon), News (+ Launch), FAQ, Contact, Resources (UI chrome only — grant data stays literal), Newsletter, UnderConstruction. `public/locales/en/translation.json` is now the complete English source (12 namespaces). Two deliberate deferrals below.
- [x] **[i18n] Newsletter issue → block document** ✅ DONE (2026-10-09) — Issue No. 1 is now a block document (`public/locales/en/newsletters/newsletter-1.json`) rendered to both web (`NewsletterIssue.tsx`) and email (`renderEmail.ts`). `Newsletter01.tsx` retired. Per-language: drop `public/locales/{lng}/newsletters/newsletter-1.json` to localize. See `docs/i18n_deployment.md`. (Note: inline links inside paragraphs aren't a block type yet — the mid-text "Subscribe"/Instagram links became a button/plain text. Add a rich-paragraph block if inline links are needed.)
- [ ] **[i18n] Translate Issue No. 1** — `es` DONE (2026-10-09): `public/locales/es/newsletters/newsletter-1.json` (44 blocks, parity with `en`, button href localized to `/es/newsletter`). Remaining 8 languages: add `public/locales/{lng}/newsletters/newsletter-1.json`, then `make newsletter-build ID=newsletter-1` + `newsletter-upload` makes it available on the page and in the email for that language.
- [ ] **[i18n] Minor literals still English** — launch gallery alt text in `src/data/galleries.ts` (shared data module), the `d.status` custom text on deliverables (e.g. "You are here!"), and `dueLabel()` month abbreviations (hardcoded `'en'` locale in `Resources.tsx`). Low priority; key/localise if needed.
- [ ] **[i18n] Translate — Swedish (`sv`)** -- Fill `public/locales/sv/translation.json`. First language scheduled; copy exists for the newsletter, site copy still needed.
- [ ] **[i18n] Translate — French (`fr`)** -- Fill `public/locales/fr/translation.json`.
- [ ] **[i18n] Translate — German (`de`)** -- Fill `public/locales/de/translation.json`.
- [x] **[i18n] Translate — Spanish (`es`)** ✅ DONE (2026-10-09) — `public/locales/es/translation.json` fully populated. UI chrome at parity with `en`; **plus all grant-data bodies now translated** (previously left literal): the home-page Timeline (`timeline.*` — eyebrow/heading/lede, type labels, stats, index + status chips, locale-aware month/date rendering via Intl, and all 46 milestone/deliverable/event titles + descriptions + event tags), the Resources page grant data (`resources.wp/task/taskGroup/ms/d/event.*` — 5 WPs with objectives, 27 tasks, 20 milestones, 20 deliverables, 21 events; codes/leads/type/level/dates kept literal), and the About dual-track chart (`public/charts/echo-dual-track.html` now reads `?lang=` and carries en+es strings). All via the `t(key, englishDefault)` pattern so English stays in-code and only `es` keys were added (hence `es` has more keys than `en` — expected). Verified: `tsc -b` clean, JSON valid, 0 placeholder mismatches, every rendered id/code resolves to an `es` key. AI-translated (European Spanish; "Europa Creativa", place-name exonyms, brand/partner names kept); **needs a native-speaker review pass** before going fully public.
- [ ] **[i18n] Translate — Italian (`it`)** -- Fill `public/locales/it/translation.json`.
- [ ] **[i18n] Translate — Dutch (`nl`)** -- Fill `public/locales/nl/translation.json`.
- [ ] **[i18n] Translate — Danish (`da`)** -- Fill `public/locales/da/translation.json`.
- [ ] **[i18n] Translate — Slovenian (`sl`)** -- Fill `public/locales/sl/translation.json`.
- [ ] **[i18n] Translate — Romanian (`ro`)** -- Fill `public/locales/ro/translation.json`.
- [ ] **[i18n] Choose translation engine** -- For the newsletter auto-translate step (and optionally to bulk-draft the 9 site languages for human review). DeepL recommended for EU-language quality; alternatives Google Cloud Translation or an LLM. Needs an API key + cost sign-off.
- [ ] **[i18n/SEO] Prerender or sitemap hreflang** -- `hreflang` tags are injected at runtime (client-rendered SPA). If SEO matters, add a prerender step or a static `sitemap.xml` with `<xhtml:link rel="alternate" hreflang>` per page/language. See `docs/i18n_deployment.md`.
- [x] **[Newsletter] Preferred-language capture** ✅ DONE (2026-10-09) — `language` column on `newsletter_subscribers` (default `en`, auto-added on API startup via idempotent `ALTER TABLE … IF NOT EXISTS`), `language` accepted by `POST /api/v1/public/newsletter` (validated against the 10 codes), picker on `/newsletter` defaulting to the page language, included in the CSV export. Still sends everything in English.
- [x] **[Newsletter] Multilingual issues (send side)** ✅ DONE (2026-10-09) — Per-language issue store (`newsletter_issue_by_lang`), `/admin/newsletter/current?language=`, grouped send (each subscriber gets their language's issue, English fallback), localized welcome email (`render_welcome`, en+es). Build/upload via `make newsletter-build` + `newsletter-upload`. See `docs/i18n_deployment.md`.
- [ ] **[Newsletter] Localize more welcome-email languages** — `render_welcome` in `api/app/services/newsletter_content.py` has en + es; add the other 8 (they fall back to English for now).
- [x] **[Newsletter] Change language by re-subscribing** ✅ DONE (2026-10-09) — an active subscriber who re-submits the form now has their language + name fields updated (no emails re-sent); the API returns 200 with `updated:true` and the form shows a "Preferences updated" state (en + es). First-time signups still create + welcome as before.
- [ ] **[Newsletter] Unsubscribe landing page localization** — the unsubscribe confirmation page (`newsletter.py` `_landing_page`) is still English only. Localize it per the subscriber's language.

### Other

- [ ] **[A11y] VoiceOver pass** -- Run the manual screen-reader script in `docs/A11Y_VERIFICATION_CHECKLIST.md` (everything else is machine-verified: axe 0 violations, keyboard, reflow). In progress 2026-07-29.

- [ ] **[A11y] Accessibility statement** -- After a clean VoiceOver pass, publish an accessibility statement page (EN 301 549 / Web Accessibility Directive — required for an EU-funded public site). Link it from the footer. Do NOT use a third-party accessibility overlay.

- [ ] **[Assets] Verify KIKK_lepavillion.avif alt** -- The one image not visually verifiable by tooling (AVIF). Current alt "Le Pavillon, Namur" — confirm it matches the photo.

- [ ] **[Content] Resources — wire remaining deliverable Drive links** -- D1.1 and D5.1 are linked; D5.2 has "You are here!" status. Add `href: 'https://drive.google.com/...'` to each remaining deliverable in the `deliverables` array in `src/pages/Resources.tsx` as files are published to Drive.

- [ ] **[Assets] Partner logos — SVG upgrade** -- 14 core partner logo entries + LSP coordinator + FUT leadership card are wired as PNGs in `public/logos/partner_logos/`. Replace with SVGs where available for crisp scaling. Associated partners section removed from Partners page (no logos available; confirm with coordinator if it should return). Note: `FFV.png` is preserved on disk but unreferenced — Flora & Fauna Visions was absorbed by The Storytelling Company (TSC) and all responsibilities reassigned.

- [ ] **[Assets] Experience photography** -- Need real photos for Snapsting Festival (Viborg) and Le Pavillon (Namur). Files: `src/pages/Experiences.tsx`.

- [ ] **[Assets] Hero image/video** -- Home page hero requires either a photo or a video loop of the immersive installation environment.

- [ ] **[Content] About page copy** -- Several wireframe text blocks are placeholders. Need final mission copy, pull quote, and approach descriptions before Phase 2 about page is done.

- [ ] **[Content] Experience descriptions** -- Both cards on `/experiences` have placeholder text. Need final descriptions for Snapsting and Le Pavillon. File: `src/pages/Experiences.tsx`.

- [ ] **[Content] FAQ verified** -- Confirm all 14 answers in `src/pages/FAQ.tsx` are final/approved before going live.

- [ ] **[Content] EU funding credit line wording** -- Footer now includes the official "Co-funded by the EU" logo (`public/logos/co-funded_EN/vertical/EN_co_fundedvertical_RGB_WHITE.png`). Confirm exact wording of the accompanying credit line with coordinator.

- [ ] **[Content] Privacy policy page** -- Now pressing: the site collects personal data (newsletter + contact forms), the subscribe form's consent checkbox references a Privacy Policy that links nowhere (`src/pages/Newsletter.tsx` TODO), and every newsletter email footer links "Privacy policy" to the homepage (`newsletters/` issues). Create the page, then link it from the consent checkbox, the site footer, and future newsletter issues.

- [ ] **[Newsletter] LinkedIn URL format** -- Footer + Newsletter page link to `linkedin.com/in/echo-immersive-216916403` (personal-profile format). If a proper LinkedIn *company* page is created, swap the URL in `src/components/Footer/Footer.tsx` and `src/pages/Newsletter.tsx`.

- [x] **[A11y] Social icon aria-labels** -- Done: Footer and Contact social links carry `aria-label="Follow us on Facebook/Instagram/LinkedIn"`.

- [x] **[A11y] FAQ keyboard navigation** -- Verified 2026-07-28 via headless-Chrome keyboard simulation: all 14 toggles are native buttons, Enter and Space both toggle, `aria-expanded` updates. VoiceOver announcement check remains part of the manual pass in `docs/A11Y_VERIFICATION_CHECKLIST.md`.


- [ ] **[Design] Remove sandbox routes once design is locked** -- `/lynch-home`, `/lynch-about`, `/ismaila-home`, `/brand-home` are no longer needed as the brand palette is rolled out site-wide. Delete the files, remove the routes from `src/App.tsx`, and remove the entries from `README.md` and `PROGRESS.md`.

- [ ] **[Perf] Dither code-splitting** -- Dither now mounts site-wide via `DitherBackground` in the `Layout` component (`src/App.tsx`). Do NOT use `React.lazy` for it — lazy loading causes a 1s mount delay that combines with React StrictMode's double-mount to destroy the WebGL context at first paint (canvas visible → gone). Instead, use a dynamic `import()` at the route level (route-based splitting) if Three.js bundle size becomes a concern. Direct static import is the safe default for now. Note: `docs/dither_deployment.md` still shows the lazy/Suspense pattern — update or remove that section if Dither stays static.

---

## Done

- [x] **[Routing] BrowserRouter 404 on refresh** DONE (2026-04-14) -- `nginx.conf` `try_files` rule serves `index.html` for all routes inside the Docker container.
- [x] **[Build] Tailwind CDN → PostCSS build** DONE (2026-04-14) -- Switched to Tailwind 3 via PostCSS in Vite scaffold.
- [x] **[Decision] Newsletter service** -- DONE: FastAPI backend with PostgreSQL stores subscribers. Endpoint: `POST /api/v1/public/newsletter`.

- [x] **[Feature] Newsletter send pipeline** -- DONE (2026-09-02): admin endpoints for send (`POST /api/v1/admin/newsletter/send`, with test / single-subscriber / full modes), CSV export, and current-issue store (`POST /api/v1/admin/newsletter/current`); new subscribers auto-receive the current issue after the welcome email; `make newsletter-test/-send/-export/-set-current` targets run from the laptop against production. Issue No. 1 sent 2026-09-02. Workflow: `newsletters/README.md`.

- [x] **[Decision] Contact form submission** -- DONE: FastAPI backend handles submissions. Endpoint: `POST /api/v1/public/contact`. Emails sent via SMTP (aiosmtplib).

- [x] **[Decision] "Enter ECHO System ↗" destination** -- DONE: Links to `https://echosystem.futurity.science`.

- [X] **[Setup] Configure .env for production** -- Copy `.env.example` to `.env` and fill in real SMTP credentials, `CONTACT_RECIPIENT_EMAIL`, and `POSTGRES_PASSWORD` before deploying. Do NOT commit `.env`.

- [X] **[Setup] Run Alembic migration on first deploy** -- After `docker compose up --build`, run: `docker compose exec api alembic upgrade head` to create `contact_messages` and `newsletter_subscribers` tables.