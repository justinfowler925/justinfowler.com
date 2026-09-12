# Record tables: complete patterns, executable outcomes

A few shadcn primitives wrapped around a handmade table are not a production DataGrid.
Reuse the product's approved shared table implementation and its installed state engine.
The closest shipped sibling (for Nucleus, Sources when directed by the user) owns the
pattern. Never create a second implementation or a newly copied reference to pass proof.

## Summary before detail

For more than 10 total rows, apply [the summary-and-accordion standard](table-summary.md).
Keep the summary visible and the complete table directly underneath, collapsed initially.
The disclosure wraps the shared DataGrid; it does not replace any table capability.

## Required evidence

Write `shine-tables.json` beside a local artifact, or pass `--table-contract <file>` to
both measure and compare for an application URL. Both commands execute this contract;
compare cannot mint a receipt for an untested or failed table. The standalone command is:

```
node verify/table-quality.mjs <url|html> --contract shine-tables.json
```

Read `verify/fixtures/table-quality/shine-tables.json` as the executable schema example.
The fixture is a framework-free verifier benchmark, not a replacement for the consumer's
installed component system. Serve its directory over HTTP to exercise its data requests.

The contract contains `version: 1`, `project` (relative to the contract), and `grids`.
Every discovered table must match exactly one grid selector, including tables embedded in
cards and dashboards. `data-shine-contract="layout"` cannot exempt a record-shaped table.
Each record grid supplies:

- `selector`, `toolbar`, `title`: unique, visible regions of the actual product.
- `source.entry`, `source.shared`, `source.referenceEntry`: real source files relative to
  project. TypeScript module resolution follows imports, re-exports and literal dynamic
  imports, with the product's tsconfig aliases. Both entries must reach the same shared
  implementation. For React, `source.package` names its installed table-state engine;
  the shared implementation must actually import that package. A package declaration or
  a DOM attribute alone is insufficient. Source proof records SHA-256 hashes.
- `reference.target`, `reference.selector`, `reference.toolbar`, `reference.title`: the
  approved sibling's rendered table. Local paths are relative to the contract. Comparison
  is scoped to the table and toolbar at 1280px and 768px, so unrelated navigation does not
  cause a mismatch. It checks cell typography, padding, alignment, borders, colors, toolbar
  controls and layout, and contained horizontal overflow. The reference cannot be the same
  target. Use representative populated data, including long values and numerical cells.
- `cases`: named browser scenarios below. Each runs in a fresh page in the supplied browser
  context (retaining its authentication). Use a test tenant/fixture for write workflows.
  These scenarios perform the clicks described in the contract; they are not read-only.
- `bulkActions: true` additionally requires the `selection` scenario.

## Browser scenarios

Required cases: `sort`, `search`, `filter`, `pagination`, `visibility`, `rowAction`,
`loading`, `empty`, `filteredEmpty`, `error`, `retry`, and `keyboard`.

Each case has `steps` with `op` and, except reload, `selector`. Actions are `click`,
`fill` (`value`), `select` (`value`), `press` (`key`), and `reload`. Assertions are
`rows` (exact ordered text array in `equals`), `text`, `value`, `count`, `visible`,
`hidden`, `enabled`, and `disabled`. Assertions poll for actual outcomes; no synthetic
DOM clicks, magic search strings, or fixed 50ms assumptions.

Sort must exercise ascending and descending ordering of distinct representative values
(the generic scenario validates text/numeric-aware lexical order). Search must prove a
matching result and clearing. Filters must change actual records. Pagination must prove
exact records on both pages and return, or disabled controls for an actual one-page data
set. Visibility must hide and restore a real column. Row actions must assert a meaningful
result before and after the action; write workflows should also reload and assert persisted
results. Keyboard must operate the real control and assert the resulting records or state.
Never substitute a toast, an aria-sort change, or a page label for the actual result.

For data states, optional `routes` contain `url` (Playwright glob) and ordered `responses`.
Each response supplies `status` and JSON `body`; `hold: true` keeps loading pending until
that scenario ends. Example: error returns 500, retry returns records. The checker requires
that the intercepted request actually occurred. Loading, empty, filtered-empty and error
must be visibly exercised in separate scenarios. Hidden marker inventories do not count.
Do not mock unrelated requests or replace the table implementation in an acceptance run.

Static information can use `kind: "static"` with a nonempty `reason` explaining its
presentation purpose. Interactive tables cannot use this exemption. This is not an escape
for operational records that are missing their expected controls.

## Interpretation and maintenance

Checks report `passed`, `failed`, `not_tested`, or `tool_error`; only passed is success.
The report includes contract and source hashes, reference pattern hashes, viewport sizes,
and observed browser outcomes. It is mechanical evidence of this tested workflow and
pattern, not a certification of taste, all business logic, or authenticated production.
Source reachability alone does not prove a component renders, which is why browser pattern
and outcome checks are also mandatory. Arbitrary runtime import resolution fails closed;
use a verifiable source entry rather than inventing provenance.

Run `npm run table:test` after changing the verifier. It must accept a working shared table
and valid one-page pagination while rejecting the old marker-only full-table fixture,
custom styling, parallel source, missing controls, inert actions, false sorting, false
pagination, and hidden states. These regression tests run in doctor and therefore CI.
