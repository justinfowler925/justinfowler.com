# Direction — art direction before code

Load this after the catalog cite, **before** writing CSS. Lanes: `internal` / `saas` /
`lex` / `marketing`. Marketing gets a signature. LEX usually gets **none — belong**.

A plan that would be emitted for any similar brief is not a plan. Revise it.

## Lanes

| Lane | Quality bar | Banned |
|---|---|---|
| **internal** | Adoption + contracts + density. Would they open it Monday? | Marketing theater, WebGL, custom cursors |
| **saas** | Type as identity, one accent, empty as brand, keyboard spatial | Three equal KPI cards as the page; Inter-on-zinc; purple glow |
| **lex** | Belong in Cosmos, then one owned moment | Cloning Linear/IBM chrome; org-wide CSS; `@media` for component width |
| **marketing** | One signature + Awwwards-shaped score (design 40 / usability 30 / creativity 20 / content 10) | App-shell + KPI soup; unearned GSAP |

Anti-patterns are **lane-relative**. Glow is a marketing DNA option and a saas/lex fail.

## Two-pass plan (write `DESIGN.md`)

1. **Ground the subject.** One concrete subject, audience, single job of the page.
2. **Match.** `node corpus/cite.mjs "<job + lane + audience + density + information shape + brand + interaction + tone + type + image + framework>"` — read the normalized axes, harvested shots, explained exclusions/gaps and extracted source before drawing. Candidates must differ by at least three semantic axes. Never shuffle. Project history is only the final tie-break among equal eligibility scores.
3. **Token plan.** 4–6 named roles from the voice sheet / kit tokens or brand pack — declared as custom properties, never invented hex at usage sites.
4. **Type.** Display / body / data pairing from the kit. LEX: Salesforce Sans only.
5. **Layout.** ASCII regions cloned from the template's source.
6. **Signature.** One sentence. Marketing required. LEX: empty state, Path, or utility-bar command — not a custom nav.
7. **Uniqueness pass.** Replay a similar brief in your head. A plan that would be emitted for any similar brief is not a plan — find the axis this brief actually pins.
8. **Chanel.** Remove one accessory. Spend boldness in one place.

Then build. Do not invent a second DESIGN.md. Unlock structure to change regions.

## Defaults are hypotheses, not choices

Cream+serif+terracotta, OLED+acid-green, broadsheet hairlines, and indigo-on-zinc are
the four looks a model reaches for unprompted. Any of them can be right **when the brief
pins it**; reaching for one because the axis was free is not a decision. The real
anti-slop mechanism is the template: match a real screen and follow its DNA.
The retrieval layer also refuses bento, glassmorphism, gradient, neon and purple as
unstated defaults. Naming one in the brief makes it an explicit demand, not a random
style lottery. If the requested axis is absent, report the catalog gap instead of
quietly substituting the nearest generic SaaS look.

## Modes (Impeccable)

**Persuade** (marketing) · **Operate** (saas / lex / internal queues) · **Read** (docs, briefs) · **Experience** (voice, artifact). Operate is density and scan. Persuade is art direction. Do not run the marketing pipeline on a Lightning record page.

## After first paint

1. `node verify/measure.mjs <path> --shot out.png --cite <id>`
2. `node verify/compare.mjs <path> --cite <id> --brief <brief-id> --lane <lane>` when the template has a harvested shot — read the composite and structural/visual facts; if the two sides don't read as relatives, fix the match or the paint. SaaS/marketing mark one visible owned moment with `data-shine-signature`; cross-brief structural clones fail. LEX and explicit brand-locked adaptations belong instead of performing originality and use `--brand-locked`.

Banned report language: "tighten spacing", "more modern", "shine-paint".
