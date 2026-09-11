# Your Best Working Methods Should Travel With Your Team

By Justin Fowler · Position statement for review · 11 September 2026

Builders have learned to give AI more than a request. We give it a working environment: relevant context, reusable procedures, tools that can reach the source, examples of acceptable work, and checks before delivery.

Salespeople deserve that environment too.

My position is that a team's best working methods should become maintained, portable assets that people can use inside the AI surfaces where they already work. I call my version Fowler Brain. The name matters less than the responsibility: make good judgment easier to apply, inspect, and improve across projects and sessions.

This is the standard I think we should work toward. It is a recommendation informed by research and documented product behavior, not a claim that my current setup is the finished answer or that this exact architecture has been experimentally proven.

## What the evidence supports

There is a credible reason to invest in distributing expertise. In *Generative AI at Work*, researchers studied 5,172 customer-support agents during a staggered rollout. AI assistance increased issues resolved per hour by about 15% on average; less experienced workers benefited more. That is evidence from customer support, not a forecast of sales lift. It suggests that useful working knowledge can become more accessible through AI. [Read the published study](https://academic.oup.com/qje/article/140/2/889/7990658).

There is equally good reason to test the boundaries. In the BCG consultant experiment, AI helped on tasks within its capabilities, but participants using it were 19 percentage points less likely to answer one deliberately difficult business problem correctly. The result concerns those tasks and that model generation. It makes a durable point: apparent fluency is an unreliable acceptance test. [Read the study](https://www.hbs.edu/ris/Publication%20Files/dell-acqua-et-al-2026-navigating-the-jagged-technological-frontier_5c589c8c-fbb5-458f-b285-c944746cd717.pdf).

Builders are subject to the same discipline. METR's early-2025 randomized study found that 16 experienced open-source developers took 19% longer with AI on 246 tasks. Its February 2026 follow-up reported serious selection and measurement problems and could not establish a reliable current effect. We should borrow builders' methods, then measure whether they help our people. [Original experiment](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/); [follow-up and limitations](https://metr.org/blog/2026-02-24-uplift-update/).

These findings support a disciplined trial. They do not prove that uploading a folder improves revenue, that every skill helps, or that more autonomous agents produce better work.

## Build a library with clear ownership

I would organize a brain around three different responsibilities.

**The shared method library** holds approved procedures, product claims, templates, examples, and reviewed lessons. Give each asset an owner, version, source, review date, and audience. A small team can maintain this in a versioned document workspace. A builder-supported team can keep the source in Git and publish simpler packages for everyone else.

**The account workspace** holds only the context the current user is authorized to use for that account: the objective, source references, buying-process evidence, decisions, and unresolved questions. Shared methods should travel between accounts. Confidential account context should follow access boundaries.

**The system of record** owns live state. Opportunity stage, current pricing, approved commitments, and task completion should be read from their responsible systems. A remembered CRM value is a dated observation. It should not silently become today's truth.

This is my architecture recommendation. One maintained source per asset reduces conflicting copies; it does not require one giant database containing every kind of information.

The public version of a personal brain should contain reusable methods and synthetic examples. The internal sales edition should add approved company knowledge. Each rep's private preferences and each customer's restricted material need their own scope. Exporting my whole personal archive would be a poor way to enable a team.

## Make the entry point small and the depth retrievable

Every supported surface needs a short entry point that explains the purpose of the library, how to select the relevant method, where authoritative facts live, and what to do when access is missing.

The rest should be loaded when needed. Anthropic's context-engineering guidance recommends curating useful context and retrieving detail on demand. That is engineering guidance from a vendor, not an independent trial of our sales process. [Read the guidance](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).

Earlier research, *Lost in the Middle*, also found that tested models' performance depended on where relevant information appeared in long inputs. It is a reason to test retrieval and placement, not a claim that every current model fails identically. [Read the paper](https://arxiv.org/abs/2307.03172).

For a meeting brief, Claude should retrieve the meeting method, the account packet, and the few approved claims relevant to the conversation. It should not have to absorb every proposal, transcript, policy, and abandoned experiment before it begins.

An index is useful only if its targets are accessible. A URL written in an instruction does not prove the session can authenticate, retrieve the file, or select the relevant passage. The setup must survive a fresh-session test.

## Translate builder habits into sales jobs

The transfer should happen at the level of decisions and deliverables.

**Clarify the outcome.** Before creating a briefing, identify the account, meeting, audience, decision to support, and constraints. Resolve discoverable details from available sources. Ask about gaps that materially change the work.

**Establish the evidence.** Separate buyer statements, approved product facts, public signals, and the rep's hypotheses. Record the source and date. A hiring announcement can support a discovery question; it cannot establish a buying budget.

**Use a repeatable method.** A meeting brief should connect evidence to a small number of discussion angles and questions. An objection response should distinguish a verified capability from something needing product confirmation. A follow-up should distinguish a buyer's commitment from our suggested next step.

**Define acceptable output.** Specify the audience, length, required fields, and quality checks. Use annotated examples to show why a good answer is good. Include a plausible but unacceptable example so the boundary is visible.

**Verify the delivered result.** Open the generated document. Check that citations support the associated claims. Recalculate numbers from the inputs. If a CRM update was authorized, read the resulting record back. A statement that something was saved is weaker evidence than the saved artifact.

**Capture a reusable lesson.** Save a correction with its scope, evidence, and proposed change. The method owner reviews it before it changes the shared standard. One successful call is a useful observation; it does not establish a universal rule.

Start with three jobs: prepare for a meeting, turn discovery into an evidence-based next step, and draft the follow-up. Add proposal work, deal review, and forecasting only when their prerequisites and tests are clear.

## Give Claude both instructions and working assets

A useful package should contain a short working agreement, a method for each supported job, output templates, annotated examples, and a small set of test cases. It also needs a release manifest so someone can tell which version a session is using.

Agent Skills provide a documented way to package procedural instructions and supporting resources for compatible agents. The open format supports portability; each product still has to discover and execute the skill correctly. [Anthropic's explanation](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills); [Agent Skills specification](https://agentskills.io/specification).

A skill tells Claude how to approach a task. A connector gives it access to a system. A template defines the output. A reference supplies knowledge. Installing one does not supply the others.

Uploading these assets supplies context at use time. It does not fine-tune the model's weights or guarantee that either Claude or the rep will retain everything.

For sales, I would connect an approved document source and CRM before adding a broad catalog of tools. Add meeting records, web research, and document creation where they serve the chosen jobs. Use a calculation tool for arithmetic that matters. Test the identity and permission scope of every connection. Empty search results from one account do not prove the information does not exist.

The package should describe tools by purpose and required capability, with the installed connector named in a local configuration note. This keeps the method useful when a vendor or interface changes. Anthropic's tool-design guidance supports clear tool boundaries and evaluation of actual tool use. [Read the engineering guidance](https://www.anthropic.com/engineering/writing-tools-for-agents).

## Install deliberately on each surface

**Claude chat Projects:** put the short working agreement in Project instructions and the approved method pack in Project knowledge. Use account-specific projects when access or context requires separation. Explicitly install or attach the shared material in each project that needs it. Project instructions apply within that project; project memory has a separate scope. Do not assume one project's learning reaches every other project. [Project setup](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects); [memory behavior](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context).

**Claude Skills:** where enabled by the workspace, install the method as a custom skill and test its activation. The current documented path is Customize → Skills. A rep can use the plain-text method pack if the workspace does not expose skill installation. [Current installation guidance](https://support.claude.com/en/articles/12512180-use-skills-in-claude).

**Claude Cowork:** attach the permitted folders and set the project's instructions. Current documentation distinguishes local Cowork projects from cloud chat Projects; linking a chat Project supplies access to its knowledge without merging the two. Local folders need a separate distribution and update process. [Cowork project documentation](https://claude.com/docs/cowork/guide/projects).

**Claude Code:** use the documented `CLAUDE.md` entry points for user or project instructions and install the relevant skill in a supported skill location. Keep global guidance small. Check what actually loaded. `AGENTS.md` is not automatically interchangeable with `CLAUDE.md`; Claude Code documents an explicit import. [Claude Code memory documentation](https://code.claude.com/docs/en/memory).

**Other agents and future surfaces:** retain the same method source and write a small adapter for the destination. Test the adapter on that surface. Compatibility is a result to demonstrate, not something a file extension guarantees.

Use native synchronization where it is documented. Claude currently documents account-enabled skills loading in Cowork and cloud sessions, plus an opt-in download path for local Claude Code. Verify the installed version and name collisions; skill synchronization does not merge account context, live records, or every kind of memory. [Skill synchronization and scope](https://code.claude.com/docs/en/skills#skills-synced-from-claudeai).

Product menus and capabilities change. The durable requirement is a verified route from the maintained source to the material a fresh session actually uses.

## Define what “accessible everywhere” means

I would accept a surface only after it passes these checks:

1. A fresh session identifies the installed method version and uses a distinctive rule from it on a real task.
2. A second project retrieves the shared method without being given the first project's confidential account context.
3. A new session resumes from a saved handoff containing the objective, decisions, sources, open questions, and next action.
4. A release update changes a harmless test instruction; the new session exhibits the new behavior. Reverting the release restores the prior behavior.
5. Missing access produces an explicit limitation. Conflicting sources remain visible. A restricted document stays unavailable in an unauthorized test account.

Asking “Did you read the brain?” is insufficient. Inspect the output and the source or tool evidence. Instructions can guide an assistant; actual permissions must enforce access. Claude Code explicitly distinguishes instructions from enforced settings. [Enforcement boundary](https://code.claude.com/docs/en/memory).

A practical release receipt should record the user role, surface, project, package version, test result, date, and verifier. For uploaded knowledge, mark the installed copy as a dated release and replace superseded files. For connected knowledge, still test freshness and permission changes. An editable live source can improve currency while also changing results between sessions.

## Measure usefulness and learning separately

I would begin with a two-week pilot on those three sales jobs. That duration is a proposed operational starting point, not a scientifically established optimum.

Compare the team's current method, a strong basic Claude setup, and Claude with the method pack. Use matched tasks and rotate the order where practical. Hold the model, tools, and source materials constant when testing the pack's contribution. Grade outputs without revealing which condition produced them where feasible.

Measure total time through review, factual errors, unsupported claims, missing commitments, and usability of the next step. Count corrections and failed attempts. Track model, package, and connector versions. A small task suite helps catch regressions; it cannot establish a revenue effect. Anthropic recommends starting agent evaluations with concrete failures and expanding coverage as the system matures. [Evaluation guidance](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents).

Also check what the rep can explain without Claude. In a 52-person coding experiment, the AI-assisted group averaged 50% on a subsequent quiz versus 67% for the comparison group. That is a coding-learning result, not a sales finding. It is enough to make learning a separate design objective. [Study and limitations](https://www.anthropic.com/research/AI-assistance-coding-skills).

After a brief, ask the rep to identify the strongest source, the least certain claim, and the question that could disprove the account hypothesis. After the call, compare the hypothesis with what the buyer actually said. The aim is a better prepared rep who can defend the recommendation and improve the method.

## The standard I want us to adopt

Give someone a maintained method they can inspect. Put it within reach of their normal working surface. Connect only the sources and tools the job needs. Make the output concrete. Verify it. Preserve the useful learning and release improvements deliberately.

That is how I would set up Fowler Brain properly: a portable library of judgment, supported by scoped access, reliable handoffs, and evidence that it helps the person doing the work.

The accompanying starter kit is a pilot implementation of that position. Its examples are synthetic. Its packaging can be checked mechanically; its effectiveness with a sales team still needs to be measured.
