# justinfowler.com

Public landing page for Justin Fowler. Single-file static site, deploys anywhere.

## Stack

- Single `index.html` — zero build step
- Google Fonts (Fraunces · JetBrains Mono · Geist) loaded via CDN
- Pure CSS — no Tailwind compiler, no React, no framework
- Intersection Observer for scroll reveals
- Designed for GitHub Pages with custom domain → Cloudflare DNS

## Deploy in 5 minutes

### Option A — GitHub Pages (recommended, free, auto-deploys on push)

```bash
# 1. From this directory, create the repo and push
cd /path/to/justinfowler-com
git init
git add .
git commit -m "site: initial public landing page v1.0"
git branch -M main
git remote add origin git@github.com:jfstudio/justinfowler.com.git
git push -u origin main

# 2. Enable Pages in repo settings
#    GitHub.com → repo → Settings → Pages
#    Source: GitHub Actions
#    (The workflow in .github/workflows/deploy.yml handles the rest)

# 3. Add custom domain in Pages settings
#    Custom domain: justinfowler.com
#    Enforce HTTPS: ✓ (after DNS propagates, ~5 min)

# 4. Configure DNS at your registrar (Cloudflare or wherever)
#    A records pointing apex (@) to GitHub's IPs:
#      185.199.108.153
#      185.199.109.153
#      185.199.110.153
#      185.199.111.153
#    AAAA records (optional, IPv6):
#      2606:50c0:8000::153
#      2606:50c0:8001::153
#      2606:50c0:8002::153
#      2606:50c0:8003::153
#    CNAME for www → jfstudio.github.io
```

After DNS propagates (5-30 min), `https://justinfowler.com` serves this page.

### Option B — Vercel (if you prefer, also free)

```bash
npx vercel --prod
# Follow prompts; add justinfowler.com as a custom domain in Vercel dashboard
```

### Option C — Netlify Drop (zero config, drag-and-drop)

Drag the entire folder onto https://app.netlify.com/drop

---

## File structure

```
justinfowler-com/
├── index.html              ← The whole site
├── CNAME                   ← Tells GitHub Pages "serve at justinfowler.com"
├── .nojekyll               ← Skip Jekyll processing
├── README.md               ← This file
└── .github/
    └── workflows/
        └── deploy.yml      ← Auto-deploy on push to main
```

## Edit checklist before going live

Open `index.html` and replace these placeholders with your actual links:

- [ ] `https://linkedin.com/in/justinfowler` → your real LinkedIn URL
- [ ] `https://signalos.app` → your real Signal OS URL when launched
- [ ] `https://github.com/jfstudio` → your real GitHub username
- [ ] `mailto:justin@justinfowler.com` → confirm email is correct
- [ ] Open Graph URL `https://justinfowler.com` is correct (already set)

## Aesthetic notes

- Editorial dark theme — paper-on-ink
- Typography: Fraunces (serif display, variable font with character) + JetBrains Mono (data/labels) + Geist (body)
- Color: Single dominant accent (orange) used sparingly. Everything else is paper / ink / mute.
- Reveal-on-scroll animations only fire once (the Intersection Observer adds `.in` and never removes it)
- Designed mobile-first; expands at 600px, 768px, 900px breakpoints

## Iteration cadence

- Update content monthly during the Monthly Plank Review (first Monday)
- New site version when work shifts (new Signal OS milestone, new public project, new writing focus)
- Track changes via git tags (v1.0 → v1.1 → v2.0)

## What this site is NOT

This is the **public face**. It does NOT contain:

- Personal financial information
- Specific business gates (10-customer threshold, etc.)
- Strategic ask details (ClearSpeed comp negotiation)
- Internal weekly schedule
- Anything that should stay between you and your strategic plan

Those live in the **personal dashboard** (separate, private, never indexed).

---

Built April 24, 2026. Step into it.
