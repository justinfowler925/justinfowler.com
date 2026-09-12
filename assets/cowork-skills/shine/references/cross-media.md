# Cross-media output lanes

The design job stays the same across media: establish the audience, decision, evidence,
hierarchy, and signature moment. The implementation changes because each format has a different
interaction and editing contract.

## Route by deliverable

- **Application or web page:** use the consumer's installed component system. shadcn remains the
  composition layer; Base UI is the default primitive layer for new work, React Aria is the
  accessibility ceiling for complex interactions, and existing Radix/Base/Aria primitives stay.
- **Editable PowerPoint:** use PptxGenJS. Define a slide master, theme tokens, grid, image crops,
  notes, and editable native shapes. Never rasterize the whole slide.
- **Code-first presentation:** use Slidev when versioned Markdown, live code, animation, or a web
  delivery surface matters more than PowerPoint editing.
- **PDF or report:** build semantic HTML with print CSS, controlled page breaks, repeated headers,
  figure captions, tagged headings, and a real table-of-contents when the document is long.
- **Email:** use conservative, table-safe HTML with inline styles, a single primary action,
  meaningful preheader, plain-text alternative, and no interaction required to reveal content.

## Shared art-direction contract

Before building, name:

1. the composition archetype;
2. the image strategy and source rights;
3. the signature moment that only fits this subject;
4. the prior family or silhouette this output must not repeat;
5. the proof appropriate to the medium.

For slides, proof includes overflow checks at the actual slide size and a rendered deck review.
For PDFs, proof includes page-break, link, selectable-text, and print contrast checks. For email,
proof includes narrow/mobile rendering, dark-mode resilience, and a real sent-test when available.

## Open-source reference boundary

Untitled UI React, Magic UI, Motion Primitives, Tremor, and free page galleries may inform region
graphs or a named component. Do not add their runtime merely to borrow their appearance. Port the
structural lesson into the installed system and cite the source. MUI, Ant, and Carbon remain
reference-only: their region patterns can inform a blueprint, but their runtime, theme, and source
do not enter a shadcn consumer.
