# HAUZ AI Development Guide

This directory contains the rules and implementation prompts used with Claude Code.

## Purpose

The goal is to use AI coding assistance while keeping the code:

- correct;
- secure;
- simple;
- readable;
- easy to explain;
- easy to modify;
- aligned with `TASK.md`.

AI is allowed, but the developer remains responsible for understanding every change.

## Workflow

For every task:

1. Read `TASK.md`.
2. Read `.ai/RULES.md`.
3. Read the relevant prompt.
4. Inspect the existing implementation before changing anything.
5. Implement only the requested scope.
6. Run the required verification.
7. Review the resulting diff.
8. Report what changed and what was verified.
9. Create a clear Git commit.

## Prompt Order

Use the prompts in this order:

1. `01-audit.md`
2. `02-auth.md`
3. `03-onboarding.md`
4. `04-profile.md`
5. `05-header-logout.md`
6. `06-security-review.md`
7. `07-final-review.md`

Do not skip the audit unless there is a specific reason.

## Important

Do not assume the repository is empty or follows a standard architecture.

The repository already contains an implementation.

Inspect existing code before modifying it.

Do not rewrite working code without a concrete reason.

Do not add unnecessary dependencies, abstractions, files, or architecture.

Every implementation must remain understandable to a developer who did not write it.