# shadcn weekly cadence board

Regions, in order. Host: application shell. Density: comfortable. Paint: `tokens/voices/shadcn-zinc.css`. Authored source: `corpus/blueprints/shadcn-weekly-board/page.tsx`.

A recurring-meeting board: the same set of commitments read every week, grouped by **where they sit in the cadence** rather than ranked or filtered. shadcn ships no board or kanban block, and neither does any other kit in the corpus.

**This screen exists because the DataGrid recipe is the wrong answer here, and that needs saying explicitly.** `queue`, `crud` and `dashboard` all demand a grid with search, sort, pagination and row actions, and that demand is right for a collection someone arrives at wanting to *find* something in. A cadence board is read start-to-finish, out loud, in a meeting, in a fixed order that carries meaning. Sorting it destroys the meaning; paginating it hides the second half of the agenda. Cite this row only when all four of the following hold — otherwise cite `queue` and build the grid:

1. The collection is read in full, in a fixed order, on a schedule.
2. The grouping is a lifecycle position (last period / current / next / standing), not a filter.
3. Someone is accountable for each item out loud, so owner is a first-class column.
4. The total is small enough to read in one sitting — tens, not hundreds. If it outgrows that, it has become a queue.

1. **Masthead** — the period being read, and the two or three counts the meeting opens on: how much of the last period has been reported, how much was met, how much is off track. Reported-of-total, not a percentage: the reader needs to know how much is still missing. The one primary action lives here and is *refresh the source*, because the board is worthless if it is stale when the meeting starts.
2. **Owner filter** — every owner as a peer control, all of them visible at rest. This is `navigation`, not a filter widget: the meeting walks the board one owner at a time, so switching owner is moving through the agenda. A `Select` would hide the roster and the roster is the running order.
3. **Last period — report out** — the accountable region. Each row carries a status control that cycles the outcome in place. This is the only write on the surface and it must land in one click: a modal or a form between the reader and the outcome breaks the cadence of a live meeting. Status is encoded in glyph *and* colour, never colour alone, and the row itself carries the off-track state so it survives greyscale.
4. **Current period** — what is committed now. Cards rather than rows, because these are read as discrete commitments rather than scanned as a list.
5. **Discuss** — every off-track item across the whole board, with the note that explains it. Not a duplicate of region 3: region 3 is ordered by the workbook, this is ordered by what needs the call. Dropping it is why boards get reported and never resolved.
6. **Next / standing** — dated commitments, then the undated ones in their own panel. The dated set carries its date at the row's head; the standing set deliberately shows none, because a date on a standing item is a lie.

## Host facts the region map cannot show

- The status control is optimistic: it repaints before the write returns, and rolls back with a named reason on failure. A meeting control that waits on a round trip gets clicked twice.
- The write confirmation is a `role="status"` region mounted at rest with its resting line. A live region created on first success is not announced.
- Counts are computed over the *reported* period only, not the whole board. Counting the whole board makes "reported" meaningless.
- The status control must not be the page's only filled treatment competing with the primary action. Outline the status marks; fill the refresh.
- A dark masthead over a light board is the one place this screen departs from the surrounding surfaces. That is deliberate signature, not drift — but it means the primary action inside it needs a colour that clears contrast on the dark ground, not the default filled variant.

## Do not

- A DataGrid. If the four conditions above do not all hold, this is the wrong row.
- Sort or paginate the cadence regions.
- A second grid of the same items beside the board.
- Colour-only status.
- A modal between the reader and recording an outcome.
- A control for an action no endpoint performs. A board that shows "start new period" without one is lying about what it can do; omit it and say so.

## Checklist (agent)

- The period label comes from the source, not from the clock.
- Every owner is visible at rest.
- Recording an outcome is one click and is announced.
- Off-track items appear in both their cadence region and the discuss region, and the discuss region carries the reason.
- Standing items show no date.
- One primary action, and it reads as primary against the masthead's ground.
- `data-cite="shadcn-weekly-board"` on the artifact.
- Prove with `verify/measure.mjs`, then `verify/usability.mjs` with a contract that records one outcome and moves between owners, then `verify/compare.mjs`. The pack now carries a reference shot, so compare must exit zero for a conforming artifact rather than report an unprovable blueprint.

## Source of truth

- The regions above are the structure. They are not optional.
- Paint comes from `tokens/voices/shadcn-zinc.css`.
- `corpus/blueprints/shadcn-weekly-board/page.tsx` is authored shadcn source composed from the current official primitives; copy it rather than inventing another page graph.
- `corpus/packs/shadcn-weekly-board/shot.png` is captured from the sibling `reference.html` and gives `verify/compare.mjs` an independent visual reference. It is an authored blueprint proof, not a claim that shadcn publishes a weekly-board block.
- `reference.required` is `navigation` and `summary` deliberately — a board that has neither the roster nor the counts is not this screen.
