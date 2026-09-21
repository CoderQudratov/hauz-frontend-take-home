/**
 * Typed access to the `personal-account` Function, always executed as the
 * signed-in user (the Function trusts only the `x-appwrite-user-id` header
 * Appwrite itself injects, so there is nothing for this client to forge).
 */

import { ExecutionMethod, type Client } from 'node-appwrite'

import { functionsFor } from './appwrite'

export type PersonalRole = 'property_owner' | 'realtor'

export interface PersonalAccount {
  personalAccountId: string
  firstName: string
  lastName: string
  role: PersonalRole
  contactEmail: string | null
  bio: string | null
  createdAt: string
  updatedAt: string
}

export class PersonalAccountError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly issues?: Array<{ field: string; message: string }>,
  ) {
    super(message)
    this.name = 'PersonalAccountError'
  }
}

const FUNCTION_ID = process.env.APPWRITE_FUNCTION_ID ?? 'personal-account'

async function execute(
  client: Client,
  method: ExecutionMethod,
  body?: Record<string, unknown>,
) {
  const execution = await functionsFor(client).createExecution({
    functionId: FUNCTION_ID,
    method,
    xpath: '/personal-account',
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'content-type': 'application/json' },
  })

  const status = execution.responseStatusCode
  const parsed = execution.responseBody ? JSON.parse(execution.responseBody) : null

  if (status >= 400) {
    const error = parsed as
      | { error: string; message: string; issues?: Array<{ field: string; message: string }> }
      | null
    throw new PersonalAccountError(
      status,
      error?.error ?? 'internal_error',
      error?.message ?? 'The personal-account Function failed.',
      error?.issues,
    )
  }

  return parsed as PersonalAccount
}

export async function getPersonalAccount(client: Client) {
  try {
    return await execute(client, ExecutionMethod.GET)
  } catch (error) {
    if (error instanceof PersonalAccountError && error.status === 404) {
      return null
    }
    throw error
  }
}

export async function createPersonalAccount(
  client: Client,
  input: { firstName: string; lastName: string; role: PersonalRole },
) {
  return execute(client, ExecutionMethod.POST, input)
}

export async function updatePersonalAccount(
  client: Client,
  input: Partial<{
    firstName: string
    lastName: string
    contactEmail: string | null
    bio: string | null
  }>,
) {
  return execute(client, ExecutionMethod.PATCH, input)
}
