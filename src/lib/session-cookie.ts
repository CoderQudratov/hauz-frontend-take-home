/**
 * The only place the Appwrite session secret touches an HTTP response.
 *
 * The cookie is httpOnly, so no browser script can ever read it (satisfies
 * the "browser JS must never read the session secret" rule), `secure` outside
 * local dev, and `sameSite: 'lax'` so it still rides along on the top-level
 * navigation Appwrite's email link/redirect flow would use.
 */

import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'

const COOKIE_NAME = 'hauz_session'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export function readSessionCookie() {
  return getCookie(COOKIE_NAME) ?? null
}

export function writeSessionCookie(secret: string, expiresAt: string) {
  setCookie(COOKIE_NAME, secret, {
    ...cookieOptions,
    expires: new Date(expiresAt),
  })
}

export function clearSessionCookie() {
  deleteCookie(COOKIE_NAME, cookieOptions)
}
