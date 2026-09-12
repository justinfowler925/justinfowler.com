#!/usr/bin/env python3
"""Install Unfog on Codex, Cursor, Claude, and shared Agent Skills."""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path
from typing import Optional, Sequence


SKILL_NAME = "unfog"
LEGACY_SKILL_NAME = "intent-compiler"
SURFACE_PATHS = (
    Path(".agents/skills") / SKILL_NAME,
    Path(".codex/skills") / SKILL_NAME,
    Path(".cursor/skills") / SKILL_NAME,
    Path(".claude/skills") / SKILL_NAME,
)
LEGACY_PATHS = tuple(path.parent / LEGACY_SKILL_NAME for path in SURFACE_PATHS)


def is_correct_link(destination: Path, source: Path) -> bool:
    return destination.is_symlink() and destination.resolve() == source.resolve()


def install(
    source: Path,
    home: Path,
    check: bool,
    replace: bool,
    remove_legacy: bool = False,
) -> int:
    source = source.resolve()
    if not (source / "SKILL.md").is_file():
        print(f"INVALID SOURCE: {source} has no SKILL.md", file=sys.stderr)
        return 2

    failures = 0
    for relative in SURFACE_PATHS:
        destination = home / relative
        if is_correct_link(destination, source):
            print(f"OK {destination} -> {source}")
            continue
        if check:
            actual = os.readlink(destination) if destination.is_symlink() else "missing or not a symlink"
            print(f"MISMATCH {destination}: {actual}", file=sys.stderr)
            failures += 1
            continue
        if destination.exists() or destination.is_symlink():
            if not replace:
                print(f"REFUSED {destination}: exists; pass --replace", file=sys.stderr)
                failures += 1
                continue
            if destination.is_symlink() or destination.is_file():
                destination.unlink()
            else:
                print(f"REFUSED {destination}: existing directory is not replaced", file=sys.stderr)
                failures += 1
                continue
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.symlink_to(source, target_is_directory=True)
        print(f"LINKED {destination} -> {source}")

    if remove_legacy:
        for relative in LEGACY_PATHS:
            destination = home / relative
            if not destination.is_symlink():
                if destination.exists():
                    print(
                        f"REFUSED {destination}: legacy path is not a symlink",
                        file=sys.stderr,
                    )
                    failures += 1
                continue
            if check:
                print(f"LEGACY {destination}: remove it", file=sys.stderr)
                failures += 1
                continue
            destination.unlink()
            print(f"REMOVED {destination}")
    return 1 if failures else 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="skill directory; defaults to this script's parent skill",
    )
    parser.add_argument("--home", type=Path, default=Path.home())
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--replace", action="store_true")
    parser.add_argument(
        "--remove-legacy",
        action="store_true",
        help="remove old intent-compiler symlinks; never removes real directories",
    )
    return parser


def main(argv: Optional[Sequence[str]] = None) -> int:
    args = build_parser().parse_args(argv)
    return install(args.source, args.home, args.check, args.replace, args.remove_legacy)


if __name__ == "__main__":
    raise SystemExit(main())
