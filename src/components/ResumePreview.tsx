import type { ReactNode } from 'react'
import { hasText, type Resume, type TemplateId } from '../resume'
import { validateEmail, validateUrl } from '../validation'

type ResumePreviewProps = {
  resume: Resume
  template: TemplateId
}

// ---------- Small helpers for turning form text into display text ----------

// "Sep 2021" + "Jun 2025" -> "Sep 2021 – Jun 2025"
function dateRange(start: string, end: string, current = false) {
  const finish = current ? 'Present' : end.trim()
  return [start.trim(), finish].filter(Boolean).join(' – ')
}

// Joins the non-empty values with a separator, e.g. "Degree, Field".
function joinFilled(separator: string, ...values: string[]) {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .join(separator)
}

// One bullet per line; leading "-", "*" or "•" typed by the user is removed.
function toBulletPoints(text: string) {
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*[-*•]\s*/, '').trim())
    .filter(Boolean)
}

// Links without "https://" still need it to open correctly.
function toHref(url: string) {
  const trimmed = url.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

// Show "linkedin.com/in/name" instead of "https://www.linkedin.com/in/name/".
function displayUrl(url: string) {
  return url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '')
}

// Links are only made clickable when the address is valid.
function webLink(url: string): { text: string; href?: string } {
  return {
    text: displayUrl(url),
    href: validateUrl(url) ? undefined : toHref(url),
  }
}

function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="preview-section">
      <h4>{title}</h4>
      <div className="preview-section-body">{children}</div>
    </section>
  )
}

function MaybeLink({ text, href }: { text: string; href?: string }) {
  return href ? (
    <a href={href} target="_blank" rel="noreferrer">
      {text}
    </a>
  ) : (
    <span>{text}</span>
  )
}

// ---------- The resume document ----------
// All three templates show exactly the same data. The template only changes
// how the parts are arranged (end of this component) and styled
// (`.resume-classic`, `.resume-modern` and `.resume-minimal` in App.css).

function ResumePreview({ resume, template }: ResumePreviewProps) {
  const { personal } = resume

  // Only keep entries that contain something worth showing.
  const education = resume.education.filter((item) =>
    hasText(item.institution, item.degree, item.fieldOfStudy, item.description),
  )
  const experience = resume.experience.filter((item) =>
    hasText(item.jobTitle, item.employer, item.responsibilities),
  )
  const projects = resume.projects.filter((item) =>
    hasText(item.name, item.description, item.technologies),
  )
  const skills = resume.skills.filter((item) => hasText(item.name))
  const certifications = resume.certifications.filter((item) =>
    hasText(item.name, item.issuer),
  )
  const languages = resume.languages.filter((item) => hasText(item.language))

  const email = personal.email.trim()
  const contactLinks = [
    email && {
      text: email,
      href: validateEmail(email) ? undefined : `mailto:${email}`,
    },
    personal.phone.trim() && { text: personal.phone.trim() },
    personal.location.trim() && { text: personal.location.trim() },
    personal.linkedin.trim() && webLink(personal.linkedin),
    personal.portfolio.trim() && webLink(personal.portfolio),
  ].filter((item): item is { text: string; href?: string } => Boolean(item))

  const hasHeader =
    hasText(personal.fullName, personal.title) || contactLinks.length > 0

  const isEmpty =
    !hasHeader &&
    !hasText(personal.summary) &&
    education.length === 0 &&
    experience.length === 0 &&
    projects.length === 0 &&
    skills.length === 0 &&
    certifications.length === 0 &&
    languages.length === 0

  if (isEmpty) {
    return (
      <div className="preview-page preview-empty">
        <p className="preview-empty-title">Your resume will appear here</p>
        <p className="muted">
          Start by entering your name in the editor. Each section shows up in
          the preview as soon as you fill it in.
        </p>
      </div>
    )
  }

  // ---------- Each part of the resume, ready to be placed ----------

  const header = hasHeader && (
    <header className="preview-header">
      {hasText(personal.fullName) && <h3>{personal.fullName}</h3>}
      {hasText(personal.title) && (
        <p className="preview-title">{personal.title}</p>
      )}
      {contactLinks.length > 0 && (
        <ul className="preview-contact">
          {contactLinks.map((item) => (
            <li key={item.text}>
              <MaybeLink {...item} />
            </li>
          ))}
        </ul>
      )}
    </header>
  )

  const summarySection = hasText(personal.summary) && (
    <PreviewSection title="Summary">
      <p className="preview-text">{personal.summary}</p>
    </PreviewSection>
  )

  const experienceSection = experience.length > 0 && (
    <PreviewSection title="Experience">
      {experience.map((item) => {
        const bullets = toBulletPoints(item.responsibilities)
        return (
          <div key={item.id} className="preview-entry">
            <div className="preview-entry-head">
              <strong>{item.jobTitle || item.employer}</strong>
              <span>{dateRange(item.startDate, item.endDate, item.current)}</span>
            </div>
            <p className="preview-entry-sub">
              {joinFilled(' · ', item.jobTitle ? item.employer : '', item.location)}
            </p>
            {bullets.length > 0 && (
              <ul className="preview-bullets">
                {bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </PreviewSection>
  )

  const educationSection = education.length > 0 && (
    <PreviewSection title="Education">
      {education.map((item) => (
        <div key={item.id} className="preview-entry">
          <div className="preview-entry-head">
            <strong>
              {joinFilled(', ', item.degree, item.fieldOfStudy) || item.institution}
            </strong>
            <span>{dateRange(item.startDate, item.endDate)}</span>
          </div>
          <p className="preview-entry-sub">
            {joinFilled(
              ' · ',
              hasText(item.degree, item.fieldOfStudy) ? item.institution : '',
              item.location,
            )}
          </p>
          {hasText(item.description) && (
            <p className="preview-text">{item.description}</p>
          )}
        </div>
      ))}
    </PreviewSection>
  )

  const projectsSection = projects.length > 0 && (
    <PreviewSection title="Projects">
      {projects.map((item) => (
        <div key={item.id} className="preview-entry">
          <div className="preview-entry-head">
            <strong>{item.name || 'Untitled project'}</strong>
            {hasText(item.url) && <MaybeLink {...webLink(item.url)} />}
          </div>
          {hasText(item.technologies) && (
            <p className="preview-entry-sub">{item.technologies}</p>
          )}
          {hasText(item.description) && (
            <p className="preview-text">{item.description}</p>
          )}
        </div>
      ))}
    </PreviewSection>
  )

  // In the Modern side column, skills and languages read better as lists.
  const useLists = template === 'modern'

  const skillsSection = skills.length > 0 && (
    <PreviewSection title="Skills">
      {useLists ? (
        <ul className="preview-plain-list">
          {skills.map((skill) => (
            <li key={skill.id}>{skill.name}</li>
          ))}
        </ul>
      ) : (
        <p className="preview-text">
          {skills.map((skill) => skill.name).join(' · ')}
        </p>
      )}
    </PreviewSection>
  )

  const certificationsSection = certifications.length > 0 && (
    <PreviewSection title="Certifications">
      {certifications.map((item) => (
        <div key={item.id} className="preview-entry-head preview-cert">
          <span>
            <strong>{item.name}</strong>
            {hasText(item.name) && hasText(item.issuer) && ' — '}
            {item.issuer}
          </span>
          <span>{item.date}</span>
        </div>
      ))}
    </PreviewSection>
  )

  const languageText = (item: (typeof languages)[number]) =>
    item.proficiency ? `${item.language} (${item.proficiency})` : item.language

  const languagesSection = languages.length > 0 && (
    <PreviewSection title="Languages">
      {useLists ? (
        <ul className="preview-plain-list">
          {languages.map((item) => (
            <li key={item.id}>{languageText(item)}</li>
          ))}
        </ul>
      ) : (
        <p className="preview-text">{languages.map(languageText).join(' · ')}</p>
      )}
    </PreviewSection>
  )

  // ---------- Arrange the parts for the chosen template ----------

  // Modern: main content on the left, a narrow side column on the right.
  if (template === 'modern') {
    const hasSide =
      skills.length > 0 || languages.length > 0 || certifications.length > 0
    return (
      <article className="preview-page resume-modern" aria-label="Resume preview">
        {header}
        <div className={hasSide ? 'resume-columns' : 'resume-main'}>
          <div className="resume-main">
            {summarySection}
            {experienceSection}
            {projectsSection}
            {educationSection}
          </div>
          {hasSide && (
            <aside className="resume-side">
              {skillsSection}
              {languagesSection}
              {certificationsSection}
            </aside>
          )}
        </div>
      </article>
    )
  }

  // Classic and Minimal: one column in the conventional order.
  return (
    <article
      className={`preview-page resume-${template}`}
      aria-label="Resume preview"
    >
      {header}
      {summarySection}
      {experienceSection}
      {educationSection}
      {projectsSection}
      {skillsSection}
      {certificationsSection}
      {languagesSection}
    </article>
  )
}

export default ResumePreview
