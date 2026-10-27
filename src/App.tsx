import { useEffect, useState } from 'react'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Workspace from './components/Workspace'
import { createEmptyResume, type Resume, type TemplateId } from './resume'
import {
  clearDraft,
  loadDraft,
  saveDraft,
  type LoadResult,
  type SaveStatus,
} from './storage'
import './App.css'

// The app has two screens for now:
// - "welcome": the landing screen with an introduction
// - "builder": the editor + preview workspace
type Screen = 'welcome' | 'builder'

// The builder screen lives at "#/builder" in the address bar. Using the URL
// hash gives each screen its own browser history entry, so the browser's
// Back and Forward buttons work without adding a routing library.
const BUILDER_HASH = '#/builder'

function getScreenFromUrl(): Screen {
  return window.location.hash === BUILDER_HASH ? 'builder' : 'welcome'
}

function App() {
  const [screen, setScreen] = useState<Screen>(getScreenFromUrl)

  // Read the saved draft once, when the app starts.
  const [initialLoad] = useState<LoadResult>(() => loadDraft())
  const restored = initialLoad.status === 'restored' ? initialLoad.draft : null

  // All resume data in one place, shared by the editor and the preview.
  const [resume, setResume] = useState<Resume>(
    () => restored?.resume ?? createEmptyResume(),
  )
  const [template, setTemplate] = useState<TemplateId>(
    restored?.template ?? 'classic',
  )
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(
    initialLoad.status === 'unavailable' ? 'unavailable' : 'saved',
  )

  // Every change is saved straight away, so a refresh never loses work.
  function saveChanges(nextResume: Resume, nextTemplate: TemplateId) {
    setResume(nextResume)
    setTemplate(nextTemplate)
    const saved = saveDraft({ resume: nextResume, template: nextTemplate })
    setSaveStatus(saved ? 'saved' : 'unavailable')
  }

  // Browser Back/Forward changes the URL; update the screen to match.
  useEffect(() => {
    function handlePopState() {
      setScreen(getScreenFromUrl())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function goTo(next: Screen) {
    if (next !== getScreenFromUrl()) {
      const url =
        next === 'builder'
          ? BUILDER_HASH
          : window.location.pathname + window.location.search
      window.history.pushState(null, '', url)
    }
    setScreen(next)
    window.scrollTo(0, 0)
  }

  function startNewResume() {
    clearDraft()
    saveChanges(createEmptyResume(), template)
  }

  return (
    <div className="app">
      <Header onHomeClick={() => goTo('welcome')} />

      <main className="app-main">
        {screen === 'welcome' ? (
          <Welcome onStart={() => goTo('builder')} />
        ) : (
          <Workspace
            resume={resume}
            onChange={(next) => saveChanges(next, template)}
            template={template}
            onTemplateChange={(next) => saveChanges(resume, next)}
            saveStatus={saveStatus}
            draftWasUnreadable={initialLoad.status === 'invalid'}
            onClear={startNewResume}
            onBack={() => goTo('welcome')}
          />
        )}
      </main>

      <footer className="app-footer">
        Aero Resume Builder &middot; Your resume stays in this browser
      </footer>
    </div>
  )
}

export default App
