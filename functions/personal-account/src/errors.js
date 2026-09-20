/**
 * One error shape for every route.
 *
 * Routes throw rather than building a response, so the body is formatted in a
 * single place and cannot drift between routes. The dispatcher in main.js also
 * catches what nothing threw deliberately: an unexpected failure becomes a
 * controlled 500 instead of escaping to Appwrite, whose error bodies carry a
 * stack trace that has been observed to include the project's API key.
 */

export class HttpError extends Error {
  constructor(status, code, message, issues) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.issues = issues
  }

  toBody() {
    return {
      error: this.code,
      message: this.message,
      ...(this.issues ? { issues: this.issues } : {}),
    }
  }
}

export const unauthorized = () =>
  new HttpError(401, 'unauthorized', 'No authenticated principal.')

export const notFound = (message) => new HttpError(404, 'not_found', message)

export const invalidRequest = (issues) =>
  new HttpError(400, 'invalid_request', 'The request body is invalid.', issues)

export const conflict = (code, message) => new HttpError(409, code, message)
