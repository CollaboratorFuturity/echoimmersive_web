# Immersive ECHO
<!-- https://github.com/CollaboratorFuturity/echoimmersive_web.git -->

Pan-European cultural heritage project creating collective immersive experiences through projection, spatial audio, and sensor technology — enabling small and medium institutions to tell their stories at scale.

## Tech Stack

| Layer       | Technology                                              |
| ----------- | ------------------------------------------------------- |
| HTML        | HTML5 (Vite entry point)                                |
| Framework   | React 19 + TypeScript                                   |
| Bundler     | Vite 6                                                  |
| CSS         | Tailwind CSS 3 (PostCSS build, not CDN)                 |
| Routing     | React Router v6                                         |
| Fonts       | Montserrat (display, 300–800) + Roboto (body, 300–700) — Google Fonts via `docs/branding/brand.css` |
| 3D / WebGL  | Three.js + @react-three/fiber (Dither background)       |
| Deploy      | Docker (multi-stage build → Nginx alpine), port 8105    |
| Tunnel      | Cloudflare via Cosmos Cloud → echoimmersive.eu          |

> **⚠️ Type-check gotcha:** the root `tsconfig.json` is solution-style (references only), so `npx tsc --noEmit` passes **without checking anything**, and `vite build` alone doesn't type-check. The only real verification is **`npm run build`** (`tsc -b && vite build`) — the same command the Dockerfile runs. Always run it before calling a change done.

<!--
  Add rows as your stack grows. Examples:
  | Icons       | Font Awesome 6 (CDN)                                    |
  | Analytics   | Plausible (self-hosted)                                  |
-->

## Project Structure

```
echoimmersive_web/
├── Wireframe.html               # Phase-1 vanilla-HTML prototype (legacy — layout reference only)
├── ONBOARDING.md                # New-contributor onboarding notes
├── index.html                   # Vite HTML entry point
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── postcss.config.js
├── package.json
├── Dockerfile / docker-compose.yml / nginx.conf
├── Makefile
│
├── src/
│   ├── main.tsx                 # React entry, mounts App
│   ├── App.tsx                  # BrowserRouter + Routes + Layout (Dither + Header + Footer)
│   ├── styles/
│   │   └── global.css           # Tailwind directives, body defaults, page-fade transition
│   ├── pages/                   # One file per route
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Partners.tsx
│   │   ├── Experiences.tsx      # /experiences route
│   │   ├── SnapstingActivities.tsx
│   │   ├── PavillonActivities.tsx
│   │   ├── News.tsx
│   │   ├── news/Launch.tsx      # /news/launch sub-page
│   │   ├── FAQ.tsx
│   │   ├── Contact.tsx
│   │   ├── Newsletter.tsx       # Full-screen, no header/footer
│   │   ├── UnderConstruction.tsx# Full-screen placeholder, no header/footer
│   │   ├── LynchHome.tsx        # Sandbox — dark palette, opts out of shared Dither
│   │   ├── LynchAbout.tsx       # Sandbox — dark palette About layout
│   │   ├── IsmailaHome.tsx      # Sandbox — cloned from LynchHome
│   │   └── BrandHome.tsx        # Sandbox — official brand palette
│   ├── components/
│   │   ├── Header/Header.tsx        # Sticky blurred charcoal nav, lilac accents, hamburger
│   │   ├── Footer/Footer.tsx        # 3-column charcoal footer with social ring icons
│   │   ├── DitherBackground/        # Site-wide WebGL background wrapper
│   │   ├── Dither/                  # Lower-level WebGL dither primitive
│   │   │   ├── Dither.tsx
│   │   │   └── Dither.css
│   │   ├── LineWaves/               # Animated line/wave decoration
│   │   ├── LogoMarquee/             # Scrolling partner-logo strip (Home)
│   │   ├── Lightbox/                # Modal image viewer (galleries)
│   │   └── ScrollToTop.tsx          # Resets scroll on route change
│   └── data/
│       └── galleries.ts             # Gallery image data
│
├── api/                         # FastAPI backend (contact + newsletter endpoints)
├── newsletters/                 # Newsletter issues (HTML) — see newsletters/README.md for how to send
├── public/                      # Static files served at site root
│   ├── img/                     # Photos, hero imagery
│   ├── logos/                   # Partner + coordinator logos, header logo
│   └── charts/                  # Infographics
└── docs/
    ├── TODO.md
    ├── PROGRESS.md
    ├── STYLEGUIDE.md
    ├── dither_deployment.md
    └── branding/                # Brand kit — brand.css, logo-kit.html, color.html, typography.html
```

<!--
  Keep this tree updated as the project grows. This is the map.
  Anyone reading the project for the first time will use this to orient themselves.
-->

## Development Progress

See [docs/PROGRESS.md](docs/PROGRESS.md) for the full implementation checklist.

**Current status**:
- Phase 1 complete — Vanilla-HTML wireframe (`Wireframe.html`) covering all pages
- Phase 2 in progress — React build live: brand palette rolled out site-wide, shared Dither background, real Home/About/Partners/FAQ/Contact/Newsletter/Resources pages with backend wired
- Resources page has full EU grant data (5 WPs, 22 tasks, 20 milestones, 19 deliverables, 21 events) in a tabbed interface; past milestone dates highlighted green automatically; events numbered E1–E21 sequentially by date (E1–E6 are the 6 dated public events in chronological order, E7–E21 are remaining activities)
- About page links to Resources via "Full Structure, Tasks & Deliverables" CTA
- Sandbox routes (`/lynch-home`, `/lynch-about`, `/ismaila-home`, `/brand-home`) remain for design exploration
- **Accessibility: WCAG 2.2 AA hardening complete (2026-07-28/29)** — 0 axe-core violations on all 12 routes; keyboard behavior (skip link, mobile-menu Esc, Lightbox modal, FAQ accordion) machine-verified with headless Chrome; 320px reflow clean; all alt text human-reviewed. See [docs/WCAG_AUDIT.md](docs/WCAG_AUDIT.md) (criterion-by-criterion status) and [docs/A11Y_VERIFICATION_CHECKLIST.md](docs/A11Y_VERIFICATION_CHECKLIST.md) (manual VoiceOver script — the last step before an AA claim, plus publishing an accessibility statement)

## Routes

**Production pages** (standard layout: Header + Dither background + Footer):
- `/` — Home
- `/about` — About
- `/partners` — Partners
- `/experiences` — Experiences
- `/experiences/snapsting` — Snapsting activities
- `/experiences/pavillon` — Le Pavillon activities
- `/news` — News & Events
- `/news/launch` — Launch event sub-page
- `/news/newsletter-1` — Newsletter No. 1 as a web article
- `/faq` — FAQ
- `/contact` — Contact
- `/resources` — Resources (opts out of Dither background)

**Full-screen** (no header/footer):
- `/newsletter` — Subscription form
- `/underconstruction` — Placeholder page

**Sandbox** (do not link from production nav):
- `/lynch-home` — Lynch's style sandbox, dark brand palette + Dither WebGL background
- `/lynch-about` — Lynch's style sandbox for the About layout
- `/ismaila-home` — Ismaila's style sandbox, cloned from `/lynch-home` as a starting point
- `/brand-home` — Official brand palette sandbox: Charcoal/Cream/Lilac/Purple/Plum + Montserrat/Roboto (from `docs/branding/`)

<!--
  Keep this section as a quick snapshot. The full details live in PROGRESS.md.
  Example:
  - Phase 1 complete -- Landing page, navigation, hero section
  - Phase 2 in progress -- Interior pages, contact form
-->

## Documentation

All documentation lives in .md files for robustness. AI context gets compressed, sessions end, memory fades. The docs are the only thing that survives. Update them before you consider a feature "done".

Before coding, read this README and all documents. UI changes? Follow STYLEGUIDE.md patterns. New section of the site? Update PROGRESS.md.

- [STYLEGUIDE.md](docs/STYLEGUIDE.md) -- Colors, typography, component patterns
- [PROGRESS.md](docs/PROGRESS.md) -- What's built, what's next. Go-to place to track all features developed and in development.
- [TODO.md](docs/TODO.md) -- Small tasks and known issues. All TODOs must be added here. We do not trust AI context. It gets compressed at unpredictable intervals. Document it or lose it.

### After completing a feature, update docs in this order:

1. **README.md** -- Tech Stack table, Project Structure tree, Development Progress
2. **[PROGRESS.md](docs/PROGRESS.md)** -- Check off completed items, add new sub-items if needed
3. **[TODO.md](docs/TODO.md)** -- when finding TODOs already completed
4. **[STYLEGUIDE.md](docs/STYLEGUIDE.md)** -- If new visual patterns, colors, or components were introduced

This is not optional. Context gets compressed, memory gets lost, sessions end. The docs are the only thing that survives.

Remember the mantra: "Every piece of code created must conform to the documentation and libraries we are using. Creating code without first reading the docs is how you get spaghetti. Always read the docs!"
