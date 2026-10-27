import { resumeFileName, templates, type Resume, type TemplateId } from '../resume'
import type { SaveStatus } from '../storage'
import ClearResumeButton from './ClearResumeButton'
import EditorPanel from './EditorPanel'
import ResumePreview from './ResumePreview'

type WorkspaceProps = {
  resume: Resume
  onChange: (resume: Resume) => void
  template: TemplateId
  onTemplateChange: (template: TemplateId) => void
  saveStatus: SaveStatus
  draftWasUnreadable: boolean
  onClear: () => void
  onBack: () => void
}

// Opens the browser's print dialog, where the user picks "Save as PDF".
// Print styles in App.css hide everything except the resume itself.
// Browsers use the page title as the suggested file name, so it is
// changed while printing and restored afterwards.
function exportPdf(fullName: string) {
  const originalTitle = document.title
  document.title = resumeFileName(fullName)
  window.addEventListener(
    'afterprint',
    () => {
      document.title = originalTitle
    },
    { once: true },
  )
  window.print()
}

// Two-column layout: editor on the left, preview on the right.
// On narrow screens the columns stack vertically (see App.css).
function Workspace({
  resume,
  onChange,
  template,
  onTemplateChange,
  saveStatus,
  draftWasUnreadable,
  onClear,
  onBack,
}: WorkspaceProps) {
  return (
    <>
      <div className="workspace-toolbar no-print">
        <button type="button" className="button-secondary" onClick={onBack}>
          &larr; Back to Home
        </button>

        <div className="toolbar-actions">
          <p
            className={saveStatus === 'saved' ? 'save-status' : 'save-status save-status-warning'}
            role="status"
          >
            {saveStatus === 'saved'
              ? 'Saved locally in this browser'
              : 'Saving unavailable: changes will be lost when you close this tab'}
          </p>
          <ClearResumeButton onConfirm={onClear} />
        </div>
      </div>

      {draftWasUnreadable && (
        <p className="notice no-print" role="alert">
          Your previously saved draft could not be read, so a new resume was
          started. A copy of the unreadable data was kept in this browser.
        </p>
      )}

      <div className="workspace">
        <section className="panel no-print" aria-labelledby="editor-heading">
          <h2 id="editor-heading" className="panel-title">
            Editor
          </h2>
          <EditorPanel resume={resume} onChange={onChange} />
        </section>

        <section className="panel panel-preview" aria-labelledby="preview-heading">
          <div className="preview-toolbar no-print">
            <h2 id="preview-heading" className="panel-title">
              Preview
            </h2>

            <fieldset className="template-picker">
              <legend>Template</legend>
              {templates.map((option) => (
                <label key={option.id} title={option.description}>
                  <input
                    type="radio"
                    name="template"
                    value={option.id}
                    checked={template === option.id}
                    onChange={() => onTemplateChange(option.id)}
                  />
                  <span>{option.name}</span>
                </label>
              ))}
            </fieldset>

            <div className="export">
              <button
                type="button"
                className="button-primary"
                onClick={() => exportPdf(resume.personal.fullName)}
              >
                Download PDF
              </button>
              <p className="export-hint">
                Opens the print dialog. Choose &ldquo;Save as PDF&rdquo; as
                the destination.
              </p>
            </div>
          </div>

          <ResumePreview resume={resume} template={template} />
        </section>
      </div>
    </>
  )
}

export default Workspace
