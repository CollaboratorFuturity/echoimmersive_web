# TODO - Tasks & Known Issues

> Small tasks, bugs, and improvements that shouldn't derail the main work.

Memory is fragile. AI context gets compressed at unpredictable intervals. If you spot something that needs fixing but it's not the current priority, drop it here immediately. Otherwise it will be forgotten during the next context compression.

---

## Pending

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

- [x] **[A11y] Social icon aria-labels** -- Done: Footer and Contact social links carry `aria-label="Follow us on Facebook/Instagram"`.

- [x] **[A11y] FAQ keyboard navigation** -- Verified 2026-07-28 via headless-Chrome keyboard simulation: all 14 toggles are native buttons, Enter and Space both toggle, `aria-expanded` updates. VoiceOver announcement check remains part of the manual pass in `docs/A11Y_VERIFICATION_CHECKLIST.md`.


- [ ] **[Design] Remove sandbox routes once design is locked** -- `/lynch-home`, `/lynch-about`, `/ismaila-home`, `/brand-home` are no longer needed as the brand palette is rolled out site-wide. Delete the files, remove the routes from `src/App.tsx`, and remove the entries from `README.md` and `PROGRESS.md`.

- [ ] **[Perf] Dither code-splitting** -- Dither now mounts site-wide via `DitherBackground` in the `Layout` component (`src/App.tsx`). Do NOT use `React.lazy` for it — lazy loading causes a 1s mount delay that combines with React StrictMode's double-mount to destroy the WebGL context at first paint (canvas visible → gone). Instead, use a dynamic `import()` at the route level (route-based splitting) if Three.js bundle size becomes a concern. Direct static import is the safe default for now. Note: `docs/dither_deployment.md` still shows the lazy/Suspense pattern — update or remove that section if Dither stays static.

---

## Done

- [x] **[Routing] BrowserRouter 404 on refresh** DONE (2026-04-14) -- `nginx.conf` `try_files` rule serves `index.html` for all routes inside the Docker container.
- [x] **[Build] Tailwind CDN → PostCSS build** DONE (2026-04-14) -- Switched to Tailwind 3 via PostCSS in Vite scaffold.
- [x] **[Decision] Newsletter service** -- DONE: FastAPI backend with PostgreSQL stores subscribers. Endpoint: `POST /api/v1/public/newsletter`.

- [x] **[Decision] Contact form submission** -- DONE: FastAPI backend handles submissions. Endpoint: `POST /api/v1/public/contact`. Emails sent via SMTP (aiosmtplib).

- [x] **[Decision] "Enter ECHO System ↗" destination** -- DONE: Links to `https://echosystem.futurity.science`.

- [X] **[Setup] Configure .env for production** -- Copy `.env.example` to `.env` and fill in real SMTP credentials, `CONTACT_RECIPIENT_EMAIL`, and `POSTGRES_PASSWORD` before deploying. Do NOT commit `.env`.

- [X] **[Setup] Run Alembic migration on first deploy** -- After `docker compose up --build`, run: `docker compose exec api alembic upgrade head` to create `contact_messages` and `newsletter_subscribers` tables.