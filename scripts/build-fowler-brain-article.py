#!/usr/bin/env python3
"""Build this article and deterministic starter releases from reviewed Markdown."""
from pathlib import Path
import hashlib
import html
import json
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
KIT = ROOT / 'assets/fowler-brain-starter'
SLUG = 'fowler-brain-for-sales'


def inline(value):
    value = html.escape(value)
    value = re.sub(r'\[([^\]]+)\]\((https://[^\s)]+)\)', r'<a href="\2">\1</a>', value)
    value = re.sub(r'`([^`]+)`', r'<code>\1</code>', value)
    value = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', value)
    return re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', value)


def markdown(text):
    # This publication uses paragraphs, headings, and flat lists only.
    out = []
    for block in re.split(r'\n\s*\n', text.strip()):
        if block.startswith('## '):
            title = block[3:]
            ident = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
            out.append(f'<h2 class="st" id="{ident}">{inline(title)}</h2>')
        elif re.match(r'^\d+\. ', block):
            rows = re.split(r'\n(?=\d+\. )', block)
            out.append('<ol>' + ''.join('<li>' + inline(re.sub(r'^\d+\. ', '', r)) + '</li>' for r in rows) + '</ol>')
        elif block.startswith('- '):
            out.append('<ul>' + ''.join('<li>' + inline(r[2:]) + '</li>' for r in block.splitlines()) + '</ul>')
        else:
            out.append('<p>' + inline(block.replace('\n', ' ')) + '</p>')
    return '\n'.join(out)


def archive(path, files, base):
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        for file in sorted(files):
            info = zipfile.ZipInfo(file.relative_to(base).as_posix(), (2026, 9, 11, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            z.writestr(info, file.read_bytes())


# The unrelated generic sales starter is retired. This builder produces only
# the public walkthrough and its handout; private SLED files stay in Nucleus.
files = []
source = (ROOT / f'writing/{SLUG}.md').read_text()
title, _, body = source.partition('\n\n')
title = title.removeprefix('# ')
byline, _, body = body.partition('\n\n')
sibling = (ROOT / 'writing/unfog.html').read_text()
css = re.search(r'<style>(.*?)</style>', sibling, re.S).group(1)
nav = re.search(r'<nav aria-label="Primary">.*?</nav>', sibling, re.S).group(0)
font_links = re.search(r'<link rel="preconnect".*?<link rel="stylesheet" href="../assets/tokens.css" />', sibling, re.S).group(0)
summary = 'A practical walkthrough for using SLED Agent in Claude Cowork: enable the shared skill, research a state, check the evidence, and keep a reusable state record.'
page = f'''<!doctype html>
<html lang="en" data-cite="shadcn-blog" data-product-pattern="fowler-editorial-article">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>{html.escape(title)} — Justin Fowler</title>
<meta name="description" content="{html.escape(summary)}" />
<meta name="author" content="Justin Fowler" />
<meta name="robots" content="index,follow,max-image-preview:large" />
<link rel="canonical" href="https://justinfowler.com/writing/{SLUG}.html" />
<meta property="og:title" content="{html.escape(title)}" />
<meta property="og:description" content="{html.escape(summary)}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://justinfowler.com/writing/{SLUG}.html" />
<meta property="og:image" content="https://justinfowler.com/og-image.svg" />
<meta property="article:published_time" content="2026-09-11" />
<meta property="article:modified_time" content="2026-09-11" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{html.escape(title)}" />
<meta name="twitter:description" content="{html.escape(summary)}" />
<meta name="twitter:image" content="https://justinfowler.com/og-image.svg" />
<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"Article","headline":title,"description":summary,"author":{"@type":"Person","name":"Justin Fowler","url":"https://justinfowler.com/"},"datePublished":"2026-09-11","dateModified":"2026-09-11","mainEntityOfPage":f"https://justinfowler.com/writing/{SLUG}.html"})}</script>
<script src="/assets/analytics.js" defer></script>
<link rel="icon" href="../favicon.svg" />
{font_links}
<style>{css}
/* Article-specific reading measure; uses the site's existing token vocabulary. */
body {{ font-size:17px; }}
.prose {{ max-width:65ch; margin-bottom:var(--shine-space-8); overflow-wrap:anywhere; }}
.prose .st {{ margin-top:var(--shine-space-7); margin-bottom:var(--shine-space-2); }}
.prose a {{ text-decoration:underline; text-underline-offset:.18em; }}
.prose ol,.prose ul {{ padding-left:var(--shine-space-6); color:var(--paper-2); font-family:var(--serif); font-size:17px; line-height:1.68; }}
.prose li+li {{ margin-top:var(--shine-space-3); }}
.prose code {{ font-size:.85em; overflow-wrap:anywhere; }}
details {{ margin-bottom:var(--shine-space-7); border-top:1px solid var(--ink-3); padding-top:var(--shine-space-5); }}
summary {{ cursor:pointer; font-family:var(--sans); padding:var(--shine-space-3) 0; }}
details p {{ margin-top:var(--shine-space-4); color:var(--paper-2); }}
.hero .stamp {{ color:var(--paper-2); background:none; border-color:var(--ink-3); }}
@media (prefers-reduced-motion:reduce) {{ * {{ animation:none!important; scroll-behavior:auto!important; }} }}
</style>
</head>
<body><a href="#main" class="skip">Skip to content</a>
<div class="container">{nav}
<main id="main">
<header class="hero" data-region="hero">
<div class="breadcrumb"><a href="/writing.html">Writing</a><span class="sep">/</span>SLED Agent</div>
<div class="stamp">Setup & training · 11 September 2026</div>
<h1 id="headline">{html.escape(title)}</h1>
<p class="lede" id="notes">Choose a state. Review the evidence. Leave with a clear next step and a record you can use again.</p>
<p style="margin-top:var(--shine-space-5);color:var(--paper-2)">{html.escape(byline)}</p>
<div class="hero-actions" aria-label="Article resources">
<a class="btn primary" data-primary href="#start-with-the-shared-skill">Start with the shared skill</a>
<a class="btn" href="#what-a-useful-answer-looks-like">See what you get</a>
</div>
</header>
<article id="report" class="prose">{markdown(body)}</article>
<section class="hero-actions" aria-label="SLED training downloads">
<a class="btn primary" href="https://nucleus-clearspeed.vercel.app/company-tools/sled-agent">Open SLED training in Nucleus</a>
<a class="btn" href="/assets/sled-agent-public-guide.zip" download>Download this walkthrough</a>
<a class="btn" href="/assets/cowork-skills/START-HERE.md">Other Cowork skills</a>
</section>

</main>
<footer><span>© 2026 · Justin Fowler</span><span>Published · 11 September 2026</span><a href="/writing.html">More writing</a></footer>
</div></body></html>'''
(ROOT / f'writing/{SLUG}.html').write_text(page)
print(json.dumps({'article_words': len(body.split()), 'public_handout':True, 'article':f'writing/{SLUG}.html', 'status':'publication-ready'}))

handout = ROOT / 'assets/sled-agent-public-guide.md'
handout.write_text(source)
archive(ROOT / 'assets/sled-agent-public-guide.zip', [handout], ROOT / 'assets')
