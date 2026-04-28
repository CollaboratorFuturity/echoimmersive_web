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
| Fonts       | DM Sans (Google Fonts, 300–800); Georgia (system serif) |
| 3D / WebGL  | Three.js + @react-three/fiber (Dither background)       |
| Deploy      | Docker (multi-stage build → Nginx alpine), port 8105    |
| Tunnel      | Cloudflare via Cosmos Cloud → echoimmersive.eu          |

<!--
  Add rows as your stack grows. Examples:
  | Icons       | Font Awesome 6 (CDN)                                    |
  | Analytics   | Plausible (self-hosted)                                  |
-->

## Project Structure

```
echoimmersive_web/
├── Wireframe.html               # Clickable prototype — layout reference, do not edit
├── index.html                   # Vite HTML entry point
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── postcss.config.js
├── package.json
│
├── src/
│   ├── main.tsx                 # React entry, mounts App
│   ├── App.tsx                  # BrowserRouter + Routes
│   ├── styles/
│   │   └── global.css           # Tailwind directives + base styles
│   ├── pages/                   # One file per route
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Partners.tsx
│   │   ├── Pilots.tsx
│   │   ├── News.tsx
│   │   ├── FAQ.tsx
│   │   ├── Contact.tsx
│   │   ├── Newsletter.tsx       # Full-screen, no header/footer
│   │   ├── LynchHome.tsx        # Testing only — dark brand palette + Dither bg
│   │   ├── LynchAbout.tsx       # Testing only — dark brand palette sandbox
│   │   ├── IsmailaHome.tsx      # Testing only — Ismaila's sandbox (cloned from LynchHome)
│   │   └── BrandHome.tsx        # Testing only — official brand palette (Charcoal/Lilac/Plum + Montserrat/Roboto)
│   ├── components/
│   │   ├── Header/Header.tsx
│   │   ├── Footer/Footer.tsx
│   │   └── Dither/              # WebGL animated background
│   │       ├── Dither.tsx
│   │       └── Dither.css
│   └── assets/                  # (to populate)
│       ├── img/
│       ├── logos/
│       └── icons/
│
├── public/                      # Static files served as-is (favicon, og image)
└── docs/
    ├── TODO.md
    ├── PROGRESS.md
    ├── STYLEGUIDE.md
    └── dither_deployment.md
```

<!--
  Keep this tree updated as the project grows. This is the map.
  Anyone reading the project for the first time will use this to orient themselves.
-->

## Development Progress

See [docs/PROGRESS.md](docs/PROGRESS.md) for the full implementation checklist.

**Current status**:
- Phase 1 complete — Clickable wireframe with all 8 pages fully structured
- Phase 2 in progress — Vite + React + TypeScript scaffold complete, all 8 page stubs built
- Active sandbox: `/lynch-home` and `/lynch-about` — testing dark brand palette + Dither background before rolling out to the rest of the site

## Routes

**Production pages** (standard layout with header + footer):
- `/` — Home
- `/about` — About
- `/partners` — Partners
- `/pilots` — Pilots
- `/news` — News & Events
- `/faq` — FAQ
- `/contact` — Contact

**Full-screen** (no header/footer):
- `/newsletter` — Subscription form

**Testing only** (sandbox pages, do not link from production nav):
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
