# Performance

Numeric budgets and the fixes that actually move them. Performance is a design property:
past a threshold, a slow interface is a *wrong* interface, because the user's model of
what they clicked has already decayed.

## Budgets

**Core Web Vitals** — the threshold is the **75th percentile** of real users, not your
laptop:

| Metric | Good | Needs work | Poor |
|---|---|---|---|
| **LCP** — largest contentful paint | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** — interaction to next paint | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** — cumulative layout shift | ≤ 0.1 | ≤ 0.25 | > 0.25 |

INP replaced FID in March 2024 and is much harder to pass — it measures every
interaction's full latency to the next paint, not just the first input's delay. Most
dashboards fail INP, not LCP, and they fail it on filter and sort.

**Human thresholds** (Miller 1968; Card et al. 1991):

| Budget | Meaning |
|---|---|
| **100ms** | Feels instant. Direct-manipulation feedback must land here — hover, selection, toggle |
| **1s** | Thought flow preserved. Navigation and filtering should land here |
| **10s** | Attention limit. Past this the user leaves; the work must survive their leaving |

**Asset budgets** for a data-heavy app on a mid-tier device:

- **JS ≤ ~170KB compressed** on the critical path. A charting library alone can exceed
  this — check before choosing (`ecosystem.md`).
- **Fonts: ≤ 2 families, ≤ 4 weights**, `font-display: swap`, subset and preload. Variable
  fonts pay for themselves at 3+ weights.
- **Never ship a full icon font.** Per-icon SVG or a tree-shaken set.

## Rendering thresholds

Where the technique has to change, not merely be tuned:

| Scale | Technique |
|---|---|
| < 1,000 marks | SVG. Full DOM, styleable, accessible, easy |
| 1,000 – 10,000 | Canvas 2D. SVG node count starts costing layout and memory badly |
| > 10,000 | WebGL, or aggregate server-side first — usually the right answer |
| Tables > ~100 rows | Virtualize |
| Tables > ~10,000 rows | Server-side pagination and sorting; virtualization alone stops being enough |

**Aggregate before you send.** The most effective dashboard optimisation by a wide margin
is not shipping row-level data to the browser at all. A cockpit that transfers 50,000 rows
to compute six numbers has a data-architecture problem that no amount of front-end
technique will fix.

## The playbook, in order of yield

1. **Server-side aggregation.** Send the six numbers, not the rows behind them. Fetch rows
   on drill-down.
2. **`content-visibility: auto` on below-fold modules.** The single highest
   effort-to-payoff CSS change available for long dashboards — the browser skips layout
   and paint for off-screen subtrees entirely. Always pair with `contain-intrinsic-size`
   to give the skipped element a placeholder height, or the scrollbar jumps as content
   comes into view.

   ```css
   .panel { content-visibility: auto; contain-intrinsic-size: auto 480px; }
   ```

   Caveat worth knowing: skipped subtrees are still exposed to the accessibility tree and
   are findable by in-page search, so this is not a correctness risk — but do not use it
   on anything that must animate as it enters.
3. **Virtualize long lists** (`react-window`, TanStack Virtual). Keep the sticky header
   and preserve keyboard navigation across the virtual boundary — the usual bug is that
   Tab escapes the list.
4. **Stale-while-revalidate.** Render cached numbers instantly with an "as of" stamp, then
   update. Perceived performance beats actual, and the stamp keeps it honest.
5. **Break up long tasks.** Anything > 50ms blocks input and shows up directly in INP.
   `await scheduler.yield()` between chunks where available; `setTimeout(0)` otherwise.
6. **Debounce remote, not local.** Filtering in memory should be immediate; a remote query
   gets ~300ms and a visible busy state.
7. **Memoize the expensive derivation, not the component tree.** Most React memoisation is
   cargo cult; profile first.

## Perceived performance

- **Skeletons that match the final layout.** A skeleton with different geometry causes a
  visible reflow and is worse than a spinner.
- **Reserve space for everything async** — images with `width`/`height` or
  `aspect-ratio`, chart containers with a fixed height. This is the whole of CLS.
- **Optimistic UI where the failure is recoverable and rare**, with a clear rollback.
  Never optimistic for anything destructive or financial.
- **Progressive disclosure of data**: headline numbers first, chart second, table last.
  Match the loading order to the reading order.
- **Instant feedback on every interaction, even if the result is slow.** The button must
  respond in 100ms even when the work takes 3s.

## Measuring

- **Lab (Lighthouse, Playwright) proves a change; field (RUM/CrUX) proves the experience.**
  Lab numbers on a fast machine on a warm cache mean approximately nothing on their own.
- **Throttle deliberately.** 4× CPU slowdown and Slow 4G is roughly a real mid-tier
  device; unthrottled localhost is not a test.
- **Measure INP by interacting**, not by loading. A page-load audit never touches the
  metric most dashboards fail.
- **Track the 75th percentile.** Means hide the tail that defines the reputation.
- **Budget in CI and fail the build.** A budget nobody enforces is a wish.

## Accessibility interactions

- `prefers-reduced-motion` must disable transitions and any auto-advancing content —
  including streaming animation and live-updating charts.
- Live-updating regions need `aria-live` politeness chosen deliberately: `polite` for
  metrics, and **never** `assertive` for anything that updates on a timer.
- Virtualized lists must expose position — `aria-setsize` and `aria-posinset`, since the
  DOM no longer carries the real count.

## Cross-references

- Chart mark counts and library weight → `dataviz.md`, `ecosystem.md`
- Streaming and latency masking for model output → `ai-surfaces.md`
- Motion durations and reduced-motion → `motion.md`
