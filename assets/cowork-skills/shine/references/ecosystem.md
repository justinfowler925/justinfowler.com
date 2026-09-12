# ecosystem.md

What exists, what's maintained, what's safe to build on. Verified 2026-08-04.

---

## License status — the section that matters

Harvesting into a registry you publish is **redistribution**. Using something in your own app is not. Several of the most popular kits are widely assumed MIT and are not.

| Source | Actual position |
|---|---|
| **Aceternity UI** | **No license at all.** No public repo, no LICENSE file. `/licence` covers Pro only and is proprietary; `/terms` claims ownership of all material and prohibits republishing. Secondary blogs claiming "the free tier is MIT" are unsourced. The risk is the *absence* of a grant. |
| **React Bits** (44.8k★), **Animate UI** | **MIT + Commons Clause** — verbatim: *"so long as you do not sell, sublicense, or redistribute the components themselves — whether alone, in a bundle, or as a ported version."* Using them in a product is fine; harvesting them is a direct violation. |
| **Origin UI** | Gone. Transferred to `cosscom/coss` (Cal.com) and relicensed **AGPL-3.0**, with `apps/ui/` and `apps/origin/` carved out MIT. Components safe, surrounding monorepo not. |
| **ReUI** | Repo MIT, but the **hosted registry is freemium** — some items return 401 "Provide your license key." |
| **Skiper UI** | No license statement; $129/$549 tiers. |
| **GSAP** | Free for commercial use, but **not OSI**. No forking, no redistribution, bars competing visual-animation tools. |
| **Cosmograph** | **CC-BY-NC-4.0 — non-commercial.** Disqualifying for client work. The underlying engine `cosmograph-org/cosmos` is MIT; use that or Sigma.js. |
| **OpenStatus** | AGPL-3.0. |
| **`tailwindlabs/tailwindcss.com`** | No license file, 964 MB. Skip. |
| **Apple HIG** | Copyrighted, no grant. Read, never copy. |

**Clean to harvest (MIT/Apache/ISC):** shadcn/ui, Radix, Base UI, Ark, React Aria, D3, Recharts, visx, nivo, Observable Plot, Magic UI, Motion Primitives, Kibo, cult/ui, Kokonut, Eldora, Fancy Components, Intent UI, Dice UI, Plate, assistant-ui, prompt-kit, Neobrutalism, 8bitcn, SVGL, Tremor (Apache-2.0).

---

## The shadcn registry ecosystem

`https://ui.shadcn.com/r/registries.json` lists **504 built-in registry namespaces** — installable as `npx shadcn add @namespace/component` with zero config. Browse at registry.directory.

**shadcn now supports three first-class primitive bases.** Base UI became the **default on 2026-07-03**; React Aria was added the same month.

```bash
npx shadcn@latest init --base base    # @base-ui/react 1.7.0 — default
npx shadcn@latest init --base radix   # radix-ui 1.4.3
npx shadcn@latest init --base aria    # react-aria-components 1.20.0
```

⚠️ **Package rename:** `@base-ui-components/react` is deprecated and pinned at `1.0.0-rc.0`. The live package is **`@base-ui/react`**.

**"Radix is dying" is false** — 95 commits in 30 days, published July 2026, WorkOS-owned. Slower than Base UI, actively maintained.

**Strongest foundation:** Base UI, for most cases — built by the original Radix authors, WAI-ARIA conformant, and what shadcn and Cal.com now build on. **React Aria is the accessibility ceiling** — 50+ components, 30+ translations, 13 calendar systems, RTL, and explicit normalisation of assistive-tech differences. Choose it when WCAG conformance is contractual.

**Notable third-party registries, all MIT:** Magic UI (247 items), Motion Primitives (~110), Kibo UI (41 — Gantt, Kanban, Dropzone, Editor), cult/ui, Kokonut (40), Eldora (115), Fancy Components (158), Intent UI (570, React Aria-based), Dice UI.

**First-party vendor registries are the real trend** — Supabase UI (60), Vercel AI Elements (136), LiveKit `@agents-ui` (17), plus Clerk, Auth0, Algolia, Paddle, Neon.

**AI-UI specific and directly relevant:** `assistant-ui` (11.4k★ MIT), `prompt-kit` (MIT), `Plate` (16.5k★ MIT, rich text). shadcn itself now ships AI chat primitives — `attachment`, `bubble`, `marker`, `message`, `message-scroller` — undocumented in the main nav, only visible in `/r/index.json`.

**21st.dev** — 12,000+ components, 700+ authors, unified MCP via `npx @21st-dev/cli@latest init --client claude`. ⚠️ Per-author licensing is undocumented; treat as unlicensed for redistribution.

### The highest-leverage find

**shadcn ships its own MIT-licensed Agent Skill** at `github.com/shadcn-ui/ui/skills/shadcn/` — `SKILL.md` plus `rules/{styling,forms,composition,icons,chat,base-vs-radix}.md`, all written as Incorrect/Correct code pairs. Enforced rules include: no `space-x-*`, use `flex gap-*`; `size-*` over `w-`/`h-` when equal; no manual `dark:` overrides; no manual z-index on overlays; forms use `FieldGroup` + `Field`.

Directly adoptable, correctly licensed, and exactly the shape this project is building toward. There's also a `migrate-radix-to-base` skill.

---

## Charting — maintenance reality

| Library | Latest | Released | State |
|---|---|---|---|
| visx | 4.0.0 | 2026-06-11 | Modernisation release — **zero new packages**. One Airbnb engineer wrote 56 of the last 100 commits, then 43 days silent. `@visx/theme`, `@visx/a11y`, `@visx/kernel` are versioned in the monorepo but **were never published to npm**. |
| nivo | 0.99.0 | 2025-05-23 | 24 unreleased commits. No `next`/`beta` dist-tag. Fixes land, never ship. |
| D3 | 7.9.0 | 2024-03-12 | Frozen because finished — it's math. `@types/d3` is **33 months stale**, which costs more day to day than the runtime. |
| Observable Plot | 0.6.17 | 2025-02-14 | 42 unreleased commits. **A merge-clean 0.6.18 PR has sat untouched since 2026-04-13 with the changelog already written.** No milestones; the 1.0 tracking issue is 23 months stale. Meanwhile downloads grew **7.4× in 12 months**. Observable's engineering has moved to notebook-kit, which doesn't depend on Plot. |
| **Recharts** | 3.10.1 | 2026-07-25 | **55M downloads/week** (~100× visx), commits landing daily, React 19 supported, **and it's what shadcn's charts wrap**. |

**visx and nivo occupy the same slot.** Owning both buys two theming systems and two bundles.

**Decision: D3 (math + SSR) + Recharts (React). Hold visx for genuinely custom work.** Vendor all of them for reference — vendoring is not depending.

### Theming capability, ranked
**nivo** (a real, complete theme object with deep-merge) > **visx-xychart** (narrow theme, and only for `xychart` — the primitives have none) > **Plot** (CSS-first, no theme API; `--plot-background` is its only custom property and is **undocumented but load-bearing — override it or tips render white-on-white in dark mode**) > **D3** (nothing; build it yourself).

### Bundle, min+gzip
`d3-selection` 4.0 · `d3-shape` 5.5 · `@visx/shape` 10.5 · `d3-scale` 15.6 · `@visx/xychart` 48.8 · `@nivo/bar` 78.1 · `@nivo/line` 90.2 · `d3` full 89.8 · `@observablehq/plot` **125.0**

Plot depends on the **monolithic `d3` meta-package**, and `d3-geo` (84 KB) plus `d3-scale-chromatic` (49 KB) are unavoidable even for a bar chart. But 125 KB is a **flat fee** — best amortisation for a dashboard with many chart types. nivo is the worst case there: five chart families is realistically 250–400 KB.

### Server-side rendering
**D3's pure-math modules are the strongest path** — no DOM, no jsdom, deterministic, ~21 KB. `d3-scale` computes, `d3-shape` emits a path string, you template the SVG.

**Plot is second** and has a documented `document` option. Two traps: it returns a `<figure>` rather than an `<svg>` the moment you add a title, caption or **any legend** — use `figure: false`. And raster marks plus **continuous (ramp) color legends** both need `npm i canvas` or they throw.

Plot **never measures text** — it uses a static width table — so Node output is byte-identical to the browser. Genuinely deterministic, but equally approximate everywhere: change to a wide brand font and wrapping math is wrong in *both* environments.

**Nothing here converts SVG to PNG.** That's `@resvg/resvg-js` or `sharp`, and you must load fonts explicitly — the most common cause of wrong-looking server-rendered charts.

### What's missing from the four
- **Dense time-series** — all four are SVG-first and die at 10–20k nodes. **uPlot** (21 KB, zero deps, 100k+ points) or **Lightweight Charts** (Apache-2.0, real financial semantics from TradingView).
- **Graph/network at scale** — **Sigma.js** (MIT) with graphology.
- **Geospatial at scale** — **deck.gl**.
- **Plot ergonomics over huge data** — **Mosaic / `@uwdata/vgplot`**, a Plot-like API backed by DuckDB with linked cross-filtering. The most actively developed thing in the Observable orbit.
- **Declarative JSON charts** — **Vega-Lite**, when a config file or an LLM needs to emit a valid spec without writing code.
- ⚠️ **Tremor** — do not adopt as a dependency. Last npm release 2025-01, repo last pushed 2025-10; they pivoted to the copy-paste model. The package is a dead end.

---

## Full-fat libraries worth mining

| Library | Better than shadcn at |
|---|---|
| **Mantine** 9.5.1 | Spotlight, notification system, rich hooks, real date/time pickers |
| **Chakra v3** 3.36.1 | Recipe/slot theming — the token system is genuinely better designed |
| **Fluent 2** 9.74.5 | Enterprise density, virtualisation, rigorous flat token set |

⚠️ **Shopify Polaris React is deprecated** — repo description says so, replaced by Polaris Web Components Oct 2025, no npm publish since 2025-03. Note the name trap: `Shopify/polaris` and `Shopify/polaris-react` are the same repo, and its active push date reflects the tokens monorepo, not React maintenance.

---

## Design systems ranked by density of actionable numeric rules

The numbers live in **token repos, not prose pages** — most doc sites are unfetchable SPAs.

| Rank | System | Tokens | License |
|---|---|---|---|
| 1 | **GitHub Primer** | `@primer/primitives` | **MIT** |
| 2 | **Adobe Spectrum 2** | `adobe/spectrum-design-data` | Apache-2.0 |
| 3 | **Fluent 2** | `@fluentui/tokens` | MIT |
| 4 | **Atlassian** | `@atlaskit/tokens` | ⚠️ Apache npm, restrictive docs site |
| 5 | **USWDS** | `@uswds/uswds` | **CC0 — public domain** |
| — | **Apple HIG** | none | ⚠️ Copyrighted, no grant |

**Two verified highlights.**

**Primer ships rules written for an LLM** — `$extensions["org.primer.llm"]`, with explicit negatives:
> `control.minTarget.auto` → *"Use as minimum size for interactive elements on desktop/mouse interfaces… **Do NOT use for touch/mobile contexts.**"*

Steal its `size-fine` / `size-coarse` split — pointer type as a first-class token dimension.

**Extraction order: Primer → Spectrum → Fluent → USWDS.** That is ~90% of a rigorous
numeric corpus with zero licensing ambiguity, and every one of them is a *token*
source rather than a component runtime — which is the distinction that decided the
2026-08-31 deletion. A published duration scale costs nothing to adopt; a component
library costs its whole runtime.

---

## shadcn platform notes

- **CLI 4.16.1.** Tailwind v4 is the default; set `tailwind.config: ""`. `@import "shadcn/tailwind.css"` is new — `shadcn` is now a *runtime* dependency shipping shared variants. `npx shadcn eject` inlines it, irreversibly.
- **The radius scale is derived, not enumerated** — one `--radius` drives seven steps. Good precedent.
- **Base colors:** neutral, stone, zinc, plus new mauve, olive, mist, taupe. `baseColor` and `cssVariables` are **immutable after init**.
- **8 named styles** (Vega, Nova, Maia, Lyra, Mira, Luma, Sera, Rhea) swap radii, heights, borders, shadows and focus rings via one variable mode.
- **Presets** are bit-packed base62 codes capturing an entire design language: `npx shadcn@latest apply a2r6bw`, `--only theme`, `preset decode`. Parallel mechanism to registries — presets are a fixed enum you *select* from; `registry:base` is open-ended. For owning a design language, `registry:base` is the right substrate.
- **62 `registry:ui` items, 27 installable blocks.** `toast` is deprecated in favour of `sonner` and 404s.
- **Migrations available:** `migrate radix` (to the unified package), `migrate icons --from lucide --to phosphor`, `migrate rtl` (physical → logical properties).
