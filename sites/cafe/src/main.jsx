import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

function Home() {
  const hero = useRef(null)

  useLayoutEffect(() => {
    const element = hero.current
    const viewport = document.documentElement
    let width = 0
    const sizeHero = () => {
      if (width === viewport.clientWidth) return
      width = viewport.clientWidth
      element.style.setProperty('--mobile-viewport-height', `${viewport.clientHeight}px`)
    }
    sizeHero()
    window.addEventListener('resize', sizeHero)
    return () => window.removeEventListener('resize', sizeHero)
  }, [])

  return (
    <section ref={hero} className="hero" aria-labelledby="hero-title">
      <div className="hero-inner frame">
        <h1 id="hero-title" aria-label="Brew Day">
          <img src="/brew-day-headline.svg" alt="" width="1080" height="206" />
        </h1>
        <div className="cup" aria-hidden="true">
          <img className="cup-photo" src="/peach-cup.png" alt="" width="1024" height="1536" />
        </div>
        <div className="hero-copy">
          <p>Quick espresso,<br />slow mornings.</p>
        </div>
        <p className="tagline">Good coffee,<br />better mornings.</p>
      </div>
    </section>
  )
}

const pages = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/menu', label: 'Menu' },
  { path: '/contact', label: 'Contact' },
]

const drinks = [
  ['Espresso', 'A short, rich double shot.', '/menu-espresso.webp'],
  ['Flat white', 'Double espresso with silky steamed milk.', '/menu-flat-white.webp'],
  ['Cold brew', 'Slow-steeped coffee served over ice.', '/menu-cold-brew.webp'],
  ['Cappuccino', 'Espresso, steamed milk and a thick layer of foam.', '/menu-cappuccino.webp'],
  ['Iced latte', 'Espresso and chilled milk poured over ice.', '/menu-iced-latte.webp'],
  ['Mocha', 'Espresso, chocolate and steamed milk.', '/menu-mocha.webp'],
  ['Americano', 'Double espresso lengthened with hot water.', '/menu-americano.webp'],
  ['Iced matcha latte', 'Whisked matcha and chilled milk over ice.', '/menu-iced-matcha.webp'],
]

function Page({ id, title, layout = '', media, children }) {
  const Heading = id ? 'h2' : 'h1'
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    if (!['about-page', 'menu-page', 'contact-page'].includes(layout) || !('IntersectionObserver' in window)) return
    const selectors = {
      'about-page': '.page-copy :is(h1, h2, p)',
      'menu-page': '.page-copy :is(h1, h2)',
      'contact-page': '.page-copy',
    }
    const elements = sectionRef.current.querySelectorAll(selectors[layout])
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.intersectionRatio < 0.35) continue
        entry.target.classList.add('text-revealed')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.35 })

    for (const element of elements) {
      element.classList.add('text-reveal')
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
      for (const element of elements) element.classList.remove('text-reveal', 'text-revealed')
    }
  }, [layout])

  return (
    <section className={`page ${layout}`} id={id} ref={sectionRef}>
      <div className="frame page-inner">
        <div className="page-copy">
          <Heading>{title}</Heading>
          {children}
        </div>
        {media}
      </div>
    </section>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuToggle = useRef(null)
  const resetOnReload = useRef(performance.getEntriesByType('navigation')[0]?.type === 'reload')
  const [section, setSection] = useState(() => window.location.hash.slice(1))
  const [scrolled, setScrolled] = useState(false)
  const standalone = document.documentElement.hasAttribute('data-standalone-preview') || window.location.protocol === 'file:'
  const [path, setPath] = useState(() => standalone
    ? (window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : '/')
    : window.location.pathname.replace(/\/$/, '') || '/')

  useEffect(() => {
    if (!standalone) return
    function syncPage() {
      const hash = window.location.hash
      setPath(hash.startsWith('#/') ? hash.slice(1) : '/')
    }
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [standalone])

  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1)
    if (path !== '/') return
    if (resetOnReload.current) {
      resetOnReload.current = false
      window.history.scrollRestoration = 'manual'
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search)
      setSection('')
      window.scrollTo(0, 0)
      return
    }
    if (hash) document.getElementById(hash)?.scrollIntoView()
  }, [path])

  useEffect(() => {
    const syncSection = () => setSection(window.location.hash.slice(1))
    const syncScroll = () => {
      const about = document.getElementById('about')
      const header = document.querySelector('.site-header')
      const mobileAbout = window.matchMedia('(max-width: 680px)').matches && about
      if (mobileAbout) {
        const distance = about.getBoundingClientRect().top - header.offsetHeight
        const opacity = Math.min(1, Math.max(0, 1 - distance / (header.offsetHeight * 2)))
        header.style.setProperty('--mobile-header-opacity', opacity)
      } else {
        header.style.removeProperty('--mobile-header-opacity')
      }
      setScrolled(window.scrollY > 0)
    }
    syncScroll()
    window.addEventListener('hashchange', syncSection)
    window.addEventListener('scroll', syncScroll, { passive: true })
    window.addEventListener('resize', syncScroll)
    return () => {
      window.removeEventListener('hashchange', syncSection)
      window.removeEventListener('scroll', syncScroll)
      window.removeEventListener('resize', syncScroll)
    }
  }, [path])

  const currentPage = pages.find((page) => page.path === path)
  useEffect(() => {
    document.title = path === '/' ? 'Brew Day Coffee' : `${currentPage?.label ?? 'Page unavailable'} | Brew Day Coffee`
  }, [currentPage, path])

  const href = (destination) => {
    const anchor = destination === '/' ? '#top' : `#${destination.slice(1)}`
    return standalone || path === '/' ? anchor : `/${anchor}`
  }
  const onHome = path === '/'
  const activePath = onHome && pages.some(({ path }) => path === `/${section}`) ? `/${section}` : path
  const links = pages.map(({ path: destination, label }) => (
    <a key={destination} href={href(destination)} aria-current={activePath === destination ? (onHome && destination !== '/' ? 'location' : 'page') : undefined}>
      {label}
    </a>
  ))

  return (
    <>
      <header className="site-header" data-hero={onHome && !scrolled} onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false)
          menuToggle.current.focus()
        }
      }}>
        <div className="masthead frame">
          <a className="brand" href={href('/')} aria-label="Brew Day home">
            <img src="/brew-day.svg" alt="" width="76" height="45" />
          </a>
          <button
            ref={menuToggle}
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span aria-hidden="true" />
          </button>
          <nav
            id="main-navigation"
            className="nav"
            style={{ '--active-index': Math.max(0, pages.findIndex(({ path }) => path === activePath)) }}
            aria-label="Main"
            data-open={menuOpen}
            onClick={() => {
              if (menuOpen) {
                setMenuOpen(false)
                menuToggle.current.focus()
              }
            }}
          >{links}</nav>
          <a className="header-link" href={href('/menu')}>Find your cup <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <main>
        {onHome && <Home />}
        {(onHome || path === '/about') && (
          <Page id={onHome ? 'about' : undefined} title={<>About <span>Brew Day</span></>} layout="about-page" media={
            <img className="about-photo" src="/cafe-interior.webp" alt="Morning light on a violet-tiled coffee counter" width="1200" height="900" loading="lazy" />
          }>
            <p>Brew Day is a neighborhood café for quick espressos and unhurried mornings.</p>
            <p>We keep the menu focused on the drinks we come back to every day, from a double espresso to cold brew poured over ice.</p>
            <a href={href('/menu')}>Explore the menu ↗</a>
          </Page>
        )}
        {(onHome || path === '/menu') && (
          <Page id={onHome ? 'menu' : undefined} title="Our menu" layout="menu-page" media={
            <ul className="coffee-menu">
              {drinks.map(([name, description, image]) => (
                <li className="coffee-card" key={name}>
                  <img src={image} alt="" width="512" height="512" loading="lazy" />
                  <h3>{name}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ul>
          } />
        )}
        {(onHome || path === '/contact') && (
          <Page id={onHome ? 'contact' : undefined} title="Visit us" layout="contact-page" media={
            <div className="contact-map-panel">
              <iframe
                className="contact-map"
                title="Map of central Manila"
                src="https://www.google.com/maps?q=14.590,120.981&z=14&output=embed"
                loading="lazy"
              />
              <a className="contact-map-link" href="https://www.google.com/maps/search/?api=1&query=14.590%2C120.981">Open in Google Maps ↗</a>
            </div>
          }>
            <dl className="opening-hours">
              <dt>Opening hours</dt>
              <dd>Mon–Fri · 7 am–6 pm</dd>
              <dd>Sat–Sun · 8 am–5 pm</dd>
            </dl>
            <p>100 Coffee Lane, Manila, Philippines<br />hello@brewday.example</p>
          </Page>
        )}
        {!currentPage && (
          <Page title="Page unavailable">
            <a href={href('/')}>Back to Brew Day ↗</a>
          </Page>
        )}
      </main>

      <footer className="frame site-footer">
        <a href={href('/')} className="brand">
          <img src="/brew-day.svg" alt="Brew Day Coffee" width="76" height="45" />
        </a>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
