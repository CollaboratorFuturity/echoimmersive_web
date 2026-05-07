# TODO - Tasks & Known Issues

> Small tasks, bugs, and improvements that shouldn't derail the main work.

Memory is fragile. AI context gets compressed at unpredictable intervals. If you spot something that needs fixing but it's not the current priority, drop it here immediately. Otherwise it will be forgotten during the next context compression.

---

## Pending

- [ ] **[Assets] Partner logos — SVG upgrade** -- 15 core partner logos + LSP coordinator + FUT leadership card are wired as PNGs in `public/logos/partner_logos/`. Replace with SVGs where available for crisp scaling. Associated partners section removed from Partners page (no logos available; confirm with coordinator if it should return).

- [ ] **[Assets] Experience photography** -- Need real photos for Snapsting Festival (Viborg) and Le Pavillon (Namur). Files: `src/pages/Pilots.tsx` (the Experiences page).

- [ ] **[Assets] Hero image/video** -- Home page hero requires either a photo or a video loop of the immersive installation environment.

- [ ] **[Content] About page copy** -- Several wireframe text blocks are placeholders. Need final mission copy, pull quote, and approach descriptions before Phase 2 about page is done.

- [ ] **[Content] Experience descriptions** -- Both cards on `/experiences` have placeholder text. Need final descriptions for Snapsting and Le Pavillon. File: `src/pages/Pilots.tsx`.

- [ ] **[Content] FAQ verified** -- Confirm all 14 answers in `src/pages/FAQ.tsx` are final/approved before going live.

- [ ] **[Content] EU funding credit line** -- Footer must include the required EU co-funded acknowledgement text and logo. Confirm exact wording with coordinator.

- [ ] **[A11y] Social icon aria-labels** -- Footer and contact page use inline SVG social icons with no text labels. Add `aria-label` attributes before launch (e.g. `aria-label="Follow us on Facebook"`).

- [ ] **[A11y] FAQ keyboard navigation** -- FAQ accordion uses `onClick`. The `aria-expanded` attribute is set but Enter/Space keyboard toggle needs testing across screen readers. File: `src/pages/FAQ.tsx`.


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