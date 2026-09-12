# Voices — three legal paints

Structure comes from the cited template; paint comes from the voice. Pick the voice from
the **job**, not habit.

| Voice | When | Paint |
|---|---|---|
| **kit-faithful** (default) | A kit template was cited | The kit's own values — type pairing, radii, density, motion, **and colors**. |
| **house** (fallback) | No kit cite, or the user asked for shine-native | Personal/brand token lanes as they stand. Dark-first, one accent, dense editorial. |
| **brand** (locked) | Clearspeed or any brand pack | Kit **structure** yes, kit **chrome** no — `brand.md` / `brand.local.md`. |

## How kit paint works (and stays legal under the lint)

The lint blocks raw values at **usage sites**, never in **custom-property definitions** —
the token layer is where raw values are supposed to live. So kit paint is one block plus
`var()` everywhere else:

1. Import `tokens/voices/<family>.css` (the cite names it). It remaps `--shine-*`
   structure values (font stack, radii, durations) for that family.
2. Take the kit's real colors from its own token sources in `~/design-corpus` — e.g.
   the shadcn theme CSS in extracted blocks, `untitled-ui-react/styles/theme.css`,
   Spectrum and Fluent token files — and declare them once as custom properties
   (`--shine-color-primary: …` overrides, or a `--kit-*` block) in the page/app token
   layer. Usage sites say `var(--…)`.
3. When a harvested pack exists, `corpus/packs/<id>/tokens.css` already carries the kit's
   values — import it and skip step 2.

Do not overwrite a kit's density or its marketing type with house style; do not leave a
Magic UI hero in house grays. The compare composite (`verify/compare.mjs`) is where this
shows up: an `untitled-table` cite beside your page should read as relatives.

## House (when it is the voice)

House paint lives in `tokens/voices/shine.css` (stone + ember from `tokens/src/personal.tokens.json`). Import it when the voice is house; do not leave `--shine-color-*` undefined and hope the page invents hex.

## Brand lane

Keep the cited template's regions; replace chroma, type family, and logos with the brand
pack. Do not import a vendor voice onto Clearspeed. Vendor logos are never cloned in any
voice; density and type pairing are.

## Fail if

- A kit cite still ships in house paint (or shadcn zinc when the cite is another family).
- Brand-locked work clones IBM/Linear/Shopify chrome.
- Kit colors are typed as raw values at usage sites instead of declared once as tokens.
