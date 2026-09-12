# Foundations

Visual and interaction floor for every UI. Behavior completeness lives in [contracts.md](contracts.md). Brand tokens override the neutrals in brand mode ([brand.md](brand.md)).

## Tokens

Prefer semantic CSS variables over scattered hex/Tailwind literals:

```css
:root {
  --bg: /* canvas */;
  --bg-subtle: /* sections, zebra */;
  --fg: /* primary text */;
  --fg-muted: /* secondary text */;
  --border: /* dividers, inputs */;
  --primary: /* brand / main action */;
  --primary-fg: /* on primary */;
  --danger: /* destructive */;
  --success: /* positive */;
  --warning: /* caution */;
  --info: /* informational */;
  --ring: /* focus ring */;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 999px;
  --shadow-sm: /* raised tile — 2 layers, no ring */;
  --shadow-md: /* dropdown, popover, toast */;
  --shadow-lg: /* modal, command palette */;
  --space-1: 4px;  /* 8pt rhythm: 4/8/12/16/24/32/48/64 */
}
```

- Map project brand colors into these semantics; don’t invent a second palette mid-feature.
- Support light (default) and dark only if the product already has dark — don’t add dark “for free.”
- **One token, one meaning.** An accent that also marks the active filter, or a status color
  spent on a categorical chart series, is a vocabulary collapse that every per-element gate
  passes. If two things need to look different, they need two tokens.

### Direction and data tokens

```css
--direction-good  /* sentiment, not arrow direction */
--direction-bad
--direction-flat
--chart-1 … --chart-8  /* Okabe–Ito colour-universal categorical set */
```

- **Which way is good is a property of the metric, not the palette.** Up is bad for churn,
  DSO, cycle time, cost per lead, backlog. Every metric declares its own `goodDirection`
  and the *sentiment* gets the color — never hardcode up=green.
- **Colour never carries direction alone.** ~8% of men have a red/green deficiency, and
  colour-only meaning is a WCAG 1.4.1 failure. Pair with a glyph (▲ ▼) and a word where
  space allows.
- **Chart series are categorical, not semantic.** Never spend danger/success/warning on an
  ordinary series — readers will read alarm into it. Beyond 8 categories, use small
  multiples rather than more hues.
- The `personal` lane ships light-mode variants for the chart ramp, because five of the
  eight published Okabe–Ito hexes fall below 3:1 on a light canvas. **The `brand`
  lane has no chart ramp** — that is an open token gap needing brand approval, not a
  licence to invent hexes.

### Elevation tokens

```css
--shadow-sm  /* 2 layers, no ring — a raised tile */
--shadow-md  /* hairline ring + 2 blur layers — dropdown, popover, toast */
--shadow-lg  /* hairline ring + 3 blur layers — modal, command palette */
```

- Each level **is** Rules 6 and 7, pre-satisfied: ≥2 layers, every layer blurred ≥8px carries
  `spread = −blur/4`, and `md`/`lg` open with the `0 0 0 1px` hairline ring so a token user
  cannot ship the mushy edge a bare drop shadow gives.
- **`sm` has no ring on purpose.** A resting card takes `--border`; a ring there doubles the
  hairline. Flat-with-a-border stays the default in product UI — reach for `md`/`lg` when
  something genuinely floats.
- The `personal` lane is dark-first, so the default value carries **4× the light alpha** (24%
  top layer vs 6%). Ship only the light values into a dark UI and every overlay reads flat.
- The `brand` lane tints the shadow **anchor navy**, not black, per brand — and has no
  dark variant, because the lane has no dark mode.
- design-lint hard-blocks a hand-rolled `box-shadow`. A focus ring (`0 0 0 Npx`) and an
  `inset` highlight are not elevation and pass.

### Tracking tokens

```css
--tracking-xs   /*  0.0078rem, +0.010em at 12px */
--tracking-sm   /*  0                           */
--tracking-base /*  0            — the neutral band is 14–16px */
--tracking-lg   /* -0.0078rem                   */
--tracking-xl   /* -0.0156rem                   */
--tracking-2xl  /* -0.0344rem, −0.020em at 28px */
--tracking-caps /* +0.050em at 12px — all-caps labels (a brand whose UI face is uppercase may want 0.12em) */
```

- **Keyed to the type scale, not named tight/normal/wide.** Rule 4 is a curve, so
  `tracking-lg` is the one that belongs with `text-lg`, and a mismatched pair is visible in
  a diff. `letter-spacing: 0` at every size is the tell this exists to remove.
- `rem`, not `em`: DTCG's dimension type admits `px` and `rem` only, and the measured curve
  these come from is itself published per-size in rem. The em equivalents are in the
  comments so the tie back to Rule 4's figures stays checkable.
- design-lint hard-blocks a literal `letter-spacing`. `normal`, `var()` and `calc()` pass.

### Known token gaps — say so, don't hardcode around them

| Gap | Consequence |
|---|---|
| **No chart ramp in the `brand` lane** | The eight-series categorical set exists in `personal` only. A branded chart needs approved hues; inventing them here would be the vocabulary collapse this file warns about one section up. Say the gap out loud and ask. |

Shadow, tracking and the `text-sm`/`text-base` collision were all on this list until
2026-08-09. Two of them mattered more than they read: **a missing token manufactures the
escape hatch that blinds the gate.** With no shadow token, shipping any shadow meant a raw
`rgba()`, which design-lint hard-blocks, so the only route was a `shine-lint: off` pragma —
and that switched colour and type off for the whole file too. The gap did not just leave one
rule unenforced; it taught people to disable the rest. Pragmas are scoped now
(`shine-lint: off shadow`), which is the other half of the same fix.

## Typography

- Define roles: display, title, body, label, caption, mono.
- One UI sans for product chrome unless brand specifies otherwise.
- Avoid Inter/Roboto/Arial as *expressive* marketing display when no brand is set — pick a distinctive pair. (Exception: a brand that licenses those faces — see brand.md.)
- Body ~16px, line-height ~1.5–1.6; tight tracking on large display only.
- Don’t size meaning with color alone; weight and size establish hierarchy.

## Spacing & layout

- **8pt rhythm** (4px half-step allowed).
- Page: consistent max-width or full-bleed app shell — don’t mix randomly.
- Section gaps larger than component gaps (e.g. 48–96px marketing sections; 16–24px app content stacks).
- Align columns to a grid; avoid one-off magic margins.
- Density: comfortable for marketing; compact available for data-heavy app views.

## Hierarchy

- One primary action per view (or per obvious region).
- Progressive disclosure for density — hide advanced filters until needed.
- Title → supporting → content → actions reading order.
- Don’t compete: hero CTA vs five equal buttons = broken hierarchy.

## Elevation & surfaces

- Flat by default; shadow only for overlays (menus, dialogs, popovers) or true floating panels.
- Borders (`--border`) preferred over heavy shadows for cards/tables in product UI.
- Overlay → `--shadow-md`, modal → `--shadow-lg`. Both already carry the hairline ring, so
  do not add a second `border` on top of them.
- Z-index ladder: base → sticky → dropdown → modal → toast. Document in code if non-obvious.

## Motion

- 150–250ms, `cubic-bezier(0.4, 0, 0.2, 1)` (or equivalent ease-out).
- Purposeful only: open/close overlays, expand/collapse, feedback.
- No bounce spam, no layout thrash, no decorative infinite motion on product chrome.
- Respect `prefers-reduced-motion`.

## State matrix (visual)

Every interactive surface should show:

| State | Requirement |
|---|---|
| Default | Rest styles |
| Hover | Clear affordance (not color-only if critical) |
| Focus-visible | Ring using `--ring`; never remove without replacement |
| Active/pressed | Immediate feedback |
| Disabled | Reduced contrast + not activatable |
| Loading | Spinner/skeleton + `aria-busy` |
| Error | Token + text |
| Success | Token + text when needed |

## Accessibility floor

- Contrast: text ≥4.5:1 (WCAG 1.4.3); **non-text graphical objects and UI components ≥3:1**
  against their background *and* against adjacent objects (WCAG 1.4.11) — this covers chart
  marks, series lines, focus rings, borders that carry meaning, and icon glyphs. Text
  *inside* a chart (axis ticks, labels, legends) is text and needs the full 4.5:1; this is
  the most commonly missed contrast requirement on data surfaces.
- Focus order matches reading order.
- Don’t disable zoom / don’t trap scroll under modals incorrectly.
- Status never color-only (pair icon or text).
- Live regions for toasts and async results that aren’t focus-moving.

## Icons

- One family per product (Lucide is a solid default).
- Stroke weight consistent (~1.5–2px at 16–24px).
- Icon-only controls require accessible names (+ tooltip or sr-only text).

## Imagery & texture

- Real product/context imagery beats abstract gradients as the main idea.
- Decorative gradients are atmosphere, not the hero concept.
- Marketing: full-bleed hero as dominant plane when a hero exists (see [patterns.md](patterns.md)).
