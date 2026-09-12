# Lightning console + utility bar

Regions. Host: Lightning console app (Service, Sales console). Paint: `tokens/voices/slds.css`. Cite `lex-console`.

1. **Nav bar** — app name, app launcher, global actions. Compact.
2. **Workspace tabs** — subtabs for records. The active subtab is the focal record. Closing a tab does not close the app.
3. **Utility bar** — pinned utilities at the bottom (history, notes, macros). Not a footer of marketing links.
4. **Focal record** — the open subtab is a `lex-record` (or `lex-queue`) composed inside the workspace, not a dashboard.

## Do not

- Replace workspace tabs with a spa sidebar.
- Hide the utility bar in a hamburger.
- Render a full marketing page inside a subtab.

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
