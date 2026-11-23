import { lazy, Suspense, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { essayBody, essayMedia, essaySources, essays, projects, team } from './content'
import { reducedMotion, useEntrance, wipeEase } from './entrance'
import { ContactArtwork } from './ContactArtwork'
import './styles.css'

const Model = lazy(() => import('./Model').then(({ Model }) => ({ default: Model })))

const media = (file) => `/media/${file}`
const essayUrl = (slug) => `/blog-posts/${slug}`
const number = (index) => String(index + 1).padStart(2, '0')
const menuMask = { closed: 'inset(0 0 100% 0)', open: 'inset(0 0 0% 0)' }
const menuMaskEase = CustomEase.create('menuMask', '0.9,0,0.1,1')
const menuLinkEase = CustomEase.create('menuLink', '0.7,0,0.3,1')
const decodeC = 'M57 2 L46 2 L41 7 L41 18 L46 23 L57 23'
const foldedDecodeC = 'M57 6.5 L47.5 2 L41 9 L41 16 L47.5 23 L57 18.5'

function DecodeMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 118 25" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 2h10l5 5v11l-5 5H2Z" />
      <path d="M37 2H24L22 4V10L23.5 12.5L22 15V21L24 23H37" /><path data-decode-e-bar="" d="M24 12.5h11" />
      <path data-decode-c="" d={decodeC} />
      <path d="M66 2h7l5 5v11l-5 5h-7l-5-5V7Z" />
      <path d="M83 2h10l5 5v11l-5 5H83Z" />
      <path d="M117 2H105L103 4V10L104.5 12.5L103 15V21L105 23H117M105 12.5h10" />
    </svg>
  )
}

function Logo({ href = '/', intro = false, onClick }) {
  const mark = useRef(null)
  const hover = useRef(null)
  useGSAP(() => {
    if (reducedMotion()) return
    const fold = (timeline) => timeline
      .to('[data-decode-e-bar]', { x: 6 }, 0)
      .to('[data-decode-c]', { attr: { d: foldedDecodeC } }, 0)
    hover.current = fold(gsap.timeline({ paused: true, defaults: { duration: 0.38, ease: 'power2.inOut' } }))
    if (intro) fold(gsap.timeline({ delay: 1.75, repeat: 1, yoyo: true, defaults: { duration: 0.5, ease: 'power2.inOut' } }))
  }, { scope: mark })
  const fold = (event) => {
    if (!event.currentTarget.closest('.is-loading')) hover.current?.play()
  }
  const unfold = () => hover.current?.reverse()
  return (
    <a className="wordmark" href={href} aria-label="Decode home" onPointerEnter={fold} onPointerLeave={unfold} onFocus={fold} onBlur={unfold} onClick={(event) => {
      fold(event)
      onClick?.(event)
    }}>
      <span ref={mark}><DecodeMark /></span>
    </a>
  )
}

function Connector() {
  return <span className="connector" aria-hidden="true" />
}

function RollingText({ children }) {
  return <span className="roll-text"><span>{children}</span><span aria-hidden="true">{children}</span></span>
}

function DesktopCursor() {
  const cursor = useRef(null)
  useGSAP(() => {
    const mediaQuery = gsap.matchMedia()
    mediaQuery.add('(hover: hover) and (pointer: fine) and (width > 991px) and (prefers-reduced-motion: no-preference)', () => {
      const element = cursor.current
      const root = document.documentElement
      const x = gsap.quickTo(element, 'x', { duration: 0.34, ease: 'power3.out' })
      const y = gsap.quickTo(element, 'y', { duration: 0.34, ease: 'power3.out' })
      let visible = false

      const hide = () => {
        visible = false
        delete root.dataset.customCursor
      }
      const move = (event) => {
        if (event.pointerType !== 'mouse' || event.target.closest('input, textarea, select, [contenteditable], .model')) {
          hide()
          return
        }
        element.dataset.kind = event.target.closest('.wordmark') ? 'hand' : event.target.closest('a, button, summary') ? 'arrow' : 'square'
        x(event.clientX, visible ? undefined : event.clientX)
        y(event.clientY, visible ? undefined : event.clientY)
        root.dataset.customCursor = ''
        visible = true
      }
      document.addEventListener('pointermove', move, { passive: true })
      root.addEventListener('pointerleave', hide)
      window.addEventListener('blur', hide)
      return () => {
        hide()
        document.removeEventListener('pointermove', move)
        root.removeEventListener('pointerleave', hide)
        window.removeEventListener('blur', hide)
      }
    })
    return () => mediaQuery.revert()
  })
  return (
    <span ref={cursor} className="desktop-cursor" aria-hidden="true">
      <svg viewBox="0 0 20 24" width="20" height="24" fill="white" stroke="black" strokeLinejoin="round">
        <path d="M7 12V3a1.5 1.5 0 0 1 3 0v7-2a1.5 1.5 0 0 1 3 0v3-1a1.5 1.5 0 0 1 3 0v2a1.5 1.5 0 0 1 3 0v4l-3 6H8l-5-7a1.7 1.7 0 0 1 2.5-2.3L7 14Z" />
      </svg>
    </span>
  )
}

function Label({ children, symbol = '├' }) {
  return <span className="section-label"><span aria-hidden="true">{symbol}</span>{children}</span>
}

function Cta({ children, className = '', ...props }) {
  return <button className={`cta ${className}`} {...props}><Connector /><RollingText>{children}</RollingText></button>
}

function Header({ home, blog, active, open, intro }) {
  const sections = [['investments', 'Services'], ['teams', 'Team'], ['contact', 'Contact']]
  return (
    <header className="site-header">
      <Logo href={home ? '#top' : '/'} intro={intro} />
      <nav className="desktop-nav" aria-label="Main navigation">
        {sections.map(([id, label]) => (
          <a key={id} className={active === id ? 'active' : ''} href={home ? `#${id}` : `/?section=${id}`}>{label}</a>
        ))}
        <a href="/blog" className={blog ? 'active' : ''} aria-current={blog ? 'page' : undefined}>Blog</a>
      </nav>
      <div className="mobile-nav">
        <button className="contact-icon" aria-label="Start a project" onClick={() => open('join')}>D</button>
        <button className="menu-icon" aria-label="Open menu" aria-haspopup="dialog" onClick={() => open('menu')}><i /><i /><i /></button>
      </div>
    </header>
  )
}

function Overlay({ kind, label, close, children }) {
  const dialog = useRef(null)
  const surface = useRef(null)
  const closing = useRef(false)
  const opening = useRef(null)
  const { contextSafe } = useGSAP(() => {
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    if (!reducedMotion()) {
      const open = gsap.timeline()
      opening.current = open
      if (kind === 'menu') {
        open.fromTo(surface.current, { clipPath: menuMask.closed }, { clipPath: menuMask.open, duration: 1, ease: menuMaskEase }, 0)
        open.from('.menu-grid > *', { y: 50, rotation: 5, duration: 0.75, stagger: 0.05, ease: menuLinkEase }, 0.3)
      } else if (kind === 'project') {
        open.from(element, { yPercent: 100, duration: 0.8, ease: menuMaskEase }, 0)
      } else {
        open.from('.join-backdrop', { yPercent: 100, duration: 0.9, ease: wipeEase }, 0)
      }
      if (kind === 'join') {
        open.from('.join-model-motion', { yPercent: 68, duration: 0.85, ease: wipeEase }, 0.58)
        open.from('.join-form > :not(form), .join-form form > *', {
          y: 18, autoAlpha: 0, duration: 0.75, stagger: 0.065, ease: 'expo.out',
        }, 0.57)
      }
    }
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
    }
  }, { scope: dialog })

  const dismiss = contextSafe((after) => {
    if (closing.current) return
    closing.current = true
    if (reducedMotion()) {
      close(after)
      return
    }
    if (kind === 'menu') {
      opening.current?.kill()
      gsap.timeline({ onComplete: () => close(after) })
        .to(surface.current, { clipPath: menuMask.closed, duration: 1, ease: menuMaskEase, overwrite: 'auto' }, 0)
        .to('.menu-grid > *', { y: 50, rotation: 5, duration: 0.75, stagger: { each: 0.05, from: 'end' }, ease: menuLinkEase, overwrite: 'auto' }, 0)
      return
    }
    gsap.to(dialog.current, {
      yPercent: 100,
      duration: 0.6,
      ease: kind === 'project' ? menuMaskEase : wipeEase,
      overwrite: 'auto',
      onComplete: () => close(after),
    })
  })

  return (
    <dialog ref={dialog} className={`overlay overlay-${kind}`} aria-label={label} onCancel={(event) => {
      event.preventDefault()
      dismiss()
    }}>
      {kind === 'join' && <div className="join-backdrop" aria-hidden="true" />}
      <div className="overlay-surface" ref={surface}>
        <button className="close-overlay" autoFocus onClick={() => dismiss()}>Close <Connector /></button>
        {children(dismiss)}
      </div>
    </dialog>
  )
}

function Menu({ home, dismiss }) {
  const links = [['investments', 'Services'], ['teams', 'Team'], ['contact', 'Contact']]
  const follow = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    dismiss(event.currentTarget.getAttribute('href'))
  }
  return (
    <div className="menu-content">
      <Logo href={home ? '#top' : '/'} onClick={follow} />
      <nav className="menu-grid" aria-label="Mobile navigation">
        {links.map(([id, label]) => {
          const href = home ? `#${id}` : `/?section=${id}`
          return <a key={id} href={href} onClick={follow}>{label}</a>
        })}
        <a href="/blog" onClick={follow}>Blog</a>
        <Cta onClick={() => dismiss('join')}>Start a project</Cta>
      </nav>
    </div>
  )
}

function Media({ item }) {
  const [file, label, poster] = item
  if (file.endsWith('.webm')) {
    return (
      <video muted loop playsInline preload="none" src={media(file)}
        poster={poster ? media(poster) : undefined} aria-label={label} />
    )
  }
  return <img src={media(file)} alt={label} loading="lazy" />
}

function Gallery({ project, prefix }) {
  return (
    <div className={`gallery gallery-${project.id}`}>
      {project.gallery.map((item, index) => (
        <figure className={`frame frame-${index + 1}`} key={`${prefix}-${item[0]}`}>
          <Media item={item} />
        </figure>
      ))}
    </div>
  )
}

function FactTable({ facts }) {
  return <dl className="facts">{facts.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
}

function ProjectIcons() {
  return <div className="project-icons" aria-hidden="true">
    <img src={media('recycle-icon.png')} alt="" /><img src={media('robotics-icon.png')} alt="" /><img src={media('money-icon.png')} alt="" />
  </div>
}

function ProjectInfo({ project, heading: Heading = 'h2', dismiss }) {
  return (
    <>
      <ul className="project-tags">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
      <Heading className="project-title reveal">{project.lines.map((line) => <span key={line}>{line}{' '}</span>)}</Heading>
      <div className="project-info">
        <ProjectIcons />
        <figure className="company-logo"><Media item={project.gallery[0]} /></figure>
        <div className="project-summary">
          <p>{project.summary}</p>
          <a className="website-link" href={project.url} onClick={(event) => {
            if (!dismiss || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
            event.preventDefault()
            dismiss(project.url)
          }}>Read the guide</a>
        </div>
        <FactTable facts={project.facts} />
      </div>
    </>
  )
}

function MobileProject({ project, index, open }) {
  return (
    <article className="mobile-project">
      <div className="mobile-project-top">
        <span>{number(index)}</span>
        <div><h2>{project.mobileTitle || project.title}</h2>
          <ul>{(project.mobileTags || project.tags.slice(1)).map((tag) => <li key={tag}>{tag}</li>)}</ul>
        </div>
        <button onClick={() => open(index)} aria-label={`More about ${project.mobileTitle || project.title}`} aria-haspopup="dialog">More</button>
      </div>
      <ProjectStrip project={project} />
    </article>
  )
}

function ProjectStrip({ project }) {
  const strip = useRef(null)
  useGSAP(() => {
    const element = strip.current
    const mode = gsap.matchMedia(element)
    mode.add('(max-width: 991px) and (prefers-reduced-motion: no-preference)', () => {
      const duplicate = element.querySelector('[aria-hidden="true"]')
      const loopWidth = () => duplicate.offsetLeft - element.firstElementChild.offsetLeft
      const autoplay = gsap.fromTo(element, { scrollLeft: 0 }, {
        scrollLeft: loopWidth,
        duration: 15,
        ease: 'none',
        repeat: -1,
        repeatRefresh: true,
        paused: true,
      })
      const play = () => {
        if (!element.matches(':focus-visible') && loopWidth()) {
          autoplay.progress((element.scrollLeft % loopWidth()) / loopWidth()).play()
        }
      }
      const pause = () => autoplay.pause()
      play()
      element.addEventListener('focusin', pause)
      element.addEventListener('focusout', play)
      element.addEventListener('pointerdown', pause)
      element.addEventListener('pointerup', play)
      element.addEventListener('pointercancel', play)
      element.addEventListener('pointerleave', play)
      return () => {
        element.removeEventListener('focusin', pause)
        element.removeEventListener('focusout', play)
        element.removeEventListener('pointerdown', pause)
        element.removeEventListener('pointerup', play)
        element.removeEventListener('pointercancel', play)
        element.removeEventListener('pointerleave', play)
      }
    })
    return () => mode.revert()
  }, { scope: strip })

  return (
    <div className="project-strip" ref={strip} tabIndex={0} role="region" aria-label={`${project.title} media`}>
      {project.strip.concat(project.strip).map((item, index) => {
        const position = index % project.strip.length
        return (
          <figure key={index} style={{ '--strip-ratio': `${project.stripWidths[position]} / 168` }}
            aria-hidden={index >= project.strip.length ? true : undefined}><Media item={project.gallery[item]} /></figure>
        )
      })}
    </div>
  )
}

function ProjectSheet({ index, change, focusHeading, dismiss }) {
  const root = useRef(null)
  const project = projects[index]
  useGSAP((context, contextSafe) => {
    root.current.closest('dialog').scrollTop = 0
    const animate = !reducedMotion()
    let split
    const frame = requestAnimationFrame(contextSafe(() => {
      const heading = root.current.querySelector('h2')
      if (focusHeading) {
        heading.tabIndex = -1
        heading.focus({ preventScroll: true })
      }
      if (!animate) return
      split = SplitText.create(heading, { type: 'lines', mask: 'lines' })
      gsap.timeline()
        .from(split.lines, {
          yPercent: 150, duration: 1.6, stagger: 0.1, ease: 'expo.out',
          onComplete: () => split.revert(),
        }, 0.6)
        .from('.project-tags li', { y: 10, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out' }, 0.43)
        .from('.project-info > *', { y: 18, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out' }, 0.8)
    }))
    if (!animate) return () => cancelAnimationFrame(frame)
    const videos = root.current.querySelectorAll('video')
    const watcher = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) target.play().catch(() => {})
        else target.pause()
      }
    }, { threshold: 0.25 })
    videos.forEach((video) => watcher.observe(video))
    return () => {
      cancelAnimationFrame(frame)
      split?.revert()
      watcher.disconnect()
    }
  }, { scope: root })
  return (
    <article className="project-sheet" ref={root}>
      <ProjectInfo project={project} dismiss={dismiss} />
      <Gallery project={project} prefix="sheet" />
      <nav className="project-controls" aria-label="Other services">
        <button onClick={() => change((index + projects.length - 1) % projects.length)}>Previous</button>
        <button onClick={() => change((index + 1) % projects.length)}>Next</button>
      </nav>
    </article>
  )
}

function Team() {
  return (
    <section id="teams" className="team-section home-section" aria-labelledby="team-title">
      <Label>Team</Label>
      <span className="team-tag">Decode Team</span>
      <h2 className="section-title reveal" id="team-title">Meet the Decode Studio team.</h2>
      <div className="desktop-team">
        {team.map(([name, role, portrait, bio, jobs]) => (
          <article className="person" key={name}>
            <div className="person-name"><h3>{name}</h3><p>{role}</p></div>
            <div className="person-detail">
              <div className="person-intro"><img src={media(portrait)} alt="" loading="lazy" /><p>{bio}</p></div>
              <FactTable facts={jobs} />
            </div>
          </article>
        ))}
      </div>
      <div className="mobile-team">
        {team.map(([name, role, portrait, bio, jobs]) => (
          <details name="team-profile" key={name}>
            <summary>
              <img src={media(portrait)} alt="" loading="lazy" />
              <span><strong>{name}</strong><span>{role}</span></span>
              <span className="profile-toggle" aria-hidden="true" />
            </summary>
            <div className="mobile-profile">
              <p>{bio}</p>
              <FactTable facts={jobs} />
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

function ContactForm() {
  const formId = useId()
  const [status, setStatus] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const body = `${fields.get('message')}\n\n${fields.get('name')}\n${fields.get('email')}`
    try {
      await navigator.clipboard.writeText(body)
      setStatus('Inquiry copied. Paste it into the app you want to send it from.')
    } catch {
      setStatus('Clipboard access is unavailable. Your inquiry is still in the form.')
    }
  }

  return (
    <form className="contact-form" aria-label="Project inquiry" onSubmit={submit}>
      <label htmlFor={`${formId}-name`}>Name*<input id={`${formId}-name`} name="name" autoComplete="name" placeholder="Enter Name" required /></label>
      <label htmlFor={`${formId}-email`}>Email*<input id={`${formId}-email`} name="email" type="email" autoComplete="email" placeholder="Enter Email" required /></label>
      <label className="message-field" htmlFor={`${formId}-message`}>Message<textarea id={`${formId}-message`} name="message" placeholder="Enter Message" rows={3} /></label>
      <Cta type="submit">Copy inquiry</Cta>
      {status && <p className="form-note" role="status">{status}</p>}
    </form>
  )
}

function Footer({ illustrated = false }) {
  return (
    <footer className={`footer ${illustrated ? 'illustrated-footer' : ''}`}>
      <div className="footer-details">
        <div className="footer-info"><span>Decode</span><a href="/blog">Web development guides</a></div>
      </div>
      {illustrated && <DecodeMark className="footer-wordmark" />}
    </footer>
  )
}

function Contact() {
  return (
    <section id="contact" className="contact-section home-section" aria-labelledby="contact-title">
      <Label>Contact</Label>
      <div className="discipline studio-label"><span>Web design</span><span>Development</span></div>
      <h2 id="contact-title" className="section-title reveal">Tell us what you want your next website to do.</h2>
      <ContactForm />
      <ContactArtwork className="contact-footer-art" />
      <Footer illustrated />
    </section>
  )
}

function Home({ open, active }) {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 991px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 991px)')
    const update = () => setMobile(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return (
    <>
      <aside className="home-rail" aria-label="Service index">
        <div className="rail-model">{!mobile && <Suspense><Model /></Suspense>}</div>
        <ContactArtwork className="rail-contact-art" />
        <nav className="rail-index">
          <a href="#investments"><span aria-hidden="true">├</span><RollingText>Services</RollingText></a>
          {projects.map((project, index) => (
            <a key={project.id} data-project-link={project.id} className={active === project.id ? 'active' : ''} href={`#${project.id}`}>
              <RollingText>{number(index)}</RollingText><RollingText>{project.title}</RollingText>
            </a>
          ))}
        </nav>
      </aside>
      <main className="home-main">
        <section className="hero home-section" id="top" aria-labelledby="hero-title">
          <span className="section-label">Decode</span>
          <div className="discipline studio-label"><span>Web design</span><span>Development</span></div>
          <h1 id="hero-title">Decode designs and builds websites that make it easier to find, understand, and use your business online.</h1>
          <div className="hero-mobile-model">{mobile && <Suspense><Model compact /></Suspense>}</div>
        </section>
        <div className="desktop-projects">
          {projects.map((project) => (
            <section className="desktop-project home-section" id={project.id} key={project.id} data-project={project.id}>
              <ProjectInfo project={project} />
              <Gallery project={project} prefix="desktop" />
            </section>
          ))}
        </div>
        <section className="mobile-projects" id="mobile-investments" aria-label="Services">
          <Label>Services</Label>
          {projects.map((project, index) => <MobileProject key={project.id} project={project} index={index} open={open} />)}
        </section>
        <Team />
        <Contact />
      </main>
    </>
  )
}

function EssayLinks({ entries, index = false }) {
  return (
    <div className="essay-links">
      <div className="essay-label"><span>{index ? 'Essay list' : 'Read more'}</span>{index && <span>More</span>}</div>
      <ul>{entries.map(([title, slug]) => <li key={slug}><a href={essayUrl(slug)}><RollingText>{title}</RollingText><span className="essay-plus" aria-hidden="true">+</span></a></li>)}</ul>
    </div>
  )
}

function Blog({ essay }) {
  const title = essay?.[0]
  const source = essay && essaySources[essay[1]]
  return (
    <main className={`blog-main ${essay ? 'essay' : 'essay-index'}`} id="top">
      <div className="editorial-head">
        {essay ? <a href="/blog" className="website-link">Back</a> : <ProjectIcons />}
        <h1>{title || <>Web development{' '}<br />guides</>}</h1>
      </div>
      {essay && <article className="essay-copy">
        <p>{essay[2]}</p>
        {essayBody[essay[1]].map(([heading, paragraph]) => <section key={heading}><h2>{heading}</h2><p>{paragraph}</p></section>)}
        <figure><Media item={essayMedia[essay[1]]} /></figure>
        {source && <p className="essay-source">Further reading <a href={source[1]}>{source[0]}</a></p>}
      </article>}
      <EssayLinks entries={essay ? essays.slice().reverse().filter((item) => item !== essay) : essays} index={!essay} />
      <div className="blog-footer-art"><video src={media('footer-video.webm')} muted loop playsInline autoPlay={!reducedMotion()} aria-hidden="true" /></div>
      <Footer illustrated />
    </main>
  )
}

export default function App() {
  const root = useRef(null)
  const wipe = useRef(null)
  const scroll = useRef(null)
  const cover = useRef(null)
  const counter = useRef(null)
  const navigating = useRef(false)
  const [overlay, setOverlay] = useState(null)
  const [active, setActive] = useState('top')
  const [projectIndex, setProjectIndex] = useState(0)
  const projectStepped = useRef(false)
  const route = location.pathname.replace(/\/$/, '')
  const essay = essays.find((entry) => essayUrl(entry[1]) === route)
  const home = route === ''
  const blog = route === '/blog'
  const [fullIntro] = useState(() => {
    if (!home || reducedMotion()) return false
    try {
      const last = sessionStorage.getItem('robotics-last-page')
      return !last || last === '/'
    } catch {
      return true
    }
  })
  const [loading, setLoading] = useState(fullIntro)
  const navActive = projects.some(({ id }) => id === active) ? 'investments' : active
  useEntrance({ root, cover, counter, home, full: fullIntro, setLoading })

  useEffect(() => {
    const title = essay ? `${essay[0]} | Decode` : blog ? 'Web Development Guides | Decode' : 'Decode | Web Design & Development'
    document.title = title
    try {
      sessionStorage.setItem('robotics-last-page', location.pathname)
    } catch {
      // Navigation still works when session storage is unavailable.
    }
  }, [blog, essay])

  useEffect(() => {
    if (!home || loading) return
    const hash = location.hash.slice(1)
    const section = hash || new URLSearchParams(location.search).get('section')
    if (!['top', 'investments', 'aescape', 'landscaping', 'teams', 'contact'].includes(section)) return
    const frame = requestAnimationFrame(() => goToSection(section, { immediate: Boolean(hash), duration: 1.4 }))
    return () => cancelAnimationFrame(frame)
  }, [home, loading])

  useLayoutEffect(() => {
    const instance = scroll.current
    if (!instance) return
    if (overlay || loading) instance.stop()
    else instance.start()
  }, [overlay, loading])

  const { contextSafe } = useGSAP(() => {
    const mediaQuery = gsap.matchMedia(root.current)
    mediaQuery.add({
      desktop: '(width > 991px)',
      mobile: '(max-width: 991px)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      if (context.conditions.reduced) return
      const instance = new Lenis({
        duration: 1.8,
        lerp: 0.04,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
      })
      const update = (time) => instance.raf(time * 1000)
      scroll.current = instance
      instance.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(update)
      if (root.current.classList.contains('is-loading') || root.current.querySelector('dialog[open]')) instance.stop()
      const reveals = []
      let disposed = false
      context.add('splitHeadings', () => {
        if (disposed) return
        for (const element of root.current.querySelectorAll('.reveal')) {
          if (!element.offsetWidth) continue
          reveals.push(SplitText.create(element, {
            type: 'lines', mask: 'lines', autoSplit: true,
            onSplit: ({ lines }) => gsap.from(lines, {
              yPercent: 150,
              stagger: 0.1,
              duration: 2,
              ease: 'expo.out',
              scrollTrigger: { trigger: element, start: 'top bottom', toggleActions: 'play none none reverse' },
            }),
          }))
        }
      })
      document.fonts.ready.then(context.splitHeadings)
      for (const frame of root.current.querySelectorAll('.desktop-project .frame')) {
        gsap.fromTo(frame, { y: 6 }, {
          y: -9,
          ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.45 },
        })
      }
      const videos = root.current.querySelectorAll('.desktop-project video, .project-strip video')
      const watcher = new IntersectionObserver((entries) => {
        for (const { target, isIntersecting } of entries) {
          if (isIntersecting) target.play().catch(() => {})
          else target.pause()
        }
      }, { threshold: 0.25 })
      videos.forEach((video) => watcher.observe(video))
      return () => {
        disposed = true
        gsap.ticker.remove(update)
        instance.destroy()
        scroll.current = null
        reveals.forEach((split) => split.revert())
        watcher.disconnect()
        videos.forEach((video) => video.pause())
      }
    })
    mediaQuery.add('(max-width: 991px)', () => {
      const teamSection = root.current.querySelector('#teams')
      if (!teamSection) return
      ScrollTrigger.create({
        trigger: teamSection,
        start: 'top 64px',
        end: 'bottom 64px',
        onToggle: ({ isActive }) => setActive(isActive ? 'teams' : 'top'),
      })
    })
    mediaQuery.add('(width > 991px)', () => {
      for (const section of root.current.querySelectorAll('.home-section')) {
        const link = root.current.querySelector(`[data-project-link="${section.id}"]`)
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: ({ isActive }) => { if (isActive) setActive(section.id) },
          onUpdate: ({ progress }) => link?.style.setProperty('--project-progress', progress),
        })
      }
      if (!home) return
      gsap.to('.home-rail', {
        '--rail-progress': 1,
        ease: 'none',
        duration: reducedMotion() ? 0 : 1,
        scrollTrigger: { start: 0, end: () => window.innerHeight, scrub: 0.55 },
      })
      gsap.to('.home-rail', {
        '--rail-exit': 1,
        ease: 'none',
        duration: reducedMotion() ? 0 : 1,
        scrollTrigger: {
          start: () => window.innerHeight,
          end: () => window.innerHeight * 1.8,
          scrub: 0.55,
        },
      })
    })
    mediaQuery.add('(width > 991px) and (prefers-reduced-motion: no-preference)', (context) => {
      const artwork = root.current.querySelector('.rail-contact-art')
      if (artwork) {
        gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 48%',
            end: 'top top',
            scrub: true,
          },
        })
          .fromTo(artwork, { yPercent: 120 }, { yPercent: 0 }, 0)
          .to('.sticky-cta', { yPercent: 120 }, 0)
      }
      const footer = root.current.querySelector('.footer-peek')
      const content = root.current.querySelector('main')
      if (!footer || !content) return
      const fall = CustomEase.create('footerFall', '0.83,0.02,0.23,0.99')
      let distance = 0
      let release
      const move = context.add('liftFooter', (height, duration, ease) => {
        gsap.to(footer, { y: -height, duration, ease, overwrite: true })
        gsap.to(content, { y: -height, duration, ease, overwrite: true })
      })
      const onWheel = (event) => {
        if (navigating.current || root.current.querySelector('dialog[open]') || root.current.classList.contains('is-loading')) return
        const atBottom = window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2
        if (!atBottom || event.deltaY <= 0) {
          if (distance) {
            distance = 0
            move(0, 0.35, 'power2.out')
          }
          return
        }
        distance = Math.min(1, distance + Math.min(event.deltaY, 24) * 0.000825)
        const height = footer.offsetHeight * (1 - (1 - distance) ** 3)
        move(height, 0.17, 'power2.out')
        clearTimeout(release)
        release = setTimeout(() => {
          distance = 0
          move(0, 0.62, fall)
        }, 70)
      }
      window.addEventListener('wheel', onWheel, { passive: true })
      return () => {
        clearTimeout(release)
        window.removeEventListener('wheel', onWheel)
      }
    })
    const clearWipe = (event) => {
      if (!event.persisted) return
      navigating.current = false
      gsap.set(wipe.current, { clearProps: 'all' })
      gsap.set('.site-header, .home-main, .home-rail, .blog-main', { clearProps: 'transform' })
    }
    window.addEventListener('pageshow', clearWipe)
    return () => {
      mediaQuery.revert()
      window.removeEventListener('pageshow', clearWipe)
    }
  }, { scope: root })

  function goToSection(id, options) {
    const mobile = window.matchMedia('(max-width: 991px)').matches
    const section = document.getElementById(id === 'investments' && mobile ? 'mobile-investments' : id)
    if (!section) return
    if (!scroll.current) {
      section.scrollIntoView({ behavior: options?.immediate ? 'instant' : 'auto' })
      return
    }
    scroll.current.scrollTo(section, { duration: 1.8, force: true, ...options })
  }

  const navigate = contextSafe((href) => {
    if (navigating.current) return
    if (reducedMotion()) {
      location.assign(href)
      return
    }
    navigating.current = true
    const path = new URL(href, location.href).pathname
    const background = path === '/blog' ? '#e9e7db' : path === '/' ? '#e9edef' : '#fff'
    gsap.set(wipe.current, { visibility: 'visible', backgroundColor: background })
    gsap.to('.site-header, .home-main, .home-rail, .blog-main', { y: -200, duration: 1.2, ease: wipeEase, overwrite: 'auto' })
    gsap.fromTo(wipe.current, { yPercent: 100 }, {
      yPercent: 0, delay: 0.12, duration: 0.9, ease: wipeEase,
      onComplete: () => location.assign(href),
    })
  })

  const onNavigate = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.target.closest('a[href]')
    if (!link || link.target) return
    const href = link.getAttribute('href')
    if (home && href.startsWith('#') && href.length > 1) {
      event.preventDefault()
      if (location.hash !== href) history.pushState(null, '', href)
      goToSection(href.slice(1))
      return
    }
    if (!href.startsWith('/')) return
    if (link.href === location.href) return
    event.preventDefault()
    navigate(link.href)
  }

  const close = (after) => {
    setOverlay(after === 'join' ? 'join' : null)
    if (!after || after === 'join') return
    if (after.startsWith('#')) {
      if (location.hash !== after) history.pushState(null, '', after)
      requestAnimationFrame(() => goToSection(after.slice(1)))
    } else {
      requestAnimationFrame(() => navigate(after))
    }
  }

  const openProject = (index) => {
    projectStepped.current = false
    setProjectIndex(index)
    setOverlay('project')
  }

  const stepProject = (index) => {
    projectStepped.current = true
    setProjectIndex(index)
  }

  return (
    <div ref={root} className={`site ${home ? 'is-home' : blog ? 'is-index' : 'is-essay'}${loading ? ' is-loading' : ''}`} data-active={active} onClick={onNavigate}>
      <DesktopCursor />
      <Header home={home} blog={blog} active={navActive} open={setOverlay} intro={fullIntro} />
      <div className="intro-cover" ref={cover} aria-hidden="true">
        {fullIntro && <div className="loading-counter"><span>├</span><span ref={counter}>00</span></div>}
      </div>
      {home && <Home open={openProject} active={active} />}
      {(blog || essay) && <Blog essay={essay} />}
      {!home && !blog && !essay && <main className="missing"><h1>Page not found</h1><a href="/">Back to Decode</a></main>}
      {(home || essay) && <div className="footer-peek" aria-hidden="true"><DecodeMark /></div>}
      <Cta className="sticky-cta" onClick={() => setOverlay('join')} aria-haspopup="dialog" inert={active === 'contact'}>Start a project</Cta>
      <div className="route-wipe" ref={wipe} aria-hidden="true" />
      {overlay === 'menu' && <Overlay key="menu" kind="menu" label="Navigation menu" close={close}>
        {(dismiss) => <Menu home={home} dismiss={dismiss} />}
      </Overlay>}
      {overlay === 'join' && <Overlay key="join" kind="join" label="Start a project" close={close}>
        {() => <div className="join-content">
          <div className="join-form"><Label symbol="Ⓓ"><span className="join-label-text">Project inquiry</span></Label><h2>Plan your next{' '}<br />website</h2>
            <p>Describe the site you want to build</p><ContactForm />
          </div>
          <div className="join-model"><div className="join-model-motion"><Suspense><Model inverted /></Suspense></div></div>
        </div>}
      </Overlay>}
      {overlay === 'project' && <Overlay key="project" kind="project" label="Service details" close={close}>
        {(dismiss) => <ProjectSheet key={projectIndex} index={projectIndex} change={stepProject} focusHeading={projectStepped.current} dismiss={dismiss} />}
      </Overlay>}
    </div>
  )
}
