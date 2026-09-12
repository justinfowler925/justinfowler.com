# Media layout and completion proof

Media and editorial are distinct packet categories. Broadcasts own a player, controls, role/context
selection and transcript; written coverage belongs in its own publication structure. Do not reuse
an assistant chat reference for a TV section.

## Executable layout contract

Copy `verify/fixtures/media-layout/layout.json` as a starting point and replace selectors and content
with the consumer's real DOM. Version 1 requires named assertions, mobile and desktop viewports,
long-content mutations, enlarged text, missing-media coverage (or a reason there is no media),
and loaded-video coverage for video surfaces. The default matrix is 390, 768, 1280, 1440 and 1920
pixels across baseline, long-content, missing-media, media-loaded and large-text states.
Assertions support gap bounds, aspect ratio, visibility and overflow. Missing or ambiguous targets
fail. The verifier also detects unused space in media ancestors independently of named assertions.
Use bounding edges between the actual frame/caption/controls, not a convenient outer card that
would conceal the defect. Synthetic canvas streams test intrinsic video dimensions and loading;
they do not prove the real provider connects or that spoken scripts are correct.

Each critical or major diagnosis defect needs a stable `id` and an `assertions` array containing
layout check ids or `flow:<id>` from the usability contract. Every layout assertion must pass in
every scenario. Prose alone does not close a defect.

## Run and report

```sh
node verify/prove.mjs <url-or-file> --cite <template> \
  --layout shine-layout.json --usability shine-usability.json \
  --diagnosis shine-diagnosis.json --json /tmp/shine-proof.json \
  --receipt /tmp/shine-completion.json
```

Omit diagnosis only for new surfaces. Reports separate accessibility, styling, layout, interactions,
reference validity, visual comparison, defect assertions and build binding. Any failed check fails
the run; missing evidence is `not_tested` and the overall result is incomplete. Only a complete run
writes a completion receipt. Existing measure/compare receipts are partial evidence, not overall
completion. Never manually create, alter or reuse receipts as proof for another artifact.

For HTTP targets add `--project <clean-git-checkout> --commit <sha> --build-id <build>`.
The served response must expose `x-shine-source-commit` and `x-shine-build-id` headers, or matching
`shine-source-commit` and `shine-build-id` meta tags. Populate them from the real build pipeline.
The rendered URL must match the requested URL, HTTP status must be successful and the source commit
must match the clean checkout. Receipts record render/screenshot hashes and expire after 20 minutes;
validation rejects changed source or a supplied mismatching build. Use `--storage-state <file>`
for authenticated browser sessions. Keep credentials and storage-state files outside version control.

## Reference health

New captures check HTTP status, error/challenge headings and a meaningful component selector or
expected text. Metadata binds the screenshot hash, source URL, capture time and local source hash.
Known failed captures are excluded from retrieval. Old captures without evidence remain explicitly
unverified and cannot support complete proof. Re-capture them through `corpus/harvest.mjs` with
semantic expectations; do not hand-author validation metadata. Authored local reference pages use
`node corpus/capture-local.mjs <id>` followed by `node corpus/materialize-packs.mjs <id>`.

The media regression suite exercises the old empty-wrapper failure, hard and soft 404s, missing
assertions, source/build mismatch, real HTTP completion receipts and incomplete-run refusal.
Run `node verify/media-layout.test.mjs`; it is also included in doctor.
