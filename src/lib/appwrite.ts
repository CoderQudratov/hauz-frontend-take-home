/**
 * Server-only Appwrite client factories.
 *
 * `apiKeyClient` carries the project's API key and is used for the handful
 * of calls that must happen before a session exists (sending an email code,
 * exchanging it for a session) — these are ordinary Account endpoints, not
 * privileged operations; the key is just the only credential available
 * before a session exists. `sessionClient` carries a signed-in user's
 * session secret and is used for everything that should act as that user,
 * including executing the `personal-account` Function, which only accepts
 * calls from an authenticated user.
 *
 * Neither client, nor any secret they hold, ever reaches the browser: these
 * are only ever constructed inside server functions.
 */

import { Account, Client, Functions } from 'node-appwrite'

function baseClient() {
  return new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT ?? '')
    .setProject(process.env.APPWRITE_PROJECT_ID ?? '')
}

export function apiKeyClient() {
  return baseClient().setKey(process.env.APPWRITE_API_KEY ?? '')
}

export function sessionClient(sessionSecret: string) {
  return baseClient().setSession(sessionSecret)
}

export function accountFor(client: Client) {
  return new Account(client)
}

export function functionsFor(client: Client) {
  return new Functions(client)
}
