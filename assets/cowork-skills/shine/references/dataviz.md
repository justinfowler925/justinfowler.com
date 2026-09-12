# Data visualization

Chart selection, encoding, and the formatting rules that make a number comparable. Screen
composition is in `dashboards.md`; render cost is in `performance.md`.

## Encoding accuracy — the ranking everything else derives from

Cleveland & McGill (1984), replicated by Heer & Bostock (2010) on Mechanical Turk. Ordered
by measured accuracy of quantitative judgement:

1. **Position on a common scale** — bar, dot plot, line on shared axis
2. **Position on non-aligned scales** — small multiples
3. **Length** — stacked bar segments, bullet graphs
4. **Angle / slope** — pie, donut, slope graph
5. **Area** — bubble, treemap
6. **Volume / curvature** — 3D anything
7. **Colour saturation / density** — heatmap, choropleth

**The operative rule: encode the value the reader must judge most precisely using the
highest-ranked channel available.** Almost every bad chart is a precise question asked
through a channel from the bottom half of this list.

Note what the ranking *is*: accuracy of extracting a magnitude. It is not a ranking of
usefulness. A heatmap is rank 7 and is the right chart for spotting a pattern across 500
cells, because the question is "where is it hot", not "what is this cell's value".

## Chart selection

| Question | Chart | Notes |
|---|---|---|
| Compare across categories | Horizontal bar | Sort by value, not alphabetically, unless the category order is meaningful |
| Change over time | Line | ≤ 5 series; label at the line end, not in a legend |
| Part-to-whole, few parts | Stacked bar (single) or pie ≤ 5 | Only the first and last segment of a stack are readable |
| Part-to-whole over time | Stacked area, or 100% stacked bar | Only if the total is meaningful |
| Attribution of a change | **Waterfall** | The most under-used chart in revenue work |
| Distribution | Histogram, box plot, or strip plot | Never a bar of averages — it hides the distribution that matters |
| Correlation | Scatter | Add the trend line only with the n and the fit stated |
| Value vs. target | **Bullet graph** (Few) | Beats a gauge in a fraction of the space |
| Rank change over time | Slope graph or bump chart | Two periods → slope; many → bump |
| Progress to a deadline | Pacing line vs. elapsed-time line | "Ahead/behind" needs the time axis, not a percentage |

### Denylist, with the perceptual reason

- **Dual y-axis** — the crossing point is an artefact of scale choice; readers infer
  causation from it. Use two stacked panels sharing an x-axis.
- **3D anything** — rank 6 encoding, plus occlusion and foreshortening error.
- **Donut with a KPI in the hole** — the number in the hole is doing the work; the ring is
  decoration competing with it.
- **Radar / spider** — area scales with the square of the values, the shape depends
  entirely on axis order, and axes are non-aligned.
- **Gauge / speedometer** — enormous area for one number and one threshold. Bullet graph.
- **Rainbow / jet colormap** — perceptually non-uniform; invents boundaries in continuous
  data (Borland & Taylor 2007). Use a perceptually uniform ramp (viridis, magma, or an
  OKLCH ramp of your own).
- **Pie with > 5 slices, or two pies compared** — angle comparison across charts is the
  worst case of a rank-4 channel.
- **Truncated y-axis on a bar chart** — bars encode by length; truncating makes the length
  a lie. Lines may be truncated (they encode position), *with the axis clearly marked*.

## Colour

- **Categorical: ≤ 8 hues, and design for deuteranopia.** Check the palette through a
  simulator, or use a known-safe set (Okabe–Ito is the standard 8-colour safe palette).
- **Sequential** for magnitude, **diverging** for deviation around a meaningful midpoint
  (target, zero, average). A diverging ramp with an arbitrary midpoint is a lie.
- **Colour is the last channel to reach for.** Position, length, and ordering solve most
  problems. A chart that needs 12 colours needs small multiples instead.
- **Semantic colours are reserved.** Never spend the danger/success/warning tokens on
  ordinary categorical series — the moment a series is red, readers read alarm. This is
  the same collision as an accent doing double duty as a status.
- **WCAG applies to charts.** Non-text graphical objects need **3:1** against their
  background and against adjacent objects (WCAG 1.4.11). Text in a chart — labels, axis
  ticks, legends — needs the full **4.5:1**. Chart labels are where this is missed most.

## Non-negotiables for every chart

- **Direct-label the series.** Legends force a lookup for every read. Label at the end of
  the line, inside the bar, or beside the point.
- **Axis with units.** `$M`, `%`, `days`. A bare axis of numbers is unfinished.
- **Bars start at zero.** Always.
- **State n.** A percentage with no denominator invites over-reading a sample of 4.
- **Never colour alone.** Pattern, shape, position, or a direct label must carry the same
  information.
- **A chart needs a text equivalent.** A `<table>` behind a disclosure, or a one-line
  prose summary of the finding. This satisfies screen readers *and* is the thing most
  readers actually want. Writing it is also the fastest way to discover the chart has no
  finding in it.
- **The title states the finding, not the fields.** "Pipeline coverage fell below 3x in
  EMEA" beats "Coverage by region". If no finding can be written, question the chart.

## Number formatting

Consistency here does more for perceived quality than any visual treatment:

- **`tabular-nums` everywhere a number can be compared vertically.** Non-tabular figures
  in a column make comparison physically impossible.
- **Align numerals right, labels left.** Decimal-align when precision varies.
- **One abbreviation rule per surface**, applied everywhere: `1.2K` / `1.2M` / `1.2B`, or
  full figures with thousands separators. Never mixed in one view.
- **Significant digits by magnitude, not by default float.** `$1.2M` not `$1,234,567.89`;
  `3.2x` not `3.21759x`. Precision beyond decision-relevance is noise that costs scanning
  speed.
- **Percentages: state the base.** "Up 12%" vs "up 12 points" are different claims and are
  confused constantly. Use `pp` for point differences.
- **Zero, empty, and unknown are three different things.** `0`, `—`, and `n/a` must be
  visually distinct and used consistently. Rendering unknown as `0` is a data-integrity
  failure wearing a formatting costume.
- **Currency: symbol and code when multi-currency is possible.** `$1.2M USD`.
- **Dates: unambiguous.** `2026-08-08` or `8 Aug 2026`, never `08/08/26`. Relative time
  (`4h ago`) for recency, absolute on hover or beside it for the record.

## Interaction

- **Tooltip is an enhancement, never the only carrier of a value.** It is unreachable by
  keyboard and touch users and invisible in a screenshot or an export.
- **Hover reveals detail; click commits.** Never make hover the only path to a value.
- **Brush-and-link over cross-filtering everything** — linked highlighting keeps the
  reader oriented; a global cross-filter silently changes every other number on the page.
- **Every chart needs an underlying-data escape hatch** — view as table, copy, export.

## Cross-references

- Page composition, metric cards, direction semantics → `dashboards.md`
- Mark-count thresholds, SVG vs canvas, render budgets → `performance.md`
- Library choice and maintenance status → `ecosystem.md`
- Contrast policy and OKLCH ramp construction → `color-type.md`
