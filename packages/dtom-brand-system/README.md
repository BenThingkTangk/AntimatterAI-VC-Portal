# @nirmata/dtom-brand-system

**ΔTOM Black-Site Aerospace Cinematic Design System**  
Nirmata Holdings · ΔTOM · AntimatterAI  
Domain: **AtomDominator.com** (real-world literal — never changed in production URLs)

---

## Canonical standard documents

| Document | Role |
|---|---|
| `ATOM_Brand_Design_System_v2.md` | **Strategic standard** — brand positioning, color philosophy, motion personality, type system, layout grammar, GSAP architecture, cinematic directives. Update this first for brand-level changes. |
| **`@nirmata/dtom-brand-system`** (this package) | **Implementation source of truth** — the living React/Next.js component library that encodes the standard. When the standard document changes, update this package. All ATOM apps should import from here, not re-implement the brand. |

If you need to update all ATOM apps, the canonical process is:
1. Update `ATOM_Brand_Design_System_v2.md` with the strategic change.
2. Update this package to reflect the change.
3. Bump the package version, re-copy assets, and re-import in each ATOM app.

---

## What is in this package

| Component | Description |
|---|---|
| `DtomBrandShell` | Root theme wrapper. Sets `data-dtom-theme`, `data-dtom-brand`, `dtom-shell` class, and provides `assetBasePath` context. |
| `DtomLogo` | Canonical logo lockup — SVG orbital atom mark + ΔTOM wordmark. Teal O accent. Spinning orbits. Size variants. |
| `DtomBootLoader` | Cinematic classified aerospace ignition loader. LLM label: ΔTOM - NirmX-UFO. Voice label: Pi3 - SiQ. Stages status lines. No weapon-sight motifs. |
| `DtomHero` | Apple keynote / aerospace command hero. Drifting grid. Telemetry capsule. Side rails. CTA buttons. |
| `DtomPinnedKeynote` | GSAP ScrollTrigger pinned chapter sequence for 12 Sales Dominator modules. Reduced-motion and mobile static fallback. |
| `MissionDossier` | Accessible modal overlay. `role="dialog"`, `aria-modal`, Escape-closes, focus-trap, focus-return. |

---

## Install

```bash
npm install @nirmata/dtom-brand-system
# peer dependencies must already be present:
# react react-dom next gsap lucide-react
```

---

## Import CSS — do this once at root layout

```ts
// app/layout.tsx or _app.tsx — server component is fine
import '@nirmata/dtom-brand-system/styles';
```

All CSS class names are prefixed `dtom-` and scoped to `.dtom-shell` where relevant — no conflicts with Tailwind or other CSS.

---

## Load fonts

Add to `<head>` in your root layout:

```html
<!-- Cabinet Grotesk + Satoshi — Fontshare CDN -->
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet">
<!-- JetBrains Mono — Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300..800&display=swap" rel="stylesheet">
```

---

## Use components

### Root layout — DtomBrandShell

```tsx
// app/layout.tsx
import '@nirmata/dtom-brand-system/styles';
import { DtomBrandShell } from '@nirmata/dtom-brand-system';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DtomBrandShell assetBasePath="/dtom-assets" theme="dark" brand="atom">
          {children}
        </DtomBrandShell>
      </body>
    </html>
  );
}
```

### Boot loader

```tsx
'use client';
import dynamic from 'next/dynamic';
const DtomBootLoader = dynamic(
  () => import('@nirmata/dtom-brand-system').then(m => m.DtomBootLoader),
  { ssr: false }
);

<DtomBootLoader
  onComplete={() => setReady(true)}
  minimumDrama={2200}
  active={!ready}
/>
```

### Logo

```tsx
import { DtomLogo } from '@nirmata/dtom-brand-system';

<DtomLogo href="/" size="md" spinning />
<DtomLogo size="hero" useCanonicalImage />  // uses dtom-canonical-logo.jpg
```

### Hero

```tsx
import { DtomHero } from '@nirmata/dtom-brand-system';

<DtomHero
  headline="ΔTOM ignition for machine-scale command and human-grade nerve."
  body="ΔTOM is the voice AI flagship..."
  primaryCta={{ label: 'Ignite command layer', href: '#demo' }}
  secondaryCta={{ label: 'Run voice telemetry', href: '#system' }}
/>
```

### Pinned Keynote — GSAP SSR note

```tsx
// Must be ssr:false — GSAP needs window globals
const DtomPinnedKeynote = dynamic(
  () => import('@nirmata/dtom-brand-system').then(m => m.DtomPinnedKeynote),
  { ssr: false }
);

<DtomPinnedKeynote assetBasePath="/dtom-assets" />
```

Load GSAP via `<Script>` in your layout (not npm install — GSAP is a peer):
```tsx
<Script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js" strategy="lazyOnload" />
<Script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js" strategy="lazyOnload" />
```

### Mission Dossier

```tsx
import { MissionDossier } from '@nirmata/dtom-brand-system';

<MissionDossier
  open={open}
  onClose={() => setOpen(false)}
  title="ΔTOM War Room"
  missionCode="WAR-03-COMMAND"
  score={97}
  imageSrc="/dtom-assets/sales-dominator/war-room.jpg"
  capabilities={['Command Center', 'Intel Analyzer', 'Deal Pipeline']}
  triggerRef={buttonRef}
/>
```

---

## Copy assets

The `public/dtom-assets` directory in this package contains all required static assets. Copy it to your Next.js `public/` folder:

```bash
cp -r node_modules/@nirmata/dtom-brand-system/public/dtom-assets ./public/
```

Or in CI / build scripts:
```json
"postinstall": "cp -r node_modules/@nirmata/dtom-brand-system/public/dtom-assets public/"
```

Assets included:
- `public/dtom-assets/dtom-canonical-logo.jpg` — canonical ΔTOM lockup image
- `public/dtom-assets/sales-dominator/*.jpg` — 12 Sales Dominator module screenshots

---

## Brand architecture

| Brand | Domain | Role |
|---|---|---|
| **Nirmata Holdings** | nirmataholdings.com | Parent holding company |
| **ΔTOM** | **AtomDominator.com** | Voice AI flagship product |
| **AntimatterAI** | antimatterai.com | AI platform parent brand |

**Sub-brands in registry: Nirmata Holdings, ΔTOM, AntimatterAI.**  
Retired and removed: ClinixAI, rrg.bio, thingk tangk-humanos.

Domain rule: `AtomDominator.com` / `ATOMDOMINATOR.COM` are the real-world production domains and must remain literal in all production links, footers, and telemetry displays. In all visible product UI the brand name is always **ΔTOM** (never plain `ATOM`).

---

## Vercel deployment

1. Ensure `public/dtom-assets/` is populated before build (via `postinstall` or CI step above).
2. The package CSS is bundled via Next.js — no extra Vercel config required.
3. GSAP loads from jsDelivr CDN via `<Script strategy="lazyOnload">` — no Vercel bundle impact.
4. All components using GSAP/hooks/DOM are `'use client'` and/or dynamically imported with `ssr: false`.

For SSG or ISR pages, `DtomPinnedKeynote` and `DtomBootLoader` must always be dynamically imported with `ssr: false` to prevent hydration mismatches.

---

## Accessibility

All components meet WCAG AA requirements:
- Color contrast: teal `#00e6d3` on dark `#08090a` ≥ 7:1
- Focus-visible outlines on all interactive controls
- Touch targets minimum 44×44px
- `aria-label`, `role="dialog"`, `aria-modal`, `aria-live` regions used throughout
- `prefers-reduced-motion`: all animations disabled, immediate final state preserved
- Semantic HTML before ARIA

---

## Quick example app

See `examples/next-app/` for a complete Next.js 14 App Router integration showing every component.
