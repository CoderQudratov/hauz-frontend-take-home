# AI Coding Rules

## 1. Before Coding

- Read `TASK.md`.
- Read the relevant existing code.
- Understand the current architecture before changing it.
- Reuse existing code when possible.
- Do not guess missing requirements.

## 2. KISS / DRY

- Prefer the simplest correct solution.
- Do not over-engineer.
- Do not add unnecessary abstractions, services, hooks, or libraries.
- Do not duplicate business logic.
- Keep functions and components small and readable.

## 3. Scope

- Change only what the task requires.
- Do not rewrite working code without a reason.
- Do not refactor unrelated code.
- Do not add unrelated features or styling.

## 4. TypeScript / React

- Use clear TypeScript.
- Avoid `any`.
- Do not hide errors with `@ts-ignore`.
- Avoid unnecessary `useEffect` and state.
- Use the existing TanStack Query setup.
- Keep components simple and focused.

## 5. TanStack Start

- Keep server and client code separated.
- Server-only secrets must never reach the browser.
- Use `createServerFn` for trusted server operations.
- Preserve SSR authentication state.
- The header must be correct on the first paint.

## 6. Appwrite

- Use the existing Appwrite integration.
- Do not create another auth system.
- Do not access `personal_accounts` directly from the browser.
- Profile data must go through `personal-account`.
- Valid roles: `property_owner`, `realtor`.
- Role cannot change after account creation.

## 7. Security

Never expose:

- Appwrite API keys;
- session secrets;
- server credentials.

Never store secrets in:

- localStorage;
- sessionStorage;
- URLs;
- client environment variables.

Never trust a client-provided user ID for authorization when the server already knows the authenticated user.

Only allow safe internal redirect paths.

## 8. Authentication

- Use Appwrite email-code authentication.
- New and returning users use the same sign-in flow.
- Users without a Personal Account go to onboarding.
- Existing users skip onboarding.
- If current-user loading fails, treat the user as signed out and delete the session cookie.

## 9. Onboarding

- Collect first name, last name, and role.
- Prevent duplicate account creation.
- Double-clicking `Continue` must be safe.
- Never change an existing account's role.

## 10. Profile

- Support first name, last name, contact email, and bio.
- Contact email and bio are optional.
- `null` clears optional stored values.
- Signed-out `/profile` must return to `/profile` after sign-in.

## 11. Verification

Run relevant checks after changes:

```bash
npm run typecheck
npm run build