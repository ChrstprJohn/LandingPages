import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import Home, { Arrow } from './Home'
import Study from './Study'
import { usePageMotion } from './motion'
import { projects } from './projects'

const navigation = ['capabilities', 'projects', 'about', 'contact']

function getLocation() {
  return { pathname: location.pathname, hash: location.hash, key: history.state?.portfolioKey ?? 0 }
}

function Header({ menu, setMenu, menuButton }) {
  const header = useRef(null)
  useEffect(() => {
    if (!menu) return
    function keydown(event) {
      if (event.key === 'Escape') {
        setMenu(false)
        menuButton.current.focus()
      }
      if (event.key !== 'Tab') return
      const links = header.current.querySelectorAll('a, button')
      if (event.shiftKey && document.activeElement === links[0]) {
        event.preventDefault()
        links[links.length - 1].focus()
      } else if (!event.shiftKey && document.activeElement === links[links.length - 1]) {
        event.preventDefault()
        links[0].focus()
      }
    }
    document.addEventListener('keydown', keydown)
    return () => document.removeEventListener('keydown', keydown)
  }, [menu, menuButton, setMenu])

  return (
    <header className={`site-header${menu ? ' menu-open' : ''}`} ref={header}>
      <a className="wordmark" aria-label="Decode Studio home" href="/" data-cursor="home">DECODE</a>
      <button className="menu-button mono" ref={menuButton} type="button" aria-controls="primary-navigation"
        aria-expanded={menu} onClick={() => setMenu((open) => !open)}>{menu ? 'CLOSE' : 'MENU'}</button>
      <nav className="site-nav" id="primary-navigation" aria-label="Primary navigation">
        {navigation.map((id) => <a href={`/#${id}`} className="draw-underline" data-cursor="go" key={id}>{id}</a>)}
      </nav>
    </header>
  )
}

function Cursor() {
  const cursor = useRef(null)
  useEffect(() => {
    const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const element = cursor.current
    const toX = gsap.quickTo(element, 'x', { duration: .19, ease: 'power3.out' })
    const toY = gsap.quickTo(element, 'y', { duration: .19, ease: 'power3.out' })
    let active = false
    function hide() {
      active = false
      element.removeAttribute('data-visible')
      document.documentElement.removeAttribute('data-pointer-active')
    }
    function move(event) {
      if (!media.matches || event.pointerType !== 'mouse' || event.target.closest('dialog, input, textarea')) return hide()
      const action = event.target.closest('[data-cursor]')?.dataset.cursor ?? ''
      if (!active) {
        toX(event.clientX, event.clientX)
        toY(event.clientY, event.clientY)
        active = true
      } else {
        toX(event.clientX)
        toY(event.clientY)
      }
      element.dataset.mode = action
      element.firstElementChild.textContent = action
      element.setAttribute('data-visible', '')
      document.documentElement.setAttribute('data-pointer-active', '')
    }
    function onExit(event) { if (!event.relatedTarget) hide() }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerout', onExit)
    window.addEventListener('blur', hide)
    media.addEventListener('change', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerout', onExit)
      window.removeEventListener('blur', hide)
      media.removeEventListener('change', hide)
      toX.tween.kill()
      toY.tween.kill()
      hide()
    }
  }, [])
  return <div className="custom-cursor" aria-hidden="true" ref={cursor}><span /></div>
}

function App() {
  const root = useRef(null)
  const main = useRef(null)
  const menuButton = useRef(null)
  const nextKey = useRef(0)
  const scrollPositions = useRef(new Map())
  const hasRendered = useRef(false)
  const [locationState, setLocationState] = useState(getLocation)
  const [menu, setMenu] = useState(false)
  const { pathname, hash, key, restore, smooth, focusTarget } = locationState
  const project = projects.find((item) => pathname === `/work/${item.slug}` || pathname === `/work/${item.slug}/`)
  const isHome = pathname === '/'

  useLayoutEffect(() => {
    history.scrollRestoration = 'manual'
    if (!history.state?.portfolioKey) history.replaceState({ ...history.state, portfolioKey: 0 }, '')
    nextKey.current = Math.max(history.state?.portfolioKey ?? 0, Date.now())
    function restoreLocation() {
      setMenu(false)
      setLocationState({ ...getLocation(), restore: true })
    }
    window.addEventListener('popstate', restoreLocation)
    return () => window.removeEventListener('popstate', restoreLocation)
  }, [])

  useLayoutEffect(() => {
    const id = hash.slice(1)
    const target = id ? document.getElementById(id) : null
    const saved = restore ? scrollPositions.current.get(key) : null
    if (saved != null) window.scrollTo({ top: saved, behavior: 'instant' })
    else if (target) target.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
    if (focusTarget) {
      const destination = target ?? main.current
      if (!destination.hasAttribute('tabindex')) destination.setAttribute('tabindex', '-1')
      destination.focus({ preventScroll: true })
    }
    hasRendered.current = true
    document.title = project ? `${project.name} — Decode Studio` : 'Decode Studio'
    const savePosition = () => scrollPositions.current.set(key, window.scrollY)
    window.addEventListener('scroll', savePosition, { passive: true })
    return () => window.removeEventListener('scroll', savePosition)
  }, [pathname, hash, key, restore, smooth, focusTarget, project])

  usePageMotion(root, pathname, !hasRendered.current)

  useEffect(() => {
    if (!menu) return
    const wide = matchMedia('(min-width: 901px)')
    const reset = () => { if (wide.matches) setMenu(false) }
    wide.addEventListener('change', reset)
    return () => wide.removeEventListener('change', reset)
  }, [menu])

  function navigate(event) {
    const link = event.target.closest('a[href]')
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || link.target || link.download) return
    const url = new URL(link.href)
    if (url.origin !== location.origin || url.protocol !== location.protocol) return
    event.preventDefault()
    setMenu(false)
    const samePage = url.pathname === pathname
    const smooth = samePage && !matchMedia('(prefers-reduced-motion: reduce)').matches
    scrollPositions.current.set(key, window.scrollY)
    const next = { pathname: url.pathname, hash: url.hash, key: ++nextKey.current, smooth, focusTarget: event.detail === 0 || Boolean(!samePage) }
    if (url.href !== location.href) history.pushState({ portfolioKey: next.key }, '', url)
    else history.replaceState({ portfolioKey: next.key }, '', url)
    setLocationState(next)
  }

  return (
    <div ref={root} className="site" onClick={navigate}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <Header menu={menu} setMenu={setMenu} menuButton={menuButton} />
      <main id="main-content" ref={main} tabIndex={-1} inert={menu || undefined}>
        {project ? <Study key={project.slug} project={project} /> : isHome ? <Home /> : (
          <section className="not-found dark">
            <h1>Page not found.</h1>
            <a className="draw-underline mono-link" href="/">BACK TO HOME <Arrow /></a>
          </section>
        )}
      </main>
      <Cursor />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
