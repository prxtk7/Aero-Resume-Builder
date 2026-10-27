import { useId, useState, type FormEvent } from 'react'
import { createId, type Skill } from '../../resume'

type SkillsSectionProps = {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
}

function SkillsSection({ skills, onChange }: SkillsSectionProps) {
  const inputId = useId()
  // The text currently typed in the "Add a skill" box.
  const [draft, setDraft] = useState('')

  function addSkill(event: FormEvent) {
    event.preventDefault()
    const name = draft.trim()
    if (!name) return

    // Ignore duplicates such as "react" when "React" already exists.
    const exists = skills.some(
      (skill) => skill.name.toLowerCase() === name.toLowerCase(),
    )
    if (!exists) {
      onChange([...skills, { id: createId(), name }])
    }
    setDraft('')
  }

  function removeSkill(id: string) {
    onChange(skills.filter((skill) => skill.id !== id))
  }

  return (
    <section className="form-section">
      <h3 className="form-section-title">Skills</h3>

      {/* A <form> lets the Enter key add the skill. */}
      <form className="skill-form" onSubmit={addSkill}>
        <div className="field">
          <label htmlFor={inputId}>Add a skill</label>
          <input
            id={inputId}
            type="text"
            value={draft}
            placeholder="e.g. TypeScript"
            onChange={(event) => setDraft(event.target.value)}
          />
        </div>
        <button type="submit" className="button-secondary">
          Add
        </button>
      </form>

      {skills.length === 0 ? (
        <p className="empty-text">No skills added yet.</p>
      ) : (
        <ul className="skill-chips" aria-label="Your skills">
          {skills.map((skill) => (
            <li key={skill.id} className="skill-chip">
              <span>{skill.name}</span>
              <button
                type="button"
                aria-label={`Remove skill ${skill.name}`}
                onClick={() => removeSkill(skill.id)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default SkillsSection
