import { describe, expect, it } from 'vitest'
import { createEducation, createEmptyResume, createExperience } from './resume'
import {
  BACKUP_KEY,
  STORAGE_KEY,
  clearDraft,
  loadDraft,
  saveDraft,
  type Draft,
} from './storage'

// A tiny in-memory stand-in for the browser's localStorage.
class MemoryStorage implements Storage {
  private data = new Map<string, string>()
  get length() {
    return this.data.size
  }
  clear() {
    this.data.clear()
  }
  getItem(key: string) {
    return this.data.get(key) ?? null
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.data.delete(key)
  }
  setItem(key: string, value: string) {
    this.data.set(key, value)
  }
}

// Storage that throws, like a browser with site data blocked or a full quota.
class BrokenStorage extends MemoryStorage {
  getItem(): string | null {
    throw new Error('blocked')
  }
  setItem() {
    throw new Error('QuotaExceededError')
  }
}

function sampleDraft(): Draft {
  const resume = createEmptyResume()
  resume.personal.fullName = 'Jane Doe'
  resume.education = [{ ...createEducation(), institution: 'Uni A' }]
  resume.experience = [{ ...createExperience(), jobTitle: 'Engineer', current: true }]
  resume.skills = [{ id: 's1', name: 'React' }]
  return { resume, template: 'modern' }
}

describe('saving and restoring a draft', () => {
  it('restores exactly what was saved, including the template', () => {
    const storage = new MemoryStorage()
    const draft = sampleDraft()

    expect(saveDraft(draft, storage)).toBe(true)
    expect(loadDraft(storage)).toEqual({ status: 'restored', draft })
  })

  it('reports "empty" when nothing has been saved', () => {
    expect(loadDraft(new MemoryStorage())).toEqual({ status: 'empty' })
  })

  it('clears the saved draft', () => {
    const storage = new MemoryStorage()
    saveDraft(sampleDraft(), storage)
    clearDraft(storage)
    expect(loadDraft(storage)).toEqual({ status: 'empty' })
  })

  it('handles missing or blocked storage without throwing', () => {
    expect(loadDraft(null)).toEqual({ status: 'unavailable' })
    expect(saveDraft(sampleDraft(), null)).toBe(false)

    const broken = new BrokenStorage()
    expect(loadDraft(broken)).toEqual({ status: 'unavailable' })
    expect(saveDraft(sampleDraft(), broken)).toBe(false)
    expect(() => clearDraft(broken)).not.toThrow()
  })
})

describe('damaged saved data', () => {
  it('backs up invalid JSON instead of losing it', () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEY, '{not json')

    expect(loadDraft(storage)).toEqual({ status: 'invalid' })
    expect(storage.getItem(BACKUP_KEY)).toBe('{not json')
  })

  it('treats JSON without a resume as invalid', () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEY, JSON.stringify({ hello: 'world' }))
    expect(loadDraft(storage).status).toBe('invalid')
  })

  it('repairs partly damaged data and keeps what is usable', () => {
    const storage = new MemoryStorage()
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        template: 'does-not-exist',
        resume: {
          personal: { fullName: 'Jane', email: 42 },
          education: [{ id: 'e1', institution: 'Uni' }, 'junk', null],
          experience: 'not a list',
          skills: [{ id: 'x', name: 'Go' }, { id: 'x', name: 'Rust' }, { name: '  ' }],
        },
      }),
    )

    const result = loadDraft(storage)
    if (result.status !== 'restored') throw new Error('expected a restored draft')
    const { resume, template } = result.draft

    expect(template).toBe('classic')
    expect(resume.personal.fullName).toBe('Jane')
    expect(resume.personal.email).toBe('')
    expect(resume.education).toHaveLength(1)
    expect(resume.education[0]).toMatchObject({ id: 'e1', institution: 'Uni', degree: '' })
    expect(resume.experience).toEqual([])
    expect(resume.languages).toEqual([])
    // Blank skills are dropped and duplicate ids are replaced.
    expect(resume.skills.map((skill) => skill.name)).toEqual(['Go', 'Rust'])
    expect(new Set(resume.skills.map((skill) => skill.id)).size).toBe(2)
  })
})
