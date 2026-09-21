/**
 * The `redirect` search param comes from the URL, so it is attacker
 * controlled. Only a same-page relative path is a valid destination; anything
 * else (an absolute URL, a protocol-relative `//evil.com`, or a backslash
 * variant like `/\evil.com` that some browsers normalize into `//evil.com`)
 * falls back to home instead of sending someone off this site after they
 * sign in.
 */
export function safeRedirectTarget(value: string | undefined): string {
  if (value && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) {
    return value
  }
  return '/'
}
