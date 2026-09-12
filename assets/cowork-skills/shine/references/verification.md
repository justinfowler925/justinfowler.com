# verification.md

Closing the loop. The principle: **grepping generated CSS proves nothing, because the string can be present and completely inert.** Measure the rendered box.

Verified 2026-08-04, including a live end-to-end run.

**The loop is implemented:** `node verify/measure.mjs <url|file> [--dark] [--json out] [--shot out]`
in the shine repo — render, computed values after `fonts.ready`, axe offline, per-pixel
worst-case + p5 contrast on glyph boxes, scale/cardinality lint on computed values.
Exit 1 on any hard failure. Run it before claiming any interface work is done.
First live run caught a 3.41:1 primary button the token gate had passed at the
large-text threshold.

---

## The loop

Wireframe gray-boxes (`data-shine-wireframe`, `skill/assets/wireframe.css`) are **exempt
from craft hard-fails** until Build. Still require structural sanity before lock: one
`[data-primary]`, labeled regions with `data-job`/`data-cite`, no empty void regions
without a `[empty]`/`[loading]` state label. Full `measure.mjs` runs after paint.

```
render      Playwright — file://, or page.route() virtual origin for ESM
measure     getComputedStyle + getBoundingClientRect     ← the non-negotiable step
a11y        axe-core injected offline from node_modules
contrast    per-pixel worst-case + p5 for text over gradients
lint        scale/cardinality on COMPUTED values
compose     voids, type-step collisions, hierarchy (primary), density (app-shell probe), theme
critique    screenshot → multimodal, max 3 passes, LAST
```

**Composition hard-fails (2026-08-10):** void regions; type steps below ~1.12 UI band
used ≥5× each; undeclared non-switching theme; controls with zero filled primary;
more than two competing filled treatments; `data-shine-probe="app-shell"` with content
share &lt; 28% of viewport. Section-job gaps and density on non-probe pages print as notes.
Prove bite with `node verify/doctor.mjs --full`.

**Playwright, axe-core and sharp live in shine's root `package.json`.** Run `npm install`
at the repo root. `verify/deps.mjs` resolves shine-first and keeps a sibling checkout as
fallback only. Wireframe pages (`data-shine-wireframe`) skip craft hard-fails in
`measure.mjs`; structure (one primary, voids) still fails closed.

---

## Traps found by running it

### 1. `file://` silently blocks ES modules

A plain `file://` page works, but `<script type="module">` is **blocked by CORS at origin `null`** — classic scripts run, ESM silently doesn't. The fix is better than a dev server: intercept a fake origin in-process.

```js
await page.route('https://harness.local/**', route => route.fulfill({
  body: fs.readFileSync(localPath), contentType: 'text/javascript' }));
await page.goto('https://harness.local/');
```

Zero ports, zero server lifecycle. **This also removes the case for Storybook, Ladle or Histoire** in an agent loop.

### 2. axe refuses to judge the most common contrast failure

Given text over a gradient, axe-core returns **`incomplete`** — not pass, not fail:

> *"Element's background color could not be determined due to a background gradient"*

So the single most common designer contrast failure is precisely the case the accessibility tool declines to answer. Grepping CSS would never surface it either.

**Working method, verified live:**

1. Read the true `color` from `getComputedStyle`.
2. `getBoundingClientRect()` for the text box.
3. Set the text `visibility: hidden`, screenshot **clipped to that exact box** → pure background pixels.
4. Feed the buffer back into the page as a data URL, `drawImage` to `OffscreenCanvas`, `getImageData`. *(Uses the browser's own PNG decoder — no sharp/pngjs/jimp.)*
5. Contrast the known foreground against **every** background pixel.

Real output on a `#8895a7` headline over a dark→light gradient:

```
background pixels sampled: 10032 (264x38)
WORST-CASE contrast : 1.00  at bg rgb(142,148,161)
  5th percentile    : 1.01     50th : 1.32     mean : 1.38
BEST-CASE contrast  : 2.03
VERDICT vs AA large-text 3:1 => FAIL
axe-core on the same element: "incomplete" (no answer at all)
```

Hiding the text is what makes it defensible — it isolates *background* pixels instead of averaging text and background together, which is how naive implementations get this wrong. **Report worst-case and p5, never the mean**; a gradient that passes on average still has an unreadable end.

### 3. Four false readings my own harness produced

Worth recording, because the instrument lying is the failure mode this whole system exists to catch.

- **`getComputedStyle().color` returns `oklch()`, not `rgb()`.** A regex pulling `[\d.]+` reads `oklch(0.952 0.005 60)` as RGB `[0.952, 0.005, 60]` — near-black — so every contrast ratio came back ~1.0. Silently, for every element, in both themes.
- **Canvas `fillStyle` does not normalise `oklch()`** — it round-trips the string unchanged. The usual "assign to fillStyle and read it back" trick fails. The reliable conversion is to **rasterise**: `fillRect` a 1×1 canvas and `getImageData`. That can't lie.
- **Measuring during a CSS transition captures the interpolated value.** A toggle button read 2.3:1 purely because the theme swap was still animating. Inject `*{transition:none!important;animation:none!important}` before sampling.
- **Headless Chromium defaults `prefers-color-scheme` to light.** A page whose boot script honors the OS preference — any `matchMedia('(prefers-color-scheme: light)')` fallback — silently renders light while the harness believes it is measuring dark. Hit live on the spec page: "dark" and "light" contrast came back byte-identical (5.98 / 9.00 / 4.77, twice) because both readings were light mode. Identical numbers across themes are the tell. Launch per theme with `newPage({ colorScheme })` **and** force the theme attribute inside the same `evaluate` that measures, so neither localStorage nor the boot script gets a vote.

And the one that isn't mine but is universal: **`await document.fonts.ready` before any measurement**, or you measure fallback-font geometry and every number is wrong.

### 4. HTTP 200 is not proof the page loaded

The first production deploy returned `200` from `curl` — and served Vercel's SSO login wall. The status code was true and completely uninformative about what a user would see. Always confirm by rendering and reading the title or a known element.

### 5. Texture is not text: pattern visibility is its own gate

Text contrast passing says nothing about whether a background texture reads.
A camouflage plate shipped near-flat THREE times while every text number was
green (2026-08-05). Gate any generated or graded texture on three axes of the
SERVED asset: dominant hue inside the brand family, saturation p50 alive
(≥0.4), and lightness spread (p90−p10 ≥ 0.12) — then look at it full-size.
Single-axis percentiles undersell chromatic variation; the eyeball pass is
part of the gate, not a courtesy.

### 6. Know where the variation lives before you grade

A generated image's block structure can be carried by hue/saturation, not
luminance. Collapsing to grayscale for a brand tritone destroys it by
construction — no curve anchors can bring it back. If the variation is
chromatic, **hue-rotate the original into the family** and leave the
structure alone; tritone only genuinely luminance-varied sources. Keep the
generation ORIGINAL in the repo (`assets-src/`) — regrades come from
originals, never from graded copies, and never from a temp directory.

### 7. The framework image cache serves yesterday's file

Next's image optimizer keys on the URL: replace a file under the same name in
dev and pages keep rendering the STALE optimized copy — which then gets
screenshotted into "current" marketing thumbnails (shipped once, 2026-08-05).
Purge `.next/cache/images` (or restart) before any capture, and gate it:
compare the thumbnail's texture against the served asset. Key the comparison
on **saturation p50** — a page scrim compresses lightness on every era, so a
spread check passes stale captures (one did, at 58%), while saturation
survives the scrim and separates eras cleanly. And when the texture changes,
sweep EVERY capture that embeds it: one stale thumbnail dates the whole page.

### 8. "Different colors" complaints are census failures

Two whites four alpha-points apart, two navies eleven lightness-points apart —
humans see them instantly and greps never do. Census the rendered page:
distinct computed text colors (bounded cardinality, flag near-duplicate
whites), and distinct large dark planes across EVERY route, not the page the
complaint named. Comprehensive means crawl the app.

### 9. A screenshot has a destination, and the destination has a shape

Captures are composed for the slot that will display them, never for the
browser that took them. A 16:10 desktop dump dropped into a square grid cell
renders text at 29% scale with half the pixels as empty margin — shipped
once, called out in one glance (2026-08-05). The method: narrow the viewport
until the content column fills the frame, clip to the content plus a small
pad, and match the slot's aspect (near-square for grid cells, card-width for
data cards, a strip for nav scenes). Then gate it: each shipped capture
declares the aspect band and minimum width its slot needs, and the check
fails shapes that drift.

### One script, one pass

Encode the project's gates as a single runnable
(`scripts/design-verify.mjs`, `npm run design:verify`): plane census across
all routes, text-color census, per-pixel text contrast, texture-visibility
floors, thumbnail-vs-asset freshness. Run it against dev before the PR and
against production after the deploy. Five findings per turn is the smell of
checks that should have been one script.

---

## Design lint — what exists, what doesn't

**Arbitrary Tailwind values — solved.** `eslint-plugin-better-tailwindcss@4.7.0`'s `no-restricted-classes` accepts regex:

```json
"better-tailwindcss/no-restricted-classes": ["error", { "restrict": ["\\[([^\\[\\]]*?)\\](?!:)"] }]
```

Flags `w-[137px]`, `text-[13px]`, `bg-[#ff0000]`. Both it and `eslint-plugin-tailwindcss@4.2.0` support Tailwind v4 (the 4.x line *is* the v4 line, and it requires a `.css` config, not `.js`).

**Hardcoded CSS colors — mostly solved.** `stylelint-declaration-strict-value@1.11.1` forces properties to take a variable. Known limitation, closed by the maintainer as wontfix: `rgb(var(--x))` patterns slip through by design.

**`oxlint-tailwindcss@1.7.0`** shipped 2026-08-04 with a literal **"Design-System Discipline"** rule category — `no-arbitrary-value`, `no-hardcoded-colors`, `prefer-scale-token` (`p-[10px]` → `p-2.5`), `prefer-theme-tokens`, `no-dark-without-light`. It calls `@tailwindcss/node` directly so it reads your actual `@theme` rather than regexing class names. Exactly right; one maintainer, zero days old, needs oxlint not ESLint. Pin the version, treat as bonus.

**Off-scale spacing, font-size cardinality, radii consistency — nothing exists.** Verified: `stylelint-plugin-design-tokens`, `stylelint-design-tokens`, `eslint-plugin-design-tokens`, `design-tokens-lint` all 404 on the registry. Backlight.dev shut down June 2025. Figma-side linters lint design files, not the DOM.

**So write it — against computed values, not source.** ~100 lines. This catches violations arriving through Tailwind, inline styles, a third-party component, or a CSS-in-JS runtime, all of which a source linter misses entirely.

```js
await page.evaluate(() => document.fonts.ready);   // ALWAYS FIRST
const violations = await page.evaluate(() => {
  const SPACING = new Set([0,2,4,8,12,16,24,32,48,64]);
  const TYPE = new Set([11,13,15,17,21,26,33]);
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el), box = el.getBoundingClientRect();
    if (!box.width && !box.height) continue;
    for (const p of ['paddingTop','marginTop','gap','columnGap']) {
      const v = parseFloat(cs[p]);
      if (v && !SPACING.has(Math.round(v))) out.push({kind:'spacing', p, v});
    }
    const fs = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight);
    if (!el.childElementCount && el.textContent?.trim()) {
      if (!TYPE.has(Math.round(fs))) out.push({kind:'font-size', v:fs});
      if (lh/fs < 1.2 || lh/fs > 2.0) out.push({kind:'line-height-ratio', v:+(lh/fs).toFixed(2)});
    }
    if (box.right > document.documentElement.clientWidth + 1) out.push({kind:'overflow-x'});
    if (el.matches('a,button,[role=button]') && (box.width<24||box.height<24)) out.push({kind:'tap-target'});
    if (el.scrollHeight > el.clientHeight+1 && cs.overflowY==='hidden') out.push({kind:'clipped-text'});
  }
  return out;
});
```

Assert **cardinality**, not just membership: ≤5–7 distinct font sizes, ≤3 distinct radii, every spacing value on the scale.

---

## Accessibility — know the ceiling

`@axe-core/playwright@4.12.1`, tags `wcag2a wcag2aa wcag21a wcag21aa wcag22aa` (there is no `wcag22a` tag). Works fully offline via `page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') })`.

**Deque's own study — 2,000+ audits, 13,000+ pages — puts automated coverage at 57%.** But that headline is inflated by volume:

- **Color contrast: ~98% detected**
- **Keyboard navigation: 2.49% detected**

Cannot be automated at all: whether alt text is *meaningful*, logical focus and reading order, whether an error message is *understandable*, keyboard traps in custom widgets, ARIA *appropriateness*.

**Fail on `results.incomplete` too** — that's the "axe couldn't tell" bucket everyone ignores, and it's where the gradient-contrast case lives.

**`toMatchAriaSnapshot()` is underrated** — it asserts the accessibility tree, so it catches "I rendered a `<div onclick>` instead of a button" and skipped heading levels. A pixel diff is blind to both.

Skip Pa11y (redundant next to axe) and Lighthouse for a11y (its a11y category *is* axe-core, plus a headless Chrome launch). Note `@lhci/cli` is stuck at 0.15.1 pinning Lighthouse 12.6.1 while Lighthouse is at 13.4.1 — maintenance mode.

---

## Visual regression

**Playwright's built-in `toHaveScreenshot`, nothing else.** Defaults: `threshold: 0.2` (YIQ perceived-color delta), `animations: 'disabled'`, `caret: 'hide'`, plus `maxDiffPixels`, `mask`, `stylePath`, `clip`.

The platform-difference problem mostly evaporates for a local agent loop — baselines differ macOS vs Linux because of font antialiasing, but that only bites when you generate on one OS and compare on another. Don't pay the Docker tax until this runs in CI.

Honest limitation: **pixel diffing contributes nothing on first render** — there's no baseline.

- `odiff-bin@4.5.0` — native SIMD, ~6–8× faster than pixelmatch, real CLI. Worth it only at hundreds of images.
- ⚠️ **`lost-pixel` is archived** (repo `archived: true`, last publish 2024-11). **BackstopJS** last shipped 2024-09. Don't start new work on either.
- Chromatic and Argos are SaaS and need accounts.

---

## Screenshot critique — real prior art, known ceiling

- **"Vision-Guided Iterative Refinement for Frontend Code Generation"** (arXiv 2604.05839, April 2026) — a VLM acts as visual critic on rendered pages, feeding structured feedback back into generation. **Up to +17.8% over three refinement cycles, plateauing after ~3.** LoRA fine-tuning captured only **25%** of the critic-in-the-loop benefit — *the loop does the work, not the weights.*
- **Design2Code** — 484 real webpages; explicitly tests visual self-revision by conditioning on both the reference screenshot and a screenshot of the model's own output.
- **UXBench** (arXiv 2606.16262) — measures the actionability of LLM UX critiques specifically.

**Cap iterations at 3 and run it last.** Self-critique is the subjective layer; run the deterministic measurements first so the model is critiquing taste rather than re-deriving that contrast is 1.00.

No credible open-source self-hostable LLM visual grader exists — every instance is inside a commercial product.

---

## Playwright MCP vs the library

`@playwright/mcp@0.0.78` is official (Microsoft) and exposes `browser_navigate`, `browser_snapshot`, `browser_take_screenshot`, `browser_evaluate`, plus `--caps vision,pdf,devtools,storage,network,testing`.

**Use the library, not the MCP, for this loop.** The MCP is designed for exploratory browsing and is deliberately accessibility-tree-first. A design loop wants a deterministic script that measures 200+ elements and returns one JSON blob — that's a single `node` call versus hundreds of MCP round-trips through context. Keep the MCP for interactive debugging. Note `browser_run_code_unsafe` is RCE-equivalent.

**Playwright Test Agents** (`npx playwright init-agents --loop=claude`) ships a first-party planner/generator/**healer** loop — worth evaluating separately.

---

## Figma

**Official MCP server exists** with 23 tools — `get_design_context` (structured React+Tailwind representation of a selection), **`get_variable_defs`** (design tokens from a selection), `get_screenshot`, `get_code_connect_map`, `search_design_system`. Auth via Figma OAuth; free during beta, becoming usage-based.

⚠️ **The Variables REST API is Enterprise-only** — `GET /v1/files/:key/variables/local` requires the Enterprise plan, and the write endpoint additionally requires a Full seat. **If the org isn't on Enterprise, the entire REST token path is closed in both directions**, and the MCP's selection-scoped `get_variable_defs` is the only programmatic access. Confirm seat status before scoping any Figma work.

Pushing code tokens *into* Figma without Enterprise: **Tokens Studio** with a Git backend.

**Code Connect is the underrated piece** — it maps Figma components to real code components, so generated output uses your actual design system instead of inventing markup. That's upstream of most of the violations you'd otherwise lint for.

**Sequence Figma after the loop works.** It's a token-provenance problem, not a did-the-output-render-correctly problem.
