import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { categories, featured, locations, menuItems, partners, photo, reviews } from './data'
import { EmailCopy, Link, MenuCard, SectionHeading } from './components'
import { ItemPage, NotFoundPage, pages } from './pages'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Brand({ footer = false }) {
  if (footer) {
    return <div className="brand-art" aria-hidden="true"><span>decõ</span><i className="brand-mark" /></div>
  }
  return (
    <a className="brand" href="/" aria-label="Deco home">
      <i className="brand-mark" aria-hidden="true" />
      <span>decõ</span>
    </a>
  )
}

function Icon({ name }) {
  const lines = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19m0-14-1.5 1.5m-11 11L5 19" /></>,
    moon: <path d="M20.8 14.1a8.9 8.9 0 0 1-10.9-10.9 9 9 0 1 0 10.9 10.9Z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m5 5 14 14M19 5 5 19" />,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">{lines[name]}</svg>
}

const navLinks = [['Home', '/'], ['Menu', '/menu'], ['Beans', '/beans'], ['About', '/about']]

function Header({ path, open, setOpen }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('tamp-theme') || 'dark' } catch { return 'dark' }
  })
  const toggle = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('tamp-theme', theme) } catch { /* Storage is optional. */ }
  }, [theme])

  useEffect(() => {
    if (!open) return
    const desktop = matchMedia('(min-width: 810px)')
    const close = () => setOpen(false)
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        close()
        toggle.current.focus()
      }
    }
    desktop.addEventListener('change', close)
    window.addEventListener('keydown', onEscape)
    document.body.classList.add('menu-open')
    return () => {
      desktop.removeEventListener('change', close)
      window.removeEventListener('keydown', onEscape)
      document.body.classList.remove('menu-open')
    }
  }, [open, setOpen])

  return (
    <header className="site-header">
      <nav className="shell header-inner flex items-center justify-between" aria-label="Main">
        <Brand />
        <div className="desktop-nav flex items-center">
          {navLinks.map(([label, to]) => (
            <Link key={to} to={to} button="outline" aria-current={to === path ? 'page' : undefined}>{label}</Link>
          ))}
        </div>
        <div className="header-actions flex items-center">
          <div className="theme-toggle flex" role="group" aria-label="Color theme">
            {['light', 'dark'].map((value, index) => (
              <button key={value} type="button" aria-pressed={theme === value} aria-label={index ? 'Dark' : 'Light'} onClick={() => setTheme(value)}>
                <Icon name={index ? 'moon' : 'sun'} />
              </button>
            ))}
          </div>
          <div className="desktop-cta"><Link to="/locations" button="solid">Find a café</Link></div>
          <button className="menu-toggle" ref={toggle} type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button>
        </div>
      </nav>
      <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile" data-open={open} inert={!open}>
        {[...navLinks, ['Contact', '/contact']].map(([label, to]) => (
          <Link key={to} to={to} aria-current={to === path ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>
        ))}
        <Link to="/locations" button="solid" onClick={() => setOpen(false)}>Find a café</Link>
      </nav>
    </header>
  )
}

function Hero() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [focused, setFocused] = useState(false)
  const [motion, setMotion] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches)
  const gallery = useRef(null)

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setMotion(!preference.matches)
    preference.addEventListener('change', change)
    return () => preference.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    if (!motion || paused || focused) return
    let interval
    const sync = () => {
      clearInterval(interval)
      if (!document.hidden) {
        interval = setInterval(() => setActive(index => (index + 1) % featured.length), 5000)
      }
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [paused, focused, motion])

  return (
    <section className="hero text-center">
      <div className="shell hero-copy">
        <h1>Specialty coffee in Chicago, ready when you are.</h1>
        <p>Three neighborhood cafés, one house roast, and a seat waiting when you walk in.</p>
      </div>
      <div ref={gallery} className="drink-gallery" role="region" aria-label="Featured drinks" tabIndex={0}
        onPointerEnter={(event) => event.pointerType === 'mouse' && setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onKeyDown={(event) => {
          const direction = { ArrowLeft: -1, ArrowRight: 1 }[event.key]
          if (direction) {
            event.preventDefault()
            gallery.current.focus({ preventScroll: true })
            setActive(index => (index + direction + featured.length) % featured.length)
          }
        }}
        onFocus={() => setFocused(true)} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
        }}>
        {featured.map((drink, index) => {
          const middle = Math.floor(featured.length / 2)
          const position = (index - active + featured.length + middle) % featured.length - middle
          return (
            <article className="drink" key={drink.slug} aria-hidden={Math.abs(position) > 1} data-position={position} style={{ '--position': position }}>
              <img src={photo(drink.slug)} alt="" width="768" height="572"
                fetchPriority={index === 0 ? 'high' : Math.abs(position) > 1 ? 'low' : undefined} />
              {Math.abs(position) === 1 && <button className="drink-select" type="button" aria-label={`Show ${drink.name}`}
                onClick={(event) => {
                  if (event.detail === 0) gallery.current.focus({ preventScroll: true })
                  setActive(index)
                }} />}
              <div className="drink-copy" aria-hidden={position !== 0}>
                <h2>{drink.name}</h2>
                <p>{drink.description}</p>
                <div className="drink-actions flex items-center justify-center">
                  <span>{drink.price}</span>
                  <Link to={drink.href} button="solid" tabIndex={position === 0 ? undefined : -1}>View drink</Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Partners() {
  return (
    <section className="partners">
      <div className="shell">
        <p>Poured at 40+ restaurants, offices and grocers around Chicago</p>
        <div className="ticker" data-ticker>
          <div className="ticker-track flex">
            {[false, true].map(duplicate => <ul className="flex items-center" key={String(duplicate)} aria-hidden={duplicate || undefined}>
              {partners.map(partner => <li key={partner}>{partner}</li>)}
            </ul>)}
          </div>
        </div>
      </div>
    </section>
  )
}

function readCategory() {
  const slug = new URLSearchParams(location.search).get('menu-category')
  return Object.keys(categories).find(name => name.toLowerCase() === slug) || 'Popular'
}

function Menu() {
  const [category, setCategory] = useState(readCategory)

  useEffect(() => {
    const sync = () => setCategory(readCategory())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  useEffect(() => {
    ScrollTrigger.refresh(true)
  }, [category])

  function choose(name) {
    if (name === category) return
    const url = new URL(location.href)
    if (name === 'Popular') url.searchParams.delete('menu-category')
    else url.searchParams.set('menu-category', name.toLowerCase())
    history.replaceState(history.state, '', url)
    setCategory(name)
  }

  return (
    <section className="section" id="menu">
      <div className="shell">
        <SectionHeading title="On the menu">Espresso, iced drinks, tea, sandwiches and desserts baked every morning. Oat and almond milk at no extra charge.</SectionHeading>
        <div className="filters flex" role="group" aria-label="Menu categories">
          {Object.keys(categories).map(name => <button className="pill" type="button" aria-pressed={category === name} onClick={() => choose(name)} key={name}>{name}</button>)}
        </div>
        <div className="menu-grid grid">
          {categories[category].map(item => <MenuCard key={item.slug} item={item} />)}
        </div>
        <div className="menu-more"><Link to="/menu" button="outline">See the full menu</Link></div>
      </div>
    </section>
  )
}

function Metric({ title, number, prefix, suffix, description, className = '', children }) {
  return (
    <article className={`metric ${className}`} data-metric>
      <div>
        <h3 aria-label={title}>{number === undefined ? title : <>{prefix}<span data-counter={number}>{number.toLocaleString('en-US')}</span>{suffix}</>}</h3>
        <p>{description}</p>
      </div>
      {children}
    </article>
  )
}

function Ring({ value, label, remainder, dial }) {
  const radius = dial ? 42 : 38
  return (
    <div className="ring-wrap flex items-center justify-between">
      <div className={dial ? 'metric-ring dial' : 'metric-ring'} data-progress={value} style={{ '--progress': value }} aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none" strokeWidth={dial ? 9 : 18}>
          <circle className="ring-track" cx="50" cy="50" r={radius} />
          <circle className="ring-value" cx="50" cy="50" r={radius} pathLength="100" strokeDasharray="100 100"
            strokeLinecap={dial ? 'round' : 'butt'} transform="rotate(-90 50 50)" />
        </svg>
        {dial && <i />}
      </div>
      <div className="legend"><span>{label}</span><span>{remainder}</span></div>
    </div>
  )
}

function Stats() {
  const hours = [33, 68, 110, 86, 64, 57, 66, 48, 24, 22, 37, 31, 15]
  return (
    <section className="section stats">
      <div className="shell">
        <SectionHeading title="A day at Decõ">What three small cafés get through, from the first pour at 6:30 AM to the last refill.</SectionHeading>
        <div className="stats-rows grid">
          <div className="stats-top grid">
            <Metric title="About 1,400" number={1400} prefix="About " description="cups a day across three cafés">
              <div className="cup-count">
                <div className="cup-dots" aria-hidden="true">{Array.from({ length: 140 }, (_, index) => <i key={index} />)}</div>
                <div className="legend"><span>Each circle is 10 cups</span></div>
              </div>
            </Metric>
            <Metric title="28 sec" number={28} suffix=" sec" description="How long every espresso shot runs: 18 g of coffee in, 36 g out, pulled the same way all day.">
              <Ring value={28 / 30 * 100} label="Shot time: 28 sec" remainder="Full dial: 30 sec" dial />
            </Metric>
          </div>
          <div className="stats-bottom grid">
            <Metric title="Busiest 8 to 9 AM" number={8} prefix="Busiest " suffix=" to 9 AM" description="Quietest 2 to 4 PM, the best time for a seat">
              <div aria-label="Cups served by hour">
                <div className="hour-bars flex items-end" aria-hidden="true">{hours.map((value, index) => <i key={index} style={{ '--height': `${value / 1.1}%` }} />)}</div>
                <div className="hour-labels flex justify-between" aria-hidden="true"><span>6 AM</span><span>12 PM</span><span>6 PM</span></div>
                <div className="legend legend-row"><span>Busiest hour</span><span>Quietest hours</span></div>
              </div>
            </Metric>
            <Metric title="60 kg" number={60} suffix=" kg" description="roasted every week">
              <div className="roast-bars">{[['Tuesday', 32], ['Friday', 28]].map(([day, amount]) => <div key={day}><div className="flex justify-between"><span>{day}</span><span>{amount} kg</span></div><i><b style={{ width: `${amount / 32 * 100}%` }} /></i></div>)}</div>
            </Metric>
            <Metric title="46% oat milk" number={46} suffix="% oat milk" description="Almost half of the milk drinks we make are ordered with oat milk. Oat and almond never cost extra.">
              <Ring value={46} label="Oat milk 46%" remainder="Other milks 54%" />
            </Metric>
          </div>
        </div>
      </div>
    </section>
  )
}

function Beans() {
  return (
    <section className="section beans">
      <div className="shell">
        <SectionHeading title="Decõ House, roasted twice a week">Colombia Huila and Ethiopia Guji, medium roast. Milk chocolate, red apple, honey. It’s in every espresso drink we make.</SectionHeading>
        <div className="section-action"><Link to="/beans" button="solid">See our beans</Link></div>
        <div className="beans-grid grid">
          <div className="photo-frame"><img src={photo('beans')} loading="lazy" width="1024" height="765" alt="A bag of Decõ House medium-roast coffee" /></div>
          <article className="recipe">
            <div>
              <h3>Our espresso recipe</h3>
              <dl className="recipe-specs grid">{[['In','18 g'],['Out','36 g'],['Time','28 sec'],['Water','93°C']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            </div>
            <div className="roast-level">
              <div className="flex justify-between"><span>Light</span><span>Medium</span><span>Dark</span></div>
              <div className="roast-meter grid" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <i key={index} data-filled={index < 3 || undefined} />)}</div>
              <p>Roasted Tuesday and Friday in Logan Square. Ground to order, free.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="section reviews">
      <div className="shell">
        <SectionHeading title="Our regulars, in their own words">Written on their cups, the way we write their names.</SectionHeading>
        <div className="review-stage">
          <div className="cup-rail" tabIndex={0} role="region" aria-label="Customer reviews">
            {reviews.map(([name, order, quote, angle]) => (
              <figure key={name} className="review-cup" data-cup={angle}>
                <div className="cup-drawing">
                  <img src="/media/cup.svg" loading="lazy" width="250" height="340" alt="" />
                  <blockquote>{quote}</blockquote>
                </div>
                <figcaption><strong>{name}</strong><span>{order}</span></figcaption>
              </figure>
            ))}
          </div>
          <p className="rating">4.8 from 2,140 Google reviews</p>
        </div>
      </div>
    </section>
  )
}

function Rewards() {
  return (
    <section className="section rewards" id="rewards">
      <div className="shell rewards-grid grid items-center">
        <div>
          <SectionHeading title="Every 10th drink is on us">One stamp per drink and a free drink on your birthday. Ask for a card at the counter. It’s free.</SectionHeading>
          <div className="section-action"><Link to="/locations" button="solid">Find a café</Link></div>
        </div>
        <aside className="stamp-card" aria-label="Example loyalty card">
          <div className="stamp-header flex items-center justify-between"><Brand /><p>Maya R. · member since 2024</p></div>
          <div className="stamps grid" aria-hidden="true">
            {Array.from({ length: 10 }, (_, index) => <div data-stamp={index} className={index === 9 ? 'stamp free' : 'stamp'} key={index}>
              {index < 7 && <img src={photo(`stamp-${index + 1}`)} width="128" height="128" loading="lazy" alt="" />}
              {index === 9 && 'Free'}
            </div>)}
          </div>
          <div className="stamp-bottom flex justify-between"><span>7 of 10</span><span>3 to go</span></div>
        </aside>
      </div>
    </section>
  )
}

function Locations() {
  return (
    <section className="section locations" id="locations">
      <div className="shell">
        <SectionHeading title="Three cafés, one roast">Come in for a seat, or grab a cup on your way to work.</SectionHeading>
        <div className="section-action"><Link to="/locations" button="outline">All locations</Link></div>
        <div className="location-grid grid">
          {locations.map(([slug, name, address, hours]) => (
            <article className="location" key={slug}>
              <div className="photo-frame"><img src={photo(slug)} width="768" height="515" loading="lazy" alt="" /></div>
              <div className="location-copy">
                <h3>{name}</h3><address>{address}</address><p>{hours}</p>
                <Link to={`https://maps.google.com/?q=${encodeURIComponent(address)}`} button="outline" target="_blank" rel="noreferrer">Get directions</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer({ inert }) {
  const footerLinks = [
    ['Menu', [['Espresso','/menu'], ['Iced','/menu'], ['Food','/menu'], ['Beans','/beans']]],
    ['Decõ', [['About','/about'], ['Contact','/contact']]],
    ['Legal', [['Terms','/terms'], ['Privacy','/privacy']]],
  ]
  return (
    <footer className="site-footer" inert={inert}>
      <div className="shell">
        <div className="footer-grid grid">
          <div className="footer-contact">
            <Brand /><p>Your usual, made properly.</p>
            <EmailCopy />
            <a href="tel:+13125550187">(312) 555-0187</a>
          </div>
          <div className="footer-visit">
            <h2>Visit</h2>
            {locations.map(([slug, name, , hours]) => <Link key={slug} to="/locations"><strong>{name}</strong><span>{hours}</span></Link>)}
          </div>
          {footerLinks.map(([heading, links]) => <div className="footer-links" key={heading}><h2>{heading}</h2>{links.map(([name, to]) => <Link key={name} to={to}>{name}</Link>)}</div>)}
        </div>
        <Brand footer />
        <div className="footer-bottom flex justify-between"><span>© 2026 Decõ Coffee Co.</span><span>Decõ is a fictional coffee house made for this template.</span></div>
      </div>
    </footer>
  )
}

export default function App() {
  const path = location.pathname.replace(/\/+$/, '') || '/'
  const home = path === '/'
  const item = menuItems.find(candidate => candidate.href === path)
  const page = pages[path]
  const Page = page?.Component || NotFoundPage
  const root = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!home) document.title = `${page?.title || item?.name || 'Page not found'} · Decõ`
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView()
  }, [home, item, page])

  useGSAP(() => {
    const select = gsap.utils.selector(root.current)
    const motion = gsap.matchMedia(root.current)
    const queries = { animate: '(prefers-reduced-motion: no-preference)' }
    if (path === '/beans') queries.columns = '(min-width: 1200px)'
    motion.add(queries, ({ conditions }) => {
      if (!conditions.animate) return
      if (!home) {
        select('[data-route-reveal]').forEach((panel, index) => {
          gsap.from(panel, {
            opacity: 0, y: 32, duration: 0.68, delay: 0.12 + index * 0.14, ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 94%' },
          })
        })
        for (const grid of select('.tip-grid')) {
          const cards = Array.from(grid.children)
          const entrance = {
            y: 60, scale: 0.96, duration: 0.68, ease: 'back.out(0.85)',
          }
          const reveal = (targets, trigger, stagger = 0) => {
            const timeline = gsap.timeline({ scrollTrigger: { trigger, start: 'top 82%' } })
            timeline.from(targets, { ...entrance, stagger }, 0)
              .from(targets, { opacity: 0, duration: 0.54, ease: 'power1.out', stagger }, 0)
          }
          if (conditions.columns) reveal(cards, grid, 0.17)
          else cards.forEach(card => reveal(card, card))
        }
        for (const card of select('.timeline-card')) {
          gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: card, start: 'top 62%' } })
            .from(card.querySelector('img'), { scale: 1.18, duration: 0.85 })
            .from(card.querySelector('.timeline-location'), { y: 16, opacity: 0, duration: 0.65 }, 0.05)
            .from(card.querySelector('time'), { y: 80, opacity: 0, duration: 0.72 }, 0.12)

          for (const caption of card.querySelectorAll('.timeline-bottom > *')) {
            gsap.from(caption, {
              y: 28, opacity: 0, duration: 0.65, ease: 'power3.out',
              scrollTrigger: { trigger: caption, start: 'top 91%' },
            })
          }
        }
        return
      }

      const [partnersSection] = select('.partners')
      const [tickerTrack] = select('.ticker-track')
      const [rating] = select('.rating')
      const [stampCard] = select('.stamp-card')

      gsap.from(select('[data-ticker]'), {
        opacity: 0, duration: 0.65, scrollTrigger: { trigger: partnersSection, start: 'top 92%' },
      })
      const ticker = gsap.to(tickerTrack, { xPercent: -50, duration: tickerTrack.offsetWidth / 60, repeat: -1, ease: 'none', paused: true })
      ScrollTrigger.create({ trigger: partnersSection, start: 'top bottom', end: 'bottom top', onToggle: ({ isActive }) => ticker.paused(!isActive) })

      for (const card of select('[data-metric]')) {
        const count = card.querySelector('[data-counter]')
        const value = Number(count.dataset.counter)
        const dots = card.querySelectorAll('.cup-dots i')
        const bars = card.querySelectorAll('.hour-bars i, .roast-bars b')
        const ring = card.querySelector('.metric-ring')
        const number = { value: 0 }
        count.textContent = '0'
        const timeline = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%' } })
        timeline.to(number, {
          value, duration: 0.95, ease: 'power2.out',
          onUpdate: () => { count.textContent = Math.round(number.value).toLocaleString('en-US') },
        }, 0)
        if (dots.length) timeline.fromTo(dots, { '--dot-fill': '0%' }, { '--dot-fill': '100%', duration: 0.3, stagger: 0.008, ease: 'power1.inOut' }, 0)
        if (bars.length) timeline.from(bars, { scale: 0, opacity: 0, stagger: { amount: 0.6 }, duration: 0.45, ease: 'power2.out' }, 0)
        if (ring) timeline.fromTo(ring, { '--progress': 0 }, { '--progress': ring.dataset.progress, duration: 1, ease: 'power2.out' }, 0)
      }

      const cups = select('[data-cup]')
      const cupEntrances = new Map(cups.map(cup => [cup, gsap.from(cup, {
        opacity: 0, y: 48, scale: 0.94, rotation: Number(cup.dataset.cup), duration: 0.72, ease: 'power3.out', paused: true,
      })]))
      const cupObserver = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return
          cupEntrances.get(target).play()
          target.dataset.revealed = 'true'
          cupObserver.unobserve(target)
        })
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
      cups.forEach(cup => cupObserver.observe(cup))
      gsap.from(rating, { opacity: 0, y: 12, duration: 0.5, scrollTrigger: { trigger: rating, start: 'top 93%' } })

      gsap.from(select('[data-stamp]'), {
        opacity: 0, y: 12, scale: 0.4, rotation: index => index % 2 ? 24 : -24, stagger: 0.085,
        duration: 0.46, ease: 'back.out(1.4)', scrollTrigger: { trigger: stampCard, start: 'top 80%' },
      })
      return () => {
        cupObserver.disconnect()
        cups.forEach(cup => delete cup.dataset.revealed)
        for (const count of select('[data-counter]')) count.textContent = Number(count.dataset.counter).toLocaleString('en-US')
      }
    })
    return () => motion.revert()
  }, { scope: root, dependencies: [home] })

  return (
    <div ref={root} className="site">
      <Header path={path} open={menuOpen} setOpen={setMenuOpen} />
      <main inert={menuOpen}>{home
        ? <><Hero /><Partners /><Menu /><Stats /><Beans /><Reviews /><Rewards /><Locations /></>
        : item ? <ItemPage item={item} /> : <Page />}
      </main>
      <Footer inert={menuOpen} />
    </div>
  )
}
