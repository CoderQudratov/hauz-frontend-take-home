import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { sessionClient } from './appwrite'
import { createPersonalAccount, updatePersonalAccount } from './personal-account'
import { sanitizeError } from './safe-error'
import { readSessionCookie } from './session-cookie'

class NotSignedInError extends Error {
  constructor() {
    super('No signed-in session.')
  }
}

function requireSessionClient() {
  const secret = readSessionCookie()
  if (!secret) {
    throw new NotSignedInError()
  }
  return sessionClient(secret)
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
      return await createPersonalAccount(requireSessionClient(), data)
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
      return await updatePersonalAccount(requireSessionClient(), data)
    } catch (error) {
      if (error instanceof NotSignedInError) {
        throw error
      }
      throw sanitizeError(error, "Couldn't save your profile. Try again.")
    }
  })
