# shadcn wizard

Regions, in order. Host: application shell or a focused modal-width page. Density: comfortable. Paint: `tokens/voices/shadcn-zinc.css`. Authored source: `corpus/blueprints/shadcn-wizard/page.tsx`.

shadcn ships no stepper primitive and no wizard block, and since Ant Design Pro was deleted on 2026-08-31 (`docs/no-foreign-runtimes.md`) this row is the corpus's only wizard reference. The step list below is built from shadcn primitives; nothing here depends on someone else's `Steps` runtime.

A wizard exists for one reason: the task cannot be validated all at once, so it is cut into steps that each end in a decision the reader can commit. If the whole form *could* be one page, make it one page — a wizard over a form that fits on one screen adds clicks and hides fields.

1. **Step indicator** — every step visible at once, with its state (done / current / upcoming) encoded in shape *and* text, never colour alone. Numbered markers are correct here and only here: the order carries information the reader needs. Completed steps are links back; upcoming steps are not links.
2. **Step title + what this step decides** — an `h1` for the step and one sentence naming the decision. "Step 2 of 4" is not a title.
3. **Step body** — the fields for this step only, in the same `divide-y` field-row idiom as `shadcn-settings`. A step with one field is a confirmation dialog wearing a wizard; merge it.
4. **Validation summary** — on a failed advance, an `Alert` above the body listing each blocked field as a link to it. Per-field errors stay at the fields too; the summary exists so the reader does not hunt.
5. **Navigation** — `Back` (outline) and `Continue` (filled) in one row, `Continue` on the right. `Continue` is enabled and validates on click; a disabled `Continue` with no stated reason leaves the reader with nothing to fix. The final step's action is named for what it does (`Create account`, `Submit request`), never `Finish`.
6. **Review step** — the last step before commit restates every prior answer with a link back to the step that set it. This is the region most often dropped, and dropping it is why wizards get abandoned at the commit.

## Host facts the region map cannot show

- State must survive a back-navigation. A wizard that clears step 2 when the reader returns from step 3 fails its own premise.
- Validate on advance, not on blur of every field. Blur validation on a step the reader is still filling reads as the form arguing with them.
- The step indicator is `nav` + `ol`; `aria-current="step"` marks the current step. Shape-and-text state encoding is what makes it pass without colour.
- Focus moves to the new step's `h1` on advance, or a keyboard reader stays stranded at the bottom of the previous step.
- `verify/usability.mjs` requires the flow to change observable state. A wizard whose Continue does not advance the DOM fails, however finished it looks.

## Do not

- A vendor `Steps` component pulled in for the progress rail. Build it from the primitives; a stepper is a list, a current index and a state per item.
- A progress bar instead of a step list. A bar shows how far, not what is left or what is done.
- Colour-only step state.
- A disabled `Continue` with no visible reason.
- `Finish` as the commit label.
- A wizard over a form that fits on one screen.

## Checklist (agent)

- Every step name is visible at once, with state in shape and text.
- Completed steps are reachable; upcoming ones are not.
- Back preserves what was entered.
- The commit button names the action.
- A review step precedes the commit.
- `data-cite="shadcn-wizard"` on the artifact.
- Prove with `verify/measure.mjs`, then `verify/usability.mjs` with a contract that advances two steps and returns to the first, then `verify/compare.mjs`.

## Source of truth

- The regions above are the structure. They are not optional.
- `corpus/blueprints/shadcn-wizard/page.tsx` is authored shadcn source — copy it, do not port it.
- Paint comes from `tokens/voices/shadcn-zinc.css`.
- There is no pack shot for this row, so `verify/compare.mjs` has nothing to compare against. Say so rather than reporting a likeness score.
- shadcn has no `Steps` component; the indicator here is composed from `nav`/`ol` and tokens, which is why it is authored rather than cited.
