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

Playwright is not installed in `~/Projects/shine`, so `verify/measure.mjs` will not run
here. Contrast was measured off the rendered raster instead: `sips -s format bmp`, then
count colours over the whole image and compute WCAG ratio against the dominant
background. Result on these four: all normal-size text at **7.83:1** or
**15.7–18.9:1**; two colours at **4.12:1** (the 92px dim headline on card 1, the 34px
semibold closer on card 4) which clear the 3:1 large-text floor; one **1.92:1** value
that is the dashed border on the gap notice, not text.

Colours come from `@shine/personal` tokens only — no raw hex anywhere in `src/`.
