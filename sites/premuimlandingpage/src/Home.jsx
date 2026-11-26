import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ProjectArt } from './ProjectArt'
import { fingerprintPath } from './fingerprint'
import { projects, studyHref } from './projects'

export function Arrow({ direction = 'up-right', className = '' }) {
  const path = {
    'up-right': 'M5 19 19 5M6 5h13v13',
    up: 'M12 21V4M5 11l7-7 7 7',
    down: 'M12 3v17m-7-7 7 7 7-7',
  }[direction]
  return <svg className={`arrow ${className}`} aria-hidden="true" viewBox="0 0 24 24"><path d={path} fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="square" /></svg>
}

export function Lines({ as: Tag = 'h2', id, className = '', lines, accent = -1, label }) {
  return (
    <Tag id={id} className={className} aria-label={label ?? lines.join(' ')}>
      {lines.map((line, i) => <span className={`line${i === accent ? ' ink-red' : ''}`} aria-hidden="true" key={line}><span className="line-ink">{line}</span></span>)}
    </Tag>
  )
}

export function Thread({ path, mobilePath, mobileViewBox, className = '', viewBox, label, tip = true, scene, delay, children }) {
  return (
    <svg className={`thread ${className}`} viewBox={viewBox} preserveAspectRatio="none"
      data-thread-scene={scene} data-thread-delay={delay} data-mobile-viewbox={mobileViewBox} data-base-viewbox={scene === 'hero' ? viewBox : undefined}
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <path className="thread-stroke" id={scene === 'hero' ? 'hero-ink' : undefined} data-thread data-mobile-path={mobilePath}
        data-base-path={scene === 'hero' ? path : undefined} d={path} pathLength="1" />
      {scene === 'hero' && <circle data-thread-start r="3.2" className="thread-dot thread-start" />}
      {(scene === 'hero' || scene === 'map') && <circle data-thread-ring r="9.5" className="thread-ring thread-head-ring" />}
      {tip && <circle data-thread-tip r="3.6" className="thread-dot" />}
      {children}
    </svg>
  )
}

const skills = [
  ['PRODUCT DESIGN', [
    ['Product Strategy', 'Find the right problem to solve.'],
    ['UX Research', 'Understand people before shaping solutions.'],
    ['Interaction Design', 'Make every action feel clear and natural.'],
    ['Design Systems', 'Build consistency that grows with the product.'],
    ['Prototyping', 'Make ideas tangible. Test what matters.'],
  ]],
  ['AI SYSTEMS', [
    ['AI Products', 'Turn intelligence into useful experiences.'],
    ['Agentic Systems', 'Give each agent a clear role and handoff.'],
    ['MCP', 'Connect models to the tools they need.'],
    ['RAG', 'Ground responses in relevant knowledge.'],
    ['Automation', 'Turn repeated work into reliable workflows.'],
  ]],
]

function Hero() {
  return (
    <section className="hero dark" aria-labelledby="hero-title" data-tone="dark">
      <Thread className="hero-thread" scene="hero" viewBox="0 0 1280 720"
        path="M81 86C142 129 242 158 403 186C429 190 433 203 382 232C306 274 179 308 85 335C42 348 24 376 24 397C24 425 46 438 96 438H886C1055 438 1069 429 1054 495C1041 560 893 568 911 501C916 481 979 484 979 506V572C974 589 984 597 960 617C934 638 922 676 922 720"
        mobileViewBox="0 0 390 750"
        mobilePath="M28 86C35 250 51 286 115 308C171 325 111 342 87 357C65 371 36 365 44 396C48 411 66 417 106 417H270C339 417 336 467 310 485C293 495 264 484 277 470C297 446 300 505 290 526C282 538 301 543 280 557C270 566 288 568 269 584C258 603 230 646 229 750">
        <defs>
          <mask id="hero-weave" maskUnits="userSpaceOnUse" x="0" y="0"><path fill="none" stroke="white" strokeWidth="7" /></mask>
          <path data-hero-tail />
        </defs>
      </Thread>
      <svg className="thread hero-thread-front" viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden="true">
        <use href="#hero-ink" mask="url(#hero-weave)" />
      </svg>
      <Lines as="h1" id="hero-title" className="hero-title" lines={['I DESIGN', 'PRODUCTS', 'THAT THINK.']} />
      <p className="hero-description">Product designer working across digital<br className="hero-break" /> experiences, AI products and intelligent systems.</p>
      <a href="#work" className="hero-follow mono-link" data-cursor="go">SCROLL TO FOLLOW THE THREAD <Arrow direction="down" /></a>
    </section>
  )
}

function WorkIntro() {
  return (
    <section className="work-intro light" id="work" aria-labelledby="work-title" data-tone="light">
      <div className="work-copy">
        <Lines id="work-title" lines={['FROM WHAT', 'PEOPLE NEED', 'TO WHAT', 'FEELS RIGHT.']} className="work-title" />
      </div>
      <p className="work-description" data-reveal>I connect human intent, product<br /> behavior and the systems underneath.</p>
      <Thread scene="work" className="work-thread" viewBox="0 0 1280 864"
        label="One continuous thread draws a lightbulb for intent, then connects interaction and system."
        mobileViewBox="0 0 390 958" mobilePath="M229 0C225 131 342 129 341 255C340 325 283 364 247 379C139 418 91 350 106 284C122 216 232 200 260 261C282 307 229 339 229 394C229 442 259 455 298 468Q335 481 324 501Q316 515 277 515H133Q107 515 107 540T132 565H269Q294 565 294 589T269 613H145Q121 613 121 638T147 664H228Q259 664 259 690V958"
        path="M922 0V166C922 291 935 359 935 426C935 462 973 461 973 423C973 368 1094 343 1094 255C1094 172 1013 114 923 114C823 114 747 175 747 255C747 327 810 350 830 382C846 407 820 432 860 451Q992 468 1038 474Q1055 479 1055 490Q1055 502 1037 504L862 520Q843 523 843 538Q843 554 863 554H1029Q1049 554 1049 572T1031 590H870Q852 590 852 610V645Q852 667 875 667H958Q982 667 982 690V715Q982 737 960 737H875V864">
        <g className="thread-labels" data-reveal>
          <text x="1130" y="300">INTENT</text><text x="1085" y="553">INTERACTION</text><text x="1011" y="704">SYSTEM</text>
        </g>
      </Thread>
    </section>
  )
}

function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="capabilities dark" data-tone="dark">
      <Lines id="capabilities-title" className="capabilities-title" lines={['I DESIGN THE EXPERIENCE.', 'AND THE INTELLIGENCE', 'BEHIND IT.']} accent={2} />
      <Thread scene="capabilities" className="capability-intro" viewBox="0 0 1280 500" path="M875 0Q875 28 898 28H1230Q1258 28 1258 54V328Q1258 361 1224 361H78C28 361 26 427 77 427H597Q640 427 640 468V500"
        mobileViewBox="0 0 390 250" mobilePath="M259 0C286 18 368 4 368 47V132C368 230 195 92 195 194V250" />
      <div className="capability-map">
        <Thread scene="map" viewBox="0 0 1280 800" path="M640 0V29C455 29 310 183 310 370C310 555 450 713 640 713V800"
          mobileViewBox="0 0 390 870" mobilePath="M195 0V37C194 48 143 47 143 90V668C143 721 180 728 195 744V870" />
        <Thread scene="map" delay={.05} viewBox="0 0 1280 800" path="M640 29C825 29 970 183 970 370C970 555 830 713 640 713"
          mobileViewBox="0 0 390 870" mobilePath="M195 37C196 48 247 47 247 90V668C247 721 209 728 195 744">
          <circle className="desktop-thread-detail thread-ring" cx="640" cy="29" r="9" /><circle className="desktop-thread-detail thread-ring" cx="640" cy="713" r="9" />
        </Thread>
        {skills.map(([label, entries], side) => (
          <div className={`skill-column skill-side-${side}`} key={label}>
            <h3 data-reveal>{label}</h3>
            <ul>{entries.map(([title, description], index) => (
              <li key={title} style={{ '--row': index }}>
                <span className="skill-marker" aria-hidden="true" /><strong>{title}</strong><span>{description}</span>
              </li>
            ))}</ul>
          </div>
        ))}
      </div>
    </section>
  )
}

const projectPaths = {
  eigna: 'M600 0C600 71 285 43 282 106V183Q282 210 308 210H554C602 210 619 169 670 186S804 199 886 220S1109 260 1129 217C1151 332 930 357 764 386S440 451 442 504C443 574 591 555 600 722',
  orbit: 'M600 0C599 60 982 50 1098 149C1162 204 1071 302 968 303C834 305 831 144 976 143S1161 333 1005 404C847 484 389 469 271 428C150 390 112 290 234 252S642 258 623 378C613 449 572 510 600 722',
  mealops: 'M600 0C599 80 244 25 218 137C194 242 355 319 480 281C663 227 703 122 842 161C1005 208 917 365 742 373S393 456 455 527C504 584 595 525 600 722',
  papertrail: 'M600 0C600 113 1135 52 1153 164Q1173 238 1092 270H86Q52 270 69 307L163 491Q183 526 235 526H1001C1047 526 1064 569 1006 593C872 649 600 549 600 722',
  scribe: 'M600 0C600 104 226 37 176 126C125 214 452 265 617 207C775 149 1033 124 1033 261C1033 392 584 365 469 430C348 498 489 532 685 523C819 516 601 613 600 722',
  crediflow: 'M600 0C600 104 258 42 249 122C241 204 637 191 826 212S1120 282 979 378C876 449 685 450 578 523C491 590 732 624 732 722',
}

function phoneProjectPath(index) {
  const bends = [
    'C192 35 356 32 350 126C346 241 153 155 157 268C161 453 208 465 155 550C114 615 112 690 161 729C238 786 327 840 286 918',
    'C184 50 289 53 282 147V251C282 326 89 369 94 497C98 614 311 559 289 700C272 809 102 845 153 933',
    'C198 50 286 72 285 181C284 265 138 250 156 336C174 413 206 406 207 504C208 612 126 639 183 710C225 768 304 781 272 875',
    'C200 30 326 92 324 201C321 315 82 291 103 418S336 472 284 584C215 748 108 644 143 790C153 839 229 846 195 918',
    'C195 36 300 94 299 199C297 238 165 242 188 316C221 425 270 431 271 508C271 571 211 587 240 674C266 780 349 824 253 925',
    'C197 65 340 65 333 162C326 275 211 268 250 364C282 454 380 474 344 553C318 611 205 647 226 727C245 813 314 820 281 913',
  ]
  return `M195 0${bends[index]}Q${index === 5 ? '290' : '195'} 982 ${index === 5 ? '290' : '195'} 1000`
}

function Projects() {
  return (
    <div id="projects" className="projects" aria-label="Selected project studies">
      {projects.map((project, index) => (
        <section key={project.slug} id={project.id} data-tone={project.light ? 'light' : 'dark'}
          aria-labelledby={`${project.id}-title`} className={`project-world world-${project.slug} ${project.light ? 'light' : 'dark'}`}>
          <p className="world-kicker mono" data-reveal>0{index + 1} / {project.field}</p>
          <p className="world-description" data-reveal>{project.description}</p>
          <Thread scene="project" className="world-thread" viewBox="0 0 1200 722" path={projectPaths[project.slug]}
            mobileViewBox="0 0 390 1000" mobilePath={phoneProjectPath(index)} />
          <div className="world-composition">
            <h3 className="world-title" id={`${project.id}-title`} data-reveal>
              <a href={studyHref(project.slug)} data-cursor="view">{project.name}</a>
            </h3>
            <ProjectArt project={project} />
          </div>
          <a className="world-link mono-link draw-underline" href={studyHref(project.slug)}
            aria-label={`Explore project: ${project.name}`} data-cursor="view">EXPLORE PROJECT <Arrow /></a>
        </section>
      ))}
    </div>
  )
}

function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="about light" data-tone="light">
      <div className="about-copy">
        <Lines id="about-title" lines={['EVERY PRODUCT', 'CARRIES A', 'HUMAN IMPRINT.']} />
        <p data-reveal>Mine comes from understanding people, shaping how things feel, and building the systems that make them work.</p>
        <div className="signature" data-reveal><strong>DECODE STUDIO.</strong><span>Product designer. Curious builder.</span></div>
      </div>
      <Thread scene="about" className="fingerprint" viewBox="0 0 1280 864"
        label="One continuous red thread forms a fingerprint." path={fingerprintPath(1280, 864)} />
    </section>
  )
}

const knot = 'M57 0C57 40 330 2 331 111C332 230 180 338 88 317C-21 292 49 111 174 120C303 129 357 257 355 385C353 504 132 525 72 431C8 331 242 120 390 129C515 135 470 252 345 329C227 402 104 458 117 522C135 605 373 625 451 559C527 497 445 366 360 323C248 267 164 187 109 216C10 268 91 430 250 461C403 491 505 433 510 332C516 217 378 225 310 285C247 341 147 420 173 487C192 538 258 592 258 649'
const straight = 'M57 0C57 23 112 47 132 67C142 82 159 100 171 117C177 132 183 143 187 157C194 169 199 181 202 198C207 211 211 224 214 233C218 248 220 263 223 276C226 288 229 307 232 321C234 332 236 346 237 360C238 375 241 389 243 402C245 417 246 431 247 444C248 459 247 472 249 487C250 500 251 512 252 524C252 537 253 549 254 562C254 575 255 588 255 601C256 610 256 618 257 627C257 635 258 640 258 649'

function extendKnot(path, x, y, width, height) {
  return path.replace('258 649', `${258 + x * 530 / width} ${649 + y * 718 / height}`)
}

function Contact() {
  const dialog = useRef(null)
  const grip = useRef(null)
  const thread = useRef(null)
  const opener = useRef(null)
  const drag = useRef(null)
  const animation = useRef(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => () => animation.current?.kill(), [])

  function openContact(trigger) {
    if (busy || dialog.current.open) return
    opener.current = trigger
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.current.showModal()
      return
    }
    setBusy(true)
    setStatus('Untangling the thread. The contact form will open shortly.')
    animation.current?.kill()
    const { width, height } = thread.current.ownerSVGElement.getBoundingClientRect()
    const drop = 29
    animation.current = gsap.timeline({
      defaults: { duration: .8, ease: 'power3.inOut' },
      onComplete: () => {
        setBusy(false)
        setStatus('')
        dialog.current.showModal()
      },
    })
      .to(thread.current, { attr: { d: extendKnot(straight, 0, drop, width, height) } }, 0)
      .to(grip.current, { x: 0, y: drop }, 0)
  }

  function closeContact() {
    setStatus('')
    animation.current?.kill()
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .55
    animation.current = gsap.timeline({ defaults: { duration, ease: 'power2.out' } })
      .to(thread.current, { attr: { d: knot } }, 0)
      .to(grip.current, { x: 0, y: 0 }, 0)
    opener.current?.focus({ preventScroll: true })
  }

  function startPull(event) {
    if (event.button !== 0 || busy) return
    animation.current?.kill()
    const { width, height } = thread.current.ownerSVGElement.getBoundingClientRect()
    drag.current = { x: event.clientX, y: event.clientY, width, height, distance: 0 }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function movePull(event) {
    if (!drag.current) return
    const x = gsap.utils.clamp(-80, 80, event.clientX - drag.current.x)
    const y = gsap.utils.clamp(-36, 108, event.clientY - drag.current.y)
    drag.current.distance = Math.hypot(x, y)
    gsap.set(grip.current, { x, y })
    thread.current.setAttribute('d', extendKnot(knot, x, y, drag.current.width, drag.current.height))
  }

  function endPull(event) {
    if (!drag.current) return
    const activate = drag.current.distance >= 38 && event.type !== 'pointercancel'
    drag.current = null
    if (activate) openContact(event.currentTarget)
    else {
      animation.current = gsap.timeline({ defaults: { duration: .3, ease: 'power2.out' } })
        .to(thread.current, { attr: { d: knot } }, 0)
        .to(grip.current, { x: 0, y: 0 }, 0)
    }
  }

  function validateContact(event) {
    event.preventDefault()
    setStatus('This local preview can validate the form. Message delivery is unavailable.')
  }

  return (
    <section id="contact" className="contact dark" aria-labelledby="contact-title" data-tone="dark" data-untangling={busy ? '' : undefined}>
      <div className="contact-copy">
        <Lines id="contact-title" lines={['HAVE A', 'PROBLEM', 'WORTH', 'UNTANGLING?']} label="Have a problem worth untangling?" />
        <button className="contact-action draw-underline" type="button" aria-haspopup="dialog" data-cursor="talk"
          disabled={busy} onClick={(event) => openContact(event.currentTarget)}>LET'S TALK. <Arrow /></button>
      </div>
      <Thread className="contact-lead" scene="contact-lead" viewBox="0 0 390 100"
        path="M195 0C211 15 371 24 349 51C334 74 116 78 88 100" />
      <div className="knot">
        <svg className="thread" data-thread-scene="contact" viewBox="0 0 530 718" preserveAspectRatio="none" aria-hidden="true">
          <path className="thread-stroke" ref={thread} data-thread d={knot} pathLength="1" />
          <circle className="thread-dot" data-thread-tip r="3.2" />
        </svg>
        <button type="button" className="thread-grip" ref={grip} data-cursor="pull" aria-label="Pull the thread to open the contact form"
          aria-haspopup="dialog" disabled={busy} onPointerDown={startPull} onPointerMove={movePull}
          onPointerUp={endPull} onPointerCancel={endPull} onClick={(event) => { if (event.detail === 0) openContact(event.currentTarget) }}>
          <span aria-hidden="true" />
        </button>
        <span className="grip-caption mono">{busy ? 'UNTANGLING…' : 'PULL TO UNTANGLE'}</span>
      </div>
      <a className="back-top mono-link draw-underline" href="#main-content" data-cursor="go">BACK TO TOP <Arrow direction="up" /></a>
      {busy && <span className="visually-hidden" role="status">{status}</span>}
      <dialog ref={dialog} className="contact-dialog" aria-labelledby="contact-form-title" onClose={closeContact}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return
          const bounds = event.currentTarget.getBoundingClientRect()
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current.close()
        }}>
        <button type="button" className="close-dialog" onClick={() => dialog.current.close()} aria-label="Close contact form" data-cursor="close" autoFocus>
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m4 4 16 16m0-16L4 20" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
        <div>
          <Lines as="h3" id="contact-form-title" lines={["LET'S", 'TALK.']} accent={1} />
          <p>A problem, an idea,<br />a possibility.</p>
        </div>
        <form className="contact-fields" onSubmit={validateContact}>
          <label>YOUR NAME<input autoComplete="name" name="name" placeholder="Your name" required /></label>
          <label>YOUR EMAIL<input autoComplete="email" type="email" name="email" placeholder="you@example.com" required /></label>
          <label className="message-field">WHAT'S ON YOUR MIND?<textarea name="message" placeholder="A problem, an idea, or something you’re figuring out." required /></label>
          {status && !busy && <p role="status" className="form-status">{status}</p>}
          <button type="submit" className="draw-underline send-message" data-cursor="send">SEND MESSAGE <Arrow /></button>
        </form>
      </dialog>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <WorkIntro />
      <Capabilities />
      <Projects />
      <About />
      <Contact />
    </>
  )
}
