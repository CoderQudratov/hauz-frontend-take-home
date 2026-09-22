# Authentication Prompts

Source: provided Claude Code prompt archive, sections 5, 6, and 7.

## 1. Sanitize Appwrite errors

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

## 2. Handle expired sessions on profile writes

Read TASK.md and .ai/RULES.md first.

Fix only the write-path authentication failure handling issue.

Problem:
profile-fns.ts currently relies on the presence of the session cookie.
If the Appwrite session has expired or become invalid, a profile mutation can throw an authentication error instead of treating the user as signed out.

Requirements:
- an invalid/expired Appwrite session must result in signed-out behavior
- the stale session cookie must be removed when appropriate
- the browser must not receive a raw Appwrite SDK error
- preserve normal authenticated profile updates
- do not trust browser-provided user IDs for authorization
- continue deriving the authenticated user from the server-side Appwrite request context
- keep the implementation consistent with the existing auth flow

Inspect:
- src/lib/profile-fns.ts
- src/lib/auth-fns.ts
- src/lib/session-cookie.ts
- src/lib/appwrite.ts
- existing client mutation handling

Implement the smallest correct solution.
Do not create a second authentication system.
Do not add dependencies.

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

## 3. Normalize sign-in email

Read TASK.md and .ai/RULES.md first.

Fix only the email normalization issue.

Problem:
The sign-in client validates/sends the raw email value.
An email with leading or trailing whitespace can fail client validation even though the server/function trims the value.

Requirements:
- trim the email before client-side validation/submission
- preserve the existing email-code authentication flow
- do not change the server contract
- do not change unrelated validation

Implement the smallest possible fix.

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
