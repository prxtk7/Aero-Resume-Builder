import { describe, expect, it } from 'vitest'
import { validateEmail, validateUrl } from './validation'

describe('validateEmail', () => {
  it('accepts an empty value, because email is optional', () => {
    expect(validateEmail('')).toBeNull()
    expect(validateEmail('   ')).toBeNull()
  })

  it('accepts normal addresses, ignoring surrounding spaces', () => {
    expect(validateEmail('jane@example.com')).toBeNull()
    expect(validateEmail(' jane.doe+cv@mail.example.co.uk ')).toBeNull()
  })

  it('rejects incomplete addresses', () => {
    for (const value of ['jane', 'jane@', 'jane@example', '@example.com', 'ja ne@example.com']) {
      expect(validateEmail(value), value).toMatch(/valid email/)
    }
  })
})

describe('validateUrl', () => {
  it('accepts an empty value, because links are optional', () => {
    expect(validateUrl('')).toBeNull()
  })

  it('accepts addresses with or without https://', () => {
    for (const value of [
      'linkedin.com/in/jane',
      'https://www.linkedin.com/in/jane/',
      'http://jane.dev',
      'github.com/jane/project?tab=readme',
    ]) {
      expect(validateUrl(value), value).toBeNull()
    }
  })

  it('rejects values that are not web addresses', () => {
    for (const value of ['jane', 'not a url', 'https://', 'localhost', 'jane.c']) {
      expect(validateUrl(value), value).not.toBeNull()
    }
  })
})
