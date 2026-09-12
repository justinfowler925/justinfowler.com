# shadcn marketing page

Regions, in order. Host: standalone page, no app shell. Density: comfortable. Paint: `tokens/voices/shadcn-zinc.css`.

shadcn is an application kit. It ships no marketing block, no hero, and no pricing table, and that is a deliberate boundary rather than a gap in the corpus — all 97 shadcn blocks are one dashboard, sixteen sidebars, ten auth pages and seventy charts. Since MUI was deleted on 2026-08-31 (`docs/no-foreign-runtimes.md`), the corpus's other marketing row is `magicui-hero`, for the hero alone. Its region graph ports; its source does not.

Region map only: no authored source ships for this row. The estate builds marketing *analytics* (screen `dashboard`, well covered by shadcn), not marketing *pages*, so authored TSX here would be untested reference code.

1. **Hero** — one claim, one supporting sentence, one primary action. The claim is the most specific true thing about the product, not a category name; if the headline would fit a competitor unchanged, it is not a headline. One filled `Button`; a secondary action is a `ghost` link beside it, never a second filled button.
2. **Proof** — the evidence for the claim, immediately after it: named customers, a measured number with its source, or a screenshot of the actual product. Anonymous logos and unattributed numbers read as decoration and are skipped.
3. **How it works** — three or four steps, numbered *only* if the order is real. This is where generic pages default to `01 / 02 / 03` over content that is not a sequence; if the items are parallel capabilities, they are a grid with no numbers.
4. **Capabilities** — a grid of what the product does, each with a verb-first heading. Icons are optional and decorative; if an icon carries meaning it needs a text label too.
5. **Pricing** (when the page sells) — tiers as `Card`s, the recommended tier marked with a `Badge` and a border rather than a scale transform, every tier's price visible without a toggle, and the feature list identical in order across tiers so the columns compare.
6. **Close** — restate the claim and repeat the hero's action. The reader who scrolled this far should not have to scroll back.

## Host facts the region map cannot show

- This page is measured on time-to-first-contentful-paint, so the hero must not depend on a client-side data fetch or a webfont swap. Inline the hero's critical CSS and give every face a real fallback stack.
- One `h1`, in the hero. Section headings are `h2`. A page with four `h1`s has no hierarchy for a screen reader or a crawler.
- `prefers-reduced-motion` must disable scroll-triggered reveals entirely, not shorten them — a reveal that still moves is still motion.
- Marketing pages are the most common place for an accent that fails contrast on its own ground. Validate the accent against the surface it sits on, both themes, before shipping.

## Do not

- Copy MagicUI source. Port the regions; it carries its own runtime.
- A hero headline that would fit any competitor unchanged.
- Numbered markers over content that is not a sequence.
- Two filled buttons in the hero.
- Anonymous logo strips or numbers with no attribution.
- A pricing table whose prices require a toggle to reveal.
- Motion that ignores `prefers-reduced-motion`.

## Checklist (agent)

- One `h1`, one primary action, and the claim is specific to this product.
- Proof sits directly under the claim and is attributed.
- Numbering appears only where order is information.
- Every tier's price is visible at rest and the feature order matches across tiers.
- Accent validated against both grounds; reduced-motion honoured.
- `data-cite="shadcn-marketing"` on the artifact.
- Prove with `verify/measure.mjs`, then `verify/usability.mjs` with a contract that exercises the primary action, then `verify/compare.mjs`.

## Source of truth

- The regions above are the structure. They are not optional.
- `magicui-hero`'s shot is the structural pixel reference for the hero region only; its source is not to be copied.
- Paint comes from `tokens/voices/shadcn-zinc.css`.
- No authored source and no pack shot ship for this row, so `verify/compare.mjs` has nothing to compare against. Say so rather than reporting a likeness score.
- For a marketing *analytics* surface, this is the wrong row: cite a `dashboard` row instead.
