# CLAUDE.md — RYC Project Guidelines

Rules and guidelines for Claude when working on the RYC website (`rycworks.com`).

---

## Project Overview

**RYC** is an AI-native digital agency landing page. It is a vanilla static site — no frameworks, no build tools. Every change is a direct edit to `index.html`, `style.css`, or `script.js`.

**Live URL:** https://www.rycworks.com
**Repo:** https://github.com/rasyadgericko/ryc
**Hosting:** Static (Vercel/GitHub Pages)

---

## Stack & Constraints

- **HTML5 / CSS3 / Vanilla JS (ES6+)** — no React, no Tailwind, no bundler
- **No npm install** for the main site — zero runtime dependencies
- **No build step** — files are served directly as-is
- Self-hosted fonts, inline-referenced SVG icons, canvas-based animations
- The `design-system/` folder is a separate Storybook project — do not touch it unless explicitly asked
- **Design system access:** `rycworks.com/?designsystem` redirects to `rycworks.com/storybook/`
- The `/storybook/` folder at root is the **built Storybook output** — do not hand-edit it; always rebuild via `cd design-system && npm run build-storybook`

---

## File Structure

```
/
├── index.html          ← Home page (all main sections)
├── style.css           ← Home page styles (organized by section)
├── script.js           ← Home page JS
├── pricing.html        ← Standalone pricing page
├── pricing/pricing.css ← Pricing page styles
├── pricing/pricing.js  ← Pricing page JS
├── contact.html        ← Standalone contact page
├── contact/contact.css ← Contact page styles
├── contact/contact.js  ← Contact page JS
├── blog.html           ← Blog listing page
├── blog/blog.css       ← Blog styles
├── blog/blog.js        ← Blog JS
├── blog/*.html         ← Individual blog post pages
├── assets/
│   ├── fonts/          ← Self-hosted WOFF2 (Space Grotesk + Permanent Marker)
│   ├── icons/          ← SVG brand logos for the marquee strip
│   ├── ryc-logo.svg    ← SVG logo (used in nav and footer)
│   └── works/          ← Project screenshots (WebP)
├── favicon.ico
├── webclip.png         ← Apple touch icon (180×180)
└── ryc-opengraph.jpg   ← Social preview image (1200×630)
```

---

## Brand Identity

### Colors

All colors use CSS custom properties. Never hardcode a hex value — always use the token.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f1f1f1` | `#0f0f0f` | Page background |
| `--fg` | `#161616` | `#f1f1f1` | Primary text, headings |
| `--fg-muted` | `#555` | `#aaa` | Secondary text |
| `--fg-dim` | `#777` | `#777` | Tertiary text, eyebrows |
| `--border` | `rgba(22,22,22,0.12)` | `rgba(241,241,241,0.1)` | Borders, dividers |
| `--bg-sub` | `#e8e8e8` | `#151515` | Cards, sub-sections |
| `--radius` | `100px` | `100px` | Pill-shaped elements |
| `--ease` | `cubic-bezier(0.16,1,0.3,1)` | same | Custom easing |

**Green pulse** (`#22c55e`) is used only for the availability status dot — do not repurpose it.

### Typography

**Three fonts, no others.** Do not introduce new fonts.

| Font | Weights | Use |
|---|---|---|
| Space Grotesk | 900 (Black), 700 (Bold), 300 (Light) | All headings, body copy, buttons, labels |
| Permanent Marker | 400 | Accent text inside `<em>` tags in headings — brush-style with rotation and underline animation |

**Heading rules:**
- Always `font-weight: 900`, `text-transform: uppercase`, `letter-spacing: -0.04em` to `-0.05em`
- Line height: `0.82`–`1.05` (tight)
- Size: use `clamp()` for responsive scaling, never fixed `px` on headings
- `<em>` inside headings uses Permanent Marker with `transform: rotate(-2deg)`, brush stroke underline via `::after`, and clip-path reveal animation

**Eyebrow/badge rules (hero-badge style):**
- `display: inline-flex`, `padding: 0.55rem 1.2rem`
- `border: 2px solid rgba(241,241,241,0.1)`, `border-radius: var(--radius)`
- `background: linear-gradient(135deg, rgba(255,255,255,0.03), transparent)`
- `font-size: 0.72rem`, `font-weight: 600`, `letter-spacing: 0.12em`, `text-transform: uppercase`, `color: #aaa`
- Use this same pill badge style for all eyebrows/labels across all pages (hero, pricing, contact, CTA pills)

### Visual Style

- Minimalist, high-contrast, premium
- Thin `1px` borders using `var(--border)`
- Subtle noise texture on body (do not remove the `::before` pseudo-element)
- Pill-shaped (`border-radius: var(--radius)`) buttons and tags
- No drop shadows on static elements — shadows only appear on hover

### Unified Card Style (Brand Standard)

All card elements across the site (services, testimonials, insights, pricing, enterprise, CTA blocks) use the same always-dark gradient style:

```css
/* Base dark card */
background: linear-gradient(110deg, #1a1a1a 0.6%, #141414);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 1rem;
color: #f1f1f1;

/* Light theme override (same dark card, slightly lighter) */
[data-theme="light"] .card {
  background: linear-gradient(110deg, #333 0.6%, #222);
  border-color: rgba(255,255,255,0.06);
}

/* Hover */
border-color: rgba(255,255,255,0.2);
transform: translateY(-6px);
```

**Text colors inside cards** (not using CSS custom properties since cards are always dark):
- Primary text: `#eaeaea`
- Secondary text: `rgba(255,255,255,0.55)`
- Tertiary/dim text: `rgba(255,255,255,0.35)`
- Tag borders: `rgba(255,255,255,0.12)`
- Dashed separators: `rgba(255,255,255,0.1)`

**Inverted featured card** (for highlighted pricing): white gradient (`#f1f1f1` → `#e8e8e8`) with dark text (`#161616`).

When creating any new card component, always use this pattern. Do not use `var(--bg)` or `var(--border)` inside card elements — those are for page-level backgrounds only.

---

## Sections Reference

| Section | Selector / ID | Notes |
|---|---|---|
| Navigation | `<nav>` | Fixed, z-index 1000 |
| Hero | `#hero` | Canvas wave animation, do not alter canvas logic |
| Logo Marquee | `.logos-strip` | Infinite scroll; all `<img>` must have `width` + `height` attributes |
| Services | `#services` | 3-col grid → 2 → 1; spotlight hover effect |
| Process | `#process` / `.how-we-work` | 5-step alternating layout with SVG illustrations |
| About | `#about` | Split layout; left = animated canvas grid |
| Work / Portfolio | `#work` | Left sidebar + right tilt card stage |
| Stats | `.stats-strip` | Dark background, 4 metrics; uses inverted border tokens |
| Testimonials | `#testimonials` | Full-width 5-column vertical marquee with always-dark cards |
| CTA | `.cta` | Hero-badge-style floating pills + globe canvas |
| Footer | `<footer>` | 3-col nav + social links |

---

## CSS Rules

### CSS Organization

`style.css` is organized by section — each block is labeled with a comment header like:
```css
/* ===== SECTION NAME ===== */
```
Add new styles in the correct section block, not at the bottom of the file.

### Responsive Breakpoints

Always handle all four breakpoints when adding new components:

| Breakpoint | Target |
|---|---|
| `1200px` | Adjust gaps / layout fine-tuning |
| `1024px` | Collapse 2-column layouts, 3-col → 2-col grids |
| `768px` | Mobile nav, reduce section padding |
| `480px` | Single column everything, tighten typography |

Section padding pattern: `padding: 8rem 4vw` (desktop) → `6rem 5vw` (tablet) → `5rem 6vw` (mobile).

### Animations

- All keyframes go in the `/* ===== ANIMATIONS ===== */` block
- Every animation must have a `@media (prefers-reduced-motion: reduce)` override that disables or flattens it
- Use `var(--ease)` for transitions on interactive elements
- Reveal animations (`.fade-up`, `.reveal-text`) are one-shot — triggered by IntersectionObserver, do not re-trigger

### Specificity

- Do not use `!important`
- Do not use inline styles in HTML (except JS-driven dynamic values like canvas dimensions)
- Theme variants go in `[data-theme="dark"]` blocks, co-located with their base styles
- **Never use `body > *` selectors in page CSS** — specificity 0,3,1 beats `nav[role="navigation"]` (0,1,1) and `.skip-link` (0,1,0), breaking fixed nav and skip-link positioning. Use `main { position: relative; z-index: 1; }` instead (provided by `utility/base.css`)

---

## HTML Rules

### Image Requirements

Every `<img>` must have:
- `width` and `height` attributes (prevents CLS, required for PageSpeed)
- `alt` attribute (empty `alt=""` is acceptable for purely decorative images)
- Use `loading="lazy"` for below-fold images; **never** on above-fold images

### Heading Hierarchy

The page has one `<h1>` (hero). All section titles are `<h2>`. Sub-items within sections are `<h3>`. Do not skip levels.

### Accessibility

- Every icon-only button needs `aria-label`
- Interactive non-button elements (e.g., service rows) need `role="button"` + `tabindex="0"` + keyboard handlers (Enter/Space)
- Form fields need `<label>` or `aria-label`
- Dynamic content updates need `aria-live="polite"` where relevant
- Do not remove `class="skip-link"` from the top of `<body>`

### Meta / SEO

When updating page content (headline, description, services), also update:
- `<title>`
- `<meta name="description">`
- `og:title`, `og:description`
- Schema.org JSON-LD blocks (`<script type="application/ld+json">`)

---

## JavaScript Rules

- All JS lives in `script.js` — no inline `<script>` blocks in HTML (except analytics tags)
- Always check `prefersReducedMotion` before starting canvas or animation logic
- Always check `isTouchDevice` before adding magnetic/tilt effects
- Canvas elements must use `ResizeObserver` to handle responsive resizing
- Canvas must scale by DPR (device pixel ratio): `Math.min(window.devicePixelRatio, 2)`
- Use `IntersectionObserver` to pause animations when off-screen (performance)
- Theme changes must propagate to canvas colors — check the existing `updateTheme()` pattern

---

## Creating & Applying Shared Components

When extracting something into a shared/reusable component (a JS utility, a CSS class, a shared file), follow this process every time — not just for the page you're currently working on.

### Step 1 — Audit before you build

Before creating a component, answer these questions:
- Which pages currently implement this pattern (even partially or inconsistently)?
- Which pages will need to use this component going forward?
- Is the pattern already duplicated somewhere? (If yes — that's a bug to fix, not a feature to add alongside.)

### Step 2 — Build the component cleanly

- Put shared CSS in `utility/` (e.g. `utility/glow-btn.css`, `utility/nav.css`)
- Put shared JS in `utility/` (e.g. `utility/components.js`, `utility/glow-btn.js`)
- Give the component a single, clear initialization path — never let two scripts both initialize the same thing (causes double-wrapping, duplication, broken state)
- Guard against double-init in JS: add a sentinel class (e.g. `.gb-init`) and check for it before running

### Step 3 — Apply to ALL pages, not just the one you're working on

This is the most common failure point. When a component is made shared, immediately audit every page:

```
Pages to check: index.html, pricing.html, contact.html, blog.html, blog/*.html (all posts)
```

For each page, verify:
- [ ] The CSS file is linked in `<head>` (with the correct relative path — `utility/` from root, `../utility/` from `/blog/`)
- [ ] The JS file is loaded in `<body>` in the correct order
- [ ] No page-level duplicate of the component logic exists (remove it if found)
- [ ] The HTML uses the correct class names (e.g. `glow-btn`, `btn-secondary`)
- [ ] CSS selectors are scoped correctly — bare tag selectors like `nav { }` affect ALL matching elements on the page, not just the intended one. Always scope to `nav[role="navigation"]` or a unique class

### Step 4 — Visual QA on every affected page

After applying: run `/webapp-testing` to screenshot nav, footer, and buttons on all pages — desktop and mobile. Do not assume it works just because the code looks right. Specifically check:
- Nav renders horizontally (logo left, links right, CTA button far right)
- Footer renders with correct layout and columns
- Buttons display correctly (not double-wrapped, not unstyled)
- No `<nav>` or other semantic elements are accidentally styled by shared rules

### Common mistakes to avoid

| Mistake | Consequence | Fix |
|---|---|---|
| Initializing a component in both page JS and shared JS | Double-wrapping, broken visual | Remove the duplicate; only shared JS initializes it |
| Loading a shared CSS file only on the page you're editing | Other pages stay broken | Audit all pages every time |
| Using a bare tag selector (`nav`, `footer`) in shared CSS | Unrelated elements (TOC `<nav>`, etc.) get wrong styles | Scope to role/class: `nav[role="navigation"]` |
| Forgetting that blog posts have inline `<style>` not a separate CSS file | nav/footer injected by JS has no styles | Blog posts must load `utility/nav.css` explicitly |
| Moving a file to `utility/` but only updating one page's HTML path | All other pages 404 on the asset | Use grep to find every reference, update all at once |

---

## Adding a New Section

Follow this checklist every time:

1. **HTML** — Add the section in `index.html` in logical page order. Use a semantic element (`<section>`, `<div>`) with an `id` matching its nav anchor.
2. **Nav link** — Add a link in both the desktop nav and the mobile menu if the section is primary.
3. **CSS** — Add a clearly labeled block in `style.css` in the corresponding position. Handle all 4 breakpoints.
4. **Animations** — If the section has reveal animations, add `.fade-up` or `.reveal-text` classes; they are auto-picked up by the IntersectionObserver in `script.js`. Add `prefers-reduced-motion` override.
5. **Accessibility** — Proper heading level, ARIA labels, keyboard support.
6. **Images** — Include `width`, `height`, `alt`, and `loading` attributes.
7. **Dark mode** — Test both themes. Add `[data-theme="dark"]` overrides if needed.
8. **Backup** — After the section is working, ask to create a new `backup/YYYY-MM-DD` branch.

---

## Adding a New Standalone Page

**Start by copying `utility/page-template.html`** — it has all required elements in the correct order. Rename it and replace the `PAGE_TITLE`, `PAGE_DESCRIPTION`, `PAGE_SLUG`, `PAGE_PATH` placeholders.

Every new standalone page **must** load the full shared utility stack. Missing any of these will break the nav, footer, or buttons.

### Required `<head>` links (root-level pages)

Stylesheet order matters — `utility/base.css` MUST come before page CSS:

```html
<!-- Fonts — preload all four -->
<link rel="preload" href="assets/fonts/SpaceGrotesk-Black.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/SpaceGrotesk-Bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/SpaceGrotesk-Light.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/PermanentMarker-Regular.woff2" as="font" type="font/woff2" crossorigin>

<!-- Stylesheets — order matters: base.css MUST come before page CSS -->
<link rel="stylesheet" href="utility/base.css">
<link rel="stylesheet" href="utility/nav.css">
<link rel="stylesheet" href="yourpage/yourpage.css">
<link rel="stylesheet" href="utility/loader.css">
<link rel="stylesheet" href="utility/glow-btn.css">
<link rel="stylesheet" href="utility/page-transition.css">
```

For **blog post pages** (`/blog/*.html`) use `../` prefix:

```html
<link rel="stylesheet" href="../utility/base.css">
<link rel="stylesheet" href="../utility/nav.css">
<link rel="stylesheet" href="../utility/loader.css">
<link rel="stylesheet" href="../utility/glow-btn.css">
<link rel="stylesheet" href="../utility/page-transition.css">
```

### Page CSS files — what NOT to include

Page CSS files (e.g. `pricing/pricing.css`) should contain **only page-specific styles**. Never add:
- `@font-face` declarations — they're in `utility/base.css`
- `:root` or `[data-theme="dark"]` tokens — they're in `utility/base.css`
- `body`, `html`, or reset rules — they're in `utility/base.css`
- `.skip-link` styles — they're in `utility/base.css`
- `body::after` / `body::before` noise texture — it's in `utility/base.css`
- Nav or footer styles — they're in `utility/nav.css`
- **`body > *` selectors** — these fight shared utility CSS and break nav/skip-link positioning. Use `main { position: relative; z-index: 1; }` instead (already in base.css)

### Required `<body>` structure

```html
<!-- Page transition overlay — must be first inside <body> -->
<div class="page-transition" id="pageTransition" aria-hidden="true"></div>

<!-- Loader — MUST use id="pageLoader" (loader.js looks for this exact ID) -->
<div class="loader" id="pageLoader" aria-hidden="true">
  <div class="loader-cube-scene">
    <div class="loader-cube">
      <div class="cube-face cube-front">...</div>
      <!-- ... 5 more cube faces ... -->
    </div>
  </div>
</div>

<!-- Skip link — must be present for accessibility -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Nav injection point -->
<div id="site-nav"></div>

<!-- ... page content ... -->

<!-- Footer injection point -->
<div id="site-footer"></div>
```

### Required scripts (bottom of `<body>`, in this order)

```html
<script src="yourpage/yourpage.js"></script>   <!-- page-specific JS first -->
<script src="utility/loader.js"></script>
<script src="utility/components.js"></script>  <!-- injects nav + footer -->
<script src="utility/glow-btn.js"></script>    <!-- initialises all .glow-btn elements -->
<script src="utility/page-transition.js"></script>
```

**Critical ordering rule:** `utility/glow-btn.js` must run **after** `utility/components.js` (nav CTA is injected by components.js, glow-btn.js must find it). Never initialise glow buttons in page-specific JS — `glow-btn.js` handles all of them globally using a `.gb-init` guard to prevent double-wrapping.

### Nav CSS scoping note

`utility/nav.css` scopes the fixed-position rule to `nav[role="navigation"]` specifically. Do **not** use a bare `nav { position: fixed }` rule in page CSS — it will break any `<nav>` element used for other purposes (e.g. table of contents, breadcrumbs).

### Buttons

- **Primary (glow):** `<a href="..." class="glow-btn"><span>Label</span><svg .../></a>` — JS auto-initialises
- **Secondary (solid B&W):** `<a href="..." class="btn-secondary"><span>Label</span><svg .../></a>`
- Generate via JS: `window.RYC.glowBtn(href, label)` / `window.RYC.secondaryBtn(href, label)`
- Do **not** duplicate the glow-btn init code in page-specific JS — it causes double-wrapping

---

## Adding a New Logo to the Marquee

1. Place the SVG in `assets/icons/`
2. Add the `<img>` tag to **all 4** `.logos-set` divs (they are duplicates for infinite scroll)
3. Include `width`, `height`, `alt=""`, and `class="logo-img"` on every `<img>`
4. The dark mode filter (`brightness(0) invert(1)`) applies automatically via `.logo-img`

---

## Updating the Brand

### Color Change
1. Update the CSS custom property values in `:root` and `[data-theme="dark"]`
2. Update `--accent` and `--accent-glow` if applicable
3. Check canvas colors in `script.js` — they are hardcoded strings that must match the new values
4. Update `ryc-opengraph.jpg` if the brand color change is significant

### Font Change
1. Add new WOFF2 files to `assets/fonts/`
2. Add `@font-face` declarations in `utility/base.css` (single source of truth for all pages)
3. Add `<link rel="preload">` for the new font files in `<head>` of every HTML page that uses them
4. Update all `font-family` references
5. Remove unused font files and their preload links

### Logo / Name Change
Update in all of these locations:
- `<nav>` brand text
- `<footer>` brand text
- `<title>` and all `<meta>` tags
- Schema.org JSON-LD
- `og:site_name`
- `alt` text on any logo images

---

## Git & Backup Workflow

- **Main branch** (`main`) is the production branch — always keep it deployable
- **Backup branches** follow the naming convention `backup/YYYY-MM-DD`
- Create a new backup branch before any significant refactor or brand update
- Never force-push to `main`
- Commit messages should be short and descriptive (e.g., `add pricing section`, `fix mobile nav overflow`, `update hero headline`)

### ⚠️ Push & Deploy Rules

- **NEVER push to `main` unless explicitly instructed.** Wait for a direct instruction like "push to main", "deploy", or "push to prod".
- **NEVER run `git push` of any kind without explicit approval** — not even to a feature branch, unless the user has clearly asked for it.
- `git add` and `git commit` are safe to run when asked to save/commit work. `git push` is not.
- If unsure whether a push was requested, ask before running it.

---

## Skills to Use

Claude Code skills extend my capabilities for specific task types. Use the right skill for the right job rather than doing everything manually.

### `/frontend-design` — New sections, UI components, visual updates

Invoke this skill when:
- Building a new page section from scratch
- Redesigning an existing section (hero, services, pricing, etc.)
- Creating new UI components (cards, buttons, modals, tabs)
- Improving visual polish or layout quality
- Updating the overall look and feel of the site

This skill enforces production-grade design quality and avoids generic AI aesthetics. It is the primary skill for most RYC development work.

```
/frontend-design build a new [section name] section for the RYC site...
```

---

### `/webapp-testing` — Verify changes work correctly in the browser

Invoke this skill when:
- After adding or modifying a section to confirm it renders correctly
- Checking responsive layouts across breakpoints
- Verifying animations, hover states, and interactive elements
- Catching visual regressions after a refactor
- Confirming dark/light theme renders correctly
- Checking PageSpeed or accessibility issues before committing

Uses Playwright to take screenshots and inspect live browser behavior.

```
/webapp-testing check the new [section] on desktop and mobile, both light and dark theme
```

---

### `/canvas-design` — Static visual assets

Invoke this skill when:
- Creating or regenerating `ryc-opengraph.jpg` (social preview image)
- Designing a new illustration or banner asset for the site
- Producing a poster or static graphic for marketing use

Output is a `.png` or `.pdf` file, not HTML.

```
/canvas-design create a new OG image for RYC with the headline "..."
```

---

### `/simplify` — Code review after changes

Invoke this skill after completing any significant edit to `index.html`, `style.css`, or `script.js`. It will:
- Check for redundant or duplicated code
- Suggest cleaner CSS patterns
- Flag unused variables or dead code
- Ensure consistency with existing conventions

```
/simplify
```

---

### `/pdf` — Generating PDF documents

Invoke this skill when:
- Exporting a proposal, case study, or client report as a PDF
- Producing a printable version of any RYC content

---

### Skill Trigger Summary

| Situation | Skill |
|---|---|
| Adding or redesigning a section | `/frontend-design` |
| Checking the site visually after changes | `/webapp-testing` |
| Creating/updating OG image or static art | `/canvas-design` |
| Reviewing code quality after edits | `/simplify` |
| Exporting a client-facing document | `/pdf` |

---

## What NOT to Do

- Do not add inline styles to HTML
- Do not skip accessibility requirements (alt text, ARIA labels, keyboard support)
- Do not hardcode hex colors — use CSS custom properties
- Do not add a new font family without explicit approval
- Do not remove the noise texture, the skip-link, or the theme toggle
- Do not add `<img>` tags without `width`, `height`, and `alt` attributes
- Do not commit `.env` files or API keys
