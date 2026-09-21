import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { accountFor, sessionClient } from './appwrite'
import { createPersonalAccount, updatePersonalAccount } from './personal-account'
import { sanitizeError } from './safe-error'
import { clearSessionCookie, readSessionCookie } from './session-cookie'

class NotSignedInError extends Error {
  constructor() {
    super('No signed-in session.')
  }
}

/**
 * A cookie being present isn't proof it's still good — the Appwrite session
 * behind it can have expired or been revoked. Verify it the same way
 * getAuthState does (Account.get()) before trusting it for a write, and
 * clear it on the same "any failure means signed out" terms.
 */
async function requireSessionClient() {
  const secret = readSessionCookie()
  if (!secret) {
    throw new NotSignedInError()
  }

  const client = sessionClient(secret)
  try {
    await accountFor(client).get()
  } catch {
    clearSessionCookie()
    throw new NotSignedInError()
  }

  return client
}

/**
 * Creates the account, or if one already exists, returns it unchanged
 * (the Function itself makes this idempotent, so a double-click on
 * "Continue" — two requests racing, or a retried request after a dropped
 * response — can never create two accounts).
 */
export const completeOnboarding = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      firstName: z.string().trim().min(1).max(100),
      lastName: z.string().trim().min(1).max(100),
      role: z.enum(['property_owner', 'realtor']),
    }),
  )
  .handler(async ({ data }) => {
    try {
      return await createPersonalAccount(await requireSessionClient(), data)
    } catch (error) {
      if (error instanceof NotSignedInError) {
        throw error
      }
      throw sanitizeError(error, "Couldn't create your account. Try again.")
    }
  })

export const updateProfile = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      firstName: z.string().trim().min(1).max(100),
      lastName: z.string().trim().min(1).max(100),
      contactEmail: z.email().max(254).nullable(),
      bio: z.string().trim().min(1).max(2000).nullable(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      return await updatePersonalAccount(await requireSessionClient(), data)
    } catch (error) {
      if (error instanceof NotSignedInError) {
        throw error
      }
      throw sanitizeError(error, "Couldn't save your profile. Try again.")
    }
  })
