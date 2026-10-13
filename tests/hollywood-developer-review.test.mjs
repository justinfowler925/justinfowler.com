import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const page = read('writing/hollywood-developer-review.html');
const data = JSON.parse(read('assets/hollywood/review-20261012/results.json'));
const embedded = JSON.parse(page.match(/<script id="report-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
assert.deepEqual(embedded, data, 'Published results must match the visible report');
const urls = [data.baseline_url, ...data.cards.flatMap(c => ['video_url', 'audio_url', 'image_url'].map(k => c[k]).filter(Boolean))];
for (const url of urls) {
  assert(url.startsWith('/assets/hollywood/review-20261012/'), 'Public media must be independently hosted');
  assert(existsSync(new URL(url.slice(1), root)), url);
  if (url.endsWith('.mp4')) assert(existsSync(new URL(url.slice(1).replace(/\.mp4$/, '.jpg'), root)), 'Video poster required');
}
const manifest = JSON.parse(read('assets/hollywood/review-20261012/manifest.json'));
for (const entry of manifest.files) {
  const bytes = readFileSync(new URL(`assets/hollywood/review-20261012/${entry.file}`, root));
  assert.equal(bytes.length, entry.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256);
}
assert(!/tailbaa|tailscale|\.ts\.net|\/Users\/|\/Volumes\/|127\.0\.0\.1|localhost|api\/assets|9d2a197/i.test(page + JSON.stringify(data)), 'Public report must not expose private endpoints or deployment details');
assert(read('writing/hollywood.html').includes('/writing/hollywood-developer-review.html'));
assert(read('sitemap.xml').includes('/writing/hollywood-developer-review.html'));
assert(page.includes('earlier source-available snapshot'));
assert(page.includes('does not establish correct lip sync'));
assert(page.includes('Where developer help would matter'));
assert(page.includes('No replacement full-film cut is claimed'));
console.log(`Developer review: ${urls.length} public media references, matching results, asset integrity, privacy and navigation passed`);
