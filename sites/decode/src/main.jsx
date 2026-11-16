import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import content from './content.json'
import './styles.css'

const path = location.pathname.replace(/\/$/, '') || '/'
const group = path.split('/')[1]
const navLinks = [['Home', '/'], ['About', '/about'], ['Services', '/services'], ['Projects', '/projects'], ['Blog', '/blog']]
const media = file => '/' + file
const entries = page => Object.entries(content[page].cards)
const socials = [['𝕏', 'X', 'https://x.com/'], ['in', 'LinkedIn', 'https://www.linkedin.com/'], ['◎', 'Instagram', 'https://www.instagram.com/']]

function Image({ file, alt = '', eager = false, ...props }) {
  return <img {...props} src={media(file)} alt={alt} loading={eager ? 'eager' : 'lazy'} />
}

function Label({ children, href, variant = '' }) {
  return <a className={'cta ' + variant} href={href}><span>{children}</span><span aria-hidden="true"><i className="cta-arrow" /></span></a>
}

function Logo() {
  return <a className="brand" href="/" aria-label="Decode home"><Image file="ui/decode-building.svg" eager />Decode</a>
}

function Header() {
  const [open, setOpen] = useState(false)
  const trigger = useRef(null)
  return <header className={path === '/' ? 'site-header over-hero' : 'site-header'} onKeyDown={event => {
    if (event.key === 'Escape' && open) {
      setOpen(false)
      trigger.current.focus()
    }
  }}>
    <div className="navigation">
      <Logo />
      <button ref={trigger} className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
        <span aria-hidden="true" />
      </button>
      <nav id="primary-navigation" className={open ? 'primary open' : 'primary'} aria-label="Primary">
        {navLinks.map(([name, href]) => <a key={href} href={href} aria-current={path === href ? 'page' : undefined} className={href === '/' + group ? 'current' : undefined}>{name}</a>)}
        <Label href="/contact" variant="outline">Contact us</Label>
      </nav>
    </div>
  </header>
}

function Footer() {
  return <footer className="footer shell">
    <div className="footer-top">
      <div className="footer-brand"><Logo /><p>Building safe, sustainable and lasting spaces for homes, businesses and communities since 1998.</p></div>
      <div className="footer-links">
        <div><small>Explore</small>{navLinks.slice(0, 4).map(([name, href]) => <a key={href} href={href} aria-current={path === href ? 'page' : undefined}>{name}</a>)}</div>
        <div><small>Company</small><a href="/blog">Blog</a><a href="/team">Team</a><a href="/contact">Contact</a></div>
        <div><small>Get in touch</small><a href="mailto:contact@decode.example">contact@decode.example</a><a href="tel:+18384238334">+1 (838) 423-8334</a><p>741 New South Head Rd, New York</p></div>
      </div>
      <Image className="footer-drawing" file="ui/footer-crane.svg" alt="Line drawing of a tower crane and building" />
      <div className="footer-action"><h2>Let’s build something that lasts</h2><Label href="/contact" variant="light-arrow">Contact us</Label></div>
    </div>
    <div className="footer-bottom"><p>© 2026 Decode. All rights reserved.</p><Socials /></div>
  </footer>
}

function Socials({ facebook = false }) {
  const links = facebook ? [['f', 'Facebook', 'https://www.facebook.com/'], ...socials] : socials
  return <div className="socials">{links.map(([icon, name, href]) => <a key={name} href={href} aria-label={name}><span aria-hidden="true" className={'social-' + name.toLowerCase()}>{icon}</span></a>)}</div>
}

function Invitation() {
  return <section className="invitation shell">
    <Image file="stock/construction-crane.jpg" alt="Construction vehicle beside a building under construction" />
    <div><h2>Let’s bring your ideas to life</h2><Label href={path === '/contact' ? '#contact-form' : '/contact'}>Book a meeting</Label></div>
  </section>
}

function CardGrid({ kind, cards = entries(kind) }) {
  return <div className={'card-grid ' + kind + '-grid'}>
    {cards.map(([href, card]) => <a key={href} href={href} className={'content-card ' + kind + '-card'}>
      <Image file={card.image} />
      <div className="card-caption"><h3>{card.title}</h3>{card.description && <p>{card.description}</p>}</div>
      <span className="card-arrow" aria-hidden="true">{kind === 'projects' ? <i className="cta-arrow" /> : '↗'}</span>
    </a>)}
  </div>
}

function Stats({ values, icon }) {
  const element = useRef(null)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true)
        observer.disconnect()
      }
    }, { threshold: 0.25 })
    observer.observe(element.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!ready) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      return
    }
    const start = performance.now()
    let frame
    function tick(now) {
      const elapsed = Math.min((now - start) / 850, 1)
      setProgress(1 - (1 - elapsed) ** 3)
      if (elapsed < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [ready])
  return <div className="stats" ref={element}>
    {icon && <Image file={icon} />}
    {values.map(([number, label]) => <div key={label}><strong aria-label={number + '+'}>{Math.round(number * progress)}+</strong><p>{label}</p></div>)}
  </div>
}

function Reviews() {
  const { text, images } = content.home.Testimonials
  return <section className="frame section reviews">
    <div className="review-heading"><Image file={images[0]} /><h2>{text[0]}</h2></div>
    <div className="review-grid">
      {text.slice(1).filter((_, i) => i % 3 === 0).map((quote, i) => {
        const [name, place] = text.slice(2 + i * 3, 4 + i * 3)
        return <figure className="review" key={name}>
          <div className="review-rating"><span role="img" aria-label="5 out of 5 stars">★★★★★</span><Image className="review-google" file="ui/google-review.svg" alt="Mock Google review" /></div>
          <blockquote>{quote}</blockquote>
          <figcaption><span className="review-initials" aria-hidden="true">{name.split(' ').map(part => part[0]).join('')}</span><div><strong>{name}</strong><p>{place}</p></div></figcaption>
        </figure>
      })}
    </div>
  </section>
}

function Pricing() {
  const { text } = content.home.Pricing
  const plans = ['Basic', 'Pro', 'Premium']
  return <section className="section shell surface pricing"><h2>{text[0]}</h2>
    <div className="price-grid">
      {plans.map((plan, index) => {
        const start = text.indexOf(plan)
        const features = text.slice(start + 3, index < 2 ? text.indexOf(plans[index + 1]) : undefined).filter(item => !['Per Month', 'What’s Included?', '✦', 'GET STARTED NOW'].includes(item))
        return <article key={plan} className={index === 1 ? 'plan featured' : 'plan'}>
          <h3>{plan}</h3><p>{text[start + 1]}</p>
          <div className="price">{text[start + 2]} <small>Per Month</small></div>
          <strong>What’s Included?</strong><ul>{features.map(feature => <li key={feature}>{feature}</li>)}</ul>
          <Label href="/contact">Get started now</Label>
        </article>
      })}
    </div>
  </section>
}

function Home() {
  const about = content.home.About
  const why = content.home['Why Choose Us']
  const hero = content.home.Hero
  return <>
    <section className="hero shell">
      <div className="hero-visual"><Image file="stock/hero-building.jpg" alt="Angular white building facade viewed against the sky" eager /></div>
      <h1 className="hero-title"><span>Quality</span><span>Construction</span><span>Solutions <Image file="ui/hero-starburst.svg" eager /></span></h1>
      <div className="hero-action"><Label href="/contact" variant="light-arrow">Book a meeting</Label></div>
      <div className="hero-note"><h2>{hero.text[2]}</h2><p>{hero.text[3]}</p></div>
    </section>
    <section className="frame section home-about" id="about">
      <h2 className="partners-title">{about.text[0]}</h2>
      <div className="partner-logos" role="group" aria-label="Sample partner logos">
        {[
          ['Northspan', 'M2 4h20v7c0 6-4 9-10 12C6 20 2 17 2 11Zm4 4v4l6 6 6-6V8l-6 6Z'],
          ['Foundry', 'M4 2h16a2 2 0 0 1 2 2v8c0 6-4 10-10 10S2 18 2 12V4a2 2 0 0 1 2-2Zm8 3c0 4-2 6-6 7 4 0 6 2 6 6 1-4 3-6 7-6-4-1-6-3-7-7Z'],
          ['Arcwell', 'M9 1h6v6h-6ZM9 17h6v6h-6ZM1 9h6v6H1Zm16 0h6v6h-6ZM8 8h8v8H8Z'],
          ['FORMWORK', 'M2 16 20 3h3L11 16h10l-3 4H1Zm15-6 5-4-2 4Z'],
          ['Meridian', 'M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22ZM5 17V7h2l5 6 5-6h2v10h-3v-5l-4 5-4-5v5Z'],
        ].map(([name, mark]) => <span className="partner-logo" key={name}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={mark} fill="currentColor" fillRule="evenodd" /></svg>{name}
        </span>)}
      </div>
      <div className="split about-overview">
        <div><Image className="photo" file={about.images[0]} alt="Brick and metal clad building" /><Stats values={[[750, about.text[2]], [950, about.text[4]]]} icon={about.images[1]} /></div>
        <div><h2>{about.text[5]}</h2><p>{about.text[6]}</p><p>{about.text[7]}</p><Label href="#services">Explore more</Label></div>
      </div>
    </section>
    <section id="services" className="section shell surface home-services">
      <h2>Our services</h2><CardGrid kind="services" cards={entries('services').slice(0, 3)} />
    </section>
    <section className="section frame split why-us">
      <div><h2>{why.text[0]}</h2><p>{why.text[1]}</p><div className="why-features">{[why.text.slice(2, 4), why.text.slice(4)].map(items =>
        <ul key={items[0]}>{items.map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
      )}</div></div>
      <Image className="photo" file={why.images[1]} alt="Contemporary building with a timber slat facade" />
    </section>
    <section className="section frame selected"><h2>Some of our selected works</h2><CardGrid kind="projects" cards={entries('projects').slice(0, 6)} /></section>
    <Pricing /><Reviews />
  </>
}

function Intro({ title, text, children }) {
  return <header className="intro"><h1>{title}</h1>{text && <p>{text}</p>}{children}</header>
}

function Listing({ kind }) {
  const section = content[kind][kind === 'projects' ? 'Projects' : 'Posts']
  return <section className={'frame inner-listing ' + kind + '-listing'}>
    <Intro title={kind === 'projects' ? <>Built to last.<br />Designed for impact</> : section.text[0]} text={section.text[1]} />
    <CardGrid kind={kind} />
  </section>
}

function Services() {
  const benefit = content.services.Benefits.text
  return <>
    <section className="frame benefits"><div className="benefits-copy"><h1>{benefit[0]}</h1><Label href="/contact">Book a meeting</Label></div>
      <div className="benefit-bars">{[2, 4, 6].map(i => <div key={i}><strong>{benefit[i]}</strong><p>{benefit[i + 1]}</p></div>)}</div>
    </section>
    <section className="frame services-listing"><div className="intro"><h2>Our services</h2><p>{content.services.Services.text[1]}</p></div><CardGrid kind="services" /></section>
  </>
}

function TeamGrid({ about = false }) {
  const { images, text } = content.team.Team
  return <section className={about ? 'frame section about-team' : 'frame inner-listing'}>
    {about ? <div className="section-title"><h2>{text[0]}</h2><Label href="/team">See all members</Label></div> : <Intro title={text[0]} text={text[1]} />}
    <div className="team-grid">{images.slice(0, about ? 3 : undefined).map((file, i) => <article key={file}><Image file={file} /><div><h3>{text[2 + i * 2]}</h3><p>{text[3 + i * 2]}</p></div></article>)}</div>
  </section>
}

function Story() {
  const { text, images } = content.about['Our Story']
  const [tab, setTab] = useState(0)
  const buttons = useRef([])
  const panels = [
    [text[3], text[4]],
    ['Shaping Skylines for Generations', 'We envision communities where every structure is safe, sustainable and built to last, combining modern engineering with timeless craftsmanship to create spaces people are proud to live and work in.'],
    ['From a Small Crew to a Trusted Name', 'Decode started with a small team of builders who believed in doing things right. Decades later, that same commitment to honest work and careful detail guides every project we take on.'],
  ]
  function selectWithKey(event) {
    const next = { ArrowRight: (tab + 1) % 3, ArrowLeft: (tab + 2) % 3, Home: 0, End: 2 }[event.key]
    if (next === undefined) return
    event.preventDefault()
    setTab(next)
    buttons.current[next].focus()
  }
  return <section className="section frame story">
    <div className="tabs" role="tablist" aria-label="About Decode">
      {text.slice(0, 3).map((label, i) => <button key={label} type="button" ref={element => { buttons.current[i] = element }} role="tab" id={'story-tab-' + i} aria-controls="story-panel" aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} onKeyDown={selectWithKey}>{label}</button>)}
    </div>
    <div id="story-panel" role="tabpanel" aria-labelledby={'story-tab-' + tab} tabIndex={0} key={tab}>
      <h2>{panels[tab][0]}</h2><p>{panels[tab][1]}</p><Image className="photo" file={images[tab]} />
    </div>
  </section>
}

function About() {
  const a = content.about
  return <>
    <section className="frame inner-listing about-intro">
      <Intro title={a.Intro.text[0]} />
      <div className="about-showcase">
        <div className="about-photos"><Image className="photo" file={a.Intro.images[0]} /><Image className="photo" file={a.Intro.images[1]} /></div>
        <div className="values">{a.Intro.text.slice(1).map((label, i) => <div key={label}><Image file={a.Intro.images[i + 2]} /><h3>{label}</h3></div>)}</div>
      </div>
    </section>
    <section className="shell section commitment"><Image className="photo" file={a.Commitment.images[0]} /><div><h2>{a.Commitment.text[0]}</h2><p>{a.Commitment.text[1]}</p></div></section>
    <section className="frame section split about-stats"><Stats values={[[500, a.Statistics.text[1]], [30, a.Statistics.text[3]], [100, a.Statistics.text[5]]]} /><div><h2>{a.Statistics.text[6]}</h2><p>{a.Statistics.text[7]}</p><Label href="/contact">Book a meeting</Label></div></section>
    <Story /><TeamGrid about /><Reviews />
  </>
}

function Contact() {
  const { text, images } = content.contact.Contact
  const channels = ['tel:+18384238334', 'mailto:contact@decode.example', 'https://maps.google.com/?q=741+New+South+Head+Rd+New+York']
  return <section className="frame contact">
    <div className="contact-overview">
      <h1>{text[0]}</h1><p>{text[1]}</p>
      <div className="contact-grid">{[2, 5, 8, 11].map((start, i) => {
        const inner = <><Image file={images[i]} /><small>{text[start]}</small><strong>{text[start + 1]}</strong><p>{text[start + 2]}</p></>
        return channels[i] ? <a key={start} href={channels[i]}>{inner}</a> : <div key={start}>{inner}</div>
      })}</div>
      <div className="contact-social"><h2>Follow Us</h2><Socials facebook /></div>
    </div>
    <form id="contact-form" className="contact-form" onSubmit={event => {
      event.preventDefault()
      const fields = new FormData(event.currentTarget)
      const body = fields.get('first') + ' ' + fields.get('last') + '\n' + fields.get('email') + '\n\n' + fields.get('message')
      location.href = 'mailto:contact@decode.example?subject=Construction%20enquiry&body=' + encodeURIComponent(body)
    }}>
      <h2>Send Us a Message</h2>
      <div className="form-grid"><label><span className="sr-only">First name</span><input required name="first" autoComplete="given-name" placeholder="First name" /></label><label><span className="sr-only">Last name</span><input required name="last" autoComplete="family-name" placeholder="Last name" /></label></div>
      <label><span className="sr-only">Email address</span><input required name="email" autoComplete="email" type="email" placeholder="Enter your email" /></label>
      <label><span className="sr-only">Your message</span><textarea required name="message" rows="5" placeholder="Enter your message" /></label>
      <p>This preview opens a draft in your email app. Connect your business email before using it to receive inquiries.</p>
      <button className="cta submit" type="submit"><span>Send message</span><span aria-hidden="true"><i className="cta-arrow" /></span></button>
    </form>
  </section>
}

function Detail({ detail }) {
  const hero = detail.body.findIndex(([tag, value]) => tag === 'img' && !value.endsWith('.svg'))
  const title = detail.body.find((item) => item[0] === 'h1')?.[1]
  useEffect(() => { if (title) document.title = title + ' – Decode' }, [title])
  function render([tag, value], i) {
    if (tag === 'img') return <Image key={i} className={value.endsWith('.svg') ? 'detail-icon' : 'detail-photo photo'} file={value} alt={i === hero ? title : ''} eager={i === hero} />
    const Tag = tag === 'li' ? 'p' : tag
    return <Tag key={i}>{value}</Tag>
  }
  const meta = detail.body.slice(0, hero)
  return <>
    <article className={'frame detail ' + group + '-detail'}>
      <header>{group === 'projects' ? <>
        <div className="client-label">{meta.slice(0, 2).map(render)}</div>
        {meta.slice(2).map(render)}
      </> : meta.map(render)}</header>
      {render(detail.body[hero], hero)}
      <div className="detail-copy">{detail.body.slice(hero + 1).map(render)}</div>
    </article>
    {detail.related.length > 0 && <section className="section frame"><div className="section-title"><h2>You Might Also Like</h2><Label href="/blog">More articles</Label></div><CardGrid kind="blog" cards={detail.related.map(href => [href, content.blog.cards[href]]).filter(([, card]) => card)} /></section>}
  </>
}

function App() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const pending = document.querySelectorAll('.content-card, .plan, .review, .team-grid article')
    const observer = new IntersectionObserver(records => {
      for (const record of records) {
        if (!record.isIntersecting) continue
        record.target.classList.add('revealed')
        observer.unobserve(record.target)
      }
    }, { threshold: 0.12 })
    pending.forEach(card => {
      card.classList.add('reveal')
      observer.observe(card)
    })
    return () => observer.disconnect()
  }, [])
  const page = {
    '/': <Home />, '/about': <About />, '/services': <Services />, '/projects': <Listing kind="projects" />, '/blog': <Listing kind="blog" />, '/team': <TeamGrid />, '/contact': <Contact />,
  }[path]
  const detail = content.details[path]
  return <><Header /><main>{page || (detail ? <Detail detail={detail} /> : <section className="frame inner-listing"><h1>Page not found</h1><Label href="/">Return home</Label></section>)}{(page || detail) && <Invitation />}</main><Footer /></>
}

createRoot(document.getElementById('root')).render(<App />)
