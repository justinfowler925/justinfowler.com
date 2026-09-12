# Screen Patterns

Compose [contracts.md](contracts.md) into full screens. Apply [foundations.md](foundations.md) for visual system.

## App shell

**Structure:** Sidebar and/or TopNav → main content → optional utility drawer.

**Must**
- Active nav state; nested sections when needed
- Mobile: collapse sidebar to drawer/sheet
- Content region with consistent page header (title, description, primary action)
- User/account menu with keyboard menu contract

**Avoid:** orphan pages with no way back; duplicate titles in nav and H1 fighting each other.

---

## Dashboard / metrics

Full treatment in [dashboards.md](dashboards.md) — metric anatomy, direction semantics,
drill-down models, forecast uncertainty, queue design. The screen-level shape:

**Structure:** context bar → KPI row (3–6) → **one focal object** → supporting modules →
what-needs-me queue.

**Must**
- Every metric answers all four: what is it (with units), compared to what, which way is
  good, how sure are we. A number with no comparison is decoration
- **One focal object** — the chart or table the page is actually about. Six equal modules
  is an index, not a dashboard
- Context bar carries scope, time range and freshness, and stays visible
- Active filters shown as chips with `Clear all`
- Every metric drills through to the rows behind it
- Direction encoded by glyph + sentiment token, never colour alone — and per-metric, since
  up is bad for churn, DSO and cycle time
- Loading skeletons matching final layout; empty and error per the triad below

**Avoid:** wall of equal cards; decorative charts with no units/labels; KPI soup above the
fold with no focal object; dual y-axes; a bare delta with no named baseline; red/green as
the only direction channel.

---

## Insight stream / next-action queue

The surface that answers *"what needs me"*. Consistently outperforms the dashboard beside
it, because "how are we doing" is a question the reader must convert into this one anyway.

**Structure:** count + scope line → ranked rows (subject, rationale, age, action) →
overflow with total.

**Must**
- **Every row states its rationale** — "no activity 21d, close date inside 14", not "at
  risk". An unexplained alert cannot be disagreed with, and cannot be reported as a false
  positive
- One primary action per row, reachable without opening the row
- Age or deadline on every item; sort by urgency, and say what the sort is
- **Empty is a success state** — "Nothing needs you", styled as an achievement, never as a
  broken panel
- Bounded list with a total (`showing 5 of 57`); an unbounded attention queue is
  unactionable
- Dismiss/snooze that captures a reason

**Avoid:** severity inflation (everything P1); alerts with no owner; colour-only urgency;
a queue that never reaches zero.

---

## Review / approval gate

Anything where a model or an automation proposes and a human commits. See
[ai-surfaces.md](ai-surfaces.md).

**Must**
- **Diff, not a summary of the diff**
- Per-item accept/reject, and partial acceptance of a multi-part change
- Rejection captures a reason in one click
- Items ranked by model uncertainty, so attention lands where it pays
- Destructive confirms name the blast radius — "Delete 25 records", not "Are you sure?"
- The inputs the model was given are inspectable

**Avoid:** bulk-approve with no per-item view — oversight theatre; approve cheaper than
reject; fabricated confidence percentages; losing the queue position on reject.

---

## Data table page

**Structure:** Page header (title, description, primary CTA) → DataGrid surface (full table contract).

**Must** — entire Table/DataGrid MUST + SHOULD from contracts:
- Toolbar search/filters, sort, pagination or virtualize, sticky header, column resize/visibility, row actions, selection + batch bar when bulk actions exist
- Empty / filtered-empty / loading / error

**Mobile:** table → card list or horizontal scroll with sticky lead column; filters in sheet.

---

## Forms / settings

**Structure:** Page or modal/drawer → grouped fields → sticky or end actions.

**Must** — Form MUST + SHOULD:
- Labels, helpers, errors, submit busy, focus first error
- Settings: save affordance clear (explicit Save vs autosave — pick one and label it)
- Dangerous zones separated (delete account, revoke)

**Wizards:** Stepper contract; back preserves values; review step before commit when high-stakes.

---

## Auth / onboarding

**Must**
- Email/password or SSO buttons with loading and error inline
- Password show/hide; autocomplete attributes
- Onboarding: short steps, skip where safe, progress indicator
- Empty first-run state with one clear CTA into product

**Avoid:** multi-field walls before value; legal walls without scannable summary.

---

## Detail / record view

**Structure:** Header (title, status, actions) → summary → tabs or sections → related table.

**Must**
- Status chip per contracts; primary/secondary/destructive actions
- Edit in place or Edit → form (consistent)
- Related data uses DataGrid contract, not mini bare tables

---

## Search / filter patterns

**Must**
- Global or page search with clear, debounce when remote, no-results state
- Filters: visible active chips; Clear all; Apply vs instant — be consistent
- Advanced filters behind disclosure

---

## Marketing / landing

**Hero budget (first viewport):** brand, one headline, one short supporting sentence, one CTA group, one dominant full-bleed visual. Stop there.

**Must**
- Brand-first: product/brand name is hero-level, not only nav text
- One composition — not a dashboard of widgets
- Full-bleed hero plane (not inset card, side panel, collage, or floating media block) unless existing DS requires otherwise
- No detached badges/stickers/chips on hero media
- Sections: one job, one headline, one short support line
- Pricing / social proof / CTA band as later sections
- Interactive bits (nav, forms, dialogs) still meet contracts

**Avoid:** card soup, pill clusters, stat strips, icon-feature rows, emoji, purple-glow AI cliché (see [anti-patterns.md](anti-patterns.md)).

**Rhythm:** alternate words and evidence — each plate sits beside the step it
proves (directions flipping), never more than two consecutive images, never a
text wall after an image stack. Gate it: fail any run of three plates
(2026-08-05, the review brief).

---

## Empty, loading, error (cross-cutting)

Every list/table/panel:

| State | Pattern |
|---|---|
| Loading | Skeleton matching final layout |
| Empty | Title + body + primary CTA |
| Filtered empty | “No matches” + Clear filters |
| Error | Message + Retry |

Never reuse empty for loading or error.

---

## Chat / assistant surfaces

**Chat is one AI topology out of ten, and usually the wrong one** — it is linear,
unstructured, undiffable, and its record is a transcript nobody rereads. Before building
chat, check [ai-surfaces.md](ai-surfaces.md) for whether a sidecar, inbox, review gate or
instrumented session fits the work better.

**Must** — Chat/composer contract:
- Persistent composer; streaming state; retry; markdown/code copy
- Keep system chrome (nav) stable while messages stream
- **Named steps over spinners** — "Reading 12 files" beats "Thinking…"
- Stop that actually stops, and preserves partial output
- Input survives an error; never lose a typed message
- Past 10s, the work must be leavable — it survives tab close, and says so

**Fullscreen / sheet:** composer remains available (OpenAI Apps SDK pattern).

---

## Pattern → contract checklist

| Screen | Primary contracts | Also read |
|---|---|---|
| App shell | Sidebar, TopNav, Menu, Breadcrumbs | — |
| Dashboard | Metric cards, Charts, optional Table | `dashboards.md`, `dataviz.md`, `performance.md` |
| Index/list | Table/DataGrid, Toolbar, Filter bar, Pagination | `performance.md` (virtualization) |
| Settings | Form, Tabs, Banner/Alert | — |
| Auth | Form, Button, Alert | — |
| Landing | Link, Button, optional Form; craft rules above | `copy.md` |
| Chat | Composer, List, Markdown, Empty | `ai-surfaces.md` |
| Insight stream / queue | List, Badge, Menu, Empty | `dashboards.md` |
| Review gate | Diff, Button group, Dialog, Empty | `ai-surfaces.md` |
