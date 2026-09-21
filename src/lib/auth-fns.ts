import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { accountFor, adminClient, sessionClient } from './appwrite'
import { getPersonalAccount, type PersonalAccount } from './personal-account'
import { sanitizeError } from './safe-error'
import { clearSessionCookie, readSessionCookie, writeSessionCookie } from './session-cookie'

export interface AuthState {
  user: { id: string; email: string } | null
  account: PersonalAccount | null
}

/** Step 1 of sign-in: email a one-time code. Works for new and returning people alike. */
export const requestEmailCode = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.email() }))
  .handler(async ({ data }) => {
    try {
      const account = accountFor(adminClient())
      const token = await account.createEmailToken({
        userId: crypto.randomUUID(),
        email: data.email,
      })

      return { userId: token.userId }
    } catch (error) {
      throw sanitizeError(error, "Couldn't send a sign-in code. Try again in a moment.")
    }
  })

/** Step 2: exchange the code for a session, and report whether onboarding is needed. */
export const verifyEmailCode = createServerFn({ method: 'POST' })
  .validator(z.object({ userId: z.string().min(1), secret: z.string().min(1) }))
  .handler(async ({ data }) => {
    let session
    try {
      const account = accountFor(adminClient())
      session = await account.createSession({ userId: data.userId, secret: data.secret })
    } catch (error) {
      throw sanitizeError(error, 'That code is invalid or has expired.')
    }

    writeSessionCookie(session.secret, session.expire)

    try {
      const client = sessionClient(session.secret)
      const existingAccount = await getPersonalAccount(client)

      return { needsOnboarding: existingAccount === null }
    } catch (error) {
      throw sanitizeError(error, "Signed in, but couldn't check your account. Try refreshing.")
    }
  })

/**
 * The single source of truth for "who is this and do they have a profile".
 * Any failure here is treated as signed out, per the product notes: a bad
 * or expired session cookie is deleted rather than left to fail again on
 * every page.
 */
export const getAuthState = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthState> => {
    const secret = readSessionCookie()
    if (!secret) {
      return { user: null, account: null }
    }

    try {
      const client = sessionClient(secret)
      const user = await accountFor(client).get()
      const account = await getPersonalAccount(client)

      return { user: { id: user.$id, email: user.email }, account }
    } catch {
      clearSessionCookie()
      return { user: null, account: null }
    }
  },
)

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const secret = readSessionCookie()
  if (secret) {
    try {
      await accountFor(sessionClient(secret)).deleteSession({ sessionId: 'current' })
    } catch {
      // The session may already be gone. Either way the cookie comes off next.
    }
  }
  clearSessionCookie()
})
