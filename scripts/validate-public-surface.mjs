import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const registry = JSON.parse(await readFile(resolve(root, 'data/public-work.json'), 'utf8'));
const failures = [];

for (const item of registry.items.filter((entry) => entry.publish)) {
  if (item.publicPage) {
    const cleanPath = item.publicPage.split('#')[0].replace(/^\//, '') || 'index.html';
    try { await access(resolve(root, cleanPath)); }
    catch { failures.push(`${item.slug}: publicPage does not exist: ${item.publicPage}`); }
  }
}

const tracked = (await import('node:child_process')).execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard'],
  { cwd: root, encoding: 'utf8' }
).trim().split('\n').filter(Boolean);
const forbiddenFiles = tracked.filter((file) => /(^|\/)(\.env(?:\..*)?|\.vercel\/project\.json|id_rsa|id_ed25519)$/i.test(file));
for (const file of forbiddenFiles) failures.push(`tracked sensitive file: ${file}`);

const textFiles = tracked.filter((file) => /\.(?:html|js|mjs|json|md|txt|xml|ya?ml)$/i.test(file));
const secretPatterns = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['GitHub token', /\bgh[opsu]_[A-Za-z0-9]{30,}\b/],
  ['local filesystem path', /\/Users\/justinfowler\//]
];
for (const file of textFiles) {
  const body = await readFile(resolve(root, file), 'utf8');
  for (const [label, pattern] of secretPatterns) {
    if (pattern.test(body)) failures.push(`${file}: contains ${label}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`${registry.items.filter((entry) => entry.publish).length} public records and ${tracked.length} tracked files passed exposure checks`);
