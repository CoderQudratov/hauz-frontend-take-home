/**
 * How this Function reaches TablesDB.
 *
 * The client is built per execution from the dynamic key Appwrite generates for
 * this Function and passes in `x-appwrite-key`. That key carries only the
 * scopes declared in appwrite.config.json, so it is administrative authority
 * over rows and nothing else. It is never proof of who is calling.
 */

import { Client, TablesDB } from 'node-appwrite'

export function tablesDb(req) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT ?? '')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID ?? '')
    .setKey(req.headers['x-appwrite-key'] ?? '')

  return new TablesDB(client)
}
