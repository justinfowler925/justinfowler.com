# Component Contracts

SSOT for what a named component includes. For record tables, `table-quality.md` defines the enforced executable proof and task-appropriate capabilities. The MUST/SHOULD lists below were distilled in 2026 from MUI X, Ant Design, IBM Carbon, React Aria/Spectrum, shadcn/Radix (+ TanStack), Untitled UI/Plus UI visual matrices, and OpenAI Apps SDK UI (chat). That sentence is provenance, not a pointer: MUI, Ant and Carbon were deleted from the corpus on 2026-08-31 (`docs/no-foreign-runtimes.md`) and are not there to read. The distilled requirements stayed — a completeness ladder is a fact about tables, not about a vendor.

**Rule:** implement MUST always. For app/admin surfaces, also SHOULD. ASK before building ASK items. Opt-out only when user says simple/static/presentation/minimal.

---

## Universal (every interactive control)

**MUST**
- Accessible name (visible label or `aria-label` / `aria-labelledby`)
- States: default, hover, focus-visible, active/pressed, disabled
- Keyboard operable per WAI-ARIA APG; focus never trapped accidentally
- Disabled: announced, non-activating, visually distinct
- Hit target ≥40–44px for pointer controls
- Controlled and uncontrolled value patterns where applicable

**SHOULD**
- Loading/pending where async (`aria-busy`, preserve layout width)
- Tooltip or visible label for icon-only controls
- i18n-ready strings; RTL-safe layout

---

## Button / ButtonGroup / IconButton / SplitButton

**MUST**
- Variants: primary, secondary (outline/tonal), ghost/text, destructive
- Sizes: sm, md, lg
- States: default, hover, focus-visible, pressed, disabled, loading (spinner + disable + keep width)
- Content: label; optional leading/trailing icon
- Icon-only → required accessible name
- Correct `type` (`button` | `submit` | `reset`)
- ButtonGroup: attached/segmented; roving tabindex; exclusive or independent
- SplitButton: primary action + menu chevron; `aria-haspopup` / `aria-expanded`; keyboard menu

**ASK:** long-press, async confirmation beyond loading

---

## Link

**MUST**
- Semantic `<a href>` (or router Link that renders anchor)
- Focus-visible + hover affordance
- External: `rel="noopener noreferrer"` when `target="_blank"`; optional external indicator
- Do not fake navigation with buttons (or actions with links)

---

## Input / Search / NumberInput / Password / Textarea

**MUST**
- Visible label (placeholder is never the sole label)
- Helper text + error text (swap, not duplicate); `aria-invalid` + `aria-describedby`
- Required indicator + form-level explanation of required marks
- States: default, hover, focus, filled, error, disabled, read-only
- Correct `type` / `inputMode` / `autocomplete`
- Prefix/suffix or leading/trailing icon slots when pattern needs them
- **Password:** show/hide toggle with accessible name
- **Number:** min/max/step; keyboard-friendly; reject invalid commit
- **Textarea:** label, helper/error, resize policy (vertical|none), min rows; scroll or auto-grow
- **Search:** clear affordance when value present; submit via Enter

**SHOULD**
- Character count when maxLength is meaningful
- Debounced search for remote queries

---

## Select / Combobox / Autocomplete / MultiSelect

**MUST — Select**
- Trigger shows value or placeholder; listbox popup
- Keyboard: arrows, Home/End, Enter, Escape; typeahead; focus restore
- Disabled options; empty options state; form value sync

**MUST — Combobox / Autocomplete**
- Editable input + popup; filter-as-you-type
- `aria-expanded` / `aria-controls` / activedescendant (or focus move)
- Loading suggestions; no-results; allow/deny custom values (explicit)

**MUST — MultiSelect**
- Selected as chips/tags with remove; keyboard remove
- Keep popup open on select (usual); count summary

**SHOULD**
- Combobox instead of native select when options are long
- Grouped options; async debounce for remote lists
- Select-all when finite multi list

---

## Checkbox / Radio / Switch / Slider

**MUST**
- **Checkbox:** checked / unchecked / indeterminate; label clickable; Space toggles
- **Radio:** group semantics; one tab stop; arrows change; required group error
- **Switch:** clear on/off meaning; not for ternary choices
- **Slider:** min/max/step; visible value; keyboard arrows/Page; dual-thumb if range
- Group helper + error association

---

## DatePicker / TimePicker / DateRangePicker

**MUST**
- Text entry + picker popup (or segmented fields)
- Locale-aware format; min/max; disabled dates; clear
- Parse/format errors as field errors
- Range: end ≥ start; incomplete range state
- Time: 12/24h per locale

**SHOULD**
- Today shortcut; mobile sheet/native when appropriate

---

## Form — CRITICAL

**MUST**
- Every field: `name`, label, description/helper, error, required, disabled, read-only as needed
- Layout: consistent vertical (default) or horizontal; responsive single-column collapse
- Field grouping with section headers or fieldset/legend
- Actions: primary submit; secondary cancel/reset; destructive separated
- Validate on submit always; don’t shout required-empty on first keystroke
- Field errors with `aria-invalid` + `aria-describedby`
- On fail: scroll/focus first invalid field; keep values
- Submit states: idle → submitting (`aria-busy`, disable submit, show progress) → success or fail
- Native Enter submit in text inputs

**SHOULD**
- Top error summary with links to fields (WCAG-aligned enterprise default)
- Dirty / unsaved navigate guard when editing
- Async field validation (unique email) with pending state
- Disable submit while invalid (product choice — support the pattern)

**ASK:** multi-step wizard persistence strategy, draft autosave cadence

---

## Table / DataGrid — CRITICAL

A “table” in an app is a **DataGrid-class surface**, not bare `<table>` markup — unless user says simple/static/presentation.

A `<table>` with two or more header cells is a named Table whether or not it carries
`data-shine-contract="table"`. That attribute documents; it does not opt in.
Opt out with `data-shine-contract="layout"` or `role="presentation"`. `measure.mjs`
fails the unmarked data table.

### Anatomy (enterprise data table)
1. Title + optional description  
2. Toolbar (global actions)  
3. Column headers  
4. Rows  
5. Pagination bar (or virtualized scroll end)

### MUST
- **Chrome:** title (or page-level title); toolbar with search and/or filters; sticky header; horizontal scroll when needed; lead/primary column visually distinct
- **Sort:** per-column asc/desc/unsorted; header indicator; header is a button
- **Filter:** column filters and/or toolbar global search; clear path; filtered-empty distinct from true-empty
- **Pagination** (page size, range text, total or equivalent) **or** virtualized scroll for large sets — pick one and complete it
- **Column resize** (drag; keyboard when using Aria-style grid)
- **Row actions:** inline if &lt;3 actions, else overflow menu; not hover-only (persist on touch)
- **States:** loading/skeleton (keep header); empty + CTA; filtered-empty; error + retry
- **A11y:** consistent table or grid semantics; selection announced if present; keyboard path complete for chosen model
- Client vs server mode for sort/filter/page made explicit when data is remote

### SHOULD (app/admin default)
- Row selection: none / single / multi; header select-all with **page vs all-filtered defined**; selected count; **batch action bar**
- Column visibility menu (persist if app has prefs)
- Density: compact / default / comfortable
- Active filter chips + Clear all
- Sticky first/lead column when horizontal scroll is heavy
- Server-side hooks: total count, debounce, race-safe fetches

### ASK (never silent)
- Cell editing, tree/hierarchical rows, row expand detail panels
- Column pin, drag-reorder rows/columns, multi-sort
- Grouping, aggregation, pivot
- Excel/CSV export, realtime push updates
- Virtualization thresholds / infinite query design details

### Presentation table (only when user opts out)
- Semantic table, clear headers, responsive overflow, empty state — no fake toolbar chrome

---

## List / Virtualized list

**MUST**
- Stable keys; loading / empty / error
- Selection model if selectable; keyboard operable

**SHOULD**
- Virtualize when N is large; infinite load with sentinel + busy + end
- Typeahead for long selectable lists

---

## Tabs / Accordion / Disclosure

**MUST — Tabs**
- Tablist + tab + tabpanel; one selected; arrows + Home/End; manual or automatic activation
- Disabled tabs; associated panels

**MUST — Accordion**
- `aria-expanded` / `aria-controls`; Enter/Space; single or multi expand explicit

**SHOULD**
- Tabs overflow (scroll or “more”); deep-linkable selected value

---

## Menu / Dropdown / Context menu / Command palette

**MUST — Menu / Dropdown**
- Trigger + portal; focus inside; Escape + outside dismiss; restore focus
- Items: icons, shortcuts, separators, disabled, destructive styling, submenus
- Typeahead; roving focus; `aria-haspopup` / `aria-expanded`

**MUST — Context menu**
- Secondary-click / long-press; position near pointer; same item model

**MUST — Command palette**
- Global shortcut (⌘K / Ctrl+K); fuzzy search; grouped commands; keyboard-only complete path; empty + loading states

---

## Navigation: Sidebar / TopNav / Breadcrumbs / Pagination / Stepper

**MUST — Sidebar**
- Active route; nested sections; expand/collapse; icon+label; keyboard; mobile drawer variant

**MUST — TopNav**
- Brand, primary links, utilities; active state; overflow strategy

**MUST — Breadcrumbs**
- Hierarchy links; current page non-link; collapse middle when long

**MUST — Pagination (standalone)**
- Page size, range text, disabled edges; compact on mobile

**MUST — Stepper**
- States: complete / current / upcoming / error; linear vs optional explicit

---

## Dialog / Modal / Drawer / Sheet / Popover / Tooltip / Toast

**MUST — Dialog / Modal**
- Role dialog; labelled title; focus trap; initial focus; Escape; restore focus
- Explicit close; footer primary/secondary; scrollable body when needed
- Scrim click: block or warn if dirty/destructive

**MUST — Drawer / Sheet**
- Same focus rules; edge anchor; mobile dismiss pattern

**MUST — Popover**
- Anchored; dismissable; don’t steal focus for pure info

**MUST — Tooltip**
- Hover/focus only; delay; never required info; no interactive content (use Popover)

**MUST — Toast**
- Short message; optional action; auto-dismiss + pause on hover/focus; `aria-live` by severity
- Never the only channel for blocking errors

---

## Card / Panel / Section header

**MUST**
- Title; optional description; optional actions; content slot
- If clickable: one clear target (whole card **or** nested buttons — not both competing)

**SHOULD**
- Section header aligned to page grid with consistent action placement

---

## Toolbar / Action bar / Filter bar / Batch bar

**MUST**
- Clear grouping: left = title/search/filters; right = primary actions
- Overflow when actions &gt; ~5
- Batch bar when selection &gt; 0: count + actions + clear selection

**SHOULD**
- Sticky under page header when content scrolls
- Active filters as dismissible chips + Clear all

---

## Avatar / Badge / Chip / Status

**MUST**
- **Avatar:** image / initials / icon fallback; sizes
- **Badge:** numeric or dot; max (“99+”); never color-only meaning
- **Chip/Tag:** label; dismissible when removable; selected state when toggles
- **Status:** color **and** text/icon; semantic mapping (success/warn/error/info/neutral)

---

## Progress / Spinner / Skeleton

**MUST**
- Determinate vs indeterminate clear; labeled when meaningful
- Skeleton mirrors layout; region `aria-busy`
- Prefer skeleton for content panels; spinner for actions/buttons

---

## Empty / Error / Alert / Banner

**MUST**
- **Empty:** title, body, primary CTA (and optional secondary)
- **Error:** what failed, retry/support; visually ≠ empty
- **Alert:** severity, in-context, optional dismiss
- **Banner:** page-level; critical banners not casually dismissible

---

## File upload

**MUST**
- Click + drag-drop; accept types; max size/count; multiple when needed
- Per-file progress, cancel, remove; errors per file
- Keyboard-operable drop zone

**SHOULD**
- Image preview; retry failed files; paste support where relevant

---

## Charts / metric cards

**MUST**
- Title, units, legend as needed; loading / empty / error
- Tooltip or focus access to values; not color-only encoding
- Metric card: value, context/period; optional delta

**SHOULD**
- Responsive container; tabular/summary fallback when chart is dense

---

## Chat / composer (OpenAI Apps SDK–informed)

**MUST**
- Composer always reachable in immersive views
- Auto-grow textarea; send disabled when empty or streaming
- Message list with roles; streaming state; failed-turn retry
- Empty conversation state
- Attachments affordance when product supports files
- Markdown/code rendering with copy for code blocks when shown

**SHOULD**
- Stop/regenerate; virtualized history; attachment preview/progress

**ASK:** retention, model picker, tool-call UX specifics

---

## Authority cheat-sheet

| Need | Reference model |
|---|---|
| Interaction/a11y | React Aria + WAI-ARIA APG |
| Enterprise form/table API | this file's § Form and § Table MUST lists |
| Product table anatomy | this file's § Anatomy, proven by `untitled-table` |
| React DataGrid batteries | TanStack Table ^8 + `integrations/resolve.mjs` recipe |
| Composable React stack | shadcn + Radix + TanStack Table/Form |
| Visual variants | Untitled UI / Plus UI |
| Chat embeds | OpenAI Apps SDK UI |
