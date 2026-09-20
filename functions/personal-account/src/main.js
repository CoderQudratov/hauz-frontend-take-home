/**
 * HAUZ personal account operations.
 *
 * The caller is never read from the request body. Appwrite injects the
 * authenticated principal as `x-appwrite-user-id` and refuses any execution
 * whose caller-supplied headers start with `x-appwrite`, so that header is the
 * only identity this Function trusts.
 *
 * Routes:
 *   GET    /personal-account   200 with the account, or 404 if there is none
 *   POST   /personal-account   201 created, 200 if it exists, 409 on role clash
 *   PATCH  /personal-account   200 with the updated account
 *
 * Every route answers 401 when the execution has no signed-in Appwrite user.
 */

import { tablesDb } from './appwrite.js'
import { HttpError, invalidRequest, notFound, unauthorized } from './errors.js'
import {
  createPersonalAccount,
  getPersonalAccount,
  updatePersonalAccount,
} from './handlers.js'

function readBody(req) {
  const text = (req.bodyText ?? req.body ?? '').trim()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    throw invalidRequest([
      { field: '', message: 'The request body is not valid JSON.' },
    ])
  }
}

function dispatch(context) {
  const { req, res } = context
  const route = `${req.method} ${req.path}`

  const userId = req.headers['x-appwrite-user-id']
  if (!userId) {
    throw unauthorized()
  }

  const deps = { tables: tablesDb(req), log: context.log }

  if (route === 'GET /personal-account') {
    return getPersonalAccount(deps, userId, res)
  }
  if (route === 'POST /personal-account') {
    return createPersonalAccount(deps, userId, readBody(req), res)
  }
  if (route === 'PATCH /personal-account') {
    return updatePersonalAccount(deps, userId, readBody(req), res)
  }

  throw notFound(`No route for ${route}.`)
}

export default async (context) => {
  try {
    return await dispatch(context)
  } catch (error) {
    if (error instanceof HttpError) {
      return context.res.json(error.toBody(), error.status)
    }

    // Log the detail, return none: an Appwrite error body can carry secrets.
    context.error(error instanceof Error ? (error.stack ?? error.message) : String(error))

    return context.res.json(
      { error: 'internal_error', message: 'Unexpected failure.' },
      500,
    )
  }
}
