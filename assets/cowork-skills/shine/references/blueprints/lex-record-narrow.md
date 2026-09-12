# Lightning record home — narrow host (~494px)

Same regions as `lex-record`, composed for a host that is **not the viewport**.

Measured: PM Tracker workspace is 1248px on its own tab and **~494px** inside the Project record page, at the same 1280px window. A `@media (max-width: 48rem)` rail collapse never fired where it was needed.

## Regions

1. Highlights — stack or wrap; do not clip fields off the right edge.
2. Path — full width, horizontally scrollable if needed.
3. One primary.
4. Detail — **one column**. Two-column field grids overflow at 494px.
5. Related — below, not a side rail.

## Rules

- `container-type: inline-size` on `:host`. `@container` for collapse. Keep `@media` only as fallback.
- No 15rem sidebar. No 7-column table. Horizontal scroll on the table is a last resort, not the layout.
- Paint: `tokens/voices/slds.css`. Cite `lex-record-narrow` when the surface is an LWC inside a record page.

## Checklist (agent)

- Name the host before citing (LEX / console / LWR / email / mobile).
- Structure comes from this file; paint comes from `tokens/voices/slds.css` except LWR and email.
- Prove with `verify/measure.mjs` and `verify/compare.mjs` once a pack shot exists.
- Do not substitute a shadcn dashboard or an Ant profile because it scored on the word "record".
- Empty, loading, and error states are real regions, not afterthoughts.
- One primary action. Row actions are visible without hover.
- Read `references/salesforce.md` for org-measured hook names before writing a token.

## Source of truth

- Regions above are the structure. They are not optional.
- `references/salesforce.md` has the org-measured SLDS 2 hook names.
- A pack shot (when harvested) is the pixel reference; this file is the region map.
- If compare cannot run because there is no shot, say so — do not invent a likeness score.
- Host mismatch is a defect (record vs LWR vs email vs mobile).

## Regions recap

- One focal object.
- One primary action.
- States (empty, loading, error) are first-class, not overlays you remember later.
- Paint from the voice sheet for this family; do not invent a parallel palette.
