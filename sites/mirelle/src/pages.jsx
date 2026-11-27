import { Fragment, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { about, projects } from './portfolio.json'
import { Rollover } from './rollover'

gsap.registerPlugin(CustomEase, ScrollTrigger, Flip)

const asset = (file) => `${import.meta.env.BASE_URL}media/${file}`
const projectBySlug = new Map(projects.map(project => [project.slug, project]))
const categories = ['All', 'Brand Identity', 'Art Direction', 'Editorial Design']
const footerLines = ['make something.', 'talk design.', 'work together.', 'get started.']
export const studioEmail = 'hello@decodestudio.example'
const caseCoverWipe = CustomEase.create('case-cover-wipe', 'M0,0 C0.08,0.02 0.15,0.16 0.23,0.43 C0.32,0.73 0.41,0.88 0.53,0.94 C0.67,0.99 0.82,1 1,1')

function Image({ image, priority = false, ...props }) {
  return <img src={asset(image.file)} alt={image.alt} loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : undefined} {...props} />
}

function Words({ children, as: Tag, className, reveal = false, letters = false }) {
  const words = children.split(' ')
  return (
    <Tag className={className} aria-label={children} data-words data-scroll-words={reveal ? '' : undefined}>
      {words.map((word, index) => (
        <Fragment key={index}>
          <span aria-hidden="true">
            {letters ? [...word].map((letter, position) => <span key={position}>{letter}</span>) : <span>{word}</span>}
          </span>{index < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  )
}

function usePageMotion(page) {
  useGSAP(() => {
    const screens = gsap.matchMedia()
    const root = page.current

    screens.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = root.querySelector('[data-hero]')
      if (hero?.matches('.case-hero')) {
        const entrance = gsap.timeline({ delay: 0.135 })
        entrance.addLabel('title', 0.38)
          .addLabel('details', 'title+=0.12')
          .addLabel('cover', 'details+=0.32')
          .from(hero.querySelectorAll('h1 [aria-hidden] > span'), {
            opacity: 0, y: 40, duration: 1.6, stagger: 0.045, ease: 'expo.out',
          }, 'title')
          .from(hero.querySelectorAll('p[data-words] [aria-hidden] > span'), {
            opacity: 0, y: 40, duration: 1.48, stagger: { amount: 0.18 }, ease: 'expo.out',
          }, 'details+=0.03')
          .from(hero.querySelectorAll('.all-works, .case-intro dl'), {
            opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
          }, 'details')
          .from(hero.querySelector('.case-cover'), {
            opacity: 0.55, scale: 1.3, duration: 0.85, ease: 'power3.out',
          }, 'cover')
          .fromTo(hero.querySelector('.case-cover-wrap'), { clipPath: 'inset(0 100% 0 0)' }, {
            clipPath: 'inset(0 0% 0 0)', duration: 0.68, ease: caseCoverWipe,
          }, 'cover')
      } else if (hero) {
        gsap.from(hero.querySelectorAll('h1[data-words] [aria-hidden] > span'), {
          opacity: 0, y: 80, duration: 1.28, stagger: { amount: 0.26 }, ease: 'expo.out', delay: 0.05,
        })
      }

      root.querySelectorAll('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          opacity: 0, y: 40, duration: 1.05, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        })
      })
      root.querySelectorAll('[data-scroll-words]').forEach((element) => {
        gsap.from(element.querySelectorAll('[aria-hidden] > span'), {
          opacity: 0, y: 40, duration: 1.13, stagger: { amount: 0.27 }, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        })
      })
      root.querySelectorAll('.experience-rule, .footer-rule').forEach((line) => {
        gsap.from(line, {
          scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: line, start: 'top 90%', once: true },
        })
      })
      const summary = root.querySelector('.case-summary')
      if (summary) {
        const words = [...summary.querySelectorAll('[data-summary-word]')]
        let lit = 0
        summary.setAttribute('data-scroll-motion', '')
        const colorWords = ({ progress }) => {
          const next = Math.round(words.length * progress)
          for (let index = Math.min(lit, next); index < Math.max(lit, next); index++) {
            words[index].toggleAttribute('data-lit', index < next)
          }
          lit = next
        }
        ScrollTrigger.create({
          trigger: summary, start: 'top 86%', end: 'top top-=40', onUpdate: colorWords, onRefresh: colorWords,
        })
      }
      if (root.matches('.about-page')) {
        const updateTheme = ({ isActive }) => root.toggleAttribute('data-dark', isActive)
        ScrollTrigger.create({
          trigger: root.querySelector('.experience'), start: 'top top',
          endTrigger: root.querySelector('.trust'), end: 'top 18%', onToggle: updateTheme, onRefresh: updateTheme,
        })
      }
      root.querySelectorAll('.about-intro-image img').forEach((image) => {
        gsap.to(image, {
          yPercent: 22, ease: 'none',
          scrollTrigger: { trigger: root.querySelector('.about-intro'), start: 'top 66%', end: 'bottom top', scrub: true },
        })
      })
      const counters = [...root.querySelectorAll('[data-count]')].map((element) => {
        const end = element.textContent
        const counter = { value: Number(element.dataset.count) }
        gsap.to(counter, {
          value: Number.parseInt(end, 10), snap: 'value', duration: 1.05, ease: 'power2.out',
          onUpdate: () => { element.textContent = end.replace(/^\d+/, counter.value) },
          scrollTrigger: { trigger: element, start: 'top 96%', once: true },
        })
        return [element, end]
      })
      return () => {
        counters.forEach(([element, value]) => { element.textContent = value })
        summary?.removeAttribute('data-scroll-motion')
        summary?.querySelectorAll('[data-lit]').forEach(word => word.removeAttribute('data-lit'))
        root.removeAttribute('data-dark')
      }
    })

    return () => screens.revert()
  }, { scope: page })
}

function Footer() {
  const footer = useRef(null)
  usePageMotion(footer)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const labels = [...footer.current.querySelectorAll('.footer-phrase > span')]
      const loop = gsap.timeline({ repeat: -1, paused: true })
      labels.forEach((current, index) => {
        const next = labels[(index + 1) % labels.length]
        const at = 2.4 * (index + 1)
        loop.to(current, { yPercent: -100, opacity: 0, duration: 0.4, ease: 'power2.inOut' }, at)
        loop.fromTo(next, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out', immediateRender: false }, at + 0.04)
      })
      let inView = false
      const onVisibility = () => loop.paused(!inView || document.hidden)
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting
        onVisibility()
      })
      observer.observe(footer.current)
      document.addEventListener('visibilitychange', onVisibility)
      return () => {
        observer.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
      }
    })
    return () => media.revert()
  }, { scope: footer })

  return (
    <footer className="site-footer page-gutters" ref={footer}>
      <h2 aria-label={`Let's ${footerLines[0]}`} data-reveal>Let's <span className="footer-phrase" aria-hidden="true">
        {footerLines.map(line => <span key={line}>{line}</span>)}
      </span></h2>
      <p data-reveal>A small practice for identity and print.<br />Open to independent projects.</p>
      <div className="footer-details">
        <div className="footer-contact">
          <a href={`mailto:${studioEmail}`} className="rollover-link" aria-label={studioEmail} data-reveal>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.8 12 3l9 6.8V21H3V9.8Zm0 .2 9 6 9-6M3 21l6-7m12 7-6-7" /></svg>
            <Rollover>{studioEmail}</Rollover>
          </a>
          <a href="tel:+14155550148" className="rollover-link" aria-label="415-555-0148" data-reveal>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.4 3.5 8 3l2.4 4-2.2 2.1c1.1 3 3.5 5.4 6.5 6.6l2.1-2.2 4.1 2.3-.4 2.6a2.5 2.5 0 0 1-2.8 2C10 19.4 4.7 14 3.6 6.3a2.5 2.5 0 0 1 1.8-2.8ZM14 4a6 6 0 0 1 6 6m-6-3a3 3 0 0 1 3 3" /></svg>
            <Rollover>415-555-0148</Rollover>
          </a>
        </div>
        <div className="footer-social">
          <address data-reveal>Independent design studio<br />Working across time zones</address>
          <a href="/works" className="rollover-link" aria-label="Project archive"><span className="footer-rule" aria-hidden="true" /><Rollover>Project archive</Rollover><span className="footer-arrow" aria-hidden="true">↗</span></a>
          <a href="/photo-credits.txt" target="_blank" rel="noreferrer" className="rollover-link" aria-label="Photo credits"><span className="footer-rule" aria-hidden="true" /><Rollover>Photo credits</Rollover><span className="footer-arrow" aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="footer-legal"><p>decodestudio © 2026</p><p>Concept portfolio</p></div>
    </footer>
  )
}

function WorkCard({ project, eager = false }) {
  const card = useRef(null)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const frame = card.current.querySelector('.work-card-image')
      const picture = frame.querySelector('.work-image-reveal')
      const caption = card.current.querySelector('.work-card-caption')
      const wipe = gsap.timeline({ paused: true })
      wipe.fromTo(picture, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.12, ease: 'expo.out' }, 0.13)
      wipe.from(caption, { opacity: 0, y: 20, duration: 0.69, ease: 'power3.out' }, 0.10)
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        wipe.play()
      }, { rootMargin: '0px 0px -78px 0px' })
      observer.observe(frame)
      return () => observer.disconnect()
    })
    return () => media.revert()
  }, { scope: card })

  const updatePosition = (event) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`)
    card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`)
  }

  return (
    <a ref={card} className="work-card" data-category={project.category} href={`/works/${project.slug}`} onPointerMove={updatePosition}>
      <div className="work-card-image">
        <div className="work-image-reveal"><Image image={project.cover} loading={eager ? 'eager' : 'lazy'} /></div>
      </div>
      <div className="work-card-caption">
        <h3>{project.title}</h3>
        <p>{project.category}<span aria-hidden="true"> · </span>{project.year}</p>
      </div>
      <span className="work-card-view" aria-hidden="true">View</span>
    </a>
  )
}

export function WorksPage() {
  const page = useRef(null)
  const grid = useRef(null)
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState('All')
  const filtering = useRef(null)
  const visible = category === 'All' ? projects : projects.filter(project => project.category === category)
  usePageMotion(page)

  const { contextSafe } = useGSAP(() => {
    const screens = gsap.matchMedia()
    screens.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.works-grid', { opacity: 0, y: 80, duration: 1.15, ease: 'expo.out' })
      gsap.from('.works-filters button', { opacity: 0, y: 24, duration: 0.7, stagger: 0.065, ease: 'power3.out' })
      gsap.from('.works-heading [aria-hidden] > span', { opacity: 0, y: 40, duration: 0.88, stagger: 0.09, ease: 'expo.out' })
    })
    return () => screens.revert()
  }, { scope: page })

  const selectCategory = contextSafe((next) => {
    if (next === selected) return
    filtering.current?.kill()
    setSelected(next)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCategory(next)
      return
    }

    const cards = [...grid.current.children]
    const survives = card => next === 'All' || card.dataset.category === next
    Flip.killFlipsOf(cards)
    const kept = cards.filter(survives)
    const exiting = cards.filter(card => !survives(card))
    if (kept.length) gsap.to(kept, { opacity: 1, y: 0, duration: 0.2, overwrite: 'auto' })
    const commit = contextSafe(() => {
      const positions = kept.length ? Flip.getState(kept) : null
      flushSync(() => setCategory(next))
      ScrollTrigger.refresh()
      if (positions) Flip.from(positions, { duration: 0.66, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() })
    })
    if (exiting.length) filtering.current = gsap.to(exiting, { opacity: 0, y: 20, duration: 0.53, ease: 'power2.inOut', overwrite: 'auto', onComplete: commit })
    else commit()
  })

  return (
    <>
      <main ref={page} className="works-page page-gutters">
        <Words as="h1" className="works-heading">Selected Works</Words>
        <div className="works-layout">
          <div className="works-filter-wrap">
            <div className="works-filters" role="group" aria-label="Filter works">
              {categories.map(item => (
                <button type="button" aria-pressed={selected === item} key={item} onClick={() => selectCategory(item)}>
                  {item}<sup>({item === 'All' ? projects.length : projects.filter(project => project.category === item).length})</sup>
                </button>
              ))}
            </div>
          </div>
          <div className="works-grid" ref={grid}>
            {visible.map((project, index) => <WorkCard key={project.slug} project={project} eager={index < 4} />)}
          </div>
          <span className="sr-only" role="status">{visible.length} projects</span>
        </div>
      </main>
      <Footer />
    </>
  )
}

export function CaseStudy({ project }) {
  const page = useRef(null)
  usePageMotion(page)

  return (
    <>
      <main className="case-page" ref={page}>
        <header className="case-hero page-gutters" data-hero>
          <div className="case-cover-wrap"><Image image={project.cover} priority className="case-cover" /></div>
          <div className="case-hero-content">
            <a className="all-works rollover-link" href="/works" aria-label="All Works">
              <span className="back-arrow" aria-hidden="true">←</span> <Rollover>All Works</Rollover>
            </a>
            <div className="case-intro">
              <Words as="h1">{project.title}</Words>
              <Words as="p" letters>{project.description}</Words>
              <dl>
                <div><dt>Year</dt><dd>{project.year}</dd></div>
                <div><dt>Type</dt><dd>{project.category}</dd></div>
              </dl>
            </div>
          </div>
        </header>
        <section className="case-summary page-gutters">
          <div>{project.summary.split(/\n\s*\n/).map(paragraph => (
            <p key={paragraph}>{paragraph.split(/\s+/).map((word, index) => (
              <Fragment key={index}>{index > 0 && ' '}<span data-summary-word>{word}</span></Fragment>
            ))}</p>
          ))}</div>
        </section>
        {project.sections.map(section => (
          <section key={section.title} className="case-story page-gutters">
            <div className="case-story-copy">
              <Words as="h2" reveal>{section.title}</Words>
              <div className="case-story-paragraphs" data-reveal>
                {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
            <div className="case-images" data-layout={section.layout}>
              {section.images.map((image, index) => (
                <div key={`${image.file}-${index}`} data-reveal><Image image={image} /></div>
              ))}
            </div>
          </section>
        ))}
        <section className="case-related page-gutters">
          <header>
            <Words as="h2" reveal>From the archive.</Words>
            <p data-reveal>Two more concept studies, each shaped by its own material, audience and way of being used.</p>
          </header>
          <div className="related-grid">
            {project.related.map(slug => <WorkCard key={slug} project={projectBySlug.get(slug)} />)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Experience() {
  const [expanded, setExpanded] = useState(() => new Set([0]))

  useEffect(() => {
    const timeout = window.setTimeout(() => ScrollTrigger.refresh(), 350)
    return () => window.clearTimeout(timeout)
  }, [expanded])

  return (
    <section className="experience page-gutters" aria-labelledby="experience-title">
      <header id="experience-title">
        <Words as="h2" reveal>{about.experienceHeading}</Words>
        <p data-reveal>{about.experienceIntro}</p>
      </header>
      <div className="experience-list">
        {about.experience.map(([role, description, company, location, period], index) => (
          <div className="experience-row" key={role} data-expanded={expanded.has(index)}>
            <span className="experience-rule" aria-hidden="true" />
            <button type="button" aria-expanded={expanded.has(index)} aria-controls={`experience-${index}`} data-reveal
              onClick={() => setExpanded(previous => {
                const next = new Set(previous)
                if (next.has(index)) next.delete(index)
                else next.add(index)
                return next
              })}>
              <span className="experience-role"><span className="experience-plus" aria-hidden="true">+</span>{role}</span>
              <span>{company}</span><span className="experience-desktop-meta">{location}</span><span className="experience-desktop-meta">{period}</span>
            </button>
            <div className="experience-description" id={`experience-${index}`} aria-hidden={!expanded.has(index)}>
              <div><p>{description}</p><p className="experience-mobile-meta">{location}<br />{period}</p></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Services() {
  const scope = useRef(null)
  const clip = useRef(null)
  const rail = useRef(null)

  useGSAP(() => {
    const screens = gsap.matchMedia()
    screens.add('(width >= 810px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => (rail.current.scrollWidth - clip.current.clientWidth) * 0.705
      gsap.to(rail.current, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: scope.current, start: 'top top', end: () => `+=${distance()}`,
          pin: true, scrub: 0.48, invalidateOnRefresh: true,
        },
      })
    })
    return () => screens.revert()
  }, { scope })

  return (
    <section className="services page-gutters" ref={scope} aria-label="Services">
      <div className="services-clip" ref={clip}>
        <div className="services-rail" ref={rail}>
          {about.services.map((service, index) => (
            <article className="service-card" key={service.title}>
              <Image image={service.image} />
              <div className="service-copy">
                <div>
                  <h3><span>{String(index + 1).padStart(2, '0')}.</span> {service.title}</h3>
                  <ul>{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
                </div>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
          <figure className="service-closing"><Image image={about.servicesEnd} /></figure>
        </div>
      </div>
    </section>
  )
}

function ProjectNotes() {
  const list = useRef(null)
  const [offset, setOffset] = useState(0)
  const [atEnd, setAtEnd] = useState(false)
  const scrollTarget = useRef(null)

  useEffect(() => {
    const track = list.current
    let timeout
    function sync() {
      scrollTarget.current = null
      const slides = [...track.children]
      const origin = slides[0].offsetLeft
      const index = slides.findIndex(slide => slide.offsetLeft - origin + slide.offsetWidth > track.scrollLeft + 2)
      setOffset(Math.max(index, 0))
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2)
    }
    const onScroll = () => {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(sync, 130)
    }
    const observer = new ResizeObserver(sync)
    observer.observe(track)
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.clearTimeout(timeout)
      track.removeEventListener('scroll', onScroll)
    }
  }, [])

  function scroll(direction) {
    const track = list.current
    const current = scrollTarget.current ?? track.scrollLeft
    const origin = track.children[0].offsetLeft
    const maximum = track.scrollWidth - track.clientWidth
    const positions = [...new Set([...track.children].map(slide => Math.min(maximum, slide.offsetLeft - origin)))].sort((a, b) => a - b)
    const next = direction > 0 ? positions.find(pos => pos > current + 3) : positions.findLast(pos => pos < current - 3)
    if (next === undefined) return
    scrollTarget.current = next
    track.scrollTo({ left: next, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return (
    <section className="trust page-gutters" aria-labelledby="trust-title">
      <header id="trust-title">
        <div><Words as="h2" reveal>{about.trustHeading}</Words><p data-reveal>{about.trustIntro}</p></div>
        <dl className="trust-stats" data-reveal>
          <div><dt>Studies in the Archive</dt><dd data-count="0">{projects.length}</dd></div>
          <div><dt>Design Disciplines</dt><dd data-count="0">{categories.length - 1}</dd></div>
        </dl>
      </header>
      <div className="testimonials" role="region" aria-roledescription="carousel" aria-label="Project notes" data-reveal>
        <div className="testimonial-controls">
          <button type="button" aria-label="Previous" aria-disabled={offset === 0} onClick={() => scroll(-1)}>‹</button>
          <button type="button" aria-label="Next" aria-disabled={atEnd} onClick={() => scroll(1)}>›</button>
        </div>
        <ul className="testimonial-track" ref={list} tabIndex={0}>
          {about.projectNotes.map((note, index) => (
            <li key={note.project} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${about.projectNotes.length}`}>
              <p className="project-note">{note.text}</p>
              <div className="testimonial-author">
                <div><p>{note.project}</p><p>{note.scope}</p></div>
                <Image image={note.image} />
              </div>
            </li>
          ))}
        </ul>
        <span className="sr-only" role="status">Project note {offset + 1} of {about.projectNotes.length}</span>
      </div>
    </section>
  )
}

export function AboutPage() {
  const page = useRef(null)
  usePageMotion(page)

  return (
    <>
      <main className="about-page" ref={page}>
        <section className="about-hero page-gutters" data-hero>
          <Words as="h1" letters>{about.heading}</Words>
          <div className="about-intro">
            <div className="about-intro-copy" data-reveal>{about.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
            {about.introImages.map(image => <div className="about-intro-image" key={image.file} data-reveal><Image image={image} priority /></div>)}
          </div>
        </section>
        <Experience />
        <Services />
        <ProjectNotes />
        <section className="about-closing page-gutters" aria-label="Studio imagery">
          {about.closingImages.map(image => <div key={image.file} data-reveal><Image image={image} /></div>)}
        </section>
      </main>
      <Footer />
    </>
  )
}
