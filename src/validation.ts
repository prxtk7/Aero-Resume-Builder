// Simple checks for optional fields. An empty value is always valid,
// because these fields are not required on a resume.

export function validateEmail(value: string): string | null {
  const email = value.trim()
  if (!email) return null
  // Something@something.something, without spaces.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? null
    : 'Enter a valid email address, for example name@example.com.'
}

export function validateUrl(value: string): string | null {
  const url = value.trim()
  if (!url) return null
  if (/\s/.test(url)) return 'A web address cannot contain spaces.'

  // Allow addresses without "https://", such as "github.com/you".
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`
  try {
    const { hostname } = new URL(withProtocol)
    // Require a dot in the domain, e.g. "example.com".
    if (/^[^.]+\.[^.]{2,}/.test(hostname.replace(/^www\./, ''))) return null
  } catch {
    // Fall through to the error message below.
  }
  return 'Enter a valid web address, for example linkedin.com/in/your-name.'
}
