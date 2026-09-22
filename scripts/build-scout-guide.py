"""Render the public Scout README in the existing portfolio editorial shell."""
from pathlib import Path
import html
import re
root = Path(__file__).resolve().parents[1]
source = (root / 'data/scout-guide.md').read_text()
sibling = (root / 'writing/fowler-brain-for-sales.html').read_text()
style = re.search(r'<style>(.*?)</style>', sibling, re.S).group(1)
style += '''\n.prose { max-inline-size: 65ch; } .prose ul,.prose ol {padding-inline-start:var(--shine-space-5);display:grid;gap:var(--shine-space-3);} .prose a {color:var(--accent-2);text-underline-offset:var(--shine-space-1);} .prompt {white-space:normal;overflow-wrap:anywhere;} button.btn {cursor:pointer;} .hero-actions a,.btn {min-height:44px;} .guide-nav {display:flex;flex-wrap:wrap;gap:var(--shine-space-4);padding-bottom:var(--shine-space-6);} .guide-nav a {padding-block:var(--shine-space-3);} :focus-visible {outline:2px solid var(--accent);outline-offset:4px;} @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.mark .dot{animation:none}}\n'''
def inline(s):
 s=html.escape(s)
 s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',s)
 return re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',s)
parts=source.split('\n## ')
body=[];counter=0
for section in parts[1:]:
 title,_,text=section.partition('\n');slug=re.sub('[^a-z0-9]+','-',title.lower()).strip('-')
 body.append(f'<section class="block" id="{slug}"><h2 class="st">{html.escape(title)}</h2><div class="prose">')
 for block in text.strip().split('\n\n'):
  lines=block.splitlines()
  if block.startswith('> '):
   counter+=1
   body.append(f'<div><p class="prompt" id="prompt-{counter}">{inline(block[2:])}</p><button class="btn" type="button" data-copy="prompt-{counter}">Copy request</button><p role="status" data-copy-status></p></div>')
  elif all(x.startswith('- ') for x in lines):body.append('<ul>'+''.join('<li>'+inline(x[2:])+'</li>' for x in lines)+'</ul>')
  elif re.match(r'1\. ',block):body.append('<ol>'+''.join('<li>'+inline(re.sub(r'^\d+\. ','',x))+'</li>' for x in lines)+'</ol>')
  else:body.append('<p>'+inline(block)+'</p>')
 body.append('</div></section>')
page='''<!doctype html><html lang="en" data-cite="shadcn-blog" data-product-pattern="fowler-editorial-article" data-shine-voice="house" data-shine-adaptation="adapted"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Scout — research, ingestion and reusable findings</title>
<meta name="description" content="Meet Scout and learn how to request background research, ingest approved CRM records and reuse cited findings. Includes access requirements and example prompts.">
<link rel="canonical" href="https://justinfowler.com/writing/scout.html"><meta property="og:title" content="Scout — research you can reuse"><meta property="og:description" content="A practical guide to Scout, the research and data-ingestion assistant."><meta property="og:type" content="article"><meta property="og:url" content="https://justinfowler.com/writing/scout.html">
<link rel="icon" href="../favicon.svg"><link rel="stylesheet" href="../assets/tokens.css"><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..900,0..100&family=JetBrains+Mono:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet"><style>'''+style+'''</style></head><body>
<a class="skip" href="#guide">Skip to guide</a><div class="container"><nav aria-label="Main navigation"><a class="mark" href="/">Justin Fowler</a><div class="nav-links"><a href="/open-source.html">Public work</a><a href="https://github.com/justinfowler925/scout">Scout repository</a></div></nav>
<main id="guide"><header class="hero"><p class="stamp">Scout · Preview · Public guide</p><h1>Research you can <em>reuse.</em></h1><p class="lede">Scout collects evidence, prepares cited briefs, and keeps findings available to your connected tools.</p><p class="byline">By Justin Fowler · Updated September 22, 2026</p><div class="hero-actions"><a class="btn primary" href="#your-first-request">Prepare your first request</a><a class="btn" href="#get-access">Check access</a></div></header>
<div class="prose"><p>Scout is a research and data-ingestion assistant running as a private service. This guide explains the workflow; it does not install the service or grant access to company data.</p></div>
<nav class="guide-nav" aria-label="Guide sections"><a href="#what-scout-does">Capabilities</a><a href="#ingest-a-bounded-set-of-records">Ingestion</a><a href="#reuse-existing-findings">Reuse findings</a><a href="#review-before-acting">Review checklist</a></nav>
'''+''.join(body)+'''</main><footer><p><a href="https://github.com/justinfowler925/scout">Edit this guide on GitHub</a> · <a href="https://nucleus-clearspeed.vercel.app/company-tools">Nucleus Company Tools</a></p><p>© 2026 Justin Fowler · <a href="/privacy.html">Privacy</a></p></footer></div>
<script>for(const button of document.querySelectorAll('[data-copy]'))button.addEventListener('click',async()=>{const status=button.parentElement.querySelector('[data-copy-status]');try{await navigator.clipboard.writeText(document.getElementById(button.dataset.copy).textContent);status.textContent='Copied. Replace the brackets before sending in a Scout-connected session.';}catch{status.textContent='Copy unavailable. Select and copy the request above.';}});</script></body></html>'''
(root/'writing/scout.html').write_text(page)
