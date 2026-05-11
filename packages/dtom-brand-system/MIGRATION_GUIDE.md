# Migration Guide — Updating Existing ATOM Web Apps to @nirmata/dtom-brand-system

This is the direct developer checklist for moving any existing ATOM web app onto the canonical ΔTOM brand system package.

---

## Phase 1 — Install the package and CSS

- [ ] Install the package:
  ```bash
  npm install @nirmata/dtom-brand-system
  ```
- [ ] Confirm peer dependencies are present: `react`, `react-dom`, `next`, `gsap`, `lucide-react`.
- [ ] Copy assets to `public/`:
  ```bash
  cp -r node_modules/@nirmata/dtom-brand-system/public/dtom-assets ./public/
  ```
  Verify these files exist after copy:
  - `public/dtom-assets/dtom-canonical-logo.jpg`
  - `public/dtom-assets/sales-dominator/*.jpg` (12 files)
- [ ] Add `postinstall` script to `package.json` so assets are copied in CI:
  ```json
  "postinstall": "cp -r node_modules/@nirmata/dtom-brand-system/public/dtom-assets public/"
  ```
- [ ] Import CSS once at root layout — **before any other stylesheets**:
  ```ts
  import '@nirmata/dtom-brand-system/styles';
  ```
  (In Next.js App Router: `app/layout.tsx`. In Pages Router: `pages/_app.tsx`.)
- [ ] Add Fontshare + Google Fonts `<link>` tags to root `<head>`:
  ```html
  <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300..800&display=swap" rel="stylesheet">
  ```
- [ ] Add GSAP + ScrollTrigger via `<Script strategy="lazyOnload">` in root layout.

---

## Phase 2 — Wrap the app in DtomBrandShell

- [ ] Import and add `DtomBrandShell` at the root layout (above all page content):
  ```tsx
  import { DtomBrandShell } from '@nirmata/dtom-brand-system';

  <DtomBrandShell assetBasePath="/dtom-assets" theme="dark" brand="atom">
    {children}
  </DtomBrandShell>
  ```
- [ ] Remove any existing ad-hoc dark-mode or theme wrapper that conflicts.
- [ ] Confirm `data-dtom-theme="dark"` appears on the wrapper element in the DOM.

---

## Phase 3 — Replace logo and wordmark

- [ ] Remove all existing logo components, `<img>` tags, and wordmark text that use the old ATOM logo or generic icon library atom icons.
- [ ] Replace with `DtomLogo`:
  ```tsx
  import { DtomLogo } from '@nirmata/dtom-brand-system';

  // Navigation header (default: SVG orbital mark)
  <DtomLogo href="/" size="md" spinning />

  // Hero lockup
  <DtomLogo size="hero" useCanonicalImage />  // uses dtom-canonical-logo.jpg

  // Footer
  <DtomLogo size="sm" spinning={false} />
  ```
- [ ] Verify: the rendered wordmark shows `ΔT`**`O`**`M` — the `O` is teal, all other letters are white. No plain `ATOM` in rendered UI text.
- [ ] Verify: orbits spin counter-clockwise only.
- [ ] Verify: no generic icon library atom mark is used anywhere.

---

## Phase 4 — Replace loaders and loading states

- [ ] Remove all existing loading spinners, skeleton loaders used as initial page loaders.
- [ ] Add `DtomBootLoader` as the cinematic initial loader:
  ```tsx
  'use client';
  import dynamic from 'next/dynamic';
  const DtomBootLoader = dynamic(
    () => import('@nirmata/dtom-brand-system').then(m => m.DtomBootLoader),
    { ssr: false }
  );

  const [ready, setReady] = useState(false);

  <DtomBootLoader active={!ready} onComplete={() => setReady(true)} minimumDrama={2200} />
  ```
- [ ] Confirm: LLM label shows `ΔTOM - NirmX-UFO`. Voice label shows `Pi3 - SiQ`.
- [ ] Confirm: No weapon-sight or gunsight imagery in the loader.

---

## Phase 5 — Add DtomHero to landing/marketing pages

- [ ] Replace any existing hero sections on marketing or landing pages:
  ```tsx
  import { DtomHero } from '@nirmata/dtom-brand-system';

  <DtomHero
    eyebrow="v3.0 · Black-Site Aerospace Brand System"
    headline="Your mission-specific ΔTOM headline here."
    body="Supporting copy using the ΔTOM brand voice: commanding, intelligent, human-forward."
    primaryCta={{ label: 'Ignite command layer', href: '#demo' }}
    secondaryCta={{ label: 'Run voice telemetry', href: '#system' }}
  />
  ```
- [ ] Confirm: telemetry capsule shows `AtomDominator.com` as the literal domain value.
- [ ] Confirm: no generic AI copy ("unlock the power", "seamless solution", "empower your business").

---

## Phase 6 — Add DtomPinnedKeynote for Sales Dominator

- [ ] If the app has a Sales Dominator product showcase, replace it with `DtomPinnedKeynote`:
  ```tsx
  const DtomPinnedKeynote = dynamic(
    () => import('@nirmata/dtom-brand-system').then(m => m.DtomPinnedKeynote),
    { ssr: false }
  );

  <DtomPinnedKeynote assetBasePath="/dtom-assets" />
  ```
- [ ] Confirm: 12 chapters render with correct screenshots from `public/dtom-assets/sales-dominator/`.
- [ ] Confirm: clicking a screenshot opens MissionDossier overlay.
- [ ] Confirm: Escape key closes the overlay and focus returns to the trigger button.
- [ ] Test `prefers-reduced-motion: reduce` in browser DevTools — must render static stacked layout with no pinned scrub.

---

## Phase 7 — Preserve domain literal AtomDominator.com

- [ ] Search entire codebase for any display of `atomdominator.com`, `ATOM Dominator`, or `ATOMDOMINATOR`:
  ```bash
  grep -ri "atomdominator\|atom dominator" src/ pages/ app/ components/
  ```
- [ ] All display references must use the literal: `AtomDominator.com` (mixed case, no modification).
- [ ] Production links must point to `https://AtomDominator.com`.
- [ ] Telemetry capsule in `DtomHero` and dossier footers must show `AtomDominator.com`.

---

## Phase 8 — Enforce ΔTOM wordmark everywhere

- [ ] Search for any remaining plain `ATOM` in visible UI text (not in domain strings):
  ```bash
  grep -r "\bATOM\b\|\bAtom\b" src/ pages/ app/ components/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.html"
  ```
- [ ] Replace all UI-facing `ATOM` text with `ΔTOM` (U+0394 T O M).
- [ ] Exception: literal domain strings `AtomDominator.com` and `ATOMDOMINATOR.COM` must remain unchanged.

---

## Phase 9 — Remove retired sub-brands

- [ ] Search for and remove any reference to retired sub-brands:
  ```bash
  grep -ri "clinixai\|rrg\.bio\|thingk tangk\|humanos" src/ pages/ app/ public/ --include="*.tsx,*.ts,*.html,*.md"
  ```
- [ ] Remove from navigation, footers, brand pages, meta tags, and any marketing copy.
- [ ] Active sub-brand registry: **Nirmata Holdings**, **ΔTOM**, **AntimatterAI** only.

---

## Phase 10 — QA pass

### Accessibility
- [ ] Run axe DevTools or browser accessibility audit — no critical violations.
- [ ] Tab through the full page — all interactive elements are reachable and have visible `:focus-visible` states.
- [ ] Open MissionDossier and confirm: focus traps inside dialog, Escape closes, focus returns to trigger.
- [ ] All icon-only controls have accessible labels.

### Visual / performance
- [ ] Test at 1440px (desktop), 1024px (laptop), 768px (tablet), 375px (mobile).
- [ ] `DtomPinnedKeynote`: confirm pinned scrub on desktop, static stack on ≤860px.
- [ ] Verify no pure `#000` or `#fff` surfaces — use token values.
- [ ] Confirm teal accent (`#00e6d3`) is the only primary color — no rainbow gradient backgrounds.
- [ ] Confirm `DtomBootLoader` exits cleanly with no layout flash.

### Reduced-motion
- [ ] Enable `prefers-reduced-motion: reduce` in browser DevTools (`Rendering` panel → Emulate CSS media).
- [ ] Verify: loader exits immediately (~400ms), no scanline or orbit animations.
- [ ] Verify: `DtomPinnedKeynote` shows static stacked layout.
- [ ] Verify: logo orbits are static (no CSS animation).
- [ ] Verify: all GSAP animations fall back gracefully.

### Brand compliance
- [ ] Every visible instance of the brand shows `ΔTOM` — never `ATOM`.
- [ ] Domain in footers and telemetry: `AtomDominator.com`.
- [ ] Logo mark is the canonical SVG or `dtom-canonical-logo.jpg` — no generic atom icons.
- [ ] No retired sub-brands visible anywhere in the UI.

---

*See `docs/ATOM_UPDATE_CHECKLIST.md` for the condensed operational version of this guide.*
