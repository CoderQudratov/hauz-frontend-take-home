# HAUZ frontend take-home

HAUZ is a real estate marketplace for Uzbekistan. Our public web app is
TanStack Start with server rendering, and Appwrite handles sign-in and backend
Functions. This task is a small slice of the real sign-in flow we are building.

**You may use AI coding agents as much as you like.** We do not grade how much
you typed. We grade whether the result is correct and whether you understand it.
If your code passes review, the next step is a call where you walk us through it
and make a small change, and on that call you will not have an agent.

Plan for about a day. Do not spend more than two. Unstyled UI is fine, we are
not looking at CSS.

`README.md` has the setup steps and the Function's API.

## What to build

**1. Sign in with an email code.** Enter an email, get a code, enter the code,
you are in. New and returning people see the same screens.

**2. Onboarding.** Someone signing in without a Personal Account enters a first
name, a last name, and a role, either Property Owner or Realtor. Someone who
already has an account skips this.

**3. Profile.** A `/profile` page to view and edit first name, last name,
contact email and bio. A signed-out visitor who opens `/profile` signs in and
lands back on `/profile`.

**4. Header.** On every page: either "Sign in", or the person's first name and a
"Log out" button. It has to be right on the first paint after a hard refresh.

**5. Log out.**

## Rules

- Browser JavaScript must never be able to read the Appwrite session secret or
  any API key.
- Profile data goes only through the Function. The web app never reads or writes
  the `personal_accounts` table directly.
- You may change the Function if you need to. Explain why in `NOTES.md`.

## Notes from the product side

Some of these were written in a hurry. If one is wrong or unsafe, do not follow
it silently. Do what you think is right and say so in `NOTES.md`.

- The role cannot be changed after the account is created.
- After sign-in, send people to whatever page the `redirect` query parameter
  names.
- Contact email and bio are optional. Clearing one has to actually remove it.
- The profile form should send the signed-in user's id along with the changes,
  so the Function knows whose profile to update.
- Double-clicking "Continue" on onboarding must never create two accounts.
- If loading the current user fails for any reason, treat the person as signed
  out. Delete the session cookie and show sign-in.

## What to send us

1. A private GitHub repo with full commit history. Please do not squash it into
   one commit.
2. A `README.md` with the steps to run it.
3. **`NOTES.md`**, one page at most, in your own words. Your main decisions,
   anything in this brief you disagreed with, and what you would do next if this
   were going to production.
4. Your agent prompts or exported agent sessions. Plus a short list of three
   things the agent got wrong that you caught, each linked to the commit where
   you fixed it.

Questions about the task are welcome. Email us rather than guessing.
