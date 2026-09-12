# shadcn editorial / article page

Regions, in order. Host: standalone page, no app shell. Density: comfortable. Paint: `tokens/voices/shadcn-zinc.css`.

This row exists because deleting MUI deleted the only blog row in the catalog, and a screen with no row is a catalog hole — the condition `references/diagnose.md` rates Critical, because it is the condition under which an agent invents a page. An editorial column is the one screen where that loss costs least: it is measure, rhythm and one figure class, not kit chrome. There is nothing Material-specific about a paragraph.

Region map only: no authored source ships for this row. shadcn publishes no editorial block, and the estate does not build blogs, so authored TSX here would be untested reference code.

1. **Masthead** — the publication's identity, not the article's. One line. If the page lives inside a product site, this is the site header, not a second one.
2. **Title block** — `h1`, one deck sentence, then byline and date on one line in the small text style. The deck is the sentence a reader decides on; it is not the first paragraph moved up.
3. **Lede figure** (optional) — full measure or full bleed, never in between. If it carries no information, cut it rather than shrinking it.
4. **Body column** — a single column at 60–75 characters. This is the whole design. Paragraph rhythm comes from one spacing step, headings from one scale step, and nothing else competes with the text.
5. **Figures and pull quotes** — one visual class per article. A page that mixes screenshots, diagrams, pull quotes and code blocks at four different widths reads as a template, not a piece of writing.
6. **Footer** — the next thing to read, and the author's one line. A subscribe block is one field and one button, never a modal.

## Host facts the region map cannot show

- Measure is the contract: 60–75 characters at the base size, enforced with `max-inline-size: 65ch` on the column rather than a pixel width, so it survives a type-scale change.
- Line height rises with measure and falls with size: body 1.6–1.7, headings 1.1–1.25. A heading at body line height is the most common tell of a generated article page.
- One h1. Sub-heads are h2 and must be readable as an outline on their own.
- Code blocks and tables are the only elements allowed to exceed the measure, and they scroll inside their own container — the page body never scrolls horizontally.
- Dark mode must not invert the figure ground. Give images an explicit surface token behind them so a transparent PNG does not float.

## Do not

- Justify the body text, or letterspace it.
- Two competing accent colours in running text — links are the accent, and that is the budget.
- A hero image chosen for decoration. If it does not carry information, the space belongs to the text.
- Serif display type over sans body "for editorial feel" while the numbers stay in the body face; pick one pairing and hold it.
- Reading-progress bars, scroll-triggered reveals, or an animated table of contents. They are motion over a static document.
- Card-grid "related posts" that outweigh the article they follow.

## Checklist (agent)

- Body column measures 60–75 characters at base size, in both themes.
- One h1; sub-heads form a readable outline.
- One figure class, used consistently; nothing but code and tables exceeds the measure.
- Links are the only accent in running text.
- `data-cite="shadcn-blog"` on the artifact.
- Prove with `verify/measure.mjs`, then `verify/compare.mjs` — and say plainly that there is no pack shot to compare against.

## Source of truth

- The regions above are the structure. They are not optional.
- No authored source and no pack shot ship for this row, so `verify/compare.mjs` has nothing to compare against. Report that rather than a likeness score.
- Paint comes from `tokens/voices/shadcn-zinc.css`.
- For a documentation page — navigation, versioning, code-first — this is the wrong row: build the app shell and put the article in it.
