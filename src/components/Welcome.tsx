type WelcomeProps = {
  onStart: () => void
}

const steps = [
  {
    title: 'Enter your details',
    text: 'Add your education, experience, projects and skills in a guided form.',
  },
  {
    title: 'Preview as you go',
    text: 'See your resume take shape side by side while you edit.',
  },
  {
    title: 'Download a PDF',
    text: 'Export a clean, professional document ready for applications.',
  },
]

function Welcome({ onStart }: WelcomeProps) {
  return (
    <section className="welcome">
      <div className="welcome-intro">
        <p className="eyebrow">For students and early-career professionals</p>
        <h1>Build a professional resume without the formatting hassle.</h1>
        <p className="lead">
          Aero Resume Builder guides you through entering your information,
          shows a live preview, and turns it into a well-structured resume.
        </p>
        <button type="button" className="button-primary" onClick={onStart}>
          Start building your resume
        </button>
      </div>

      <ol className="steps">
        {steps.map((step, index) => (
          <li key={step.title} className="step">
            <span className="step-number">{index + 1}</span>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default Welcome
