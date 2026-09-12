# imagegen.md — on-demand graphics

Ask the human **high / medium / low** quality. Never ask them to pick a model,
quantize level, or step count — map the tier yourself.

Default if they don’t say: **medium**. If they say “final”, “hero”, “ship it”,
“stunning”, or “print” → **high**. If they say “sketch”, “rough”, “try a few”,
or “quick” → **low**.

## Quality tiers (what you ask)

| They pick | Feel | Typical wait @1024² | Use for |
|---|---|---|---|
| **low** | Fast draft, soft detail, faces/hands soft | ~20s | Composition, layout tests, many variants |
| **medium** | Good enough to judge; not final | ~1–2 min | Most “make me an image” asks |
| **high** | Final art | several minutes | Heroes, avatars, anything that ships |

Always confirm the tier once (“Medium — about a minute?”) unless they already named it.

## What you run (do not show them this)

Host must have `mflux` on `PATH` (`export PATH="$HOME/.local/bin:/opt/homebrew/bin:$PATH"`).
Configure the generation host yourself — shine ships no SSH targets.

Always pass `--seed` (reproducible). Default size 1024×1024 unless they ask otherwise.

```bash
# LOW — draft
mflux-generate \
  --model dhairyashil/FLUX.1-schnell-mflux-4bit --base-model schnell \
  --steps 4 --seed <N> --height 1024 --width 1024 \
  --prompt "..." --output out.png

# MEDIUM — default
mflux-generate \
  --model dhairyashil/FLUX.1-schnell-mflux-4bit --base-model schnell \
  --steps 8 --seed <N> --height 1024 --width 1024 \
  --prompt "..." --output out.png

# HIGH — final (dev, not distilled)
mflux-generate \
  --model dhairyashil/FLUX.1-dev-mflux-8bit --base-model dev \
  --steps 28 --guidance 3.5 --seed <N> --height 1024 --width 1024 \
  --prompt "..." --output out.png
```

Upgrade path: show 2–3 **low** seeds → they pick a direction → one **high** with that seed.

## Faces & wardrobe

FLUX is strong on faces; wardrobe/framing often needs a second pass. After a **high**
face you like: `mflux-generate-qwen-edit` (or Gemini image edit) with
*”keep the FACE exactly as it is, change only X”*. Don’t make the human manage that
split — just do it when the brief needs it.

## After generate

- Anti-stock: real product/texture/typo covers beat Unsplash clones (`taste.md`).
- Grade into the brand family if the surface is branded (hue/sat check, archive raw in `assets-src/`).
- Report: tier used, seed, path to the file — not model IDs unless they ask.
