import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const article=read('writing/hollywood.html'),post=read('writing/hollywood.linkedin.txt'),registry=JSON.parse(read('data/public-work.json'));
assert.equal((article.match(/<video\b/g)||[]).length,3);
assert.equal((article.match(/preload="none"/g)||[]).length,3);
for(const scene of ['ocean','forest','cabin']){for(const ext of ['mp4','jpg'])assert(existsSync(new URL(`assets/hollywood/${scene}.${ext}`,root)));assert(article.includes(`/assets/hollywood/${scene}.mp4`));}
assert(article.includes('https://justinfowler.com/writing/hollywood.html'));
assert.equal(registry.items.find(x=>x.slug==='hollywood').publicPage,'/writing/hollywood.html');
assert(read('writing.html').includes('/writing/hollywood.html'));assert(read('sitemap.xml').includes('/writing/hollywood.html'));
assert(post.length<3000);
const exposed=[article,post,read('assets/hollywood/measurements.json')].join('\n');
assert(!/\/Users\/|\/Volumes\/|localhost|127\.0\.0\.1/i.test(exposed),'No private system references in publication');
assert(article.includes('earlier source-available snapshot'));assert(article.includes('whole-machine RAM'));assert(article.includes('synthesized'));
console.log('Hollywood publication: media, source scope, disclosure, navigation, metadata and privacy checks passed');
