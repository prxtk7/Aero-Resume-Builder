type HeaderProps = {
  onHomeClick: () => void
}

function Header({ onHomeClick }: HeaderProps) {
  return (
    <header className="header">
      <button type="button" className="brand" onClick={onHomeClick}>
        <span className="brand-mark" aria-hidden="true">
          A
        </span>
        <span className="brand-name">Aero Resume Builder</span>
      </button>
    </header>
  )
}

export default Header
