# Onboarding Prompt

Source: provided Claude Code prompt archive, section 4.

Read TASK.md and .ai/RULES.md first.

Fix only the onboarding redirect preservation issue.

Problem:
When a signed-out user is redirected from onboarding to sign-in, onboarding.tsx hardcodes:
redirect: '/onboarding'

This can lose the original redirect target.

Requirements:
- preserve the existing redirect target when sending the user to sign-in
- after successful authentication, the user should return to the intended safe internal destination
- use the existing safe redirect handling
- do not introduce a new redirect system
- do not allow external redirects
- preserve existing behavior for normal /onboarding access

Inspect:
- src/routes/onboarding.tsx
- src/routes/sign-in.tsx
- src/lib/safe-redirect.ts
- existing auth redirect flow

Implement the smallest correct fix.

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
