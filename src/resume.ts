// The resume data model.
// All resume information lives in one `Resume` object, stored in App.tsx.
// The editor changes it, and the preview reads it.

export type PersonalInfo = {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  portfolio: string
  summary: string
}

// Every repeatable entry has a stable `id`, which React uses as its `key`.
export type EducationEntry = {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  location: string
  description: string
}

export type ExperienceEntry = {
  id: string
  employer: string
  jobTitle: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  responsibilities: string
}

export type ProjectEntry = {
  id: string
  name: string
  description: string
  technologies: string
  url: string
}

export type Skill = {
  id: string
  name: string
}

export type CertificationEntry = {
  id: string
  name: string
  issuer: string
  date: string
}

export type LanguageEntry = {
  id: string
  language: string
  proficiency: string
}

export type Resume = {
  personal: PersonalInfo
  education: EducationEntry[]
  experience: ExperienceEntry[]
  projects: ProjectEntry[]
  skills: Skill[]
  certifications: CertificationEntry[]
  languages: LanguageEntry[]
}

export const proficiencyLevels = [
  'Native',
  'Fluent',
  'Advanced',
  'Intermediate',
  'Basic',
]

// A short random ID. It only needs to be unique within this resume.
export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

// Returns true if at least one of the values contains visible text.
export function hasText(...values: string[]): boolean {
  return values.some((value) => value.trim() !== '')
}

// ---------- Empty values used when the app starts or an entry is added ----------

export function createEmptyResume(): Resume {
  return {
    personal: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      summary: '',
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    languages: [],
  }
}

export function createEducation(): EducationEntry {
  return {
    id: createId(),
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
  }
}

export function createExperience(): ExperienceEntry {
  return {
    id: createId(),
    employer: '',
    jobTitle: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    responsibilities: '',
  }
}

export function createProject(): ProjectEntry {
  return { id: createId(), name: '', description: '', technologies: '', url: '' }
}

export function createCertification(): CertificationEntry {
  return { id: createId(), name: '', issuer: '', date: '' }
}

export function createLanguage(): LanguageEntry {
  return { id: createId(), language: '', proficiency: '' }
}

// ---------- Templates ----------

export type TemplateId = 'classic' | 'modern' | 'minimal'

export const templates: { id: TemplateId; name: string; description: string }[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional serif layout with centred header',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Two columns with a side panel and accent colour',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Compact, plain single column, ATS-friendly',
  },
]

export function isTemplateId(value: unknown): value is TemplateId {
  return templates.some((template) => template.id === value)
}

// ---------- Helpers for lists of entries ----------
// They return a new array instead of changing the old one, which is how
// React notices that something changed.

export function addEntry<T>(items: T[], item: T): T[] {
  return [...items, item]
}

export function removeEntry<T extends { id: string }>(items: T[], id: string): T[] {
  return items.filter((item) => item.id !== id)
}

export function updateEntry<T extends { id: string }>(
  items: T[],
  id: string,
  changes: Partial<T>,
): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...changes } : item))
}

// ---------- PDF file name ----------

// "Jane O'Neil" -> "Jane-ONeil-Resume". Characters that are not allowed in
// file names (or would look odd) are removed.
export function resumeFileName(fullName: string): string {
  const safeName = fullName
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '') // remove accents: "José" -> "Jose"
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .join('-')
  return safeName ? `${safeName}-Resume` : 'Resume'
}
