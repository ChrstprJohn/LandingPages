import { useEffect, useRef, useState } from 'react'
import Carousel, { Arrow } from './Carousel.jsx'
import { articles, contactDetails, navigation, process, projects, promises, results, services, team, teamValues, testimonials } from './content.js'
import { usePageMotion } from './motion.js'
import { useRoute } from './route.js'
import RoutedPages, { pageTitle } from './RoutedPages.jsx'
import { Button, Image, PhotoCard, SectionHeading } from './ui.jsx'
import './styles.css'

function Logo({ footer = false }) {
  return <a href="/" className="logo inline-flex items-center" aria-label="Dconstruct home">
    <span className="logo-mark" aria-hidden="true" />
    <span className="logo-name">{footer ? 'Dconstruct' : 'DCONSTRUCT'}</span>
  </a>
}

function Header({ path, light, onTheme }) {
  const [open, setOpen] = useState(false)
  const menu = useRef(null)
  const header = useRef(null)
  useEffect(() => {
    if (!open) return
    function dismiss(event) {
      if (event.type === 'keydown' && event.key === 'Escape') {
        setOpen(false)
        menu.current.focus()
      }
      if (event.type === 'pointerdown' && !header.current.contains(event.target)) setOpen(false)
    }
    window.addEventListener('keydown', dismiss)
    window.addEventListener('pointerdown', dismiss)
    return () => {
      window.removeEventListener('keydown', dismiss)
      window.removeEventListener('pointerdown', dismiss)
    }
  }, [open])

  const links = navigation.map(([name, destination]) => <a key={destination} href={destination}
    aria-current={path === destination ? 'page' : path.startsWith(destination + '/') ? 'location' : undefined}
    onClick={() => setOpen(false)}>{name}</a>)
  const compact = path !== '/' && path !== '/about'
  return <header className={`site-header shell${compact ? ' is-inner-header' : ''}`} ref={header}>
    <div className="header-bar flex items-center justify-between">
      <Logo />
      <nav className="desktop-nav" aria-label="Main navigation">{links}</nav>
      <div className="header-actions flex items-center">
        <button type="button" className="theme-switch" role="switch" aria-checked={light} aria-label="Light theme" onClick={onTheme}>
          <svg className="theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42m0-14.14-1.42 1.42m-11.3 11.3-1.42 1.42" />
          </svg>
          <svg className="theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.9 13.35A9 9 0 0 1 10.65 3.1 9 9 0 1 0 20.9 13.35Z" />
          </svg>
        </button>
        <Button to="/contact" className="header-consult" plain>Book a Consult</Button>
        <button ref={menu} className="menu-toggle" aria-controls="mobile-nav" aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><span /><span /></button>
      </div>
    </div>
    <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" data-open={open} inert={!open}>
      {links}
      <Button to="/contact" className="mobile-consult" plain onClick={() => setOpen(false)}>Book a Consult</Button>
    </nav>
  </header>
}

function Hero() {
  return <section className="hero" id="hero">
    <Image name="hero.jpg" eager className="cover" />
    <div className="shell hero-shell">
      <div className="hero-content">
        <h1>We Craft Homes Built to Last a Lifetime</h1>
        <p className="hero-description">From first drawings to the finishing touches, we build individual homes with clear prices and skilled hands on every detail.</p>
        <Button to="/contact" className="hero-action">Book a Consultation</Button>
      </div>
    </div>
  </section>
}

function NumberedItems({ items, className }) {
  const steps = className === 'process-grid'
  return <ol className={className}>
    {items.map(([title, description], i) => <li key={title} data-reveal={steps ? 'process' : true}>
      <span className="item-number" aria-hidden="true">0{i + 1}.</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </li>)}
  </ol>
}

function About() {
  return <section className="about" id="about">
    <div className="about-intro">
      <div>
        <h2 data-words>We create distinctive custom homes and thoughtful renovations, taking care of the design and construction from the first conversation to the keys.</h2>
        <Button to="/about" reveal>Learn More</Button>
      </div>
      <div className="about-aside">
        <p data-copy>Know the price before work starts. Work with the same team throughout construction. Get our commitment to quality in writing.</p>
        <dl className="about-stats flex justify-between">
          <div><dt><span data-count="25">25</span><sup>+</sup></dt><dd>Years of Custom Homebuilding</dd></div>
          <div><dt><span data-count="450">450</span><sup>+</sup></dt><dd>Homes Planned &amp; Built</dd></div>
        </dl>
      </div>
    </div>
    <div className="about-feature"><Image name="about.jpg" alt="Contemporary home beside a reflecting pool" /></div>
    <NumberedItems items={promises} className="promise-grid" />
  </section>
}

function Services() {
  return <>
    <section className="services" id="services">
      <SectionHeading title="What We Do" className="centered" />
      <Carousel label="Services" count={services.length} className="services-carousel">
        {services.map(([title, summary, image, slug]) => <PhotoCard key={slug} title={title} summary={summary} name={`service-${image}.jpg`} path={`/services/${slug}`} />)}
      </Carousel>
    </section>
    <section className="results">
      <Image name="stats.jpg" alt="Custom home at dusk" className="cover" />
      <div className="results-intro">
        <h2 data-words>Made With Care. Built to Stay.</h2>
        <p data-copy>Good design, clear pricing and a team that listens make for homes that feel right long after move-in.</p>
        <Button to="/blogs" reveal>View Our Work</Button>
      </div>
      <dl className="result-grid">
        {results.map(([number, text]) => <div key={number}><dt>{number}</dt><dd>{text}</dd></div>)}
      </dl>
    </section>
  </>
}

function Work() {
  return <section className="work" id="projects">
    <SectionHeading title="Homes We’ve Brought to Life" className="centered">Explore illustrative custom homes and renovations that show how design, engineering and construction can come together in one build.</SectionHeading>
    <div className="project-grid">
      {projects.map(([title, category, image, slug]) => <PhotoCard key={slug} title={title} summary={category} name={`project-${image}.jpg`} path={`/projects/${slug}`} reveal="project" />)}
    </div>
    <Button to="/projects">View All Projects</Button>
  </section>
}

function Process() {
  return <section className="process" id="process">
    <div className="process-heading">
      <SectionHeading title="How We Build" />
      <p data-copy>From our first meeting to the day you move in, you’ll know what comes next.</p>
    </div>
    <div className="process-layout">
      <Image name="process.jpg" alt="Timber-frame home being built on site" />
      <div className="process-steps">
        <span className="process-connector" aria-hidden="true" />
        <NumberedItems items={process} className="process-grid" />
      </div>
    </div>
  </section>
}

function Craft() {
  return <section className="craft">
    <Image name="craft.jpg" alt="Craftsman working timber on site" className="cover" />
    <SectionHeading title="One Team Designs and Builds Every Detail of Your Home" className="centered">The people who sketch your home stay with it through the final finish, so the details carry through to move-in day.</SectionHeading>
  </section>
}

function Team() {
  return <section className="team" id="team">
    <div className="shell">
      <div className="team-overview">
        <div className="team-intro">
          <SectionHeading title="The People Who Build Your Home" />
          <div className="team-description">
            <p data-copy>These illustrative portraits accompany the architects, builders and specialist roles that bring a custom home together.</p>
            <ul className="team-tags flex flex-wrap">{services.map(([name]) => <li key={name} data-reveal="team">{name}</li>)}</ul>
          </div>
        </div>
        <div className="team-crew-wrap" data-reveal="crew"><Image name="crew.jpg" alt="Construction crew reviewing plans on site" className="team-crew" /></div>
        <div className="team-values">
          {teamValues.map(([title, description]) => <div key={title} data-reveal="process"><h3>{title}</h3><p>{description}</p></div>)}
        </div>
      </div>
      <div className="team-grid">
        {team.map(([name, role, discipline, image]) => <article key={name} className="team-card" data-reveal="team">
          <div className="portrait"><Image name={`${image}.png`} alt={name} /><span>{discipline}</span></div>
          <h3>{name}</h3><p>{role}</p>
        </article>)}
        <div className="team-link" data-reveal><p>Meet the designers and builders at Dconstruct</p><Button to="/our-team">Meet The Team</Button></div>
      </div>
    </div>
  </section>
}

function Testimonials() {
  return <section className="testimonials" id="testimonials">
    <SectionHeading title="Stories From an Example Custom Build" className="centered" />
    <Carousel label="Testimonials" count={testimonials.length} loop className="quote-carousel">
      {testimonials.map(([quote, name, description, image]) => <figure className="quote-card" key={image}>
        <Image name={`${image}.jpg`} />
        <div><blockquote>“{quote}”</blockquote><figcaption><strong>{name}</strong><span>{description}</span></figcaption></div>
      </figure>)}
    </Carousel>
  </section>
}

function Consultation() {
  return <section className="consultation">
    <Image name="consult.jpg" alt="New home nearing completion" className="cover" />
    <div className="consultation-content">
      <div><h2 data-words>Let’s Make a Home That Lasts</h2>
        <p data-copy>Book a consultation to talk through the home you want. We’ll help you make the early decisions and guide the build through to completion.</p></div>
      <Button to="/contact" reveal>Book a Consultation</Button>
    </div>
  </section>
}

function Article({ entry, featured = false }) {
  const [title, description, category, author, avatar, photo, slug] = entry
  const path = `/blogs/${slug}`
  return <article className={`blog-card ${featured ? 'featured-article' : ''}`} data-reveal="article">
    <div className="blog-visual">
      <a className="blog-photo" href={path} aria-label={title}><Image name={`blog-${photo}.jpg`} /></a>
      <span className="category image-category">{category}</span>
    </div>
    <div className="blog-copy">
      <span className="category">{category}</span>
      <h3><a href={path}>{title}</a></h3>
      <p><a href={path}>{description}</a></p>
      <div className="blog-meta">
        <div className="byline"><Image name={`${avatar}.png`} /><span>{author}</span><span>•</span><time dateTime="2026-05-03">May 3, 2026</time></div>
        <a className="read-more" href={path}>Read More <Arrow /></a>
      </div>
    </div>
  </article>
}

function Blog() {
  return <section className="blog" id="blogs">
    <div className="blog-heading"><SectionHeading title="Notes From the Jobsite">Practical guidance from the studio and site to help you plan, design and build well.</SectionHeading>
      <Button to="/blogs" reveal>View All Blogs</Button></div>
    <div className="blog-grid">
      <Article entry={articles[0]} featured />
      <div className="blog-list">{articles.slice(1).map(entry => <Article entry={entry} key={entry[0]} />)}</div>
    </div>
  </section>
}

const footerIcons = {
  Instagram: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3ZM15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm1.125-4.875h.01',
  Facebook: 'M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Zm-5.25-3.75h-1.5A2.25 2.25 0 0 0 12 10.5V21m-3-7.5h6',
  LinkedIn: 'M3.75 3h16.5a.75.75 0 0 1 .75.75v16.5a.75.75 0 0 1-.75.75H3.75A.75.75 0 0 1 3 20.25V3.75A.75.75 0 0 1 3.75 3Zm4.5 7.5v6m0-8.625h.01m3 2.625v6m0-3.375a2.625 2.625 0 0 1 5.25 0V16.5',
  X: 'M8.25 16.5s-5.17-3-4.427-11.25c0 0 3.718 3.75 8.177 4.5v-1.5a3.75 3.75 0 0 1 7.188-1.5H22.5l-3 3a12.025 12.025 0 0 1-12 11.25c-3 0-3.75-1.125-3.75-1.125s3-1.125 4.5-3.375Z',
  address: 'M19.5 9.75c0 6.75-7.5 12-7.5 12s-7.5-5.25-7.5-12a7.5 7.5 0 0 1 15 0Zm-4.5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  email: 'M3 9v9.75c0 .414.336.75.75.75h16.5a.75.75 0 0 0 .75-.75V9l-9-6-9 6Zm0 0 7.364 5.25h3.273L21 9M3.25 19.25l7.114-5m3.273 0 7.113 5',
  phone: 'M15.412 13.625c.211-.14.478-.164.711-.064l4.421 1.981a.75.75 0 0 1 .45.778 4.5 4.5 0 0 1-4.494 3.93A12.75 12.75 0 0 1 3.75 7.5a4.5 4.5 0 0 1 3.93-4.495.75.75 0 0 1 .778.45l1.981 4.425a.75.75 0 0 1-.062.706l-2.003 2.382a.75.75 0 0 0-.051.733 10.6 10.6 0 0 0 4.008 3.976.75.75 0 0 0 .734-.056Z',
}

function FooterIcon({ name }) {
  return <svg className="footer-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={footerIcons[name]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

function Footer() {
  const [message, setMessage] = useState('')
  return <footer className="footer">
    <div className="shell">
      <div className="footer-grid">
        <div className="footer-brand"><Logo footer /><p>Custom homes designed and built with care, all the way from the drawing table to moving day.</p>
          <div className="social-links flex items-center">
            {['Instagram', 'Facebook', 'LinkedIn', 'X'].map(name => <a key={name} role="link" aria-disabled="true" aria-label={name}><FooterIcon name={name} /></a>)}
          </div>
        </div>
        <div className="footer-links"><h2>Quick Links</h2><a href="/about">About us</a><a href="/our-team">Our team</a><a href="/blogs">Blogs</a><a href="/contact">Contact</a></div>
        <div className="footer-links contact-links"><h2>Contact</h2>
          <address><FooterIcon name="address" />{contactDetails.address}</address>
          <a href={`mailto:${contactDetails.email}`}><FooterIcon name="email" />{contactDetails.email}</a>
          <a href={contactDetails.phoneHref}><FooterIcon name="phone" />{contactDetails.phone}</a>
        </div>
        <div className="newsletter"><h2>Stay Informed</h2>
          <form onSubmit={event => { event.preventDefault(); setMessage('Newsletter signup is unavailable in this preview.') }}>
            <input type="email" name="email" autoComplete="email" required aria-label="Newsletter email" placeholder="Enter your email here" />
            <button type="submit" className="action action-plain">Submit</button>
          </form>
          <p>Receive practical build advice, recent projects and design ideas in your inbox.</p>
          {message && <p role="status">{message}</p>}
        </div>
      </div>
      <div className="footer-legal flex items-center justify-between"><span>© {new Date().getFullYear()} Dconstruct Custom Homes. All rights reserved.</span><a href="/privacy-policy">Privacy Policy</a></div>
    </div>
  </footer>
}

export default function App() {
  const page = useRef(null)
  const { path, followLink } = useRoute()
  const [light, setLight] = useState(() => localStorage.getItem('ironwood-theme') === 'light')
  useEffect(() => {
    localStorage.setItem('ironwood-theme', light ? 'light' : 'dark')
    document.documentElement.style.colorScheme = light ? 'light' : 'dark'
  }, [light])
  useEffect(() => { document.title = pageTitle(path) }, [path])
  usePageMotion(page, path)

  return <div ref={page} className={`page${path === '/' ? '' : ' inner-page'}`} data-theme={light ? 'light' : 'dark'} onClick={followLink}>
    <Header key={`header:${path}`} path={path} light={light} onTheme={() => setLight(value => !value)} />
    <main key={path} tabIndex={-1}>{path === '/' ? <>
      <Hero />
      <div className="grid-background"><div className="shell"><About /><Services /><Work /><Process /></div></div>
      <Craft />
      <Team />
      <div className="grid-background"><div className="shell"><Testimonials /><Consultation /><Blog /></div></div>
    </> : <RoutedPages path={path} />}</main>
    <Footer />
  </div>
}
