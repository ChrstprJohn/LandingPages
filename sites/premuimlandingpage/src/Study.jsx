import { Arrow, Thread } from './Home'
import { StudyArt } from './ProjectArt'
import { chapterLabels, projects, studyHref } from './projects'

function StudyMap({ project }) {
  return (
    <figure className="study-map" data-reveal>
      <div className="map-center"><strong>{project.steps[0]}</strong><span className="mono">CONNECTED PRODUCT</span></div>
      <ol>{project.steps.map((step, index) => <li key={step}><span className="mono">0{index + 1}</span>{step}</li>)}</ol>
      <figcaption className="mono">{project.name} / PRODUCT ARCHITECTURE</figcaption>
    </figure>
  )
}

function Principles({ project, index }) {
  const groups = index === 2 ? [
    [project.steps[0], project.chapters[0][1]], [project.steps[2], project.chapters[2][1]], [project.steps[4], project.chapters[3][1]],
  ] : [
    ['The thinking', project.chapters[1][1]], ['The decision', project.chapters[4][1]], ['The result', project.chapters[6][1]],
  ]
  return (
    <dl className="principles" data-reveal>
      {groups.map(([label, description], i) => (
        <div key={label}><dt><span className="mono">0{i + 1}</span>{label}</dt><dd>{description}</dd></div>
      ))}
    </dl>
  )
}

function Journeys({ project }) {
  return (
    <div className="journeys">
      {project.journeys.map(([heading, steps], i) => (
        <article key={heading} className="journey" data-reveal>
          <p className="mono">JOURNEY 0{i + 1}</p><h3>{heading}.</h3>
          <ol>{steps.map((step, n) => <li key={step}><span className="mono">0{n + 1}</span><strong>{step}</strong></li>)}</ol>
        </article>
      ))}
    </div>
  )
}

function StudyChapters({ project }) {
  return (
    chapterLabels.map(([id, , label], i) => {
      const [heading, copy] = project.chapters[i]
      const light = i % 2 === 0 ? !project.light : project.light
      return (
        <section key={id} id={id} className={`study-chapter chapter-${id} ${light ? 'light' : 'dark'}`}
          data-tone={light ? 'light' : 'dark'} aria-labelledby={`${id}-title`}>
          <div className="study-chapter-inner">
            <p className="mono study-index" data-reveal>0{i + 2} / {label}</p>
            <div className="chapter-copy">
              <h2 id={`${id}-title`}>{heading}</h2>
              <p data-reveal>{copy}</p>
            </div>
            {(i === 2 || i === 4) && <Principles project={project} index={i} />}
            {i === 3 && <StudyMap project={project} />}
            {i === 5 && <Journeys project={project} />}
            {i === 7 && <dl className="study-measures" data-reveal>
              {project.measures.map(([value, name]) => <div key={name}><dt className="mono">{name}</dt><dd>{value}</dd></div>)}
            </dl>}
          </div>
        </section>
      )
    })
  )
}

export default function Study({ project }) {
  const index = projects.indexOf(project)
  const next = projects.find(({ slug }) => slug === project.next)
  return (
    <article className="study">
      <section className={`study-hero ${project.light ? 'light' : 'dark'}`} data-tone={project.light ? 'light' : 'dark'} aria-labelledby="study-title">
        <p className="mono study-index">0{index + 1} / {project.field}</p>
        <h1 id="study-title" className={`study-title study-title-${project.slug}`}>{project.name}</h1>
        <div className="study-lede"><p>{project.intro}</p><span className="mono">PROJECT STUDY</span></div>
        <StudyArt project={project} />
        <p className="mono study-caption">PRODUCT MAP / {project.scope}</p>
        <dl className="study-meta">
          <div><dt className="mono">ROLE</dt><dd>{project.slug === 'orbit' ? 'Product and system design' : 'Product design'}</dd></div>
          <div><dt className="mono">SCOPE</dt><dd>{project.scope}</dd></div>
          {project.market && <div><dt className="mono">MARKET / DOMAIN</dt><dd>{project.market}</dd></div>}
          <div><dt className="mono">RESPONSIBILITIES</dt><dd>{project.responsibilities}</dd></div>
        </dl>
        <nav className="chapter-nav" aria-label="Case study chapters">
          <span className="mono">IN THIS STUDY</span>
          {chapterLabels.map(([id, label]) => <a href={`#${id}`} className="draw-underline" data-cursor="go" key={id}>{label}</a>)}
        </nav>
      </section>
      <Thread className="study-thread" scene="study" viewBox="0 0 45 1000" path="M24 0V1000" />
      <StudyChapters project={project} />
      <section id="next-project" data-tone={next.light ? 'light' : 'dark'} className={`next-study ${next.light ? 'light' : 'dark'}`} aria-label={next.name}>
        <p className="mono study-index" data-reveal>10 / NEXT PROJECT</p>
        <a className="next-study-link" href={studyHref(next.slug)} data-cursor="view">{next.name}<Arrow /></a>
        <p className="next-tagline" data-reveal>{next.tagline}</p>
        <StudyArt project={next} />
        <p className="mono study-caption" data-reveal>THE THREAD CONTINUES</p>
      </section>
    </article>
  )
}
