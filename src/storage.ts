import {
  createId,
  isTemplateId,
  type Resume,
  type TemplateId,
} from './resume'

// Saves the resume draft in the browser's localStorage, so it survives a
// page refresh. Nothing is sent to a server.

export const STORAGE_KEY = 'aero-resume-builder:draft'
// If a stored draft cannot be read, it is copied here before being replaced,
// so it is not lost silently.
export const BACKUP_KEY = 'aero-resume-builder:unreadable-draft'

export type Draft = {
  resume: Resume
  template: TemplateId
}

// Whether the latest changes are stored in the browser.
export type SaveStatus = 'saved' | 'unavailable'

// What happened when the saved draft was loaded.
export type LoadResult =
  | { status: 'restored'; draft: Draft }
  | { status: 'empty' } // nothing saved yet
  | { status: 'invalid' } // saved data was damaged and has been backed up
  | { status: 'unavailable' } // localStorage is blocked or missing

// localStorage can be missing or throw (private mode, blocked site data).
function getStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

// ---------- Turning unknown JSON back into a valid Resume ----------
// Anything missing or of the wrong type is replaced with an empty value,
// so a half-damaged draft still loads what it can.

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

// Reads a list of entries, keeping only objects and giving each a valid id.
function list<T>(value: unknown, read: (item: UnknownRecord, id: string) => T): T[] {
  if (!Array.isArray(value)) return []
  const seenIds = new Set<string>()
  return value.filter(isRecord).map((item) => {
    let id = text(item.id)
    if (!id || seenIds.has(id)) id = createId()
    seenIds.add(id)
    return read(item, id)
  })
}

export function normaliseResume(value: unknown): Resume | null {
  if (!isRecord(value) || !isRecord(value.personal)) return null
  const personal = value.personal

  return {
    personal: {
      fullName: text(personal.fullName),
      title: text(personal.title),
      email: text(personal.email),
      phone: text(personal.phone),
      location: text(personal.location),
      linkedin: text(personal.linkedin),
      portfolio: text(personal.portfolio),
      summary: text(personal.summary),
    },
    education: list(value.education, (item, id) => ({
      id,
      institution: text(item.institution),
      degree: text(item.degree),
      fieldOfStudy: text(item.fieldOfStudy),
      startDate: text(item.startDate),
      endDate: text(item.endDate),
      location: text(item.location),
      description: text(item.description),
    })),
    experience: list(value.experience, (item, id) => ({
      id,
      employer: text(item.employer),
      jobTitle: text(item.jobTitle),
      location: text(item.location),
      startDate: text(item.startDate),
      endDate: text(item.endDate),
      current: item.current === true,
      responsibilities: text(item.responsibilities),
    })),
    projects: list(value.projects, (item, id) => ({
      id,
      name: text(item.name),
      description: text(item.description),
      technologies: text(item.technologies),
      url: text(item.url),
    })),
    skills: list(value.skills, (item, id) => ({ id, name: text(item.name) })).filter(
      (skill) => skill.name.trim() !== '',
    ),
    certifications: list(value.certifications, (item, id) => ({
      id,
      name: text(item.name),
      issuer: text(item.issuer),
      date: text(item.date),
    })),
    languages: list(value.languages, (item, id) => ({
      id,
      language: text(item.language),
      proficiency: text(item.proficiency),
    })),
  }
}

// ---------- Public functions ----------

export function loadDraft(storage: Storage | null = getStorage()): LoadResult {
  if (!storage) return { status: 'unavailable' }

  let raw: string | null
  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch {
    return { status: 'unavailable' }
  }
  if (raw === null) return { status: 'empty' }

  try {
    const parsed: unknown = JSON.parse(raw)
    const resume = isRecord(parsed) ? normaliseResume(parsed.resume) : null
    if (resume && isRecord(parsed)) {
      const template = isTemplateId(parsed.template) ? parsed.template : 'classic'
      return { status: 'restored', draft: { resume, template } }
    }
  } catch {
    // Invalid JSON: handled below.
  }

  // Keep a copy of the damaged data instead of overwriting it silently.
  try {
    storage.setItem(BACKUP_KEY, raw)
  } catch {
    // Ignore: there is nothing more we can do.
  }
  return { status: 'invalid' }
}

// Returns true if the draft was saved.
export function saveDraft(draft: Draft, storage: Storage | null = getStorage()): boolean {
  if (!storage) return false
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...draft }))
    return true
  } catch {
    // Storage is full or blocked.
    return false
  }
}

export function clearDraft(storage: Storage | null = getStorage()): void {
  try {
    storage?.removeItem(STORAGE_KEY)
  } catch {
    // Ignore: the in-memory resume is reset anyway.
  }
}
