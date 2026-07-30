# Immersive ECHO — Design System

A brand + deck system for **Immersive ECHO** (Immersive European Cultural Heritage Outreach), a Creative Europe Large-Scale Cooperation project (Feb 2026 – Jul 2028, Grant Agreement No. 101255680) that helps cultural-heritage institutions create collective, location-based, **headset-free** immersive storytelling in everyday public spaces. Coordinated by Lindholmen Science Park, Gothenburg; 15 partner organisations across 10 countries (9 EU + Ukraine). Futurity Systems leads communication, dissemination, and impact.

This project is the source of truth for the ECHO presentation look. It holds the color/type/spacing tokens, the brand assets (logos, the co-funded emblem, partner icons, the stylised Europe map, venue imagery), foundation specimen cards, sample slides, and a reusable deck **template**.

**Sources this system was distilled from:**
- `Three presentation decks/` codebase — the production `Immersive ECHO - 15/5/1 Minute.dc.html` decks, plus its `tokens/`, `assets/`, `guidelines/`, `slides/`.
- `Brand assets 2/` — master logo set (light / dark / gradient, horizontal + stacked) and background gradients.
- `co-funded_EN/` — official "Co-funded by the European Union" emblem in horizontal/vertical, CMYK/RGB, EPS/PNG/JPEG.
- `uploads/presentation_template (1).pptx` — the original PowerPoint template.
- Press-kit markdown (boilerplate, fact sheet, partner list).

---

## Index / manifest

- **`styles.css`** — entry point; `@import`s all tokens + fonts. Consumers link this one file.
- **`tokens/`** — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`.
- **`assets/`** — logos (`logo-{horizontal,stacked}-{light,dark,gradient}.png`), `eu-cofunded-light.png`, background gradients (`gradient-dark.png`, `gradient-dark-grained.png`), `echo-europe-map.svg`, venue photos (`viborg*.png`, `le-pavillon.jpg`, `immersive-gpi.jpg`), and `partners/` (15 white-treated partner marks, raw + `-t` tight-cropped variants).
- **`guidelines/`** — foundation specimen cards (colors, type, spacing, background, partner logos).
- **`slides/`** — standalone sample slides (cover, content, split-image, ecosystem map, close).
- **`templates/echo-deck/`** — `EchoDeck.dc.html`, a reusable 9-slide deck template covering every layout archetype. Loads the system via `ds-base.js`.
- **`deck-stage.js`** — the deck runtime web component (scaling, keyboard nav, thumbnails, PDF export) used by the template.
- **`SKILL.md`** — portable Agent-Skill manifest.

---

## CONTENT FUNDAMENTALS

**Voice.** Warm, plain, confident. ECHO speaks to the cultural-heritage *sector* — museums, festivals, public institutions — not to consumers and not to bureaucrats. It translates an EU work plan into human stakes: what visitors feel, what institutions gain, what the project leaves behind.

- **Person.** Third-person about the project ("Immersive ECHO develops…", "ECHO focuses on…"). Never "we/our" marketing-speak; never "you" hard-sell.
- **Casing.** Sentence case for all headlines and body. UPPERCASE only for the tracked kicker eyebrow and small section labels (`WHAT VISITORS EXPERIENCE`, `ON-SITE TRACK`). Never title-case headlines.
- **Sentence length.** Headlines are short claims (4–9 words): "Immersive does not have to mean isolated." Body is one or two unhurried sentences, then bullets.
- **Bullets** are full sentences, lowercase-led after a short purple dash. They state a fact, not a feature.
- **Numbers** are used sparingly and only when real (15 partners, 10 countries, 30 months, dates like "October 2027"). No invented stats, no data-slop.
- **No emoji. No exclamation marks.** The one permitted flourish is a single italic closing line ("History is not only preserved when it is stored…").
- **Terminology to keep exact:** "headset-free", "collective / location-based", "Snapsting" (the Viborg on-site case), "Le Pavillon / KIKK" (the Namur public testbed), "Co-funded by the European Union" (emblem wording).

---

## VISUAL FOUNDATIONS

**Overall feel.** Dark, cinematic, generous negative space. Every slide is the near-black ink `#1F2023` with a single soft purple glow bleeding from a corner — like light spilling from an installation. Type does the work; decoration is minimal and hard-edged.

- **Color.** Ink `#1F2023` ground; cream `#F7F3DF` for headings/logo/text; bright purple `#DA80FF` as the only accent (kicker bar, bullet dashes, map dots, dividers, the "/" separators in meta strips); deeper `#8743A2` for small structural labels (WP1–WP5). Cream text steps down through `#EDE9DC → #C7C2D2 → #B3B3B3 → #A8A2B2` for hierarchy. **Never introduce a new hue.**
- **The glow.** A `radial-gradient` of `rgba(218,128,255,0.18–0.32)` anchored off-canvas at a corner (commonly bottom-right `118% 122%`), fading to transparent by ~58%. Used as an `inset:0` overlay layer behind content. Covers and closes use the `gradient-dark.png` asset (a baked version of the same effect).
- **Type.** Montserrat 800 for every headline (tight `-0.5px` tracking, `1.08` leading); Roboto 300 for lead paragraphs (the signature look), 400 for body/bullets, 500 for the tracked uppercase kicker. See `tokens/typography.css` for the slide scale (hero 100px → footer 17px).
- **Layout.** 120px side margins. The repeating unit is **kicker → headline → lead → bullets**, left-aligned, vertically centered. A 64×4px purple bar marks covers/closes. Bullets lead with a 26×3px purple dash, not a glyph.
- **Imagery.** Cool, atmospheric, low-key photography (projection art, dusk venues, crowds). Images sit full-height on one side (~42–52% width) with a **linear-gradient fade** into the ink on the content side — never a hard edge, never a full-bleed photo behind text. Dim source photos get a `filter: brightness(1.5) contrast(0.96) saturate(1.07)` lift. Optional `6px` radius when an image sits in a card; full-bleed side panels have no radius.
- **Footer.** Horizontal logo (70px) bottom-left + page number `NN / NN` (17px, tracked, 42% cream) bottom-right, at 48px from the bottom. Covers/closes omit the page number and instead carry the meta strip + EU emblem.
- **Dividers.** 1px `rgba(247,243,223,.16)` rules; vertical 1px rules separate columns (the WP model, the two tracks).
- **Corners & shadows.** Mostly hard-edged. No drop shadows on slides. Radii reserved for inline image cards (`6px`).
- **Motion.** None baked into slides beyond the deck-stage transitions. Keep it still and composed.

---

## ICONOGRAPHY

ECHO is **logo- and type-driven, not icon-driven** — there is no UI icon set in the brand. What exists:

- **Partner logos** (`assets/partners/`) — 15 organisation marks, all treated **white** (RGB forced to `#FFFFFF`, alpha preserved) so they read on the dark ground. Raw versions plus `-t` tight-cropped variants (transparent padding removed) so they can be sized up. Display in a centered wrap/grid, ~46–60px tall, each with a Roboto 400 14px caption in `--echo-text-faint`.
- **Logos** — `logo-horizontal-light.png` (footers, 70px) and `logo-stacked-light.png` (covers, ~540px wide), with dark and gradient variants for light backgrounds. The mark is a bracketed "play/echo" glyph; never recolor it.
- **EU emblem** — `eu-cofunded-light.png`, the official "Co-funded by the European Union" lockup, white-recolored, ~74px tall, bottom-right on covers and closes. Required attribution; do not crop or restyle the flag. Master files in `co-funded_EN/`.
- **The map** — `echo-europe-map.svg`, a stylised Europe with partner countries filled in `--echo-land-active` and glowing `#DA80FF` dots (blurred halo + cream core) on located capitals.
- **No emoji, no unicode-glyph icons, no hand-drawn SVG icons.** The purple dash and the "/" separator are the only repeating non-type marks.

---

## Caveats

- **Fonts are loaded from Google Fonts** (`tokens/fonts.css`), not bundled as `.woff`/`.ttf` binaries. They are the genuine families (Montserrat, Roboto), so fidelity is exact, but offline use would need the binaries added and `@font-face` rules written. The compiler therefore reports 0 bundled fonts.
- No reusable React **components** or product **UI kits** — ECHO has no app/website surface, so the system is scoped to brand tokens + assets + slides + the deck template.
