# Manual Accessibility Verification — Keyboard + VoiceOver

Page-by-page script to confirm the WCAG 2.2 AA fixes on the **rendered** site. Do a clean `make dev` restart first so you're testing current code.

**How to use:** work top to bottom. `[ ]` = check it. All seven previously-KNOWN issues were fixed on 2026-07-28, so **everything in this script should now pass** — anything that doesn't is a finding. Note it in the "Findings" section at the bottom.

**Automated pass already done (2026-07-28):** axe-core (WCAG 2.2 AA ruleset) = **0 violations on all 12 routes**, keyboard simulation (skip link, mobile-menu Esc, Lightbox open/trap/close/focus-return, FAQ Enter/Space), and 320px reflow all verified by headless Chrome. What's left for a human is mainly the **VoiceOver announcements** — the machine confirmed the attributes exist, not how they sound.

---

## Setup

**Keyboard keys:** `Tab` (next), `Shift+Tab` (previous), `Enter` / `Space` (activate), `Esc` (close), arrow keys (within menus/sliders). **Use no mouse for the whole keyboard pass.**

**VoiceOver (macOS):** toggle with `Cmd+F5`. "VO" = `Control+Option`.
- `VO+A` — read continuously from here
- `VO+U` — open the **rotor** (then `←/→` to switch between Headings / Links / Landmarks / Form Controls lists)
- `VO+Cmd+H` — jump to next heading
- `Control` — stop speech
- `Tab` — next form control / link (works alongside VO)

Test in Safari (VoiceOver's best pairing). Optional bonus: also try NVDA on Windows later.

---

## A. Global checks (do once on any page, they apply everywhere)

### Keyboard
- [ ] Load a page, press `Tab` **once** → a **"Skip to main content"** link appears (visible, top-left). `Enter` → focus jumps past the nav into the page body. *(2.4.1 — should PASS)*
- [ ] Keep pressing `Tab` through the whole page → every link/button/field is reachable, in an order that matches what you see. *(2.4.3)*
- [ ] The focus indicator is **always visible** — you can see what's focused at every step. There's now a **global 2px lilac ring** on every focused element (keyboard only — mouse clicks shouldn't show it); the Contact form fields have their own ring. Note anywhere focus "disappears." *(2.4.7 / 2.4.11 — should PASS)*
- [ ] `Shift+Tab` walks backward correctly; focus never gets **stuck** anywhere. *(2.1.2)*

### VoiceOver
- [ ] On load, the browser tab / page title is announced and is **unique per page** — e.g. "About — Immersive ECHO", "Contact — Immersive ECHO". Home is just "Immersive ECHO". Check it updates as you navigate. *(2.4.2 — should PASS)*
- [ ] `VO+U` → **Landmarks**: you should hear **banner** (header), **navigation**, **main**, **contentinfo** (footer). *(1.3.1)*
- [ ] `VO+U` → **Headings**: exactly **one h1**, and the order steps down sensibly. The footer headings ("Quick Links", "About the Project") are now **h2** — no level jump. *(2.4.6 — should PASS)*
- [ ] Logo image announces **"Immersive ECHO"**; the EU logo announces **"Co-funded by the European Union"** (not a filename). *(1.1.1)*

---

## B. Header / navigation (on every page)

### Keyboard
- [ ] `Tab` reaches the logo, then each nav link (Home, About, Partners, Experiences, News & Events, FAQ, Contact), then the **Download Resources** button.
- [ ] **Narrow the window** (< ~768px) so the hamburger appears. `Tab` to it, `Enter`/`Space` → menu opens; `Tab` moves into the menu links; activating a link navigates and closes the menu.
- [ ] With the mobile menu open, press `Esc` → the menu **closes and focus returns to the hamburger button**. *(2.1.2 — should PASS, just added)*

### VoiceOver
- [ ] Nav is announced as a **navigation** landmark; each link reads its label + "link."
- [ ] Hamburger reads **"Toggle navigation, button"** and announces **collapsed/expanded**. *(4.1.2 — should PASS)*
- [ ] The current page's nav link is **underlined** (not just colored), and VoiceOver announces it as **"current page"** (`aria-current` from NavLink). *(1.4.1 — should PASS)*

---

## C. Contact page — the most important one (the form)

### Keyboard
- [ ] `Tab` through: **Name → Email → Organisation → Subject → Message → Send Message.** Order is correct.
- [ ] Each field shows the **new focus ring** (2px lilac) clearly when focused. *(2.4.7 / 2.4.11 — should now PASS for the form)*
- [ ] The field **borders are visible** at rest (muted lilac), not invisible. *(1.4.11 — just fixed)*
- [ ] Clicking a **label** (or its text) focuses the matching field. *(1.3.1)*
- [ ] Submit the form **empty** with `Enter` → the browser blocks it and points at the first required field (Name). Required = Name, Email, Message. *(3.3.1 / 3.3.2)*
- [ ] Social links (Facebook, Instagram) are reachable and activate.

### VoiceOver
- [ ] Focus each field → it announces the **label** ("Name, edit text"), and for Name/Email/Message also **"required."** Visually, those three labels show a **lilac ＊** and the form opens with a "Fields marked ＊ are required" note. *(1.3.1 / 3.3.2 — should PASS)*
- [ ] Trigger an error (e.g. submit with a server offline, or bad input) → the error message is **spoken automatically** without you navigating to it. *(3.3.1 / 4.1.3 role="alert" — should PASS)*
- [ ] On a **successful** submit → focus lands on **"Message sent!"** and VoiceOver announces it. *(4.1.3 role="status" — should PASS)*
- [ ] Social links announce **"Follow us on Facebook, link"** / **"…Instagram, link"** and point to real URLs (open in a new tab). *(2.4.4 — should PASS)*

---

## D. Home page

### Keyboard
- [ ] Nothing in the hero is a keyboard trap; `Tab` reaches the **Subscribe to our Newsletter** button and it activates.
- [ ] **ProjectTimeline** (the interactive timeline lower down): its **← Previous / Next →** controls are reachable and operable by keyboard. *(2.1.1)*

### VoiceOver
- [ ] `h1` reads **"Immersive Echo"**; mission paragraphs read cleanly; stat numbers (15 / 10 / 30 / 2) are announced with their labels.
- [ ] The scrolling partner-logo marquee is **silent** to VoiceOver (decorative, `aria-hidden` — the named partner list lives on /partners and /about).
- [ ] ProjectTimeline prev/next controls announce as buttons with sensible names.

### Reduced motion (optional but quick)
- [ ] System Settings → Accessibility → Display → **Reduce Motion ON**, reload Home → the fade-ins, count-up, and background wave **don't animate**. *(2.2.2 / 2.3.x — should PASS)*

---

## E. About · Partners · Experiences · News · FAQ · Resources

Repeat the **Global (A)** and **Header (B)** checks on each, plus:

**About** — [ ] partner logo images announce a name/alt, not a filename. [ ] Headings step down in order.

**Partners** — [ ] each partner card announces its name **once** (logo `alt` is now empty — the visible name is the link's name; fixed 2026-07-28); location lines announce; card links are reachable with meaningful text.

**Experiences** (`/experiences`, `/experiences/snapsting`, `/experiences/pavillon`) — [ ] any **image gallery / Lightbox**: `Enter` opens it, focus moves **into** it (lands on Close), `Esc` closes it, and **focus returns to the thumbnail you opened**. While open, `Tab` cycles **inside** the lightbox; `←/→` change photos. *(2.1.2 — Lightbox rebuilt & machine-verified 2026-07-28; the main gallery is on `/news/launch`.)*

**News** (`/news`, `/news/launch`) — [ ] article links have **meaningful text** (not "read more" alone); dates announce. [ ] On `/news/launch`, each gallery thumbnail announces a **written description of the photo** (e.g. "The consortium posing on a stone staircase inside the Namur citadel…, button") and the Lightbox behaves as described under Experiences.

**FAQ** — [ ] if answers expand/collapse, they toggle with `Enter`/`Space` and announce expanded/collapsed; if it's plain Q&A, just confirm heading order.

**Resources** (big page) — [ ] every **download/link** is reachable and its text says what it is (not "click here"); any tabs/accordions are keyboard-operable; heading structure is sane.

---

## F. Newsletter (full-screen route, no header/footer)

- [ ] Keyboard: `Tab` through the fields, the **consent checkbox** (`Space` toggles it), and Submit.
- [ ] VoiceOver: each field announces its **label** (now properly associated — fixed 2026-07-28; previously placeholder-only); the **consent checkbox** announces its label + checked/unchecked. *(1.3.1)*
- [ ] Note: this route has **no skip link** (it has no repeated nav to skip), which is fine.

---

## G. Footer (every page)

- [ ] Keyboard: all Quick Links + the email + the two social icons are reachable and activate.
- [ ] VoiceOver: it's a **contentinfo** landmark; social icons announce **"Follow us on Facebook/Instagram."**
- [ ] The small print (copyright, EU credit, meta) is now **legible** — this is the biggest contrast change; eyeball it. *(1.4.3 — fixed)*

---

## H. Zoom & reflow (required for AA sign-off)

Do these on **Home, Contact, and Resources** (the audit's highest-risk pages for reflow — Resources and ProjectTimeline especially):

- [ ] Browser zoom **200%** (`Cmd +`): all text scales, nothing clips or overlaps, everything still reachable. *(1.4.4)*
- [ ] Browser zoom **400%** (or narrow the window to **~320px** wide): content reflows to one column with **no horizontal scrolling** of the page body. *(1.4.10)*
- [ ] At 320px, check the **ProjectTimeline** and Resources tables/cards specifically — wide content may scroll inside its own container, but the page itself must not scroll sideways.

---

## Findings (fill in as you go)

| Page / area | Issue | Keyboard or VO | Severity |
|-------------|-------|----------------|----------|
|  |  |  |  |

### Previously-KNOWN items — all fixed 2026-07-28, verify as part of the passes above
1. ✅ Per-route page titles (2.4.2) — section A
2. ✅ Active nav underline + `aria-current` (1.4.1) — section B
3. ✅ Global `:focus-visible` ring on everything (2.4.7 / 2.4.11) — section A
4. ✅ Footer headings now `h2` (2.4.6) — section A
5. ✅ Visible "required" markers on the form (3.3.2) — section C
6. ✅ Mobile menu `Esc`-to-close with focus return — section B
7. ✅ Dither background `aria-hidden` (1.1.1) — VO should never land on it

**Every finding is now a real finding — send it to me and I'll fix it.** Once the keyboard + VoiceOver passes, the zoom/reflow checks (section H), and an axe/Lighthouse scan all come back clean, you have an AA claim — then publish the accessibility statement (EN 301 549).
