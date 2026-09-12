# Adoption — designing a surface people fight to use

For an internal tool, the dominant failure mode is not ugliness. It is a well-built,
well-tokenised, accessible surface that nobody opens. That outcome is decided before
layout, by four questions, and it is a **design** defect — not a training problem, not a
change-management problem, and never something a launch email fixes.

Everything here applies to internal and workflow surfaces: dashboards, cockpits, consoles,
admin tools, review queues, digests. Marketing surfaces are governed by
[copy.md](copy.md); this file is about the thing someone has to open on a Tuesday.

## The four gates — answer before you draw anything

| Gate | The question | Fail state |
|---|---|---|
| **Ritual** | Which recurring meeting or moment does this surface run? | A tool with no meeting is a hobby. |
| **Private win** | Per persona, what one fact does this give them that they cannot get by asking a person? | A reporting burden with a UI. |
| **Shortest path** | Is this the fastest route to something they already had to do, with no step where they must work out where to go? | A tax, paid in junk data. |
| **Absence** | What breaks if nobody opens it for a week? | "Nothing" — so nobody will. |

Write the four answers down. If any is weak, the fix is upstream of the design, and the
honest report says so and names whose decision it is.

## 1. Ritual — attach every surface to a recurring meeting

Adoption is downstream of ritual. If the forecast is read off your screen in the Monday
call, every manager updates their deals before Monday — not because the UI is good, but
because being wrong in public is expensive.

- **Design backwards from the agenda.** Screen order matches the order items are
  discussed. The first thing on screen is the first thing said out loud.
- **Whoever's screen is projected owns the narrative.** Pick that screen deliberately.
- **The artifact must regenerate itself.** If anyone rebuilds the same numbers in a
  spreadsheet the night before, your surface already lost — the spreadsheet is the real
  tool and it will win every week.
- **Name the human who is embarrassed when it is wrong.** A surface with no owner degrades
  to decoration in about three weeks.
- **One question per surface.** Two surfaces answering the same question get neither
  adoption nor trust; people pick the one their boss quoted last.

## 2. Persona asymmetry — each role needs a different product

Same data, three different questions. This is where most multi-persona tools die: the
second persona's view is the first persona's view with a filter, so the second persona
never opens it.

**Checkable:** if two persona views share more than ~80% of their fields, columns and
actions, it is a filter, not a product. Split the question or drop the view.

| Persona | The question they actually have | What earns the open |
|---|---|---|
| Individual contributor | "What is about to embarrass me?" | Early warning — the thing their manager will raise, before it is raised. |
| Manager | "Where do I spend the next hour?" | A ranked short list, with the reason for the rank. |
| Exec | "What number can I defend, and why?" | A figure that drills to the records behind it. |

- Lead the IC view with **exposure avoidance, not a score.** "Your manager will ask about
  these three on Monday" is a service. "You are at 62%" is a verdict.
- The exec number must be traceable in one click to the rows that produced it, or it will
  be re-derived by hand and the surface is bypassed.
- If a persona's only interaction is being measured, expect minimum-compliance data.

## 3. Shortest path — compliance is a byproduct, never the ask

Nobody logs a call to be compliant. They log it if logging it is how the follow-up gets
drafted.

- **Walk the path from notification to committed change and count the steps where the user
  has to work out where to go next.** Those are the ones that cost. Raw click count does not
  predict success — the 3-click rule is debunked (UIE, 2003; see the myth table in
  `dashboards.md`) — but a step whose next move is not obvious is where people leave.
- **The fix happens where the problem is named.** Inline edit on the card that flagged it.
  "Open the record, find the field, save" hides a search inside step two, and a search is
  where the session ends.
- **Every required field owes the user something inside the same session.** A field that
  only feeds someone else's report is a tax, and taxes are paid in fiction.
- **Never ask for what the system already knows.** Prefill, then let them correct.

## 4. Push and pull — consume in push, act in pull

Executives and reps consume in **push** (email digest, Slack, the meeting artifact) and act
in **pull** (one record, one decision). Build both halves; a surface that only exists as a
destination depends on memory, and memory loses to an inbox.

- A push message links to **a record or a filtered queue with the filter already applied** —
  never to a dashboard home. A landing page is where intent goes to die.
- **Push arrives before the ritual, not after.** A digest that lands after the meeting is a
  newsletter.
- **Content is the delta since last time**, not the standing state. A message that restates
  what the reader already knows trains them to skip the next one.
- **One digest per persona per cadence.** A second daily notification roughly halves the
  first one's open rate.
- Two channels max, and the same deep link in both. Slack for the people who live there,
  email for everyone else.

## 5. Visibility, and the shame trap

People fight to use surfaces where their work becomes visible upward. They quietly sabotage
surfaces whose only function is to expose them.

- **Show effort and improvement, not only shortfall.** Rank on inputs the user controls.
- **Public shortfall belongs in a 1:1**, not a leaderboard. A board that only lists who is
  behind produces data entry theatre within two cycles. The mechanics of doing a scorecard
  without backfire — personal-best over peer rank, disputable numbers, manager-visible by
  default — are in `dashboards.md` § Accountability surfaces.
- Make the *good* path visible: the rep who cleared their queue should be legible to their
  manager without asking. That, not the scorecard, is what gets it opened daily.

## Measuring adoption — metrics that can fail

State these as numbers, per the reporting rule. Every one of them can come back bad.

| Metric | Definition |
|---|---|
| **Weekly active named users** | distinct eligible humans, not events, not page views |
| **Time to first action** | grant of access → first committed change through the surface |
| **Pushed-item completion** | items resolved / items pushed, per cadence |
| **Ritual traceability** | share of the meeting's decisions that came off the surface |
| **The honest one** | turn it off for a week — count who complains |

Vanity, do not report: page views, "engagement", cards generated, sessions, deploys,
number of dashboards shipped.

**Rollout is gated on evidence, not calendar.** Do not widen access until at least one
ritual has actually been run off the surface and pushed-item completion is non-zero for the
pilot cohort. Widening a permset over a cohort with zero actions multiplies zero.

## Adoption slop — the failure taxonomy

1. Wall of KPI cards with no next action.
2. A "Reports" tab.
3. Persona views one filter apart.
4. A notification restating what the user already knew.
5. A link to a home page instead of a record.
6. Required fields that pay nothing back in-session.
7. A dashboard with no owner and no meeting.
8. A leaderboard that shows only shortfall.
9. The same numbers rebuilt by hand in a spreadsheet every week.
10. Access widened before a single user resolved a pushed item.
11. Two surfaces answering the same question.
12. "We'll do a training" as the adoption plan.
13. Stub routes shipped alongside live ones — one dead link teaches people the whole tool is
    unfinished.
14. An empty state that explains the feature instead of doing the first useful thing.

## Cross-references

This file is about whether the surface is opened. Once someone is looking at it:

- What goes on the screen, queue design, alert rationale, scorecards without backfire → `dashboards.md`
- Screen composition → `patterns.md` · component baselines → `contracts.md`
- The words on it → `copy.md`

## Reporting an adoption finding

Same bar as every other shine claim: the numbers, and what you did not do. Name the ritual,
the persona, the measured step count, and the current active-user figure. If the blocker is
organizational — no meeting owns this screen — say that plainly rather than shipping another
tab and calling it done.
