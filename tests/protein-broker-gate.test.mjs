import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { ALLOWED_EMAIL, unlockDecision } from "../meat/protein-broker-gate.js";

const page = readFileSync(new URL("../meat/index.html", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");

test("only Tim's address unlocks", () => {
  assert.equal(ALLOWED_EMAIL, "tim@tmeekconsulting.com");
  assert.equal(unlockDecision("Tim@tmeekconsulting.com"), "ok");
  assert.equal(unlockDecision("other@chain.com"), "mismatch");
  assert.equal(unlockDecision("  "), "empty");
});

test("the brief is private and closed until the gate runs", () => {
  assert.match(page, /noindex,nofollow,noarchive/);
  assert.match(page, /id="brief" hidden/);
  assert.match(page, /protein-broker-gate\.js/);
  assert.match(page, /https:\/\/meat\.justinfowler\.com\//);
  assert.doesNotMatch(sitemap, /protein-broker\.html/);
  assert.doesNotMatch(page, /\/Users\/justinfowler\//);
});
