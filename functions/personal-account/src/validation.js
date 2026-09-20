import { z } from 'zod'

export const PERSONAL_ROLES = ['property_owner', 'realtor']

export const createRequest = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  role: z.enum(PERSONAL_ROLES),
})

/**
 * Omitting a field leaves it untouched; sending null clears it. That is the
 * difference between "I am not editing this" and "I no longer have one".
 *
 * An empty string is neither, so it is rejected rather than quietly stored. A
 * cleared optional field has to read back as null, not as "".
 */
const clearedWithNull = 'Send null to clear this field, not an empty string.'

export const updateRequest = z
  .object({
    firstName: z.string().trim().min(1, clearedWithNull).max(100).optional(),
    lastName: z.string().trim().min(1, clearedWithNull).max(100).optional(),
    contactEmail: z
      .email(`Provide a valid email address. ${clearedWithNull}`)
      .max(254)
      .nullable()
      .optional(),
    bio: z
      .string()
      .trim()
      .min(1, clearedWithNull)
      .max(2000)
      .nullable()
      .optional(),
  })
  .refine((fields) => Object.keys(fields).length > 0, {
    message: 'Provide at least one field to update.',
  })
