import { useEffect, useRef, useState } from 'react'

type ClearResumeButtonProps = {
  onConfirm: () => void
}

// "Start new resume" asks for confirmation first, because clearing
// deletes the saved draft and cannot be undone.
function ClearResumeButton({ onConfirm }: ClearResumeButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const startRef = useRef<HTMLButtonElement>(null)

  // Move keyboard focus to the safe choice when the question appears.
  useEffect(() => {
    if (confirming) cancelRef.current?.focus()
  }, [confirming])

  function cancel() {
    setConfirming(false)
    // Wait for the button to render again, then focus it.
    requestAnimationFrame(() => startRef.current?.focus())
  }

  if (!confirming) {
    return (
      <button
        ref={startRef}
        type="button"
        className="button-secondary button-danger"
        onClick={() => setConfirming(true)}
      >
        Start new resume
      </button>
    )
  }

  return (
    <div
      className="confirm-box"
      role="alertdialog"
      aria-labelledby="confirm-clear-text"
      onKeyDown={(event) => event.key === 'Escape' && cancel()}
    >
      <p id="confirm-clear-text">
        Delete everything you have entered? This cannot be undone.
      </p>
      <div className="confirm-actions">
        <button
          type="button"
          className="button-danger-solid"
          onClick={() => {
            onConfirm()
            cancel()
          }}
        >
          Yes, delete
        </button>
        <button ref={cancelRef} type="button" className="button-secondary" onClick={cancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ClearResumeButton
