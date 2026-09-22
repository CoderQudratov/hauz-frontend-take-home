# Final Review Prompts

Source: provided Claude Code prompt archive, sections 8, 9, and 10.

## 1. Review Appwrite client naming

Read TASK.md and .ai/RULES.md first.

Review the naming of adminClient() in the existing Appwrite integration.

The current name suggests that the client is only used for privileged admin operations, but the same server-side client is also used for trusted authentication operations such as email token/session creation.

If a small naming improvement makes the code clearer without changing behavior, rename it consistently.

Requirements:
- behavior must remain exactly the same
- no architecture changes
- no new abstraction
- no API changes
- no unrelated refactoring

If the current name is already sufficiently clear, do not change it.

Run:
npm run typecheck
npm run build

Review git diff.

Do not commit.

Final response:
1. What changed
2. Files changed
3. Verification results
4. Remaining issues
5. Suggested commit message

## 2. Review redundant account lookup

Read TASK.md and .ai/RULES.md first.

Review the redundant Personal Account lookup identified in the audit.

Current flow:
- verifyEmailCode fetches the Personal Account
- the next page calls getAuthState, which fetches the Personal Account again

Determine whether removing this duplication would make the architecture simpler without:
- adding state synchronization complexity
- changing SSR behavior
- changing authentication behavior
- creating new abstractions
- increasing coupling between routes and auth functions

Prefer KISS.

If removing the lookup is not clearly simpler, leave the code unchanged.

Do not implement speculative optimization.

Run:
npm run typecheck
npm run build

Do not modify unrelated files.
Do not commit.

Final response:
1. Whether a change is justified
2. Reason
3. Files changed
4. Verification results

## 3. Final full verification

Read TASK.md and .ai/RULES.md first.

Perform a final read-only audit of the HAUZ frontend implementation.

Do not modify any files.

Check the complete implementation against TASK.md, especially:

1. Email-code sign-in
2. New and returning users using the same sign-in flow
3. SSR authentication state
4. Header correctness on first paint
5. Logout
6. Onboarding
7. Duplicate onboarding submission safety
8. Immutable role
9. Profile viewing/editing
10. Optional contactEmail and bio
11. Clearing optional fields with null
12. Signed-out /profile redirect
13. Safe redirect handling
14. No direct personal_accounts browser access
15. No Appwrite secrets in browser
16. Invalid session handling
17. Sanitized server errors
18. Generated route tree integrity
19. Build/typecheck
20. Git diff/history consistency

Run:
npm run typecheck
npm run build

Also inspect:
git status
git diff
git log --oneline --decorate -15

Do not modify files.

Return:
1. PASS items
2. Remaining issues
3. Verification results
4. Files that would need changes if any
5. Final submission recommendation based only on objective task compliance

Do not commit.
