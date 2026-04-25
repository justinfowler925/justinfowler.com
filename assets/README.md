# /assets/

Static images referenced from the site.

## Profile photo

The resume page expects a profile photo at `/assets/photo.jpg`.

To wire it up:

1. Open https://www.linkedin.com/in/justinfowler in a logged-in browser
2. Right-click your profile photo → "Save image as…" → save to `~/Downloads/justinfowler-com/assets/photo.jpg`
3. Optimal: square crop, 400×400 minimum, < 200 KB

The resume hero uses `<img src="/assets/photo.jpg" onerror="this.style.display='none'">`,
so if the file is missing the page still renders cleanly (no broken-image icon).

## PCM screenshots

`assets/pcm/*.jpg` — PurpleChipmonk product + GTM screenshots used in the
flagship slider on `/portfolio.html`. Maintain aspect ratio 16:9, top-cropped.
