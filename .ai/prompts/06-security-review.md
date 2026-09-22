# Security Review Prompts

Source: provided Claude Code prompt archive, sections 3 and 5.

## 1. Harden safe redirect validation

Read TASK.md and .ai/RULES.md first.

Fix only the safe redirect validation issue identified in the audit.

Problem:
safeRedirectTarget currently allows a backslash-based URL normalization bypass.

For example, a value such as:
\/\evil.com
or another backslash-based variant may normalize into an external-style URL.

Requirements:
- redirect targets must remain internal application paths
- reject backslash-based bypasses
- reject protocol-relative external targets
- preserve valid internal paths such as:
  /profile
  /onboarding
  /profile?foo=bar
- preserve the existing redirect behavior otherwise

Inspect the current implementation and tests/usages before changing it.

Implement the smallest readable fix.
Do not add a new redirect library.
Do not redesign routing.

Run:
npm run typecheck
npm run build

If there are existing tests for safeRedirectTarget, run them.
If there are no tests, do not create a large test framework just for this small fix.

Review git diff.

Do not modify TASK.md, README.md, .ai/RULES.md, or unrelated files.

Do not commit.

Final response:
1. What changed
2. Files changed
3. Verification results
4. Remaining issues
5. Suggested commit message

## 2. Prevent Appwrite error leakage

Read TASK.md and .ai/RULES.md first.

Fix only the Appwrite error leakage issue identified in the audit.

Problem:
Raw Appwrite SDK errors can propagate from:
- src/lib/auth-fns.ts
- src/lib/profile-fns.ts

These errors should not be exposed directly to the browser.

Requirements:
- keep useful user-facing errors
- do not expose raw Appwrite SDK error objects, stack traces, internal details, API information, or server implementation details
- sanitize errors at the server-function boundary
- preserve successful behavior
- preserve existing authentication behavior
- keep the implementation simple

Inspect the existing error handling first.

Use a small reusable error mapping/helper only if it genuinely reduces duplication.
Do not create an unnecessary error framework.

Important:
- do not change Appwrite authentication architecture
- do not change the Personal Account Function contract
- do not expose secrets
- do not modify unrelated UI

Run:
npm run typecheck
npm run build

Review git diff.

Do not modify TASK.md, README.md, .ai/RULES.md, or unrelated files.

Do not commit.

Final response:
1. What changed
2. Files changed
3. Verification results
4. Remaining issues
5. Suggested commit message
