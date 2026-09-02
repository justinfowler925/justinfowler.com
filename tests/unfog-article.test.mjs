import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const article = readFileSync(new URL("../writing/unfog.html", import.meta.url), "utf8");
const archive = readFileSync(new URL("../writing.html", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
const socialImage = readFileSync(new URL("../assets/unfog-article.svg", import.meta.url), "utf8");

const repoUrl = "https://github.com/justinfowler925/unfog";
const linkedInUrl = "https://www.linkedin.com/pulse/i-built-unfog-because-write-better-spec-usually-wrong-justin-fowler-awysc/";

assert.match(article, /<link rel="canonical" href="https:\/\/justinfowler\.com\/writing\/unfog\.html"/);
assert.match(article, /<html lang="en" data-cite="magicui-hero"/);
assert.match(article, /<meta property="article:published_time" content="2026-08-27"/);
assert.equal((article.match(new RegExp(repoUrl, "g")) ?? []).length >= 2, true, "article must expose the repository at the start and finish");
assert.match(article, new RegExp(linkedInUrl));
assert.match(archive, /href="\/writing\/unfog\.html"/);
assert.match(archive, /5 posts shipped/);
assert.match(archive, /Last shipped · 2026-09-01/);
assert.match(sitemap, /<loc>https:\/\/justinfowler\.com\/writing\/unfog\.html<\/loc>/);
assert.match(sitemap, /<lastmod>2026-08-27<\/lastmod>/);
assert.match(article, /<img src="\.\.\/assets\/unfog-article\.svg"/);
assert.match(socialImage, /Compressed intent in\. Evidence-backed execution out\./);
assert.doesNotMatch(article + archive + sitemap + socialImage, /localhost|127\.0\.0\.1/);

console.log("unfog article wiring: 12 checks passed");
