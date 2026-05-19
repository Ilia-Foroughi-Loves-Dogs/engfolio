import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'engfolio-projects'

const initialProject = {
  title: '',
  field: '',
  problem: '',
  tools: '',
  built: '',
  impact: '',
  challenge: '',
  github: '',
  demo: '',
}

const fields = [
  {
    name: 'title',
    label: 'Project title',
    placeholder: 'Solar-powered campus weather station',
  },
  {
    name: 'field',
    label: 'Engineering field',
    placeholder: 'Mechanical engineering, robotics, civil engineering...',
  },
  {
    name: 'problem',
    label: 'Problem solved',
    placeholder: 'Students needed low-cost real-time weather data for lab planning.',
    multiline: true,
  },
  {
    name: 'tools',
    label: 'Tools/technologies used',
    placeholder: 'Arduino, SolidWorks, Python, MATLAB, Fusion 360, sensors',
  },
  {
    name: 'built',
    label: 'What you built',
    placeholder: 'Designed the enclosure, wired sensor modules, and built a dashboard.',
    multiline: true,
  },
  {
    name: 'impact',
    label: 'Measurable result or impact',
    placeholder: 'Reduced setup time by 30% and collected 2,000+ readings over 4 weeks.',
    multiline: true,
  },
  {
    name: 'challenge',
    label: 'Hardest challenge',
    placeholder: 'Calibrating noisy sensor data while keeping the device weatherproof.',
    multiline: true,
  },
  {
    name: 'github',
    label: 'GitHub link',
    placeholder: 'https://github.com/yourname/project',
  },
  {
    name: 'demo',
    label: 'Demo link',
    placeholder: 'https://your-demo-link.com',
  },
]

const actionVerbs = ['Designed', 'Developed', 'Built', 'Tested', 'Optimized']

function clean(value, fallback) {
  return value.trim() || fallback
}

function makeOutputs(project) {
  const title = clean(project.title, 'Engineering Project')
  const field = clean(project.field, 'engineering')
  const problem = clean(project.problem, 'a practical engineering problem')
  const tools = clean(project.tools, 'engineering tools')
  const built = clean(project.built, 'a functional prototype and supporting documentation')
  const impact = clean(project.impact, 'created a clearer, more reliable workflow for users')
  const challenge = clean(project.challenge, 'balancing technical constraints with usability')
  const github = project.github.trim()
  const demo = project.demo.trim()

  return {
    resume: [
      `${actionVerbs[0]} and ${actionVerbs[1].toLowerCase()} ${title}, a ${field} project addressing ${problem.toLowerCase()}, using ${tools}.`,
      `${actionVerbs[2]} ${built.toLowerCase()} and validated the solution through testing, iteration, and technical documentation.`,
      `${actionVerbs[3]} project performance and communicated results showing ${impact.toLowerCase()}.`,
      `${actionVerbs[4]} the final approach by resolving ${challenge.toLowerCase()} without overstating project scope or results.`,
    ],
    readme: `# ${title}

## Summary
${title} is a ${field} project built to address ${problem.toLowerCase()}.

## What I Built
${built}

## Tools and Technologies
${tools}

## Result
${impact}

## Hardest Challenge
${challenge}
${github ? `\n## Repository\n${github}` : ''}${demo ? `\n\n## Demo\n${demo}` : ''}`,
    linkedin: `I recently worked on ${title}, a ${field} project focused on ${problem.toLowerCase()}.

Using ${tools}, I ${built.toLowerCase()}.

The most valuable part of the project was working through ${challenge.toLowerCase()}. The final result: ${impact.toLowerCase()}.

This project helped me practice turning an engineering idea into something testable, explainable, and useful.${github ? `\n\nGitHub: ${github}` : ''}${demo ? `\nDemo: ${demo}` : ''}`,
    interview: [
      `Start with the problem: ${problem}`,
      `Explain your role clearly: ${built}`,
      `Name the technical stack and why it fit: ${tools}`,
      `Discuss tradeoffs, especially around ${challenge.toLowerCase()}.`,
      `Close with the result: ${impact}`,
    ],
    card: {
      title,
      field,
      summary: `${built} The project addressed ${problem.toLowerCase()} and resulted in ${impact.toLowerCase()}.`,
      tools,
      github,
      demo,
    },
  }
}

function App() {
  const [project, setProject] = useState(initialProject)
  const [savedProjects, setSavedProjects] = useState([])
  const [generated, setGenerated] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
      setSavedProjects(Array.isArray(stored) ? stored : [])
    } catch {
      setSavedProjects([])
    }
  }, [])

  const outputs = useMemo(() => makeOutputs(project), [project])

  const combinedOutput = useMemo(
    () => `RESUME BULLETS
${outputs.resume.map((item) => `- ${item}`).join('\n')}

GITHUB README SUMMARY
${outputs.readme}

LINKEDIN PROJECT POST
${outputs.linkedin}

INTERVIEW TALKING POINTS
${outputs.interview.map((item) => `- ${item}`).join('\n')}

PORTFOLIO PROJECT CARD
${outputs.card.title}
${outputs.card.field}
${outputs.card.summary}
Tools: ${outputs.card.tools}
${outputs.card.github ? `GitHub: ${outputs.card.github}` : ''}
${outputs.card.demo ? `Demo: ${outputs.card.demo}` : ''}`,
    [outputs],
  )

  function updateProject(event) {
    const { name, value } = event.target
    setProject((current) => ({ ...current, [name]: value }))
  }

  function generateProject() {
    setGenerated(true)
    setCopyStatus('')
  }

  function saveProject() {
    const entry = {
      ...project,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
    }
    const nextProjects = [entry, ...savedProjects].slice(0, 8)
    setSavedProjects(nextProjects)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProjects))
    setGenerated(true)
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(combinedOutput)
      setCopyStatus('Copied')
    } catch {
      setCopyStatus('Copy unavailable')
    }
  }

  function loadProject(savedProject) {
    setProject({
      title: savedProject.title || '',
      field: savedProject.field || '',
      problem: savedProject.problem || '',
      tools: savedProject.tools || '',
      built: savedProject.built || '',
      impact: savedProject.impact || '',
      challenge: savedProject.challenge || '',
      github: savedProject.github || '',
      demo: savedProject.demo || '',
    })
    setGenerated(true)
    setCopyStatus('')
  }

  function deleteProject(id) {
    const nextProjects = savedProjects.filter((item) => item.id !== id)
    setSavedProjects(nextProjects)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProjects))
  }

  return (
    <main className="app-shell">
      <section className="intro-section">
        <div className="intro-copy">
          <p className="eyebrow">Engineering student portfolio builder</p>
          <h1>EngFolio</h1>
          <p className="intro-text">
            Turn real project details into polished career materials without paid APIs or inflated language.
          </p>
        </div>
        <div className="intro-panel" aria-label="Generated output preview">
          <span>Resume</span>
          <span>README</span>
          <span>LinkedIn</span>
          <span>Interview</span>
          <span>Portfolio</span>
        </div>
      </section>

      <section className="workspace" aria-label="EngFolio generator">
        <form className="project-form" onSubmit={(event) => event.preventDefault()}>
          <div className="section-heading">
            <p className="eyebrow">Project inputs</p>
            <h2>Describe what you actually built</h2>
          </div>

          <div className="field-grid">
            {fields.map((field) => (
              <label className={field.multiline ? 'field field-wide' : 'field'} key={field.name}>
                <span>{field.label}</span>
                {field.multiline ? (
                  <textarea
                    name={field.name}
                    value={project[field.name]}
                    onChange={updateProject}
                    placeholder={field.placeholder}
                    rows="4"
                  />
                ) : (
                  <input
                    name={field.name}
                    value={project[field.name]}
                    onChange={updateProject}
                    placeholder={field.placeholder}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="actions">
            <button type="button" className="primary-button" onClick={generateProject}>
              Generate
            </button>
            <button type="button" onClick={saveProject}>
              Save Project
            </button>
            <button type="button" onClick={copyOutput}>
              Copy Output
            </button>
            {copyStatus && <span className="copy-status">{copyStatus}</span>}
          </div>
        </form>

        <aside className="saved-projects" aria-label="Saved projects">
          <div className="section-heading">
            <p className="eyebrow">Local library</p>
            <h2>Saved projects</h2>
          </div>

          {savedProjects.length === 0 ? (
            <p className="empty-state">Saved projects will appear here and stay in this browser.</p>
          ) : (
            <div className="saved-list">
              {savedProjects.map((savedProject) => (
                <article className="saved-item" key={savedProject.id}>
                  <div>
                    <h3>{clean(savedProject.title, 'Untitled project')}</h3>
                    <p>{clean(savedProject.field, 'Engineering')}</p>
                  </div>
                  <div className="saved-actions">
                    <button type="button" onClick={() => loadProject(savedProject)}>
                      Load
                    </button>
                    <button type="button" onClick={() => deleteProject(savedProject.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </aside>
      </section>

      <section className="output-section" aria-live="polite">
        <div className="section-heading">
          <p className="eyebrow">Generated materials</p>
          <h2>{generated ? 'Ready to tailor and submit' : 'Fill in the form, then generate'}</h2>
        </div>

        <div className="output-grid">
          <article className="output-card">
            <h3>Resume bullets</h3>
            <ul>
              {outputs.resume.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>

          <article className="output-card readme-card">
            <h3>GitHub README summary</h3>
            <pre>{outputs.readme}</pre>
          </article>

          <article className="output-card">
            <h3>LinkedIn project post</h3>
            <p className="preserve-lines">{outputs.linkedin}</p>
          </article>

          <article className="output-card">
            <h3>Interview talking points</h3>
            <ul>
              {outputs.interview.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="portfolio-card">
            <p className="portfolio-label">Portfolio card</p>
            <h3>{outputs.card.title}</h3>
            <p className="portfolio-field">{outputs.card.field}</p>
            <p>{outputs.card.summary}</p>
            <p className="tool-line">{outputs.card.tools}</p>
            <div className="link-row">
              {outputs.card.github && <a href={outputs.card.github}>GitHub</a>}
              {outputs.card.demo && <a href={outputs.card.demo}>Demo</a>}
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
