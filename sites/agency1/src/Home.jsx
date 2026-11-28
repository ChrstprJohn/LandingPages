import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { customers, posts, process, projects, questions, services, studioCopy, testimonials } from './content.js'
import { Action, ContactBanner, Grain, Icon, Media, StudioFilm, WordReveal } from './ui.jsx'
import { useProjectMotion } from './motion.js'

const wrap = (index, length) => (index + length) % length
const slideNumber = (index) => String(index + 1).padStart(2, '0')
const introLabels = ['DESIGNED TO ENDURE.', 'WRITTEN TO RESONATE.', 'CONSIDERED IN EVERY DETAIL.']

function HeroService() {
  const shell = useRef(null)
  const body = useRef(null)
  const mounted = useRef(false)
  const [index, setIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(true)
  const rotating = playing && !hover && visible

  const move = (direction) => setIndex((value) => wrap(value + direction, services.length))

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(shell.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!rotating) return
    const timer = window.setTimeout(() => {
      if (!document.hidden) move(1)
    }, 3800)
    const resume = () => {
      if (!document.hidden) move(1)
    }
    document.addEventListener('visibilitychange', resume)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', resume)
    }
  }, [index, rotating])

  useGSAP(() => {
    if (mounted.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.timeline()
        .to(body.current, { autoAlpha: 0, y: -4, duration: .15, ease: 'power2.in' })
        .add(() => setDisplayIndex(index))
        .set(body.current, { y: 6 })
        .to(body.current, { autoAlpha: 1, y: 0, duration: .26, ease: 'power2.out', clearProps: 'all' })
    } else {
      setDisplayIndex(index)
    }
    mounted.current = true
  }, { scope: shell, dependencies: [index], revertOnUpdate: true })

  const service = services[displayIndex]
  return (
    <section ref={shell} className="hero-service" aria-label="Studio services" aria-roledescription="carousel"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocusCapture={(event) => { if (event.target.matches(':focus-visible')) setPlaying(false) }}>
      <div className="hero-service-progress" aria-hidden="true">
        <span key={index} style={{ '--progress-start': index / services.length, '--progress-end': (index + 1) / services.length, animationPlayState: rotating ? 'running' : 'paused' }} />
      </div>
      <div className="hero-service-controls flex items-center justify-between">
        <div className="flex items-center">
          <button type="button" onClick={() => move(-1)} aria-label="Previous service"><Icon name="left" size={12} /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next service"><Icon name="right" size={12} /></button>
        </div>
        <button type="button" className="carousel-rotation" onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? 'Pause service rotation' : 'Start service rotation'}
          title={playing ? 'Pause service rotation' : 'Start service rotation'}>{slideNumber(index)}/04</button>
      </div>
      <div ref={body} className="hero-service-copy" aria-live={rotating ? 'off' : 'polite'}>
        <h3>{service.title}</h3>
        <p>{service.summary}</p>
      </div>
    </section>
  )
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-picture">
        <Media name="hero" alt="Colorful portrait of a young woman" eager />
      </div>
      <Grain strength="grain--hero" />
      <div className="hero-frame gutters">
        <div className="hero-title-size">
          <h1 id="hero-heading" className="hero-title" data-hero-title>Aldena Studio</h1>
          <canvas className="hero-letters" aria-hidden="true" />
          <canvas className="hero-letters hero-letters--pointer" aria-hidden="true" />
        </div>
        <div className="hero-bottom">
          <div className="hero-agency">
            <h2>Creative Agency</h2>
            <p>{introLabels.map((line) => <span key={line}>{line}</span>)}</p>
          </div>
          <HeroService />
        </div>
      </div>
    </section>
  )
}

export function StudioIntro() {
  const film = useRef(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const element = film.current
      const tiltX = gsap.quickTo(element, 'rotationX', { duration: 0.45, ease: 'power3' })
      const tiltY = gsap.quickTo(element, 'rotationY', { duration: 0.45, ease: 'power3' })
      function tilt(event) {
        const bounds = element.parentElement.getBoundingClientRect()
        tiltX((0.5 - (event.clientY - bounds.top) / bounds.height) * 14)
        tiltY(((event.clientX - bounds.left) / bounds.width - 0.5) * 14)
      }
      function reset() { tiltX(0); tiltY(0) }
      const area = element.parentElement
      area.addEventListener('pointermove', tilt)
      area.addEventListener('pointerleave', reset)
      return () => { area.removeEventListener('pointermove', tilt); area.removeEventListener('pointerleave', reset) }
    })
    return () => media.revert()
  }, { scope: film })

  return (
    <section className="studio-intro gutters" aria-label="About Aldena">
      <div className="intro-side">
        <div className="intro-film-perspective">
          <div className="intro-film" ref={film}>
            <StudioFilm />
            <Grain />
            <span>Aldena</span>
          </div>
        </div>
        <Action href="/about" light>MORE ABOUT US</Action>
      </div>
      <div className="founder-card">
        <div className="founder-copy" data-text-reveal data-reveal>
          {studioCopy.map((paragraph) => <WordReveal key={paragraph} as="p">{paragraph}</WordReveal>)}
        </div>
        <div className="founder-byline" data-reveal>
          <Media name="founder" alt="Aldena Rhodes" />
          <div><strong>Aldena Rhodes</strong><span>Founder &amp; Creative Director</span></div>
        </div>
      </div>
    </section>
  )
}

export function ProjectPanels({ entries = projects }) {
  const scope = useRef(null)
  useProjectMotion(scope, entries)

  return (
    <section ref={scope} className="project-panels" aria-label="Selected works">
      {entries.map((project) => (
        <a className="project-panel" href={'/work/' + project.slug} key={project.slug} aria-label={project.title + ' case study'}>
          <Media className="project-bg" name={project.background || project.image + '-bg'} />
          <div className="project-type" aria-hidden="true">
            {[0, 1, 2].map((item) => <span key={item}>{project.title}</span>)}
          </div>
          <div className="project-content">
            <div className="project-thumb">
              <div className="project-image-window"><Media name={project.image} alt={project.title + ' project thumbnail'} /></div>
            </div>
            <div className="project-meta">
              <div><h2>{project.title}</h2><p>{project.summary}</p></div>
              <span>{project.year}</span>
            </div>
          </div>
          <Grain />
        </a>
      ))}
    </section>
  )
}

function Services() {
  const [index, setIndex] = useState(0)
  const start = useRef(null)
  const move = (direction) => setIndex((value) => wrap(value + direction, services.length))

  return (
    <section className="services" aria-label="What we offer">
      <div className="service-mobile-intro gutters">
        <h2 data-reveal>What we offer</h2>
        <p data-reveal>A focused set of brand, web, and digital design services shaped to elevate your presence.</p>
      </div>
      <div className="service-carousel" data-reveal="carousel" onPointerDown={(event) => {
        if (!event.target.closest('button')) {
          start.current = event.clientX
          event.currentTarget.setPointerCapture(event.pointerId)
        }
      }} onPointerCancel={() => { start.current = null }} onPointerUp={(event) => {
        if (start.current !== null && Math.abs(event.clientX - start.current) > 50) move(event.clientX < start.current ? 1 : -1)
        start.current = null
      }} onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault()
          move(event.key === 'ArrowRight' ? 1 : -1)
        }
      }}>
        {services.map((service, i) => {
          const distance = wrap(i - index, services.length)
          const offset = distance === services.length - 1 ? -1 : distance
          return (
            <article className="service-card" key={service.title} data-offset={offset} style={{ '--offset': offset }}>
              <div className="service-copy">
                <div>
                  <div data-reveal="edge">
                    <span className="smallcaps service-kicker">WHAT WE OFFER</span>
                    <h3>{service.title}</h3>
                  </div>
                  <p data-reveal="edge">{service.detail}</p>
                </div>
                <div className="service-price" data-reveal="edge"><span className="smallcaps">STARTING AT</span><strong>{service.price}</strong></div>
              </div>
              <div className="service-art" tabIndex={offset === 0 ? 0 : undefined} aria-label={service.title + ' artwork'}>
                <Media name={service.image + '-bg'} className="service-background" alt="Service card background" />
                <Media name={service.image} className="service-inset" />
                <span className="service-number smallcaps">SERVICE {slideNumber(i)}</span>
                <Grain />
              </div>
            </article>
          )
        })}
        <div className="service-controls" aria-label="Slideshow pagination controls">
          <button type="button" aria-label="Previous" onClick={() => move(-1)}><Media name="back-arrow.png" /><span className="sr-only">Previous</span></button>
          <button type="button" aria-label="Next" onClick={() => move(1)}><Media name="next-arrow.png" /><span className="sr-only">Next</span></button>
        </div>
      </div>
    </section>
  )
}

function DisclosureList({ type }) {
  const isProcess = type === 'process'
  const entries = isProcess ? process : questions
  const [open, setOpen] = useState([0])

  const select = (index) => setOpen((current) => {
    if (isProcess) return current.includes(index) ? current : [index]
    return current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
  })

  return (
    <div className={type + '-rows'} onTransitionEnd={(event) => {
      if (event.propertyName === 'grid-template-rows') ScrollTrigger.refresh()
    }}>
      {entries.map(([title, value, detail], index) => {
        const expanded = open.includes(index)
        return <div className={type + '-row'} key={title} data-open={expanded}
          onPointerEnter={isProcess ? (event) => {
            if (event.pointerType === 'mouse') select(index)
          } : undefined}>
          <div data-reveal={isProcess ? undefined : ''}>
            <h3>
              <button type="button" aria-expanded={expanded} aria-controls={type + '-' + index}
                onClick={() => select(index)}>
                {isProcess && <span className="process-index smallcaps">{String(index + 1).padStart(3, '0')}</span>}
                <span className="row-title">{title}</span>
                {isProcess ? <span className="process-duration smallcaps">{value}</span> : <Icon name="plus" size={20} />}
              </button>
            </h3>
            <div className="disclosure-body" id={type + '-' + index} aria-hidden={!expanded} inert={!expanded}>
              <div><p>{isProcess ? detail : value}</p></div>
            </div>
          </div>
          <span className="disclosure-divider" aria-hidden="true" />
        </div>
      })}
    </div>
  )
}

function ProcessSection() {
  return (
    <section className="process gutters" aria-labelledby="process-title">
      <WordReveal as="h2" className="section-title process-title" id="process-title" data-heading-reveal>A refined process built on clarity.</WordReveal>
      <DisclosureList type="process" />
    </section>
  )
}

function LogoStrip() {
  return (
    <div className="logo-strip" aria-label="Some of our clients">
      <Grain />
      <div className="logo-entrance" data-ticker-reveal>
        <div className="logo-track">
          {[0, 1, 2, 3].map((copy) => (
            <div className="logo-group" key={copy} aria-hidden={copy > 0 ? true : undefined}>
              {customers.map(([label, file, width]) => <img alt={copy === 0 ? label + ' logo' : ''} src={'/media/' + file + '.png'} width={Math.round(width * .375)} height="36" key={file} loading="lazy" />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Testimonials() {
  return (
    <section className="testimonials" aria-label="Hear from our clients">
      <div className="testimonials-stage gutters">
        <h2 className="testimonial-mobile-title section-title">Hear from our clients</h2>
        <div className="testimonial-cards">
          {testimonials.map(({ name, role, quote, image, project }, index) => (
            <figure className="testimonial-card" style={{ '--card-index': index, zIndex: testimonials.length - index }} key={name}>
              <blockquote><span aria-hidden="true">”</span><p>{quote}</p></blockquote>
              <figcaption>
                <div><strong>{name}</strong><span>{role}</span></div>
                <Media name={image} alt="Client portrait" />
              </figcaption>
              <span className="testimonial-project smallcaps">{project}</span>
            </figure>
          ))}
        </div>
        <div className="testimonials-label smallcaps"><span>HEAR FROM OUR CLIENTS</span><span className="active-testimonial-project">{testimonials[0].project}</span></div>
      </div>
    </section>
  )
}

export function FaqSection() {
  return (
    <section className="faq gutters" aria-labelledby="faq-title">
      <div className="section-intro">
        <WordReveal as="h2" className="section-title" id="faq-title" data-heading-reveal>Your questions, answered.</WordReveal>
        <p data-reveal>A quick rundown of how we work and what to expect.</p>
      </div>
      <div className="faq-columns">
        <DisclosureList type="faq" />
        <aside className="faq-aside" data-reveal>
          <div className="faq-picture"><Media name="faq-portrait" /><Grain /></div>
          <div className="faq-cta"><p>Still looking for answers or need a good chat?</p><Action href="/contact">CONTACT US</Action></div>
        </aside>
      </div>
    </section>
  )
}

export function PostCards({ entries = posts, reveal = 'grid' }) {
  return (
    <div className="post-grid" data-reveal={reveal}>
      {entries.map((post) => (
        <a className="post-card" href={'/blog/' + post.slug} key={post.slug}>
          <div className="post-image">
            <Media name={post.image} alt={'Cover image for “' + post.title + '”'} />
            <Grain />
            <div className="post-label smallcaps"><span>{post.category}</span><span>{post.date}</span></div>
            <span className="post-description">{post.summary}</span>
          </div>
          <h3 className="post-title">{post.title}</h3>
        </a>
      ))}
    </div>
  )
}

function BlogSection() {
  return (
    <section className="journal gutters" aria-labelledby="journal-title">
      <div className="section-intro journal-intro">
        <WordReveal as="h2" className="section-title" id="journal-title" data-heading-reveal>From the studio.</WordReveal>
        <p data-reveal="edge">Essays, notes, and perspectives on brand, design, and the craft of telling better stories.</p>
      </div>
      <PostCards reveal="journal" />
      <div className="journal-action"><Action href="/blog">READ MORE</Action></div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <StudioIntro />
      <ProjectPanels />
      <Services />
      <ProcessSection />
      <LogoStrip />
      <Testimonials />
      <FaqSection />
      <BlogSection />
      <ContactBanner />
    </>
  )
}
