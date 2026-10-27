import { useId, useState } from 'react'

// Small labelled form controls used throughout the editor.
// `useId` links each <label> to its input so screen readers announce it.

type TextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel' | 'url'
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
  wide?: boolean
  // Returns an error message, or null when the value is fine.
  validate?: (value: string) => string | null
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  disabled,
  wide,
  validate,
}: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  // Only show an error after the user has left the field once, so they are
  // not interrupted while still typing.
  const [touched, setTouched] = useState(false)
  const error = touched && validate ? validate(value) : null

  return (
    <div className={wide ? 'field field-wide' : 'field'}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        // Plain text inputs so the browser does not show its own
        // validation pop-ups; our message below is used instead.
        type={type === 'email' || type === 'url' ? 'text' : type}
        inputMode={type === 'email' ? 'email' : type === 'url' ? 'url' : undefined}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => {
          setTouched(true)
          // Remove spaces typed by accident at the start or end.
          if (value !== value.trim()) onChange(value.trim())
        }}
      />
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}

type TextAreaFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
  rows?: number
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 4,
}: TextAreaFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  return (
    <div className="field field-wide">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
    </div>
  )
}

type SelectFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

type CheckboxFieldProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  const id = useId()
  return (
    <div className="field field-wide field-checkbox">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}
