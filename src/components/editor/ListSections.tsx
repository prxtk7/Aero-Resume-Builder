import {
  createCertification,
  createEducation,
  createExperience,
  createLanguage,
  createProject,
  proficiencyLevels,
  type CertificationEntry,
  type EducationEntry,
  type ExperienceEntry,
  type LanguageEntry,
  type ProjectEntry,
} from '../../resume'
import { validateUrl } from '../../validation'
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from './FormFields'
import RepeatableSection from './RepeatableSection'

// Editor sections whose entries can be added and removed.
// Each one describes its fields; RepeatableSection does the rest.

// Use the first filled-in value as the entry heading, e.g. "Acme Ltd".
function entryTitle(fallback: string, index: number, ...values: string[]) {
  const filled = values.find((value) => value.trim() !== '')
  return filled ? filled.trim() : `${fallback} ${index + 1}`
}

type ListProps<T> = {
  items: T[]
  onChange: (items: T[]) => void
}

export function EducationSection({ items, onChange }: ListProps<EducationEntry>) {
  return (
    <RepeatableSection
      title="Education"
      items={items}
      onChange={onChange}
      createItem={createEducation}
      getItemTitle={(item, index) =>
        entryTitle('Education', index, item.institution, item.degree)
      }
      addLabel="Add education"
      emptyText="No education added yet."
      renderFields={(item, update) => (
        <>
          <TextField
            label="Institution"
            value={item.institution}
            onChange={(institution) => update({ institution })}
            wide
          />
          <TextField
            label="Degree"
            value={item.degree}
            onChange={(degree) => update({ degree })}
            placeholder="e.g. Bachelor of Science"
          />
          <TextField
            label="Field of study"
            value={item.fieldOfStudy}
            onChange={(fieldOfStudy) => update({ fieldOfStudy })}
            placeholder="e.g. Computer Science"
          />
          <TextField
            label="Start date"
            value={item.startDate}
            onChange={(startDate) => update({ startDate })}
            placeholder="e.g. Sep 2021"
          />
          <TextField
            label="End date"
            value={item.endDate}
            onChange={(endDate) => update({ endDate })}
            placeholder="e.g. Jun 2025"
          />
          <TextField
            label="Location"
            value={item.location}
            onChange={(location) => update({ location })}
            wide
          />
          <TextAreaField
            label="Description"
            value={item.description}
            onChange={(description) => update({ description })}
            placeholder="Grades, honours, relevant coursework..."
            rows={3}
          />
        </>
      )}
    />
  )
}

export function ExperienceSection({
  items,
  onChange,
}: ListProps<ExperienceEntry>) {
  return (
    <RepeatableSection
      title="Work experience"
      items={items}
      onChange={onChange}
      createItem={createExperience}
      getItemTitle={(item, index) =>
        entryTitle('Position', index, item.jobTitle, item.employer)
      }
      addLabel="Add work experience"
      emptyText="No work experience added yet."
      renderFields={(item, update) => (
        <>
          <TextField
            label="Job title"
            value={item.jobTitle}
            onChange={(jobTitle) => update({ jobTitle })}
          />
          <TextField
            label="Employer"
            value={item.employer}
            onChange={(employer) => update({ employer })}
          />
          <TextField
            label="Location"
            value={item.location}
            onChange={(location) => update({ location })}
            wide
          />
          <TextField
            label="Start date"
            value={item.startDate}
            onChange={(startDate) => update({ startDate })}
            placeholder="e.g. Jan 2023"
          />
          <TextField
            label="End date"
            value={item.current ? '' : item.endDate}
            onChange={(endDate) => update({ endDate })}
            placeholder={item.current ? 'Present' : 'e.g. Dec 2024'}
            disabled={item.current}
          />
          <CheckboxField
            label="I currently work here"
            checked={item.current}
            onChange={(current) => update({ current })}
          />
          <TextAreaField
            label="Responsibilities and achievements"
            value={item.responsibilities}
            onChange={(responsibilities) => update({ responsibilities })}
            hint="Put each point on a new line. Each line becomes a bullet point."
            rows={5}
          />
        </>
      )}
    />
  )
}

export function ProjectsSection({ items, onChange }: ListProps<ProjectEntry>) {
  return (
    <RepeatableSection
      title="Projects"
      items={items}
      onChange={onChange}
      createItem={createProject}
      getItemTitle={(item, index) => entryTitle('Project', index, item.name)}
      addLabel="Add project"
      emptyText="No projects added yet."
      renderFields={(item, update) => (
        <>
          <TextField
            label="Project name"
            value={item.name}
            onChange={(name) => update({ name })}
          />
          <TextField
            label="URL (optional)"
            type="url"
            value={item.url}
            onChange={(url) => update({ url })}
            placeholder="github.com/you/project"
            validate={validateUrl}
          />
          <TextField
            label="Technologies used"
            value={item.technologies}
            onChange={(technologies) => update({ technologies })}
            placeholder="e.g. React, TypeScript, Node.js"
            wide
          />
          <TextAreaField
            label="Description"
            value={item.description}
            onChange={(description) => update({ description })}
            rows={3}
          />
        </>
      )}
    />
  )
}

export function CertificationsSection({
  items,
  onChange,
}: ListProps<CertificationEntry>) {
  return (
    <RepeatableSection
      title="Certifications"
      items={items}
      onChange={onChange}
      createItem={createCertification}
      getItemTitle={(item, index) =>
        entryTitle('Certification', index, item.name)
      }
      addLabel="Add certification"
      emptyText="No certifications added yet."
      renderFields={(item, update) => (
        <>
          <TextField
            label="Certification name"
            value={item.name}
            onChange={(name) => update({ name })}
            wide
          />
          <TextField
            label="Issuing organisation"
            value={item.issuer}
            onChange={(issuer) => update({ issuer })}
          />
          <TextField
            label="Date or year"
            value={item.date}
            onChange={(date) => update({ date })}
            placeholder="e.g. 2024"
          />
        </>
      )}
    />
  )
}

export function LanguagesSection({ items, onChange }: ListProps<LanguageEntry>) {
  return (
    <RepeatableSection
      title="Languages"
      items={items}
      onChange={onChange}
      createItem={createLanguage}
      getItemTitle={(item, index) => entryTitle('Language', index, item.language)}
      addLabel="Add language"
      emptyText="No languages added yet."
      renderFields={(item, update) => (
        <>
          <TextField
            label="Language"
            value={item.language}
            onChange={(language) => update({ language })}
          />
          <SelectField
            label="Proficiency level"
            value={item.proficiency}
            onChange={(proficiency) => update({ proficiency })}
            options={proficiencyLevels}
            placeholder="Choose a level"
          />
        </>
      )}
    />
  )
}
