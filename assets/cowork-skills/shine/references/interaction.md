# Interaction — finish the job

Contracts (`contracts.md`) say what a named Table/Form/Dialog includes. This file is
**whether a person can finish**: keyboard as spatial, disclosure, URL as state.
Always-on subset from [Vercel web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines).

## MUST

- Full keyboard path per APG. Visible `:focus-visible`. Sticky chrome never covers focus.
- Hit target ≥24px (mobile ≥44px). Expand the hit area if the glyph is smaller.
- Loading buttons keep the original label and add a spinner — width must not jump.
- Keep submit enabled until the request starts; then disable. Do not disable before the user has typed.
- Errors inline next to fields; on submit, focus the first error.
- URL reflects filters, tabs, pagination, expanded panels.
- Links are links (`<a href>`). Buttons are actions.
- Confirm destructive actions or provide Undo.
- Skeletons match the loaded layout (no CLS).
- Empty ≠ filtered-empty ≠ error ≠ loading — four states, copy + one action each.
- `prefers-reduced-motion`. Animate `transform`/`opacity` only. Never `transition: all`.
- Command palettes, context menus, theme toggles: **no motion**.
- Locale-aware numbers and dates. `tabular-nums` on comparisons.
- Status is never colour-only.

## LEX specifics

- `lightning-datatable` has keyboard nav/action modes — do not invent a third. Unsupported on Salesforce mobile; ship a separate page.
- Utility bar is one job, keyboard, no page (Raycast-scale).
- Walk `shadowRoot`. A probe that reports 0/0 is broken, not clean.
- Custom cell types: `data-navigation="enable"` all the way down.

## Fitts / Hick / Gestalt (checkable)

- **Fitts:** the next action is large and near the thing that named the problem. Inline on the card, not “open the record, find the field.”
- **Hick:** one primary per view. Competing filled treatments fail measure.
- **Gestalt:** proximity groups one job. A toolbar that mixes nav, filters, and destructive peers is three groups pretending to be one.

## Fail

- Hover-only row actions
- Fake navigation (`<div onClick>`)
- Paste blocked on codes / passwords
- `outline: none` with no replacement
- Toast as the only error channel for a submit failure
