# Dashboards and cockpits

For any surface whose job is *"what is happening, and what do I do about it"* — executive
dashboards, revenue cockpits, rep scorecards, ops consoles, daily briefs.

The governing failure, found in every exemplar reviewed and in every internal surface
audited: **the number is readable but not checkable.** A figure renders in beautiful
tabular numerals and the viewer cannot tell whether it is good, whether it moved, what it
is measured against, or what to do. Legibility is table stakes and gets all the attention;
*decidability* is the actual job and gets none.

Every rule below is a way of making a number checkable.

## The four questions every metric must answer

A metric that cannot answer all four is decoration. This is the single highest-yield
checklist in this file.

| Question | Carried by |
|---|---|
| **What is it?** | Label with units, and the grain (`ARR`, not `Revenue`; `net new` vs `gross`) |
| **Compared to what?** | Target, prior period, or benchmark — *in the same visual unit* |
| **Which way is good?** | Direction semantics, never bare colour (see below) |
| **How sure are we?** | Sample size, freshness, or an interval when the number is a projection |

"Compared to what?" is the one that gets dropped. A delta chip (`+12%`) is not a
comparison unless it says *against what and over what window* — `+12% vs. last 30d` is a
comparison; `+12%` is a rumour.

## Metric card anatomy

Reading order, top to bottom. Deviating from it costs comprehension for no gain:

1. **Label** — noun phrase, units explicit, ≤ 4 words
2. **Value** — the largest thing in the card, `tabular-nums`, abbreviated on a consistent
   rule (see number formatting)
3. **Comparison** — delta with its baseline named, and the direction encoded by more than
   colour
4. **Context** — sparkline, target bar, or range. One, not three
5. **Provenance** — `as of <time>` when the data can be stale; nothing when it is live

**Rules**

- **3–6 metric cards, maximum, above the primary content.** Beyond that no card is
  primary and the row becomes wallpaper. This is a hierarchy limit, not a memory limit
  (see the Miller's-Law myth below).
- **A card is a link.** Every metric drills to the rows behind it. A number the viewer
  cannot get behind will be disbelieved the first time it surprises them, and the whole
  surface loses credibility at once.
- **Never a bare number with no comparison.** If there is genuinely nothing to compare to,
  say so (`no prior period`) rather than leaving the slot empty.
- **Delta and value must not be the same size.** The value dominates; the delta is
  secondary type with an icon.

## Direction is not colour

Green-up/red-down is wrong in three separate ways and it is the most common defect in
revenue surfaces:

- **~8% of men** have a red/green colour vision deficiency. Colour-only direction is
  unreadable to them, and this is a WCAG 1.4.1 failure ("use of colour").
- **Up is not always good.** Churn, DSO, cycle time, cost per lead, support backlog — up
  is bad. A palette that hardcodes up=green silently lies on half a revenue cockpit.
- **Red/green is not culturally universal** — red is positive in several East Asian
  markets.

**The rule:** every metric declares its own `goodDirection` (`up` | `down` | `neutral`),
and the *sentiment* is what gets coloured — never the arrow's direction. Pair colour with
a glyph (▲ ▼) and, where space allows, a word. See the `direction-*` tokens in
`foundations.md`.

## Page architecture

**Top to bottom, and the order is load-bearing:**

```
context bar     what am I looking at — scope, time range, freshness, filters in effect
headline row    3–6 metric cards, the decisions this page exists to support
focal object    ONE primary chart or table — the thing the page is actually about
supporting      breakdowns, secondary series, related modules
actions/queue   what needs a human, and the way to do it
```

- **One focal object per page.** A dashboard with six equal-weight modules is an index,
  not a dashboard. If everything is equally prominent, the reader does the prioritising
  work the surface was supposed to do.
- **The context bar is not chrome.** Time range, scope and "as of" are the difference
  between a number and a claim. Keep them visible while scrolling, or repeat them at the
  point of export.
- **Filter state must be visible as chips, and reversible.** A filtered dashboard that
  looks like an unfiltered one produces confident wrong decisions. Include a `Clear all`.
- **Time range belongs in one place and applies globally**, with per-module overrides
  marked explicitly on the module. Two competing time controls is a bug factory.

## Density

Data-heavy surfaces need a real density switch, not a single compromise spacing:

| Mode | Row height | Use |
|---|---|---|
| Comfortable | 48px | Default, exploratory, touch |
| Compact | 36px | Analyst views, long sessions |
| Dense | 28px | Monitoring walls, power users only |

Cut **padding** between modes; never cut line-height below 1.33 (SKILL.md rule 5). The
common mistake is squeezing leading, which destroys scannability while saving almost
nothing.

## Change over time

- **Sparklines** for shape without precision — no axes, no gridlines, one series, ≥ 20
  points or don't bother.
- **Waterfall** for "how did we get from A to B" — the only chart that answers
  attribution of a change, and the correct default for pipeline movement (created,
  advanced, slipped, closed, lost).
- **Period-over-period overlays** beat two side-by-side charts. Align on the x-axis or
  the comparison is manual work.
- **Never a dual y-axis.** The crossing point is an artefact of the two scales chosen and
  readers reliably read causation into it. Use two stacked panels sharing an x-axis.

## Forecast and uncertainty

Any projected number carries an obligation to show that it is projected:

- **Show the interval, not just the point.** A fan band or a range bar. A single forecast
  number rendered identically to an actual is a lie of typography.
- **Distinguish actual / committed / projected** by fill treatment (solid / hatched /
  outlined), not by colour alone.
- **Name the model in one line** — "weighted by stage" vs "rep-committed" vs "AI-scored"
  are wildly different claims and the viewer must know which they are reading.
- **Coverage ratios need their target.** `3.2x` means nothing without `target 3.0x`
  beside it.

## Drill-down

Three models, in descending order of how well they work:

1. **In-place expansion** — row expands to detail. Preserves context perfectly. Best for
   ≤ 2 levels.
2. **Side panel / sidecar** — detail opens beside the list, list stays visible and
   navigable. Best for triage where the next item matters.
3. **Full navigation** — new page. Only when the detail is genuinely a different task.
   Requires breadcrumbs and a working back that restores scroll and filter state.

**Never a modal for drill-down.** It hides the context that gave the number meaning and
cannot be compared against a sibling.

## The queue, not the dashboard

The highest-value pattern in every exemplar: a surface that answers *"what needs me"*
outperforms one that answers *"how are we doing"*, because the second is a question the
reader has to convert into the first themselves.

- Lead with the **exception list**: what is off-target, blocked, stale, or awaiting a
  decision. Ranked, with a reason and an action per row.
- **Every alert states its rationale.** "Deal at risk" is noise; "no activity in 21 days,
  close date inside 14" is checkable, and the reader can disagree with it. A rationale is
  also what makes a false positive *reportable* rather than merely annoying.
- **Empty is a success state.** "Nothing needs you" should look like an achievement, not
  a broken panel.
- **Cap the queue.** An unbounded list of things needing attention is an unactionable
  list. Show the top N with a count, and make the ranking rule visible.

### Alarm fatigue is the failure mode

From incident-management practice (PagerDuty, incident.io, Datadog):

- **Every alert must be actionable by its recipient.** An alert with no action is a log
  line and belongs in a log.
- **Measure the ignore rate.** An alert class ignored > 50% of the time is worse than no
  alert — it trains dismissal of the whole channel.
- **Severity must be scarce.** If everything is P1, nothing is. Budget the top severity.
- **Route to a person, not a channel.** Unowned alerts are ignored alerts.

## Accountability surfaces, carefully

Rep scorecards and leaderboards are requested constantly and reliably backfire when built
naively. The research is consistent and uncomfortable:

- **Rank alone drives gaming, sandbagging and attrition** among the bottom half, and adds
  nothing for the top. If a leaderboard exists, show the *behaviour* that produced the
  rank, not just the rank.
- **Prefer personal-best and pace-to-target over peer rank.** Self-comparison sustains
  effort; peer rank sustains it only for people already winning.
- **Never surface an individual's ranking to peers by default.** Manager-visible,
  self-visible, opt-in for public.
- **Show the input metrics the rep controls** (activity, coverage, hygiene) beside the
  outcome metrics they only partly control (bookings). Holding someone to a number they
  cannot move is what makes a scorecard feel like surveillance.
- **Every number on a scorecard must be disputable** — click through to the rows, and an
  obvious way to flag "this is wrong". Data quality on rep-level metrics is always worse
  than leadership believes, and an undisputable wrong number destroys trust in the
  system permanently.

## Myths this file deliberately contradicts

Each of these is widely repeated in dashboard writing and does not survive contact with
its primary source:

| Claim | Reality |
|---|---|
| "Users decide in 5 seconds" | No primary source. Traceable only to blog restatement. |
| "Nothing below the fold gets seen" | False. Scrolling is universal; NN/g finds attention *concentrated* above the fold, not confined to it. Prioritise, don't cram. |
| "Miller's 7±2 limits dashboard items" | Misapplication. Miller (1956) is short-term recall of unrelated items, not simultaneous visual comparison. The real limit on cards is hierarchy, not memory. |
| "Maximise data-ink; remove all chartjunk" | Overapplied. Bateman et al. (2010) found embellished charts equalled plain ones on comprehension and *beat* them on long-term recall. Remove ink that competes; keep ink that labels. |
| "Pie charts are always wrong" | Overstated. Fine for part-to-whole with ≤ 5 slices and no close comparisons. Cleveland & McGill rank angle poorly — poorly is not uselessly. |
| "The 3-click rule" | Debunked (UIE, 2003). Click *count* does not predict success; per-step certainty does. |
| "F-pattern reading" | One pattern among several, and NN/g describes it as a *symptom of unformatted text*, not a layout target. |
| "Dark mode is easier on the eyes" | Contested. The positive-polarity advantage (dark text on light) is well replicated for acuity and sustained reading. Dark mode is a legitimate aesthetic and low-light choice, not an ergonomic fact. |

Rainbow colormaps genuinely are bad, and that one is well sourced (Borland & Taylor,
2007) — perceptual non-uniformity creates boundaries in the data that do not exist.

## Cross-references

- Chart selection, encoding accuracy, number and colour formatting → `dataviz.md`
- Render budgets, virtualization thresholds, Core Web Vitals → `performance.md`
- Streaming, agent output, approval gates → `ai-surfaces.md`
- Table/metric/filter component baselines → `contracts.md`
- Screen composition → `patterns.md`
