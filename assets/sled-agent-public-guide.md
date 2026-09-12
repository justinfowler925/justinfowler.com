# How to use SLED Agent in Claude Cowork

By Justin Fowler · Updated September 11, 2026

SLED Agent helps a rep answer a practical question: **Where should we start in this state, and what evidence supports that choice?** Give it a state and any approved context you already have. It researches agency workflows, checks whether there is a credible use for Clearspeed, maps buyer roles and funding, and recommends a next step.

The result is a research brief and a reusable state record. You still review the evidence and decide what to do. The agent can draft outreach; it does not send it or update your CRM.

## Start with the shared skill

Our team uses Claude Cowork in the Clearspeed Enterprise workspace. Open [SLED Agent setup and training in Nucleus](https://nucleus-clearspeed.vercel.app/company-tools/sled-agent), sign in, and follow the shared Claude skill link. Install or enable SLED Agent in Customize → Skills. Then start a Cowork task with a permitted working folder.

The shared copy is available to the organization. You do not need a terminal or a local ZIP upload to use it. Shared availability and automatic enablement are different: check that it is enabled in your own account. If it is missing, first confirm you selected the Clearspeed workspace, then check with the workspace owner.

Claude also supports organization-owner provisioning, which makes a skill available centrally without individual uploads. We have shared SLED Agent in the organization directory; we have not claimed owner provisioning for this release. [Claude organization skill documentation](https://support.claude.com/en/articles/13119606-provision-and-manage-skills-for-your-organization).

## Your first task: research one state

Start with one state. Attach approved product evidence if you have it. Add an agency, existing relationship or deadline only when it is real. If you already have a capture record for that state, attach the latest version.

Copy this prompt and replace Arizona with your state:

**Use SLED Agent to discover Arizona for Clearspeed. Examine the state broadly before choosing an entry use case. Show ranked candidates, failed fit tests, funding stages, buyer roles, the strongest alternative, missing evidence, one outreach draft and a next-action plan. Use current official sources. Do not send anything. Save a dated brief and reusable state record.**

Current research needs web tools permitted by your workspace. If those tools or a source are unavailable, the agent should identify the gap. It should not invent findings or pretend an old fact was checked today.

## What a useful answer looks like

A useful answer makes a recommendation you can inspect. It should contain:

- A leading agency/workflow candidate and why it deserves attention.
- An alternative, plus candidates rejected or left unresolved by the fit tests.
- Buyer roles and funding/procurement evidence, with dates and sources.
- Missing facts that could change the recommendation.
- An unsent outreach draft and a concrete next action.
- A dated report and a state record you can bring to the next task.

“No qualifying candidate yet” can be a good answer. A large budget or a fraud headline does not by itself establish a buyer, a suitable workflow or money available for this purchase.

## Check the answer before acting

Open the three citations most important to the leading recommendation. Does each source actually support the claim? Is the time period correct? Is the money proposed, available or already obligated? Does the identified person own the workflow, approve the budget or run procurement? Those are different roles.

Ask the agent to explain the precise workflow and the attestation being checked. Then test what is missing: existing controls, review volume, procurement route, buyer authority or product evidence. Use those gaps to shape the next conversation instead of turning a tentative lead into a qualified deal.

Nucleus includes a dated Nevada example, the full method, practice scenarios and an answer key. The example is teaching material, not a current recommendation to pursue those agencies.

## Continue after a call

Keep the brief and state record in your approved working folder. Add the facts learned on the call, naming the source and date. In a new task, attach the latest state record and ask:

**Refresh Arizona using the attached prior state record. Show new and materially changed findings, facts rechecked without change, carried-forward facts not rechecked, and failed collection. Preserve original dates and stable IDs. Save the next dated brief and updated state record.**

Do not assume a fresh chat remembers the previous work. The saved record is the handoff. Check the files were actually created; if file creation is unavailable, save the copyable record yourself.

## Use the files elsewhere

[Nucleus Company Tools](https://nucleus-clearspeed.vercel.app/company-tools) holds the current skill downloads and supporting material. The SLED page offers the standalone Cowork skill ZIP, the complete training packet and individual Markdown files. The packet includes learner and facilitator guides, prompts, exercises, an answer key, a worked example and the original method.

For another approved Claude workspace, upload the **Cowork skill ZIP**, not the complete training packet. For Claude Projects or Claude Code, follow START-HERE.md in the full packet; those are different installation paths. The private SLED package stays behind company sign-in. This public page and its handout explain the workflow without redistributing the internal method.

## The other shared skills

Shine helps review and improve an interface or document; its Cowork edition supplies design guidance, not the full local verifier runtime. Unfog turns a vague request into concrete work and checks whether it is finished. Strike Package prepares a sourced brief for a specific professional meeting. Choose the skill for the task; none of these replaces SLED Agent's state capture method.

The [public Cowork downloads](https://justinfowler.com/assets/cowork-skills/START-HERE.md) provide those three general-purpose editions for use elsewhere. Team members should use the shared copies linked from Nucleus. A skill does not grant connectors, account access or tools that your workspace does not already have.

## About the previous version of this page

The earlier article and generic Fowler sales-method starter kit did not explain this SLED Agent. They have been retired. This page now covers the actual agent and its setup, and the old download addresses direct readers here. Previously downloaded copies cannot be updated remotely; replace them with the current materials from Nucleus.
