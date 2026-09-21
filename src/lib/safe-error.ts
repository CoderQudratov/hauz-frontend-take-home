import { PersonalAccountError } from './personal-account'

/**
 * The Appwrite SDK throws AppwriteException, whose message/response can
 * carry internal API detail. `PersonalAccountError`'s message already comes
 * from the personal-account Function's own sanitized error body, so it's
 * safe to show as-is; anything else gets logged server-side and replaced
 * with a generic, safe message before it can reach the browser.
 */
export function sanitizeError(error: unknown, fallbackMessage: string): Error {
  if (error instanceof PersonalAccountError) {
    return error
  }

  console.error(error)
  return new Error(fallbackMessage)
}
