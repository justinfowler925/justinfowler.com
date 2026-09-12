# Experience Cloud LWR

Regions. Host: Lightning Web Runtime (Experience Cloud). Paint: the site's theme, not SLDS 2 hooks — **SLDS 2 is unsupported on Experience Cloud**. Cite `lex-lwr`.

1. **Theme header** — site nav from Experience Builder, not an invented spa chrome.
2. **Page body** — the LWR page. Components are LWR-capable; do not drop LEX-only components here.
3. **Theme footer**.

## Rules

- SLDS 2 styling hooks will not resolve. Using them is a literal wearing a token's name.
- Do not cite `lex-record` for an Experience Cloud page. Different host, different paint.
- Brand chrome comes from the site theme / `references/brand.md`.

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
