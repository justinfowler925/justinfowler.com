# Definition of done: skill distribution

A skill change is delivered only after its registered destinations serve the same tested release.
A source merge, local install, deployment READY, public 200, or generated ZIP alone is partial evidence.

The machine-readable population is `distribution.json`. Shine currently requires 14 destinations:
source main; Codex, Cursor and Claude skill links; both compatibility aliases; the public canonical
skill, self-contained Markdown, plugin and page; the portfolio registry and page; and Nucleus’s server-computed package attestation and access boundary. Historical articles retain their dated results and link to the current release.
Other skills should adopt the same contract with their own explicit destination inventory; do not
claim an unregistered skill is covered by Shine's release.

## Release chain

1. Test canonical source, including `python3 verify/distribution_test.py`, and merge it to main.
2. Run `python3 scripts/build-distribution.py` from that clean release. Public hosting runs this
   during every build, so Markdown and plugin contents cannot silently lag the canonical skill.
3. Run `node scripts/release.mjs`, then `python3 scripts/distribute.py link` to point all supported
   local agents at the immutable release. Existing real directories require deliberate migration;
   the link command only replaces symlinks or creates missing links.
4. In clean worktrees of current consumer main branches, run
   `python3 scripts/distribute.py prepare --nucleus <checkout> --portfolio <checkout>`.
   This regenerates Nucleus's source archive, source metadata and hashes, and the portfolio's
   release entry. Review/test/commit/merge those consumer changes. Never deploy an old branch.
5. Deploy Shine and the portfolio to their existing production projects. Deploy Nucleus with
   its `scripts/deploy.sh`, preserving its required tests and authentication boundary.
6. Run `python3 scripts/distribute.py verify --receipt <path>` on the Studio. Public file
   bodies must match canonical hashes. Nucleus computes the deployed ZIP checksum on its server
   at `/api/company-tools/shine/release`; compare it to the exact source package and check its
   timestamp. Anonymous and invalid-cookie requests to the catalog/download must redirect to login.
   No Studio sign-in or protected ZIP download is needed. This establishes package integrity and
   access protection, not an authenticated end-to-end file transfer. Missing evidence is incomplete.
   Studio receipts cover the nine hosted destinations; independently verify the five local agent
   links against the same source revision on their host. Both receipts are required for 14/14.
7. Attach the resulting receipts to the work item and report checked/required counts. Only a
   complete receipt permits a delivered claim. Recheck if source or a target changes.

## Automatic follow-through

At 9 AM and 9 PM America/Chicago, the Studio verifier checks hosted destinations. The current task's release monitor watches source main and the destination report. It continues
this chain whenever a registered destination is stale and notifies only on a delivered release
or an actionable blocker. It must create isolated worktrees, preserve unrelated edits, run the
consumer's required checks, and verify production before reporting done. A failed scheduled run
or missing credential leaves distribution incomplete. New skill locations must be added to the
inventory and negative-control tests before they count as covered.

Public exports are guidance, not the executable repository. The Nucleus archive includes the
repository and immutable source identity. Never bake browser cookies, local brand files, credentials,
node_modules or untracked work into a downloadable archive.
