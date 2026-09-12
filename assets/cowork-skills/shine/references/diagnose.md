# Diagnose — how to find what is wrong

The loop's procedure. Thresholds live in `taste.md`/SKILL; this file is the order of
operations so every fix starts from a named defect and ends with a source.

## 0. Route first

- **No existing UI** (new screen/page/tool), or the user said wireframe/sketch/low-fi →
  `wireframe.md` before anything here.
- A `shine-wireframe/<slug>.brief.md` with `Status: LOCKED` → structure is given; do not
  invent a competing IA unless the user says `unlock structure`.
- **Internal tool / cockpit / digest** → `adoption.md` before pixels. A surface nobody
  opens is a design defect, not a training problem.

## 1. LOOK — render before opining

`node verify/measure.mjs <path> --shot /tmp/before.png`, then **read the screenshot**.
The measure output is a findings list; the screenshot is the diagnosis surface. A page
you have not seen gets no opinions.

| Kind | Signals | First refs |
|---|---|---|
| Internal tool / cockpit | Auth'd app, queues, metrics for a ritual | `adoption.md` first |
| Product app shell | Nav, tables, forms, settings | `patterns.md`, `contracts.md` |
| Dashboard / forecast | KPIs, charts, "what needs me" | `dashboards.md`, `dataviz.md` |
| AI / agent surface | Model does work a human owns | `ai-surfaces.md` |
| Marketing / landing | Hero, CTA, persuasion | `patterns.md` (hero budget), `copy.md` |
| Brand-locked | Client-facing or brand lock | `brand.md` + brand checker |
| Speaks or listens | TTS, mic, read-aloud | `voice.md` |
| Native / macOS / iOS | Desktop chrome, HIG language | Apple HIG via WebFetch |
| Lightning / LWC | Record page, console, datatable | `salesforce.md` |

Two kinds → run the stricter first (adoption before craft; contracts before polish).

## 2. NAME — four buckets, usability first

Write 3–6 defects, each in one bucket. Craft without a usability or completeness defect
above it is the wrong pass.

### Usability (can they finish the job?)
- Primary action visible in ~3 seconds? Competing CTAs?
- Path: notification → committed change — where does the user invent the next step?
- Empty / error / loading as real states, not voids?
- Hover-only actions; no keyboard path to finish?
- The job of the screen vs what the layout actually offers.

### Completeness (contracts)
Named Table / Form / Dialog / Select loads `contracts.md` MUST **in this pass**.
- A `<table>` with two or more header cells **is** a named Table. Missing
  `data-shine-contract="table"` does not exempt it. A layout or presentation attribute cannot exempt record data. Static presentation
  requires the documented purpose and noninteractive checks in `table-quality.md`.
- Named control below MUST (bare `<table>`, unlabeled icon button, placeholder-as-label)
- Missing states: loading / empty / filtered-empty / error
- Destructive without confirm; double-submit; toast-only errors

### Composition (what per-element gates cannot see)
- **Scan order** — in 3 seconds, what do you read? Is that the job?
- **Weight budget** — one primary, few secondary. Count filled controls.
- **Focal object** — dashboards need one; six equal modules is an index.
- **Chrome vs content**; largest region empty; sections with three jobs.
- **Collisions** — one token two meanings; type steps that aren't distinguishable.

### Craft (of the chosen voice)
- Raw values at usage sites; off-scale spacing; tracking 0 on display type
- House accent chroma outside 0.13–0.24; kit-faithful drifting back to house paint
- Theme undeclared or non-switching; contrast fails; `transition: all`
- Refs: SKILL ten rules, `taste.md`, `color-type.md`, `motion.md`, `foundations.md`

## 3. Prioritize

1. Usability — they cannot finish the job
2. Completeness Critical — a11y blockers, data-state triad, wrong primary
3. Composition that causes wrong actions or abandonment
4. Adoption blockers on internal tools
5. Craft that reads as slop for the chosen voice
6. Polish (density, optical alignment, micro-motion)

Never spend a pass on craft while a Critical completeness hole is open.

## 4. MATCH — a template, not a vibe

`node corpus/cite.mjs "<job in plain words>"`. Read the harvested shot (or preview),
skim the source's regions, pick one of the ≤3 matches and say why. A page with no
template cite is incomplete for a *known* job — dashboards, queues, records, settings,
auth, checkout all have rows. No matching row → nearest row + `patterns.md`, and add a
catalog row **after** the screen ships if it earned one. Technique cites
(`techniques.md`) are for craft transfer; they don't replace a structural match.
A record list (queue, remainder, sources, admin rows) cites a DataGrid row
(`untitled-table`, or `shadcn-dashboard-01` for the composed records page). A
list/dashboard/app-shell cite is the wrong match even if `cite.mjs` ranked it
first — re-query with `datagrid`.

## 5. RESTRUCTURE + REPAINT

Clone the template's regions from its source; keep the focal object focal. Then paint by
voice (`voices.md`): kit-faithful imports the voice sheet and the kit's real token
values; house uses the shine lanes; brand keeps regions and drops vendor chrome.
Upgrade stubs to the contract ladder. Prefer one composition change over ten craft tweaks.

## 6. PROVE

```sh
node verify/measure.mjs <path> --shot /tmp/after.png --cite <id>
node verify/compare.mjs <path> --cite <id>    # when the template has a harvested shot
```

Hard fails block; notes don't. Report before/after numbers for every Critical/Major you
claimed to fix, plus the shot paths. Read the compare composite — if the two sides don't
read as relatives, the match or the paint is wrong.

## Quick defect → next file

| You see… | Open |
|---|---|
| No UI yet / need a sketch | `wireframe.md` |
| Known job, invented layout | `corpus/cite.mjs <job>` — match a row |
| Nobody will open this | `adoption.md` |
| Table/form missing states | `contracts.md` |
| Queue / batch / empty | `cite.mjs queue` → `untitled-table` |
| Wrong hierarchy / equal peers | `techniques.md` §Hierarchy, `kits.md` |
| Numbers undecidable | `dashboards.md` |
| Chart encoding smell | `dataviz.md` |
| AI chat as default shell | `ai-surfaces.md` |
| Words don't persuade | `copy.md` |
| Raw values / tokens | `foundations.md`, `color-type.md` |
| Need a library API | `corpus.md` then `rg` |
| Lightning host quirks | `salesforce.md` |
