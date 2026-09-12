# AI work surfaces

Any interface where a model does work a human is accountable for. Chat is one topology
among ten and usually the wrong one.

The governing principle: **the interface's job is to make the model's work reviewable at
the speed it is produced.** A surface that generates faster than a human can verify has
moved the bottleneck rather than removed it, and it converts the human into a rubber
stamp — which is exactly the failure mode that makes AI output untrustworthy in
aggregate.

## Choose the topology before the components

| Topology | Shape | Use when |
|---|---|---|
| **Inline / ghost** | Suggestion appears in place, Tab to accept | The output is small, local, and instantly verifiable |
| **Sidecar** | Panel beside the artefact, both visible | The human keeps authorship; the model advises |
| **Canvas** | Model and human edit a shared document | Output is long-form and iterated |
| **Instrumented session** | A live run with visible steps, logs, interruptibility | Multi-step work the human must be able to stop |
| **Inbox** | Completed work queued for review | Async, batchable, many small items |
| **Shared timeline** | Append-only record of actions by both parties | Auditability matters more than speed |
| **Review gate** | Diff + approve/reject before anything commits | The action is irreversible or expensive |
| **Supervised autonomy** | Runs alone; escalates by exception | High volume, well-bounded, measurable error rate |
| **Provenance-first** | Every claim carries its source inline | The output is a set of factual assertions |
| **Evaluation console** | Runs, scores, regressions across a suite | Building the thing that does the work |

**Chat is the default only because it is the easiest to build.** It is the worst topology
for anything reviewable: linear, unstructured, no diff, no state, and the record of what
happened is a transcript nobody rereads. Reach for chat when the interaction genuinely is
open-ended dialogue, and for almost nothing else.

## Streaming and progress

- **Stream tokens only where reading-as-produced has value** — prose. Streaming a JSON
  blob or a diff is animated noise; render it complete.
- **Show the step, not a spinner.** "Reading 12 files" → "Drafting" → "Checking" is
  orders of magnitude better than an indeterminate bar, and it costs nothing but honesty
  about your own pipeline.
- **Latency thresholds** (Miller 1968; Card, Robertson & Mackinlay 1991 — the actual
  sources behind the numbers everyone quotes):
  - **0.1s** — feels instantaneous; no indicator needed
  - **1s** — flow preserved; indicator unnecessary but harmless
  - **10s** — the limit of attention. Past this the human context-switches, and the
    surface owes them a progress signal they can leave and return to
- **Past 10s, make the work leavable.** A notification, a persistent run record, a URL
  that survives a refresh. Anything that dies on tab-close will be babysat, which is the
  most expensive possible use of the human.
- **Never let output reflow the page under the reader.** Reserve the space, or append
  below the fold-line of what has already been read. This is a CLS problem and a
  comprehension problem at once.
- **Stopping must be instant and must be honoured.** A stop button that finishes the
  current step first is a lie; say "finishing current step" if that is what it does.

## Steerability

- **Let the human correct mid-flight**, not only at the end. The cheapest correction is
  the earliest one.
- **Make the plan editable before execution** for anything multi-step. A visible plan is
  also the best available explanation of what the model is about to do.
- **Scope is a control, not a setting buried in a menu** — which files, which records,
  which date range. Show it where the run starts.
- **Re-run with a modification** must be one action, preserving the prior result for
  comparison. Regenerating destructively is how people lose good output.

## Review and approval

The highest-leverage surface in the whole category, and consistently the least designed.

- **Diff, always.** Before/after with changes highlighted. A summary of changes is not a
  diff and cannot be checked.
- **Approve must be more expensive than reject.** Bulk-approve with no per-item view is a
  rubber stamp with a progress bar — it manufactures the appearance of oversight while
  removing it.
- **Partial acceptance.** Accept 4 of 7 changes. All-or-nothing forces a bad choice and
  usually gets "all".
- **Show what the model was uncertain about** and route the human's attention there
  first. Ranking a review queue by model confidence is the single biggest multiplier on
  human review throughput.
- **Reject must capture why**, in one click from a short list. This is the only training
  signal the system will ever get for free.
- **Irreversible actions get a confirm that names the blast radius** — "Delete 25
  records" not "Are you sure?". Destructive scale must appear in the confirm text.

## Trust and provenance

- **Cite at the claim, not at the bottom.** A footnote list is unverifiable in practice;
  a source on the sentence is checkable in one glance.
- **Distinguish retrieved from generated.** Different visual treatments, always. This is
  the single most useful trust affordance available and it is nearly free.
- **Never render a confidence percentage you cannot defend.** A fabricated "94% confident"
  is worse than no number: it is precise, unfalsifiable, and readers anchor on it. Prefer
  a coarse band or the evidence itself.
- **Show freshness.** "Data as of" on anything retrieved.
- **Make the prompt/inputs inspectable.** "Why did it say that" is answered by showing
  what it was given, not by generating an explanation of itself — a post-hoc rationale
  from the same model is not evidence of its reasoning.

## Failure UX

Failure is a design surface, not an exception path, and it is where trust is actually
won:

- **Distinguish the four failure types** — refusal, timeout, tool error, low-quality
  output — because the human's next action differs for each. A single "Something went
  wrong" forces a guess.
- **Preserve the input.** Losing a user's prompt or a half-reviewed edit on failure is
  unforgivable and extremely common.
- **Partial output is valuable — keep it**, marked as partial.
- **Retry must be able to differ**: retry, retry with more context, retry with a
  different approach. An identical retry is often just a slower failure.
- **Say what the model cannot do**, once, at the boundary — rather than letting it
  attempt and fail. A model narrating an action it has no means to take is the worst
  possible outcome and the surface can prevent it by showing which tools are actually
  attached.
- **Never a toast as the only error channel.** It disappears, it is unreachable by
  keyboard, and it cannot hold a diagnosis.

## Handoff

- **Hand off with state, not a summary.** The human should land in the work, with what
  was done, what is left, and what the model was unsure about.
- **Name the confidence boundary explicitly** — "verified X, did not verify Y". The
  single most valuable sentence any AI surface can produce.
- **The escalation must be a person, not a queue** for anything time-sensitive.

## Multi-agent

- **A tree, not a chat log.** Parallel work needs a structure that shows what is running,
  what finished, and what depends on what.
- **One accountable surface.** N agents must not produce N notification streams; converge
  to one queue the human owns.
- **Show cost and elapsed time per branch.** Runaway parallel work is invisible without
  it.

## Anti-patterns

- **Chat as the interface for structured work** — the default that survives because it is
  easy to build, not because it works
- **Rubber-stamp approval** — bulk accept with no diff
- **Fabricated confidence numbers**
- **Anthropomorphic status theatre** — "Thinking…", "Pondering…" in place of the real
  step name. It is charming once and obstructive thereafter, and it hides genuinely
  useful progress information
- **Sycophantic acknowledgement** in a work surface — "Great question!" costs a line of
  screen and a unit of credibility
- **Infinite regeneration with no diff between attempts** — the human cannot tell whether
  anything changed
- **Hiding the model's inputs** while claiming explainability
- **Streaming as decoration** — token-by-token rendering of content nobody reads linearly
- **A stop button that does not stop**
- **Losing user input on error**
- **Autonomy without an error rate.** Any surface that acts unsupervised must publish how
  often it is wrong, measured — or it is asking for trust it has not earned

## Cross-references

- Composer, streaming and chat component baselines → `contracts.md`
- Review queues, exception lists, alert rationale → `dashboards.md`
- Spoken and listening surfaces → `voice.md`
- Perceived-performance techniques → `performance.md`
