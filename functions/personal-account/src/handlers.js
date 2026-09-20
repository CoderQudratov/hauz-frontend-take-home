/**
 * The Personal Account: one per Appwrite User, created during onboarding.
 *
 * The unique index on `appwrite_user_id` is what enforces the "one per user"
 * rule. The lookups here are only a friendlier answer for the common case.
 */

import { ID, Query } from 'node-appwrite'

import { conflict, invalidRequest, notFound } from './errors.js'
import { createRequest, updateRequest } from './validation.js'

const DATABASE_ID = 'main'
const TABLE_ID = 'personal_accounts'

/** The response shape, built in one place so the routes cannot drift apart. */
function describe(row) {
  return {
    personalAccountId: row.$id,
    firstName: row.first_name,
    lastName: row.last_name,
    role: row.role,
    contactEmail: row.contact_email ?? null,
    bio: row.bio ?? null,
    createdAt: row.$createdAt,
    updatedAt: row.$updatedAt,
  }
}

/** Turns a schema failure into the one error shape every route answers with. */
function parse(schema, body) {
  const parsed = schema.safeParse(body ?? {})
  if (parsed.success) {
    return parsed.data
  }

  throw invalidRequest(
    parsed.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  )
}

async function findByOwner(deps, userId) {
  const found = await deps.tables.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    queries: [Query.equal('appwrite_user_id', userId), Query.limit(1)],
  })

  return found.rows[0] ?? null
}

/** Every route but create needs an account to already exist. */
async function requireProfile(deps, userId) {
  const profile = await findByOwner(deps, userId)
  if (!profile) {
    throw notFound('The caller owns no personal account yet.')
  }

  return profile
}

/**
 * A retry must succeed, but a request naming a different role is not a retry:
 * answering 200 would report success while ignoring what was asked for.
 */
function reconcile(profile, role) {
  if (profile.role !== role) {
    throw conflict(
      'personal_account_inconsistent',
      `The caller already owns a personal account with the role "${profile.role}".`,
    )
  }

  return describe(profile)
}

/** Discovery: 404 means this person has not onboarded yet, which is normal. */
export async function getPersonalAccount(deps, userId, res) {
  const profile = await requireProfile(deps, userId)

  return res.json(describe(profile), 200)
}

export async function createPersonalAccount(deps, userId, body, res) {
  const { firstName, lastName, role } = parse(createRequest, body)

  const existing = await findByOwner(deps, userId)
  if (existing) {
    return res.json(reconcile(existing, role), 200)
  }

  try {
    const created = await deps.tables.createRow({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      rowId: ID.unique(),
      data: {
        appwrite_user_id: userId,
        first_name: firstName,
        last_name: lastName,
        role,
      },
    })

    deps.log(`Created personal account ${created.$id} for ${userId}`)

    return res.json(describe(created), 201)
  } catch (error) {
    // The unique index is what actually enforces one account per user. Two
    // requests that arrive together both pass the lookup above; the loser of
    // the race lands here and should still see a success.
    const winner = await findByOwner(deps, userId)
    if (!winner) {
      throw error
    }

    return res.json(reconcile(winner, role), 200)
  }
}

/**
 * A partial edit: an omitted field keeps its stored value, null clears it.
 * Role is not editable. An account is created with one and keeps it.
 */
export async function updatePersonalAccount(deps, userId, body, res) {
  const fields = parse(updateRequest, body)
  const profile = await requireProfile(deps, userId)

  const columns = {
    firstName: 'first_name',
    lastName: 'last_name',
    contactEmail: 'contact_email',
    bio: 'bio',
  }

  const data = Object.fromEntries(
    Object.entries(fields).map(([field, value]) => [columns[field], value]),
  )

  const updated = await deps.tables.updateRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: profile.$id,
    data,
  })

  return res.json(describe(updated), 200)
}
