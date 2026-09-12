# Corpus — real library source on disk

**Never invent an API.** Before writing a prop, option, or import against any library
below, confirm it in the corpus. `rg` answers "what props does `<XAxis>` take" in
milliseconds with file:line and zero staleness. If the corpus contradicts your memory,
the corpus wins — it is pinned upstream source.

Kits are also the substrate for **technique transfer** — see `kits.md`. Query for
patterns and completeness, not just prop names. Shine tokens stay the visual system;
vendor kits inform behavior and structure.

## Where it lives

- Laptop: `~/design-corpus`
- Any other machine that runs `corpus/acquire.sh` can hold a copy

Refresh or first-time acquire: `corpus/acquire.sh ~/design-corpus` in the shine repo.
Pin back to the committed state: `corpus/acquire.sh --restore ~/design-corpus`
(reads `corpus.lock` — the repo's copy at `corpus/corpus.lock` is the canonical pin).
~1.2 GB total after the 2026-08-12 AdminLTE-list expansion, sparse-cloned to value dirs only.

## Query patterns

```bash
# prop/option signatures — go straight to the type
rg -n "interface XAxisProps" ~/design-corpus/recharts/src
rg -n "export (type|interface) \w*Props" ~/design-corpus/base-ui/packages/react/src/menu

# what does shadcn's own implementation look like (JSON items embed full source)
python3 -c "import json;print(json.load(open('$HOME/design-corpus/shadcn-registry/items/button.json'))['files'][0]['content'])"

# find a usage example, not just the definition
rg -ln "useVirtualizer" ~/design-corpus/tanstack-virtual/examples

# docs (markdown, greppable)
rg -n "sideOffset" ~/design-corpus/radix-website/data

# vendor design systems — behavior / completeness, not brand pixels
rg -n "Table" ~/design-corpus/untitled-ui-react/components/application/table --glob '*.tsx' | head
rg -n "useDialog" ~/design-corpus/react-spectrum/packages/@react-aria
rg -n "aria-practices" ~/design-corpus/aria-practices/content -l | head
rg -n "IndexTable" ~/design-corpus/polaris/polaris-react/src/components
```

## Directory map

| Dir | What it is | Look here for |
|---|---|---|
| `shadcn-registry/` | 411 items as JSON, source inline in `files[].content` | canonical component implementations |
| `shadcn-docs/` | `apps/v4/content` (305 mdx) + registry source | registry schema, per-component docs |
| `recharts/` | src + storybook + doc data | chart props (55M/wk downloads; what shadcn charts wrap) |
| `d3/`, `d3-*/` | docs + src, 10 modules | scales, shapes, math — SSR/static rendering |
| `visx/` | all packages + demo gallery | custom chart work |
| `nivo/` | packages + component prop data | comparison only — 14mo unreleased |
| `observable-plot/` | docs + src | grammar-of-graphics reference |
| `radix-primitives/` | package source (its .md are changesets, not docs) | primitive internals |
| `radix-website/` | `data/` — 137 mdx, **the real Radix docs** | primitive APIs, a11y behavior |
| `base-ui/` | react src + docs — shadcn's default base since 2026-07 | headless component APIs |
| `ark/` | react src + website content | alternative headless set |
| `tanstack-table/`, `tanstack-virtual/` | packages + docs + examples | table/virtualizer APIs (pin table ^8.21.3 — v9 breaks everything) |
| `motion/` | framer-motion/motion/motion-dom src (user docs are site-only) | animation APIs |
| `motion-primitives/` | components + docs | ready-made motion patterns |
| `lucide/` | icons + 182 md | icon names, aliases |
| `phosphor-core/` | assets + icon manifest | second icon set |
| `radix-colors/` | 5 src files | scale construction reference |
| `tailwindcss/` | `packages/tailwindcss` — `theme.css`, `preflight.css`, src | default token values, v4 internals |
| `magicui/`, `cult-ui/` | registry + content (MIT-clean) | marketing-grade components |
| `react-spectrum/` | Adobe React Aria / Spectrum / Stately + docs | interaction/a11y SSOT beside Radix |
| `fluentui/` | Fluent UI `react-components` | Fluent patterns without cloning the world |
| `aria-practices/` | W3C ARIA Authoring Practices `content/` | APG patterns as greppable truth |
| `polaris/` | Shopify Polaris react + tokens + documentation | admin/settings grammar (**query only** — see license) |
| `mantine/` | Mantine core + docs | hooks, components, templates |
| `chakra-ui/` | Chakra v3 react + compositions | prop API, composition recipes |
| `heroui/` | HeroUI (ex-NextUI) react + styles + docs | Tailwind + React Aria styled kit |
| `heroui-next-app/` | HeroUI Next.js app template | full app shell |
| `headlessui/` | Tailwind Headless UI React | unstyled Menu/Listbox/Dialog |
| `tremor/` | Tremor dashboard components | KPI blocks, charts |
| `blueprint/` | Palantir Blueprint core/table/select | dense desktop chrome |
| `park-ui/` | Park UI (Ark + Panda) | styled Ark alternative |
| `rsuite/` | React Suite | enterprise table/date pickers |
| `grommet/` | HPE Grommet | a11y-first layout |
| `query-only/` | Playwright screenshots of paid stores | layout ideas; **no source copy** |

**Not in the corpus, deliberately:** MUI, Ant Design, Ant Design Pro and IBM
Carbon were deleted on 2026-08-31 (`docs/no-foreign-runtimes.md`). They are not
cloned, not catalogued, not painted and not cited. If a brief asks for one of
them by name, say that Shine does not carry it and cite the row that covers the
screen instead.

## Not in the corpus — protocol

- **Apple HIG** — no SPDX-clean full source tree. WebFetch
  `https://developer.apple.com/design/human-interface-guidelines/` when the surface is
  native/macOS/iOS-shaped. Cite URL + principle; never invent UIKit/SwiftUI APIs from memory.

## Rules

- **Start from a catalog template**, not from memory. `templates.md` /
  `corpus/templates.json` — catalog cite required before Build. Run `corpus/cite.mjs` and open the files; naming an id is not a cite.
- **Query with `rg`/Read/Glob, never from memory.** Exact symbol lookups, file:line cites.
- **Vendoring is not depending.** Depend on D3 + Recharts for charts; visx is vendored
  for custom work only. Check `references/ecosystem.md` before adding any dependency.
- **License:** corpus pins are MIT/ISC/Apache-2.0, plus W3C Software and Document License
  (APG). **Polaris** is MIT with Shopify-integration and visual-distinctness restrictions —
  query for patterns; do not harvest into a published registry. Aceternity, React Bits,
  Animate UI, Origin UI (AGPL), GSAP, and tailwindcss.com are excluded — do not fetch them
  from the web either. Using ≠ redistributing.
- **Staleness:** `corpus.lock` records the SHA of every repo at last refresh. If a
  library shipped something newer than the lock date, refresh the corpus rather than
  trusting web memory.
