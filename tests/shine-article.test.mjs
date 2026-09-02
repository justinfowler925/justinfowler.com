import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";

const article = readFileSync(new URL("../writing/shine.html", import.meta.url), "utf8");
const archive = readFileSync(new URL("../writing.html", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
const home = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const portfolio = readFileSync(new URL("../portfolio.html", import.meta.url), "utf8");
const socialImage = readFileSync(new URL("../assets/shine-article.svg", import.meta.url), "utf8");

const repoUrl = "https://github.com/justinfowler925/shine";
const skillUrl = "https://shine-blond.vercel.app/skill";
const liveUrl = "https://shine-blond.vercel.app";

assert.match(article, /<link rel="canonical" href="https:\/\/justinfowler\.com\/writing\/shine\.html"/);
assert.match(article, /<html lang="en" data-cite="shadcn-marketing"/);
assert.match(article, /v4\.0\.2/);
assert.match(article, /I Rebuilt Shine Until It Could Rebuild Itself/);
assert.match(article, /<meta property="article:published_time" content="2026-09-01"/);
assert.equal((article.match(new RegExp(repoUrl, "g")) ?? []).length >= 2, true, "article must expose the repository at the start and finish");
assert.equal((article.match(new RegExp(skillUrl, "g")) ?? []).length >= 2, true, "article must expose the skill page at the start and finish");
assert.match(article, new RegExp(liveUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(archive, /href="\/writing\/shine\.html"/);
assert.match(archive, /6 posts shipped/);
assert.match(archive, /Last shipped · 2026-09-01/);
assert.match(sitemap, /<loc>https:\/\/justinfowler\.com\/writing\/shine\.html<\/loc>/);
assert.match(sitemap, /<lastmod>2026-09-01<\/lastmod>/);
assert.match(article, /<img src="\.\.\/assets\/shine-v3-before\.png"/);
assert.match(article, /<img src="\.\.\/assets\/shine-v4-after\.png"/);
assert.ok(statSync(new URL("../assets/shine-v3-before.png", import.meta.url)).size > 100000);
assert.ok(statSync(new URL("../assets/shine-v4-after.png", import.meta.url)).size > 100000);
assert.match(socialImage, /I rebuilt Shine until/);
assert.match(socialImage, /GITHUB\.COM\/JUSTINFOWLER925\/SHINE/);
assert.match(home, /href="\/writing\/shine\.html"/);
assert.match(home, />Shine</);
assert.match(portfolio, /href="\/writing\/shine\.html"/);
assert.ok(portfolio.includes(repoUrl), "portfolio must link the GitHub repo");
assert.ok(portfolio.includes(skillUrl), "portfolio must link the skill page");
assert.doesNotMatch(article + archive + sitemap + socialImage + home, /localhost|127\.0\.0\.1/);

console.log("shine V4 article wiring: metadata, before/after proof, archive, portfolio, and conversion paths pass");
