# Techniques — transfer from measured products

`taste.md` Part 1 is the measurement SSOT. This file is the **transfer** layer: symptom →
named technique → how to apply under shine tokens → how to verify.

Every material craft fix should cite a row here (or a kit recipe in `kits.md`). Do not
collapse these back into anonymous thresholds in the report.

Sources: production CSS inventories in `taste.md` (Linear, Vercel/Geist, Notion, Stripe,
Clerk, Liveblocks, Raycast, Superhuman, Things, and the wider set).

---

## Hierarchy & density

| Symptom | Technique | Source | Apply under shine | Verify |
|---|---|---|---|---|
| Everything same weight; no obvious next action | **One filled primary per view**; peers are ghost/outline | Linear app chrome; foundations Hierarchy | `bg-primary text-primary-fg` once; secondary `variant=outline` / muted | `measure` filledCount = 1 (or 0 only if no controls) |
| 14px and 15px both used heavily | **Two-ratio type scale** — drop one step; UI band ~1.12 | Linear scale 10…72 with clear steps | Use only `--shine-text-*` steps; never invent 14+15 | type-step collision hard-fail gone |
| Dense UI feels cramped via leading | **Cut padding, never leading** below floor | Linear / taste rule 8 | Keep `--shine-leading-*`; reduce gap/padding tokens | leading ≥1.33 @12 / ≥1.40 @14–15 |
| Page feels sparse / hobby | **Instrumental density** — 8 intra, 16 group, coarse section gaps | Linear product density | 4px scale; avoid one gap value for >80% of gaps | composition notes; visual census |
| Prose line too long | **Role-based measure** — prose ~624px / 45–75ch | Linear prose 624px | `max-w-prose` / `65ch` on reading columns | measure width in ch |

## Type

| Symptom | Technique | Source | Apply under shine | Verify |
|---|---|---|---|---|
| Display type looks default / AI | **Tracking = f(size, weight)**; negative by 20–24px | Notion tracking curve; Linear −0.022 @32+ | `tracking-*` paired to `text-*`; regular more negative than bold | computed letter-spacing ≠ 0 at ≥24px |
| Vertical rhythm uneven | **Line-height as spacing tokens** (snap to 4px grid) | Notion `--font-line-height-*` → spacing | Prefer shine leading tokens that land on 4px | padding+line boxes on grid |
| Weights look like Google defaults | **Non-round variable instances** 510/590/680 | Linear Inter Variable | Where face supports, use 510–590 for UI medium | font-weight not only 400/700 |
| Numerics dance in columns | **`tabular-nums` + mono for metrics** | House style; Linear Berkeley Mono for nums | `font-variant-numeric: tabular-nums`; mono token on KPI | every numeric column |
| Headings wrap ugly | **`text-wrap: balance` / `pretty`** | Rule 10 / taste 39 | headings balance; body pretty | computed text-wrap |

## Color & surface

| Symptom | Technique | Source | Apply under shine | Verify |
|---|---|---|---|---|
| AI purple / loud accent | **Accent chroma OKLCH 0.13–0.24 @ L55–65** | Entire measured set vs Tailwind −600 | shine accent tokens only; fill chroma ≤0.08 on large areas | chroma gate / contrast-gate |
| Card stack of different greys | **Adjacent surfaces ΔL ≈2pp**; borders separate | Linear dark ramp +2.0–2.7pp | `surface` / `surface-2` with hairline border, not fill jumps | ΔL 1.6–4pp |
| Dead dark greys | **Saturation rises as lightness falls** in tinted ramps | Raycast | personal lane OKLCH cast toward accent | ramp inspection |
| Palette won't stay related | **Derive with `color-mix` / OKLCH formulas** | Clerk 1,193× `color-mix` | tokens from `gen-source.mjs`, not hand hex | no raw hex in UI |
| Neutrals fight the accent | **Hue-monotone greys OR chroma-0** — pick one | Vercel chroma-0 vs Linear hue-210 | house: slight cast toward accent | taste rule 1 |
| Dark mode #000 void | **Brand-tinted black + raised surfaces** | Superhuman; taste 78 | never `#000` body; elevate panels | dark screenshot |

## Depth & shape

| Symptom | Technique | Source | Apply under shine | Verify |
|---|---|---|---|---|
| Mushy floating cards | **Composite elevation**: hairline + blur layers + bg ring | Vercel/Geist | `--shine-shadow-sm\|md\|lg` only | no hand-rolled box-shadow |
| Tailwind `shadow-lg` look | **Top-layer alpha ≤6% light; ≥2 layers; −spread on blur≥8** | Vercel ladder; taste 17–20 | same tokens | lint blocks raw shadow |
| Nested radius looks wrong | **`child = parent − padding`** (`calc`) | Stripe, Liveblocks | `rounded-[calc(var(--radius)-theme(spacing…))]` or token nest | visual corner parallel |
| One radius everywhere | **Radius scales with element size** | Linear 4…32 ladder | controls 4–6, cards 10–12, sheets 16–20 | taste 15 |
| Radius ignores type size | **`em`-based radii** on text-tied chips | Things 3 | rare; prefer token ladder unless chip scales with type | — |
| Dark shadows invisible | **Dark: ~4× alpha + 1px top inner highlight** | Vercel dark | theme tokens already; don't reuse light shadow | dark mode measure |

## Motion

| Symptom | Technique | Source | Apply under shine | Verify |
|---|---|---|---|---|
| Sluggish or flashy UI | **150ms mode**; micro 100–150; overlays 200–300; exit −20% | Linear + set mode | `--shine-duration-*` | no >300ms hover |
| Janky transitions | **Never `transition: all`**; transform/opacity only | taste 45–46 | name properties | lint / review |
| Dialog pops from nothing | **Enter from scale ~0.8–0.95, not 0** | taste 29 | motion tokens | — |
| Reduced-motion ignored | **`prefers-reduced-motion` blocks** | Stripe 68× | motion.md recipe | media query present |

## Theme & platform

| Symptom | Technique | Source | Apply under shine | Verify |
|---|---|---|---|---|
| Native controls wrong in dark | **`color-scheme` on `<html>`** | Superhuman `light-dark()`; taste 82 | `color-scheme: dark` / light | measure theme hard-fail |
| Theme doesn't switch | **Semantic tokens via `@theme inline`** | SKILL non-negotiable 3 | `bg-surface` not raw palette utils | light≠dark bodyBg |
| Overlay on unknown bg | **Alpha ramp parallel to solid greys** | Vercel alpha 4%…91% | overlay tokens | — |

## Interaction hygiene

| Symptom | Technique | Source | Apply under shine | Verify |
|---|---|---|---|---|
| Focus ring squares off | **`focus-visible` + outline-offset** (outline follows radius) | Vercel focus double-ring | foundations focus tokens | axe + visual |
| Tap targets tiny | **`--min-tap-size: 44px`** | Linear | min 40px compose note; 44 mobile | compose smalls |
| z-index chaos | **Explicit z-index ladder** | Linear 17-step | foundations z tokens | no 9999 |

---

## How to cite in a report

```
Fix: collapsed 14/15px → text-sm/text-base (Linear two-ratio scale; techniques.md §Type).
Before: 14px×42, 15px×38, ratio 1.071. After: 14px×80 — collision fail cleared.
```

Thresholds without a product or kit name are incomplete.
