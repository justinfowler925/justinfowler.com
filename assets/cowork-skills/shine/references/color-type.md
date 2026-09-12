# color-type.md

Color, typography and icons. Verified 2026-08-04.

---

## Color

### Platform

| Feature | Baseline | Since |
|---|---|---|
| `oklch()` / `oklab()` | **Widely** | widely 2025-11 |
| `color-mix()` | **Widely** | widely 2025-11 |
| Relative color syntax | Newly | 2024-09 |
| `light-dark()` | Newly | 2024-05 |
| Gradient interpolation `in oklch` | Newly | 2024-06 |

All four are production-safe. Tailwind v4's default palette is already OKLCH.

### Method — one brand color to an accessible perceptual ramp

Anchor in OKLCH with a fixed lightness ladder and chroma tapering at both ends. Derive states with relative color syntax so there's no rebuild step. Collapse both themes with `light-dark()`.

```css
:root {
  --brand-h: 256;
  --brand-c: 0.19;
  --brand-1:  oklch(0.985 calc(var(--brand-c) * 0.10) var(--brand-h));
  --brand-9:  oklch(0.620 var(--brand-c)              var(--brand-h));
  --brand-12: oklch(0.280 calc(var(--brand-c) * 0.55) var(--brand-h));
}
.btn:hover { background: oklch(from var(--brand-9) calc(l - 0.05) c h); }
.surface   { background: light-dark(var(--brand-1), var(--brand-12)); }
```

Gamut-clamp at build time:

```js
import { converter, clampChroma, formatCss } from 'culori';
const oklch = converter('oklch');
const step = (base, L) => formatCss(clampChroma({ ...oklch(base), l: L }, 'oklch', 'rgb'));
```

**Gotcha:** `@supports` with a custom property in the test **always returns true**. Feature-detect with a literal: `@supports (color: oklch(from red l c calc(h + 180)))`.

### Contrast policy — gate on WCAG 2 AA, report APCA as advisory

**APCA is not the WCAG 3 algorithm.** It was pulled from the WCAG 3 Working Draft in **July 2023** for failing to gain working-group support, and the April 2026 editor's draft states the contrast algorithm is **yet to be determined**. WCAG 3 won't reach Recommendation before ~2028–2030.

Library facts that are widely misreported:
- **`culori@4.0.2` has no APCA.** Verified by grepping the entrypoint — zero hits. This claim is repeated constantly and is false. It does have `wcagContrast`, `clampChroma`, `toGamut`.
- **`chroma-js@3.2.0` has a real `contrastAPCA()`** — APCA-1.0.98G constants, auto alpha-blending. One dependency, both algorithms. Its own header calls it beta.
- **`colorjs.io@0.7.1`** exports six contrast algorithms but is still 0.x, so the API isn't frozen.
- **`apca-w3@0.1.9` is frozen since 2022-07 and is licensed "Limited W3 License," not MIT.** A genuine legal flag for commercial use. Only reach for it if you need `fontLookupAPCA`.
- **`@texel/color`** — MIT, ~3.5 KB, gamut mapping 69–132× faster than culori. The right pick for per-frame color.

**`@radix-ui/colors` is still 3.0.0 from October 2023** — repo alive but feature-frozen and pre-OKLCH. The 12-step mental model remains the standard; the package doesn't. OKLCH alternatives copying the structure: `@strum/colors`, `tailwindcss-radix-colors`.

Tooling: **Harmonizer** (Evil Martians) generates OKLCH scales at constant chroma/contrast. `apcach` gives "most saturated color at a given contrast" but **npm is stale at 0.6.4 while the repo was pushed 2025-02** — take it from source.

---

## Typography

### The scale is a token. Use it.

Type had no tokens at all until 2026-08-08, and every surface answered that by inventing
its own: one product board reached 12/13/14/15/16px in one stylesheet; another screen used
bare rem, and a review asking "what's the scale?" had nothing to point at. Six sizes now
ship on every target — CSS vars, Tailwind `text-*`, artifact CSS, Python:

| Token | Value | For |
|---|---|---|
| `--shine-text-xs` | 0.75rem / 12px | metadata, uppercase labels, counts |
| `--shine-text-sm` | 0.875rem / 14px | dense rows, buttons, secondary text |
| `--shine-text-base` | 0.9375rem / 15px | body |
| `--shine-text-lg` | 1.125rem / 18px | panel and section headings |
| `--shine-text-xl` | 1.375rem / 22px | screen title |
| `--shine-text-2xl` | 1.75rem / 28px | display |

Line height rides along: `--shine-leading-tight` 1.2 (headings), `snug` 1.35 (dense rows),
`normal` 1.5 (body), `relaxed` 1.65 (long prose). Tailwind's own `--text-*` scale is wiped
the same way its palette is, so `text-4xl` is not reachable — an off-system size has to be
argued for, not typed by habit.

`rem`, deliberately: a px type scale ignores the browser text size the reader chose. Fluid
display type still uses `clamp()` (below) — the tokens are the discrete UI scale, not a
replacement for it.

### What separates expensive from amateur — measurable properties only

1. **Optical size.** `font-optical-sizing` is Baseline Widely since 2020. Inter's variable font has `opsz 14–32`. Using it is the single biggest "designed, not defaulted" signal.
2. **Size-inverse tracking.** −0.02 to −0.03em above 60px · −0.01 to −0.02em for large headings · 0 at body · +0.04 to +0.08em for all-caps. Always in `em`. **A system where every size has `letter-spacing: 0` is the tell.**
3. **Weight also drives tracking.** At the same size, regular needs ~1.6× more negative tracking than bold — lighter strokes leave more apparent counter-space.
4. **Line-height is a ratio, not a constant.** ~1.5–1.6 body, ~1.1–1.2 display, and it must vary with size.
5. **Tabular figures in tables.** `font-variant-numeric: tabular-nums`. Numbers that jitter column-to-column read as broken.
6. **Leading trim.** `text-box-trim` / `text-box-edge` is Chrome 133 + Safari 18.2, **no Firefox** — progressive enhancement only, but it's what makes headings sit optically flush instead of floating.

```css
:root { font-optical-sizing: auto; font-variant-numeric: tabular-nums lining-nums; }
h1 {
  font-size: clamp(2.28rem, 1.79rem + 2.44vw, 3.82rem);
  font-variation-settings: "opsz" 32;
  letter-spacing: -0.022em;
  line-height: 1.05;
  text-wrap: balance;
}
p { max-inline-size: 68ch; line-height: 1.6; text-wrap: pretty; }
@supports (text-box: trim-both cap alphabetic) { h1 { text-box: trim-both cap alphabetic; } }
```

### Fluid scales

**Utopia** (`utopia-core@1.6.0`) — two viewport poles plus two ratios generate a `clamp()` per step. `calculateTypeScale`, `calculateSpaceScale`, `calculateClamps`; returns a `wcagViolation` flag per step.

Why it beats hand-rolled `clamp()`: the *ratio itself* widens with the viewport, so hierarchy tightens on mobile and opens on desktop. That's what makes responsive type feel designed rather than merely scaled.

### Typefaces that read premium (all free, verified on Fontsource 5.3.0)

- **Inter** — the only one here with a true `opsz` axis. Best default.
- **Geist / Geist Mono** (Vercel) — closest free Söhne substitute; rational, tight.
- **Instrument Sans + Instrument Serif** — the pair that most reliably reads editorial-expensive.
- **Fraunces, Newsreader, Literata, Source Serif 4** — serif display with real optical axes.
- **Mono:** Geist Mono, JetBrains Mono, Commit Mono.

Self-host via `@fontsource-variable/*`. Note the unscoped `fontsource` package is a security placeholder — the real ones are `@fontsource/*` and `@fontsource-variable/*`.

---

## Icons

| Library | Version | Count | License | Grid | Stroke |
|---|---|---|---|---|---|
| `lucide-react` | 1.28.0 | 1,756 | ISC | 24 | **2**, round |
| `@tabler/icons-react` | 3.46.0 | 6,184 | MIT | 24 | 2, round |
| `iconoir-react` | 7.11.1 | 1,671 | MIT | 24 | **1.5**, round |
| `@phosphor-icons/react` | 2.1.10 (2025-05) | 1,512 × 6 weights | MIT | **256** | filled paths |
| `@radix-ui/react-icons` | 1.3.2 (2024-11) | 332 | MIT | **15** | filled |

**The property that determines "expensive" is stroke-to-grid ratio.** 1.5/24 (0.0625) reads refined; **2.0/24 (0.083) reads utilitarian** — the developer-tool weight. Secondary: round terminals, restrained corner radii, and a *smaller curated set* (sprawl guarantees long-tail inconsistency).

- **Iconoir** is the best fit — the only actively maintained library whose *default* is 1.5/24 round. Zero tuning.
- **Phosphor `light`** gives the strongest editorial-luxury look, plus `duotone` as an accent register. Cost: React package 14 months stale, weight fixed at import, and a 256 viewBox mixes awkwardly with 24-grid sets.
- **Lucide at `strokeWidth={1.5}`** mostly works and is the best-maintained choice, but the geometry was drawn for stroke 2, so some joins go optically loose when thinned.

Lucide hit 1.0 in March 2026 and is now on a weekly cadence. **Radix Icons is not deprecated and was not merged into Radix Themes** — both claims are false — but it is feature-frozen at November 2024.

---

## Imagery

**Stock photography is a uniformity tell of exactly the same kind as default tokens.** Everyone licenses from the same three libraries, so everyone's "team collaborating" shot is interchangeable. Banned outright.

What to use instead, in preference order:
1. **Real product surfaces** — actual screenshots, actual data, cropped hard and treated as texture rather than documentation.
2. **Generated fields** — gradient meshes, grain, dithering, flow fields. Procedural, ownable, and infinitely variable. See `motion.md` for the technique hierarchy.
3. **Data as ornament** — a real chart rendered large and abstracted. Earns its place twice.
4. **Typographic covers** — set the title enormous and let the type be the image.

If a photograph is genuinely required, it must be commissioned, taken in-house, or a specific documented artifact. Never a search result.

---

## Modern CSS layout — Baseline status

| Feature | Baseline | Became |
|---|---|---|
| `@layer` | **Widely** | 2024-09 |
| Container queries (size) | **Widely** | 2025-08 |
| Subgrid | **Widely** | 2026-03 |
| CSS nesting | **Widely** | 2026-06 |
| `:has()` | **Widely** | 2026-06 |
| `text-wrap: balance` | Newly | 2024-05 |
| Container **style** queries | Newly | 2026-05 — **custom properties only** |
| `field-sizing: content` | Newly | 2026-06 |
| Anchor positioning | see note | — |
| `text-wrap: pretty` | **Limited** | no Firefox |
| Scroll-state queries | **Limited** | Chromium only |

**Three of these crossed to Widely in the last five months.** If your mental model says subgrid, nesting or `:has()` are still risky, that's stale.

**Anchor positioning is genuinely tri-engine, not Chromium-only** — Chrome 125, Firefox 147, Safari 26, ~82% coverage. Baseline says "limited" because Chrome and Safari are flagged partial on `position-anchor`'s *initial value*. Operational rule: always set `position-anchor` explicitly and gate on `@supports`.

**Nesting has a version trap.** Bare type selectors need `CSSNestedDeclarations`: Chrome 130 / Firefox 132 / Safari 18.2. In Chrome 120–129 and Safari 17.2–18.1, declarations appearing *after* a nested rule are **silently dropped**.

---

## Design tokens

**DTCG published `2025.10` as a Final Community Group Report on 2025-10-28** — explicitly "considered stable." If anything says perpetual editor's draft, that's stale.

⚠️ `tr.designtokens.org/format/` **redirects to a living preview stamped "Do not attempt to implement this version."** Use `designtokens.org/tr/2025.10/`.

⚠️ **A bare hex string is no longer a valid color** — verified against the official JSON Schema:

```json
{ "Hot pink": { "$type": "color",
  "$value": { "colorSpace": "srgb", "components": [1,0,1], "alpha": 1, "hex": "#ff00ff" } } }
```

`colorSpace` + `components` required; `hex` is a **fallback hint, not the value**. 14 legal color spaces including `oklch`. `dimension` is likewise `{value, unit}` with unit enum **only `px | rem`**.

**Use Terrazzo, not Style Dictionary.** `@terrazzo/cli@2.5.0` has resolvers, modes, and the only first-party Tailwind v4 `@theme` emitter. `style-dictionary@5.5.0`'s own docs say 2025.10 "does not have full support yet," and it has no resolver. Pick Style Dictionary only if you later need iOS/Android/Compose targets.

⚠️ **Verify before relying on it:** whether `@terrazzo/plugin-tailwind` emits `@theme` or `@theme inline`. Documented output shows plain `@theme` with literal values, which would **not** support runtime theme switching.

**The `@theme` vs `@theme inline` distinction is the #1 cause of "dark mode doesn't switch" in Tailwind v4:**

```css
:root             { --brand-500: oklch(0.62 0.19 256); }
[data-theme=dark] { --brand-500: oklch(0.72 0.16 256); }
@theme inline     { --color-brand-500: var(--brand-500); }
@custom-variant dark (&:where([data-theme=dark] *));
```

Plain `@theme` only for values that never change per context.
