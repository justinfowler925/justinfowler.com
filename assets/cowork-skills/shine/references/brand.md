# Brand Mode

> **A private brand pack may install `brand.local.md` beside this file.** It is
> gitignored, and it wins: read it instead of this one, which is the generic
> adapter. Installing a real brand must never mean editing a tracked file — that
> is how a brand value ends up in a public diff.

Activate when the user names a brand, says "on-brand", or the work is clearly
brand-facing (marketing site, demos, client decks-as-web, product UI carrying a
company's identity).

**A brand lane is a token override plus a small set of bans — not a second design
system.** Everything in `contracts.md`, `patterns.md` and `taste.md` still
applies. This file is the adapter: what a brand kit has to tell you, and what
changes once it has.

## Load order

1. **Read the brand's own kit before writing anything.** A brand skill, a PDF, a
   Figma export, a `colors_and_type.css` — whatever exists. Name the file you
   read. A remembered palette is a guess, and a guess in brand work is the one
   error a client always catches.
2. **Build the tokens, don't transcribe them.** Point `SHINE_BRAND_OVERRIDE` at a
   private palette JSON (`tokens/brand.local.example.json` is the shape) and run
   `npm run build`. Output lands in `tokens/local/` — gitignored, so a brand's
   values never enter a public tree. Hand-copied hexes are how five surfaces end
   up with five slightly different navies.
3. **Copy and terminology go to the brand's own voice authority**, if it has one.
   This skill owns layout, interaction, and component completeness. Don't fork
   messaging rules in here.
4. **Check the live site before shipping visuals.** WebFetch the brand's
   homepage. A kit describes intent; the site is what your work sits next to.

## What the kit must specify — and what to do when it doesn't

| Needed | If absent |
|---|---|
| Canvas + one dark anchor | Derive from the primary's hue at fixed lightness; never invent a second accent |
| Action color, and whether it may fill | Assume **action-only**. An accent used as a body fill at scale is the loudest off-brand tell |
| Type roles: display / body / UI | Use the kit's faces only. No substituting Inter/Roboto/Arial for a licensed display face |
| Case and tracking rules per role | UPPERCASE UI faces usually want positive tracking (~0.1em); read `color-type.md` |
| Radii ladder | `child = parent − padding`; pick one ladder and hold it |
| Motion | Cap at ~200ms, standard ease, no bounce |
| Icon family + stroke | One family. Match stroke to the type weight; no emoji |
| Logo misuse bans | Treat any logo gradient/lockup as **wordmark only** unless the kit explicitly permits it on chrome |
| Status colors | **If the kit doesn't define them, the lane doesn't have them.** Borrow neutrals from the base lane rather than inventing brand-adjacent reds and greens |

Anything the kit leaves silent is a decision you are making on the brand's
behalf — say so in the handoff rather than leaving it implied.

## Marketing surfaces

- Anchor sections in the brand's dark value; textures on dark only, low opacity
- Any signal/pattern motif fades or bleeds — never hard-cut
- Primary button: the action color, solid, in the brand's UI face
- Secondary: outline in the brand's primary (inverted on dark)
- Composition follows [patterns.md](patterns.md)'s marketing hero budget and
  brand-first test

## Product / app surfaces

Same tokens and type roles, adapted for density:

- No marketing hero inside a dashboard
- Action color stays action-only — buttons, link emphasis, connectors; not fills
- Tables/forms/menus keep the full [contracts.md](contracts.md)
  contract (a brand admin table is DataGrid-class)
- Prefer bordered/flat elevation; a soft primary-tinted shadow only where brand
  cards call for one
- Motifs stay in settings/marketing chrome, not every app panel
- If an uppercase display face harms scanability in data-dense views, move dense
  labels to the body face and keep CTAs on-brand

## Completeness still applies

Brand mode never excuses stubs. A branded admin table still gets toolbar, sort,
filter, pagination, sticky header, empty/loading/error states, and a11y.

## Private brand lanes

The public `@shine/brand` lane ships **placeholder values on purpose**. A real
brand lane lives outside this repo: palette JSON + this file's brand-specific
twin + the built `artifact.css`, distributed to the people who need it. See
[`../../tokens/README.md`](../../tokens/README.md) § Private brand lanes.
