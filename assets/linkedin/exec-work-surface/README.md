# Exec work surface — LinkedIn cards

Four 2400×2400 PNGs for a multi-image LinkedIn post, plus the copy (`post.md`) and the
source they render from (`src/`). Unlinked from every page — these are upload assets,
same status as `assets/linkedin-banner.svg`.

| File | Card |
|---|---|
| `linkedin-1-hook.png` | Hook — chat box vs. work surface |
| `linkedin-2-surface.png` | Product mock, labelled **sample data** on its face |
| `linkedin-3-rules.png` | The four rules underneath |
| `linkedin-4-voice.png` | Voice layer — spoken phrase → stored action → approve |

Card 2 is a mock. Its numbers are invented and the panel says so; nothing in it comes
from a real system or a real person.

## Re-rendering

`src/` carries the HTML and `base.css`. Two generated files are **not** committed:

- `tokens.css` — copy from `~/Projects/shine/tokens/dist/personal/tokens.css`
- `fonts.css` — Geist + JetBrains Mono, latin subset, base64-inlined so the render
  never depends on the network. Build it by fetching the Google Fonts CSS with a
  browser UA, keeping the `U+0000-00FF` blocks, and replacing each `url()` with a
  `data:font/woff2;base64,…` payload.

Then, per card:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1200,1200 \
  --virtual-time-budget=3000 --screenshot=01-hook.png "file://$PWD/01-hook.html"
```

## Verification

The shine measure loop **does** run here — playwright 1.62.1 lives at
`~/Projects/ceo-morning-brief/node_modules`, not in `~/Projects/shine`, so it needs
`NODE_PATH`:

```sh
cd ~/Projects/shine && NODE_PATH=~/Projects/ceo-morning-brief/node_modules \
  node verify/measure.mjs <path>/03-rules.html
```

Final state on all four cards: **axe 0 violations**, type scale within the 6-size cap
(12/15/16/19/23/30 and 15/16/19/27/34/70), no off-scale computed spacing.

The loop still reports contrast FAILs of 1.00–2.17:1 on wrapped display text. Those are
box-not-glyph artifacts, confirmed two ways rather than assumed:

- **Geometry.** `span.accent` on card 4 returns `getClientRects().length === 2` — it
  wraps, so its union bounding box encloses background between the line ends and a
  worst-case pixel pair samples bg against bg. Same shape for the nav rows on card 2,
  where the label sits left and the badge right across a 232px box.
- **The raster.** A colour census over the finished 2400×2400 PNGs finds only six
  significant inks: 18.92:1, 15.73:1, 8.73:1, 7.83:1, and 4.12:1 — the last used only
  for the 92px dim headline (card 1) and the 34px semibold closer (card 4), both above
  the 3:1 large-text floor. No 1.00:1 ink exists in any image.

The probe's `p5` column agrees with the census (4.12 / 6.93 / 7.83 / 8.73 / 14.84),
which is the tell that `worst` is measuring the box.

Colours come from `@shine/personal` tokens only — no raw hex in `src/`.
