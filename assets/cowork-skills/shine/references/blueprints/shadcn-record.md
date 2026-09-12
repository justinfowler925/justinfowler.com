# shadcn record detail

Regions, in order. Host: application shell (`shadcn-sidebar-*` supplies the frame). Density: comfortable. Paint: `tokens/voices/shadcn-zinc.css`. Authored source: `corpus/blueprints/shadcn-record/page.tsx`.

shadcn ships no record block — its 97 blocks are one dashboard, sixteen sidebars, ten auth pages and seventy charts. The primitives a record page needs are all in the corpus as component rows; only the composition is missing. This file is that composition.

1. **Identity header** — the record's name as the page's `h1`, its state as a `Badge`, and one filled `Button` for the action that changes that state. Owner/region/type ride as a single muted line under the name, not as four separate stat cards. The primary action belongs here, at the top, because a reader who already knows what they want acts before reading further.
2. **Facts strip** — a `<dl>` of the three to six fields that decide the action, in a 2/4-column grid. This is the region most often got wrong: a record page that dumps sixty fields with equal weight has made none of them findable. Everything else goes in Detail or stays in the system of record.
3. **Decision panel** — a `Card` naming what the record needs, plus the control that records it. A `Textarea` for rationale and a submit that stays `disabled` until the rationale is non-empty. A decision without a reason is a status update.
4. **Evidence** — `Tabs` over activity, related records, and provenance. Tabs rather than stacked sections, because these are alternatives a reader switches between, not a sequence they read through. Activity is a static `Table` (presentation, not a data grid). Related is a `divide-y` list with a visible row action per row.
5. **Provenance** — where each value was read from and when. On an internal surface this is a region, not a footnote: a number with no origin is not evidence.

## Host facts the region map cannot show

- Activity is presentation, so a plain `Table` is correct and the DataGrid contract does not apply. The moment the reader needs to search, sort, or page it, it becomes a grid and owes the full recipe — search, sort, filters, column visibility, pagination, selection, row actions, and loading/empty/error states.
- Row actions are visible at rest. Hover-only actions fail `verify/usability.mjs`, which requires every declared object to be present at page load.
- The write confirmation (`role="status"`) mounts at rest with its resting copy, not on first success. A live region created at success time is not announced.
- Commit the status lead synchronously before any `await`. A confirmation set after a clipboard or network promise leaves the control reading "not done" while the work is already finished.

## Do not

- A dashboard of KPI cards. The reader arrived knowing which record they want; ranking and totals are the queue's job, not this page's.
- A profile page ported class-for-class — avatar, bio, descriptions list. That shape (the one the deleted Ant Design Pro row carried) pushes you toward a field dump with no decision region.
- Two primary buttons. One filled action; everything else outline, ghost, or overflow.
- Invented placeholders in empty fields. An empty field stays empty.

## Checklist (agent)

- One `h1`, and it is the record's name.
- The facts strip carries at most six fields, and each one changes what the reader would do.
- The submit is disabled until the rationale is non-empty, and the disabled reason is visible, not a tooltip.
- `data-cite="shadcn-record"` on the artifact.
- Tabs are keyboard reachable and the panel is labelled by its trigger.
- Prove with `verify/measure.mjs`, then `verify/usability.mjs` with a contract that exercises the decision write, then `verify/compare.mjs`.

## Source of truth

- The regions above are the structure. They are not optional.
- `corpus/blueprints/shadcn-record/page.tsx` is authored shadcn source — copy it, do not port it.
- Paint comes from `tokens/voices/shadcn-zinc.css`; fill genuine token gaps in Shine rather than hardcoding.
- There is no pack shot for this row. `verify/compare.mjs` has nothing to compare against, so say so rather than reporting a likeness score.
- Component-scope references for the pieces (`Card`, `Table`, `Tabs`, `Badge`) come from their own catalog rows, not from this file.
