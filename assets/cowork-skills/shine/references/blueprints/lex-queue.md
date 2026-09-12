# Lightning list / work queue

Regions. Host: Lightning list view, console subtab, or LWC queue. Paint: `tokens/voices/slds.css`. Cite `lex-queue`.

1. **Page head** — object plural + count of the current filter. One primary (New).
2. **List controls** — filter, sort, column picker, refresh. Not a second hero.
3. **Table** — `lightning-datatable` or a table that honours the same contract: sortable headers, row selection, row actions visible without hover, empty / loading / error states.
4. **Batch actions** — appear when rows are selected. One destructive, the rest secondary.
5. **Pagination / infinite** — the list is the focal object; do not card-ify the rows.

## Contracts

Load `references/contracts.md` Table MUST. Lightning extras:

- Values in cells must not be raw API enums (`in_progress`). `innerText` is the check, not a `childNodes` walk — synthetic shadow hides cells from the host.
- Row actions are not hover-only. Keyboard reaches every action the mouse can.

## Do not

- Dashboard cards for a queue.
- A marketing hero above the table.
- Any non-SLDS kit chrome on a Lightning host (structure from this blueprint, paint from SLDS).

## Checklist (agent)

- Name the host before citing (LEX / console / LWR / email / mobile).
- Structure comes from this file; paint comes from `tokens/voices/slds.css` except LWR and email.
- Prove with `verify/measure.mjs` and `verify/compare.mjs` once a pack shot exists.
- Do not substitute a shadcn dashboard or an Ant profile because it scored on the word "record".
- Empty, loading, and error states are real regions, not afterthoughts.
- One primary action. Row actions are visible without hover.
- Read `references/salesforce.md` for org-measured hook names before writing a token.

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
