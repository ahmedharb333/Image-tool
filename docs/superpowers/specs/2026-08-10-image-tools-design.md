# Image Tools — Arabic Image-Processing Website (الموقع الثاني)

**Date:** 2026-08-10
**Status:** Approved for implementation (design presented to user; user approved).
**Project root:** `C:\Users\Lenovo\Documents\image-tools` (new standalone project beside the calculators repo).
**Stack:** Astro (static output), Arabic-first RTL, zero UI framework, node:test, `@/*` alias → `src/*`. Mirrors the calculators repo's proven architecture; English reserved for a later release (not built now).

## 1. Purpose

Build the second Arabic-first website: a suite of image-processing tools that run entirely in the user's browser. Business goals: attract high-intent Arabic search traffic, provide genuinely useful tools, become AdSense-eligible, prepare for future premium/affiliate revenue, and build trust through local processing and transparent privacy.

Processing principle (applies to every tool): files never leave the browser, are never stored (not images, filenames, EXIF, contents, history), and nothing is sent to third-party APIs. Where browser processing is impossible, the feature is shown as unsupported and stays disabled — never faked.

All brand/domain/contact/logo/colors/analytics/ads/legal/feature-flag values are editable from a single centralized configuration area (`src/config/`).

## 2. Phase decomposition

Each phase is its own spec → plan → implementation cycle. This spec covers **P1 (Foundation)** in detail and fixes the architecture for later phases.

| Phase | Scope | Outcome |
|---|---|---|
| **P1 Foundation (THIS)** | App skeleton, design system, config, routing, global components, uploader with validation (no processing yet), functional preview + report | Fully navigable RTL Arabic site, all 14 required routes live |
| P2 Core tools | compress / resize / crop / convert | 4 working tools |
| P3 Advanced tools | bulk compressor, social resizer, watermark, metadata strip, rotate/flip | 5 working tools |
| P4 Content & SEO | tool-page content standard, trust pages, guides, SEO, internal linking | Indexable content pages |
| P5 Monetization | AdSlot, consent, analytics, premium/affiliate placeholders | AdSense-ready |
| P6 Final QA | audit + report | Launch readiness |

## 3. Required public routes (P1)

- `/` home — hero, tool grid, privacy promise, how-it-works strip
- `/tools` — index of tool cards
- `/tools/compress-image`, `/tools/resize-image`, `/tools/convert-image`, `/tools/crop-image` — tool pages (P1: full page shell + uploader with working validation; process action disabled via empty engine registry)
- `/guides` — guides index (empty state until P4)
- `/about`, `/how-files-are-processed`, `/privacy`, `/cookies`, `/terms`, `/disclaimer`, `/advertising-disclosure`, `/contact` — static content pages
- `/404` — real 404 page
- `robots.txt`, `sitemap-index.xml` (via `@astrojs/sitemap`)

Tool pages render via dynamic route `src/pages/tools/[slug].astro`, driven by the registry in `src/config/tools.ts` plus content in `src/content/tools/<slug>.ts`. The four slugs are registered in P1 with full content (H1, intro, formats, limits, FAQs, methodology, mistakes, related tools, last-reviewed date, disclaimer) so they are indexable from day one; the process button stays disabled until P2 wires the engines.

## 4. Configuration system (`src/config/`)

All editable values live here; no hardcoded IDs/values in components.

- `site.ts` — brand name (placeholder), tagline, domain placeholder, contact email placeholder, locale (`ar` default), theme colors, default last-reviewed date
- `nav.ts` — main + footer nav link arrays
- `tools.ts` — tool registry: `{ slug, category, title, formats, maxFileSize, relatedTools[], guide, active }`
- `limits.ts` — max file size, max image dimensions, max batch count/size (configurable)
- `ads.ts` — publisher ID, global head code, ad-slot IDs, feature flag, test mode, ads.txt record (all empty/disabled)
- `analytics.ts` — GA4 measurement ID, GSC verification, Clarity project ID, consent flags (disabled)
- `features.ts` — feature flags: analytics events, premium placeholders, affiliate components
- `legal.ts` — legal entity names (empty placeholders), reviewer placeholder text, last-reviewed default
- `social.ts` — social-media preset dimensions (reserved for P3; a stub file may exist in P1)

## 5. Content is TS data (`src/content/`)

Mirrors the calculators repo pattern, Arabic-only for now (single-key `{ ar }` shape so English can be added later mechanically without refactor).

- `src/content/types.ts` — `ToolContent`, `StaticPageContent`, `ProseSection`, `GuideContent`
- `src/content/tools/<slug>.ts` + `index.ts` — localized tool content
- `src/content/pages.ts` — static pages (about, privacy, cookies, terms, disclaimer, advertising-disclosure, contact, how-files-are-processed)
- `src/content/guides.ts` — empty registry in P1 (P4 fills it)

## 6. SEO plumbing (P1 baseline)

Mirrors `src/lib/seo.ts` from the calculators repo, adapted:

- `buildTitle`, `absoluteUrl`, `metaRobots`, canonical URLs, OG/twitter meta, hreflang (future-reserved)
- JSON-LD builders: WebSite, BreadcrumbList, WebApplication (tool pages), FAQPage (only where visible FAQs exist), Article (guides, P4)
- `BaseLayout.astro` renders `lang="ar"` `dir="rtl"`, canonical, OG, robots, structured data
- No fabricated ratings, reviews, awards, or download counts
- Sitemap via `@astrojs/sitemap`; `robots.txt.ts`; real 404

## 7. Design system

Adapted from the calculators repo's `tokens.css`, `base.css`, `components.css`, `fonts.css`. The palette already matches the spec: navy primary `#12305C`, teal accent `#0E8A6D`, white/very-light backgrounds, IBM Plex Sans Arabic (self-hosted woff2 copied from the calculators repo's `public/fonts/`, plus `favicon.svg`).

- **Light-only.** The dark `[data-theme]` block in the calculators repo's tokens is not ported (this site is light-only per the design direction). No dark-mode work in any phase.
- **RTL** via logical properties (`inset-inline-*`, `padding-inline-*`). Check both scroll directions after layout changes.
- Typography: IBM Plex Sans Arabic; headings navy, body neutral; teal reserved for actions/results.
- Responsive: 360 / 768 / 1024 / 1440 px. No horizontal scrolling, single-column processing flow on mobile, large touch targets.

## 8. Components (`src/components/`)

Global chrome:
- `Header.astro` — sticky, brand (config-driven text), nav, mobile menu button
- `MobileNav.astro` — slide-in drawer, keyboard-closable, large touch targets
- `Footer.astro` — nav columns, legal links, privacy/affiliate disclosures
- `Breadcrumbs.astro` — renders BreadcrumbList JSON-LD
- `BaseLayout.astro`, `PageLayout.astro`, `ToolLayout.astro`

Tool/utility components:
- `ToolCard.astro` — `/tools` grid + home
- `GuideCard.astro` — `/guides` (empty state until P4)
- `FileUploader.astro` — drag-and-drop zone + standard file button; labels, focus states, keyboard access
- `FileValidationAlert.astro` — accessible error alerts (`role="alert"`); MIME + size checks
- `ProcessingStatus.astro` — progress/status text + `role="status"` live region
- `FileInfoTable.astro` — before/after dimensions & sizes
- `ResultCard.astro` — result preview, new size, reduction %, download + reset actions
- `RelatedTools.astro`, `FAQSection.astro`, `PrivacyNotice.astro`, `AffiliateDisclosure.astro`
- `AdSlot.astro` — renders nothing until a valid publisher ID is configured (wiring in P5; P1 keeps it unmounted)
- `ErrorBoundary.astro` — client-side try/catch with graceful fallback
- `EmptyState.astro`, `NotFoundPage.astro` (404)
- `ToolShell.astro` — the DOM contract hub (see §9)

**DOM coupling (do not break):** `toolApp.ts` hard-couples to class names/attributes in `ToolShell.astro`: `.tool-uploader`, `[data-field="<id>"]`, `.field--invalid`, `[data-action="process|reset"]`, `.tool-result`, `[data-status]`. A UI redesign that renames these must update client selectors in lockstep, or every tool breaks silently.

## 9. File-processing architecture

**P1 delivers the upload pipeline only.** Engines land in P2.

- `src/lib/processing/types.ts` — `ToolEngine` interface: `validate(file, settings)` → validation result/errors; `process(file, settings)` → `{ blob, info }`. Pure TS, no DOM.
- `src/lib/processing/registry.ts` — static import map slug → engine (empty in P1; P2+ fills it). `ToolShell` looks up the engine; if absent, the process action renders disabled with a clear Arabic message that processing arrives in a later release (spec forbids pretending a feature works).
- `src/lib/client/toolApp.ts` — client controller: signature+size validation, object-URL preview creation, revocation on replace/reset/unmount, result rendering, download trigger. No uploads, no persistence.
- `src/lib/file.ts` — pure helpers: `readSignature`, `detectType`, `sanitizeFilename`, `formatBytes`, `downloadBlob`, `revokeObjectUrl`, `buildOutputFilename`.
- Memory discipline: revoke old object URLs before creating new ones; cleanup on unmount; warn for files above a configurable "large file" threshold (`limits.ts`).

## 10. Privacy & security (enforced from P1)

- Files stay in browser. No fetch/XHR of file contents, no storage of filename/EXIF/history/downloads.
- No secrets in client bundles (analytics/ads IDs are placeholders in config anyway).
- Filenames rendered via `textContent`/escaping only — never `innerHTML`.
- `how-files-are-processed` page written in P1 with accurate content: local-only processing, what is collected, what is never sent, temporary memory use, what happens when the page is closed.

## 11. Accessibility

Semantic HTML; one H1 per page; skip link; visible focus rings (`--focus-ring`); keyboard-operable uploader, drawer, reset/download; `role="status"`/`role="alert"` for status and errors; aria-labels on icon-only buttons; 4.5:1 contrast; browser zoom support; 360→1440 responsive with no horizontal scroll; screen-reader-friendly status messages.

## 12. Testing (P1)

`node --test "tests/**/*.test.ts"` (pure logic, no DOM). Tests cover:

- `file.ts` — signature sniffing, extension-spoof rejection, size formatting, filename sanitize, output-filename construction
- `seo.ts` — title building, canonical, robots meta
- `tools.ts` config integrity — every registered slug has a content file, no duplicate routes, active flags consistent
- `limits.ts` — threshold helpers

Gating commands: `npm run check` (`astro check`), `npm run build` (`astro check && astro build`).

## 13. P1 deliverable

1. Functional preview via `npm run dev`: all routes render, nav/design system work, uploader validates files, process buttons disabled with clear messaging.
2. Implementation report (per Prompt 1): routes created, components created, config fields, current file-processing architecture, unsupported functions, known limitations, recommended next step.

## 14. Known limitations (P1)

- No image processing yet (P2 fills engines; process disabled until then).
- Guides index empty (P4).
- Ads, analytics, consent, premium/affiliate all disabled placeholders (P5).
- Dark mode intentionally absent (design is light-only).
- Brand/domain/contact are placeholders in `src/config/site.ts`.
- Ad placements declared in `ads.ts` config but unmounted in P1 (belowIntro, inContent, betweenGuideSections are reserved; only mount per P5).

## 15. Recommended next step

After P1 ships: P2 (Core Tools Batch One — compress, resize, crop, convert) with a dedicated spec/plan cycle.
