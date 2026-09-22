# Profile Prompt

Source: provided Claude Code prompt archive, section 1.

Read TASK.md and .ai/RULES.md first.

Fix only this issue:

After successfully editing the profile, the header still shows the old first name until navigation or a hard refresh.

Current cause:
- profile.tsx invalidates the auth React Query cache
- the Header reads auth state from the root route context
- invalidating the query does not re-run the root beforeLoad
- Header.tsx already uses router.invalidate() in its logout flow

Implement the smallest correct fix:
- inspect the existing profile mutation
- after a successful profile update, invalidate the relevant query
- refresh the router state using the existing TanStack Start pattern
- do not redesign the auth architecture
- do not add dependencies
- do not refactor unrelated code

Before changing anything, inspect the current implementation.

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
