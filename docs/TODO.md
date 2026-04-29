# TODO - Tasks & Known Issues

> Small tasks, bugs, and improvements that shouldn't derail the main work.

Memory is fragile. AI context gets compressed at unpredictable intervals. If you spot something that needs fixing but it's not the current priority, drop it here immediately. Otherwise it will be forgotten during the next context compression.

---

## Pending

- [x] **[Decision] Newsletter service** -- DONE: FastAPI backend with PostgreSQL stores subscribers. Endpoint: `POST /api/v1/public/newsletter`.

- [x] **[Decision] Contact form submission** -- DONE: FastAPI backend handles submissions. Endpoint: `POST /api/v1/public/contact`. Emails sent via SMTP (aiosmtplib).

- [x] **[Decision] "Enter ECHO System ↗" destination** -- DONE: Links to `https://echosystem.futurity.science`.

- [ ] **[Setup] Configure .env for production** -- Copy `.env.example` to `.env` and fill in real SMTP credentials, `CONTACT_RECIPIENT_EMAIL`, and `POSTGRES_PASSWORD` before deploying. Do NOT commit `.env`.

- [ ] **[Setup] Run Alembic migration on first deploy** -- After `docker compose up --build`, run: `docker compose exec api alembic upgrade head` to create `contact_messages` and `newsletter_subscribers` tables.

- [ ] **[Assets] Partner logos** -- Need logo files for all 15 core partners + 6 associated partners before the Partners page can be built. Formats: SVG preferred, WebP/PNG fallback.

- [ ] **[Assets] Coordinator logo** -- Need Lindholmen Science Park logo (SVG or WebP).

- [ ] **[Assets] Site logo** -- Need final "Immersive ECHO" wordmark / logo before building the header and newsletter page.

- [ ] **[Assets] Pilot photography** -- Need real photos for Snapsting Festival (Viborg) and Le Pavillon (Namur) before building the Pilots page.

- [ ] **[Assets] Hero image/video** -- Home page hero requires either a photo or a video loop of the immersive installation environment.

- [ ] **[Content] About page copy** -- Several wireframe text blocks are placeholders. Need final mission copy, pull quote, and approach descriptions before Phase 2 about page is done.

- [ ] **[Content] Pilots descriptions** -- Both pilot cards have placeholder text. Need real descriptions for Snapsting and Le Pavillon.

- [ ] **[Content] FAQ verified** -- FAQ copy is rich in the wireframe — confirm all 12 answers are final/approved before going live.

- [ ] **[Content] EU funding credit line** -- Footer must include the required EU co-funded acknowledgement text and logo. Confirm exact wording with coordinator.

- [ ] **[A11y] Social icon aria-labels** -- Footer and contact page use inline SVG social icons with no text labels. Add `aria-label` attributes before launch (e.g. `aria-label="Follow us on Facebook"`).

- [ ] **[A11y] FAQ keyboard navigation** -- FAQ accordion uses `onClick`. The `aria-expanded` attribute is set but Enter/Space keyboard toggle needs testing across screen readers. File: `src/pages/FAQ.tsx`.

- [ ] **[Nav] Hamburger menu** -- Header stacks to a row on mobile but has no hamburger toggle. Needs implementation. File: `src/components/Header/Header.tsx`.

- [ ] **[Design] Roll out sandbox to production pages** -- `/lynch-home`, `/lynch-about`, and `/ismaila-home` are testing-only pages with the dark brand palette, Dither background, and interaction patterns (fade-up reveals, count-up stats, shine-sweep CTA). Once the look is approved, apply the patterns to `/`, `/about`, and the shared `Header` / `Footer` components, then delete the sandbox files and routes. Files: `src/pages/LynchHome.tsx`, `src/pages/LynchAbout.tsx`, `src/pages/IsmailaHome.tsx`, `src/App.tsx` (routes), `README.md` (project structure + routes).

- [x] **[Routing] BrowserRouter 404 on refresh** -- Resolved by `nginx.conf` `try_files $uri $uri/ /index.html` rule in the Docker image.

- [ ] **[Perf] Dither code-splitting** -- `Dither.tsx` is in use on `LynchHome`. Do NOT use `React.lazy` for it — lazy loading causes a 1s mount delay that combines with React StrictMode's double-mount to destroy the WebGL context at first paint (canvas visible → gone). Instead, use a dynamic `import()` at the route level (route-based splitting) if Three.js bundle size becomes a concern. Direct static import is the safe default for now.

---

## Done

- [x] **[Routing] BrowserRouter 404 on refresh** DONE (2026-04-14) -- `nginx.conf` `try_files` rule serves `index.html` for all routes inside the Docker container.
- [x] **[Build] Tailwind CDN → PostCSS build** DONE (2026-04-14) -- Switched to Tailwind 3 via PostCSS in Vite scaffold.
