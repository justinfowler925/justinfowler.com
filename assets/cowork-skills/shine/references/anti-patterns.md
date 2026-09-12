# Anti-Patterns

Hard bans and common failures. Hitting these is an audit fail (Critical/Major for incomplete components; Minor/Major for visual slop depending on severity).

## Incomplete components (functional)

- Bare tables without toolbar/sort/page/states when DataGrid applies
- “Forms” that are unlabeled inputs + a button
- Icon-only controls with no accessible name
- Dialogs without title, focus trap, Escape, or focus restore
- Menus that work only with mouse
- Toast as the only error channel for submit failures
- Loading UI that is blank (looks empty)
- Hover-only row actions (break on touch)
- Placeholder-as-label
- Color-only status (no text/icon)
- Disabled buttons used instead of explaining why action is blocked (prefer helper text)
- Fake links (`<div onClick>`) for navigation

## Lane-relative craft

Glow, large display type, and full-bleed media are **marketing DNA** (`magicui-hero`). They are a fail on `lex` and `internal` queues. Inverse: an enterprise queue's radius-none, tabular density on a marketing hero is a fail. Load `direction.md` before applying this list.

## AI visual slop (marketing + generic UI)

Do **not** default to these looks — reach for them only when the brief pins them:

1. Purple-on-white or purple→indigo glow gradients
2. Warm cream canvas (~#F4F1EA) + high-contrast serif display + terracotta accent
3. Broadsheet: hairline rules, zero radius, dense newspaper columns
4. Dark mode for its own sake
5. Glow effects, glassmorphism stacks, multi-layer showy shadows
6. Rounded-full pill clusters and chip spam
7. Emoji as UI decoration
8. Card soup — cards everywhere including hero
9. Stat strips / icon-feature rows / “this week” clutter in the first viewport
10. Inset hero, side-panel hero, collage tiles, floating media cards on landings
11. Detached badges/stickers/promo chips overlaid on hero media
12. Inter/Roboto/Arial as expressive marketing display when no brand specifies (product UI may use a neutral sans; a brand`s own licensed faces are the exception)

## Composition fails

- First viewport reads as a dashboard of widgets (unless it *is* a dashboard)
- Brand/name only in nav — fails brand test after removing nav
- Multiple competing CTAs of equal weight
- Sections with three jobs and three headlines
- Decorative gradient as the only visual idea (no real product/context anchor)

## Interaction fails

- Focus outlines removed and not replaced
- Hit targets &lt;40px for primary controls
- Motion that bounces, loops, or delays task completion
- Confirm-less destructive actions
- Double-submit (no loading/disable on async)
- Select-all that silently means “page” when user thinks “all filtered”

## Data UX fails

- Empty vs filtered-empty vs error conflated
- Sort without indicator
- Pagination without range/total context
- Wide tables clipped with no scroll affordance
- Server tables that re-fetch without busy state or race handling

## Composition fails a per-element check cannot see

These pass every token, contrast and axe check and are the reason the composition gate
exists (`verify/measure.mjs --compose`). All of them were found on a surface that scored
zero violations on everything else:

- **A large region with no content and no empty state.** The biggest element on the screen
  being a void is the most visible defect there is and the least detectable — gates measure
  elements that exist, never the one that is missing
- **No primary action, or several.** A screen where every button is styled the same has
  delegated prioritisation to the reader
- **A destructive action rendered at peer weight with ordinary actions**, especially
  repeated per-row — 25 always-visible `Delete` buttons is 25 chances to lose data
- **One colour carrying two meanings** — the accent doubling as an active-filter state, or
  a status colour spent on a categorical chart series. Every token is valid; the vocabulary
  still collapsed
- **Two type steps doing one job** — 14px and 15px in the same view. Cardinality is within
  budget and the scale is still broken
- **Light and dark rendering identically** — a theme that never switches passes every
  per-element check in whichever mode it is stuck in
- **Chrome outweighing content** — three rows of filters, search and tabs above one visible
  item
- **Hit targets under 40px on primary controls** (see Interaction fails — stated for years,
  never checked until the gate existed)

## Dashboard / data fails

- **A number with no comparison.** No target, no prior period, no benchmark — unactionable
  by construction
- **Direction by colour alone**, and direction hardcoded up=good when the metric is churn,
  DSO, or cycle time
- **Dual y-axis** — the crossing point is an artefact of scale choice and readers infer
  causation from it
- **Truncated y-axis on bars** — bars encode length; truncation makes the length a lie
- **Gauges, radar/spider charts, 3D charts, donuts with a KPI in the hole**
- **Rainbow / jet colormaps** — perceptually non-uniform, invents boundaries in the data
- **Legend-only series identification** where direct labels would fit
- **Tooltip as the only carrier of a value** — unreachable by keyboard and touch, invisible
  in an export
- **Rendering unknown as `0`** — a data-integrity failure wearing a formatting costume
- **Mixed abbreviation rules** in one view (`1.2M` beside `1,240,000`)
- **A metric with no drill-through** — it will be disbelieved the first time it surprises
  someone
- **Unbounded attention queues** and severity inflation (everything P1)
- **Peer-ranked leaderboards with no visible behaviour behind the rank** — drives gaming
  and sandbagging, and holds people to numbers they cannot move

## AI surface fails

- **Chat as the interface for structured, reviewable work** — the default because it is
  easiest to build, not because it works
- **Bulk-approve with no per-item diff** — oversight theatre
- **Fabricated confidence percentages** — precise, unfalsifiable, and readers anchor on them
- **Anthropomorphic status theatre** ("Thinking…", "Pondering…") in place of the real step
- **A stop button that does not stop**
- **Losing the user's input on error**
- **Streaming as decoration** — token-by-token rendering of JSON or a diff
- **Identical retry** as the only recovery
- **Autonomy with no published error rate**
- **Post-hoc self-explanation** presented as provenance — show the inputs, not a generated
  rationale

## When brand mode applies

Brand-specific visual bans (a logo gradient applied to chrome, the accent used as a body fill, emoji, retired product names) live in that brand`s own kit and copy checker — still flag them in audits on brand-locked surfaces.
