import { describe, expect, it } from 'vitest'
import {
  addEntry,
  createEducation,
  createEmptyResume,
  hasText,
  isTemplateId,
  removeEntry,
  resumeFileName,
  templates,
  updateEntry,
} from './resume'

describe('repeatable entries', () => {
  it('adds an entry without changing the original list', () => {
    const original = [createEducation()]
    const added = createEducation()
    const result = addEntry(original, added)

    expect(result).toHaveLength(2)
    expect(result[1]).toBe(added)
    expect(original).toHaveLength(1)
  })

  it('removes only the entry with the given id', () => {
    const [a, b, c] = [createEducation(), createEducation(), createEducation()]
    const result = removeEntry([a, b, c], b.id)

    expect(result.map((item) => item.id)).toEqual([a.id, c.id])
  })

  it('updates only the matching entry', () => {
    const [a, b] = [createEducation(), createEducation()]
    const result = updateEntry([a, b], b.id, { institution: 'Uni B' })

    expect(result[0]).toBe(a)
    expect(result[1].institution).toBe('Uni B')
    expect(b.institution).toBe('')
  })

  it('creates entries with unique ids', () => {
    const ids = new Set(Array.from({ length: 200 }, () => createEducation().id))
    expect(ids.size).toBe(200)
  })

  it('starts with an empty resume and no entries', () => {
    const resume = createEmptyResume()
    expect(Object.values(resume.personal).every((value) => value === '')).toBe(true)
    expect(resume.education).toEqual([])
    expect(resume.skills).toEqual([])
  })
})

describe('templates', () => {
  it('has three templates', () => {
    expect(templates.map((template) => template.id)).toEqual([
      'classic',
      'modern',
      'minimal',
    ])
  })

  it('recognises valid template ids only', () => {
    expect(isTemplateId('modern')).toBe(true)
    expect(isTemplateId('fancy')).toBe(false)
    expect(isTemplateId(undefined)).toBe(false)
  })
})

describe('hasText', () => {
  it('ignores whitespace-only values', () => {
    expect(hasText('', '   ', '\n')).toBe(false)
    expect(hasText('', ' a ')).toBe(true)
  })
})

describe('resumeFileName', () => {
  it('joins name parts with hyphens', () => {
    expect(resumeFileName('Jane Doe')).toBe('Jane-Doe-Resume')
  })

  it('removes characters that are not safe in file names', () => {
    expect(resumeFileName('  Jane / O\'Neil: <CV>?  ')).toBe('Jane-ONeil-CV-Resume')
  })

  it('removes accents', () => {
    expect(resumeFileName('José Müller')).toBe('Jose-Muller-Resume')
  })

  it('falls back to "Resume" when no usable name is given', () => {
    expect(resumeFileName('')).toBe('Resume')
    expect(resumeFileName('***')).toBe('Resume')
  })
})
