# shadcn settings

Regions, in order. Host: application shell (`shadcn-sidebar-*` supplies the frame). Density: comfortable. Paint: `tokens/voices/shadcn-zinc.css`. Authored source: `corpus/blueprints/shadcn-settings/page.tsx`.

shadcn ships no settings block. Since Ant Design Pro was deleted on 2026-08-31 (`docs/no-foreign-runtimes.md`), the corpus's other settings row is `fluent-nav`, which is a nav component rather than a settings page — see Do not.

A settings page is a form whose defining problem is *findability*, not layout. The reader arrives to change exactly one thing and does not know which section it lives in. Every decision below serves that.

1. **Section nav** — a persistent left rail of section links (`Account`, `Notifications`, `Access`, `Danger`), each an anchor to a labelled section. On narrow hosts it collapses to a `Select` above the content, never to an accordion that hides the section names. The reader must be able to see every section name without scrolling; that list is the page's table of contents and its search substitute.
2. **Section heading + one-line purpose** — every section opens with an `h2` and one sentence saying what it governs. A section titled "Preferences" with no purpose line is unfindable by definition.
3. **Field rows** — label, control, and a helper line, stacked in a `divide-y` list rather than a card per field. Label is a noun phrase the reader recognises, not the system's field name (`Email notifications`, not `notify_flag`). A `Switch` for a binary that applies immediately; an `Input`/`Select` for a value that needs saving.
4. **Save affordance** — one per section, disabled until that section is dirty, with a `role="status"` region beside it that carries resting copy at load. Never one global save at the bottom of four sections: it makes the reader prove they changed nothing in the other three.
5. **Danger zone** — destructive settings live last, in a section with a `destructive`-variant border and a confirm step that names the consequence. The confirm names what is lost, not "Are you sure?".

## Host facts the region map cannot show

- Immediate-apply and save-on-submit must not be mixed inside one section. A `Switch` that applies instantly sitting above a `Save` button makes the button's scope ambiguous; put instant toggles in their own section or give the whole section a save.
- The dirty check drives the disabled state, so it must compare against the loaded values, not against a pristine constant. A page that enables Save on focus is lying about state.
- `role="status"` mounts at rest. Creating the live region on first save means the first save is never announced.
- Section anchors need `scroll-margin-top` under a sticky header, or the heading lands behind it.

## Do not

- A tabbed *account* page ported class-for-class (the shape the deleted Ant Design Pro row carried). Tabs hide the section names, which is the one thing this page cannot afford to hide.
- `fluent-nav` as a settings reference. It is a navigation shell that happens to be filed under settings; it has no field rows at all.
- A card per field. Twelve cards read as twelve equal-weight decisions and triple the page's height.
- One global save for the whole page.
- A destructive action without a named consequence.

## Checklist (agent)

- Every section name is visible at rest, on both wide and narrow hosts.
- Each field label is the reader's word for the thing, not the schema's.
- Save is per-section, disabled until dirty, with a visible reason.
- The danger zone is last, visually separated, and its confirm names what is lost.
- `data-cite="shadcn-settings"` on the artifact.
- Prove with `verify/measure.mjs`, then `verify/usability.mjs` with a contract that changes one field and saves it, then `verify/compare.mjs`.

## Source of truth

- The regions above are the structure. They are not optional.
- `corpus/blueprints/shadcn-settings/page.tsx` is authored shadcn source — copy it, do not port it.
- Paint comes from `tokens/voices/shadcn-zinc.css`.
- There is no pack shot for this row, so `verify/compare.mjs` has nothing to compare against. Say so rather than reporting a likeness score.
- `Switch`, `Select`, `Input`, and `Label` come from their own component rows.
