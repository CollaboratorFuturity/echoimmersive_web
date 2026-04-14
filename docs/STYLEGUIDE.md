# Immersive ECHO -- Style Guide

Use this to replicate the project's visual language across all pages and components. Every visual decision goes here so future sessions don't reinvent or contradict what already exists.

---

## Color Palette

> Colors below are extracted from the wireframe as a starting reference. Final brand palette TBD — update this section before Phase 2 build begins.

### Primary / CTA
| Name          | Hex       | Tailwind equiv | Use                              |
|---------------|-----------|----------------|----------------------------------|
| cta-dark      | `#4b5563` | `gray-600`     | Primary CTA buttons (newsletter subscribe) |
| footer-bg     | `#1f2937` | `gray-800`     | Footer background, newsletter page dark side |

### Neutrals
| Name        | Hex       | Tailwind equiv | Use                              |
|-------------|-----------|----------------|----------------------------------|
| bg          | `#f9fafb` | `gray-50`      | Page background                  |
| surface      | `#e5e7eb` | `gray-200`     | Cards, panels, wireframe boxes   |
| border       | `#9ca3af` | `gray-400`     | Borders, dividers                |
| text         | `#374151` | `gray-700`     | Body text                        |
| text-muted   | `#6b7280` | `gray-500`     | Secondary text, captions, labels |
| heading      | `#1f2937` | `gray-800`     | Headings, strong emphasis        |
| heading-light | `#d1d5db` | `gray-300`    | Pull quote decorative marks (`"`) |

<!--
  Once brand colors are defined, add:
  | primary     | #??????     | Main buttons, key actions, links |
  | primary-light | #?????? | Hover states, light backgrounds |
  | accent      | #??????     | Highlights, badges, secondary CTA |
-->

---

## Typography

**Font stack:**
```
'DM Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```
**Secondary (body copy / mission text):**
```
Georgia, 'Times New Roman', serif
```

| Element                  | Size     | Weight | Color        | Notes                         |
|--------------------------|----------|--------|--------------|-------------------------------|
| Page heading (h1)        | `30px`   | `800`  | heading      | Letter-spacing: `0.04em`      |
| Section heading (h2)     | `24px`   | `700`  | heading      |                               |
| Card heading (h3)        | `18px`   | `700`  | heading      |                               |
| Body text                | `16px`   | `400`  | text         |                               |
| Mission / editorial body | `16px`   | `400`  | `gray-700`   | Uses Georgia serif            |
| Small / label text       | `14px`   | `400`  | text-muted   |                               |
| Micro label (uppercase)  | `12px`   | `700`  | text-muted   | `letter-spacing: 0.1em`       |
| FAQ button text          | `14px`   | `600`  | heading      |                               |

---

## Spacing & Layout

| Concept              | Value    | Notes                                        |
|----------------------|----------|----------------------------------------------|
| Page max-width       | `1152px` | `max-w-6xl` — centered with auto margins     |
| Page padding         | `16px / 32px` | `p-4` mobile, `p-8` desktop (md+)       |
| Section gap          | `48px`   | `mb-12` between major blocks                 |
| Card padding         | `24px`   | `p-6` internal padding                       |
| Card gap             | `16px`   | `gap-4` between cards in a grid             |
| Border radius        | `8px`    | Cards, buttons, inputs (`rounded-lg`)        |
| Header height        | ~`64px`  | Sticky, `border-b-4`                         |
| Stats row columns    | `2 mobile / 4 desktop` | Grid for project facts          |

---

## Pages & Sections

The site has 8 pages navigated via a single-page JS router. Header and footer are shared across all pages except the Newsletter page (which hides both).

| Page ID      | Nav Label       | Description                                              |
|--------------|-----------------|----------------------------------------------------------|
| `home`       | Home            | Hero, mission text (3 paragraphs), newsletter CTA        |
| `about`      | About           | Mission, dual-track approach cards, infographic, stats, project details |
| `partners`   | Partners        | LSP coordinator logo, 14 core partner logos, 6 associated |
| `pilots`     | Pilots          | 2 testbed cards: Snapsting (Viborg) + Le Pavillon (Namur) |
| `news`       | News & Events   | Feed with type filters, article cards, event gallery sidebar + media kit download |
| `faq`        | FAQ             | 12 accordion items, max-width `3xl`                      |
| `contact`    | Contact         | Contact form (Name, Org, Subject, Message) + coordinator info + social icons + newsletter CTA |
| `newsletter` | —               | Full-screen split: dark form left, image right; hides header/footer |

---

## Component Patterns

### Navigation
```html
<header class="sticky top-0 bg-white border-b-4 border-gray-400 z-50 p-4 shadow-sm">
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
    <!-- Logo -->
    <!-- <nav> with .nav-link items -->
    <!-- CTA button: "Enter ECHO System ↗" -->
  </div>
</header>
```
- Active nav link: `font-weight: bold; text-decoration: underline`
- CTA button opens the ECHOSYSTEM interactive dashboard in a new tab

### Primary Button
```html
<button class="border-2 border-gray-800 bg-gray-100 px-4 py-2 font-bold uppercase text-sm rounded-md hover:bg-gray-200">
  Label
</button>
```

### Dark CTA Button (newsletter / contact)
```html
<button style="padding: 0.75rem 2.5rem; background:#4b5563; color:white; border:none; border-radius:8px; font-weight:700; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer;">
  Subscribe to our Newsletter
</button>
```

### Stat Card
```html
<div class="border-2 border-gray-400 p-5 text-center">
  <div class="text-3xl font-extrabold mb-1">15</div>
  <div class="text-xs uppercase tracking-wider text-gray-500">Partners</div>
</div>
```

### FAQ Accordion
```html
<div class="border-2 border-gray-300 rounded-lg overflow-hidden">
  <button class="faq-btn" onclick="toggleFaq(this)">
    Question text
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">Answer text</div>
</div>
```
- `faq-answer` is hidden by default; `.open` class reveals it
- Icon toggles between `+` and `−`

### Section Divider with Label
```html
<div class="border-t-2 border-dashed border-gray-300 my-10 relative">
  <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-50 px-4 text-xs text-gray-400 uppercase tracking-widest">
    Section Label
  </span>
</div>
```

### Pilot / Feature Card
```html
<div class="border-2 border-gray-400 p-6">
  <!-- image placeholder -->
  <span class="bg-gray-300 px-2 py-1 text-xs font-bold mb-2 inline-block">BADGE</span>
  <h2 class="text-2xl font-bold mb-2">Title</h2>
  <h3 class="text-lg text-gray-500 mb-4">📍 Location</h3>
  <!-- text content -->
  <button class="wf-button">CTA</button>
</div>
```

### News Article Card
```html
<div class="flex gap-4 border-2 border-gray-300 p-4">
  <div class="w-32 h-32 shrink-0"><!-- thumb --></div>
  <div>
    <span class="text-xs font-bold text-gray-500">TYPE | Date</span>
    <h3 class="text-lg font-bold mb-2">Headline</h3>
    <!-- excerpt -->
    <a href="#" class="underline text-sm font-bold">Read More →</a>
  </div>
</div>
```

### Footer
3-column grid on desktop (stacked on mobile). Dark background `#1f2937`. Contains: brand name + social icons, quick links, EU funding acknowledgement + project details.

### Newsletter Page
Full-screen split layout (hides header and footer). Left: dark form (`bg-gray-800`). Right: image placeholder. On mobile stacks vertically.

---

## Responsive Breakpoints

| Breakpoint | Width    | What changes                                   |
|------------|----------|------------------------------------------------|
| Mobile     | < 768px  | Single column, stacked layout, hamburger nav   |
| Tablet     | 768px+   | Two columns where appropriate                  |
| Desktop    | 1024px+  | Full layout, all columns visible               |

---

## Accessibility Checklist

- Semantic HTML: proper use of `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- All images have descriptive `alt` text
- Color contrast: minimum 4.5:1 ratio for text
- All interactive elements keyboard-accessible
- `aria-label` on icon-only buttons and links (social icons in footer/contact)
- Focus styles visible on all interactive elements
- Skip-to-content link (if applicable)

---

## Assets & Images

- File format: WebP preferred, JPG fallback; SVG for logos and icons
- Naming convention: `kebab-case`, descriptive (e.g. `snapsting-festival-viborg.webp`)
- Asset locations:
  - `assets/img/` — photos, hero images
  - `assets/logos/` — partner and coordinator logos
  - `assets/icons/` — SVG icon sprites or individual files
- Social icons in contact/footer: inline SVG circles (black fill `#222`, white icon path)
