# Implementation Progress — Immersive ECHO

Build plan for the Immersive ECHO website. Each phase produces a visible, testable increment.

---

## Phase 1: Wireframe **COMPLETE**

- [x] Clickable HTML wireframe with all 8 pages (`Wireframe.html`)
- [x] Single-page JS router (`navigate()` function, `.page-view` / `.active-page`)
- [x] Sticky header with logo, nav links, and "Enter ECHO System ↗" CTA
- [x] Home: hero, mission text, newsletter CTA
- [x] About: mission block, dual-track approach cards, infographic placeholder, stats row (15 / 10 / 30 / 2), project details sidebar
- [x] Partners: coordinator (LSP) + 14 core partner slots (15 organisations total per FAQ copy)
- [x] Experiences: Snapsting Festival (Viborg, Denmark) + Le Pavillon (Namur, Belgium) cards
- [x] News & Events: article feed with type filters (All / News / Events / Press), event gallery sidebar
- [x] FAQ: 14 accordion items with `toggleFaq()` interaction
- [x] Contact: form (Name, Org, Subject, Message), coordinator info, social icons (Facebook, X, Instagram, YouTube), newsletter CTA
- [x] Newsletter: full-screen split page (dark form + image), hides header/footer
- [x] Footer: 3-column, dark background

---

## Phase 2: Production Build **IN PROGRESS**

### Style Sandbox (testing only — not production routes)
- [x] `/lynch-home` (`src/pages/LynchHome.tsx`) — dark brand palette applied, full-viewport Dither background, animated hero, count-up stats, shine-sweep CTA, `prefers-reduced-motion` respected
- [x] `/lynch-about` (`src/pages/LynchAbout.tsx`) — dark brand palette applied to the About layout
- [x] `/ismaila-home` (`src/pages/IsmailaHome.tsx`) — cloned from `LynchHome` as a starting point for Ismaila's design explorations
- [x] `/brand-home` (`src/pages/BrandHome.tsx`) — official brand palette applied: Charcoal bg, Cream text, Lilac accents, Plum surfaces, Montserrat display font, Roboto body; Dither shifted to warm lilac-purple; all interaction patterns from LynchHome carried over
- [x] Brand palette wired as Tailwind tokens: `brand-cream` `#F7F3E0`, `brand-charcoal` `#202124`, `brand-lilac` `#DA80FF`, `brand-purple` `#8843A3`, `brand-plum` `#5A4263` (legacy blue tokens still defined in `tailwind.config.ts` but no longer used in new work)
- [x] Roll out brand palette + sandbox patterns to production pages and shared Header/Footer
- [ ] Remove sandbox routes (`/lynch-home`, `/lynch-about`, `/ismaila-home`, `/brand-home`) once design lock is final

### Setup
- [x] Vite 6 + React 19 + TypeScript project scaffold
- [x] `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- [x] Tailwind CSS 3 via PostCSS (`tailwind.config.ts`, `postcss.config.js`)
- [x] `@/` path alias configured in `vite.config.ts`
- [x] `src/styles/global.css` with Tailwind directives + base body styles
- [x] `src/main.tsx` + `src/App.tsx` with BrowserRouter and Layout wrapper
- [x] `assets/` directory structure (`img/`, `logos/`, `icons/`) — to populate
- [x] `.gitignore` (node_modules, dist, .env, .DS_Store)
- [x] Favicon wired in `index.html` — `public/logos/favicon.svg` (primary, with `prefers-color-scheme` CSS that fills `#202124` on light tabs and `#F7F3E0` on dark tabs in Chrome/Firefox), `public/logos/favicon.png` (499×500 fallback for browsers without SVG-favicon support). SVG geometry inverted from the source export so the figure is solid-filled and the background is transparent. Cache-busting query (`?v=2`) on both link tags. Safari ignores the dark-mode CSS and renders the SVG with the default fill attribute (`#202124`)

### Header & Navigation
- [x] Sticky header component (`src/components/Header/Header.tsx`) — translucent charcoal + blur, lilac accents
- [x] NavLink active state styling (`#DA80FF` for active, cream/65 default)
- [x] "Enter ECHO System ↗" CTA → `https://echosystem.futurity.science`
- [x] Responsive hamburger menu on mobile (animated 3-line ↔ X, dropdown panel)
- [x] Real logo wired (`/logos/logo-horizontal-light.png`)

### Home Page
- [x] Real Home page (`src/pages/Home.tsx`) — clamp-scaled hero, fade-up reveals, count-up stats grid, partner-logo marquee, mission + pull quote, label divider
- [x] Newsletter CTA banner — styled plum panel, lilac shine button, wired to `/newsletter`
- [ ] Replace Dither/gradient hero with real imagery or video (if desired)

### About Page
- [x] Page stub (`src/pages/About.tsx`) — real stats row, project details sidebar, team cards, infographic placeholder
- [x] "Full Structure, Tasks & Deliverables" CTA linking to `/resources` — placed left of Project Details sidebar
- [ ] Real mission copy + pull quote
- [ ] Off-site / On-site Design Team descriptions
- [ ] Dual-track infographic (commission or build as SVG/animation)

### Partners Page
- [x] Partners page (`src/pages/Partners.tsx`) — LSP (coordinator) + FUT (Communication & Dissemination) leadership row + 14 core partner entries with real logos, names, and outbound URLs
- [x] Per-logo sizing system (`large?: boolean`) — zero padding for logos that need full card width (FUT, GPI, KIKK, NPIAT, TPL); applied on Partners page and propagated to About page chips and LogoMarquee
- [x] LogoMarquee (`src/components/LogoMarquee/LogoMarquee.tsx`) — updated to 4-tier size system (`sm/md/lg/xl`) per logo; synced partner list (added KIKK_, TAW, corrected VIB/VIB_ mapping)
- [x] About page + Resources page partner logo chips use same `largeLogos` set for consistent sizing across the site
- [x] **FFV → TSC consortium change** — Flora & Fauna Visions was absorbed by The Storytelling Company. All site-wide references migrated: Partners.tsx (FFV card removed; TSC already present), LogoMarquee, About page approach cards, Resources page (WP2 lead, all WP partner arrays, T2 task leads, MS3/MS4 of WP2, D2.2 / D2.3), ProjectTimeline tags, dual-track chart (LEAD label + partner tag arrays), and `public/grant-data.md` (canonical record updated; FFV preserved as PDF alias for grant-document traceability). `public/logos/partner_logos/FFV.png` left on disk as an unreferenced archive in case the rollback is ever needed.

### Experiences Page
- [x] Experiences index (`src/pages/Experiences.tsx`) at `/experiences` — Snapsting + Le Pavillon cards
- [x] Activity sub-pages: `/experiences/snapsting` (`SnapstingActivities.tsx`) and `/experiences/pavillon` (`PavillonActivities.tsx`)
- [ ] Real pilot photography
- [ ] Final pilot descriptions

### News & Events Page
- [x] News page (`src/pages/News.tsx`) — type filters (useState), article cards, gallery sidebar
- [x] Launch event sub-page (`src/pages/news/Launch.tsx`)
- [x] Gallery `Lightbox` component (`src/components/Lightbox/`) wired in
- [ ] More real article content
- ~~Media kit download (ZIP)~~ — dropped 2026-07-29; button removed from News page (brand assets live on Resources → Media tab)

### FAQ Page
- [x] FAQ page (`src/pages/FAQ.tsx`) — 14 items with real copy, React accordion (useState)
- [x] Keyboard-accessible accordion (native buttons — Enter/Space verified 2026-07-28)

### Contact Page
- [x] Page stub (`src/pages/Contact.tsx`) — form with controlled inputs, coordinator info, social icons, newsletter CTA
- [x] Form submission — FastAPI backend (`POST /api/v1/public/contact`), email field added, success/error states wired
- [ ] Real social icon SVGs + links

### Newsletter Page
- [x] Page stub (`src/pages/Newsletter.tsx`) — full-screen split layout, controlled form, no header/footer
- [x] Newsletter service integration — FastAPI backend (`POST /api/v1/public/newsletter`), success + already-subscribed states wired
- [x] Right panel — Dither background with centered logo (replaced image placeholder)

### Backend (FastAPI)
- [x] `api/` directory — FastAPI + SQLAlchemy async + asyncpg + aiosmtplib + Pydantic v2
- [x] `POST /api/v1/public/contact` — saves to `contact_messages`, sends email to recipient + sender confirmation
- [x] `POST /api/v1/public/newsletter` — upserts `newsletter_subscribers`, sends confirmation email
- [x] `docker-compose.yml` updated — 3 services: `echoimmersive-web` (Nginx), `api` (FastAPI), `db` (Postgres 16)
- [x] `nginx.conf` updated — `/api/` proxied to FastAPI container
- [x] `.env.example` added — template for SMTP, DB, and CORS config
- [x] `POST /api/v1/admin/newsletter/send` — sends an HTML issue to all active subscribers (or one test address), per-subscriber unsubscribe link (`{{unsubscribe_url}}` substitution, or appended footer); issues live in `newsletters/`, triggered via `make newsletter-test` / `make newsletter-send`
- [x] First issue ready: `newsletters/2026-07-first-issue.html` (from `Echo newsletter design/`), images optimised + hosted at `public/img/newsletter/`
- [ ] Run `alembic upgrade head` on first deploy to create DB tables

### Resources Page
- [x] Resources page (`src/pages/Resources.tsx`) at `/resources` — cream bg (`#F7F3E0`), no Dither, opts out via `NO_DITHER_ROUTES`
- [x] Full EU grant data: 5 WPs, 22 tasks (5 groups), 20 milestones, 19 deliverables, 21 events — sourced from CREA-CULT-2025-COOP-3 application; events numbered E1–E21 sequentially by date (E1–E6 dated public events in chronological order, E7–E21 remaining activities)
- [x] Tabbed interface — WPs / Tasks / Milestones / Deliverables / Events / Media & Brand; underline indicator, wraps on mobile (no scroll hijack)
- [x] WP accordions with objectives list + partner logo chips (`filter: invert(1)` for cream bg)
- [x] Task group accordions with inner task rows (expandable descriptions)
- [x] Milestones sorted chronologically (MS01–MS20), past dates highlighted green (`#16a34a`) automatically via `isPast()` helper
- [x] Deliverables sorted by due month; three states: Pending / "Access file →" (Google Drive link) / custom `status` text (e.g. "You are here!")
- [x] D1.1 and D5.1 linked to Google Drive; D5.2 status set to "You are here!" (this site is the deliverable)
- [x] Media / Brand tab — `MediaItem` type, `mediaItems` array; D5.1.1 Brand assets linked to Drive folder
- [x] Decision: deliverable files hosted on Google Drive (partners can upload without a deploy); `href` field on each deliverable entry is the only thing to update when a new file is ready
- [x] Canonical grant data reference at `public/grant-data.md`
- [ ] Wire `href` on remaining deliverables as files are published to Drive

### Footer
- [x] Footer component (`src/components/Footer/Footer.tsx`) — 3-column, quick links, EU credit + co-funded logo
- [x] EU co-funded logo asset (`public/logos/co-funded_EN/horizontal/EN_Co-fundedbytheEU_RGB_WHITE.png`) wired into footer
- [ ] Confirmed EU credit line wording
- [ ] Privacy policy page + link

---

### Accessibility — WCAG 2.2 AA hardening (2026-07-28/29)
- [x] Static audit (`docs/WCAG_AUDIT.md`) — 39 PASS / 1 PARTIAL (3.3.3, non-blocking) / 0 FAIL
- [x] Batch 1 (the "7 polish items"): per-route `document.title` (`PageTitle` in App.tsx) · active-nav underline (+ NavLink's built-in `aria-current`) · global `:focus-visible` ring in global.css · footer headings h4→h2 · visible ＊ required markers on Contact · mobile-menu Esc-to-close with focus return · `aria-hidden` DitherBackground
- [x] Batch 2 (found by automated rendered-site pass): Lightbox rebuilt as real modal (dialog role, focus-in, Tab trap, Esc, focus return) · Newsletter labels associated + h1 + `role="alert"` + real social links · contrast fixes (social glyphs, News dates, Resources tabs/subtitle) · 320px reflow (News filter wrap, ProjectTimeline stats wrap / `min-width:0` / contained index scroll) · heading jumps removed (About, Resources)
- [x] Alt-text review, every image on all 12 routes: Partners logos `alt=""` (name announced once via visible text) · Home marquee `aria-hidden` (decorative) · launch gallery = 8 descriptive alts written from actual photo content (`src/data/galleries.ts`, now `{src, alt}` pairs)
- [x] Asset sweep: 0 broken asset requests · "Access file →" links got per-file `aria-labels` · JetBrains Mono added to font loading (was silently falling back) · `.DS_Store` purged from public/ · inert Media Kit button removed · og:/twitter social-preview meta added (echoimmersive.eu, consortium photo)
- [x] Automated verification: axe-core WCAG 2.2 AA ruleset = **0 violations on all 12 routes**; keyboard simulation + 320px reflow via headless Chrome (scripts in session scratchpad)
- [ ] Human VoiceOver pass (`docs/A11Y_VERIFICATION_CHECKLIST.md`) — in progress
- [ ] Publish accessibility statement (EN 301 549 / Web Accessibility Directive) after the VO pass

## Phase 3: Content & Assets **NOT STARTED**

- [ ] Final logo files from design team
- [x] Partner logo assets (15 core + LSP coordinator + FUT leadership wired in `public/logos/partner_logos/`; TAW.png added for The Animation Workshop)
- [ ] Hero and pilot photography
- [ ] Infographic for dual-track methodology
- [ ] Real copy for all wireframe placeholder text blocks
- [ ] Translations (10 partner languages — scope TBD)

---

## Phase 4: Launch **NOT STARTED**

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness QA
- [ ] Accessibility audit (contrast, keyboard nav, screen reader) — static audit + automated rendered-site verification done (`docs/WCAG_AUDIT.md`: axe-core 0 violations on all 12 routes, keyboard + 320px reflow machine-verified 2026-07-28); human VoiceOver pass pending (`docs/A11Y_VERIFICATION_CHECKLIST.md`), then publish accessibility statement
- [ ] Performance audit (image compression, Lighthouse score)
- [ ] Deploy to production (see `docs/dither_deployment.md`)
- [ ] DNS / domain setup
- [ ] Analytics integration (TBD)
