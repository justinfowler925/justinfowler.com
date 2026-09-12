# UX Audit

Score against `contracts.md`, `foundations.md`, `patterns.md`, `anti-patterns.md`,
`techniques.md`, and `kits.md`. Do not rewrite unless asked — report first.

## Severity

| Level | Meaning |
|---|---|
| **Critical** | Below MUST for a named/shipped control; a11y blocker; broken hierarchy that causes wrong actions; data triad failure (loading looks like empty) |
| **Major** | App/admin surface missing SHOULD; incomplete DataGrid/form; hover-only actions; toast-only errors; composition fails (void, no primary, colliding type steps) |
| **Minor** | Craft/density/spacing polish; visual anti-pattern without functional break |

## Process

1. Identify surface type (marketing / product / brand-locked / AI / voice) — `diagnose.md` §1.
2. Inventory components and screens under review.
3. For each: check contract ladder (MUST → SHOULD → ASK leakage).
4. Check composition (scan order, weight budget, focal object, voids) before craft.
5. Check foundations (tokens, type, spacing, focus, motion).
6. Flag anti-patterns.
7. If the surface carries persuasive or instructional copy, run the copy pass (`copy.md`).
8. Internal tools: adoption pass (`adoption.md`) — ritual, persona, path, push/pull.
9. Produce the report template below. Every Critical/Major row needs a **technique or kit
   citation** (or a `patterns.md` principle) and, if fixes were applied, **remeasure
   before/after numbers**. Prioritize completeness before cosmetic tweaks.

## Incomplete-primitive fails (always flag)

- Bare `<table>` / static grid where DataGrid contract applies
- Icon buttons without accessible names
- Inputs with placeholder-only labels
- Red borders without linked error text / `aria-invalid`
- Loading indistinguishable from empty
- Filter-empty conflated with true empty
- Menus/dialogs missing keyboard, focus trap, or focus restore
- Hover-only row actions
- Missing sticky header / horizontal overflow affordance on wide tables
- Double-submit (no busy/disabled on async buttons)
- Destructive actions without confirm
- Status/meaning by color alone

## Report template

```markdown
# UI/UX Audit: [surface name]

## Verdict
ship | polish | redesign

## Summary
1–2 sentences on the main gap (completeness vs craft).

## Top issues
| # | Severity | Issue | Contract/rule | Citation (technique/kit) | Fix | Remeasure |
|---|---|---|---|---|---|---|
| 1 | Critical | … | Table MUST / a11y | `untitled-table`… / techniques.md §… | … | before → after |

## Completeness
- Components below MUST: …
- App surfaces missing SHOULD: …
- ASK features present without need: …

## Composition & hierarchy
Score 1–5 + notes (focal action, density, section jobs, scan order).

## States coverage
| View | Loading | Empty | Filtered-empty | Error | Notes |
|---|---|---|---|---|---|
| … | pass/fail | … | … | … | … |

## Accessibility blockers
- …

## Anti-patterns hit
- …

## Prioritized fix list
1. [Critical] … — cite: … — measure: …
2. [Major] …
3. [Minor] …

## Out of scope / deferred
…
```

Citation column is required for Critical/Major. Threshold-only rows are incomplete.

## Mode notes

- **Audit only:** stop after the report.
- **Polish after audit:** work the prioritized list top-down; upgrade stubs to contracts;
  cite before each edit; remeasure; avoid unrelated redesign.
- **Brand-locked:** also run `brand-checker` for copy/token compliance; UI
  completeness still uses this rubric.
