# salesforce.md

Verified 2026-08-04 against live docs and by inspecting the shipping npm artifacts.

**Verdict up front: a constrained palette target, not a design target.** Budget for "our brand colors on Salesforce's design system," not "our design system on Salesforce." That's achievable, durable, officially supported, and roughly a day of emitter work.

---

## Status

**SLDS 2** is the design system. **Cosmos** is the first *theme* built on it — the two are not synonyms and are often conflated.

| Release | Event |
|---|---|
| Winter '25 | Beta, as "Enhanced Lightning User Interface" |
| Spring '25 | Renamed SLDS 2 (beta). `lightningdesignsystem.com` now serves SLDS 2; SLDS 1 moved to `v1.lightningdesignsystem.com` |
| **Winter '26** | **GA, all editions** |
| Summer '26 (current) | Dark mode broadened; Themes and Branding UI expanded to typography, shadows, sizing, spacing |
| Winter '27 | Group-based SLDS 2 activation *(roadmap preview, non-binding)* |

**SLDS 1 is not deprecated and has no announced retirement date.** SLDS 2 is default for **new orgs only**; existing orgs opt in via Themes and Branding.

**No SLDS 2 support planned** for: Salesforce mobile app, Flow Builder, Lightning App Builder, Lightning Out, **Experience Cloud**.

**What *is* formally deprecated: SLDS 1 design tokens (`--lwc-*`).** The doc page title literally carries "(Deprecated)" — they still work in SLDS 1 themes but are **not included in SLDS 2 themes**.

npm ships both in parallel — `@salesforce-ux/design-system` dist-tags: `summer-26: 2.30.4`, `winter-27: 2.264.0-beta.3`.

---

## The token architecture

`--sds-*` is dead legacy. Live namespace is `--slds-` with a **tier letter** as the second segment. Counts extracted from `@salesforce-ux/design-tokens@4.1.0`, which `corpus/acquire.sh` pins into `~/design-corpus/slds-tokens` (`fetch_slds_tokens`) and records in `corpus.lock`:

| Tier | Prefix | Count | Status for us |
|---|---|---:|---|
| **Reference** | `--slds-r-*` | **85** | **The only sanctioned override surface** |
| Global | `--slds-g-*` | 524 | Consume only — **overriding is explicitly prohibited** |
| Shared | `--slds-s-*` | 107 | Classified **private**, prohibited |
| Component | `--slds-c-*` | — | Officially unsupported in SLDS 2 |
| Private | `--_slds-*` | — | Prohibited |

Cosmos theme total: **717 tokens** (524 global + 107 shared + 85 reference + 1 config flag), 42 flagged deprecated.

The chain resolves `r → g → s → c`:

```css
--slds-g-color-accent-1: var(--slds-r-color-brand-50);
--slds-g-color-accent-2: light-dark(var(--slds-r-color-brand-40), var(--slds-r-color-brand-70));
```

**This is the leverage point.** Because of that chain, overriding **17 `--slds-r-color-brand-*` steps recolors the entire accent system across every component.** The emitter's whole job for Salesforce is mapping a brand ramp onto ~85 reference tokens.

### Shine's slds voice sheet is derived from this package

`tokens/voices/slds.css` cites these hooks and carries the package's resolved values as
fallbacks. `verify/slds-tokens.test.mjs` asserts every fallback still equals what the pinned
package resolves that hook to, and the doctor runs it.

It has to be checked rather than trusted, because the sheet was previously written from values
read off one rendered org. That org was still on SLDS 1, so every fallback was wrong — a font
family of `"Salesforce Sans"` against SLDS 2's system stack, SLDS 1's `#0176d3` brand blue,
`#ba0517` error, `#2e844a` success — and a measured value is indistinguishable from a correct
one by inspection.

**The trap worth naming: SLDS 2 numbers its text hooks by weight, not by importance.**
`--slds-g-color-on-surface-1` is the *lightest* ink (body copy, placeholders, field labels) and
`--slds-g-color-on-surface-3` is the *darkest* (titles). The old sheet mapped Shine's primary ink
to `on-surface-1` and its muted ink to `on-surface-3` — exactly inverted. Both pairs pass a
contrast check, which is why the test asserts the mapping directly.

The prohibition, verbatim from *New Global Styling Hooks Guidance*:

> "We don't support overriding the values of global styling hooks in your customizations."
> "Re-assigning a new value to a global styling hook inside your component is prohibited. You will be subject to test failures and future breaking changes."

⚠️ Note a genuine contradiction: the token package README documents `--slds-s-*` as a normal public scope, while the guidance page classifies it as private and prohibits consumption. The package emits them; the guidance forbids using them. **Treat the guidance as controlling.**

---

## The token contract is first-class — better than most design systems ship

`@salesforce-ux/design-tokens@4.1.0` (2026-08-08) ships per theme:

- `*.global.tokens.raw.json` — DTCG-faithful (`$value`, `$type`, `$description`, `$extensions`)
- `*.global.tokens.flat.json` — **717 entries, consumer-oriented**
- `*.{global,reference,shared}.tokens.css`
- iOS Swift + Android Kotlin outputs
- `*.deprecated.tokens.raw.json`

Every flat entry carries `name`, `value`, `originalValue`, `type`, `syntax`, `category`, `scope`, `namespace`, `description`, `inherits`, `themeOwned`, `darkValue`, `deprecated`, and **`cssProperties`** — the allowlist of CSS properties the hook is legal on. 628 of 717 are `themeOwned`; 287 carry a distinct `darkValue`.

Built with Style Dictionary v5, with a dedicated `validate:dtcg` compliance check. Dark mode lives in `$extensions["com.salesforce-ux.mode"].dark`.

**OKLCH is authoring-only.** README: *"Palette aliases defined in OKLCH perceptual color space, converted to hex for compatibility."* Grepping the shipped CSS: **zero** `oklch()`, `color-mix()` or P3 — 506 hex literals. Do not hand SLDS an OKLCH value and expect it to work. It does use **`light-dark()`** heavily — 302 occurrences in the Cosmos global file.

**SLDS 2 decouples structure from style.** Confirmed in `@salesforce-ux/design-system-2@2.264.0`: `css/modular/slds2.base.css` (structure, no theme values) ships separately from `css/modular/slds2.theme.cosmos.css` (token values only), so themes swap by changing one `<link href>`.

---

## Override mechanics are unusually permissive

All token declarations sit in:

```css
@layer theme { :where(html) { /* … */ } }
```

`:where()` is zero-specificity **and** layered CSS loses to unlayered author CSS. So any custom property you set wins trivially — **no `!important`, no specificity fights.** That's a real gift and rare.

**Custom properties pierce shadow boundaries** — they're inherited properties, so synthetic vs native shadow doesn't matter here. Synthetic remains the LEX default; native is per-component opt-in via `shadowSupportMode = 'native'`, still Beta, no announced date for flipping the default.

---

## The blunt part: you cannot deliver the overrides

**There is no supported org-wide CSS injection point in internal Lightning Experience.**

- `loadStyle` from `lightning/platformResourceLoader` is **scoped to the calling component**.
- Experience Cloud has a real Custom CSS panel in Experience Builder. **Internal LEX has nothing equivalent.**
- Appending `<style>` to `document.head` from an LWC is undocumented, unsupported, and will break.
- The only sanctioned global path is **Themes and Branding — a human clicking in Setup.**

So the realistic Salesforce output of a token system is **not a stylesheet**. It's:

1. A **brand palette spec** an admin transcribes into Themes and Branding, and
2. **Per-component CSS** for LWCs you own.

If the architecture assumes "emit a file, load it, done," Salesforce breaks that assumption. This is the same tier as the email target — constrained by the renderer, not by the design.

LWC CSS limits: `:host` works; ID selectors, `:host-context()` and `::part` are unsupported; you cannot style a child component's internals — custom properties are the documented cross-boundary mechanism.

---

## What you can and cannot control

**Can:** brand color ramps · typography, spacing, sizing, shadows, radius and illustration color via Summer '26 Themes and Branding · light/dark pairs free through `light-dark()` · full CSS inside LWCs you author.

**Cannot:** layout · spacing rhythm · component structure · iconography · border treatments · the Cosmos circular-motif visual language · anything in Flow Builder, App Builder, mobile or Experience Cloud · any managed-package component.

---

## Tooling

**SLDS Linter** — `@salesforce-ux/slds-linter@1.2.1` (2026-03-05). Plain npm CLI, ESLint-based (migrated off Stylelint), SARIF or CSV output, and integrated into Salesforce Code Analyzer. **Runs headless in CI.**

```bash
npx @salesforce-ux/slds-linter@latest lint
npx @salesforce-ux/slds-linter@latest lint --fix
npx @salesforce-ux/slds-linter@latest report
```

Relevant rules: `no-hardcoded-values-slds2`, `no-slds-var-without-fallback`, `lwc-token-to-slds-hook`, `no-unsupported-hooks-slds2`, `enforce-component-hook-naming-convention`, `no-slds-private-var`, `no-deprecated-classes-slds2`.

**`--fix` is a genuine codemod.** It rewrites `--lwc-*` → `--slds-g-*` keeping the old value as a CSS fallback, wraps hardcoded values as `var(--slds-g-*, <original>)`, fixes BEM syntax, and renames malformed hooks.

⚠️ **But for `no-unsupported-hooks-slds2` the "fix" is deletion** — unsupported `--slds-c-*` hooks are removed, because there is nothing to remap them to. Read the diff before accepting it.

The **SLDS Validator** VS Code extension (v2.0.8) is a separate thing; its SLDS2 rules are beta and off by default.

There is **no product called "SLDS Migration Assistant."** It doesn't exist.

---

## Component hooks: docs are lagging the code

Official line, unchanged since Spring '25: *"Component styling hooks aren't currently supported in SLDS 2… we recommend that you keep your org on SLDS 1 themes for now."* No committed date.

**But the shipping artifact says otherwise.** The `@salesforce-ux/design-system-2` changelog shows active per-component re-opening through 2026 — *"open component hook API on accordion,"* *"open hook API on trees,"* *"open color hook API on tile"* — plus a new Storybook Component Hooks addon and a HookAPI doc block.

Measured in the shipped CSS: of **275 unique `--slds-c-*` names referenced, 90 are now declared**, and **35 of 89 components** have a migrated `themes/cosmos.css` layer. The blanket "not supported" is stale, but there's no roadmap commitment to cite.

---

## Audit the target org before scoping anything

Every org is different, and the inventory decides the plan. Run it first — it is
20 minutes of grep against the metadata repo, and it changes the answer:

| Count | Why it matters |
|---|---|
| LWC components, and how many carry CSS | The real surface area |
| Hex + `rgb()` literals | The migration bill, and the argument for tokens |
| `px`/`rem` literals | Spacing is usually ~100% hardcoded — confirm before promising a scale |
| Hand-authored styling hooks, by tier | `--slds-c-*` is unsupported in SLDS 2; `slds-linter --fix` will **delete** them |
| Global `--slds-g-*` hooks | Overriding these is explicitly prohibited — any count above zero is a finding |
| `loadStyle` usage | The only component-scoped CSS path; none means nothing is themed today |
| Private variable namespaces | Competing conventions for one concept are the real defect, not the count |
| Vendored SLDS static resources | Read the version numbering — a `2.0.x` resource is SLDS **1** |
| Nested projects with their own `sfdx-project.json` | Live or abandoned changes the scope materially |

Two failure shapes worth naming, because both are common and neither surfaces in
a token audit: **a design system delivered through an iframe** — a static-resource
stylesheet an LWC points an iframe at, whose tokens reach nothing outside the
frame — and **an SLDS styling hook fed a hardcoded brand hex**, which is the whole
problem in one line.

---

## The plan for any target

1. **Emit a brand-palette spec**, not a stylesheet — the ~17 `--slds-r-color-brand-*` steps plus the Themes-and-Branding-settable values, as a document an admin transcribes once.
2. **Emit per-component CSS** for LWCs you own, using `var(--slds-g-x, var(--lwc-y, literal))` so it degrades cleanly on SLDS 1 orgs.
3. **Wire `slds-linter` into CI** with SARIF output. This is free, official, and immediately useful regardless of anything else here.
4. **Do not migrate the literals as a project.** Fix them opportunistically as components are touched, starting with hardcoded brand hexes — those are pure duplication of tokens that already exist.
5. **Consume `flat.json` as the authority** for what tokens exist. Do not hand-maintain a mapping table.

## The emitter exists

`tokens/plugins/salesforce.mjs` generates `dist/brand/salesforce.{md,css,json}`
on every `npm run build` — the admin transcription spec, the LWC `:host` fallback
block, and the machine-readable ramp. Authority is `@salesforce-ux/design-tokens`
flat.json. Never hand-maintain a hook mapping; re-diff the spec after upgrading
the package.

---

## Surface ontology — name the host or fail

Palette mapping is necessary and **not sufficient**. Lightning is a family of hosts
with different density, CSS, and owned chrome. Cite `lex-*` packs, not a SaaS dashboard.

| Host | Catalog | Density | Notes |
|---|---|---|---|
| LEX standard | `lex-record`, `lex-record-narrow` | compact | Record home = highlights (≤4 fields) + Path + Dynamic Forms + related as tabs + activity. Component width is often **~494px**. `@container` on `:host`, never `@media` for that width. |
| LEX console | `lex-console` | compact | Utility bar is one job, keyboard, no page. Do not paint a second sidebar. |
| LEX list | `lex-queue` | dense | `lightning-datatable` contracts; **unsupported on Salesforce mobile**. |
| LWR / Experience | `lex-lwr` | editorial | SLDS 2 unsupported on Experience Cloud. Behance-legal only here, not on LEX. |
| Email | `lex-email` | 600px tables | `tokens/dist/*/email.*`. |
| Mobile / Mini | `lex-mobile` | compact | No datatable. Separate page. |

**Belong first.** Clone GridBuddy-shaped density, then one owned empty state or utility-bar command. Do not Linear-ize an LWC.

**Walk `shadowRoot`.** A probe that reports 0/0 is broken. `getComputedStyle` empty string on a `--slds-*` hook is a finding — write the fallback. Custom datatable cells: `data-navigation="enable"` all the way down.

**Stale bundles** cache CSS. After token emit, hard-refresh / bump static resource, not “it looks like the old theme.”

**slds-linter** in `doctor --full` for LEX consumers when `slds-linter` is on PATH. Do not invent a second linter.
