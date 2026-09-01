# Immersive ECHO — Style Guide

The visual contract for the site. Use this when building or editing any page or component so that future work doesn't drift from what already exists.

Tech stack: **React + Vite + Tailwind CSS + react-router-dom**. Brand source of truth: [`docs/branding/brand.css`](branding/brand.css) and [`tailwind.config.ts`](../tailwind.config.ts).

---

## Color Palette

The active brand palette is **cream / charcoal / lilac / purple / plum**. All tokens are exposed as Tailwind classes via [`tailwind.config.ts`](../tailwind.config.ts).

### Brand Colors
| Token              | Hex       | Tailwind class           | Use                                                       |
|--------------------|-----------|--------------------------|-----------------------------------------------------------|
| `brand-charcoal`   | `#202124` | `bg-brand-charcoal`      | Page background (set on `body` in [global.css](../src/styles/global.css)) |
| `brand-cream`      | `#F7F3E0` | `text-brand-cream`       | Default body text color, light surfaces                   |
| `brand-lilac`      | `#DA80FF` | `text-brand-lilac` / `border-brand-lilac` | Accents, badges, active nav, CTAs, glow effects |
| `brand-purple`     | `#8843A3` | `border-brand-purple`    | Subtle dividers, structural borders (often at low opacity)|
| `brand-plum`       | `#5A4263` | `bg-brand-plum`          | Tinted card backgrounds, muted surfaces                   |

### Text Opacities (cream on charcoal)
| Use                       | Value                          | Notes                                |
|---------------------------|--------------------------------|--------------------------------------|
| Headings                  | `#F7F3E0`                      | `text-brand-cream`                   |
| Body                      | `rgba(247,243,224,0.8)`        | Inline style — primary readable text |
| Muted body                | `rgba(247,243,224,0.65)`       | Default nav links, secondary copy    |
| Hint / scroll labels      | `rgba(247,243,224,0.5)`        | Stat labels, subtle UI text          |
| Decorative                | `rgba(247,243,224,0.3)`        | "Scroll" hint, faint borders         |

### Legacy Tokens (do not use for new work)
The blue palette below is still defined in `tailwind.config.ts` for backward compatibility but is **not** the current brand. Do not introduce new uses.
`bg-blue` `#010440` · `primary-blue` `#2128A6` · `light-blue` `#3038D9` · `highlight-purple` `#8E72F2` · `highlight-green` `#7EF28F`

### Usage Rules

**Backgrounds**
- Page: `bg-brand-charcoal` (set on `body`). Most pages render directly on it with the Dither canvas behind.
- Tinted panels: `bg-brand-plum/35` or `bg-brand-charcoal/70 backdrop-blur-sm` for layered cards.
- Newsletter / CTA blocks: `bg-brand-plum/35` with `border-brand-purple/40` and a soft inset glow.

**Borders & dividers**
- Structural: `border-brand-purple/20` to `/30`.
- Card outlines / accents: `border-brand-lilac/25` to `/40`.
- Pull-quote rule: solid `border-l-2 border-brand-lilac`.
- Never use white or gray Tailwind defaults (`border-gray-*`).

**Interactive**
- Primary CTA: `bg-brand-lilac text-brand-charcoal` (dark text on lilac), with shine-on-hover (see Animation Patterns).
- Ghost / outline button: `border border-brand-lilac text-brand-lilac` with `hover:bg-brand-lilac/10` and lilac glow shadow.
- Nav links default: `rgba(247,243,224,0.65)`. Hover/active: `#DA80FF` (`text-brand-lilac`).

**Accents**
- Eyebrow / micro labels: `text-brand-lilac` uppercase tracking-widest.
- Glow / shine: `box-shadow: 0 0 20px #DA80FF, 0 0 40px rgba(218,128,255,0.25)`.

---

## Typography

**Display (headings, UI labels):** `Montserrat`, system-ui fallback
**Body (paragraphs, long-form):** `Roboto`, system-ui fallback

Both are loaded via Google Fonts in [`docs/branding/brand.css`](branding/brand.css). Defaults are wired in [`src/styles/global.css`](../src/styles/global.css):

```css
body { font-family: 'Roboto', ...; }
h1, h2, h3, h4, h5, h6 { font-family: 'Montserrat', ...; }
```

Components frequently apply `style={{ fontFamily: 'Montserrat, sans-serif' }}` inline on labels, buttons, and stats — keep this pattern.

| Element                   | Size                           | Weight | Notes                                 |
|---------------------------|--------------------------------|--------|---------------------------------------|
| Hero (h1)                 | `clamp(1.8rem, 11vw, 11rem)`   | 800    | Uppercase, `letter-spacing: -0.01em`, `line-height: 0.92` |
| Section heading (h2)      | ~`text-2xl` to `text-3xl`      | 700    | Montserrat                            |
| Card heading (h3)         | `text-lg` / `text-xl`          | 700    | Montserrat                            |
| Body                      | `text-base` (`clamp(0.95rem, 2.5vw, 1.2rem)` for hero lede) | 400 | Roboto, line-height 1.7 for readability |
| Pull quote                | `1.05rem`, italic              | 300    | Roboto light italic                   |
| Eyebrow / micro label     | `text-xs`                      | 700    | Uppercase, `tracking-widest`, lilac   |
| Stat number               | `text-3xl`                     | 800    | Montserrat, `tabular-nums`, lilac     |
| Button text               | `text-xs`                      | 700    | Uppercase, `tracking-widest`          |

---

## Spacing & Layout

| Concept              | Value                                | Notes                                            |
|----------------------|--------------------------------------|--------------------------------------------------|
| Page max-width       | `max-w-6xl` (1152px)                 | Centered in [`App.tsx` Layout](../src/App.tsx)   |
| Page padding         | `p-4` mobile, `p-8` md+              | Applied on `<main>` in `Layout`                  |
| Section gap          | `mb-10` to `mb-14`                   | Between major page blocks                        |
| Card padding         | `p-6` to `p-8`                       | `py-16 px-8` for hero CTA blocks                 |
| Card gap             | `gap-4` to `gap-10`                  | Grid gaps scale with content density             |
| Border radius        | `rounded-lg` (8px) buttons, `rounded-xl` (12px) cards/panels |             |
| Header height        | `h-16` (64px)                        | Sticky, blurred translucent charcoal             |
| Stats grid           | `grid-cols-2 md:grid-cols-4`         | 1px gap on lilac/20 background — hairline cells  |

---

## Routes & Pages

Routing is defined in [`src/App.tsx`](../src/App.tsx) using `react-router-dom`. Two layout modes:

**Standard (Header + Dither + Footer):**
| Path                  | Component                                                                |
|-----------------------|--------------------------------------------------------------------------|
| `/`                   | [`Home`](../src/pages/Home.tsx) — hero, stats, marquee, mission, CTA     |
| `/about`              | [`About`](../src/pages/About.tsx)                                        |
| `/partners`           | [`Partners`](../src/pages/Partners.tsx)                                  |
| `/experiences`           | [`Experiences`](../src/pages/Experiences.tsx)                            |
| `/experiences/snapsting` | [`SnapstingActivities`](../src/pages/SnapstingActivities.tsx)            |
| `/experiences/pavillon`  | [`PavillonActivities`](../src/pages/PavillonActivities.tsx)              |
| `/news`               | [`News`](../src/pages/News.tsx)                                          |
| `/news/launch`        | [`news/Launch`](../src/pages/news/)                                      |
| `/news/newsletter-1`  | [`news/Newsletter01`](../src/pages/news/) — Newsletter No. 1 web version |
| `/faq`                | [`FAQ`](../src/pages/FAQ.tsx)                                            |
| `/contact`            | [`Contact`](../src/pages/Contact.tsx)                                    |
| `/resources`          | [`Resources`](../src/pages/Resources.tsx) — cream bg, no Dither, tabbed grant-data reference |

**Full-screen (no header/footer):**
| Path                | Component                                                                  |
|---------------------|----------------------------------------------------------------------------|
| `/newsletter`       | [`Newsletter`](../src/pages/Newsletter.tsx) — split form + image           |
| `/underconstruction`| [`UnderConstruction`](../src/pages/UnderConstruction.tsx)                  |

**Style-test / WIP routes** (kept in `App.tsx`, not linked from nav): `/lynch-home`, `/lynch-about`, `/ismaila-home`, `/brand-home`. `/lynch-home` opts out of the Dither background via `NO_DITHER_ROUTES`.

The nav label **Experiences** matches the route `/experiences`. See [`Header.tsx`](../src/components/Header/Header.tsx).

---

## Shared Components

Located under [`src/components/`](../src/components/).

- **[`Header`](../src/components/Header/Header.tsx)** — Sticky, blurred charcoal bar (`rgba(32,33,36,0.92)` + `backdrop-blur-md`), 64px tall, lilac accents, hamburger on mobile.
- **[`Footer`](../src/components/Footer/Footer.tsx)** — `bg-brand-charcoal`, 3-column grid (`md:grid-cols-3`), purple/20 top border, lilac social-icon ring buttons.
- **[`DitherBackground`](../src/components/DitherBackground/)** — Full-viewport WebGL/canvas dither effect. Mounted by `Layout` for all routes except those in `NO_DITHER_ROUTES`. Pages rendered on top should use translucent surfaces (`bg-brand-charcoal/70 backdrop-blur-sm`) to let it show through.
- **[`Dither`](../src/components/Dither/)** — Lower-level dither primitive used by `DitherBackground`.
- **[`LineWaves`](../src/components/LineWaves/)** — Animated line/wave decoration (currently exercised on test pages).
- **[`LogoMarquee`](../src/components/LogoMarquee/)** — Horizontally scrolling partner-logo strip used on `Home`.
- **[`Lightbox`](../src/components/Lightbox/)** — Modal image viewer for galleries (used by News).
- **[`ScrollToTop`](../src/components/ScrollToTop.tsx)** — Resets scroll position on route change.

---

## Accessibility Patterns (non-negotiable — keep these when building new UI)

- **Focus ring:** a global `:focus-visible` rule in [`global.css`](../src/styles/global.css) draws a 2px solid `#DA80FF` outline (offset 2px) on every keyboard-focused element. Never add `focus:outline-none` without providing an equal-or-better replacement indicator (the Contact/Newsletter inputs do this with a 2px lilac ring/border).
- **Contrast floors:** text uses the `--ink-*` tokens (min `--ink-subtle` ≈ 5.3:1). On the light Resources page, charcoal text must be ≥ `rgba(32,33,36,0.65)` for small sizes. Lilac accent text/glyphs at small sizes use full `#DA80FF` (≈6.4:1 on charcoal), never a faded rgba.
- **Required fields:** label gets a lilac `＊` wrapped in `aria-hidden="true"` (the input already has `aria-required`), plus a "Fields marked ＊ are required." note at the top of the form. See [`Contact.tsx`](../src/pages/Contact.tsx).
- **Images:** real content images get descriptive alt written from what's in the picture (see [`galleries.ts`](../src/data/galleries.ts)); a logo adjacent to visible text with the same name gets `alt=""` (Partners cards); purely decorative/duplicated visuals get `aria-hidden="true"` on the wrapper (LogoMarquee, DitherBackground). Never let an image announce a filename or code.
- **Modals:** follow [`Lightbox.tsx`](../src/components/Lightbox/Lightbox.tsx) — `role="dialog"` + `aria-modal`, move focus in on open, trap Tab while open, close on Esc, return focus to the opener.
- **Repeated action links** ("Access file →" style): identical visible text is fine in a row context, but each link needs a distinguishing `aria-label` (see Resources deliverables/media).
- **Page titles:** every new route gets an entry in `PAGE_TITLES` in [`App.tsx`](../src/App.tsx) (`"Section — Immersive ECHO"`).
- **Reduced motion:** all animation honors `prefers-reduced-motion: reduce` — keep doing this for any new animation.
- **Reflow:** at 320px nothing may scroll the page horizontally; wide data (tables, timelines) scrolls inside its own `overflow-x: auto` container, and grid children that must shrink get `min-width: 0`.

## Component Patterns

### Sticky Header
See [`Header.tsx`](../src/components/Header/Header.tsx). Translucent charcoal with blur, lilac border-bottom at 30% opacity. Active route uses `color: #DA80FF` **plus an underline** (`underline underline-offset-8 decoration-2`) — the non-color cue is required for WCAG 1.4.1, and React Router's `NavLink` adds `aria-current="page"` automatically. Default links use `rgba(247,243,224,0.65)`. Mobile hamburger reveals a stacked dropdown; `Esc` closes it and returns focus to the toggle.

### Primary CTA (Lilac shine button)
```tsx
<button
  className="shine-cta px-10 py-3 bg-brand-lilac text-brand-charcoal rounded-lg
             font-bold text-xs uppercase tracking-widest
             hover:shadow-[0_0_20px_#DA80FF,0_0_40px_rgba(218,128,255,0.25)]
             transition-shadow duration-300"
  style={{ fontFamily: 'Montserrat, sans-serif' }}
>
  Subscribe to our Newsletter
</button>
```
The `shine-cta` class adds a diagonal sheen sweep on hover — defined per-page via inline `<style>` (see [`Home.tsx`](../src/pages/Home.tsx#L114-L126)).

### Ghost / Outline Button
```tsx
<a
  className="border border-brand-lilac px-4 py-2 font-bold uppercase text-xs rounded-md
             transition-all duration-300 hover:bg-brand-lilac/10
             hover:shadow-[0_0_14px_rgba(218,128,255,0.35)]"
  style={{ fontFamily: 'Montserrat, sans-serif', color: '#DA80FF' }}
>
  Enter ECHO System ↗
</a>
```

### Stats Grid (hairline)
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-lilac/20
                border border-brand-lilac/25 rounded-xl overflow-hidden">
  <div className="bg-brand-charcoal/70 backdrop-blur-sm px-6 py-5 text-center">
    <div className="text-3xl font-extrabold text-brand-lilac tabular-nums"
         style={{ fontFamily: 'Montserrat, sans-serif' }}>15</div>
    <div className="text-xs uppercase tracking-widest"
         style={{ fontFamily: 'Montserrat, sans-serif',
                  color: 'rgba(247,243,224,0.5)' }}>Partners</div>
  </div>
  {/* ... */}
</div>
```
The `gap-px` over a lilac/20 background renders as 1px hairlines between cells.

### Newsletter / CTA Panel
```tsx
<div
  className="relative border border-brand-purple/40 rounded-xl backdrop-blur-sm
             py-16 px-8 text-center max-w-2xl mx-auto"
  style={{ backgroundColor: 'rgba(90,66,99,0.35)',
           boxShadow: 'inset 0 0 60px rgba(136,67,163,0.12)' }}
>
  <p className="text-xs font-bold uppercase tracking-widest text-brand-lilac mb-3">Newsletter</p>
  <p className="font-bold text-lg text-brand-cream mb-7">Stay updated on Immersive ECHO</p>
  {/* shine-cta button */}
</div>
```

### Pull Quote
```tsx
<div className="border-l-2 border-brand-lilac pl-7 flex flex-col justify-center">
  <div className="text-5xl text-brand-lilac/30">&ldquo;</div>
  <p className="italic" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300,
       color: 'rgba(247,243,224,0.9)' }}>…</p>
  <div className="w-8 h-px bg-brand-lilac/35 mt-5" />
</div>
```

### Tab Bar (Resources page)
```tsx
const TABS = [{ id: 'wp', label: 'Work Packages' }, /* … */] as const
type TabId = typeof TABS[number]['id']
const [activeTab, setActiveTab] = useState<TabId>('wp')

<div className="flex overflow-x-auto border-b mb-8" style={{ borderColor: 'rgba(32,33,36,0.18)' }}>
  {TABS.map(tab => (
    <button
      key={tab.id}
      type="button"
      onClick={() => setActiveTab(tab.id)}
      className="shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap"
      style={{
        fontFamily: 'Montserrat, sans-serif',
        color: activeTab === tab.id ? '#8843A3' : 'rgba(32,33,36,0.45)',
        borderBottom: activeTab === tab.id ? '2px solid #8843A3' : '2px solid transparent',
        marginBottom: '-1px',
      }}
    >
      {tab.label}
    </button>
  ))}
</div>
```
Used on the cream Resources page. Active tab: purple underline + `#8843A3` text. Inactive: charcoal/45. Tab bar scrolls horizontally on mobile (`overflow-x-auto`).

### Logos on Cream Background
White partner logos use `filter: invert(1)` to render as black on the cream `#F7F3E0` page background. Only applies on cream pages — on dark (charcoal) pages logos display as-is.
```tsx
<img src={`/logos/partner_logos/${code}.png`} style={{ filter: 'invert(1)' }} />
```

### Deliverable Status States
Each deliverable row in the Resources Deliverables tab has three possible states, checked in order:

| Priority | Condition | Display |
|----------|-----------|---------|
| 1 | `d.status` is set | Custom text in green `#16a34a` (e.g. `"You are here!"`) |
| 2 | `d.href` is set | `"Access file →"` link in purple `#8843A3`, opens in new tab |
| 3 | Neither | `"Pending"` in charcoal/35 |

To link a deliverable: add `href: 'https://drive.google.com/...'` to its entry in the `deliverables` array in `src/pages/Resources.tsx`. Files are hosted on Google Drive so partners can publish without a redeploy.

To add a custom status label: add `status: 'Your text'` to the entry. `status` takes priority over `href`.

### Past-Date Indicator
Dates that have passed are highlighted in green `#16a34a`. Used in the Milestones tab of Resources. The `isPast(m)` helper checks if the first day of the month *after* the due month has passed — so a May due date only turns green on June 1.
```ts
function isPast(m: number): boolean {
  const firstOfNextMonth = new Date(PROJECT_START.year, PROJECT_START.monthIndex + m, 1)
  return firstOfNextMonth < new Date()
}
// In JSX:
style={{ color: isPast(m.due) ? '#16a34a' : 'rgba(32,33,36,0.55)' }}
```

### Section Divider with Label
```tsx
<div className="border-t border-brand-purple/30 my-10 relative">
  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 text-xs uppercase
                   tracking-widest text-brand-lilac"
        style={{ fontFamily: 'Montserrat, sans-serif', backgroundColor: '#202124' }}>
    Stay Connected
  </span>
</div>
```
Note the explicit `backgroundColor` matching the page so the label "cuts" the rule.

### Footer
See [`Footer.tsx`](../src/components/Footer/Footer.tsx). `bg-brand-charcoal`, 3 columns on `md+`, purple/20 top border, social icons as 36px lilac-ringed circles with hover glow.

---

## Animation Patterns

Animations live alongside the components that use them — usually as a per-page `<style>` block plus `data-reveal` attributes. See [`Home.tsx`](../src/pages/Home.tsx) for the canonical examples.

- **`page-fade`** — global 1900ms opacity fade on every route change. Defined in [`global.css`](../src/styles/global.css), keyed by `pathname` in `Layout` so it restarts on navigation. Opacity-only on purpose (a transform would create a containing block and trap the fixed Dither canvas).
- **`fade-up`** — 700ms `translateY(20px) → 0` + opacity, used for hero entrance with `animationDelay` staggers.
- **`data-reveal`** — IntersectionObserver-driven scroll reveal. Element starts at `opacity: 0; transform: translateY(20px)` with an 800ms transition; observer sets opacity/transform to final values when 15% visible. Optional `data-reveal-delay="200"` for staggering.
- **Count-up stats** — `IntersectionObserver` at 0.4 threshold triggers a `requestAnimationFrame` ease-out count from 0 → target with 120ms stagger between cells.
- **`shine-cta::before`** — diagonal sheen sweep (`-120% → 120%` left, 700ms) on lilac primary buttons.
- **`scrollPulse`** — 2s vertical scale pulse on the hero scroll-hint line.

All of the above respect `prefers-reduced-motion: reduce` — either disable the animation or jump to the final state.

---

## Responsive Breakpoints

Default Tailwind breakpoints. Common usage in this project:

| Breakpoint | Width    | What changes                                                         |
|------------|----------|----------------------------------------------------------------------|
| (base)     | < 640px  | Single column, stacked nav (hamburger), CTAs may hide                |
| `sm`       | 640px+   | Header CTA appears, hero padding loosens                             |
| `md`       | 768px+   | Multi-column grids (`md:grid-cols-3`, `md:grid-cols-4`), desktop nav |
| `lg`       | 1024px+  | Final layout polish where used                                       |

Page horizontal padding is centralized via the `--page-pad` CSS var in `Home.tsx` (1rem / 1.5rem / 2rem at base / sm / md). For other pages, `Layout`'s `p-4 md:p-8` on `<main>` covers it.

---

## Accessibility Checklist

- Semantic structure: `<header>`, `<nav>`, `<main>`, `<footer>` are used in `App.tsx` / `Header` / `Footer`.
- All `<img>` elements have descriptive `alt` text (e.g. logo: `alt="Immersive ECHO"`).
- Icon-only buttons / links carry `aria-label` (hamburger, footer social icons).
- Nav menu uses `aria-expanded` and `aria-controls` on the hamburger toggle.
- Focus states: rely on Tailwind defaults — never strip the focus ring without replacing it.
- Color contrast: cream on charcoal passes 4.5:1; check any opacity-reduced text against the background.
- All animations honor `prefers-reduced-motion: reduce`.
- Target tap size: ≥ 40×40px on mobile (hamburger is `w-10 h-10`).

---

## Assets & Images

- **File format:** WebP preferred, JPG fallback for photos; SVG / PNG for logos and icons.
- **Naming:** `kebab-case`, descriptive (e.g. `logo-horizontal-light.png`, `snapsting-festival-viborg.webp`).
- **Locations:**
  - [`public/img/`](../public/img/) — photos, hero images, page imagery
  - [`public/logos/`](../public/logos/) — partner / coordinator logos, header logo
  - [`public/charts/`](../public/charts/) — infographics and data visuals
- **References from code:** Use absolute URLs (`/logos/...`) since these resolve from `public/`. Imports are not required.
- **Brand assets reference:** [`docs/branding/`](branding/) holds the canonical brand-kit pages (`logo-kit.html`, `color.html`, `typography.html`) and the source-of-truth `brand.css`.

### Favicon

- **Primary:** [`public/logos/favicon.svg`](../public/logos/favicon.svg) — geometry inverted so the figure is the filled shape and the background is transparent. Embeds a `<style>` block that fills `g` with `#202124` (charcoal) on light tabs and `#F7F3E0` (cream) on dark tabs via `prefers-color-scheme`.
- **Fallback:** [`public/logos/favicon.png`](../public/logos/favicon.png) — 499×500 PNG for browsers without SVG-favicon support.
- **Wiring:** `index.html` carries both with a cache-busting `?v=N` query — bump `N` when the asset changes so browsers (and especially Safari, which caches favicons aggressively) pick up the new file.
- **Browser support:** Chrome and Firefox honor the dark-mode swap. Safari renders the SVG but ignores the `prefers-color-scheme` media query, so the `fill="#202124"` attribute on the `<g>` element acts as Safari's static fallback.
