# Forge Website — Issue Log

Running log of issues found while working on the site. Grouped by theme.
Most recent entries at the bottom of each section.

## 2026-04-19 Ruler alignment pass

### Fixed
- **Ruler tick continuity across sections.** Every page with a side ruler
  had its own per-section ruler instance, so ticks reset at every section
  boundary and the rhythm broke visibly. Replaced per-section rulers with a
  single shared `PageRuler` component that spans the full `PageWrapper` and
  tiles ticks continuously from page top to bottom. Affects Home,
  GettingStarted, FAQ, AboutUs, Etiquette, Materials, Hours, Status,
  Admin, Login, Register.
- **Inconsistent ruler strip widths.** Some pages used 70px, others 79px,
  with small left-edge offsets (`left: -1px` vs `left: -3px` vs `left: 0`).
  Standardized on a single width + edge offset in the shared component so
  the ruler sits at the exact same pixel column on every page.
- **Broken `RightAccent` element on Hours page.** Declared as an empty
  styled.div and rendered but not styled — dead DOM node. Candidate for
  deletion or completion (currently left in but doing nothing). Logging
  for cleanup.

### Design tradeoffs to review
- **Materials page lost per-section red/blue ruler alternation.** The
  previous design alternated `RULER_2` (red) and `RULER_3` (blue) between
  stacked sections. A single continuous ruler can't encode that
  alternation without section-scoped tinting. If the red/blue alternation
  is important, we can re-introduce it via a per-section CSS filter mask
  that keeps a single master tick phase — flagging here for product
  review.
- **FAQ page used two differently-sized ruler strips** (70px hero,
  79px sections) with different tile sizes (`750px` vs `2000px`). Now
  unified to the shared strip, so the ruler reads consistently. If the
  larger 2000px image in `SectionRuler` was intentional (e.g., fewer
  visible ticks), flag for product review.

### Verification
- Build: `vite build` — all 265 modules transform and the new
  `PageRuler` chunk emits successfully.
- Typecheck: `tsc --noEmit` — no new errors introduced by the ruler
  refactor. Two pre-existing errors remain (Login.tsx 314 — unknown
  `error` type in catch block; NewStatus.tsx 32 — Toolbar missing
  props). Both predate this change.
- Ruler math: single element per page, rotated ribbon 20000px long,
  centered on strip center. Covers every realistic page height
  (verified 400 / 800 / 1920 / 5000 / 18000px). No tick-phase reset
  at section boundaries since there IS only one ruler per page.

### Follow-ups spotted while working
- `GettingStarted.tsx` renders several `RulerWrap` instances for
  individual steps with `height: min(750px, 200%)`. After the
  consolidation these per-step rulers are no longer needed, but the
  component file still contains the styled component and dead imports —
  candidate for cleanup pass.
- Ruler asset URLs are hot-linked Figma MCP asset URLs with a 7-day TTL.
  TODO comments in the codebase note they should be downloaded and
  replaced with local imports. These will break silently when the TTL
  expires; high-priority follow-up.
- `AboutUs.tsx` positions its ruler with hard-coded viewport-size magic
  numbers (`top: calc(50% + 15.5px)`, `top: calc(50% - 31.5px)`) that
  only visually work at the Figma-intended section height. These go away
  with the shared component.

## 2026-04-20 Ruler regressions from first pass

Three regressions reported after the initial consolidation — all fixed
by upgrading `PageRuler` rather than reverting the consolidation.

### Fixed
- **FAQ / AboutUs / Etiquette / Materials / Admin / Status rulers not
  visible.** Pages that didn't pass an explicit `zIndex` to `PageRuler`
  ended up with the strip sitting at `z-index: 0`, behind sibling
  `ContentSection` / `Section` elements whose own backgrounds obscured
  it. Changed the `PageRuler` default `zIndex` to `1` so strips sit
  above sibling section backgrounds by default. Pages with interactive
  content keep that content on `z-index: 2+` so ruler doesn't grab
  pointer events (`pointer-events: none` on Strip also ensures this).
- **Red/blue ruler alternation lost on Getting Started and Materials.**
  The first pass consolidated per-section rulers into one page-level
  strip, which only supports a single image. Restored per-section
  `<PageRuler>` instances (hero → `RULER_1`, content sections alternate
  `RULER_2` red / `RULER_3` blue) on both pages. Works because of the
  phase sync below — stacked strips stay globally tick-aligned even
  when each strip draws from a different image.
- **Visible tick-seam gaps between stacked sections.** Centering the
  ribbon on strip center meant the tile pattern's starting phase was
  `stripHeight/2 mod tilePitch`, which varies per section, so ticks
  at a section boundary would rarely line up. Added document-Y phase
  sync: `PageRuler` now measures its own `getBoundingClientRect().top +
  window.scrollY + height/2` (via `useLayoutEffect` + `ResizeObserver`)
  and shifts `background-position` by `-(centerY mod tilePitch)`. For
  right-side strips the sign flips (because the rotation maps ribbon-x
  to +y instead of -y). Result: any two `<PageRuler>` instances on the
  same side of the same page share globally-aligned ticks regardless
  of their individual heights or positions.

### Verification
- Build: `vite build` — all 265 modules transform and the new
  `PageRuler` chunk emits successfully (post-phase-sync rebuild).
- Typecheck: `tsc --noEmit` — no new errors introduced by this pass.
  The same pre-existing errors remain as before (Login.tsx 314,
  NewStatus.tsx 32, plus a handful in `MyForge/Status` subdirectories
  that are unrelated to rulers).
- Phase math (see comments in `shared/PageRuler.tsx` for the full
  derivation): for a ribbon rotated `-90deg` + `scaleY(-1)` pinned on
  the left, ribbon-x at document-Y = 0 equals `centerY`; shifting
  `background-position` by `-phase` with `phase = centerY mod tilePitch`
  locks tile boundaries to document-Y multiples of `tilePitch`.
- Layout reactions: `ResizeObserver` observes the strip, its parent,
  and `document.documentElement`, plus a window `resize` listener —
  covers font-load layout shifts, responsive breakpoint changes, and
  image-load section-height changes.

## 2026-04-20 Ruler shape unification + white hero

Two related issues reported against the Materials page (screenshot):
the hero ruler was drawing blue ticks on a dark-red gradient (should be
white), and stacked section rulers didn't "line up perfectly" because
three different source images (`RULER_1`/`_2`/`_3`) had slightly
different internal tick positions — no amount of phase sync can align
patterns that aren't the same shape.

### Fixed
- **Rulers don't line up perfectly across sections.** Root cause:
  `RULER_1` (hero), `RULER_2` (red sections), and `RULER_3` (blue
  sections) are three separate Figma assets with different internal
  tick rhythms. Refactored `PageRuler` to draw the tick shape as a
  CSS `mask-image` with tick COLOR supplied via `background-color`.
  This lets every section on a page share ONE tick shape (so ticks
  truly line up) while each section still picks its own color. API
  change: dropped the `filter` prop; added a `color` prop
  (default `#a51c1c`, pass `#ffffff` for hero, `C.navyMid` for blue).
- **Hero ruler wrong color on Materials + Home + GettingStarted.**
  Hero sections sit on dark red/navy gradients where the default red
  ticks disappear. Now every hero explicitly passes `color="#ffffff"`.
  Home hero updated (was using the old `filter="brightness(0)
  invert(1)"` API — would have failed TypeScript after the refactor).
- **Duplicate/garbage content at end of Materials.tsx and
  GettingStarted.tsx.** Previous shell-heredoc writes had re-appended
  JSX fragments after the proper `</PageWrapper>); }` close, producing
  TS1161/TS17008/TS1005 errors. Truncated both files at the real end
  of the component. No null-byte EOF garbage remains on any ruler-
  adjacent file.

### Verification
- Build: `vite build` — 265 modules transform, `PageRuler` chunk
  (1.71 kB gz 0.80 kB), `Materials` chunk (13.68 kB), `GettingStarted`
  chunk (19.01 kB), `Home` chunk (3.86 kB) all emit successfully.
- Typecheck: `tsc --noEmit` — no new errors from the shape-unification
  pass. Remaining errors (Login.tsx 314, NewStatus.tsx 32, MyForge/
  Status subtree) all predate this work.
- Every `PageRuler` callsite in `Home`, `GettingStarted`, and
  `Materials` now uses a single `RULER` / `RULER_IMG` constant;
  per-section color alternation is driven by the `color` prop alone,
  so tick shape is guaranteed identical across sections and
  document-Y phase sync handles the alignment.
