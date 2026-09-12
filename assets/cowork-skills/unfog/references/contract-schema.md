# Execution contract schema

Use the JSON contract when work is long-running, handed between agents, or risky enough that the acceptance evidence should be machine-checked. For ordinary work, keep the same concepts in working notes instead of creating repository clutter.

Create a draft:

```sh
python3 scripts/intent_contract.py new --request "build it" --mode change --output /tmp/intent-contract.json
```

Validate before mutation and again before claiming completion:

```sh
python3 scripts/intent_contract.py validate /tmp/intent-contract.json --phase ready
python3 scripts/intent_contract.py validate /tmp/intent-contract.json --phase complete
```

Render a compact human-readable view:

```sh
python3 scripts/intent_contract.py render /tmp/intent-contract.json
```

## Fields

- `request`: the user's exact direction, not a rewritten substitute.
- `mode`: `change`, `diagnose`, `review`, or `research`.
- `outcome.statement`: the user-observable result.
- `outcome.observed_by`: who or what can observe it.
- `targets[]`: artifact, environment, affected principal, source path/system, running identity, and evidence.
- `premise`: the factual claim behind the request, its `confirmed`, `refuted`, or `not_applicable` status, and evidence.
- `scope.signature`: the concrete pattern defining siblings of the reported instance.
- `scope.population.checked`: the denominator. It must be greater than zero before `ready`.
- `scope.population.affected`: the number requiring work and cannot exceed `checked`.
- `preserve[]`: invariants and unrelated behavior that must survive.
- `acceptance[]`: uniquely identified probes. At least one must use layer `user_observable`; at least one must carry a competing-hypothesis or negative `control`.
- `assumptions[]`: evidence-backed or inferred statements. A material inference is an unresolved fork, not an assumption.
- `forks[]`: decisions with options, materiality, resolution, choice, and reason. A material fork cannot remain unresolved at `ready`.
- `delivery[]`: the authorized steps that put the result where the user expects it. At `complete`, every step needs evidence.
- `receipts[]`: one passing receipt for every acceptance id, with evidence from the named probe.

The validator enforces structural invariants, not factual truth. Evidence strings must point to real commands, records, URLs, screenshots, hashes, counts, or other inspectable receipts.
