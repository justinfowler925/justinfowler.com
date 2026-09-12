#!/usr/bin/env python3

from __future__ import annotations

import importlib.util
import io
import json
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parent.parent
FIXTURES = Path(__file__).resolve().parent / "fixtures"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


contract_module = load_module("intent_contract", SKILL_ROOT / "scripts" / "intent_contract.py")
install_module = load_module("intent_install", SKILL_ROOT / "scripts" / "install.py")


def fixture(name: str):
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


class ContractValidationTests(unittest.TestCase):
    def test_valid_ready_contract_passes(self) -> None:
        self.assertEqual([], contract_module.validate(fixture("valid-ready.json"), "ready"))

    def test_unresolved_material_fork_blocks_ready(self) -> None:
        errors = contract_module.validate(fixture("unresolved-material-fork.json"), "ready")
        self.assertTrue(any("resolution" in error for error in errors), errors)
        self.assertTrue(any("choice" in error for error in errors), errors)

    def test_zero_denominator_blocks_ready(self) -> None:
        contract = fixture("valid-ready.json")
        contract["scope"]["population"]["checked"] = 0
        errors = contract_module.validate(contract, "ready")
        self.assertIn("scope.population.checked must be greater than zero", errors)

    def test_missing_control_blocks_ready(self) -> None:
        contract = fixture("valid-ready.json")
        for probe in contract["acceptance"]:
            probe["control"] = ""
        errors = contract_module.validate(contract, "ready")
        self.assertIn(
            "acceptance must include a negative or competing-hypothesis control",
            errors,
        )

    def test_missing_user_observable_probe_blocks_ready(self) -> None:
        contract = fixture("valid-ready.json")
        for probe in contract["acceptance"]:
            probe["layer"] = "test"
        errors = contract_module.validate(contract, "ready")
        self.assertIn("acceptance must include a user_observable probe", errors)

    def test_complete_requires_every_acceptance_receipt(self) -> None:
        contract = fixture("valid-complete.json")
        contract["receipts"].pop()
        errors = contract_module.validate(contract, "complete")
        self.assertIn("missing passing receipts for: class-gate", errors)

    def test_valid_complete_contract_passes(self) -> None:
        self.assertEqual([], contract_module.validate(fixture("valid-complete.json"), "complete"))

    def test_skill_requires_canon_join_and_honest_time_windows(self) -> None:
        text = (SKILL_ROOT / "SKILL.md").read_text(encoding="utf-8")
        self.assertIn("brutus workflow route", text)
        self.assertIn("Continue the returned active Work Item", text)
        self.assertIn("time-window outcome proof", text)


class InstallTests(unittest.TestCase):
    def test_installer_links_all_surfaces_to_one_source(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory)
            with redirect_stdout(io.StringIO()):
                self.assertEqual(0, install_module.install(SKILL_ROOT, home, False, False))
            self.assertEqual(4, len(install_module.SURFACE_PATHS))
            for relative in install_module.SURFACE_PATHS:
                destination = home / relative
                self.assertTrue(destination.is_symlink())
                self.assertEqual(SKILL_ROOT.resolve(), destination.resolve())
            with redirect_stdout(io.StringIO()):
                self.assertEqual(0, install_module.install(SKILL_ROOT, home, True, False))

    def test_check_fails_when_a_surface_is_missing(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            with redirect_stderr(io.StringIO()):
                self.assertEqual(1, install_module.install(SKILL_ROOT, Path(directory), True, False))

    def test_remove_legacy_deletes_only_symlinks(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory)
            for relative in install_module.LEGACY_PATHS:
                destination = home / relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.symlink_to(SKILL_ROOT, target_is_directory=True)
            with redirect_stdout(io.StringIO()):
                self.assertEqual(
                    0,
                    install_module.install(SKILL_ROOT, home, False, False, True),
                )
            for relative in install_module.LEGACY_PATHS:
                self.assertFalse((home / relative).is_symlink())

    def test_remove_legacy_refuses_real_directories(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory)
            destination = home / install_module.LEGACY_PATHS[0]
            destination.mkdir(parents=True)
            with redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()):
                self.assertEqual(
                    1,
                    install_module.install(SKILL_ROOT, home, False, False, True),
                )
            self.assertTrue(destination.is_dir())


if __name__ == "__main__":
    unittest.main()
