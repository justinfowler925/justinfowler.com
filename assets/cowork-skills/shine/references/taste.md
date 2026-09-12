# taste.md — the positive authority

Measured, not asserted. Production CSS from 18 shipped products was fetched, extracted and analysed (~4.5 MB). Where a claim comes from measurement it says so. Where it comes from published literature it says that instead.

The point of this file: every existing rule set answers *"does this violate a rule?"* This one answers *"is this good?"* — in terms a program can check.

---

## Part 1 — Reference token values

Measured directly from shipped stylesheets.

### Linear
- **Type:** Inter Variable (UI), Tiempos Headline (serif display), Berkeley Mono
- **Weights:** 300 / 400 / **510** / **590** / **680** — non-round variable instances
- **Body:** 15px, line-height 1.6, tracking −0.011em
- **Scale:** 10, 12, 13, 14, 15, 17, 18, 20, 24, 32, 40, 48, 56, 64, 72
- **Tracking curve:** −0.012em at 17–24px → −0.022em at 32px+
- **Leading curve:** 1.6 @15 · 1.4 @17 · 1.33 @20–24 · 1.125 @32 · 1.1 @40 · 1.0 @48 · 1.06 @64
- **Radius:** 4, 6, 8, 12, 16, 24, 32, 9999 — only 7 distinct px values
- **Dark surfaces:** `#08090a #0f1011 #141516 #191a1b` — hue 210° throughout, ΔL = +2.7, +2.0, +2.0
- **Accent:** `#7170ff` = OKLCH(62.3%, 0.207, 279°)
- **Motion:** 0.1s quick, 0.25s regular, 0.15s fade-out
- **Widths:** page 1024px, **prose 624px**, homepage 1344px
- **Other:** explicit 17-step z-index ladder; `--min-tap-size: 44px`; hairline 1px → 0.5px at 2dppx

### Vercel / Geist
- **Grays are chroma exactly 0** — `hsl(0, 0%, L)`. A deliberate counterexample to "grays must be tinted."
- Parallel **alpha ramp** (4%…91%) for overlaying on unknown backgrounds
- Palette authored natively in OKLCH — 173 declarations
- **Shadow ladder:** `2xs 0 1px 1px #0000000a` (4%) → `2xl` three layers at 2/4/6%. Dark mode is identical geometry at **4× alpha**
- **Composite elevation:** hairline ring + shadow + background-colored outer ring. Overlays never get a bare drop shadow
- Focus: `0 0 0 2px var(--background), 0 0 0 4px var(--focus)`
- Durations 0.15s (37×), 0.2s (37×), 0.25s (20×) · `:where()` 566× · `focus-visible` 259×

### Notion
- **Warm grays:** hue 26–60°, saturation 2–10%
- **Line-heights ARE the spacing tokens** — `--font-line-height-200: var(--dimension-spacing-24)`. 100% land on the 4px grid
- **Tracking curve:** +0.0078rem @12px → 0 @14–16 → −0.0078 @18–20 → −0.0156 @22 → −0.047 @32 → −0.156 @76 → −0.2875 @96
- **At the same size, regular takes ~1.6× more negative tracking than bold** (32px: −0.0625rem vs −0.046875rem)
- `font-feature-settings` referenced **1,519 times**, per type role
- `--shadow-200` = 4 layers, offsets/blurs growing ×2.3–2.8, alpha growing linearly 1.3% → 4%

### Others, in brief
- **Stripe:** headings ship at `font-weight: 300`. Radius 2, 4, 6, 16, 32 — **no 8px**. Border widths 1px, **1.25px**, 2px. Ships `calc(radius - 1px)` for nesting. 68 `prefers-reduced-motion` blocks, the most in the set. Measure capped in `ch`.
- **Clerk:** 1,193 `color-mix(in oklab, …)` — the palette is derived, not picked. Shadows are hue-tinted `#212126`, not black.
- **Liveblocks:** one base radius, everything else derived — `calc(.5 * r)`, `calc(.675 * r)`, `calc(r - .75 * 4px)`. `:where()` 770×.
- **Raycast:** greys at hue 180–240° with **saturation rising 0% → 17.6% as lightness falls**. Heaviest shadow layering measured (mean 5.7).
- **Superhuman:** `light-dark()` 101×, relative color syntax 106×. Dark background is a brand-tinted black, never `#000`.
- **Things 3:** `em`-based radii, so radius scales with type size. "Grays" are translucent navies.

---

## Part 2 — 40 checkable rules

### Color & surface
1. **Gray ramps must be hue-monotone.** Every step within ~35° of every other; saturation ≤12% or chroma ≤0.05. Either commit to a hue family or commit to chroma-0. Mixed-sign hue across a ramp is the defect.
2. **Adjacent surfaces differ 1.6–4 percentage points of lightness, mode ≈2.0.** ≥6pp is a smell. Borders carry separation.
3. **In a tinted dark ramp, saturation rises as lightness falls.** A linearly-desaturating ramp reads dead.
4. **Accent chroma lands in OKLCH 0.13–0.24 at L 55–65%.** Tailwind's `-600` row is 0.245–0.288 — above the entire reference set.
5. **Derive the palette, don't hand-pick it.** Ten hand-picked hexes won't stay in relationship; a `color-mix()` formula will.

### Type
6. **The scale is two ratios.** ~1.10–1.15 in the UI band (11–24px), ~1.20–1.25 display.
7. **Line-height is a monotonically decreasing function of size, peaking at body size** — and it falls going smaller too.
8. **Floor: ≥1.33 at 12px, ≥1.40 at 14–15px.** Dense UIs cut padding, not leading.
9. **Tracking is a function of size AND weight.** Regular needs ~1.6× more negative tracking than bold at the same size.
10. **Display crosses to negative tracking at 20–24px, reaching −0.02 to −0.035em by 48px.**
11. **Use non-round variable weights** — 450, 510, 590, 680 — where the face supports them.
12. **One custom or licensed face, minimum.** 11 of 13 measured products use a non-Google face.
13. **Set `font-feature-settings` per role, not globally.** `tabular-nums` on every numeric column is a hard requirement.

### Shape
14. **`child radius = parent radius − padding`, never child > parent.** Ships as literal `calc()` in production.
15. **Radius scales with element size.** Controls 4–6px, cards 10–12px, sheets 16–20px, pills full. One value everywhere is the tell.
16. **Consider deriving all radii from one base.**

### Depth
17. **≥2 layers; overlays 3–5.**
18. **Offsets and blurs grow geometrically (×2–2.8 per layer); alpha grows linearly and stays low.**
19. **Top-layer alpha ≤6% in light mode.** Tailwind's `shadow-lg` is 10% on both layers.
20. **Any layer with blur ≥8px carries negative spread ≈ −blur/4 to −blur/2.** Without it the shadow haloes past the silhouette.
21. **Elevation = hairline ring + blur layers + background ring.**
22. **Dark mode: raise the surface and add a 1px top inner highlight.** Don't reuse the light shadow. Where dark shadows are used, alpha ≈4× light.
23. **Hairlines below 1px are real** — 847 occurrences of `0.5px` across the set.
24. **Separation preference order: spacing > background > shadow > border.**

### Motion
25. **Duration mode across 4.5 MB is 150ms.** Plus a distinct 50/75/80ms micro-feedback band.
26. **By role:** 100–150 micro · 150–250 standard · 200–300 overlays. **Exits ~20% faster than entrances.** Match duration to distance.
27. **By role, easing:** entering/exiting → ease-out · moving on screen → ease-in-out · hover → ease · constant motion → linear (the one legitimate use).
28. **Press feedback is `scale(0.96–0.99)`.** Hover transforms are tiny — 2–3px.
29. **Never start an entrance at `scale(0)`.** 0.93–0.95; dialogs from ~0.8.
30. **Don't animate high-frequency keyboard-driven surfaces at all.** Command palettes, context menus, theme toggles.

### Layout
31. **Optical alignment is real and shipped** — sub-pixel nudges appear throughout production CSS.
32. **Spacing is a 4px-base non-linear scale that goes coarse at the top.**
33. **Optionally snap line-height to the spacing grid.** Notion does this literally; its vertical rhythm is provably tighter.
34. **Prose caps at 45–75ch** — the intersection of Bringhurst (45–75) and Butterick (45–90). Vary content width by role.
35. **Ship an explicit z-index token ladder.** Ad-hoc `9999` is the alternative.

### Interaction hygiene
36. **`focus-visible` + `outline-offset`, not `outline: none`.** Modern browsers respect `border-radius` on `outline` — this corrects older advice to use `box-shadow` instead.
37. **Guard hover behind `@media (hover: hover)`.**
38. **`prefers-reduced-motion` is table stakes** — present in 11 of 13.
39. **`text-wrap: balance` on headings, `pretty` on body.**
40. **Name your transition properties.** Never `transition: all`.

---

## Part 3 — Failure taxonomy

Each written so it can be detected. The tell → the fix.

### Color
1. `linear-gradient(135deg, …)` purple→blue → single flat surface, or same-hue with ΔL ≤12%
2. Computed color exactly equals a Tailwind default with no `@theme` override → override at minimum the accent ramp
3. `#000` on `#fff` → `oklch(21% .006 286)` on `oklch(98.5% 0 0)`
4. Accent chroma >0.24 as a large fill → ≤0.08 for large fills; reserve >0.2 for under 5% of pixels
5. Chroma-0 neutrals beside a chromatic accent → be consistent in either direction
6. `background-clip: text` gradient on an h1 → solid. If kept, you must unset the gradient on `::selection`
7. Shadow colored with the accent hue → tinted black, ambient + direct
8. Semantic colors picked ad hoc → use a documented 12-step family
9. Status by color alone → icon + text label
10. Large dark gradient banding → radial gradients, never a scaled/blurred filled rect
11. `:hover` computed color equals base color → every state must increase contrast

### Type
12. Inter with zero tracking and zero feature settings → the single loudest AI signal
13. `letter-spacing: 0` at ≥36px → −0.025em at 36–48, −0.05em above 60
14. `line-height ≥1.4` at ≥30px → 0.95–1.1 display
15. Everything at 1rem → ≥3 roles with size, weight and color changing together
16. Hierarchy from size alone → change three axes at once
17. Weight jumping 400→700 → 500–600 for medium headings
18. Any weight below 400 in UI → floor at 400
19. `text-transform: uppercase` with tracking 0 → +0.025 to +0.1em
20. Measure >75ch → ~65ch
21. `text-align: center` on a paragraph >2 lines → left-align
22. `font-weight` change on hover → causes reflow; change color or add a ring
23. Literal `...` and straight quotes → `…` and curly quotes
24. Numeric columns without `tabular-nums`
25. Headings without `text-wrap: balance`
26. `<input>` font-size <16px on mobile → iOS zooms on focus and it feels broken

### Layout
27. `max-width: 1200px; margin: 0 auto` as the only layout decision → differentiate by content role
28. Three identical `grid-cols-3` feature cards → the universal AI landing page
29. Hero → 3 cards → CTA → footer, nothing else → lead with the actual artifact above the fold
30. One gap value used for >80% of gaps → three tiers: 8 intra-component, 16 intra-group, 64–96 inter-section
31. Any margin or padding not ≡ 0 mod 4px
32. Icon+label row with `items-center` and no optical nudge
33. Everything centered → left-align content-dense sections
34. Nothing happens above 1200px
35. Horizontal scrollbar leak → usually a flex child missing `min-w-0`
36. Interactive target <24px (mobile <44px) → expand hit area with a pseudo-element

### Shape & depth
37. `border-radius: 8px` on every element regardless of size
38. `child_radius ≥ parent_radius` → corners visibly don't run parallel
39. Computed shadow exactly equals unmodified `shadow-lg` → author your own alphas
40. Single-layer shadow at large blur → no real object casts one shadow
41. Pure-black shadow on a hued background
42. `border: 1px solid rgba(0,0,0,0.1)` everywhere → muddy, and invisible in dark mode
43. `backdrop-filter: blur()` on anything not genuinely over content
44. Focus indicator that squares off a rounded element

### Motion
45. `transition: all`
46. Animating `top`/`left`/`width`/`height`/`margin`/`padding` → transform and opacity only
47. `linear` on a transform, or shipping Tailwind's default easing on an entrance
48. Duration >300ms on hover or active
49. Entrance and exit at identical duration
50. `scale(0)` → `scale(1)` entrance
51. Default `transform-origin` on a popover → set it to the trigger
52. Keyframes where a transition would do → keyframes can't be interrupted mid-flight
53. No `prefers-reduced-motion` anywhere in the bundle
54. Hover that changes box dimensions → neighbors shift, pointer flickers out
55. Spring physics on discrete state changes → springs are for gesture-driven surfaces

### Icons, imagery & content
56. Emoji inside a button or heading → renders per-OS, can't inherit `currentColor`
57. Two icon libraries in one bundle → detect via mixed viewBox conventions
58. Inconsistent `stroke-width` across icons
59. Icon sized to cap-height, dominating its label → icon box ≈1em, glyph ≈0.85em
60. **Stock photography.** Uniformity tell of exactly the same kind as default tokens. Use real product surfaces, generated texture, data as ornament, or typographic covers.
61. A "Trusted by" row of invented logos → fabricated social proof, an integrity problem
62. Blurred gradient mesh blob behind the hero → and if kept, it must have `pointer-events: none`
63. ✨ 🎉 🔥 in headings, buttons or badges → the most reliable generated-content marker
64. Badges on elements with no state to communicate
65. Vague button labels — "Continue", "Learn More", three "Get Started" on one page
66. Error message stating a problem with no next step

### State
67. Click handler with no `:hover` rule
68. `outline: none` with no replacement
69. Disabled = `opacity: 0.5` and nothing else → usually drops below contrast minimums. And disabled buttons must not carry tooltips; they're unreachable
70. Submit disabled before the user has typed → hides which field is wrong
71. Loading button that replaces its label with a spinner → width jumps, verb lost
72. No empty state — a zero-row table renders as a bare header
73. Spinner where a skeleton belongs, or a skeleton whose shape doesn't match the loaded content
74. Corner toast for a local action → inline checkmark at the trigger
75. Destructive action fires immediately → confirmation or an undo window
76. State held only in component state, never in the URL

### Dark mode
77. Dark palette produced by inverting light → hue relationships invert too
78. `background: #000` → OLED smearing, and elevation becomes inexpressible
79. `color: #fff` body text on dark → halation. Reserve pure white for one element
80. Light-mode shadows reused in dark → invisible on a near-black surface
81. Accent carried into dark at identical chroma → saturated hues bloom on dark
82. **Missing `color-scheme: dark` on `<html>`** → the most common visible dark-mode defect. Scrollbars, native `<select>`, date pickers and autofill all render light
83. Theme toggle animating every element → suppress transitions for one frame during the swap
84. Contrast verified only in light mode

---

## Sources

Measured: production CSS from Linear, Stripe, Vercel, Notion, Raycast, Clerk, Resend, Superhuman, Things, Liveblocks, Dia, Observable, Val Town.

Published, verified: Refactoring UI (Wathan/Schoger) · Practical Typography (Butterick) · Elements of Typographic Style (Bringhurst) · Material 3 token files · IBM Carbon · Apple HIG · `vercel-labs/web-interface-guidelines/AGENTS.md` · `interfaces.rauno.me` · `emilkowal.ski/ui/agents-with-taste`.

Two corrections worth carrying: the widely-cited "Bringhurst says 1.5× leading" is not his — those are Rutter's web-era figures. And Refactoring UI's free color chapter explicitly denies a numeric hue-rotation rule.
