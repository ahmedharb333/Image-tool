# HANDOFF — Continue the image-tools website (الموقع الثاني)

> Written: 2026-08-11. Paste this into a new session to resume the work. It is
> self-contained: it tells you which repo to work in, where the work stands,
> what the gates are, and what to do first.

## Which repo

Work **only** in `C:\Users\Lenovo\Documents\image-tools` — a standalone git repo,
branch `main`, remote `origin` = `https://github.com/ahmedharb333/Image-tool.git`
(not yet pushed). Do **not** touch `C:\Users\Lenovo\Documents\Default Project`;
that is the separate "Klar" financial-calculators site.

## What this project is

An Arabic-first (RTL, `lang="ar"`), static-output Astro image-tools website. All
image processing happens in the user's browser — files never leave the client,
are never stored, and nothing is sent to any server or third-party API. Zero UI
framework, zero runtime dependencies, `@/*` alias → `src/*`. All brand/domain/
contact/ads/analytics/legal/feature values live in `src/config/*.ts` as empty
placeholders (brand `أدوات الصور`, domain `https://image-tools.example.com`,
contact email empty). This is driven by the 6-part IMAGE PROMPT series; the
current plan covers P1 Foundation + P2 Core Tools.

## Source-of-truth documents

- Design spec (user-approved): `docs/superpowers/specs/2026-08-10-image-tools-design.md`
- Implementation plan (14 tasks): `docs/superpowers/plans/2026-08-10-image-tools-foundation.md`
- SDD progress ledger (per-task status + deferred notes): `.superpowers/sdd/2026-08-10-image-tools-foundation/progress.md`
- Per-task briefs/reports/reviews: `.superpowers/sdd/2026-08-10-image-tools-foundation/`

## Where the work stands

**Tasks 1–9 are COMPLETE** (commits `a1da5f4` … `5f941b7` + docs sync `11a08d4`):

1. Project scaffold (git init `main`, origin, fonts copied, favicon, styles)
2. Centralized config system + registry tests
3. i18n / seo / file helpers (pure, tested)
4. Global styles (tokens, base, components, tool-area)
5. BaseLayout + Head
6. Shared components (AdSlot, ConsentToggle, StatusMessage, ToolShell)
7. Image codecs (encoders/decoders + pure codec selection)
8. Consent manager + banner + toggle wiring
9. toolApp runtime + lazy registry + sample tool + 404

**NEXT: Task 10 — processing engines** (pure math + compress/convert browser
glue, fully tested in `tests/processing.test.ts`). Tasks 11–14 follow: the four
tool pages (compress/resize/convert/crop), guides + static pages, home + tools
listing, then sitemap/robots/manifest/verification/push.

## Gates verified at handoff time

- `npm test` → **21/21 pass**
- `npm run check` → **0 errors** (6 hints, all benign/plan-verbatim)
- `npm run build` → **clean**, 4 routes in `dist/`

## Uncommitted state (important)

The plan doc has ONE uncommitted edit (line ~3167): Task 10's `src/lib/processing/
resize.ts` must use `import type { Size } from './types.ts'` (explicit `.ts`
extension — same Node type-stripping fix as the Task 3 `seo.ts` case). Keep that
fix; apply it when writing the file. No other uncommitted work exists.

## How to work

Follow the plan strictly via **superpowers:subagent-driven-development** (the
plan's REQUIRED SUB-SKILL; the `.superpowers/sdd/` workspace already exists).
Work task by task: read the plan task → read the relevant ledger deferred-notes →
implement → verify → review → commit. Do not redesign or add scope beyond the plan.

## Gates (run after every change)

- `npm test` — node:test suites stay green
- `npm run check` — `astro check`, 0 errors
- `npm run build` — clean static build in `dist/`

## Key constraints to respect

- **Arabic only** (`type Locale = 'ar'`); no `/en` routes yet.
- **DOM contract** in `src/lib/client/toolApp.ts` must match page markup exactly:
  `.tool-form`, `input[data-upload-input]`, `[data-tool]`,
  `[data-action="process|reset"]`, `.tool-result`, `[data-status]`, `[data-alerts]`,
  `.field--invalid`, `[data-tool-payload]`.
- **Ads disabled** (`ADS.enabled === false`), analytics off, consent manager live.
- Only JPG/JPEG/PNG/WebP claimed as supported; GIF decodes → re-encodes as PNG;
  BMP/TIFF rejected by validation. No fake claims, badges, counters, or reviews.
- Filenames rendered via `textContent`, never `innerHTML`; validation via
  `validateImageFile` in `src/lib/file.ts`.
- No AGENTS.md exists in this repo yet — creating one that summarizes the above
  is welcome if it helps later sessions.

## First action

Read plan Task 10 + the Task 9 deferred notes in the ledger, then implement
Task 10 (write the failing `tests/processing.test.ts` first), keep the `.ts`
import fix, run the three gates, and commit.
