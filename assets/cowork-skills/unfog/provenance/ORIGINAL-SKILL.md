---
name: unfog
description: Turn underspecified requests into evidence-backed execution contracts and carry them through completion. Use for non-trivial build, change, diagnose, or review requests that state a direction but omit target, scope, acceptance criteria, environment, or delivery details. Do not use for narrow factual questions or obvious one-line edits.
---

# Unfog

Translate the user's direction into a small internal contract, verify its premises, then execute it. The contract is a working control for the agent, not a document the user must approve.

## Compile before changing

Preserve the user's nouns, explicit choices, and authorization. Resolve these from the actual system before inferring missing details:

1. **Outcome** — the behavior or artifact the user will observe.
2. **Target** — the environment, artifact, principal, and source that actually produce that observation. For software, identify the running artifact before treating the current checkout as authoritative.
3. **Premise** — confirm or refute the request's factual premise. Definitions, filenames, tickets, and agent reports are claims until checked against the implementing path or live record.
4. **Scope** — define the signature shared by the reported instance, enumerate the matching population, and count checked versus affected members. A green result over zero items is invalid.
5. **Preservation** — name behavior, data, interfaces, and unrelated work that must not change.
6. **Acceptance** — write observable pass/fail probes. Include a denominator, a negative or competing-hypothesis control, and a verification path different from the implementation path when risk warrants it.
7. **Delivery** — name the authorized chain needed to reach the user's outcome: edit, test, review, merge, deploy, verify, or artifact handoff as applicable.

Use repository instructions and durable user rules as defaults. Treat source code, current runtime state, and live records as evidence. Label any remaining claim as inference.

For a persistent or machine-checked contract, use `scripts/intent_contract.py new`, fill the JSON, and run `validate`. Read [references/contract-schema.md](references/contract-schema.md) only when creating, debugging, or validating that file. Ordinary work can keep the same fields in working notes.

## Join the existing work loop

For every Unfog invocation, retrieve existing state before creating work and post bounded state after meaningful progress:

1. Read applicable repository instructions and relevant durable policy or lessons from Fowler Brain when it is available. Fowler Brain is long-lived memory, not the live task queue.
2. Route the exact intent through Brutus/Canon before mutation. Prefer `brutus workflow route "<intent>" --repo <repo> --cwd <cwd> --create`; use the equivalent Brutus MCP or HTTP surface when the CLI is unavailable. Continue the returned active Work Item instead of creating a duplicate, and retain its ID in the working contract.
3. Bind the repository's `.codex/delivery.yaml` when present. A repository without a policy is an explicit delivery-coverage gap, not implied success.
4. Post idempotent `started`, `tested`, `delivered`, `blocked`, or `failed` events at meaningful boundaries. Events are evidence only: they cannot approve, accept, or close Canon work.
5. At completion, attach structured receipts for every required delivery check, read Canon status back, and promote only durable cross-session rules, decisions, or measured learnings to Fowler Brain. Do not write routine transcript exhaust into Fowler Brain.

If Brutus/Canon or Fowler Brain is unavailable, continue only when the task remains safe, record the unavailable source and denominator in the contract, and disclose the state-coverage gap. Do not invent a synchronized state claim.

## Decide whether to ask

Ask one consolidated question only when an unresolved fork would:

- change user-visible behavior or the authoritative target;
- authorize destructive, irreversible, or external communication;
- choose between materially different data or security policies; or
- expand the work beyond the reported defect class or roughly double the scope.

Otherwise choose the least-expanding reversible interpretation supported by evidence and continue. Do not stop for approval of the compiled contract, narrate it step by step, or ask the user to repeat details discoverable from the workspace or target system.

If a material fork remains, finish every safe read-only preflight first. Ask with the competing choices, the evidence for each, and the consequence of the decision.

## Execute against the contract

- Implement the smallest change that satisfies the outcome and covers the measured population.
- When evidence refutes the premise, do not build the requested mechanism. Report the measured state and solve the underlying outcome if it remains authorized.
- If implementation reveals a new material fork, update the contract and apply the question gate again. Do not silently change the outcome or scope.
- For ingestion-backed surfaces, trace one real source through parsing, persistence, selection, and the rendered result. Inspect representative folder/index structure; a successful connection is not ingestion proof. Keep authorization durable when parsing fails. Distinguish ingested source material from the editorial subset shown to the user.
- Turn a user correction about product behavior into an executable regression test or fixture in the target project when one can observe that behavior. Do not promote a one-off correction into a universal rule.

## Close the loop

Compare the delivered result to every acceptance probe. A complete claim needs:

- the environment and executor;
- user-observable evidence from the target layer;
- the checked and affected population counts;
- a receipt for every acceptance item; and
- anything not completed or verified.

The final status must distinguish implementation proof from time-window outcome proof. A deployed measurement loop is complete as software; a 7-day or 30-day improvement target remains pending until its full population exists.

Use `scripts/intent_contract.py validate --phase complete` for persistent contracts. Do not call a contract complete when a receipt is missing, a probe examined zero targets, or a material fork is unresolved.
