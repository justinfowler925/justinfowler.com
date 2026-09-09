import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const registryPath = resolve(root, 'data/public-work.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const checkOnly = process.argv.includes('--check');

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

function validate(item) {
  const required = ['slug', 'name', 'kind', 'publish', 'repoVisibility', 'summary', 'proof', 'repo', 'tags'];
  for (const key of required) {
    if (item[key] === undefined || item[key] === '') throw new Error(`${item.slug || 'item'}: missing ${key}`);
  }
  if (!['skill', 'project'].includes(item.kind)) throw new Error(`${item.slug}: invalid kind`);
  if (item.publish !== true) throw new Error(`${item.slug}: unpublished records do not belong in the public registry`);
  if (item.repoVisibility !== 'public') throw new Error(`${item.slug}: only explicitly public repos may render`);
  const repoPrefix = `https://github.com/${registry.owner}/`;
  if (!item.repo.startsWith(repoPrefix)) throw new Error(`${item.slug}: repo must belong to ${registry.owner}`);
  if (item.sourceFile && !item.sourceFile.startsWith(`${item.repo}/blob/`)) throw new Error(`${item.slug}: sourceFile must live in its repo`);
  if (item.publicPage && !item.publicPage.startsWith('/')) throw new Error(`${item.slug}: publicPage must be a local public path`);
  if (!Array.isArray(item.tags) || item.tags.length < 2) throw new Error(`${item.slug}: at least two tags required`);
}

const items = registry.items.filter((item) => item.publish === true);
items.forEach(validate);
if (new Set(items.map((item) => item.slug)).size !== items.length) throw new Error('Duplicate public-work slug');

function renderCard(item) {
  const links = [
    item.sourceFile ? `<a href="${escapeHtml(item.sourceFile)}" target="_blank" rel="noopener noreferrer">Open SKILL.md ↗</a>` : '',
    item.publicPage ? `<a href="${escapeHtml(item.publicPage)}">Read public page →</a>` : '',
    `<a href="${escapeHtml(item.repo)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>`
  ].filter(Boolean).join('\n          ');
  const tags = item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  return `      <article class="public-work-card" data-public-work-kind="${item.kind}" id="open-${escapeHtml(item.slug)}">
        <div class="public-work-card-top">
          <span class="public-work-kind">${item.kind === 'skill' ? 'Skill file' : 'Project'}</span>
          <span class="public-work-state">Public · source available</span>
        </div>
        <h3>${escapeHtml(item.name)}</h3>
        ${item.previewVideo ? `<video controls playsinline preload="none" poster="${escapeHtml(item.previewPoster)}" aria-label="Hollywood procedural forest preview" style="width:100%;height:auto;border-radius:8px"><source src="${escapeHtml(item.previewVideo)}" type="video/mp4"></video><p class="public-work-proof">Four-second silent procedural forest prototype.</p>` : ''}
        <p class="public-work-summary">${escapeHtml(item.summary)}</p>
        <p class="public-work-proof">${escapeHtml(item.proof)}</p>
        <div class="public-work-tags" aria-label="Topics">${tags}</div>
        <div class="public-work-links">${links}</div>
      </article>`;
}

const cards = items.map(item => renderCard(item).replace(/^[ \t]+$/gm, '')).join('\n');
const replacements = [
  {
    file: 'portfolio.html',
    start: '<!-- public-work:portfolio:start -->',
    end: '<!-- public-work:portfolio:end -->',
    content: cards
  },
  {
    file: 'open-source.html',
    start: '<!-- public-work:index:start -->',
    end: '<!-- public-work:index:end -->',
    content: cards
  },
  {
    file: 'open-source.html',
    start: '<!-- public-work:stats:start -->',
    end: '<!-- public-work:stats:end -->',
    content: `<div class="registry-stat"><strong>${items.length}</strong><span>Published entries</span></div>
        <div class="registry-stat"><strong>${items.filter((item) => item.kind === 'skill').length}</strong><span>Skill files</span></div>
        <div class="registry-stat"><strong>${items.filter((item) => item.kind === 'project').length}</strong><span>Projects</span></div>
        <div class="registry-stat"><strong>1</strong><span>Curated registry</span></div>`
  }
];

let changed = 0;
for (const replacement of replacements) {
  const path = resolve(root, replacement.file);
  const original = await readFile(path, 'utf8');
  const startIndex = original.indexOf(replacement.start);
  const endIndex = original.indexOf(replacement.end);
  if (startIndex < 0 || endIndex < 0 || endIndex < startIndex) throw new Error(`${replacement.file}: generated markers missing or out of order`);
  const generated = `${replacement.start}\n${replacement.content}\n    ${replacement.end}`;
  const next = original.slice(0, startIndex) + generated + original.slice(endIndex + replacement.end.length);
  if (next !== original) {
    changed += 1;
    if (!checkOnly) await writeFile(path, next);
  }
}

if (checkOnly && changed) {
  throw new Error(`${changed} generated page(s) are stale; run node scripts/build-public-work.mjs`);
}
console.log(`${items.length} published records validated; ${checkOnly ? 'generated pages current' : `${changed} page(s) updated`}`);
