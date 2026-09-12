# Layout — structure as information

Craft thresholds live in `taste.md`. This file is **composition**: grid, optical
alignment, whitespace as meaning, fold choreography. Load after the DNA pack’s
`regions.json`.

## Grammar

- **One focal object.** Dashboards, queues, records, heroes. Six equal modules is an index.
- **Regions come from the cite.** Copy occupancy from `corpus/packs/<id>/regions.json`. Inventing a region is inventing a page.
- **Whitespace is information.** Three gap tiers: 8 intra-component, 16 intra-group, 64–96 inter-section (marketing). Dense UIs cut padding, never leading.
- **Measure in `ch` for prose** (45–75). Linear’s reading column is 624px. App tables are full-bleed.
- **Optical alignment.** Icon+label rows need a 1px nudge more often than geometry admits. `items-center` is a start, not a finish.
- **Nested radius** = parent − padding. LEX and dense enterprise chrome: radius none or host tokens — do not round a DataTable.
- **Fold.** Above the fold is the job of the screen, not a widget gallery.

## Host width ≠ viewport

A Lightning record LWC is often **~494px** inside a 1280 window. `@media` asks the window. Use `container-type: inline-size` on `:host` and `@container`. Measure `getBoundingClientRect` on the component.

Consecutive surfaces in one product **must not** share a macrostructure (Hallmark). A queue and a marketing page that are siblings have failed retrieve.

## Fail

- `max-width: 1200px; margin: auto` as the only layout decision
- Three identical `grid-cols-3` feature cards as the page
- Hero as sidebar + KPI cards
- Related lists as 14 API-name columns
- Chrome > content on an app-shell (`data-shine-probe="app-shell"`)
