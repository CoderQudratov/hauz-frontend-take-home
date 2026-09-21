# Notes

## How it's wired

Everything Appwrite-related lives in `src/lib/*.ts` and only runs inside
TanStack Start server functions (`createServerFn`). The Appwrite session
secret is stored in an `httpOnly` cookie (`src/lib/session-cookie.ts`) and
never crosses into a client bundle — the API key never leaves the server at
all, since it's only used to send the email code and exchange it for a
session (`account.createEmailToken` / `account.createSession`), both of which
happen before a user session exists.

Sign-in is Appwrite's email-token flow: `createEmailToken(ID.unique(), email)`
either matches an existing user by email or creates one with that ID — the
random ID is discarded by Appwrite when the email already belongs to someone,
so re-running sign-in for a returning person reuses their account rather than
creating a new one. The onboarding/profile writes all go through the
`personal-account` Function, executed as the signed-in user via
`Functions.createExecution` on a client carrying their session — never a
direct table read/write from the app.

`src/routes/__root.tsx` loads auth state (`Account.get()` + the personal
account) once per navigation through a TanStack Query query, seeded during
SSR, so the header is correct on the very first paint of a hard refresh with
no client-side flash.

## Where I disagreed with the brief

**"The profile form should send the signed-in user's id along with the
changes."** I didn't implement this. The Function already derives the caller
from `x-appwrite-user-id`, a header Appwrite injects itself and explicitly
refuses to let a caller override (see the comment at the top of
`functions/personal-account/src/main.js`). Having the browser also send a
user id and having the Function trust it would let anyone edit any profile
by changing one field in a request — it would undo the exact protection the
Function was already built with. I left the Function unchanged and the
profile form only sends the fields being edited.

**Open redirect on `?redirect=`.** Not called out in the brief, but sending
people to "whatever page the `redirect` query parameter names" after sign-in
is dangerous if taken literally: `/sign-in?redirect=https://evil.example`
would send a fresh session straight off-site. `src/lib/safe-redirect.ts`
restricts it to same-page relative paths and falls back to `/` otherwise.

## What I'd do before production

- **Rate limit `requestEmailCode`.** Right now anything can spam Appwrite's
  email sending for an arbitrary address. Appwrite Cloud rate-limits this
  itself, but I'd add a per-IP/per-email limit in front of it too.
- **Session expiry/refresh.** The cookie lives as long as the Appwrite
  session (`session.expire`); there's no refresh-on-activity, so a long-lived
  visitor eventually gets bounced to sign-in with no warning.
- **Real form validation feedback.** Errors currently render the raw message
  a server function throws. I'd map `PersonalAccountError`/Zod issues to
  field-level messages instead of one line at the bottom of the form.
- **Tests.** None exist yet — I'd start with the redirect logic in
  `safe-redirect.ts` and the onboarding/profile server functions against a
  real (or emulated) Appwrite project, since those are exactly the places a
  future refactor is most likely to silently break the security properties
  the brief cares about (secret never reaching the browser, one account per
  user, role immutability).
- Styling — deliberately skipped, per the brief.

## Agent use

Built with Claude Code end to end (server functions, routes, this file).
Three things it got wrong that I caught while verifying the build:

1. Named the server-function modules `auth.server.ts` / `profile.server.ts`.
   TanStack Start's Vite plugin treats any `*.server.*` file as fully
   server-only and refuses to let client code import it at all — but these
   modules export `createServerFn` calls that the client *is* meant to call
   (as an RPC). `npm run build` failed with an explicit
   `[import-protection] Import denied in client environment` error, which is
   what caught it. Fixed by renaming to `auth-fns.ts` / `profile-fns.ts`.
2. Used the object-parameter `queryClient.ensureQueryData(...)` in
   `__root.tsx`. `tsc --noEmit` flagged it as deprecated in this project's
   `@tanstack/react-query` version in favor of `queryClient.query({ ...,
   staleTime: 'static' })`. Switched to `queryClient.query()`.
3. First draft of `redirect` handling in sign-in/onboarding passed the raw
   `redirect` search param straight into `navigate({ to })`, an open redirect
   (see above). Caught on review, not by a tool; added
   `src/lib/safe-redirect.ts` and applied it everywhere the param is
   consumed.
