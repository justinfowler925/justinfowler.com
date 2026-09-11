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


refs = KIT / 'fowler-sales-method/references'
refs.mkdir(parents=True, exist_ok=True)
for name in ['METHOD-PACK.md', 'TEMPLATES.md', 'EXAMPLES.md']:
    (refs / name).write_bytes((KIT / name).read_bytes())

files = sorted(p for p in KIT.rglob('*') if p.is_file() and p.name != 'manifest.json')
manifest = {
    'name': 'fowler-brain-sales-starter', 'version': '0.1.0',
    'date': '2026-09-11', 'status': 'pilot-candidate',
    'author': 'Justin Fowler', 'team_maintainer': 'Assign before rollout',
    'audience': 'public-methods-and-synthetic-examples',
    'behavioral_validation': 'not-run-in-Claude',
    'files': {p.relative_to(KIT).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
}
(KIT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
archive(ROOT / 'assets/fowler-sales-method.zip', (KIT / 'fowler-sales-method').rglob('*.md'), KIT)
archive(ROOT / 'assets/fowler-brain-sales-starter.zip', [*files, KIT / 'manifest.json'], ROOT / 'assets')

source = (ROOT / f'writing/{SLUG}.md').read_text()
title, _, body = source.partition('\n\n')
title = title.removeprefix('# ')
byline, _, body = body.partition('\n\n')
sibling = (ROOT / 'writing/unfog.html').read_text()
css = re.search(r'<style>(.*?)</style>', sibling, re.S).group(1)
nav = re.search(r'<nav aria-label="Primary">.*?</nav>', sibling, re.S).group(0)
font_links = re.search(r'<link rel="preconnect".*?<link rel="stylesheet" href="../assets/tokens.css" />', sibling, re.S).group(0)
summary = 'An evidence-backed position on making AI working methods portable across Claude surfaces, projects, and sessions—with a practical sales starter kit.'
page = f'''<!doctype html>
<html lang="en" data-cite="shadcn-blog" data-product-pattern="fowler-editorial-article">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>{html.escape(title)} — Justin Fowler</title>
<meta name="description" content="{html.escape(summary)}" />
<meta name="author" content="Justin Fowler" />
<meta name="robots" content="noindex,nofollow" />
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
<div class="breadcrumb"><a href="/writing.html">Writing</a><span class="sep">/</span>Fowler Brain</div>
<div class="stamp">Position statement · Draft for review</div>
<h1 id="headline">{html.escape(title)}</h1>
<p class="lede" id="notes">Give salespeople maintained methods, trusted sources, and a way to verify the work—wherever they use AI.</p>
<p style="margin-top:var(--shine-space-5);color:var(--paper-2)">{html.escape(byline)}</p>
<div class="hero-actions" aria-label="Article resources">
<a class="btn primary" data-primary href="#starter">Get the starter kit</a>
<a class="btn" href="#evidence">Evidence and limitations</a>
</div>
</header>
<article id="report" class="prose">{markdown(body)}</article>
<section class="block" id="starter" data-shine-signature="fowler-brain-sales-method-release">
<h2 class="st">Try the method</h2>
<div class="prose"><p>The pilot kit includes Project instructions, three sales workflows, annotated fictional examples, a handoff template, and ten test cases. No customer data or live integrations are included.</p></div>
<div class="hero-actions">
<a class="btn primary" id="kit-download" href="../assets/fowler-brain-sales-starter.zip" download>Download the starter kit</a>
<a class="btn" id="skill-download" href="../assets/fowler-sales-method.zip" download>Download the Claude skill</a>
<a class="btn" href="../assets/fowler-brain-starter/START-HERE.md">Setup instructions</a>
</div>
</section>
<details id="evidence"><summary>Evidence and limitations</summary>
<p>Research and product documentation were checked on 11 September 2026. The article links supporting sources at the relevant claims. Field studies, controlled experiments, vendor engineering guidance, and the author's recommendations have different evidentiary weight.</p>
<p>The proposed architecture and starter kit have not been validated in a sales-team trial. Packaging and rendering checks do not demonstrate Claude behavior, cross-surface installation, human learning, or revenue improvement. Product behavior must be checked against the actual workspace and version.</p>
</details>
</main>
<footer><span>© 2026 · Justin Fowler</span><span>Draft · 11 September 2026</span><a href="/writing.html">More writing</a></footer>
</div></body></html>'''
(ROOT / f'writing/{SLUG}.html').write_text(page)
print(json.dumps({'article_words': len(body.split()), 'kit_files':len(files)+1, 'article':f'writing/{SLUG}.html', 'status':'draft-not-published'}))
