# Audit Prompt

Source: provided Claude Code prompt archive, section 10 (final full verification).

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
