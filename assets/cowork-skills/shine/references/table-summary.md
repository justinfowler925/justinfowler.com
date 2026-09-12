# Standard: summary above an expandable table

For a data table with **more than 10 total rows**, show meaningful KPI boxes or an
infographic first, with the full table directly underneath in a collapsed accordion.
The summary must answer the user's main question without requiring expansion.
This is the default Shine pattern, requested by Justin on September 10, 2026.

## When it applies

- Use the total records in the selected dataset before table search and pagination.
  Eleven records qualifies even when the current page contains only ten.
- Ten or fewer rows does not trigger this standard; use the appropriate compact table.
- For unknown server totals, do not invent a count. Apply the pattern when a known total
  or loaded records establish more than ten; label unavailable totals honestly.
- Decide the initial presentation when data resolves. Filtering below eleven, pagination,
  and background refresh must not unexpectedly close the user's open table or move focus.
- An explicit user instruction overrides the default. Preserve an intentional detail
  deep link, restored expansion state, or active editing workflow instead of closing it.

## Anatomy

Use the product's installed Card, Accordion/Disclosure, KPI and shared DataGrid components.
Native details/summary is suitable when it is the existing product convention.
Keep one coherent section per information topic, with this order:

1. A clear topic title and a compact row of useful KPIs, or one task-relevant infographic.
2. An immediately adjoining disclosure header: “People details · 25 records”, for example.
3. Inside the disclosure: table controls, the shared DataGrid, and optional methodology.

Default the disclosure to closed. Keep the KPI header visible in both states. Avoid a
second remote evidence section that makes people hunt for the table behind a summary.
For multiple topics, allow independent expansion. Wrap KPI cards on narrow screens and
contain wide table scrolling inside the disclosure; never widen the entire page.

## Summary and data contract

Choose a small set of decision-relevant measures: total population, activity/adoption,
exceptions, throughput, outcomes or effort evidence. Show what people are doing and
where attention is needed, using the actual dataset. Do not manufacture trends or savings.
Name the time window, denominator and source coverage when needed to interpret a KPI.
Unknown values remain unavailable, distinct from zero. Label estimates as estimates.
Only show a trend when comparable historical observations exist.

The summary and table must have an explicit scope relationship. Page-level period and
scope filters update both. A table-only search may narrow details while the summary
retains its broader context, provided that context and the filtered record count are clear.
Compute KPIs over the full relevant dataset, never just the current page of records.

A clickable KPI opens the adjacent table and applies the matching cohort/filter. The
result must visibly match the clicked measure, with a clear reset. A KPI with no useful
action is static content, not a fake button. Do not turn each KPI into an unrelated page.

## Interaction and accessibility contract

- Use a real keyboard-operable disclosure trigger with a meaningful accessible name,
  visible focus and expanded/collapsed state (native semantics or aria-expanded and
  aria-controls). Do not nest other buttons inside the trigger.
- Keep all search, sort, filters, columns, pagination, row actions and selection features
  required by table-quality.md. Place table-only controls inside the expanded panel.
- Preserve filters, sorting, page, selection and unsaved edits across collapse/reopen.
  Keep components mounted or persist their state outside the disclosure as appropriate.
- KPI drill-down must expose its result and keep keyboard focus predictable. Collapsing
  must not leave focus inside hidden content. Respect reduced motion.
- Loading, empty, filtered-empty and error/retry states remain understandable. A summary
  request failure must not masquerade as zero activity. Do not auto-collapse on errors.

## Acceptance evidence

Exercise the threshold with 10 and 11 records, including a paginated eleven-record dataset.
Verify that the default >10 state shows the summary and disclosure header, with the table
hidden; keyboard expansion reveals real records. Exercise a KPI drill-down, reset, collapse
and reopen, proving table state survives. Verify narrow and wide layouts and data states.
Retain the complete table-quality scenarios after opening the real disclosure.

For Shine usability contracts, declare initially visible summary/trigger or containing
regions and use actual browser steps to expand before asserting hidden table content.
Table verifiers that assume an initially visible grid need a supported disclosure setup
or a separate real interaction test; do not force the shipped table open, exempt it as
static, invent a receipt, or claim a passing aggregate result when the tool cannot test it.

## Shipped precedent

Nucleus Admin → Adoption: people, modules and task impact each keep their own KPI header
above adjacent collapsed detail tables. Reference implementation: Nucleus pull request 216,
https://github.com/justin-fowler_cspd/nucleus/pull/216 (source f947cb7).
Use its information hierarchy and interaction behavior through the consumer's own components;
its metrics, labels and data are examples, not defaults for every product.
