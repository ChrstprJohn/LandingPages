import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { cardPose, gallerySlots, wrapIndex } from './gallery'
import { projects } from './portfolio.json'
import { AboutPage, CaseStudy, WorksPage, studioEmail } from './pages'
import { useRoute } from './router'
import { Rollover } from './rollover'
import './styles.css'
import './pages.css'

gsap.registerPlugin(useGSAP, CustomEase)
const fanEase = CustomEase.create('fan-out', 'M0,0 C0.22,0 0.29,0.75 0.62,0.985 0.8,1.035 0.91,1 1,1')
const openingEase = CustomEase.create('opening-curtain', 'M0,0 C0.22,0 0.27,0.29 0.39,0.62 C0.52,0.83 0.71,1 1,1')
const slideEase = CustomEase.create('gallery-slide', 'M0,0 C0.15,0 0.25,0.025 0.33,0.106 C0.45,0.20 0.52,0.56 0.64,0.77 C0.76,0.953 0.85,1 1,1')
const captionEase = CustomEase.create('caption-wipe', 'M0,0 C0.22,0 0.29,0.47 0.44,0.7 C0.57,0.92 0.79,1.025 1,1')
const openMask = 'inset(0% 0% 0% 0%)'
const hideFromTop = 'inset(100% 0% 0% 0%)'
const hideFromBottom = 'inset(0% 0% 100% 0%)'
const media = `${import.meta.env.BASE_URL}media/`
const selectedWorks = projects.slice(0, 7)
const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Works', '/works'],
  ['Contact', `mailto:${studioEmail}`],
]

function OpeningSequence() {
  const overlay = useRef(null)
  const [playing, setPlaying] = useState(() => document.documentElement.hasAttribute('data-home-opening'))

  useGSAP(() => {
    if (!playing) return
    const panel = overlay.current.querySelector('.opening-panel')
    const images = [...overlay.current.querySelectorAll('img')]
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    document.documentElement.removeAttribute('data-home-opening')

    const opening = gsap.timeline({ onComplete: () => setPlaying(false) })
    for (const [index, time] of [[1, 0.32], [2, 0.52], [3, 0.72]]) {
      opening.set(images[index - 1], { opacity: 0 }, time)
      opening.set(images[index], { opacity: 1 }, time)
    }
    opening.to(panel, { scaleY: 0, duration: 0.56, ease: openingEase }, 1.10)
    opening.to('.opening-card', { opacity: 0, duration: 0.52, ease: openingEase }, 1.10)
    opening.set(overlay.current, { pointerEvents: 'none' }, 1.63)
    opening.set(panel, { visibility: 'hidden' }, 1.77)

    const onPreferenceChange = () => {
      if (preference.matches) opening.progress(1)
    }
    preference.addEventListener('change', onPreferenceChange)
    return () => preference.removeEventListener('change', onPreferenceChange)
  }, { scope: overlay })

  if (!playing) return null
  return (
    <div ref={overlay} className="opening fixed inset-0 grid place-items-center" aria-hidden="true">
      <div className="opening-panel absolute inset-0" />
      <div className="opening-card relative">
        {[0, 2, 5, 1].map(index => (
          <img key={index} src={`${media}${projects[index].cover.file}`} alt="" />
        ))}
      </div>
    </div>
  )
}

function NavLink({ label, href, onClick }) {
  return (
    <a className="nav-link inline-flex items-center" href={href} aria-label={label} onClick={onClick}>
      <Rollover>{label}</Rollover>
      {label === 'Contact' && <span className="outbound-arrow" aria-hidden="true" />}
    </a>
  )
}

function Navigation({ home, dark }) {
  const [open, setOpen] = useState(false)
  const header = useRef(null)
  const toggle = useRef(null)

  useEffect(() => {
    if (!open) return

    const dismiss = (event) => {
      if (!header.current.contains(event.target)) setOpen(false)
    }
    const onEscape = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggle.current.focus()
    }

    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  return (
    <header ref={header} className="navigation" data-open={open} data-home={home} data-dark={dark}>
      <button ref={toggle} className="menu-toggle items-center" type="button" aria-expanded={open}
        aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
        Menu <span className="menu-dots" aria-hidden="true"><i /><i /><i /><i /></span>
      </button>
      <nav className="desktop-nav flex items-center" aria-label="Main">
        {links.map(([label, href]) => <NavLink key={label} label={label} href={href} />)}
      </nav>
      <nav className="mobile-nav flex flex-col items-center" id="mobile-navigation" aria-label="Main" inert={!open}>
        {links.map(([label, href]) => <NavLink key={label} label={label} href={href} onClick={() => setOpen(false)} />)}
      </nav>
    </header>
  )
}

function Gallery() {
  const stageRef = useRef(null)
  const changeWork = useRef(null)
  const [active, setActive] = useState(0)
  const project = selectedWorks[active]

  useGSAP((_, contextSafe) => {
    const stage = stageRef.current
    const frames = [...stage.querySelectorAll('.gallery-frame')]
    const caption = [...stage.querySelectorAll('.caption-line')]
    const compact = window.matchMedia('(width < 810px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const count = frames.length
    const cursor = { position: 0 }
    const entrance = frames.map((_, index) => ({ progress: index === 0 ? 1 : 0, opacity: index === 0 ? 1 : 0 }))
    let width, size, slots, target = 0, currentCaption = 0
    let slideTween, captionTween, gesture
    let lastWheel = -Infinity, wheelDelta = 0, wheelHandled = false
    let suppressClick = false

    function render() {
      frames.forEach((frame, index) => {
        const pose = cardPose(index - cursor.position, count, slots)
        const { progress, opacity } = entrance[index]
        const scale = 0.25 + (pose.scale - 0.25) * progress
        const angle = pose.angle * progress
        const x = pose.x * progress
        const y = pose.y * progress
        const bounds = size * scale * (Math.cos(angle * Math.PI / 180) + Math.abs(Math.sin(angle * Math.PI / 180))) / 2
        const visible = Math.abs(x) - bounds < width / 2 && opacity > 0.05

        frame.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`
        frame.style.opacity = opacity
        frame.style.zIndex = count - Math.round(pose.distance)
        frame.style.setProperty('--frame-scale', scale)
        frame.toggleAttribute('data-visible', visible)
        frame.firstElementChild.tabIndex = visible ? 0 : -1
      })
    }

    function measure() {
      width = stage.clientWidth
      size = frames[0].offsetWidth
      slots = gallerySlots(width, size, compact.matches)
      render()
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)

    const intro = gsap.timeline({ paused: true, onUpdate: render })
    entrance.forEach((card, index) => {
      if (index === 0) return
      const distance = Math.min(index, count - index)
      const start = 1.205 + (distance - 1) * 0.09
      intro.to(card, { progress: 1, duration: 0.67, ease: fanEase }, start)
      intro.to(card, { opacity: 1, duration: 0.67, ease: 'none' }, start)
    })
    intro.fromTo(caption, { clipPath: hideFromBottom }, { clipPath: openMask, duration: 0.58, ease: captionEase }, 1.10)
    if (reduced.matches) intro.progress(1)
    else intro.play()

    const go = contextSafe((index) => {
      intro.progress(1)
      const next = wrapIndex(index, count)
      target = index
      slideTween?.kill()
      if (reduced.matches) {
        cursor.position = target
        render()
        currentCaption = next
        setActive(next)
        return
      }

      slideTween = gsap.to(cursor, { position: target, duration: 0.6, ease: slideEase, onUpdate: render })
      captionTween?.kill()
      if (currentCaption === next) {
        captionTween = gsap.to(caption, { clipPath: openMask, duration: 0.28, ease: captionEase })
        return
      }

      captionTween = gsap.timeline()
        .to(caption, { clipPath: hideFromTop, duration: 0.17, ease: captionEase })
        .set(caption, { clipPath: hideFromBottom }, 0.33)
        .call(() => {
          currentCaption = next
          flushSync(() => setActive(next))
        }, [], 0.33)
        .to(caption, { clipPath: openMask, duration: 0.39, ease: captionEase }, 0.34)
    })

    changeWork.current = (direction) => go(target + direction)

    const onWheel = (event) => {
      if (event.ctrlKey || event.metaKey) return
      event.preventDefault()
      if (event.timeStamp - lastWheel > 150) {
        wheelDelta = 0
        wheelHandled = false
      }
      lastWheel = event.timeStamp
      if (wheelHandled || gesture?.dragged) return

      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      wheelDelta += delta * (event.deltaMode === 0 ? 1 : 16)
      if (Math.abs(wheelDelta) >= 14) {
        wheelHandled = true
        changeWork.current(Math.sign(wheelDelta))
      }
    }

    const onKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
      event.preventDefault()
      changeWork.current(event.key === 'ArrowRight' ? 1 : -1)
    }

    const pointerDown = (event) => {
      if (!event.isPrimary || event.button !== 0 || event.target.closest('button')) return
      suppressClick = false
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, start: cursor.position, target }
    }

    const pointerMove = (event) => {
      if (event.pointerId !== gesture?.id) return
      const dx = event.clientX - gesture.x
      if (!gesture.dragged) {
        if (Math.abs(dx) < 7 || Math.abs(dx) < Math.abs(event.clientY - gesture.y)) return
        intro.progress(1)
        slideTween?.kill()
        gesture.start = cursor.position
        gesture.dragged = true
        stage.setPointerCapture(event.pointerId)
        stage.setAttribute('data-dragging', '')
      }

      if (!reduced.matches) {
        cursor.position = gesture.start - dx / slots[1][0]
        render()
      }
    }

    const pointerEnd = (event) => {
      if (event.pointerId !== gesture?.id) return
      if (gesture.dragged) {
        suppressClick = true
        const offset = (gesture.x - event.clientX) / slots[1][0]
        const steps = Math.abs(offset) > 0.23 ? Math.sign(offset) * Math.max(1, Math.round(Math.abs(offset))) : 0
        go(gesture.target + (event.type === 'pointerup' ? steps : 0))
        stage.removeAttribute('data-dragging')
      }
      gesture = null
    }

    const click = (event) => {
      if (suppressClick && event.detail > 0) event.preventDefault()
      suppressClick = false
    }

    const motionChange = () => {
      if (!reduced.matches) return
      intro.progress(1)
      slideTween?.progress(1)
      captionTween?.progress(1)
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    stage.addEventListener('keydown', onKeyDown)
    stage.addEventListener('pointerdown', pointerDown)
    stage.addEventListener('pointermove', pointerMove)
    window.addEventListener('pointerup', pointerEnd)
    window.addEventListener('pointercancel', pointerEnd)
    stage.addEventListener('click', click, true)
    reduced.addEventListener('change', motionChange)

    return () => {
      observer.disconnect()
      stage.removeEventListener('wheel', onWheel)
      stage.removeEventListener('keydown', onKeyDown)
      stage.removeEventListener('pointerdown', pointerDown)
      stage.removeEventListener('pointermove', pointerMove)
      window.removeEventListener('pointerup', pointerEnd)
      window.removeEventListener('pointercancel', pointerEnd)
      stage.removeEventListener('click', click, true)
      reduced.removeEventListener('change', motionChange)
    }
  }, { scope: stageRef })

  return (
    <section ref={stageRef} className="gallery relative isolate" aria-label="Selected works" tabIndex={0}>
      {selectedWorks.map(({ slug, title, cover }, index) => (
        <figure className="gallery-frame absolute" key={slug} data-visible={index === 0 ? '' : undefined}>
          <a href={`/works/${slug}`} aria-current={index === active ? 'true' : undefined} draggable="false">
            <img src={`${media}${cover.file}`} alt={cover.alt || title} draggable="false" fetchPriority={index === 0 ? 'high' : 'auto'} />
          </a>
        </figure>
      ))}
      <div className="gallery-arrows items-center" aria-label="Gallery controls">
        <button type="button" aria-label="Previous work" onClick={() => changeWork.current(-1)}><span aria-hidden="true" /></button>
        <button type="button" aria-label="Next work" onClick={() => changeWork.current(1)}><span aria-hidden="true" /></button>
      </div>
      <div className="caption" aria-live="polite" aria-atomic="true">
        <h1 className="caption-line project-title">{project.title}</h1>
        <p className="caption-line project-description">{project.description}</p>
        <p className="caption-line">{project.year}</p>
        <p className="caption-line project-category">{project.category}</p>
      </div>
    </section>
  )
}

function App() {
  const path = useRoute()
  const home = path === '/'
  const caseStudy = path.startsWith('/works/') && projects.find(project => `/works/${project.slug}` === path)

  useEffect(() => {
    const title = caseStudy?.title || ({ '/': 'Selected Works', '/about': 'About', '/works': 'Works' })[path] || 'Page not found'
    document.title = `decodestudio — ${title}`
  }, [path, caseStudy])

  return (
    <>
      {home && <OpeningSequence />}
      <Navigation key={path} home={home} dark={Boolean(caseStudy)} />
      {home && <main><Gallery /></main>}
      {path === '/about' && <AboutPage />}
      {path === '/works' && <WorksPage />}
      {caseStudy && <CaseStudy key={caseStudy.slug} project={caseStudy} />}
      {!home && path !== '/about' && path !== '/works' && !caseStudy && (
        <main className="missing-page"><h1>Page not found</h1><a href="/works">All Works</a></main>
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
