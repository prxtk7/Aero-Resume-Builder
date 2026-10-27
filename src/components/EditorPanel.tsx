import type { Resume } from '../resume'
import {
  CertificationsSection,
  EducationSection,
  ExperienceSection,
  LanguagesSection,
  ProjectsSection,
} from './editor/ListSections'
import PersonalSection from './editor/PersonalSection'
import SkillsSection from './editor/SkillsSection'

type EditorPanelProps = {
  resume: Resume
  onChange: (resume: Resume) => void
}

// The full resume form. Each section edits one part of the resume and
// hands back the updated part, which is merged into the whole resume here.
function EditorPanel({ resume, onChange }: EditorPanelProps) {
  return (
    <div className="editor">
      <PersonalSection
        personal={resume.personal}
        onChange={(personal) => onChange({ ...resume, personal })}
      />
      <EducationSection
        items={resume.education}
        onChange={(education) => onChange({ ...resume, education })}
      />
      <ExperienceSection
        items={resume.experience}
        onChange={(experience) => onChange({ ...resume, experience })}
      />
      <ProjectsSection
        items={resume.projects}
        onChange={(projects) => onChange({ ...resume, projects })}
      />
      <SkillsSection
        skills={resume.skills}
        onChange={(skills) => onChange({ ...resume, skills })}
      />
      <CertificationsSection
        items={resume.certifications}
        onChange={(certifications) => onChange({ ...resume, certifications })}
      />
      <LanguagesSection
        items={resume.languages}
        onChange={(languages) => onChange({ ...resume, languages })}
      />
    </div>
  )
}

export default EditorPanel
