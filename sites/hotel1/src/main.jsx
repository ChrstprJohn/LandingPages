import { Fragment, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { booking, chefBio, diningHours, guestNotes, hotelEmail, hotelName, hotelStats, journal, menuItems, navigation, photos, rooms, services, team } from './content'
import { useRoute } from './router'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const dateFormat = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const media = (name) => '/media/' + name + '.jpg'
const journalPath = (slug) => '/blog-posts/' + slug
const primaryNavigation = [['Home', '/'], ...navigation]

function Photo({ name, eager = false, decorative = false, priority }) {
  return <img src={media(name)} alt={decorative ? '' : photos[name]} loading={eager ? 'eager' : 'lazy'} fetchPriority={priority} decoding="async" />
}

function Action({ children, href, theme = 'dark', external = false, compact = false }) {
  return <a className={'action action--' + theme + (compact ? ' action--compact' : '')} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener' : undefined}>{children}</a>
}

function Brand() {
  return <a className="brand" href="/" aria-label={hotelName + ' home'}>{hotelName}</a>
}

function Header({ path }) {
  const header = useRef(null)
  const toggle = useRef(null)
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(() => window.scrollY > 30)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30)
    const wide = window.matchMedia('(min-width: 810px)')
    const closeOnResize = () => { if (wide.matches) setOpen(false) }
    window.addEventListener('scroll', onScroll, { passive: true })
    wide.addEventListener('change', closeOnResize)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      wide.removeEventListener('change', closeOnResize)
    }
  }, [])

  useGSAP(() => {
    if (open && window.matchMedia('(prefers-reduced-motion: no-preference) and (width < 810px)').matches) {
      gsap.from('.site-nav a', { opacity: 0, y: -5, duration: 0.32, stagger: 0.055, ease: 'power2.out', clearProps: 'opacity,transform' })
    }
  }, { scope: header, dependencies: [open], revertOnUpdate: true })

  function onKeyDown(event) {
    if (event.key !== 'Escape' || !open) return
    event.preventDefault()
    setOpen(false)
    toggle.current.focus()
  }

  return <header ref={header} className={'site-header' + (solid || open ? ' site-header--solid' : '')} onKeyDown={onKeyDown} onClick={(event) => { if (event.target.closest('a')) setOpen(false) }}>
    <div className="wrap header-inner">
      <Brand />
      <button ref={toggle} className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}><span /><span /><span /></button>
      <nav id="site-nav" aria-label="Main navigation" className={'site-nav' + (open ? ' site-nav--open' : '')}>
        <ul className="nav-links">
          {primaryNavigation.map(([label, href]) => <li key={href}><a href={href} aria-current={path === href ? 'page' : undefined} className={path.startsWith(href + '/') ? 'nav-parent' : undefined}>{label}</a></li>)}
        </ul>
        <Action href={booking} theme="light" compact external>Book Now</Action>
      </nav>
    </div>
  </header>
}

function Hero({ photo, kicker, title, note, home = false, variant = '' }) {
  const size = home ? 'home' : title ? 'page' : 'detail'
  return <section className={'hero hero--' + size + (variant ? ' hero--' + variant : '')}>
    <div className="hero-media"><Photo name={photo} eager priority="high" decorative /></div>
    {title && <div className="wrap hero-body">
      <div className="hero-copy">
        <p className="eyebrow">{kicker}</p>
        <h1 tabIndex={-1}>{title.split(' ').map((word, index) => <Fragment key={index}>{index > 0 && ' '}<span className="hero-word">{word}</span></Fragment>)}</h1>
        {note && <p className="hero-note">{note}</p>}
        {home && <div className="hero-actions">
          <Action theme="light" href="/rooms">View Rooms</Action>
          <Action theme="ghost" href="/about">Our Story</Action>
        </div>}
      </div>
    </div>}
  </section>
}

function SectionHeading({ kicker, title, children, reveal = true }) {
  return <div className="section-heading" data-reveal={reveal ? '' : undefined}>
    <div><p className="eyebrow">{kicker}</p><h2>{title}</h2></div>
    {children}
  </div>
}

function RoomGrid({ list }) {
  return <div className="card-grid" data-reveal-group>
    {list.map(({ slug, name, type, rate, photo }) => <a key={slug} className="editorial-card" href={'/rooms/' + slug}>
      <div className="card-photo"><Photo name={photo} /></div>
      <div className="card-meta"><p className="eyebrow">{type}</p><h3>{name}</h3><p className="card-price">From ${rate} <span>/ night</span></p></div>
    </a>)}
  </div>
}

function Feature({ photo, kicker, title, children, tone = '' }) {
  return <section className={'feature ' + tone}>
    <div className="feature-photo" data-reveal><Photo name={photo} /></div>
    <div className="feature-copy" data-reveal-group>
      <SectionHeading kicker={kicker} title={title} reveal={false} />
      {children}
    </div>
  </section>
}

function ParallaxPhoto({ photo }) {
  return <div className="parallax-frame"><div className="parallax-photo" data-parallax><Photo name={photo} eager priority="low" /></div></div>
}

function JournalGrid() {
  return <div className="card-grid" data-reveal-group>
    {journal.map(({ slug, title, category, summary, date, photo }) => <a className="editorial-card" key={slug} href={journalPath(slug)}>
      <div className="card-photo"><Photo name={photo} /></div>
      <div className="card-meta"><p className="eyebrow">{category}</p><h3>{title}</h3><p className="card-note">{summary}</p><time dateTime={date}>{dateFormat.format(new Date(date))}</time></div>
    </a>)}
  </div>
}

function Home() {
  return <>
    <Hero home photo="hero" kicker={'Welcome to ' + hotelName} title="A place you’ll want to stay." note="Quiet rooms, suites, and villas. A restaurant worth making time for. A team that notices what you need." />
    <div className="wrap home-sections">
      <section id="rooms" className="home-rooms" tabIndex={-1}>
        <SectionHeading kicker="Rooms & Suites" title="Find a room for you."><Action theme="outline" compact href="/rooms">View All Rooms</Action></SectionHeading>
        <RoomGrid list={rooms.slice(0, 3)} />
      </section>
      <section className="home-services">
        <ParallaxPhoto photo="services-feature" />
        <div className="service-panel">
          <SectionHeading kicker="Hotel Services" title="The comforts you need." />
          <ol className="service-list" data-reveal-group>
            {services.slice(0, 4).map(({ title, description }, index) => <li key={title}><span aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}
          </ol>
        </div>
      </section>
      <Feature tone="feature--story" photo="story" kicker="Our Story" title="A hotel made with care.">
        <p>A good stay starts with a room that feels right, food made with care, and people who look after you. Independent and part of the neighbourhood since 2009.</p>
        <Action href="/about">Meet the Team</Action>
      </Feature>
      <section className="home-reviews">
        <SectionHeading kicker="Guest Reviews" title="From our guests." />
        <div className="review-grid" data-reveal-group>{guestNotes.map(({ quote, name, location, stay }) => <figure key={name}>
          <div className="review-quote"><img src="/media/stars.svg" alt="" /><blockquote>{quote}</blockquote></div>
          <figcaption>
            <div className="review-author"><strong>{name}</strong><p>{location}</p></div>
            <div className="review-stay"><p>Stayed at</p><strong>{stay}</strong></div>
          </figcaption>
        </figure>)}</div>
      </section>
      <section className="home-dining">
        <ParallaxPhoto photo="dining-feature" />
        <div className="dining-panel" data-reveal-group>
          <SectionHeading kicker="The Restaurant" title="Good food, just downstairs." reveal={false} />
          <div className="dining-description">
            <p>Come for seasonal cooking with ingredients from nearby producers. The dining room serves breakfast, lunch, and dinner every day of the week.</p>
            <p>Take your time over eggs and coffee, take a seat for a proper lunch, or open a good bottle of wine and settle in for dinner. We’ll have a table ready for you.</p>
          </div>
          <Action href="/dining">See Our Menu</Action>
        </div>
      </section>
      <section id="journal" className="journal" tabIndex={-1}>
        <SectionHeading kicker="Journal" title={'Notes from ' + hotelName + '.'} />
        <JournalGrid />
      </section>
    </div>
  </>
}

function GalleryGrid({ compact = false }) {
  const list = ['gallery-room', 'gallery-villa', 'gallery-dining', 'gallery-exterior', 'gallery-pool', 'gallery-table']
  return <div className={'gallery-grid' + (compact ? ' gallery-grid--compact' : '')} data-reveal-group>
    {list.map((photo) => <figure className="gallery-photo" key={photo}><Photo name={photo} /></figure>)}
  </div>
}

function RoomsPage() {
  return <>
    <Hero photo="classic-room" kicker="Rooms & Suites" title="Find a room for you." note="Choose from six room types, from classic doubles to private villas, all made for a good night’s rest." />
    <section className="wrap rooms-page" aria-label="Rooms and Suites"><RoomGrid list={rooms} /></section>
  </>
}

function ServicesPage() {
  return <>
    <Hero photo="reception" kicker="Hotel Services" title="All the comforts you need." note="Our services take care of the practical details so you can make the most of your stay." />
    <section className="wrap services-page" aria-label="Hotel Services">
      {services.map(({ title, category, detail, photo }) => <article className="service-row" key={title}>
        <div className="service-row-photo" data-reveal><Photo name={photo} /></div>
        <div data-reveal-group><SectionHeading kicker={category} title={title} reveal={false} /><p>{detail}</p></div>
      </article>)}
    </section>
  </>
}

function DiningPage() {
  return <>
    <Hero photo="dining-hero" kicker="The Restaurant" title="Good food, just downstairs." note="We cook with seasonal ingredients from nearby producers and serve breakfast through dinner, every day of the week." />
    <section className="hours-band" aria-label="Restaurant opening hours">
      <ul className="wrap hours-grid" data-reveal-group>
        {diningHours.map(([label, opening, openingPeriod, closing, closingPeriod, note]) => <li key={label}>
          <p className="hours-label">{label} {note && <small>{note}</small>}</p>
          <p className="hours-time">{opening}<small>{openingPeriod}</small><span aria-hidden="true">-</span>{closing}<small>{closingPeriod}</small></p>
        </li>)}
      </ul>
    </section>
    <div className="wrap dining-page">
      <section className="dining-menu">
        <SectionHeading kicker="The Menu" title="From our kitchen." />
        <ul className="menu-rows" data-reveal-group>
          {menuItems.map(([category, dish, description, price]) => <li className="menu-row" key={dish}>
            <p className="dish-category">{category}</p>
            <div className="dish-detail"><h3>{dish}</h3><p>{description}</p></div>
            <p className="dish-price">${price}</p>
          </li>)}
        </ul>
      </section>
      <figure className="wide-photo" data-reveal><Photo name="restaurant" /></figure>
      <Feature tone="feature--story feature--chef" photo="team-marco" kicker="The Kitchen" title="Head Chef Marco Ricci.">
        <p>{chefBio}</p>
      </Feature>
      <section className="home-dining private-dining">
        <ParallaxPhoto photo="private-dining" />
        <div className="dining-panel" data-reveal-group>
          <SectionHeading kicker="Private Dining" title="A room for your occasion." reveal={false} />
          <div className="dining-description"><p>Reserve the private dining room for up to 14 guests, whether it’s a business dinner, a celebration, or another special event. Get in touch to plan it.</p></div>
          <Action href="/contact">Contact Us</Action>
        </div>
      </section>
    </div>
  </>
}

function AboutPage() {
  return <>
    <Hero photo="hero" kicker="Our Story" title="Built with care. Made to welcome." note="Independent since 2009, with comfortable rooms, food made with care, and a team who looks after you." variant="about" />
    <div className="wrap about-page">
      <Feature tone="feature--about" photo="about-feature" kicker="Who We Are" title="Small details, better stays.">
        <p>DcdHotel opened in 2009 to give guests a stay that felt rooted in its neighbourhood. We still own and run the hotel independently, putting our energy into doing the small things well.</p>
        <p>When we choose a mattress or change the menu, we ask how it will improve a guest’s stay. That question has guided every decision we’ve made since we opened.</p>
      </Feature>
      <dl className="hotel-stats" data-reveal-group>{hotelStats.map(([label, value]) => <div key={label}>
        <dt>{label}</dt>
        <dd><span data-counter aria-hidden="true">{value}</span><span className="sr-only">{value}</span></dd>
      </div>)}</dl>
      <section className="team">
        <SectionHeading kicker="The Team" title="Meet the people behind it." />
        <div className="team-grid" data-reveal-group>
          {team.map(({ name, role, photo, bio }) => <article key={name}>
            <div className="team-photo"><Photo name={photo} /></div>
            <div className="team-copy"><h3>{name}</h3><p>{role}</p><p>{bio}</p></div>
          </article>)}
        </div>
      </section>
      <figure className="wide-photo" data-reveal><Photo name="gallery-hero" /></figure>
      <section className="about-gallery">
        <SectionHeading kicker={hotelName} title="A closer look." />
        <GalleryGrid compact />
      </section>
    </div>
  </>
}

function GalleryPage() {
  return <>
    <Hero photo="gallery-hero" kicker={hotelName} title="A closer look." note="Explore the rooms, restaurant, and spaces around DcdHotel before your visit." variant="gallery" />
    <section className="wrap gallery-page" aria-label="Hotel Gallery"><GalleryGrid /></section>
  </>
}

function RoomDetail({ room }) {
  return <>
    <Hero photo={room.photo} />
    <section className="wrap detail-layout room-detail">
      <div data-reveal-group><p className="eyebrow">{room.type}</p><h1 tabIndex={-1}>{room.name}</h1><p>{room.description}</p>
        <dl className="room-facts"><div><dt>Room size</dt><dd>{room.size} sq ft</dd></div><div><dt>Occupancy</dt><dd>{room.guests} guests</dd></div><div><dt>Bed type</dt><dd>{room.beds}</dd></div></dl>
      </div>
      <aside className="rate-card" data-reveal><p><strong>${room.rate}</strong> <span>/night</span></p><p>Taxes and fees are additional.</p><Action href={booking} external>Book Now</Action></aside>
    </section>
    <section className="wrap section"><SectionHeading kicker="Rooms & Suites" title="See more rooms." /><RoomGrid list={rooms.filter((item) => item !== room).slice(0, 3)} /></section>
  </>
}

function Contact() {
  const [draft, setDraft] = useState('')
  function prepareMessage(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = encodeURIComponent(hotelName + ' enquiry')
    const body = encodeURIComponent([data.get('message'), '', data.get('name'), data.get('email')].join('\n'))
    setDraft('mailto:' + hotelEmail + '?subject=' + subject + '&body=' + body)
  }

  return <>
    <Hero photo="hero" kicker="Contact" title="We’re here to help." note="Get in touch about rooms, reservations, or anything you need to plan your visit." />
    <section className="wrap section detail-layout">
      <div data-reveal-group><p className="eyebrow">Contact</p><h2>Send us a note.</h2><p>Use the form to create a sample email draft in this preview.</p></div>
      <form className="contact-form" onSubmit={prepareMessage} onChange={() => setDraft('')} data-reveal-group>
        <label>Your Name<input name="name" autoComplete="name" required /></label>
        <label>Your Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Your Message<textarea name="message" rows={5} required /></label>
        <button className="action action--dark">Prepare email</button>
        {draft && <p role="status">Draft ready. <a className="text-link" href={draft}>Open in your email app</a></p>}
      </form>
    </section>
  </>
}

function Page({ path }) {
  if (path === '/') return <Home />

  const room = rooms.find(({ slug }) => path === '/rooms/' + slug)
  if (room) return <RoomDetail room={room} />

  const post = journal.find(({ slug }) => path === journalPath(slug))
  if (post) return <>
    <Hero photo={post.photo} />
    <article className="wrap section prose-section" data-reveal-group>
      <h1 tabIndex={-1}>{post.title}</h1>
      <p>{post.author} · <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time></p>
      <p>{post.summary}</p>
      {post.body.map(([heading, paragraph]) => <Fragment key={heading}><h3>{heading}</h3><p>{paragraph}</p></Fragment>)}
    </article>
    <section className="wrap section related journal"><SectionHeading kicker="Keep Reading" title="Elsewhere in the journal." /><JournalGrid /></section>
  </>

  if (path === '/rooms') return <RoomsPage />
  if (path === '/services') return <ServicesPage />
  if (path === '/dining') return <DiningPage />
  if (path === '/about') return <AboutPage />
  if (path === '/gallery') return <GalleryPage />

  if (path === '/contact') return <Contact />

  if (path === '/legal-page/privacy-policy' || path === '/legal-page/terms-conditions' || path === '/privacy' || path === '/terms') {
    const privacy = path.includes('privacy')
    return <section className="wrap simple-page" data-reveal-group>
      <h1 tabIndex={-1}>{privacy ? 'Privacy Policy' : 'Terms & Conditions'}</h1>
      <p>{privacy ? 'The contact form uses the details you enter in this browser to create a draft. When you open the draft, those details pass to your email app.' : 'This local DcdHotel preview uses sample rates, menus, and guest reviews. The booking button takes you to Booking.com.'}</p>
      <Action href="/" theme="outline">Return Home</Action>
    </section>
  }

  return <section className="wrap simple-page" data-reveal-group><h1 tabIndex={-1}>Page not found.</h1><Action href="/" theme="outline">Return Home</Action></section>
}

const socials = [
  ['Instagram', 'https://www.instagram.com/'],
  ['Facebook', 'https://www.facebook.com/'],
  ['WhatsApp', 'https://www.whatsapp.com/'],
  ['Messenger', 'https://www.messenger.com/'],
  ['Telegram', 'https://web.telegram.org/'],
]

function Footer() {
  return <footer className="site-footer">
    <div className="wrap">
      <div className="footer-main">
        <div><Brand /><p className="footer-tagline">A stay worth making time for.</p><ul className="socials">{socials.map(([name, href]) => <li key={name}><a href={href} aria-label={name} target="_blank" rel="noopener"><img src={'/media/' + name.toLowerCase() + '.svg'} alt="" /></a></li>)}</ul></div>
        <div><h2>Navigate</h2><ul>{[navigation[0], navigation[1], navigation[2], navigation[4], navigation[3], ['Contact', '/contact']].map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul></div>
        <div><h2>Legal</h2><ul><li><a href="/legal-page/privacy-policy">Privacy Policy</a></li><li><a href="/legal-page/terms-conditions">Terms & Conditions</a></li></ul></div>
        <div><h2>Contact</h2><ul><li>1 Grand Avenue, City Centre</li><li><a href="tel:+10000000000">+1 (000) 000 0000</a></li><li><a href={'mailto:' + hotelEmail}>{hotelEmail}</a></li></ul></div>
      </div>
      <div className="footer-bottom"><p>© 2026 {hotelName}. All rights reserved.</p><p><a href="https://www.framer.com/">Framer</a> template by <a href="https://damircosic.com/">Damir Cosic</a></p></div>
    </div>
  </footer>
}

export default function App() {
  const path = useRoute()
  const main = useRef(null)

  useEffect(() => {
    const title = main.current.querySelector('h1')?.textContent
    document.title = path === '/' ? hotelName : title + ' · ' + hotelName
  }, [path])

  useGSAP(() => {
    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', (mediaContext, contextSafe) => {
      const hero = main.current.querySelector('.hero')
      const heroCopy = hero?.querySelector('.hero-copy')
      if (hero) {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.hero-media', { opacity: 0.2, scale: 1.06, duration: 0.8, clearProps: 'opacity,transform' }, 0)
        if (heroCopy) {
          timeline.from('.hero-copy .eyebrow', { opacity: 0, y: 6, duration: 0.4, clearProps: 'opacity,transform' }, 0.08)
            .from('.hero-word', { opacity: 0, y: 10, filter: 'blur(4px)', stagger: { amount: 0.18 }, duration: 0.56, clearProps: 'filter,opacity,transform' }, 0.13)
            .from('.hero-note, .hero-actions .action', { opacity: 0, y: 7, stagger: 0.065, duration: 0.45, clearProps: 'transform,opacity' }, 0.38)
          gsap.to(heroCopy, { opacity: 0, ease: 'none',
            scrollTrigger: { trigger: hero, start: '55% top', end: 'bottom top', scrub: true },
          })
        }
        gsap.to('.hero-media img', { yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        })
      }
      for (const element of main.current.querySelectorAll('[data-reveal]')) {
        gsap.from(element, { opacity: 0, y: 24, duration: 0.65, ease: 'power3.out', clearProps: 'opacity,transform',
          scrollTrigger: { trigger: element, start: 'top 95%', once: true },
        })
      }
      const revealItems = contextSafe((items) => {
        gsap.to(items, { opacity: 1, y: 0, duration: 0.58, stagger: 0.065, ease: 'power3.out', clearProps: 'opacity,transform' })
      })
      for (const group of main.current.querySelectorAll('[data-reveal-group]')) {
        const items = Array.from(group.children)
        gsap.set(items, { opacity: 0, y: 16 })
        ScrollTrigger.batch(items, { start: 'top 94%', once: true, interval: 0.05, batchMax: 4, onEnter: revealItems })
      }
      for (const counter of main.current.querySelectorAll('[data-counter]')) {
        gsap.from(counter, { textContent: 0, duration: 1, snap: { textContent: 1 }, ease: 'power2.out',
          scrollTrigger: { trigger: counter, start: 'top 90%', once: true },
        })
      }
      for (const frame of main.current.querySelectorAll('[data-parallax]')) {
        gsap.fromTo(frame.querySelector('img'), { yPercent: -10 }, { yPercent: 10, ease: 'none',
          scrollTrigger: { trigger: frame.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
    }, main)
    return () => motion.revert()
  }, { scope: main, dependencies: [path], revertOnUpdate: true })

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header key={path} path={path} />
    <main id="main" ref={main} tabIndex={-1} data-route={path}><Page key={path} path={path} /></main>
    <Footer />
  </>
}
