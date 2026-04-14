# Implementation Progress — Immersive ECHO

Build plan for the Immersive ECHO website. Each phase produces a visible, testable increment.

---

## Phase 1: Wireframe **COMPLETE**

- [x] Clickable HTML wireframe with all 8 pages (`Wireframe.html`)
- [x] Single-page JS router (`navigate()` function, `.page-view` / `.active-page`)
- [x] Sticky header with logo, nav links, and "Enter ECHO System ↗" CTA
- [x] Home: hero, mission text, newsletter CTA
- [x] About: mission block, dual-track approach cards, infographic placeholder, stats row (15 / 10 / 30 / 2), project details sidebar
- [x] Partners: coordinator (LSP), 14 core partner slots, 6 associated partner slots
- [x] Pilots: Snapsting Festival (Viborg, Denmark) + Le Pavillon (Namur, Belgium) cards
- [x] News & Events: article feed with type filters (All / News / Events / Press), event gallery sidebar, media kit download
- [x] FAQ: 12 accordion items with `toggleFaq()` interaction
- [x] Contact: form (Name, Org, Subject, Message), coordinator info, social icons (Facebook, X, Instagram, YouTube), newsletter CTA
- [x] Newsletter: full-screen split page (dark form + image), hides header/footer
- [x] Footer: 3-column, dark background

---

## Phase 2: Production Build **IN PROGRESS**

### Setup
- [x] Vite 6 + React 19 + TypeScript project scaffold
- [x] `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- [x] Tailwind CSS 3 via PostCSS (`tailwind.config.ts`, `postcss.config.js`)
- [x] `@/` path alias configured in `vite.config.ts`
- [x] `src/styles/global.css` with Tailwind directives + base body styles
- [x] `src/main.tsx` + `src/App.tsx` with BrowserRouter and Layout wrapper
- [x] `assets/` directory structure (`img/`, `logos/`, `icons/`) — to populate
- [x] `.gitignore` (node_modules, dist, .env, .DS_Store)

### Header & Navigation
- [x] Sticky header component (`src/components/Header/Header.tsx`)
- [x] NavLink active state styling
- [x] "Enter ECHO System ↗" CTA (placeholder href — needs real URL)
- [ ] Responsive hamburger menu on mobile
- [ ] Replace logo placeholder with real SVG/image

### Home Page
- [x] Page stub (`src/pages/Home.tsx`) — hero placeholder, mission text (real copy), newsletter CTA
- [ ] Hero section with real imagery or video
- [ ] Newsletter CTA banner (styled, wired to /newsletter route)

### About Page
- [x] Page stub (`src/pages/About.tsx`) — real stats row, project details sidebar, team cards, infographic placeholder
- [ ] Real mission copy + pull quote
- [ ] Off-site / On-site Design Team descriptions
- [ ] Dual-track infographic (commission or build as SVG/animation)

### Partners Page
- [x] Page stub (`src/pages/Partners.tsx`) — coordinator slot, 14 core + 6 associated partner placeholders
- [ ] Real partner logos + links for all 20 partners

### Pilots Page
- [x] Page stub (`src/pages/Pilots.tsx`) — both pilot cards with correct names/locations
- [ ] Real pilot photos
- [ ] Real pilot descriptions
- [ ] "View Activities" destination

### News & Events Page
- [x] Page stub (`src/pages/News.tsx`) — filter buttons with useState, article cards, gallery sidebar
- [ ] Real article content
- [ ] Gallery lightbox or link-outs
- [ ] Media kit download (ZIP)

### FAQ Page
- [x] Page stub (`src/pages/FAQ.tsx`) — all 14 FAQ items with real copy, React accordion (useState)
- [ ] Keyboard-accessible accordion (Enter/Space to toggle — currently click only)

### Contact Page
- [x] Page stub (`src/pages/Contact.tsx`) — form with controlled inputs, coordinator info, social icons, newsletter CTA
- [ ] Form submission handling (Formspree / Netlify Forms / etc.)
- [ ] Real social icon SVGs + links

### Newsletter Page
- [x] Page stub (`src/pages/Newsletter.tsx`) — full-screen split layout, controlled form, no header/footer
- [ ] Newsletter service integration (Mailchimp / Brevo / etc.)
- [ ] Real image right panel

### Footer
- [x] Footer component (`src/components/Footer/Footer.tsx`) — 3-column, quick links, EU credit placeholder
- [ ] EU co-funded logo asset
- [ ] Confirmed EU credit line wording
- [ ] Privacy policy page + link

---

## Phase 3: Content & Assets **NOT STARTED**

- [ ] Final logo files from design team
- [ ] Partner logo assets (all 15 core + 6 associated)
- [ ] Hero and pilot photography
- [ ] Infographic for dual-track methodology
- [ ] Real copy for all wireframe placeholder text blocks
- [ ] Translations (10 partner languages — scope TBD)

---

## Phase 4: Launch **NOT STARTED**

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness QA
- [ ] Accessibility audit (contrast, keyboard nav, screen reader)
- [ ] Performance audit (image compression, Lighthouse score)
- [ ] Deploy to production (see `docs/dither_deployment.md`)
- [ ] DNS / domain setup
- [ ] Analytics integration (TBD)
