#!/usr/bin/env python3
"""Create, validate, and render Unfog execution contracts."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence


SCHEMA_VERSION = 1
MODES = {"change", "diagnose", "review", "research"}
PHASES = {"draft", "ready", "complete"}
PREMISE_STATUSES = {"unverified", "confirmed", "refuted", "not_applicable"}


def empty_contract(request: str, mode: str) -> Dict[str, Any]:
    return {
        "schema_version": SCHEMA_VERSION,
        "request": request,
        "mode": mode,
        "phase": "draft",
        "outcome": {"statement": "", "observed_by": ""},
        "targets": [
            {
                "artifact": "",
                "environment": "",
                "principal": "",
                "source": "",
                "running_identity": "",
                "evidence": [],
            }
        ],
        "premise": {"claim": "", "status": "unverified", "evidence": []},
        "scope": {
            "signature": "",
            "population": {"checked": 0, "affected": 0},
            "included": [],
            "excluded": [],
        },
        "preserve": [],
        "acceptance": [
            {
                "id": "observable-outcome",
                "layer": "user_observable",
                "probe": "",
                "expected": "",
                "control": "",
                "verification_path": "",
            }
        ],
        "assumptions": [],
        "forks": [],
        "delivery": [],
        "receipts": [],
    }


def load_contract(path: Path) -> Dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"contract not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON at line {exc.lineno}, column {exc.colno}: {exc.msg}")
    if not isinstance(data, dict):
        raise ValueError("contract root must be a JSON object")
    return data


def nonempty(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def mapping(value: Any) -> Dict[str, Any]:
    return value if isinstance(value, dict) else {}


def sequence(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def integer(value: Any) -> Optional[int]:
    if isinstance(value, bool) or not isinstance(value, int):
        return None
    return value


def require_text(errors: List[str], obj: Dict[str, Any], key: str, path: str) -> None:
    if not nonempty(obj.get(key)):
        errors.append(f"{path}.{key} must be non-empty")


def validate_base(contract: Dict[str, Any]) -> List[str]:
    errors: List[str] = []
    if contract.get("schema_version") != SCHEMA_VERSION:
        errors.append(f"schema_version must equal {SCHEMA_VERSION}")
    require_text(errors, contract, "request", "contract")
    if contract.get("mode") not in MODES:
        errors.append(f"mode must be one of: {', '.join(sorted(MODES))}")
    if contract.get("phase") not in PHASES:
        errors.append(f"phase must be one of: {', '.join(sorted(PHASES))}")
    return errors


def validate_ready(contract: Dict[str, Any]) -> List[str]:
    errors = validate_base(contract)

    outcome = mapping(contract.get("outcome"))
    require_text(errors, outcome, "statement", "outcome")
    require_text(errors, outcome, "observed_by", "outcome")

    targets = sequence(contract.get("targets"))
    if not targets:
        errors.append("targets must contain at least one target")
    for index, raw_target in enumerate(targets):
        target = mapping(raw_target)
        path = f"targets[{index}]"
        for key in ("artifact", "environment", "source"):
            require_text(errors, target, key, path)
        if not any(nonempty(item) for item in sequence(target.get("evidence"))):
            errors.append(f"{path}.evidence must contain an inspectable receipt")

    premise = mapping(contract.get("premise"))
    premise_status = premise.get("status")
    if premise_status not in PREMISE_STATUSES:
        errors.append(
            "premise.status must be one of: " + ", ".join(sorted(PREMISE_STATUSES))
        )
    elif premise_status == "unverified":
        errors.append("premise.status cannot remain unverified at ready")
    elif premise_status != "not_applicable" and not any(
        nonempty(item) for item in sequence(premise.get("evidence"))
    ):
        errors.append("premise.evidence must support a confirmed or refuted premise")

    scope = mapping(contract.get("scope"))
    require_text(errors, scope, "signature", "scope")
    population = mapping(scope.get("population"))
    checked = integer(population.get("checked"))
    affected = integer(population.get("affected"))
    if checked is None or checked <= 0:
        errors.append("scope.population.checked must be greater than zero")
    if affected is None or affected < 0:
        errors.append("scope.population.affected must be zero or greater")
    if checked is not None and affected is not None and affected > checked:
        errors.append("scope.population.affected cannot exceed checked")

    acceptance = sequence(contract.get("acceptance"))
    if not acceptance:
        errors.append("acceptance must contain at least one probe")
    ids: set[str] = set()
    has_user_observable = False
    has_control = False
    for index, raw_probe in enumerate(acceptance):
        probe = mapping(raw_probe)
        path = f"acceptance[{index}]"
        for key in ("id", "layer", "probe", "expected", "verification_path"):
            require_text(errors, probe, key, path)
        probe_id = probe.get("id")
        if nonempty(probe_id):
            if probe_id in ids:
                errors.append(f"{path}.id duplicates {probe_id!r}")
            ids.add(probe_id)
        has_user_observable = has_user_observable or probe.get("layer") == "user_observable"
        has_control = has_control or nonempty(probe.get("control"))
    if not has_user_observable:
        errors.append("acceptance must include a user_observable probe")
    if not has_control:
        errors.append("acceptance must include a negative or competing-hypothesis control")

    for index, raw_assumption in enumerate(sequence(contract.get("assumptions"))):
        assumption = mapping(raw_assumption)
        path = f"assumptions[{index}]"
        require_text(errors, assumption, "statement", path)
        if assumption.get("basis") not in {"evidence", "inference"}:
            errors.append(f"{path}.basis must be evidence or inference")
        if assumption.get("material") is True and assumption.get("basis") == "inference":
            errors.append(f"{path} is a material inference and must be resolved as a fork")

    for index, raw_fork in enumerate(sequence(contract.get("forks"))):
        fork = mapping(raw_fork)
        path = f"forks[{index}]"
        require_text(errors, fork, "decision", path)
        options = [item for item in sequence(fork.get("options")) if nonempty(item)]
        if len(options) < 2:
            errors.append(f"{path}.options must contain at least two choices")
        if fork.get("material") is True:
            if fork.get("resolution") not in {"asked", "evidence", "default"}:
                errors.append(f"{path}.resolution must resolve the material fork")
            require_text(errors, fork, "choice", path)
            require_text(errors, fork, "reason", path)

    delivery = sequence(contract.get("delivery"))
    if contract.get("mode") == "change" and not delivery:
        errors.append("delivery must contain at least one step for change work")
    for index, raw_step in enumerate(delivery):
        step = mapping(raw_step)
        path = f"delivery[{index}]"
        require_text(errors, step, "environment", path)
        require_text(errors, step, "action", path)

    return errors


def validate_complete(contract: Dict[str, Any]) -> List[str]:
    errors = validate_ready(contract)
    if contract.get("phase") != "complete":
        errors.append("phase must equal complete for complete validation")

    acceptance_ids = {
        probe.get("id")
        for probe in (mapping(item) for item in sequence(contract.get("acceptance")))
        if nonempty(probe.get("id"))
    }
    receipts = sequence(contract.get("receipts"))
    receipt_ids: set[str] = set()
    for index, raw_receipt in enumerate(receipts):
        receipt = mapping(raw_receipt)
        path = f"receipts[{index}]"
        require_text(errors, receipt, "acceptance_id", path)
        require_text(errors, receipt, "evidence", path)
        if receipt.get("status") != "pass":
            errors.append(f"{path}.status must equal pass")
        receipt_id = receipt.get("acceptance_id")
        if nonempty(receipt_id):
            if receipt_id in receipt_ids:
                errors.append(f"{path}.acceptance_id duplicates {receipt_id!r}")
            receipt_ids.add(receipt_id)
            if receipt_id not in acceptance_ids:
                errors.append(f"{path}.acceptance_id does not match an acceptance probe")
    missing_receipts = sorted(acceptance_ids - receipt_ids)
    if missing_receipts:
        errors.append("missing passing receipts for: " + ", ".join(missing_receipts))

    targets = sequence(contract.get("targets"))
    for index, raw_target in enumerate(targets):
        target = mapping(raw_target)
        if target.get("environment") not in {"file", "analysis", "not_applicable"} and not nonempty(
            target.get("running_identity")
        ):
            errors.append(f"targets[{index}].running_identity is required at complete")

    for index, raw_step in enumerate(sequence(contract.get("delivery"))):
        step = mapping(raw_step)
        if not nonempty(step.get("evidence")):
            errors.append(f"delivery[{index}].evidence is required at complete")

    return errors


def validate(contract: Dict[str, Any], phase: str) -> List[str]:
    if phase == "draft":
        return validate_base(contract)
    if phase == "ready":
        errors = validate_ready(contract)
        if contract.get("phase") not in {"ready", "complete"}:
            errors.append("phase must equal ready or complete for ready validation")
        return errors
    return validate_complete(contract)


def render_lines(contract: Dict[str, Any]) -> Iterable[str]:
    outcome = mapping(contract.get("outcome"))
    scope = mapping(contract.get("scope"))
    population = mapping(scope.get("population"))
    yield f"Unfog contract · {contract.get('phase', 'unknown')} · {contract.get('mode', 'unknown')}"
    yield f"Request: {contract.get('request', '')}"
    yield f"Outcome: {outcome.get('statement', '')}"
    yield f"Observed by: {outcome.get('observed_by', '')}"
    yield (
        "Population: "
        f"{population.get('checked', 0)} checked · {population.get('affected', 0)} affected · "
        f"{scope.get('signature', '')}"
    )
    yield "Acceptance:"
    for probe in (mapping(item) for item in sequence(contract.get("acceptance"))):
        yield f"- {probe.get('id', '')}: {probe.get('expected', '')}"
    material_forks = [
        mapping(item) for item in sequence(contract.get("forks")) if mapping(item).get("material") is True
    ]
    if material_forks:
        yield "Material decisions:"
        for fork in material_forks:
            yield f"- {fork.get('decision', '')}: {fork.get('choice', '')} ({fork.get('resolution', '')})"


def write_json(path: Optional[Path], value: Dict[str, Any]) -> None:
    rendered = json.dumps(value, indent=2, ensure_ascii=False) + "\n"
    if path is None:
        sys.stdout.write(rendered)
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(rendered, encoding="utf-8")
    print(path)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    new_parser = subparsers.add_parser("new", help="create a draft JSON contract")
    new_parser.add_argument("--request", required=True, help="the user's exact request")
    new_parser.add_argument("--mode", choices=sorted(MODES), default="change")
    new_parser.add_argument("--output", type=Path)

    validate_parser = subparsers.add_parser("validate", help="validate a JSON contract")
    validate_parser.add_argument("contract", type=Path)
    validate_parser.add_argument("--phase", choices=sorted(PHASES), default="ready")

    render_parser = subparsers.add_parser("render", help="render a compact contract summary")
    render_parser.add_argument("contract", type=Path)
    return parser


def main(argv: Optional[Sequence[str]] = None) -> int:
    args = build_parser().parse_args(argv)
    if args.command == "new":
        write_json(args.output, empty_contract(args.request, args.mode))
        return 0
    try:
        contract = load_contract(args.contract)
    except ValueError as exc:
        print(f"INVALID: {exc}", file=sys.stderr)
        return 2
    if args.command == "render":
        print("\n".join(render_lines(contract)))
        return 0
    errors = validate(contract, args.phase)
    if errors:
        print(f"INVALID ({len(errors)} errors):", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print(f"VALID: {args.phase}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
