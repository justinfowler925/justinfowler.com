# Salesforce HTML email (600px tables)

Regions. Host: HTML email (Outlook-safe). Paint: house or brand, not SLDS hooks (they will not exist in the client). Cite `lex-email`.

1. **Preheader** — first text, ~80 characters.
2. **Header** — wordmark as an `<img>`, not an SVG-as-HTML. 600px wide canvas.
3. **Body** — stacked table rows. One primary CTA as a padded `<a>`, not a `<button>`.
4. **Footer** — physical address, unsubscribe. Required.

## Rules

- Tables for layout. Inline CSS. No flex, no grid, no custom properties in the email body (many clients drop `:root`).
- Preview text is real, not "Lorem".
- Cite this row for Salesforce HTML emails, not an editorial web page (`shadcn-blog`).

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

## Fail closed

- No shot in the pack: say there is no shot. Do not describe pixels you did not see.
- No SLDS hook resolving in the org: that is a literal. Measure `getComputedStyle`.
- A table on mobile or LWR is the wrong host.
- A second filled primary is a defect.
