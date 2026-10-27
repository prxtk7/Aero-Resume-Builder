import type { PersonalInfo } from '../../resume'
import { validateEmail, validateUrl } from '../../validation'
import { TextAreaField, TextField } from './FormFields'

type PersonalSectionProps = {
  personal: PersonalInfo
  onChange: (personal: PersonalInfo) => void
}

function PersonalSection({ personal, onChange }: PersonalSectionProps) {
  // Copy the current details and replace one field.
  function update(field: keyof PersonalInfo, value: string) {
    onChange({ ...personal, [field]: value })
  }

  return (
    <section className="form-section">
      <h3 className="form-section-title">Personal information</h3>
      <div className="field-grid">
        <TextField
          label="Full name"
          value={personal.fullName}
          onChange={(value) => update('fullName', value)}
          autoComplete="name"
        />
        <TextField
          label="Professional title"
          value={personal.title}
          onChange={(value) => update('title', value)}
          placeholder="e.g. Junior Software Developer"
        />
        <TextField
          label="Email"
          type="email"
          value={personal.email}
          onChange={(value) => update('email', value)}
          autoComplete="email"
          validate={validateEmail}
        />
        <TextField
          label="Phone"
          type="tel"
          value={personal.phone}
          onChange={(value) => update('phone', value)}
          autoComplete="tel"
        />
        <TextField
          label="City and country"
          value={personal.location}
          onChange={(value) => update('location', value)}
          placeholder="e.g. Amsterdam, Netherlands"
          wide
        />
        <TextField
          label="LinkedIn URL"
          type="url"
          value={personal.linkedin}
          onChange={(value) => update('linkedin', value)}
          placeholder="linkedin.com/in/your-name"
          validate={validateUrl}
        />
        <TextField
          label="Portfolio URL"
          type="url"
          value={personal.portfolio}
          onChange={(value) => update('portfolio', value)}
          placeholder="yourwebsite.com"
          validate={validateUrl}
        />
        <TextAreaField
          label="Professional summary"
          value={personal.summary}
          onChange={(value) => update('summary', value)}
          placeholder="Two or three sentences about your strengths and goals."
        />
      </div>
    </section>
  )
}

export default PersonalSection
