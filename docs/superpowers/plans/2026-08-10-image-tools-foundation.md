# Image Tools P1 — Product Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Arabic-first image-tools website (الموقع الثاني) as a standalone Astro project with a fully navigable RTL site, centralized config, global design system, all required routes, and fully working client-side image processing: compress, resize, convert and crop — all handled locally in the browser, no server.

**Architecture:** Mirrors the calculators repo (`C:\Users\Lenovo\Documents\Default Project`) exactly: Astro static output, content = TS data in `src/content/`, centralized config in `src/config/`, client controller in `src/lib/client/`, lazy tool registry in `src/lib/client/registry.ts`, pure logic in `src/lib/`, node:test for pure logic, `@/*` → `src/*` alias. Arabic-only content now (typed `{ ar }` so English can be added later). Processing engines live in `src/lib/image/` (browser canvas codecs) and `src/lib/processing/` (pure math + browser glue); the pure parts are node-tested, the browser glue runs entirely client-side.

**Tech Stack:** Astro 7, @astrojs/sitemap, TypeScript (strict), plain CSS custom properties, node:test, zero UI framework, zero runtime dependencies.

## Global Constraints

- **Project root:** `C:\Users\Lenovo\Documents\image-tools` (new folder; created in Task 1). Never touch the calculators repo except to copy fonts and reference its CSS.
- **Git:** `git init` with default branch `main`; remote `origin` = `https://github.com/ahmedharb333/Image-tool.git` (exists, empty). Commit after every task with a short message. Final push only in Task 14.
- **Locale:** Arabic only. `type Locale = 'ar'`; localized values are `{ ar: string }`. No `/en` routes, no hreflang links rendered, no English strings (they are future work).
- **RTL:** `lang="ar" dir="rtl"` on `<html>`. CSS uses logical properties (`inset-inline-*`, `padding-inline-*`, `margin-inline-*`). No horizontal scrolling at 360px.
- **Light-only:** no `[data-theme]` system, no dark tokens, no theme toggle.
- **DOM contract (do not break):** `toolApp.ts` hard-couples to these selectors emitted by the tool pages/ToolShell: `.tool-form`, `input[data-upload-input]`, `[data-tool]`, `[data-action="process"]`, `[data-action="reset"]`, `.tool-result`, `[data-status]`, `[data-alerts]`, `.field--invalid`, `[data-tool-payload]`. A UI redesign that renames these must update client selectors in lockstep.
- **Privacy:** files never leave the browser; no storage of images/filenames/EXIF/history/downloads; filenames rendered via textContent only (never innerHTML); no secrets in client bundles; analytics/ads IDs stay empty placeholders.
- **Ads:** `AdSlot` renders nothing while `ADS.enabled === false`. ToolShell mounts an `afterResult` slot placeholder that is inert until a real publisher ID is set.
- **No fake content:** no fake security badges, counters, reviews, ratings, download counts, or unsupported-format claims. Only JPG/PNG/WebP are claimed as supported; GIF decodes but re-encodes as PNG; BMP/TIFF are rejected by validation.
- **Fonts:** copy the 12 `ibmplexsansarabic-*.woff2` files from the calculators repo's `public/fonts/` into `public/fonts/`. Do NOT reference Amiri or Inter.
- **Verification** (unless a task says otherwise): `npm test` green, `npm run check` 0 errors, `npm run build` clean. After Task 8 onward also manually verify RTL + no horizontal scroll at 360px.
- **Placeholders:** brand = `أدوات الصور`, domain = `https://image-tools.example.com`, contact email = `contact@example.com` — all in `src/config/site.ts`.

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`
- Create: `.gitignore`
- Create: `public/favicon.svg`
- Copy: `public/fonts/` (12 woff2 files from the calculators repo)
- Create: `src/pages/index.astro` (temporary stub)
- Create: `src/layouts/BaseLayout.astro` (temporary stub)
- Copy: `src/styles/fonts.css` (verbatim from calculators repo)
- Create: `src/styles/tokens.css` (adapted, light-only)
- Copy: `src/styles/base.css` (verbatim from calculators repo)
- Create: `src/styles/components.css` (placeholder)

**Interfaces:**
- Produces: working `npm install` + `npm run check` + `npm run build`; git repo with `origin` set; the `@/*` alias resolving to `src/*`.

- [ ] **Step 1: Create the project folder and git repo**

```powershell
New-Item -ItemType Directory -Path "C:\Users\Lenovo\Documents\image-tools" -Force | Out-Null
Set-Location "C:\Users\Lenovo\Documents\image-tools"
git init -b main
git remote add origin https://github.com/ahmedharb333/Image-tool.git
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "image-tools",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "node --test \"tests/**/*.test.ts\""
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.7.3",
    "astro": "^7.2.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.10",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "verbatimModuleSyntax": true,
    "types": ["node"]
  }
}
```

- [ ] **Step 4: Create `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

// NOTE: the site URL is hardcoded here because src/config/site.ts does not
// exist until Task 2. Task 14 swaps this literal for the SITE import.
export default defineConfig({
  site: 'https://image-tools.example.com',
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
});
```

- [ ] **Step 5: Create `.gitignore`**

```
# build output
dist/
# generated types
.astro/

# dependencies
node_modules/

# logs
npm-debug.log*
*.log

# environment
.env
.env.*

# OS
.DS_Store
Thumbs.db

# editor
.idea/
.vscode/
*.swp

# superpowers plan workspace (per-plan scratch: briefs, reports, reviews, ledger)
.superpowers/
```

- [ ] **Step 6: Copy the self-hosted fonts**

```powershell
New-Item -ItemType Directory -Path "C:\Users\Lenovo\Documents\image-tools\public\fonts" -Force | Out-Null
Copy-Item -Path "C:\Users\Lenovo\Documents\Default Project\public\fonts\*" -Destination "C:\Users\Lenovo\Documents\image-tools\public\fonts\"
```

Verify: `Get-ChildItem public\fonts` lists exactly 12 `ibmplexsansarabic-*.woff2` files.

- [ ] **Step 7: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#12305C"/>
  <circle cx="32" cy="32" r="17" fill="none" stroke="#0E8A6D" stroke-width="5"/>
  <path d="M32 22v20M22 32h20" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 8: Create `src/styles/fonts.css`** — copy `C:\Users\Lenovo\Documents\Default Project\src\styles\fonts.css` verbatim (it declares IBM Plex Sans Arabic 400/500/600/700 for arabic/latin/latin-ext pointing at `/fonts/ibmplexsansarabic-*.woff2`).

- [ ] **Step 9: Create `src/styles/tokens.css`** — copy the calculators repo `tokens.css` but DELETE the entire `[data-theme='dark'] { ... }` block (the dark-mode section at the end). Keep `:root` exactly as-is (navy `#12305C`, teal `#0E8A6D`, IBM Plex Sans Arabic, `--space-*` / `--radius-*` / `--shadow-*` scales, `--container-max: 1180px`).

- [ ] **Step 10: Create `src/styles/base.css`** — copy the calculators repo `base.css` verbatim (it is light-only and uses logical properties).

- [ ] **Step 11: Create `src/styles/components.css`** — empty placeholder:

```css
/* Image-tools component styles are added in Task 8. */
```

- [ ] **Step 12: Create temporary stub pages so the build compiles**

`src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="أدوات الصور" description="أدوات معالجة الصور داخل متصفحك">
  <section class="container section">
    <h1>أدوات الصور</h1>
    <p>البنية الأساسية للموقع قيد الإنشاء.</p>
  </section>
</BaseLayout>
```

`src/layouts/BaseLayout.astro` (temporary; fully replaced in Task 5):

```astro
---
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <main id="main">
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 13: Install and verify**

```powershell
npm install
npm run check
npm run build
```

Expected: `astro check` 0 errors, build succeeds and emits `dist/index.html`.

- [ ] **Step 14: Commit**

```powershell
git add -A
git commit -m "chore: scaffold astro project for image tools site"
```

---

### Task 2: Centralized config system

**Files:**
- Create: `src/config/site.ts`
- Create: `src/config/nav.ts`
- Create: `src/config/tools.ts`
- Create: `src/config/limits.ts`
- Create: `src/config/ads.ts`
- Create: `src/config/analytics.ts`
- Create: `src/config/features.ts`
- Create: `src/config/legal.ts`
- Create: `src/config/social.ts`
- Create: `tests/config.test.ts`

**Interfaces:**
- Produces: `SITE` (brand/domain/email/theme/lastReviewed), `Locale` type, `LOGO`, `NAV`, `TOOLS: ToolEntry[]`, `LIMITS`, `ADS`, `ANALYTICS`, `FEATURES`, `LEGAL`. Consumed by every later task.
- `ToolEntry` shape: `{ id, slug, category: 'compress'|'resize'|'convert'|'crop', title: { ar }, description: { ar }, formats: string[] (lowercase extensions), related: string[], guide: string ('' in P1), active: boolean }`.

- [ ] **Step 1: Write the failing config test** (`tests/config.test.ts`)

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TOOLS } from '../src/config/tools.ts';

test('config: registry contains exactly the four P1 tools', () => {
  const slugs = TOOLS.map((t) => t.slug).sort();
  assert.deepEqual(slugs, ['compress-image', 'convert-image', 'crop-image', 'resize-image']);
});

test('config: slugs and ids are unique', () => {
  const slugs = TOOLS.map((t) => t.slug);
  const ids = TOOLS.map((t) => t.id);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(ids).size, ids.length);
});

test('config: all tools are active and have non-empty formats', () => {
  for (const t of TOOLS) {
    assert.equal(t.active, true, t.slug);
    assert.ok(t.formats.length > 0, t.slug);
  }
});

test('config: every related slug exists in the registry', () => {
  const slugs = new Set(TOOLS.map((t) => t.slug));
  for (const t of TOOLS) {
    for (const r of t.related) assert.ok(slugs.has(r), `${t.slug} -> ${r}`);
  }
});

test('config: every tool has an Arabic title and description', () => {
  for (const t of TOOLS) {
    assert.ok(t.title.ar.length > 0, t.slug);
    assert.ok(t.description.ar.length > 0, t.slug);
  }
});
```

- [ ] **Step 2: Run it to verify it fails** (no `src/config/tools.ts` yet)

```powershell
npm test
```

Expected: FAIL with module-not-found for `../src/config/tools.ts`.

- [ ] **Step 3: Create `src/config/site.ts`**

```ts
/**
 * Central site configuration.
 * Edit brand, domain, contact, colors and dates here only.
 */

export type Locale = 'ar';

export const LOCALES: Locale[] = ['ar'];
export const DEFAULT_LOCALE: Locale = 'ar';

export const SITE = {
  /** Placeholder domain — replace with the real domain before launch. */
  url: 'https://image-tools.example.com',
  /** Brand name (display). */
  brandName: { ar: 'أدوات الصور' },
  /** Short brand tagline. */
  tagline: { ar: 'أدوات معالجة الصور داخل متصفحك' },
  /** Owner / editorial placeholder. Kept empty until real info is provided. */
  owner: {
    name: { ar: '' },
    email: '',
    emailDisplay: { ar: 'بريد إلكتروني' },
  },
  /** Editorial placeholder — no invented people. */
  reviewerPlaceholder: {
    ar: 'المراجِع: سيُذكر اسم المراجِع المعتمد هنا',
  },
  /** Default last-reviewed date (ISO). Update as content is reviewed. */
  lastReviewedDefault: '2026-08-10',
  /** Contact route handling: mailto-based (no server backend). */
  contact: {
    useMailto: true,
    mailtoSubject: { ar: 'رسالة من موقع أدوات الصور' },
  },
} as const;

export const LOGO = {
  /** Rendered as text (no image assets). */
  text: { ar: 'أدوات الصور' },
  /** Arabic-English combined lockup used in footer. */
  lockup: { ar: 'أدوات الصور — Image Tools' },
} as const;

export const THEME = {
  /** Brand colors (kept in sync with styles/tokens.css). */
  primary: '#12305C',
  accent: '#0E8A6D',
  background: '#FFFFFF',
  altBackground: '#F6F8FB',
  text: '#16233A',
} as const;
```

- [ ] **Step 4: Create `src/config/nav.ts`**

```ts
/**
 * Navigation links. All values are Arabic-only for now.
 */
import type { Locale } from './site';

export type NavItem = { label: Record<Locale, string>; href: string };

export const NAV = {
  main: [
    { label: { ar: 'الرئيسية' }, href: '/' },
    { label: { ar: 'الأدوات' }, href: '/tools/' },
    { label: { ar: 'الأدلة' }, href: '/guides/' },
    { label: { ar: 'من نحن' }, href: '/about/' },
    { label: { ar: 'تواصل معنا' }, href: '/contact/' },
  ] as NavItem[],
  footer: [
    { label: { ar: 'كيف تُعالج الملفات' }, href: '/how-files-are-processed/' },
    { label: { ar: 'سياسة الخصوصية' }, href: '/privacy/' },
    { label: { ar: 'سياسة الكوكيز' }, href: '/cookies/' },
    { label: { ar: 'شروط الاستخدام' }, href: '/terms/' },
    { label: { ar: 'إخلاء المسؤولية' }, href: '/disclaimer/' },
    { label: { ar: 'الإفصاح عن الإعلانات' }, href: '/advertising-disclosure/' },
  ] as NavItem[],
} as const;
```

- [ ] **Step 5: Create `src/config/tools.ts`**

```ts
/**
 * Tool registry — the single source of truth for all tools:
 * routes, categories, related tools, guide links and publish status.
 * Formats are lowercase file extensions.
 */

export type ToolCategory = 'compress' | 'resize' | 'convert' | 'crop';

export interface ToolEntry {
  /** Stable machine id (used in analytics events later). */
  id: string;
  /** URL slug. */
  slug: string;
  category: ToolCategory;
  /** Localized titles. */
  title: { ar: string };
  /** Localized one-line description (used in cards + meta). */
  description: { ar: string };
  /** Supported input file extensions, lowercase. */
  formats: string[];
  /** Slugs of related tools (internal linking). */
  related: string[];
  /** Slug of the primary explanatory guide ('' until guides exist). */
  guide: string;
  /** Whether the tool is published. */
  active: boolean;
}

export const TOOLS: ToolEntry[] = [
  {
    id: 'compress-image',
    slug: 'compress-image',
    category: 'compress',
    title: { ar: 'ضغط الصور' },
    description: { ar: 'قلّص حجم صور JPG وPNG وWebP داخل متصفحك دون رفعها إلى أي خادم.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['resize-image', 'convert-image'],
    guide: '',
    active: true,
  },
  {
    id: 'resize-image',
    slug: 'resize-image',
    category: 'resize',
    title: { ar: 'تغيير حجم الصور' },
    description: { ar: 'غيّر أبعاد الصورة بالبكسل أو بالنسبة المئوية مع الحفاظ على أبعادها الأصلية.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['compress-image', 'crop-image'],
    guide: '',
    active: true,
  },
  {
    id: 'convert-image',
    slug: 'convert-image',
    category: 'convert',
    title: { ar: 'تحويل صيغة الصور' },
    description: { ar: 'حوّل الصور بين JPG وPNG وWebP مع خيارات الجودة والخلفية داخل المتصفح.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['compress-image', 'resize-image'],
    guide: '',
    active: true,
  },
  {
    id: 'crop-image',
    slug: 'crop-image',
    category: 'crop',
    title: { ar: 'قص الصور' },
    description: { ar: 'اقصّ الصورة بحرية أو بنسب ثابتة مثل 1:1 و16:9 مع التدوير قبل القص.' },
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    related: ['resize-image', 'convert-image'],
    guide: '',
    active: true,
  },
];
```

- [ ] **Step 6: Create `src/config/limits.ts`**

```ts
/**
 * Global processing limits — all configurable in one place.
 * Values are in bytes and pixels.
 */

export const LIMITS = {
  /** Maximum accepted input file size (25 MB). */
  maxFileSize: 25 * 1024 * 1024,
  /** Maximum allowed image dimension in pixels. */
  maxDimension: 12000,
  /** Files above this threshold show a memory warning in the UI. */
  largeFileThreshold: 8 * 1024 * 1024,
  /** Maximum number of files per batch (reserved for P3). */
  maxBatchCount: 20,
  /** Maximum total input size per batch (reserved for P3). */
  maxBatchTotalSize: 100 * 1024 * 1024,
} as const;

export function isLargeFile(bytes: number): boolean {
  return bytes > LIMITS.largeFileThreshold;
}
```

- [ ] **Step 7: Create `src/config/ads.ts`**

```ts
/**
 * Advertising configuration — all values stay empty/disabled until real
 * publisher IDs are supplied. Never invent IDs.
 */

export const ADS = {
  /** Master switch. Advertising stays OFF until set to true deliberately. */
  enabled: false,
  /** Test mode renders nothing public and never shows test ads as real. */
  testMode: true,
  /** AdSense publisher ID placeholder — replace with the real one (pub-...). */
  publisherId: '',
  /** Global AdSense head code placeholder. Inserted between <head> tags only
   * when enabled && publisherId is set && a real code is provided. */
  headCode: '',
  /** Individual ad-slot IDs per location. */
  slots: {
    belowIntro: '',
    afterResult: '',
    inContent: '',
    sidebar: '',
    betweenGuideSections: '',
  },
  /** Google Auto Ads — kept disabled by default. */
  autoAds: false,
  /** Configurable ad locations (used by the AdSlot component). */
  locations: ['belowIntro', 'afterResult', 'inContent', 'sidebar', 'betweenGuideSections'] as const,
} as const;

/**
 * ads.txt record template. When a real publisher ID is supplied, generate:
 * google.com, <publisherId>, DIRECT, f08c47fec0942fa0
 */
export function adsTxtFor(publisherId: string): string {
  return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;
}
```

- [ ] **Step 8: Create `src/config/analytics.ts`**

```ts
/**
 * Analytics configuration. Nothing loads until a real measurement ID is set
 * AND consent is granted. Image contents/filenames/exif are never sent.
 */

export const ANALYTICS = {
  /** Whether tracking scripts may load at all (also gated by consent). */
  enabled: false,
  /** Whether visitor consent is required before loading tracking tags. */
  consentEnabled: true,
  ga4: {
    /** Master switch for Google Analytics 4. */
    enabled: false,
    /** GA4 measurement ID placeholder (G-XXXXXXXXXX). */
    measurementId: '',
  },
  /** Google Search Console verification placeholder. */
  gscVerification: '',
  clarity: {
    /** Microsoft Clarity — disabled by default. */
    enabled: false,
    projectId: '',
  },
} as const;
```

- [ ] **Step 9: Create `src/config/features.ts`**

```ts
/**
 * Feature flags — central switches for optional functionality.
 * Everything non-essential defaults to OFF.
 */

export const FEATURES = {
  /** Affiliate recommendation module — disabled until real programs exist. */
  affiliates: {
    enabled: false,
    programs: [] as { id: string; name: string; url: string; label: { ar: string } }[],
  },
  /** Consent management for analytics/advertising tags. */
  consent: {
    enabled: true,
    cmp: null as null | { name: string; scriptUrl: string },
  },
  /** Analytics event tracking (respects consent). */
  analyticsEvents: true,
} as const;
```

- [ ] **Step 10: Create `src/config/legal.ts`**

```ts
/**
 * Legal/editorial placeholders. Kept empty until real owner info is supplied.
 */

export const LEGAL = {
  /** Legal entity name — empty until a real entity is declared. */
  entityName: { ar: '' },
  /** Governing-jurisdiction placeholder. */
  jurisdiction: { ar: '' },
  /** Default last-updated date for static pages. */
  lastUpdatedDefault: '2026-08-10',
} as const;
```

- [ ] **Step 11: Create `src/config/social.ts`**

```ts
/**
 * Social-media preset dimensions (P3). Empty until the social resizer is built.
 */
export const SOCIAL_PRESETS: { id: string; name: { ar: string }; width: number; height: number }[] = [];
```

- [ ] **Step 12: Run the config tests to verify they pass**

```powershell
npm test
```

Expected: all 5 config tests PASS.

- [ ] **Step 13: Commit**

```powershell
git add -A
git commit -m "feat: add centralized config system and tool registry"
```

---

### Task 3: Pure libraries — i18n, SEO, file helpers

**Files:**
- Create: `src/lib/i18n.ts`
- Create: `src/lib/seo.ts`
- Create: `src/lib/file.ts`
- Create: `tests/i18n.test.ts`
- Create: `tests/seo.test.ts`
- Create: `tests/file.test.ts`

**Interfaces:**
- Produces (consumed by layouts, pages, ToolShell, toolApp):
  - `localizedPath(locale: Locale, path: string): string` (returns path unchanged for `ar`)
  - `absoluteUrl(path: string): string`
  - `buildTitle(mainTitle: string): string`
  - `metaRobots(noindex: boolean): string`
  - `websiteJsonLd()`, `breadcrumbJsonLd(items: { name: string; path: string }[])`, `webApplicationJsonLd(meta: SeoMeta)`, `faqJsonLd(faqs: { q: string; a: string }[])`
  - `readSignature(buf: ArrayBuffer): string`
  - `detectImageMime(buf: ArrayBuffer): string | null`
  - `mimeToExtension(mime: string): string`
  - `sanitizeFilename(name: string): string`
  - `extensionOf(name: string): string`
  - `baseNameOf(name: string): string`
  - `buildOutputFilename(original: string, suffix: string, ext: string): string`
  - `formatBytes(bytes: number): string`
  - `reductionPercent(original: number, result: number): number`
  - `validateImageFile(formats, name, size, maxSize, buffer): { valid, errors, detectedMime }`

- [ ] **Step 1: Write the failing i18n test** (`tests/i18n.test.ts`)

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localizedPath } from '../src/lib/i18n.ts';

test('i18n: Arabic (default) paths are served at root', () => {
  assert.equal(localizedPath('ar', '/tools/'), '/tools/');
  assert.equal(localizedPath('ar', 'tools/'), '/tools/');
  assert.equal(localizedPath('ar', '/'), '/');
});
```

- [ ] **Step 2: Write the failing SEO test** (`tests/seo.test.ts`)

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTitle, absoluteUrl, metaRobots, breadcrumbJsonLd } from '../src/lib/seo.ts';

test('seo: title is brand-aware', () => {
  assert.equal(buildTitle('ضغط الصور'), 'ضغط الصور | أدوات الصور');
  assert.equal(buildTitle('أدوات الصور'), 'أدوات الصور — أدوات معالجة الصور داخل متصفحك');
});

test('seo: absoluteUrl uses the configured site URL', () => {
  assert.equal(absoluteUrl('/tools/compress-image/'), 'https://image-tools.example.com/tools/compress-image/');
});

test('seo: robots meta reflects index status', () => {
  assert.equal(metaRobots(false), 'index, follow');
  assert.equal(metaRobots(true), 'noindex, nofollow');
});

test('seo: breadcrumb JSON-LD is well-formed', () => {
  const ld = breadcrumbJsonLd([{ name: 'الرئيسية', path: '/' }, { name: 'الأدوات', path: '/tools/' }]);
  assert.equal(ld.itemListElement.length, 2);
  assert.equal(ld.itemListElement[0].position, 1);
  assert.equal(ld.itemListElement[1].item, 'https://image-tools.example.com/tools/');
});
```

- [ ] **Step 3: Write the failing file-helper test** (`tests/file.test.ts`)

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  readSignature,
  detectImageMime,
  mimeToExtension,
  sanitizeFilename,
  extensionOf,
  buildOutputFilename,
  formatBytes,
  reductionPercent,
  validateImageFile,
} from '../src/lib/file.ts';

const sig = (bytes: number[]) => new Uint8Array(bytes).buffer;

test('file: detects real image signatures', () => {
  assert.equal(detectImageMime(sig([0xff, 0xd8, 0xff, 0xe0, 0, 0])), 'image/jpeg');
  assert.equal(detectImageMime(sig([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a])), 'image/png');
  const webp = [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50];
  assert.equal(detectImageMime(sig(webp)), 'image/webp');
  assert.equal(detectImageMime(sig([0x4d, 0x5a, 0x90, 0x00])), null);
  assert.equal(detectImageMime(sig([0x00, 0x00, 0x00, 0x00])), null);
});

test('file: readSignature returns hex prefix', () => {
  assert.equal(readSignature(sig([0xff, 0xd8, 0xff])), 'ffd8ff');
});

test('file: mime maps to canonical extension', () => {
  assert.equal(mimeToExtension('image/jpeg'), 'jpg');
  assert.equal(mimeToExtension('image/png'), 'png');
  assert.equal(mimeToExtension('image/webp'), 'webp');
  assert.equal(mimeToExtension('application/pdf'), 'bin');
});

test('file: sanitizeFilename strips unsafe characters', () => {
  assert.equal(sanitizeFilename('../../etc\\passwd.jpg'), 'etcpasswd.jpg');
  assert.equal(sanitizeFilename('  صورة  مسافات  .png '), 'صورة  مسافات  .png');
  assert.equal(sanitizeFilename('..'), 'image');
});

test('file: extensionOf extracts lowercase extension', () => {
  assert.equal(extensionOf('photo.JPG'), 'jpg');
  assert.equal(extensionOf('no-ext'), '');
  assert.equal(extensionOf('.hidden'), '');
});

test('file: buildOutputFilename preserves base and adds suffix', () => {
  assert.equal(buildOutputFilename('photo.jpg', 'compressed', 'jpg'), 'photo-compressed.jpg');
  assert.equal(buildOutputFilename('أرشيف حلو.png', 'resized', 'webp'), 'أرشيف حلو-resized.webp');
});

test('file: formatBytes renders Latin digits', () => {
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(2048), '2.0 KB');
  assert.equal(formatBytes(3 * 1024 * 1024), '3.0 MB');
  assert.equal(formatBytes(0), '0 B');
});

test('file: reductionPercent is clamped and rounded', () => {
  assert.equal(reductionPercent(1000, 400), 60);
  assert.equal(reductionPercent(1000, 1200), 0);
  assert.equal(reductionPercent(0, 0), 0);
});

test('file: validateImageFile rejects spoofed, oversized and unsupported files', () => {
  const png = sig([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const spoof = validateImageFile(['png'], 'evil.png', 100, 100000, sig([0x4d, 0x5a, 0x90, 0x00]));
  assert.equal(spoof.valid, false);
  assert.ok(spoof.errors.length > 0);
  const ok = validateImageFile(['png'], 'photo.png', 100, 100000, png);
  assert.equal(ok.valid, true);
  assert.equal(ok.detectedMime, 'image/png');
  const mismatch = validateImageFile(['jpg'], 'photo.jpg', 100, 100000, png);
  assert.equal(mismatch.valid, false);
  const big = validateImageFile(['png'], 'photo.png', 200000, 100000, png);
  assert.equal(big.valid, false);
  const unsupported = validateImageFile(['png'], 'photo.tiff', 100, 100000, png);
  assert.equal(unsupported.valid, false);
});
```

- [ ] **Step 4: Run the three tests to verify they fail**

```powershell
npm test
```

Expected: FAIL (modules missing).

- [ ] **Step 5: Create `src/lib/i18n.ts`**

```ts
import { DEFAULT_LOCALE, type Locale } from '../config/site';

/**
 * Build a localized path. Arabic (default) is served at root.
 * English (`/en/...`) is future work; the branch is typed but unused.
 */
export function localizedPath(locale: Locale, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return p;
  return `/en${p}`;
}
```

- [ ] **Step 6: Create `src/lib/seo.ts`**

```ts
import { SITE } from '../config/site.ts';

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  lastReviewed?: string;
}

/** Absolute URL for a path on the site (Arabic is the only locale). */
export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${p}`;
}

export function buildTitle(mainTitle: string): string {
  const brand = SITE.brandName.ar;
  return mainTitle === brand ? `${brand} — ${SITE.tagline.ar}` : `${mainTitle} | ${brand}`;
}

export function metaRobots(noindex: boolean): string {
  return noindex ? 'noindex, nofollow' : 'index, follow';
}

/* ---------------- JSON-LD builders ---------------- */

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.brandName.ar,
    url: absoluteUrl('/'),
    inLanguage: 'ar',
    description: SITE.tagline.ar,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webApplicationJsonLd(meta: SeoMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: meta.title,
    url: absoluteUrl(meta.path),
    description: meta.description,
    applicationCategory: 'MultimediaApplication',
    inLanguage: 'ar',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true,
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
```

- [ ] **Step 7: Create `src/lib/file.ts`**

```ts
/**
 * Pure file/format helpers. No DOM access — unit-testable in node.
 */

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/** First up-to-16 bytes as a lowercase hex string. */
export function readSignature(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf.slice(0, Math.min(16, buf.byteLength)));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Sniff the real image type from file content. Returns null when not an image. */
export function detectImageMime(buf: ArrayBuffer): string | null {
  const sig = readSignature(buf);
  if (sig.startsWith('ffd8ff')) return 'image/jpeg';
  if (sig.startsWith('89504e47')) return 'image/png';
  if (sig.startsWith('52494646') && sig.length >= 24 && sig.slice(16, 24) === '57454250') return 'image/webp';
  if (sig.startsWith('474946')) return 'image/gif';
  return null;
}

export function mimeToExtension(mime: string): string {
  return MIME_TO_EXT[mime] ?? 'bin';
}

/** Strip path separators, control chars, leading dots; trim; fall back to 'image'. */
export function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[\\/:*?"<>|\x00-\x1f]/g, '').trim().replace(/^\.+/, '');
  return cleaned === '' || cleaned === '.' || cleaned === '..' ? 'image' : cleaned;
}

/** Lowercase extension without the dot; '' when absent or hidden-only. */
export function extensionOf(name: string): string {
  const idx = name.lastIndexOf('.');
  if (idx <= 0) return '';
  return name.slice(idx + 1).toLowerCase();
}

/** Base filename without extension, sanitized. */
export function baseNameOf(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx > 0 ? sanitizeFilename(name.slice(0, idx)) : sanitizeFilename(name);
}

export function buildOutputFilename(original: string, suffix: string, ext: string): string {
  return `${baseNameOf(original)}-${suffix}.${ext}`;
}

/** Format bytes with Latin digits (deliberate: matches site output rule). */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '';
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function reductionPercent(original: number, result: number): number {
  if (original <= 0) return 0;
  return Math.max(0, Math.round((1 - result / original) * 100));
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  detectedMime: string | null;
}

/**
 * Validate an image file against the tool's supported formats.
 * Checks size limit, extension allow-list, real content signature,
 * and extension/content consistency (rejects renamed non-images).
 */
export function validateImageFile(
  formats: string[],
  name: string,
  size: number,
  maxSize: number,
  buffer: ArrayBuffer,
): ValidationResult {
  const errors: string[] = [];
  const ext = extensionOf(name);
  const detectedMime = detectImageMime(buffer);

  if (size === 0) errors.push('الملف فارغ (0 بايت).');
  if (size > maxSize) errors.push(`حجم الملف يتجاوز الحد الأقصى المسموح به (${formatBytes(maxSize)}).`);

  const formatSet = new Set(formats);
  if (!formatSet.has(ext)) {
    errors.push(`نوع الملف غير مدعوم (${ext || 'بدون امتداد'}). الصيغ المدعومة: ${formats.join('، ')}.`);
  }

  if (!detectedMime) {
    errors.push('محتوى الملف لا يبدو أنه صورة صالحة.');
  } else if (ext !== '' && EXT_TO_MIME[ext] !== detectedMime) {
    errors.push('محتوى الملف لا يطابق امتداده. قد يكون الملف معاد تسميته.');
  }

  return { valid: errors.length === 0, errors, detectedMime };
}
```

- [ ] **Step 8: Run all tests to verify they pass**

```powershell
npm test
```

Expected: i18n, seo, file suites PASS.

- [ ] **Step 9: Commit**

```powershell
git add -A
git commit -m "feat: add i18n, seo and file helper libraries with tests"
```

---

### Task 4: Global styles — tokens, base, components, tool-area

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/styles/components.css`
- Create: `src/styles/tool-area.css`

**Interfaces:**
- Produces: `--color-*`, `--space-*`, `--font-*`, `--radius-*`, `--shadow-*` custom properties; global element resets; classes `.site-header`, `.site-nav`, `.site-footer`, `.skip-link`, `.container`, `.btn`, `.btn--primary`, `.btn--secondary`, `.card`, `.card-grid`, `.section`, `.section--alt`, `.field`, `.dropzone`, `.dropzone--active`, `.tag`, `.tool-result`, `.result-grid`, `.spinner`, `.consent-toggle`, `.legal-prose`, `.page-header`, `.tool-header`.
- Consumed by every component and page. No JS coupling; all visuals only.

- [ ] **Step 1: Create `src/styles/tokens.css`**

```css
/* Design tokens — single source of truth for colors, spacing, type, radii. */
:root {
  /* Brand */
  --color-primary: #12305c;
  --color-primary-hover: #0f2749;
  --color-accent: #0e8a6d;
  --color-accent-hover: #0b725b;
  --color-accent-soft: #e3f2ee;

  /* Neutrals */
  --color-bg: #ffffff;
  --color-bg-alt: #f6f8fb;
  --color-text: #16233a;
  --color-text-muted: #5c6b84;
  --color-border: #e2e8f0;
  --color-focus: #0e8a6d;

  /* Feedback */
  --color-error: #b42318;
  --color-error-bg: #fef3f2;
  --color-success: #067647;
  --color-success-bg: #ecfdf3;
  --color-warning: #b54708;
  --color-warning-bg: #fffaeb;

  /* Type */
  --font-arabic: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.375rem;
  --font-size-2xl: 1.75rem;
  --font-size-3xl: 2.25rem;
  --line-height-base: 1.7;
  --line-height-tight: 1.4;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 999px;

  /* Elevation */
  --shadow-sm: 0 1px 2px rgba(18, 48, 92, 0.08);
  --shadow-md: 0 4px 12px rgba(18, 48, 92, 0.1);
  --shadow-lg: 0 12px 32px rgba(18, 48, 92, 0.14);

  /* Layout */
  --container-max: 1180px;
  --header-height: 64px;
  --content-max: 760px;
}
```

- [ ] **Step 2: Create `src/styles/base.css`**

```css
/* Base resets + element defaults. RTL is the default (dir="rtl" on <html>). */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-arabic);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--color-text);
  background: var(--color-bg);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

img,
svg,
canvas,
video {
  display: block;
  max-width: 100%;
}

input,
select,
textarea,
button {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

a {
  color: var(--color-accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

h1,
h2,
h3,
h4 {
  line-height: var(--line-height-tight);
  font-weight: 700;
  color: var(--color-primary);
}

ul,
ol {
  padding-inline-start: 1.25rem;
}

:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

::selection {
  background: var(--color-accent);
  color: #fff;
}

/* Layout helpers */
.container {
  width: min(100% - 2rem, var(--container-max));
  margin-inline: auto;
}

.prose {
  max-width: var(--content-max);
  margin-inline: auto;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.skip-link {
  position: absolute;
  inset-inline-start: var(--space-4);
  top: -100%;
  z-index: 100;
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary);
  color: #fff;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}

.skip-link:focus {
  top: 0;
}

main {
  flex: 1 0 auto;
  width: 100%;
}

footer {
  flex-shrink: 0;
}
```

- [ ] **Step 3: Create `src/styles/components.css`**

```css
/* Shared UI components: header, nav, footer, buttons, cards, forms. */

/* ---- Header ---- */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  height: var(--header-height);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  height: 100%;
}

.site-logo {
  font-size: var(--font-size-lg);
  font-weight: 800;
  color: var(--color-primary);
  white-space: nowrap;
}

.site-logo:hover {
  text-decoration: none;
}

.site-nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: var(--space-2);
}

.site-nav a {
  display: inline-block;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-weight: 500;
}

.site-nav a:hover {
  background: var(--color-bg-alt);
  text-decoration: none;
  color: var(--color-accent);
}

.site-nav a[aria-current='page'] {
  color: var(--color-accent);
}

/* ---- Footer ---- */
.site-footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-alt);
  padding-block: var(--space-12) var(--space-8);
  margin-top: var(--space-16);
}

.site-footer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-8);
}

.site-footer h2 {
  font-size: var(--font-size-sm);
  text-transform: none;
  margin-bottom: var(--space-4);
  color: var(--color-primary);
}

.site-footer ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--space-2);
}

.site-footer a {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.site-footer a:hover {
  color: var(--color-accent);
}

.site-footer__bottom {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* ---- Sections ---- */
.section {
  padding-block: var(--space-12);
}

.section--alt {
  background: var(--color-bg-alt);
}

/* ---- Page header ---- */
.page-header {
  text-align: center;
  padding-block: var(--space-12) var(--space-8);
}

.page-header h1 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-3);
}

.page-header p {
  color: var(--color-text-muted);
  max-width: 640px;
  margin-inline: auto;
}

/* ---- Buttons ---- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: 600;
  border: 1px solid transparent;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--primary {
  background: var(--color-primary);
  color: #fff;
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn--secondary {
  background: var(--color-bg);
  color: var(--color-primary);
  border-color: var(--color-border);
}

.btn--secondary:hover:not(:disabled) {
  border-color: var(--color-primary);
}

.btn--accent {
  background: var(--color-accent);
  color: #fff;
}

.btn--accent:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

/* ---- Cards ---- */
.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-6);
}

/* ---- Tags ---- */
.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

/* ---- Form fields ---- */
.field {
  display: grid;
  gap: var(--space-2);
}

.field label,
.field .field__label {
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.field input[type='text'],
.field input[type='number'],
.field input[type='file'],
.field select,
.field textarea {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}

.field .field__hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

/* ---- Legal prose ---- */
.legal-prose {
  max-width: var(--content-max);
  margin-inline: auto;
}

.legal-prose h2 {
  margin-top: var(--space-8);
  margin-bottom: var(--space-4);
  font-size: var(--font-size-xl);
}

.legal-prose p,
.legal-prose ul,
.legal-prose ol {
  margin-bottom: var(--space-4);
}

.legal-prose .legal-prose__meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  border-inline-start: 3px solid var(--color-border);
  padding-inline-start: var(--space-4);
  margin-bottom: var(--space-8);
}
```

- [ ] **Step 4: Create `src/styles/tool-area.css`**

```css
/* Tool workspace: dropzone, result, spinner, comparison grid. */

.tool-result {
  margin-top: var(--space-8);
}

.result-grid {
  display: grid;
  gap: var(--space-6);
}

@media (min-width: 900px) {
  .result-grid {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

.result-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.result-card__title {
  font-size: var(--font-size-base);
  margin-bottom: var(--space-4);
}

.result-stats {
  display: grid;
  gap: var(--space-2);
  margin-block: var(--space-4);
}

.result-stats dl {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  font-size: var(--font-size-sm);
  margin: 0;
}

.result-stats dt {
  color: var(--color-text-muted);
}

.result-stats dd {
  margin: 0;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.result-stats__saving {
  color: var(--color-success);
}

/* ---- Dropzone ---- */
.dropzone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-12) var(--space-6);
  text-align: center;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.dropzone--active {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}

.dropzone input[type='file'] {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.dropzone__label {
  display: block;
  cursor: pointer;
}

.dropzone__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.dropzone__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.dropzone--active .dropzone__title {
  color: var(--color-accent);
}

/* ---- Spinner ---- */
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "feat: add global design tokens and component styles"
```

---

### Task 5: BaseLayout + Head

**Files:**
- Create: `src/components/Head.astro`
- Create: `src/layouts/BaseLayout.astro`
- Delete: `src/layouts/Layout.astro` (scaffold default)

**Interfaces:**
- `Head` props: `{ title: string; description: string; path: string; ogType?: 'website' | 'article'; noindex?: boolean; schemaJsonLd?: object[]; lastReviewed?: string }`.
- `BaseLayout` props: `{ title: string; description: string; path: string; ogType?; noindex?; schemaJsonLd?: object[]; lastReviewed?; isHome?: boolean }`.
- Produces: full `<html dir="rtl" lang="ar">` document. Content passed via `<slot />`. Nav uses active-link highlight via `Astro.url.pathname`.

- [ ] **Step 1: Create `src/components/Head.astro`**

```astro
---
import { ANALYTICS } from '../config/analytics';
import { ADS } from '../config/ads';
import { FEATURES } from '../config/features';
import { SITE } from '../config/site';
import { absoluteUrl, buildTitle, metaRobots, websiteJsonLd } from '../lib/seo';

interface Props {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  schemaJsonLd?: object[];
  lastReviewed?: string;
}

const {
  title,
  description,
  path,
  ogType = 'website',
  noindex = false,
  schemaJsonLd = [],
  lastReviewed,
} = Astro.props;

const fullTitle = buildTitle(title);
const canonical = absoluteUrl(path);
const robots = metaRobots(noindex);
const schemas = [...schemaJsonLd, websiteJsonLd()];
const showAdsHead = ADS.enabled && !ADS.testMode && ADS.publisherId !== '' && ADS.headCode !== '';
const showAnalyticsHead = ANALYTICS.enabled && ANALYTICS.ga4.enabled && ANALYTICS.ga4.measurementId !== '';
const showConsent = FEATURES.consent.enabled;
---

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="generator" content={Astro.generator} />

<title>{fullTitle}</title>
<meta name="description" content={description} />
<meta name="robots" content={robots} />
<link rel="canonical" href={canonical} />

{lastReviewed && <meta name="dateModified" content={lastReviewed} />}

<meta property="og:type" content={ogType} />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:locale" content="ar_AR" />
<meta property="og:site_name" content={SITE.brandName.ar} />

<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />

<link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="theme-color" content="#12305C" />

{showConsent && <script is:inline type="module" src="/scripts/consent.mjs" data-mode="head"></script>}

{schemas.map((schema) => (
  <script type="application/ld+json" set:html={JSON.stringify(schema)}></script>
))}

{showAnalyticsHead && ANALYTICS.gscVerification !== '' && (
  <meta name="google-site-verification" content={ANALYTICS.gscVerification} />
)}

{showAdsHead && <Fragment set:html={ADS.headCode} />}

{showAnalyticsHead && (
  <script is:inline async src="https://www.googletagmanager.com/gtag/js?id={ANALYTICS.ga4.measurementId}"></script>
)}

{showAnalyticsHead && (
  <script is:inline data-measurement-id={ANALYTICS.ga4.measurementId}>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', document.currentScript.dataset.measurementId, { 'anonymize_ip': true });
  </script>
)}
```

> Note: the consent script is mounted by Task 8; the empty `data-mode` guard means nothing loads until that task ships the file.

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
import Head from '../components/Head.astro';
import { NAV } from '../config/nav';
import { LOGO, SITE } from '../config/site';
import '../styles/fonts.css';
import '../styles/base.css';

// NOTE: AdSlot and ConsentToggle are wired into the footer in Tasks 6 and 8
// (they don't exist yet at this task's verify gate).

interface Props {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  schemaJsonLd?: object[];
  lastReviewed?: string;
  isHome?: boolean;
}

const {
  title,
  description,
  path,
  ogType,
  noindex,
  schemaJsonLd,
  lastReviewed,
  isHome = false,
} = Astro.props;

const currentPath = Astro.url.pathname;
const active = (href: string) => (currentPath === href ? 'page' : undefined);
---

<!doctype html>
<html dir="rtl" lang="ar" data-theme="light">
  <head>
    <Head
      title={title}
      description={description}
      path={path}
      ogType={ogType}
      noindex={noindex}
      schemaJsonLd={schemaJsonLd}
      lastReviewed={lastReviewed}
    />
    {/* Fonts load via the imported fonts.css (12 subset files in /fonts/);
        no preloads or inline @font-face here — the browser fetches only the
        subsets it needs. */}
  </head>
  <body>
    <a class="skip-link" href="#main-content">تخطَّ إلى المحتوى الرئيسي</a>
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="site-logo" href="/" aria-label={LOGO.text.ar}>{LOGO.text.ar}</a>
        <nav class="site-nav" aria-label="التنقل الرئيسي">
          <ul>
            {
              NAV.main.map((item) => (
                <li>
                  <a href={item.href} aria-current={active(item.href)}>{item.label.ar}</a>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
    </header>

    <main id="main-content">
      <slot />
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__grid">
          <div>
            <h2>{LOGO.lockup.ar}</h2>
            <p>{SITE.tagline.ar}</p>
          </div>
          <div>
            <h2>روابط سريعة</h2>
            <ul>
              {
                NAV.main.map((item) => (
                  <li><a href={item.href}>{item.label.ar}</a></li>
                ))
              }
            </ul>
          </div>
          <div>
            <h2>الصفحات القانونية</h2>
            <ul>
              {
                NAV.footer.map((item) => (
                  <li><a href={item.href}>{item.label.ar}</a></li>
                ))
              }
            </ul>
          </div>
        </div>
        <div class="site-footer__bottom">
          <p>
            © {new Date().getFullYear()} {SITE.brandName.ar} — جميع الحقوق محفوظة. تتم معالجة جميع الصور محليًا داخل متصفحك.
          </p>
          {/* AdSlot (Task 6) and ConsentToggle (Task 8) mount here */}
        </div>
      </div>
    </footer>
  </body>
</html>
```

- [ ] **Step 3: Fix the Task 1 stub page + remove the scaffold default layout if present**

The new BaseLayout requires a `path` prop, but the Task 1 stub `src/pages/index.astro` passes only `title`/`description` — update its opening tag to add `path="/"` (one line; keeps `astro check` green). Then tolerantly remove the scaffold default layout (the manual scaffold never creates `src/layouts/Layout.astro`):

```powershell
if (Test-Path -LiteralPath "src/layouts/Layout.astro") {
  Remove-Item -LiteralPath "src/layouts/Layout.astro"
}
```

- [ ] **Step 4: Run `astro check` to verify layout compiles**

```powershell
npm run check
```

Expected: PASS (Task 5's BaseLayout intentionally does not import Task 6 components; AdSlot and ConsentToggle mount in Tasks 6 and 8).

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "feat: add head meta helpers and base site layout"
```

---

### Task 6: Shared components — AdSlot, ConsentToggle, ToolShell

**Files:**
- Create: `src/components/AdSlot.astro`
- Create: `src/components/ConsentToggle.astro`
- Create: `src/components/ToolShell.astro`
- Create: `src/components/StatusMessage.astro`

**Interfaces:**
- `AdSlot` props: `{ location: 'belowIntro' | 'afterResult' | 'inContent' | 'sidebar' | 'betweenGuideSections'; className?: string }`. Renders nothing unless ADS.enabled.
- `ConsentToggle`: self-contained; renders a toggle bound to `window.imageTools?.consent` (Task 8). Ships with `data-consent-toggle` + `data-consent-state`.
- `ToolShell` props: `{ tool: ToolEntry; accent?: string }`. Renders breadcrumbs, H1, description, children, `afterResult` ad slot.
- `StatusMessage` props: `{ variant: 'error' | 'success' | 'warning' | 'info'; title?: string }`. Renders `role="status"`/`role="alert"` container.
- Consumed by: all tool pages (Task 11), all static pages (Task 12).

- [ ] **Step 1: Create `src/components/AdSlot.astro`**

```astro
---
import { ADS } from '../config/ads';

interface Props {
  location: 'belowIntro' | 'afterResult' | 'inContent' | 'sidebar' | 'betweenGuideSections';
  className?: string;
}

const { location, className } = Astro.props;

// Ads are globally disabled until real publisher IDs exist.
// When enabled, this renders a real <ins> slot wired to the configured ID.
const show = ADS.enabled && !ADS.testMode && ADS.publisherId !== '';
const slotId = ADS.slots[location];
---

{show && slotId !== '' && (
  <div class={className}>
    <ins
      class="adsbygoogle"
      style="display: block"
      data-ad-client={ADS.publisherId}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
    <script is:inline>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  </div>
)}
```

- [ ] **Step 2: Create `src/components/ConsentToggle.astro`**

```astro
---
// Consent toggle — inert until the consent module (Task 8) attaches.
// Renders in two states via [data-consent-state], styled by components.css.
const labels = {
  on: 'الموافقة على ملفات تعريف الارتباط مفعّلة',
  off: 'الموافقة على ملفات تعريف الارتباط معطّلة',
};
---

<button
  type="button"
  class="consent-toggle"
  data-consent-toggle
  data-consent-state="unknown"
  aria-pressed="false"
>
  <span class="consent-toggle__thumb" aria-hidden="true"></span>
  <span class="visually-hidden" data-consent-label></span>
</button>
```

> Add the toggle styles to `src/styles/components.css` in this task:

```css
/* ---- Consent toggle ---- */
.consent-toggle {
  display: inline-flex;
  align-items: center;
  width: 48px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-border);
  border: 1px solid var(--color-border);
  transition: background-color 0.2s ease;
  position: relative;
}

.consent-toggle__thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--shadow-sm);
  position: absolute;
  inset-inline-start: 2px;
  transition: inset-inline-start 0.2s ease;
}

.consent-toggle[data-consent-state='granted'] {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.consent-toggle[data-consent-state='granted'] .consent-toggle__thumb {
  inset-inline-start: calc(100% - 24px);
}
```

- [ ] **Step 3: Create `src/components/ToolShell.astro`**

```astro
---
import type { ToolEntry } from '../config/tools';
import AdSlot from './AdSlot.astro';

interface Props {
  tool: ToolEntry;
}

const { tool } = Astro.props;
const breadcrumbs = [
  { name: 'الرئيسية', path: '/' },
  { name: 'الأدوات', path: '/tools/' },
  { name: tool.title.ar, path: `/tools/${tool.slug}/` },
];
---

<nav aria-label="مسار التنقل">
  <ol class="breadcrumbs">
    {
      breadcrumbs.map((crumb, index) => (
        <li>
          {index === breadcrumbs.length - 1 ? (
            <span aria-current="page">{crumb.name}</span>
          ) : (
            <a href={crumb.path}>{crumb.name}</a>
          )}
        </li>
      ))
    }
  </ol>
</nav>

<header class="tool-header">
  <h1>{tool.title.ar}</h1>
  <p>{tool.description.ar}</p>
</header>

<slot />

<div class="tool-ads">
  <AdSlot location="afterResult" />
</div>
```

- [ ] **Step 4: Create `src/components/StatusMessage.astro`**

```astro
---
interface Props {
  variant: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  className?: string;
}

const { variant, title, className } = Astro.props;
const role = variant === 'error' ? 'alert' : 'status';
const labels: Record<Props['variant'], string> = {
  error: 'خطأ',
  success: 'تم بنجاح',
  warning: 'تنبيه',
  info: 'ملاحظة',
};
---

<div class={`status status--${variant} ${className ?? ''}`} role={role}>
  {title && <strong class="status__title">{title}</strong>}
  <slot />
</div>
```

> Add the status styles to `src/styles/components.css` in this task:

```css
/* ---- Status messages ---- */
.status {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: var(--font-size-sm);
}

.status__title {
  font-weight: 700;
}

.status--error {
  background: var(--color-error-bg);
  border-color: #fecdca;
  color: var(--color-error);
}

.status--success {
  background: var(--color-success-bg);
  border-color: #abefc6;
  color: var(--color-success);
}

.status--warning {
  background: var(--color-warning-bg);
  border-color: #fedf89;
  color: var(--color-warning);
}

.status--info {
  background: var(--color-bg-alt);
  border-color: var(--color-border);
  color: var(--color-text);
}
```

- [ ] **Step 5: Run `astro check` to verify components compile**

```css
/* ---- Breadcrumbs ---- */
.breadcrumbs {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  margin-block: var(--space-4);
  font-size: var(--font-size-sm);
}

.breadcrumbs li {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.breadcrumbs li + li::before {
  content: '/';
  color: var(--color-text-muted);
}

.breadcrumbs a {
  color: var(--color-text-muted);
}

.breadcrumbs a:hover {
  color: var(--color-accent);
}

.breadcrumbs [aria-current='page'] {
  color: var(--color-text);
  font-weight: 600;
}

/* ---- Tool header ---- */
.tool-header {
  margin-block-end: var(--space-8);
}

.tool-header h1 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--space-2);
}

.tool-header p {
  color: var(--color-text-muted);
  max-width: 640px;
}

.tool-ads {
  margin-block-start: var(--space-8);
}
```

- [ ] **Step 6: Wire AdSlot into the BaseLayout footer**

In `src/layouts/BaseLayout.astro`:
1. Add to the frontmatter imports: `import AdSlot from '../components/AdSlot.astro';`
2. Inside `.site-footer__bottom`, after the copyright `<p>`, mount:

```astro
<AdSlot location="sidebar" />
```

> AdSlot renders nothing while `ADS.enabled === false`, so this is inert until a real publisher ID is configured (Task 14 / launch).

- [ ] **Step 7: Run `astro check` to verify components compile**

```powershell
npm run check
```

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add -A
git commit -m "feat: add AdSlot, ConsentToggle, StatusMessage and ToolShell components"
```

---

### Task 7: Image codecs — pure libs for encode/decode + shared image utils

**Files:**
- Create: `src/lib/image/encoders.ts`
- Create: `src/lib/image/decoders.ts`
- Create: `src/lib/image/index.ts`
- Create: `tests/encoders.test.ts`

**Interfaces:**
- Produces:
  - `toCanvas(source: Blob): Promise<HTMLCanvasElement>` (async; works in browser)
  - `readImage(source: Blob): Promise<{ width, height, canvas }>`
  - `readImageDimensions(file: Blob): Promise<{ width, height }>`
  - `encodeBlob(canvas, opts: { type: 'image/jpeg'|'image/png'|'image/webp', quality?: number, backgroundColor?: string | null }): Promise<Blob>`
  - `newImageCanvas(width, height): HTMLCanvasElement`
  - `canUseToBlob(): boolean`
- Implementation: PNG fully lossless (encode + decode via `createImageBitmap`); JPEG and WebP via `canvas.toBlob()` (browser-native, lossy); GIF read-only (decode only, re-encode → PNG). BMP/TIFF unsupported → validated away upstream.
- Node-testable subset: pure branch logic extracted as `pickCodec(format: string, wantsTransparency: boolean): 'jpeg' | 'png' | 'webp'` so the decision tree is testable without a DOM.

- [ ] **Step 1: Write the failing codec test** (`tests/encoders.test.ts`)

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickCodec } from '../src/lib/image/index.ts';

test('codec: pickCodec resolves format + transparency correctly', () => {
  assert.equal(pickCodec('jpg', false), 'jpeg');
  assert.equal(pickCodec('jpeg', false), 'jpeg');
  assert.equal(pickCodec('png', true), 'png');
  assert.equal(pickCodec('png', false), 'png');
  assert.equal(pickCodec('webp', false), 'webp');
  assert.equal(pickCodec('webp', true), 'webp');
  assert.equal(pickCodec('gif', true), 'png');
  assert.equal(pickCodec('gif', false), 'png');
});

test('codec: unknown formats fall back to png', () => {
  assert.equal(pickCodec('tiff', false), 'png');
  assert.equal(pickCodec('', false), 'png');
});
```

- [ ] **Step 2: Run the test to verify it fails** (module missing)

```powershell
npm test
```

Expected: FAIL with module-not-found.

- [ ] **Step 3: Create `src/lib/image/encoders.ts`**

```ts
/**
 * Canvas-based encoders. Runs entirely in the browser (no server runtime).
 * PNG is fully lossless (no toBlob round-trip); JPEG/WebP use native canvas
 * toBlob. Node tests cover only the pure helpers (see index.ts).
 */

const hasToBlob = (): boolean => typeof HTMLCanvasElement !== 'undefined' && typeof HTMLCanvasElement.prototype.toBlob === 'function';

/** True when the environment can perform canvas->blob encoding. */
export function canUseToBlob(): boolean {
  return hasToBlob();
}

export function newImageCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/** Lossless PNG encoding via canvas.toBlob('image/png'). */
export async function encodePng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('فشل ترميز الصورة إلى PNG.'));
    }, 'image/png');
  });
}

/**
 * Lossy JPEG/WebP encoding. `backgroundColor` is used when the image has
 * transparency and the target format cannot store alpha.
 */
export async function encodeLossy(
  canvas: HTMLCanvasElement,
  type: 'image/jpeg' | 'image/webp',
  quality: number,
  backgroundColor: string | null,
): Promise<Blob> {
  const target = newImageCanvas(canvas.width, canvas.height);
  const ctx = target.getContext('2d');
  if (!ctx) throw new Error('تعذّر إنشاء سياق الرسم.');
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, target.width, target.height);
  }
  ctx.drawImage(canvas, 0, 0);
  return new Promise((resolve, reject) => {
    target.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('فشل ترميز الصورة.'));
      },
      type,
      quality,
    );
  });
}

/** High-level encode: pick codec from the pure helper, then delegate. */
export async function encodeBlob(
  canvas: HTMLCanvasElement,
  opts: {
    type: 'image/jpeg' | 'image/png' | 'image/webp';
    quality?: number;
    backgroundColor?: string | null;
  },
): Promise<Blob> {
  const quality = opts.quality ?? 0.82;
  const bg = opts.backgroundColor ?? null;
  if (opts.type === 'image/png') return encodePng(canvas);
  return encodeLossy(canvas, opts.type, quality, bg);
}
```

- [ ] **Step 4: Create `src/lib/image/decoders.ts`**

```ts
/**
 * Decoders. All browser-side. Decode is uniform via createImageBitmap
 * (or Image fallback where createImageBitmap is unavailable).
 */

import { newImageCanvas } from './encoders.ts';

type BitmapSource = ImageBitmap | HTMLImageElement;

function dimensionsOf(source: BitmapSource): { width: number; height: number } {
  if ('naturalWidth' in source) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }
  return { width: source.width, height: source.height };
}

async function createBitmap(source: Blob): Promise<BitmapSource> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(source);
  }
  // Fallback: <img> decode for legacy environments.
  const url = URL.createObjectURL(source);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Read any supported image Blob into a drawable canvas (preserves pixels). */
export async function toCanvas(source: Blob): Promise<HTMLCanvasElement> {
  const bmp = await createBitmap(source);
  const { width, height } = dimensionsOf(bmp);
  const canvas = newImageCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('تعذّر إنشاء سياق الرسم.');
  ctx.drawImage(bmp, 0, 0);
  return canvas;
}

export async function readImage(source: Blob): Promise<{ width: number; height: number; canvas: HTMLCanvasElement }> {
  const canvas = await toCanvas(source);
  return { width: canvas.width, height: canvas.height, canvas };
}

export async function readImageDimensions(file: Blob): Promise<{ width: number; height: number }> {
  const bmp = await createBitmap(file);
  const { width, height } = dimensionsOf(bmp);
  if (typeof (bmp as ImageBitmap).close === 'function') (bmp as ImageBitmap).close();
  return { width, height };
}
```

- [ ] **Step 5: Create `src/lib/image/index.ts`**

```ts
/**
 * Public image-utility API (browser). Also re-exports pure helpers so the
 * decision logic is unit-testable in node without a DOM.
 */

export type Codec = 'jpeg' | 'png' | 'webp';

/**
 * Pure decision: which codec to use for a target format, given whether the
 * image has transparency. Pure/stateless — node-testable.
 */
export function pickCodec(format: string, _wantsTransparency: boolean): Codec {
  switch (format.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'jpeg';
    case 'webp':
      return 'webp';
    case 'png':
    case 'gif':
    case 'bmp':
    default:
      return 'png';
  }
}

export { toCanvas, readImage, readImageDimensions } from './decoders.ts';
export { encodeBlob, newImageCanvas, canUseToBlob, encodePng, encodeLossy } from './encoders.ts';
```

> Note: `_wantsTransparency` is kept in the signature for future lossless-WebP work; P1 treats PNG as the only lossless target.

- [ ] **Step 6: Run all tests to verify they pass**

```powershell
npm test
```

Expected: codec tests PASS.

- [ ] **Step 7: Run `astro check`**

```powershell
npm run check
```

Expected: PASS (DOM types are ambient via `lib: ["DOM"]`; `encoders.ts`/`decoders.ts` are never executed in node — only `index.ts` pure helpers are imported by tests).

> Note: `tests/encoders.test.ts` imports only `pickCodec` from `src/lib/image/index.ts`. Node will load the whole module including `./decoders` and `./encoders` — which reference DOM globals only inside functions, not at module top level, so Node import is safe. Keep it that way.

- [ ] **Step 8: Commit**

```powershell
git add -A
git commit -m "feat: add image encoders, decoders and codec selection"
```

---

### Task 8: Consent manager + banner + toggle wiring

**Files:**
- Create: `src/scripts/consent.mjs` (is:inline script copied to `public/scripts/` — see step 4)
- Create: `src/components/ConsentBanner.astro`
- Wire: `BaseLayout.astro` (mount banner before `</body>`)
- Styles: add banner + toggle styles to `src/styles/components.css`

**Interfaces:**
- Produces global `window.imageTools = { consent: { state, subscribe, accept, deny, toggle } }` (safe-name, no external deps).
- `ConsentBanner` props: `{ debug?: boolean }` (debug forces the banner to show even after consent).
- `ConsentToggle` binds to `data-consent-toggle` elements.
- Consent state persisted in `localStorage` key `image-tools-consent` (`'granted' | 'denied'`). Default = no consent → banner shows → no tracking loads.

- [ ] **Step 1: Create `src/scripts/consent.mjs`**

```js
/**
 * Consent manager — pure vanilla JS, no deps.
 * State: 'granted' | 'denied' | null (null = undecided → banner shows).
 */
(function () {
  var KEY = 'image-tools-consent';
  var listeners = [];

  function read() {
    try {
      var v = window.localStorage.getItem(KEY);
      return v === 'granted' || v === 'denied' ? v : null;
    } catch (_) {
      return null;
    }
  }

  function write(state) {
    try {
      window.localStorage.setItem(KEY, state);
    } catch (_) {}
  }

  function set(state) {
    var prev = read();
    if (prev === state) return;
    write(state);
    for (var i = 0; i < listeners.length; i++) listeners[i](state);
    updateDom();
  }

  function toggle() {
    set(read() === 'granted' ? 'denied' : 'granted');
  }

  var LABEL_ON = 'الموافقة على ملفات تعريف الارتباط مفعّلة';
  var LABEL_OFF = 'الموافقة على ملفات تعريف الارتباط معطّلة';

  function updateDom() {
    var state = read();
    document.querySelectorAll('[data-consent-toggle]').forEach(function (btn) {
      var on = state === 'granted';
      btn.setAttribute('data-consent-state', state || 'unknown');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('[data-consent-label]').forEach(function (el) {
      el.textContent = state === 'granted' ? LABEL_ON : LABEL_OFF;
    });
    document.querySelectorAll('[data-consent-banner]').forEach(function (banner) {
      var debug = banner.hasAttribute('data-consent-debug');
      banner.hidden = state !== null && !debug;
    });
    document.dispatchEvent(new CustomEvent('consent:change', { detail: state }));
  }

  window.imageTools = window.imageTools || {};
  window.imageTools.consent = {
    get state() {
      return read();
    },
    subscribe: function (fn) {
      listeners.push(fn);
      fn(read());
      return function () {
        listeners = listeners.filter(function (l) { return l !== fn; });
      };
    },
    accept: function () { set('granted'); },
    deny: function () { set('denied'); },
    toggle: toggle,
  };

  // Wire toggles + banner buttons after DOM is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.imageTools.consent.toggle && document.dispatchEvent(new Event('image-tools:consent-ready')); wire(); });
  } else {
    wire();
  }

  function wire() {
    var consent = window.imageTools.consent;
    document.querySelectorAll('[data-consent-toggle]').forEach(function (btn) {
      btn.addEventListener('click', consent.toggle);
    });
    document.querySelectorAll('[data-consent-accept]').forEach(function (btn) {
      btn.addEventListener('click', consent.accept);
    });
    document.querySelectorAll('[data-consent-deny]').forEach(function (btn) {
      btn.addEventListener('click', consent.deny);
    });
    updateDom();
  }
})();
```

> Note: This is a single-file vanilla script — it ships as `public/scripts/consent.mjs` (served statically, no bundling) and is loaded from `Head.astro`. Because it runs on every page, it must remain dependency-free.

- [ ] **Step 2: Create `src/components/ConsentBanner.astro`**

```astro
---
interface Props {
  debug?: boolean;
}

const { debug = false } = Astro.props;
---

<div class="consent-banner" data-consent-banner data-consent-debug={debug ? 'true' : undefined} role="dialog" aria-label="الموافقة على ملفات تعريف الارتباط" hidden>
  <p class="consent-banner__text">
    نستخدم ملفات تعريف الارتباط لتحسين تجربتك وقياس أداء الموقع. الصور التي تعالجها لا تُرفع إلى أي خادم أبدًا.
    <a href="/cookies/">اقرأ سياسة الكوكيز</a>
  </p>
  <div class="consent-banner__actions">
    <button type="button" class="btn btn--primary btn--sm" data-consent-accept>موافقة</button>
    <button type="button" class="btn btn--secondary btn--sm" data-consent-deny>رفض</button>
  </div>
</div>
```

> Add `btn--sm` and banner styles to `src/styles/components.css`:

```css
.btn--sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
}

/* ---- Consent banner ---- */
.consent-banner {
  position: fixed;
  inset-inline: var(--space-4);
  bottom: var(--space-4);
  z-index: 90;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 760px;
  margin-inline: auto;
}

/* `display: flex` above would override the UA `[hidden]` rule, so restore it
   explicitly — otherwise the banner never hides after accept/deny. */
.consent-banner[hidden] {
  display: none;
}

.consent-banner__text {
  font-size: var(--font-size-sm);
  flex: 1 1 60%;
}

.consent-banner__text a {
  color: #9fe8d4;
  text-decoration: underline;
}

.consent-banner__actions {
  display: flex;
  gap: var(--space-2);
}
```

- [ ] **Step 3: Mount the banner + global styles import in `BaseLayout.astro`**

- Add `import '../styles/components.css'; import '../styles/tool-area.css';` to the BaseLayout frontmatter (fonts.css and base.css were already imported in Task 5; all four are bundled once per page).
- Add `<ConsentBanner />` just before `</body>`:

```astro
<ConsentBanner />
```

- [ ] **Step 4: Ship the static script**

```powershell
Copy-Item -LiteralPath "src/scripts/consent.mjs" -Destination "public/scripts/consent.mjs"
```

- [ ] **Step 5: Update `src/components/Head.astro`**

Change the consent `<script>` tag to load the shipped file when consent manager is enabled:

```astro
{showConsent && <script is:inline src="/scripts/consent.mjs" defer></script>}
```

- [ ] **Step 6: Manual smoke check**

```powershell
npm run dev
```

Open `http://localhost:4321/`. Expected:
1. Banner appears at the bottom on first visit.
2. Clicking "موافقة" hides it and sets `localStorage['image-tools-consent'] = 'granted'` (refresh keeps it hidden).
3. Clicking "رفض" hides it and sets `'denied'`.
4. `data-consent-state` on the toggle (once present, e.g. in the footer) reflects the choice.
5. No network requests to Google/Microsoft fire (all IDs are empty).

- [ ] **Step 7: Commit**

```powershell
git add -A
git commit -m "feat: add dependency-free consent manager with banner and toggle"
```

---

### Task 9: toolApp runtime + registry + sample tool

**Files:**
- Create: `src/lib/client/toolApp.ts`
- Create: `src/lib/client/registry.ts`
- Create: `src/lib/client/appInit.ts`
- Create: `src/lib/client/sampleTool.ts` (scaffold demo)
- Create: `src/pages/tools/compress-image.astro` (placeholder page wiring — real tool logic lands in Task 11)
- Create: `src/pages/tools/index.astro` (placeholder tools listing — full version in Task 12)
- Create: `src/pages/404.astro`

**Interfaces:**
- `toolApp(root: HTMLElement)`: the generic tool controller. Reads `[data-tool-payload]` JSON, wires form submission (`[data-action="process"]`), reset (`[data-action="reset"]`), upload (`input[data-upload-input]`), and renders results into `.tool-result`. For P1 the sample tool just echoes; real math engines land in Task 10.
- `registry.ts`: explicit static import map `{ 'compress-image': () => import('../tools/compress-image.ts') }` for code-splitting.
- `appInit.ts`: finds all `[data-tool]` roots, lazy-loads the matching module, calls `init`.
- Consumed by every tool page via a single `<script>` tag.

- [ ] **Step 1: Create `src/lib/client/toolApp.ts`**

```ts
/**
 * Generic tool controller. Owns the DOM contract shared by every calculator:
 * form -> process -> result. Tool-specific math lives in the tool module and
 * is passed in as `handlers`.
 *
 * DOM contract (must match the tool pages' form exactly):
 *   .tool-form, input[data-upload-input], [data-tool],
 *   [data-action="process"], [data-action="reset"],
 *   .tool-result, [data-status], [data-alerts],
 *   .field--invalid, [data-tool-payload]
 */

export interface ToolHandlers {
  process(inputs: Record<string, unknown>, payload: unknown): Promise<ToolOutput>;
}

export interface ToolOutput {
  message?: string;
  status: 'error' | 'success' | 'warning' | 'info';
  html: string;
}

export interface ToolApp {
  init(): void;
  destroy(): void;
}

export function toolApp(root: HTMLElement, handlers: ToolHandlers): ToolApp {
  const form = root.querySelector('.tool-form') as HTMLFormElement | null;
  const result = root.querySelector('.tool-result');
  const alerts = root.querySelector('[data-alerts]') as HTMLElement | null;
  const status = root.querySelector('[data-status]') as HTMLElement | null;
  const uploadInput = root.querySelector<HTMLInputElement>('input[data-upload-input]');

  const payloadEl = root.querySelector('[data-tool-payload]');
  let payload: unknown = null;
  if (payloadEl) {
    try {
      payload = JSON.parse(payloadEl.textContent ?? 'null');
    } catch {
      payload = null;
    }
  }

  function setStatus(kind: ToolOutput['status'], text: string) {
    if (!status) return;
    status.textContent = text;
    status.dataset.statusKind = kind;
  }

  function showAlerts(errors: string[]) {
    if (!alerts) return;
    alerts.innerHTML = errors.map((e) => `<div class="status status--error">${e}</div>`).join('');
    alerts.hidden = errors.length === 0;
  }

  function setBusy(busy: boolean) {
    root.dataset.busy = String(busy);
  }

  function collectInputs(): Record<string, unknown> {
    const values: Record<string, unknown> = {};
    if (!form) return values;
    const formData = new FormData(form);
    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }
    return values;
  }

  async function process() {
    if (!form) return;
    setBusy(true);
    try {
      const inputs = collectInputs();
      const output = await handlers.process(inputs, payload);
      if (output.status === 'error') {
        showAlerts([output.message ?? 'حدث خطأ غير متوقع.']);
      } else {
        showAlerts([]);
        setStatus(output.status, output.message ?? '');
        if (result) result.innerHTML = output.html;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع.';
      showAlerts([message]);
      setStatus('error', message);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    form?.reset();
    showAlerts([]);
    if (result) result.innerHTML = '';
    if (status) status.textContent = '';
    if (uploadInput) uploadInput.value = '';
  }

  function init() {
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      process();
    });
    root.querySelectorAll<HTMLElement>('[data-action="process"]').forEach((el) =>
      el.addEventListener('click', () => process()),
    );
    root.querySelectorAll<HTMLElement>('[data-action="reset"]').forEach((el) =>
      el.addEventListener('click', () => reset()),
    );
  }

  function destroy() {
    form?.removeEventListener('submit', () => process());
  }

  return { init, destroy };
}
```

> Note: `showAlerts` injects plain text with `innerHTML`. All `errors` come from `validateImageFile` (static Arabic strings) — no user-controlled HTML. Keep it that way.

- [ ] **Step 2: Create `src/lib/client/sampleTool.ts`**

```ts
import { toolApp, type ToolApp } from './toolApp';

/**
 * Scaffold demo tool. Replaced by the real compress-image engine in Task 10/11.
 */
export function initSampleTool(root: HTMLElement): ToolApp {
  return toolApp(root, {
    async process(inputs) {
      return {
        status: 'success',
        message: 'أداة تجريبية',
        html: `<p class="result-stats">استلمت المدخلات: ${JSON.stringify(inputs)}</p>`,
      };
    },
  });
}
```

- [ ] **Step 3: Create `src/lib/client/registry.ts`**

```ts
/**
 * Lazy-loader registry. Explicit static imports (no dynamic import strings)
 * keep Vite/Rollup code-splitting working for the `npm run build` output.
 */
export const toolRegistry: Record<string, () => Promise<{ initTool(root: HTMLElement): unknown }>> = {
  'compress-image': () => import('./sampleTool').then((m) => ({ initTool: m.initSampleTool })),
};
```

- [ ] **Step 4: Create `src/lib/client/appInit.ts`**

```ts
import { toolRegistry } from './registry';

/**
 * Boots every tool island on the page. Tools are opt-in via `data-tool`.
 */
export function initApp(): void {
  document.querySelectorAll<HTMLElement>('[data-tool]').forEach((root) => {
    const slug = root.dataset.tool;
    if (!slug) return;
    const loader = toolRegistry[slug];
    if (!loader) {
      console.warn(`[image-tools] unknown tool slug: ${slug}`);
      return;
    }
    loader()
      .then((mod) => mod.initTool(root))
      .catch((err) => console.error(`[image-tools] failed to init ${slug}`, err));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initApp());
} else {
  initApp();
}
```

- [ ] **Step 5: Create `src/pages/404.astro`** (uses BaseLayout, self-links to home)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { SITE } from '../config/site';

const title = 'الصفحة غير موجودة';
const description = 'الصفحة التي تبحث عنها غير موجودة أو نُقلت.';
---

<BaseLayout title={title} description={description} path="/404/" noindex>
  <section class="page-header">
    <h1>404</h1>
    <p>{description}</p>
    <p><a class="btn btn--primary" href="/">العودة إلى الرئيسية</a></p>
  </section>
</BaseLayout>
```

- [ ] **Step 6: Create `src/pages/tools/compress-image.astro`** (placeholder wiring)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ToolShell from '../../components/ToolShell.astro';
import { TOOLS } from '../../config/tools';
import { localizedPath } from '../../lib/i18n';

const tool = TOOLS.find((t) => t.slug === 'compress-image')!;
const title = tool.title.ar;
const description = tool.description.ar;
---

<BaseLayout title={title} description={description} path={localizedPath('ar', `/tools/${tool.slug}/`)}>
  <div class="container">
    <ToolShell tool={tool}>
      <div class="tool-card" data-tool="compress-image">
        <form class="tool-form">
          <label class="field" data-field="file">
            <span class="field__label">اختر صورة</span>
            <input type="file" name="file" accept="image/jpeg,image/png,image/webp" data-upload-input />
          </label>
          <div class="tool-actions">
            <button type="submit" class="btn btn--primary" data-action="process">ضغط الصورة</button>
            <button type="button" class="btn btn--secondary" data-action="reset">إعادة تعيين</button>
          </div>
        </form>
        <div data-alerts hidden></div>
        <div class="tool-result" data-status></div>
        <script type="application/json" data-tool-payload>{JSON.stringify({ tool: tool.slug, maxSize: 25 * 1024 * 1024 })}</script>
      </div>
    </ToolShell>
  </div>
  <script>
    import '../../lib/client/appInit';
  </script>
</BaseLayout>
```

> Real engine wiring replaces this scaffold in Task 11. The selectors here are the DOM contract.

- [ ] **Step 7: Create `src/pages/tools/index.astro`** (placeholder listing)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { TOOLS } from '../../config/tools';
import { localizedPath } from '../../lib/i18n';

const title = 'الأدوات';
const description = 'مجموعة أدوات لمعالجة الصور داخل متصفحك دون رفع أي ملف إلى خادم.';
---

<BaseLayout title={title} description={description} path={localizedPath('ar', '/tools/')}>
  <section class="page-header">
    <h1>{title}</h1>
    <p>{description}</p>
  </section>
  <section class="section container">
    <div class="card-grid">
      {
        TOOLS.filter((t) => t.active).map((tool) => (
          <a class="card tool-card-link" href={localizedPath('ar', `/tools/${tool.slug}/`)}>
            <h2>{tool.title.ar}</h2>
            <p>{tool.description.ar}</p>
          </a>
        ))
      }
    </div>
  </section>
</BaseLayout>
```

> Full listing (with search + categories) lands in Task 12.

- [ ] **Step 8: Run `astro check` + `npm test`**

```powershell
npm run check
npm test
```

Expected: PASS for both.

- [ ] **Step 9: Manual smoke check**

```powershell
npm run dev
```

Open `http://localhost:4321/tools/compress-image/`. Expected: the form renders; submitting echoes inputs into `.tool-result` (sample tool).

- [ ] **Step 10: Commit**

```powershell
git add -A
git commit -m "feat: add generic toolApp runtime, lazy registry and tool scaffolding"
```

---

### Task 10: Processing engines — pure math + browser glue, fully tested

**Files:**
- Create: `src/lib/processing/compress.ts`
- Create: `src/lib/processing/resize.ts`
- Create: `src/lib/processing/convert.ts`
- Create: `src/lib/processing/crop.ts`
- Create: `src/lib/processing/types.ts`
- Create: `src/lib/processing/index.ts`
- Create: `tests/processing.test.ts`

**Interfaces:**
- Pure, node-testable functions (no DOM at module top level — tests import the pure parts directly):
  - `clampTargetFileSize({ width, height, min, max, stride }) => { width, height }` (dimension clamp honoring aspect ratio)
  - `computeResize(width, height, opts: { mode: 'pixel' | 'percent' | 'max'; width?, height?, percent? }) => { width, height }`
  - `computeCrop(width, height, opts: { x, y, w, h, lockRatio?, baseRatio? }) => { x, y, w, h }` (clamped + aspect-locked)
  - `rotationToAngle(degrees) => number`
  - `parseDimensionInput(value) => number | null`
  - `parsePercentInput(value) => number | null`
- Browser glue (imports from `src/lib/image/*`):
  - `compressImage(blob, opts: { format?: 'jpg'|'webp'|'png', quality, backgroundColor, targetFileSize? }) => Promise<{ blob, width, height, sourceSize, resultSize, reduction }>`
  - `resizeImage(blob, opts) => ...`, `convertImage(blob, opts) => ...`, `cropImage(blob, opts) => ...`
  - `stripExif(blob) => Promise<{ blob, stripped }>` (re-encode → metadata gone by construction)
- Consumed by `toolApp` handlers in Task 11.

- [ ] **Step 1: Write the failing processing tests** (`tests/processing.test.ts`)

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clampTargetFileSize,
  computeResize,
  computeCrop,
  rotationToAngle,
  parseDimensionInput,
  parsePercentInput,
} from '../src/lib/processing/index.ts';

test('processing: clampTargetFileSize honors aspect ratio and bounds', () => {
  const r = clampTargetFileSize({ width: 4000, height: 3000, min: 320, max: 2000, stride: 2 });
  assert.ok(r.width <= 2000);
  assert.equal(r.height, Math.round((r.width / 4000) * 3000));
  assert.ok(r.width % 2 === 0);
});

test('processing: clampTargetFileSize enforces minimum', () => {
  const r = clampTargetFileSize({ width: 100, height: 80, min: 320, max: 2000, stride: 1 });
  assert.ok(r.width >= 320);
});

test('processing: computeResize pixel mode', () => {
  assert.deepEqual(computeResize(1000, 500, { mode: 'pixel', width: 800 }), { width: 800, height: 400 });
  assert.deepEqual(computeResize(1000, 500, { mode: 'pixel', height: 250 }), { width: 500, height: 250 });
  assert.deepEqual(computeResize(1000, 500, { mode: 'pixel', width: 800, height: 800 }), { width: 800, height: 800 });
});

test('processing: computeResize percent mode', () => {
  assert.deepEqual(computeResize(1000, 500, { mode: 'percent', percent: 50 }), { width: 500, height: 250 });
  assert.deepEqual(computeResize(1000, 500, { mode: 'percent', percent: 150 }), { width: 1500, height: 750 });
});

test('processing: computeResize max mode caps the longer side', () => {
  assert.deepEqual(computeResize(4000, 3000, { mode: 'max', max: 2000 }), { width: 2000, height: 1500 });
  assert.deepEqual(computeResize(200, 800, { mode: 'max', max: 400 }), { width: 100, height: 400 });
});

test('processing: computeCrop clamps to image bounds and locks ratio', () => {
  const r = computeCrop(1000, 800, { x: -50, y: 100, w: 2000, h: 500 });
  assert.ok(r.x >= 0);
  assert.ok(r.x + r.w <= 1000);
  assert.ok(r.h <= 800);

  const locked = computeCrop(1000, 800, { x: 100, y: 100, w: 400, h: 400, lockRatio: true, baseRatio: 1 });
  assert.ok(Math.abs(locked.w - locked.h) <= 1);
});

test('processing: rotationToAngle normalizes degrees', () => {
  assert.equal(rotationToAngle(0), 0);
  assert.equal(rotationToAngle(90), 90);
  assert.equal(rotationToAngle(450), 90);
  assert.equal(rotationToAngle(-90), 270);
});

test('processing: dimension and percent parsing', () => {
  assert.equal(parseDimensionInput('800'), 800);
  assert.equal(parseDimensionInput('0'), null);
  assert.equal(parseDimensionInput('abc'), null);
  assert.equal(parsePercentInput('50'), 50);
  assert.equal(parsePercentInput('150'), 150);
  assert.equal(parsePercentInput('-5'), null);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```powershell
npm test
```

Expected: FAIL (module missing).

- [ ] **Step 3: Create `src/lib/processing/types.ts`**

```ts
/** Shared processing option/result types. */

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CropBox extends Point, Size {}

export type OutputFormat = 'jpg' | 'png' | 'webp';

export interface ProcessResult {
  blob: Blob;
  width: number;
  height: number;
  sourceSize: number;
  resultSize: number;
  reduction: number;
  format: string;
}
```

- [ ] **Step 4: Create `src/lib/processing/resize.ts`** (pure math)

```ts
import type { Size } from './types';

/**
 * Pure dimension math. All values are integers >= 1.
 * `mode`:
 *   - 'pixel': fit within width/height box (keep aspect unless both given → exact box)
 *   - 'percent': scale by percent (>= 1)
 *   - 'max': cap the longer side at `max`
 */
export function computeResize(
  width: number,
  height: number,
  opts: { mode: 'pixel' | 'percent' | 'max'; width?: number; height?: number; percent?: number; max?: number },
): Size {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));

  if (opts.mode === 'pixel' && opts.width && opts.height) {
    return { width: Math.max(1, Math.round(opts.width)), height: Math.max(1, Math.round(opts.height)) };
  }

  if (opts.mode === 'pixel' && opts.width) {
    const ratio = h / w;
    const nw = Math.max(1, Math.round(opts.width));
    return { width: nw, height: Math.max(1, Math.round(nw * ratio)) };
  }

  if (opts.mode === 'pixel' && opts.height) {
    const ratio = w / h;
    const nh = Math.max(1, Math.round(opts.height));
    return { width: Math.max(1, Math.round(nh * ratio)), height: nh };
  }

  if (opts.mode === 'percent' && opts.percent != null) {
    const factor = opts.percent / 100;
    return {
      width: Math.max(1, Math.round(w * factor)),
      height: Math.max(1, Math.round(h * factor)),
    };
  }

  // 'max' mode: scale so the longer side == max.
  if (opts.mode === 'max' && opts.max) {
    const longer = Math.max(w, h);
    if (longer <= opts.max) return { width: w, height: h };
    const ratio = opts.max / longer;
    return {
      width: Math.max(1, Math.round(w * ratio)),
      height: Math.max(1, Math.round(h * ratio)),
    };
  }

  return { width: w, height: h };
}

/** Clamp a size so the longer side lands in [min, max] and both sides are even. */
export function clampTargetFileSize(opts: { width: number; height: number; min: number; max: number; stride?: number }): Size {
  const { width, height, min, max } = opts;
  const stride = opts.stride ?? 2;
  const longer = Math.max(width, height);
  let ratio: number;
  if (longer > max) ratio = max / longer;
  else if (longer < min) ratio = min / longer;
  else ratio = 1;
  let w = Math.round(width * ratio);
  let h = Math.round(height * ratio);
  w = Math.max(1, Math.round(w / stride) * stride);
  h = Math.max(1, Math.round(h / stride) * stride);
  return { width: w, height: h };
}
```

- [ ] **Step 5: Create `src/lib/processing/crop.ts`** (pure math)

```ts
import type { CropBox } from './types';

export function rotationToAngle(degrees: number): number {
  const d = degrees % 360;
  return d < 0 ? d + 360 : d;
}

/** Clamp a crop box to the image; optionally lock the aspect ratio. */
export function computeCrop(
  imageW: number,
  imageH: number,
  opts: { x: number; y: number; w: number; h: number; lockRatio?: boolean; baseRatio?: number },
): CropBox {
  let w = Math.max(1, Math.round(opts.w));
  let h = Math.max(1, Math.round(opts.h));
  let x = Math.max(0, Math.round(opts.x));
  let y = Math.max(0, Math.round(opts.y));

  if (opts.lockRatio && opts.baseRatio) {
    if (w / h > opts.baseRatio) h = Math.round(w / opts.baseRatio);
    else w = Math.round(h * opts.baseRatio);
  }

  // Clamp to image bounds.
  if (x + w > imageW) w = Math.max(1, imageW - x);
  if (y + h > imageH) h = Math.max(1, imageH - y);
  if (w > imageW) w = imageW;
  if (h > imageH) h = imageH;
  return { x, y, w, h };
}

export function parseDimensionInput(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const n = typeof value === 'number' ? value : Number(String(value).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}

export function parsePercentInput(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const n = typeof value === 'number' ? value : Number(String(value).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}
```

- [ ] **Step 6: Create `src/lib/processing/compress.ts`, `convert.ts` and the browser glue**

`compress.ts` (browser-side; re-encode → smaller file, strips metadata by construction):

```ts
import { encodeBlob, readImage } from '../image';
import { clampTargetFileSize } from './resize';
import type { OutputFormat, ProcessResult } from './types';
import { computeReduction } from './utils';

export async function compressImage(
  blob: Blob,
  opts: {
    format?: OutputFormat;
    quality?: number;
    backgroundColor?: string | null;
    targetFileSize?: number | null;
  },
): Promise<ProcessResult> {
  const { width, height, canvas } = await readImage(blob);
  const format = opts.format ?? 'webp';
  const quality = opts.quality ?? 0.82;

  let target = canvas;
  let outputSize = width;
  let outputHeight = height;
  const targetFileSize = opts.targetFileSize;

  // If the file is still above target after first pass, downscale dimensions.
  if (targetFileSize) {
    const pass = await encodeBlob(canvas, { type: mimeOf(format), quality, backgroundColor: opts.backgroundColor ?? null });
    if (pass.size > targetFileSize) {
      const scaled = clampTargetFileSize({ width, height, min: 320, max: Math.floor(width * 0.8), stride: 2 });
      const tmp = await readImage(blob);
      target = tmp.canvas;
      outputSize = scaled.width;
      outputHeight = scaled.height;
      const pass2 = await encodeBlob(target, { type: mimeOf(format), quality, backgroundColor: opts.backgroundColor ?? null });
      if (pass2.size > targetFileSize) {
        // Progressive pass: reduce quality in steps until under target.
        let q = quality;
        let best = pass2;
        while (q > 0.4 && best.size > targetFileSize) {
          q -= 0.1;
          best = await encodeBlob(target, { type: mimeOf(format), quality: q, backgroundColor: opts.backgroundColor ?? null });
        }
        return finish(target, best, blob, width, height, format);
      }
      return finish(target, pass2, blob, width, height, format);
    }
    return finish(canvas, pass, blob, width, height, format);
  }

  const result = await encodeBlob(canvas, { type: mimeOf(format), quality, backgroundColor: opts.backgroundColor ?? null });
  return finish(canvas, result, blob, width, height, format);
}

function finish(canvas: HTMLCanvasElement, result: Blob, source: Blob, width: number, height: number, format: string): ProcessResult {
  return {
    blob: result,
    width: canvas.width,
    height: canvas.height,
    sourceSize: source.size,
    resultSize: result.size,
    reduction: computeReduction(source.size, result.size),
    format,
  };
}

function mimeOf(format: OutputFormat): 'image/jpeg' | 'image/png' | 'image/webp' {
  return format === 'jpg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
}
```

> Create `src/lib/processing/utils.ts`:

```ts
import type { ProcessResult } from './types';

export function computeReduction(sourceSize: number, resultSize: number): number {
  if (sourceSize <= 0) return 0;
  return Math.max(0, Math.round((1 - resultSize / sourceSize) * 100));
}

export function resultToHtml(r: ProcessResult): string {
  const saving = r.reduction > 0 ? ` (توفير ${r.reduction}٪)` : '';
  return `<dl class="result-stats">
    <div><dt>الحجم قبل</dt><dd>${formatBytes(r.sourceSize)}</dd></div>
    <div><dt>الحجم بعد</dt><dd>${formatBytes(r.resultSize)}</dd></div>
    <div><dt>الأبعاد</dt><dd>${r.width} × ${r.height} بكسل</dd></div>
    <div><dt>الصيغة</dt><dd>${r.format}</dd></div>
  </dl><p class="result-stats__saving">${saving}</p>`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
```

> `convert.ts`:

```ts
import { encodeBlob, readImage } from '../image';
import { computeReduction } from './utils';
import type { OutputFormat, ProcessResult } from './types';

export async function convertImage(
  blob: Blob,
  opts: { format: OutputFormat; quality?: number; backgroundColor?: string | null },
): Promise<ProcessResult> {
  const { canvas } = await readImage(blob);
  const type = opts.format === 'jpg' ? 'image/jpeg' : opts.format === 'png' ? 'image/png' : 'image/webp';
  const result = await encodeBlob(canvas, { type, quality: opts.quality ?? 0.85, backgroundColor: opts.backgroundColor ?? null });
  return {
    blob: result,
    width: canvas.width,
    height: canvas.height,
    sourceSize: blob.size,
    resultSize: result.size,
    reduction: computeReduction(blob.size, result.size),
    format: opts.format,
  };
}
```

- [ ] **Step 7: Create `src/lib/processing/index.ts`** — the barrel that the pure tests import

```ts
export { clampTargetFileSize, computeResize } from './resize';
export { computeCrop, rotationToAngle, parseDimensionInput, parsePercentInput } from './crop';
export { computeReduction, resultToHtml } from './utils';
export type { ProcessResult, OutputFormat } from './types';
export { compressImage } from './compress';
export { convertImage } from './convert';
```

> Note: `cropImage` + `resizeImage` browser glue land in Task 11 along with the crop/resize tool pages (their math is fully covered above). This task covers all pure logic + compress/convert glue.

- [ ] **Step 8: Run the tests to verify they pass**

```powershell
npm test
```

Expected: processing suite PASS.

> Node-import safety: the barrel re-exports `compress.ts`/`convert.ts`, which import from `../image`. Those modules only touch DOM inside functions (never at module top level), so Node loads fine. `ProcessResult` blobs are typed only.

- [ ] **Step 9: Run `astro check`**

```powershell
npm run check
```

Expected: PASS.

- [ ] **Step 10: Commit**

```powershell
git add -A
git commit -m "feat: add processing engines with dimension and crop math"
```

---

### Task 11: Tool pages — compress, resize, convert, crop

**Files:**
- Update: `src/lib/client/registry.ts` (register all four tools)
- Create: `src/lib/client/tools/compressImage.ts`
- Create: `src/lib/client/tools/resizeImage.ts`
- Create: `src/lib/client/tools/convertImage.ts`
- Create: `src/lib/client/tools/cropImage.ts`
- Update: `src/pages/tools/compress-image.astro` (real form + payload + result template)
- Create: `src/pages/tools/resize-image.astro`
- Create: `src/pages/tools/convert-image.astro`
- Create: `src/pages/tools/crop-image.astro`

**Interfaces:**
- Each client module exports `initTool(root: HTMLElement): ToolApp` building on `toolApp` + Task 10 engines.
- Each page: `BaseLayout` + `ToolShell` + form matching the DOM contract from Task 9 + `data-tool-payload` JSON (`{ tool, formats, maxSize, defaults }`).
- All pages read `file` via `input[data-upload-input]`; process validates with `validateImageFile`, runs the engine, and renders `resultToHtml` + a downloadable `<a download>`.

**Shared handler pattern (each tool page):**

```ts
import { toolApp, type ToolOutput } from '../toolApp';
import { compressImage } from '../../processing';
import { validateImageFile } from '../../file';
import { LIMITS } from '../../config/limits';
import { resultToHtml } from '../../processing';

export function initTool(root: HTMLElement) {
  return toolApp(root, {
    async process(inputs, payload) {
      const file = inputs['file'] as File | undefined;
      const fmt = (inputs['format'] as string | undefined) ?? 'webp';
      const quality = Number(inputs['quality'] ?? 0.82);
      const formats = (payload as any)?.formats ?? ['jpg', 'jpeg', 'png', 'webp'];
      const maxSize = (payload as any)?.maxSize ?? LIMITS.maxFileSize;

      if (!file) {
        return { status: 'error', message: 'اختر صورة أولاً.', html: '' };
      }

      const buffer = await file.arrayBuffer();
      const check = validateImageFile(formats, file.name, file.size, maxSize, buffer);
      if (!check.valid) {
        return { status: 'error', message: check.errors.join(' '), html: '' };
      }

      const result = await compressImage(new Blob([buffer]), {
        format: fmt,
        quality,
        backgroundColor: fmt === 'jpg' ? '#ffffff' : null,
        targetFileSize: Number(inputs['targetSize'] || 0) || null,
      });

      const link = URL.createObjectURL(result.blob);
      const out: ToolOutput = {
        status: 'success',
        message: 'تمت العملية بنجاح.',
        html: `${resultToHtml(result)}<p><a class="btn btn--accent" href="${link}" download="${baseNameOf(file.name)}-compressed.${result.format}">تحميل الصورة</a></p>`,
      };
      return out;
    },
  });
}
```

> Note: `baseNameOf` is imported from `../../file`. `URL.createObjectURL` is browser-only and lives inside the handler, never at module top level (keeps node tests clean).

- [ ] **Step 1: Create the four client tool modules**

Follow the pattern above. Variations:
- **compressImage.ts**: fields `format` (webp default), `quality` (0.5–1, default 0.82), `targetSize` (KB, optional).
- **resizeImage.ts**: fields `mode` (`pixel`|`percent`|`max`), `width`, `height`, `percent`, `max`, `format` (webp default), `quality`. Uses `computeResize` + `resizeImage` glue (below).
- **convertImage.ts**: field `format` (jpg/png/webp), `backgroundColor` when jpg (checkbox "خلفية بيضاء"), `quality`. Uses `convertImage`.
- **cropImage.ts**: fields `x`, `y`, `w`, `h`, `lockRatio` checkbox, `ratio` select (free/1:1/16:9/4:3/3:2), `rotate` (0/90/180/270). Uses `computeCrop` + `rotationToAngle`.

> `resizeImage` glue (add to `src/lib/processing/resize.ts`, browser-side):

```ts
import { encodeBlob, readImage } from '../image';
import { computeResize } from './resize';
import { computeReduction } from './utils';
import type { ProcessResult, OutputFormat } from './types';

export async function resizeImage(
  blob: Blob,
  opts: { mode: 'pixel' | 'percent' | 'max'; width?: number; height?: number; percent?: number; max?: number; format: OutputFormat; quality?: number; backgroundColor?: string | null },
): Promise<ProcessResult> {
  const { width, height, canvas } = await readImage(blob);
  const size = computeResize(width, height, opts);
  const out = document.createElement('canvas');
  out.width = size.width;
  out.height = size.height;
  const ctx = out.getContext('2d')!;
  if (opts.backgroundColor) { ctx.fillStyle = opts.backgroundColor; ctx.fillRect(0, 0, out.width, out.height); }
  ctx.drawImage(canvas, 0, 0, out.width, out.height);
  const type = opts.format === 'jpg' ? 'image/jpeg' : opts.format === 'png' ? 'image/png' : 'image/webp';
  const result = await encodeBlob(out, { type, quality: opts.quality ?? 0.85, backgroundColor: opts.backgroundColor ?? null });
  return { blob: result, width: size.width, height: size.height, sourceSize: blob.size, resultSize: result.size, reduction: computeReduction(blob.size, result.size), format: opts.format };
}
```

> `cropImage` glue (add to `src/lib/processing/crop.ts`, browser-side):

```ts
import { encodeBlob, readImage } from '../image';
import { computeCrop, rotationToAngle } from './crop';
import { computeReduction } from './utils';
import type { ProcessResult, OutputFormat } from './types';

export async function cropImage(
  blob: Blob,
  opts: { x: number; y: number; w: number; h: number; lockRatio?: boolean; baseRatio?: number; rotate?: number; format: OutputFormat; quality?: number; backgroundColor?: string | null },
): Promise<ProcessResult> {
  const { width, height, canvas } = await readImage(blob);
  const box = computeCrop(width, height, opts);
  const angle = rotationToAngle(opts.rotate ?? 0);
  let out = document.createElement('canvas');
  out.width = box.w;
  out.height = box.h;
  let ctx = out.getContext('2d')!;
  if (opts.backgroundColor) { ctx.fillStyle = opts.backgroundColor; ctx.fillRect(0, 0, out.width, out.height); }
  ctx.drawImage(canvas, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
  if (angle !== 0) {
    const rotated = document.createElement('canvas');
    rotated.width = angle === 90 || angle === 270 ? out.height : out.width;
    rotated.height = angle === 90 || angle === 270 ? out.width : out.height;
    const rctx = rotated.getContext('2d')!;
    if (opts.backgroundColor) { rctx.fillStyle = opts.backgroundColor; rctx.fillRect(0, 0, rotated.width, rotated.height); }
    rctx.translate(rotated.width / 2, rotated.height / 2);
    rctx.rotate((angle * Math.PI) / 180);
    rctx.drawImage(out, -out.width / 2, -out.height / 2);
    out = rotated;
  }
  const type = opts.format === 'jpg' ? 'image/jpeg' : opts.format === 'png' ? 'image/png' : 'image/webp';
  const result = await encodeBlob(out, { type, quality: opts.quality ?? 0.85, backgroundColor: opts.backgroundColor ?? null });
  return { blob: result, width: out.width, height: out.height, sourceSize: blob.size, resultSize: result.size, reduction: computeReduction(blob.size, result.size), format: opts.format };
}
```

- [ ] **Step 2: Update the registry**

```ts
export const toolRegistry = {
  'compress-image': () => import('./tools/compressImage'),
  'resize-image': () => import('./tools/resizeImage'),
  'convert-image': () => import('./tools/convertImage'),
  'crop-image': () => import('./tools/cropImage'),
};
```

> Note: import modules must export `initTool`. The dynamic-import type is `() => Promise<{ initTool(root: HTMLElement): ToolApp }>` — adjust the registry typing accordingly (drop the `.then` wrapping; `appInit` calls `mod.initTool`).

- [ ] **Step 3: Update `appInit.ts` for the new module shape**

```ts
loader()
  .then((mod) => mod.initTool(root))
  .catch((err) => console.error(...));
```

- [ ] **Step 4: Write the compress-image page** (`src/pages/tools/compress-image.astro`) — real form

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ToolShell from '../../components/ToolShell.astro';
import { TOOLS } from '../../config/tools';
import { LIMITS } from '../../config/limits';
import { localizedPath } from '../../lib/i18n';
import { webApplicationJsonLd, breadcrumbJsonLd } from '../../lib/seo';

const tool = TOOLS.find((t) => t.slug === 'compress-image')!;
const path = localizedPath('ar', `/tools/${tool.slug}/`);
const schema = [
  webApplicationJsonLd({ title: tool.title.ar, description: tool.description.ar, path }),
  breadcrumbJsonLd([{ name: 'الرئيسية', path: '/' }, { name: 'الأدوات', path: '/tools/' }, { name: tool.title.ar, path }]),
];
---

<BaseLayout
  title={tool.title.ar}
  description={tool.description.ar}
  path={path}
  schemaJsonLd={schema}
>
  <div class="container">
    <ToolShell tool={tool}>
      <div class="tool-card" data-tool="compress-image">
        <form class="tool-form">
          <div class="dropzone" data-dropzone>
            <label class="dropzone__label" for="compress-file">
              <input type="file" id="compress-file" name="file" accept="image/jpeg,image/png,image/webp" data-upload-input required />
              <span class="dropzone__title">اسحب صورة هنا أو اضغط للاختيار</span>
              <span class="dropzone__hint">JPG أو PNG أو WebP — حتى {Math.round(LIMITS.maxFileSize / 1024 / 1024)} ميغابايت</span>
            </label>
          </div>

          <div class="tool-options">
            <label class="field" data-field="format">
              <span class="field__label">الصيغة الناتجة</span>
              <select name="format">
                <option value="webp">WebP (موصى به)</option>
                <option value="jpg">JPG</option>
                <option value="png">PNG (بدون فقدان)</option>
              </select>
            </label>
            <label class="field" data-field="quality">
              <span class="field__label">الجودة: <output data-quality-output>82</output>٪</span>
              <input type="range" name="quality" min="40" max="100" step="1" value="82" data-quality-input />
            </label>
            <label class="field" data-field="targetSize">
              <span class="field__label">الحد الأقصى للحجم (اختياري، بالكيلوبايت)</span>
              <input type="number" name="targetSize" min="1" placeholder="مثال: 500" />
            </label>
          </div>

          <div class="tool-actions">
            <button type="submit" class="btn btn--primary" data-action="process">ضغط الصورة</button>
            <button type="button" class="btn btn--secondary" data-action="reset">إعادة تعيين</button>
          </div>
        </form>

        <div data-alerts hidden></div>
        <div class="tool-result" data-status></div>
        <script type="application/json" data-tool-payload>
          {JSON.stringify({ tool: tool.slug, formats: tool.formats, maxSize: LIMITS.maxFileSize })}
        </script>
      </div>
    </ToolShell>
  </div>
  <script>
    import '../../lib/client/appInit';
  </script>
</BaseLayout>
```

> The quality range + `<output>` syncing is optional polish; the value is read from the form anyway. If added, wire a tiny inline handler.

- [ ] **Step 5: Write the resize, convert, crop pages** — same skeleton with per-tool fields:
  - **resize-image.astro**: `mode` select (pixel/percent/max) + conditional `width`/`height`/`percent`/`max` inputs + format/quality.
  - **convert-image.astro**: `format` select (jpg/png/webp) + `quality` + `backgroundColor` checkbox (shown when jpg) + dropzone.
  - **crop-image.astro**: numeric `x`/`y`/`w`/`h` + `ratio` select + `rotate` select + dropzone. (Full canvas-preview crop UI is P2; P1 uses manual numeric entry with clamped math.)
- Keep the DOM contract selectors identical across all four pages.

- [ ] **Step 6: Run `astro check` + `npm test`**

```powershell
npm run check
npm test
```

Expected: both PASS.

- [ ] **Step 7: Manual smoke checks**

```powershell
npm run dev
```

For each of the four tools:
1. Upload a real JPG/PNG/WebP → result renders with before/after sizes + download link works.
2. Upload a renamed `.txt`→`.jpg` file → error message, no crash.
3. Upload an oversized file (>25MB) → error message.
4. Reset clears the result.

- [ ] **Step 8: Commit**

```powershell
git add -A
git commit -m "feat: add compress, resize, convert and crop tool pages"
```

---

### Task 12: Guides + static pages

**Files:**
- Create: `src/content/guides.ts` (TS data — static pages content)
- Create: `src/pages/guides/index.astro`
- Create: `src/pages/guides/compress-image.astro`
- Create: `src/pages/guides/resize-image.astro`
- Create: `src/pages/guides/convert-image.astro`
- Create: `src/pages/guides/crop-image.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/privacy.astro`
- Create: `src/pages/cookies.astro`
- Create: `src/pages/terms.astro`
- Create: `src/pages/disclaimer.astro`
- Create: `src/pages/advertising-disclosure.astro`
- Create: `src/pages/how-files-are-processed.astro`

**Interfaces:**
- `src/content/guides.ts` exports `GUIDES: GuideEntry[]` with `{ slug, title: { ar }, description: { ar }, body: { ar: string[] }, faq: { q: { ar }, a: { ar } }[], related: string[], lastUpdated }` (body = array of paragraphs).
- Guides live in `src/pages/guides/<slug>.astro` (hardcoded routes — same pattern as tools).
- Static pages are thin wrappers over `BaseLayout` + `.legal-prose`. All copy uses the real owner/entity info when present, otherwise explicit placeholders.

- [ ] **Step 1: Create `src/content/guides.ts`**

```ts
export interface GuideEntry {
  slug: string;
  title: { ar: string };
  description: { ar: string };
  /** Body paragraphs. */
  body: { ar: string[] };
  faq: { q: { ar: string }; a: { ar: string } }[];
  related: string[];
  lastUpdated: string;
}

export const GUIDES: GuideEntry[] = [
  {
    slug: 'compress-image',
    title: { ar: 'كيف تضغط الصور دون فقدان الجودة' },
    description: { ar: 'دليل عملي لتقليل حجم الصور مع الحفاظ على مظهرها.' },
    body: {
      ar: [
        'ضغط الصورة يعني تقليل كمية البيانات اللازمة لتمثيلها دون تغيير مرئي كبير. أكثر الصيغ ضغطًا للعرض على الويب هي WebP وJPG.',
        'كلما خفّضت الجودة، صغر الحجم وزادت احتمالية ظهور تشويش. استخدم جودة تتراوح بين 70% و85% كتوازن جيد.',
        'في هذا الموقع تُعالج الصور بالكامل داخل متصفحك: لا يُرفع أي ملف إلى أي خادم، لذا تبقى صورك خاصة تمامًا.',
      ],
    },
    faq: [
      {
        q: { ar: 'هل رفع صورة على هذا الموقع آمن؟' },
        a: { ar: 'نعم. جميع المعالجة تحدث محليًا داخل متصفحك باستخدام واجهات Canvas، ولا يُرسل الملف إلى أي خادم.' },
      },
      {
        q: { ar: 'ما الصيغة الأفضل للضغط؟' },
        a: { ar: 'WebP تقدم أصغر حجم مع جودة بصرية ممتازة، ويدعمها جميع المتصفحات الحديثة.' },
      },
    ],
    related: ['resize-image', 'convert-image'],
    lastUpdated: '2026-08-10',
  },
  // ...resize-image, convert-image, crop-image entries (same shape)
];
```

- [ ] **Step 2: Create the guide page template** (`src/pages/guides/compress-image.astro`)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { GUIDES } from '../../content/guides';
import { localizedPath } from '../../lib/i18n';
import { breadcrumbJsonLd, faqJsonLd } from '../../lib/seo';
import AdSlot from '../../components/AdSlot.astro';
import { TOOLS } from '../../config/tools';

const guide = GUIDES.find((g) => g.slug === 'compress-image')!;
const path = localizedPath('ar', `/guides/${guide.slug}/`);
const schema = [
  breadcrumbJsonLd([{ name: 'الرئيسية', path: '/' }, { name: 'الأدلة', path: '/guides/' }, { name: guide.title.ar, path }]),
  faqJsonLd(guide.faq.map((f) => ({ q: f.q.ar, a: f.a.ar }))),
];
const toolSlug = guide.slug;
const tool = TOOLS.find((t) => t.slug === toolSlug);
---

<BaseLayout title={guide.title.ar} description={guide.description.ar} path={path} schemaJsonLd={schema}>
  <div class="container">
    <nav aria-label="مسار التنقل">
      <ol class="breadcrumbs">
        <li><a href="/">الرئيسية</a></li>
        <li><a href="/guides/">الأدلة</a></li>
        <li><span aria-current="page">{guide.title.ar}</span></li>
      </ol>
    </nav>
    <article class="legal-prose">
      <header class="page-header">
        <h1>{guide.title.ar}</h1>
        <p>{guide.description.ar}</p>
        <p class="legal-prose__meta">آخر تحديث: {guide.lastUpdated}</p>
      </header>

      {guide.body.ar.map((para) => <p>{para}</p>)}

      {tool && <p><a class="btn btn--primary" href={localizedPath('ar', `/tools/${toolSlug}/`)}>جرّب أداة {tool.title.ar}</a></p>}

      <h2>أسئلة شائعة</h2>
      {guide.faq.map((item) => (
        <section>
          <h3>{item.q.ar}</h3>
          <p>{item.a.ar}</p>
        </section>
      ))}

      <AdSlot location="betweenGuideSections" />
    </article>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Create `src/pages/guides/index.astro`** — grid of guides (reuse `.card-grid`)

- [ ] **Step 4: Create the static pages** — each a thin `BaseLayout` wrapper:

- **about.astro**: uses `SITE.brandName`, `SITE.tagline`, `SITE.lastReviewedDefault`; placeholder for owner bio.
- **contact.astro**: mailto form (from `SITE.contact`), plus a note that nothing is stored server-side.
- **privacy.astro / cookies.astro / terms.astro / disclaimer.astro / advertising-disclosure.astro / how-files-are-processed.astro**: `legal-prose` sections, `LEGAL`/`ADS`-driven placeholders, linked from the footer.

> All copy is honest: "أداة معالجة محلية — لا نرفع صورك ولا نخزنها." No invented legal entities — use explicit placeholders (e.g. "سيُحدَّث اسم الناشر هنا") where real info is missing.

- [ ] **Step 5: Run `astro check` + `npm test`**

```powershell
npm run check
npm test
```

Expected: both PASS.

- [ ] **Step 6: Commit**

```powershell
git add -A
git commit -m "feat: add guides, FAQ and static pages"
```

---

### Task 13: Home page + footer wiring

**Files:**
- Update: `src/pages/index.astro` (real home, replaces scaffold)
- Update: `src/layouts/BaseLayout.astro` (footer quick links + language note)
- Update: `src/pages/tools/index.astro` (full listing: categories + search)
- Optional: `src/pages/og.png` generation note (deferred to P2)

**Interfaces:**
- Home: hero + tool grid (from `TOOLS`) + "how it works" (3 steps) + trust note (no server, privacy) + guide links.
- Tools listing: category filters (tabs) + client-side search over titles/descriptions (tiny inline script).
- Footer: `NAV.footer` links + brand lockup + consent toggle.

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { TOOLS } from '../config/tools';
import { SITE } from '../config/site';
import { GUIDES } from '../content/guides';
import { localizedPath } from '../lib/i18n';
import { websiteJsonLd } from '../lib/seo';

const path = localizedPath('ar', '/');
const activeTools = TOOLS.filter((t) => t.active);
---

<BaseLayout title={SITE.brandName.ar} description={SITE.tagline.ar} path={path} isHome schemaJsonLd={[websiteJsonLd()]}>
  <section class="home-hero">
    <div class="container home-hero__inner">
      <h1>أدوات معالجة الصور داخل متصفحك</h1>
      <p>ضغط، تغيير حجم، تحويل واقتصاص الصور — بالكامل محليًا دون رفع أي ملف إلى أي خادم.</p>
      <a class="btn btn--accent" href="/tools/compress-image/">ابدأ الآن</a>
    </div>
  </section>

  <section class="section container">
    <h2 class="section__title">الأدوات</h2>
    <div class="card-grid">
      {
        activeTools.map((tool) => (
          <a class="card tool-card-link" href={localizedPath('ar', `/tools/${tool.slug}/`)}>
            <h3>{tool.title.ar}</h3>
            <p>{tool.description.ar}</p>
          </a>
        ))
      }
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <h2 class="section__title">كيف تعمل؟</h2>
      <ol class="steps">
        <li><strong>اختر صورة</strong> من جهازك</li>
        <li><strong>عدّل الإعدادات</strong> (الجودة، الأبعاد، الصيغة)</li>
        <li><strong>حمّل الناتج</strong> — ولا يغادر ملفك جهازك أبدًا</li>
      </ol>
    </div>
  </section>

  <section class="section container">
    <h2 class="section__title">الأدلة</h2>
    <div class="card-grid">
      {
        GUIDES.map((g) => (
          <a class="card tool-card-link" href={localizedPath('ar', `/guides/${g.slug}/`)}>
            <h3>{g.title.ar}</h3>
            <p>{g.description.ar}</p>
          </a>
        ))
      }
    </div>
  </section>
</BaseLayout>
```

> Add the missing styles for `.home-hero`, `.tool-card-link`, `.section__title`, `.steps` to `src/styles/components.css` (these were flagged in the AGENTS.md known-gaps).

- [ ] **Step 2: Add the known-gap styles to `src/styles/components.css`**

```css
/* ---- Home hero ---- */
.home-hero {
  background: linear-gradient(180deg, var(--color-bg-alt), var(--color-bg));
  border-bottom: 1px solid var(--color-border);
  padding-block: var(--space-16);
}

.home-hero__inner {
  max-width: 720px;
}

.home-hero h1 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-4);
}

.home-hero p {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--space-8);
}

/* ---- Tool cards ---- */
.tool-card-link {
  display: block;
  color: inherit;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.tool-card-link:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent);
  text-decoration: none;
}

.tool-card-link h3 {
  margin-bottom: var(--space-2);
}

.tool-card-link p {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin: 0;
}

/* ---- Section titles ---- */
.section__title {
  text-align: center;
  margin-bottom: var(--space-8);
}

/* ---- Steps ---- */
.steps {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
  counter-reset: step;
}

.steps li {
  counter-increment: step;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.steps li::before {
  content: counter(step);
  display: inline-grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-accent);
  color: #fff;
  font-weight: 700;
  margin-bottom: var(--space-3);
}
```

- [ ] **Step 3: Rewrite `src/pages/tools/index.astro`** — full listing with category tabs + inline search

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { TOOLS } from '../../config/tools';
import { localizedPath } from '../../lib/i18n';

const title = 'الأدوات';
const description = 'جميع أدوات معالجة الصور المحلية في مكان واحد.';
const categories = [
  { id: 'all', label: 'الكل' },
  { id: 'compress', label: 'الضغط' },
  { id: 'resize', label: 'تغيير الحجم' },
  { id: 'convert', label: 'التحويل' },
  { id: 'crop', label: 'القص' },
];
---

<BaseLayout title={title} description={description} path={localizedPath('ar', '/tools/')}>
  <section class="page-header">
    <h1>{title}</h1>
    <p>{description}</p>
  </section>

  <section class="container">
    <div class="tools-toolbar">
      <input type="search" class="tools-search" data-tools-search placeholder="ابحث عن أداة…" aria-label="البحث في الأدوات" />
      <div class="tools-tabs" data-tools-tabs>
        {categories.map((c) => <button type="button" class="tool-tab" data-tool-tab={c.id} aria-pressed={c.id === 'all'}>{c.label}</button>)}
      </div>
    </div>
    <div class="card-grid" data-tools-grid>
      {
        TOOLS.filter((t) => t.active).map((tool) => (
          <a class="card tool-card-link" data-tool-card={tool.category} data-tool-name={tool.title.ar} data-tool-desc={tool.description.ar}
            href={localizedPath('ar', `/tools/${tool.slug}/`)}>
            <h2>{tool.title.ar}</h2>
            <p>{tool.description.ar}</p>
          </a>
        ))
      }
    </div>
  </section>

  <script>
    // Inline vanilla filter — keeps the tools grid dependency-free.
    const grid = document.querySelector('[data-tools-grid]');
    const tabs = document.querySelectorAll('[data-tool-tab]');
    const search = document.querySelector('[data-tools-search]');

    const cards = Array.from(grid?.querySelectorAll('[data-tool-card]') ?? []);
    const apply = () => {
      const activeTab = document.querySelector('[data-tool-tab][aria-pressed="true"]')?.dataset.toolTab ?? 'all';
      const q = (search?.value ?? '').trim().toLowerCase();
      cards.forEach((card) => {
        const matchTab = activeTab === 'all' || card.dataset.toolCard === activeTab;
        const matchQ = q === '' || (card.dataset.toolName ?? '').includes(q) || (card.dataset.toolDesc ?? '').includes(q);
        card.hidden = !(matchTab && matchQ);
      });
    };

    tabs?.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
      apply();
    }));
    search?.addEventListener('input', apply);
  </script>
</BaseLayout>
```

> Add `.tools-toolbar`, `.tools-search`, `.tools-tabs`, `.tool-tab` styles in this task.

- [ ] **Step 4: Update `BaseLayout.astro` footer** — add the consent toggle next to the brand lockup

```astro
<div class="site-footer__bottom">
  <p>© {new Date().getFullYear()} {SITE.brandName.ar} — جميع الحقوق محفوظة.</p>
  <div class="site-footer__consent">
    <ConsentToggle />
    <span>الموافقة على ملفات تعريف الارتباط</span>
  </div>
</div>
```

(Import `ConsentToggle` in the layout frontmatter: `import ConsentToggle from '../components/ConsentToggle.astro';`.)

- [ ] **Step 5: Manual smoke check**

```powershell
npm run dev
```

Verify: home renders hero + grids; tools listing filters by tab and search; consent toggle flips state; footer links all resolve.

- [ ] **Step 6: Run `astro check` + `npm test` + `npm run build`**

```powershell
npm run check
npm test
npm run build
```

Expected: all three PASS.

- [ ] **Step 7: Commit**

```powershell
git add -A
git commit -m "feat: build home page, tools listing with search and footer wiring"
```

---

### Task 14: Full verification, sitemap, and launch push

**Files:**
- Update: `astro.config.mjs` (sitemap integration + site URL)
- Update: `package.json` (sitemap dep if not present)
- Create: `public/ads.txt` (generated by `adsTxtFor` — placeholder-safe)
- Create: `public/robots.txt`
- Create: `public/site.webmanifest`
- Create: `public/og-image.svg` (placeholder OG card)
- Optionally create: `src/pages/og-image.svg.astro` (dynamic OG per page — P2)

**Interfaces:**
- Produces: a shippable `dist/` with sitemap.xml, robots.txt, ads.txt, manifest, and no console errors; `npm run build` is the gate. Final push to `origin/main`.

- [ ] **Step 1: Update `astro.config.mjs`** — swap the hardcoded URL for the SITE import and add static-output settings (Task 1 used a literal URL because `src/config/site.ts` did not exist yet)

```js
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import { SITE } from './src/config/site.ts';

export default defineConfig({
  site: SITE.url,
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
});
```

- [ ] **Step 2: Create `public/robots.txt`**

```txt
User-agent: *
Allow: /

Sitemap: https://image-tools.example.com/sitemap-index.xml
```

> Update the sitemap URL to the real domain before launch.

- [ ] **Step 3: Create `public/ads.txt`**

Generated from `adsTxtFor` once a real publisher ID exists. Until then, ship an empty file with a comment:

```txt
# ads.txt — placeholder. Populated from src/config/ads.ts when a real
# publisher ID is configured.
```

- [ ] **Step 4: Create `public/site.webmanifest`**

```json
{
  "name": "أدوات الصور",
  "short_name": "أدوات الصور",
  "lang": "ar",
  "dir": "rtl",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#12305C",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

- [ ] **Step 5: Create `public/og-image.svg`** — minimal branded placeholder card (text-only, no fake imagery)

- [ ] **Step 6: Full verification gate**

```powershell
npm test
npm run check
npm run build
npm run preview
```

Expected:
- `npm test` — all suites green (config, i18n, seo, file, codec, processing).
- `npm run check` — 0 errors.
- `npm run build` — clean; `dist/` contains `sitemap-index.xml`, `robots.txt`, `ads.txt`, `site.webmanifest`, all routes (`.html`), and per-tool JS chunks.
- `npm run preview` — visit every route on `http://localhost:4321/`: home, `/tools/`, all four tools, all four guides, all static pages, 404. For each tool: upload → process → download works; spoofed/oversized files error gracefully. RTL renders correctly with no horizontal scroll at 360px viewport.

- [ ] **Step 7: Final commit + push**

```powershell
git add -A
git commit -m "chore: add sitemap, robots, manifest and launch assets"
git push -u origin main
```

> **Definition of Done for P1:** (1) All tasks 1–14 checked off. (2) `npm test`, `npm run check`, `npm run build` all green on a clean tree. (3) All routes render in `npm run preview`. (4) All four tools process real images end-to-end in the browser. (5) No analytics/ads IDs set. (6) No horizontal scroll at 360px in either flow. (7) `origin/main` pushed.

---

## Checklist

- [ ] Task 1 — Project scaffold (npm works, git+origin set, fonts copied)
- [ ] Task 2 — Centralized config system + registry tests
- [ ] Task 3 — i18n, seo, file helpers (pure, tested)
- [ ] Task 4 — Global styles: tokens, base, components, tool-area
- [ ] Task 5 — BaseLayout + Head
- [ ] Task 6 — Shared components: AdSlot, ConsentToggle, StatusMessage, ToolShell
- [ ] Task 7 — Image codecs (encoders/decoders) + pure codec selection
- [ ] Task 8 — Consent manager + banner + toggle wiring
- [ ] Task 9 — toolApp runtime + registry + sample tool + 404
- [ ] Task 10 — Processing engines (pure math + compress/convert glue, tested)
- [ ] Task 11 — Tool pages: compress, resize, convert, crop
- [ ] Task 12 — Guides + static pages
- [ ] Task 13 — Home page + tools listing + footer wiring
- [ ] Task 14 — Sitemap, robots, manifest, verification, push

## Blockers

- **Real domain/owner info:** `SITE.url`, owner email, legal entity, analytics/ads IDs are placeholders. Launch on the real domain requires updating `src/config/*.ts`.
- **Font filenames:** the calculator repo's `public/fonts/` uses lowercase `ibmplexsansarabic-*.woff2`. Task 1 copies them; Task 5's `@font-face` uses those names. Verify at copy time.
- **GIF:** decodes and re-encodes as PNG in P1 (no animated GIF preservation). Documented on the tool pages.
- **Crop UX:** P1 crop uses numeric x/y/w/h inputs (canvas-preview crop is P2).

## Verification

- Unit: `npm test` (config, i18n, seo, file, codec, processing) — run after every change to `src/lib/`.
- Types: `npm run check` — 0 errors.
- Build: `npm run build` — clean.
- Manual (after Task 8): RTL rendering, no horizontal scroll at 360px, consent banner behavior, all four tools end-to-end.

## Notes / Open Questions

- **English locale** (`/en/`) is future work; `type Locale = 'ar'` keeps the door open.
- **Ad rendering** stays OFF (`ADS.enabled === false`) until real publisher IDs are provided.
- **Analytics** stays OFF until a real measurement ID + GSC verification are provided.
- **Social resizer / batch processing** are P3 (config hooks exist: `SOCIAL_PRESETS`, `LIMITS.maxBatchCount`).
- **Dark mode** needs a `[data-theme]` token system built from scratch — not in P1.
- **OG image** is a static placeholder; per-page dynamic OG is P2.
