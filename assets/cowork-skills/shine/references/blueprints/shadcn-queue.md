# shadcn work queue

Regions, in order. Host: application shell. Density: dense. Paint: `tokens/voices/shadcn-zinc.css`. Authored source: `corpus/blueprints/shadcn-queue/page.tsx` — the minimal composed statement of the grid contract; the living implementations (the shared shadcn/TanStack DataGrid in cro-suite and Nucleus) carry the full one.

A collection someone arrives at wanting to **find and act on a row**: a triage queue, a hygiene worklist, an inbox of notices. shadcn publishes no queue block — its 97 blocks are one dashboard, sixteen sidebars, ten auth pages and seventy charts — and `shadcn-dashboard-01` is the wrong cite for this screen because its reference roles demand a chart. A queue is a grid with a job, not a dashboard missing its chart; forcing the chart cite made consumers split their measure and usability declarations across two references (cro-suite gov did exactly this, with a `cite_note` apologising for it). This row is the one declaration.

**This is the inverse of `shadcn-weekly-board`, and the same four conditions decide between them.** A board is read in full, in a fixed order, on a schedule, by people accountable out loud. A queue is searched, sorted, paged and acted on. If all four board conditions hold, cite the board; otherwise this row — and never both for the same rows.

1. **Masthead** — what this queue is and when it was generated. A queue whose freshness is not stated reads as live when it may be a snapshot; the dateline is not chrome.
2. **Toolbar** — search, column visibility, and the one primary action. The primary is filled and singular: on a deep-linked queue it is *open the top row where the work happens* (the worst deal, the highest-ranked notice), because the page exists to move the reader to the record. The batch bar is mounted at rest with its resting count (“0 selected”) and its action disabled — a status region created on first selection is announced unreliably; one that rests visible is not furniture, it is the resting state.
3. **The grid** — the focal object, not a strip under a hero. Sticky header; every sortable column sorts the value, never the phrase (amounts and dates carry `data-sort`); rows deep-link to their record (`data-url`) and the row action opens it. Row selection only when a batch action exists to consume it.
4. **Pagination** — page size choices and a pager that states position. A queue that fits one page still renders the pager at rest; it is how the reader knows the queue is complete.
5. **Gated actions** — an action whose delivery is not yet authorized renders disabled *with the reason stated beside it*, never omitted. A control for an action no endpoint performs is a lie; a visibly gated one is a plan.

## Interaction contract (what queue means)

The demands `untitled-table` carries, restated here so this cite carries them natively: **search, sort, filters, column visibility, pagination, row selection, row actions** — and the five states a grid must be able to show: **loading, empty, filtered-empty, error, populated**. Empty and filtered-empty are different sentences: "nothing in this view" and "no rows match these filters" must not look the same. An empty queue with a failed source upstream is a named gap, never an all-clear.

## Host facts the region map cannot show

- Severity rides weight and position, not red and green, in lanes whose token sheet ships no status colours. The worst row sorts first; emphasis is a row treatment, not a hue.
- One landmark per grid. Several small grids under one section label fail `landmark-unique` and cannot exercise their own paging — merge them into one grid with a discriminating column (the cro-suite Deal Desk lesson: four hygiene buckets became one grid with a Problem column).
- A fixture that cannot fill a page cannot exercise its own paging. Give fixtures production-like volume where production has volume; where production is genuinely small, a paging failure is truth, not a defect to pad away.

## Do not

- A chart, to satisfy a cite. That instinct is why this row exists.
- Sortable column headers that sort the rendered label.
- A primary action that is really a refresh of data the page already has.
- Silent omission of a gated action.
- Splitting the measure cite and the usability cite across two references. This row is both.

## Checklist (agent)

- The grid is the focal object and dominates the viewport at rest.
- Exactly one filled primary; it opens work, it does not decorate.
- Search narrows, clear restores, sort orders values, pager states position.
- Freshness is stated in the masthead.
- Gated actions are visible, disabled, and say which gate.
- `data-cite="shadcn-queue"` on the artifact.
- Prove with `verify/measure.mjs`, then `verify/usability.mjs` with a contract whose flows find a row, act on it, and read the queue's provenance.

## Source of truth

- The regions above are the structure. They are not optional.
- Paint comes from `tokens/voices/shadcn-zinc.css`.
- `reference.required` is `navigation` and `table` deliberately — and not `chart` or `summary`. Summary tiles are welcome when the queue has a posture to state; demanding them turns every worklist into a dashboard.
- The living implementations are `site/src/components/data-grid.tsx` in cro-suite and `components/ui/data-grid.tsx` in Nucleus (shadcn + TanStack): copy those, not a reconstruction.
