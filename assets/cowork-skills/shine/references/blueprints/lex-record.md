# Lightning record home

Regions, in order. Host: Lightning record page (standard). Density: compact. Paint: `tokens/voices/slds.css`.

1. **Highlights panel** — key fields in a horizontal strip. First field is the name. No more than ~8 highlights. Each highlight is a label + value; value is the readable one, not the API name.
2. **Path** — sales/status path when the object has stages. One current step. Not a second primary.
3. **Primary action** — one filled action (Edit or the object's real primary). Everything else is overflow or tertiary.
4. **Detail** — two-column field-by-field. Section headers are nouns. Empty fields stay empty; do not invent placeholders that look like data.
5. **Related** — lists below detail (or a related-list rail on wide hosts). Each related list has a noun heading, a count, and a row action.

## Host facts that the screenshot cannot show

- On a record page the host is ~494px inside many Lightning App Builder columns (`lex-record-narrow`). `@media` on the viewport will not fire. Use `@container` on `:host`.
- `lightning-datatable` cells live in synthetic shadow. A `childNodes` walk of the host reports 0 rows.
- Do not clone SLDS markup class-for-class. Clone the regions. Paint with measured SLDS 2 hooks.

## Do not

- A dashboard of cards instead of highlights + detail + related.
- A shadcn sidebar around a Lightning record.
- Hover-only row actions on related lists.

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
