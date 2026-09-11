# Fowler Brain sales starter

Version: 0.1.0 · 2026-09-11 · Status: pilot candidate

This is an original, generic implementation of the article's recommendations. It contains no customer data, approved company claims, credentials, or live integrations. All account examples are fictional. Structure validation does not establish sales effectiveness or installation in your Claude workspace.

## Rep quick start: Claude chat

1. Use your company-authorized Claude workspace. Create a Project for the account or workstream.
2. Paste `PROJECT-INSTRUCTIONS.md` into the Project's instructions.
3. Add `METHOD-PACK.md`, `EXAMPLES.md`, and `TEMPLATES.md` to Project knowledge. Upload the individual Markdown files, rather than assuming a folder or ZIP is ingested as knowledge. These three files are the basic edition; no skill installation is required.
4. Add only permitted account material and approved company references. Use the account template to record source identity, date, and scope. If you lack sources, try the fictional example first.
5. Start a new chat: “Use Fowler Brain sales starter v0.1.0. Prepare a meeting brief from the fictional example in EXAMPLES.md. Show source labels and the important unknowns.” Compare the result with that file's acceptance notes.
6. Run the fresh-session and missing-source cases in `EVALUATION.md`. The phrase “I loaded it” is not a pass. Inspect the actual answer.
7. At the end of real work, ask for the handoff in `TEMPLATES.md`. Save the reviewed handoff into that account's permitted workspace and include it when resuming. A chat response alone is not a saved file.

Project instructions and knowledge are documented in [Claude's Project guide](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects). Product settings and organization controls can differ.

## Optional skill edition

Use `fowler-sales-method.zip`, distributed alongside this folder. It contains one top-level `fowler-sales-method/` folder, `SKILL.md`, and supporting references. The references are generated from the same method pack as the plain-text edition; do not edit the ZIP as a second source.

Where your workspace permits it, open Customize → Skills, choose the create/upload flow, upload the ZIP, and enable it. Code execution and file creation must be enabled under the applicable user or organization settings. Shared skills may need recipient enablement. [Installation instructions](https://support.claude.com/en/articles/12512180-use-skills-in-claude); [packaging guidance](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills).

Use the skill edition or the basic method pack as the procedural source in a given project. Avoid maintaining different versions of both. Keep Project instructions plus account sources in either case. Verify activation on the target surface. This package supplies no CRM or document connector.

## Other surfaces

For Cowork, attach a permitted folder holding this kit and set its project instructions from `PROJECT-INSTRUCTIONS.md`. Verify the mounted files and saved handoff with a new session. Cowork projects are local; manage distribution separately. [Cowork guide](https://claude.com/docs/cowork/guide/projects).

For Claude Code, install the `fowler-sales-method` directory in your supported skill scope; use the adapter in `CLAUDE-ADAPTER.md` after replacing the path with a verified location. Do not overwrite existing instructions. Check the installed version and exercise the method. [Skill locations](https://code.claude.com/docs/en/skills).

Native account skill synchronization is also documented for Cowork/cloud sessions and as an opt-in download for local Claude Code. Prefer that managed route when supported by your deployment; inspect the installed version and collisions with local skills. Skills and account knowledge have different scopes. [Current synchronization behavior](https://code.claude.com/docs/en/skills#skills-synced-from-claudeai).

For any additional client, identify its documented instruction and skill-loading mechanisms, adapt the entry point, and repeat the tests. An upload in Claude chat does not establish installation in another client.

## Method owner responsibilities

Assign an actual enablement owner before a team rollout. Review the methods with sales leadership. Add approved product claims, permitted source connections, and company-specific examples in an internal edition. Keep internal material out of this public starter.

Maintain the editable source in a versioned workspace. Each release should identify owner, audience, reviewed date, changed files, and rollback version. Retire superseded uploads. Maintain one receipt per intended role × surface × project. Re-run affected cases after changing the model, package, instructions, or connector permissions.

For a pilot, compare current work, a basic Claude setup, and the pack. Record total human review time as well as generation time. Never fill missing measurements with assumed gains.

The setup adds context and procedures at use time. It does not fine-tune Claude's model weights, grant access to systems, or guarantee that the rep learns the method.
