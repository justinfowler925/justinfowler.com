# motion.md

Nothing in shadcn, visx, nivo or D3 animates. This is the gap that has to be filled by hand.

Verified 2026-08-04 against npm, GitHub, and the Web Platform Status API.

---

## The token set

Rules encoded: exits faster than entrances; distance and surface area drive duration, not importance; decelerate entering, accelerate leaving; springs only where motion is interruptible or gestural.

```css
:root {
  /* Easing */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);      /* M3 standard. Default for ~80%. */
  --ease-out:      cubic-bezier(0, 0, 0, 1);         /* Entering: fast start, soft landing */
  --ease-in:       cubic-bezier(0.3, 0, 1, 1);       /* Leaving */
  --ease-in-out:   cubic-bezier(0.45, 0, 0.55, 1);   /* Symmetric moves A→B on screen */
  --ease-spring: linear(
    0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%,
    0.937 38.1%, 0.968 41.8%, 0.991 45.7%, 1.006 50.1%, 1.015 60%, 1.006 76.2%, 1
  );                                                  /* ≈ bounce 0.2, runs off main thread */

  /* Duration */
  --dur-instant: 100ms;  /* hover, focus ring, checkbox, color change */
  --dur-fast:    150ms;  /* press, tooltip, small icon state */
  --dur-base:    200ms;  /* DEFAULT — dropdown, popover, menu */
  --dur-slow:    300ms;  /* modal, drawer, accordion, layout shift */
  --dur-slower:  400ms;  /* bottom sheet, full panel, route transition */
  --dur-crawl:   600ms;  /* full-screen hero / choreographed sequence ONLY */

  --dur-exit-base: 150ms;  /* ~0.75× the matching entrance */
  --dur-exit-slow: 200ms;
}
```

| Interaction | Duration | Easing |
|---|---|---|
| Hover, focus ring | instant | standard |
| Button press | fast | out |
| Tooltip | fast | out |
| Dropdown / menu / popover | base | out in, in out |
| Modal / dialog | slow | out in, in out |
| Bottom sheet / drawer | slower | spring (gestural, interruptible) |
| Accordion / expand | slow | standard |
| Layout shift (FLIP) | slow | standard |
| Toast | base / exit-base | out / in |
| Route transition | slower | standard |
| Skeleton / progress loop | 1000–1500ms | linear |

**Two opinions worth stating.** `--dur-base: 200ms` is the correct default — reach for it and move on. And use `--ease-standard` for ~80% of motion: curve variety is where design systems go to die, and consistency reads as expensive far more reliably than expressiveness does.

**Empirical backing.** NN/g: 100–500ms for most animation, ~100ms for simple feedback, 200–300ms for substantial screen changes. Their line worth internalising — *"It is far more common for animations to be too long than too short."* Material's `extra-long` tokens reach 1000ms, which NN/g would call far too slow for anything but a full-screen hero.

---

## Material 3's actual published values

Pulled from Google's generated token file, not the docs site.

**Easing:** `emphasized` `(0.2,0,0,1)` · `emphasized-accelerate` `(0.3,0,0.8,0.15)` · `emphasized-decelerate` `(0.05,0.7,0.1,1)` · `standard` `(0.2,0,0,1)` · `standard-accelerate` `(0.3,0,1,1)` · `standard-decelerate` `(0,0,0,1)` · `legacy` `(0.4,0,0.2,1)`

> **`emphasized` and `standard` are byte-identical in the web token export.** M3's spec describes emphasized as a two-part spline that a single cubic-bezier cannot represent, and the export flattens it. Anyone quoting a distinct emphasized bezier is quoting an approximation. To get the real feel, express it as `linear()`.

**Duration (ms):** short 50/100/150/200 · medium 250/300/350/400 · long 450/500/550/600 · extra-long 700/800/900/1000

**State layers:** hover **0.08**, focus **0.12**, pressed **0.12**, dragged **0.16**. (Focus is 12%, not 10%; hover and pressed differ.)

**IBM Carbon durations (ms):** fast-01 70 · fast-02 110 · moderate-01 150 · moderate-02 240 · slow-01 400 · slow-02 700. Its easings split productive vs expressive, and **entrance eases out while exit eases in**.

---

## Library state

| Library | Version | License | min+gzip | Verdict |
|---|---|---|---|---|
| `motion` | 12.43.0 | MIT | 44.2 KB | **The 2026 React default** |
| `gsap` | 3.15.0 | Custom, **not OSI** | 26.7 KB | Free now, but no forking/redistribution |
| `@react-spring/web` | 10.1.2 | MIT | 19.6 KB | Lightest real option |
| `animejs` | 4.5.0 | MIT | 39.3 KB | Lightweight middle, non-React friendly |
| `@formkit/auto-animate` | 0.10.0 | MIT | 3.2 KB | List reordering only, perfect at it |
| `@theatre/core` | 0.7.2 | Apache-2.0 | — | **Dormant** — no public commit since Aug 2024 |

**The Motion rename is misleading.** `motion` depends on `framer-motion`; both publish in lockstep at the same version. The rename is a thin re-export over the still-live implementation package. So seeing `framer-motion` in your lockfile is correct, not a bug — don't add resolutions to strip it, and don't let a "remove deprecated package" lint rule fire on it.

**Prefer `visualDuration` + `bounce` over `stiffness`/`damping`.** From Motion's source: `dampingRatio = 1 - bounce`. So bounce 0 is critically damped, 0.3 gives ratio 0.7. `visualDuration` is when the animation *appears* to arrive — settling happens after — which finally lets a spring be time-coordinated with a CSS transition.

```jsx
import { motion, AnimatePresence, MotionConfig } from "motion/react"

<MotionConfig reducedMotion="user">
  <AnimatePresence mode="popLayout">
    {open && <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: "spring", visualDuration: 0.28, bounce: 0.18 }} />}
  </AnimatePresence>
</MotionConfig>
```

Trim the bundle with `import * as m from "motion/react-m"` + `<LazyMotion features={domAnimation}>` → ~4.6 KB + 15 KB.

**GSAP's licence, precisely.** Free for commercial use since April 2025, all former Club plugins included. But it is **not OSI-approved**: IP remains Webflow's, you may not fork or redistribute it, and it bars use in tools that let users build visual animations without code. Irrelevant for product work; fatal to an "OSI-approved licences only" policy. Flag it early, not at release review.

---

## Platform motion — what needs no JS

| Feature | Baseline | Chrome | Safari | Firefox | Verdict |
|---|---|---|---|---|---|
| `linear()` easing | **widely** (2023-12) | 113 | 17.2 | 112 | **Ship it** |
| Web Animations API | **widely** (2020) | 84 | 14 | 75 | **Ship it** |
| `@starting-style` | newly (2024-08) | 117 | 17.5 | 129 | **Ship it** |
| `transition-behavior: allow-discrete` | newly (2024-08) | 117 | 17.4 | 129 | **Ship it** |
| View Transitions (same-doc) | newly (2025-10) | 111 | 18 | **144** | **Ship it** |
| View Transitions (cross-doc) | limited | 126 | 18.2 | none | Progressive enhancement |
| Scroll-driven animations | limited | 115 | **26** | none | Enhancement only |
| `interpolate-size` / `calc-size()` | limited | 129 | none | none | Chromium only |

**Same-document View Transitions went Baseline when Firefox 144 shipped, October 2025.** If your model says "View Transitions are a Chrome thing," that expired.

**`@starting-style` + `allow-discrete` is why a React app can skip a motion library.** Two years Baseline, and it finally makes CSS-only enter *and* exit animation work for `dialog`, `popover`, and any `display: none` toggle:

```css
.popover {
  opacity: 0; translate: 0 6px;
  transition: opacity 200ms ease, translate 200ms ease,
              display 200ms allow-discrete, overlay 200ms allow-discrete;
}
.popover:popover-open { opacity: 1; translate: 0 0; }
@starting-style { .popover:popover-open { opacity: 0; translate: 0 6px; } }
```

**`linear()` gives you springs with zero runtime.** It's a piecewise-linear lookup table, so it expresses overshoot that `cubic-bezier` mathematically cannot. Motion's `spring()` will emit the string for you; Jake Archibald's generator is the other route. Runs off the main thread.

**Height-to-auto is still not portable.** `interpolate-size` is Chromium-only two years on. Use the Baseline-safe alternative:

```css
.accordion { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 300ms ease; }
.accordion[open] { grid-template-rows: 1fr; }
.accordion > div { overflow: hidden; min-height: 0; }
```

**Scroll-driven animations need the element visible by default.** Firefox has nothing, so if you write `opacity: 0` outside the `@supports` block, Firefox users get invisible content.

**React's `<ViewTransition>` is not stable** — canary/experimental only. Use `document.startViewTransition()` directly.

---

## Reduced motion — reduced, not none

The nuke pattern is wrong:

```css
/* DON'T */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

Three reasons. It **breaks functionality** — `allow-discrete` exit transitions get cancelled, so elements vanish abruptly or stick in the top layer. It **removes useful signal** — without a cross-fade users lose the cue that anything changed, a usability regression for the same people. And it **over-corrects** — opacity and color changes don't trigger vestibular responses.

The real distinction is **vestibular-triggering vs not**, not motion vs no motion.

- **Triggers:** large-area movement, parallax, scaling, rotation, sustained or looping motion, anything the user didn't initiate, anything crossing a large portion of the viewport.
- **Harmless:** opacity, color, movement under ~10px, border and shadow changes, short cross-fades.

Treat full motion as the enhancement, so the safe experience is the default:

```css
.card { transition: opacity 150ms ease, background-color 150ms ease; }

@media (prefers-reduced-motion: no-preference) {
  .card { transition: opacity 200ms var(--ease-out), translate 200ms var(--ease-out),
                      scale 200ms var(--ease-out), background-color 150ms ease; }
  .card:hover { translate: 0 -4px; scale: 1.02; }
}
```

For View Transitions, kill the animation but keep the transition so DOM swapping and top-layer handling still work:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
```

**What should still animate:** shortened cross-fades (~100ms), color and border changes, **focus indicators — never suppress these**, loading and progress indicators (a frozen spinner reads as a hung app), shifts under 10px.

**Offer an in-app override.** OS preference should be a default, not a ceiling — users on shared or managed machines often can't change it.

`prefers-reduced-motion` has been Baseline since January 2020. There is no support excuse.

---

## Atmosphere

**Hierarchy: CSS-only by default (0 KB) → shaders when you need per-pixel procedural behaviour → R3F only when there is actual 3D.** Using R3F to render one fullscreen quad is the classic overspend.

**`@property` is what makes gradient angles animatable at all.** Without the declaration it snaps instead of interpolating — that's the whole trick:

```css
@property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
.aurora { background: conic-gradient(from var(--angle), oklch(.6 .2 260), oklch(.75 .18 160), oklch(.6 .2 260));
          animation: spin 12s linear infinite; }
@keyframes spin { to { --angle: 360deg; } }
```

**Interpolate gradients in oklab**, not sRGB — `linear-gradient(in oklab, …)`. sRGB interpolation produces the muddy grey midpoint that makes gradients look cheap. This single change does more for perceived quality than any library.

**Grain is the highest value-per-byte technique available** — an feTurbulence tile costs ~912 bytes base64 and is what makes a flat gradient look expensive. Two rules: keep the filter on a small repeating tile, never a full-viewport element, and **never animate `baseFrequency`**. If it profiles hot, pre-render to a small WebP.

**`@paper-design/shaders-react`** (Apache-2.0, zero dependencies, no three.js) is the standout for procedural backgrounds — 29 shaders including mesh gradient, dithering, metaballs, god rays. **Pin the exact version**; the README states breaking changes ship under 0.0.x.

**three.js r185 / R3F 9.7.0** are healthy; **drei is the weak link** — zero commits in eight weeks, no stable release since 2025-11. Pin it and minimise surface area. WebGPU is at ~83.6% support and shippable *with* a WebGL2 fallback, which three.js gives you free — but for a gradient background it buys nothing. Write new shaders in **TSL**; it transpiles to both WGSL and GLSL.

**Reads dated:** particles.js constellation networks (the strongest 2016 tell), scroll-jacking, blob SVG shapes, long-scroll parallax, unmotivated glassmorphism, sRGB gradients with grey midpoints, spinning 3D logos, letter-by-letter hero reveals.

**Reads current:** grain over gradient, oklch with oklab interpolation, shaders drifting almost imperceptibly (speed ≈0.1–0.2), motion that responds to input rather than autoplaying, generous stillness, View-Transition route continuity, dithering as texture.

The through-line, and the part worth defending: **expensive-looking work uses less motion, more precisely.** Amplitude is the tell. Two moving elements at 200ms on one shared curve beats eight at 600ms on six curves, every time.
