import { useId, useRef, useState } from 'react'
import { comparison, customerLogos, features, plans, questions, shifts, stats, teamBenefits, testimonials } from './content.js'
import { Icon, RollButton, SectionTitle } from './ui.jsx'
import { useTickerMotion } from './motion.js'

const desertDescription = 'A figure stands on a desert ridge in the last amber light beneath a deep blue sky.'

function Photo({ name, alt = '', className = '' }) {
  return <img className={className} src={'/media/' + name + '.avif'} alt={alt} loading="lazy" decoding="async" />
}

function Hero() {
  const title = 'Words that work. Every single time.'
  return (
    <section className="hero" id="hero">
      <div className="hero-parallax" data-hero-parallax>
        <img src="/media/hero.avif" alt={desertDescription} fetchPriority="high" decoding="async" data-hero-media />
      </div>
      <div className="hero-copy shell text-center">
        <h1 aria-label={title}>
          {title.split(' ').map((word, index) => (
            <span key={word} aria-hidden="true">
              {index > 0 && ' '}<span className="hero-word" data-hero-word>{word}</span>
            </span>
          ))}
        </h1>
        <p className="hero-description" data-hero-description>An AI content tool that writes, tracks, and scales your team's output.</p>
        <div data-hero-action>
          <RollButton href="/contact">Try for free</RollButton>
        </div>
      </div>
      <a className="scroll-cue" href="/#benefits" data-hero-cue>
        Scroll to discover
        <span><Icon name="chevron" /></span>
      </a>
    </section>
  )
}

function Stats() {
  return (
    <section className="section stats" id="benefits">
      <div className="shell section-stack">
        <SectionTitle center className="stats-title">
          The way teams work is changing. <span className="muted">Most are still catching up.</span>
        </SectionTitle>
        <div className="stats-grid">
          {stats.map(([value, suffix, text, emphasis, after], index) => (
            <div className="stat-step" key={value}>
              <article className="surface stat" data-reveal data-delay={0.1 * index}>
                <h3 className="stat-value">
                  <span className="sr-only">{value}{suffix}</span>
                  <span aria-hidden="true" data-counter={value} data-suffix={suffix}>{value}{suffix}</span>
                </h3>
                <p>{text}<strong>{emphasis}</strong>{after}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <section className="section intro">
      <div className="shell section-stack">
        <SectionTitle label="What Nouva does">Three shifts that change<br className="wide-break" />{' '}
          <span className="muted">how your team works.</span>
        </SectionTitle>
        <div className="intro-grid">
          {shifts.map(({ image, alt, title, text }, index) => (
            <article className="surface intro-card" key={title} data-reveal data-delay={0.08 * index}>
              <Photo name={image} alt={alt} className="intro-photo" />
              <div className="intro-copy">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="section features" id="features">
      <div className="shell">
        <SectionTitle label="Built for every workflow">One platform that handles<br className="wide-break" />{' '}
          <span className="muted">everything your team produces.</span>
        </SectionTitle>
        <div className="feature-stack" data-feature-stack>
          {features.map(({ image, alt, title, text }, index) => (
            <div className="feature-step" key={title} style={{ '--step': index }}>
              <article className="surface feature-panel" data-feature-panel>
                <Photo name={image} alt={alt} className="feature-photo" />
                <div className="feature-copy">
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <RollButton href="/contact">Get started</RollButton>
                </div>
              </article>
            </div>
          ))}
          <span className="feature-marker" style={{ '--marker': 1 }} data-feature-marker aria-hidden="true" />
          <span className="feature-marker" style={{ '--marker': 2 }} data-feature-marker aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

function TeamBenefits() {
  return (
    <section className="section team-benefits" id="benefits-1">
      <div className="shell section-stack">
        <SectionTitle label="Built for teams" reveal={false}>One platform,<br />
          <span className="muted">endless possibilities.</span>
        </SectionTitle>
        <div className="team-layout">
          <article className="surface team-cta">
            <Photo name="teams" alt="Pink mist between tall canyon walls at dusk" />
            <h3>Your whole team. <br className="team-break" />One platform.</h3>
            <RollButton href="/contact" className="w-full">Get started free</RollButton>
          </article>
          <div className="team-grid">
            {teamBenefits.map(([icon, title, text]) => (
              <article className="surface team-perk" key={title}>
                <span className="perk-icon"><Icon name={icon} /></span>
                <h4>{title}</h4>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Comparison() {
  return (
    <section className="section comparison">
      <div className="shell section-stack">
        <SectionTitle label="Why Nouva" center reveal={false}>Everything else falls short.<br className="wide-break" />{' '}
          <span className="muted">Here's why teams choose us.</span>
        </SectionTitle>
        <div className="surface comparison-box">
          {comparison.map((rows, index) => (
            <article key={rows[0]} className={'comparison-column' + (index ? ' comparison-nouva' : '')}
              data-comparison-reveal={index ? '' : undefined}>
              {index > 0 && <Photo name="comparison" className="comparison-photo" />}
              {index > 0 ? (
                <h3 className="comparison-brand">
                  <img src="/media/nouva.svg" width="26" height="26" alt="" />Nouva
                </h3>
              ) : <h3>Other Tools</h3>}
              <ul>
                {rows.map((row) => (
                  <li key={row}><Icon name={index ? 'check' : 'close'} />{row}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="shell section-stack">
        <SectionTitle label="Real results" reveal={false}>Teams who <span className="muted">never looked back.</span></SectionTitle>
        <div className="testimonial-grid">
          {testimonials.map(([photo, name, role, quote], index) => (
            <figure className="surface testimonial" key={name} data-reveal data-delay={(index % 4) * 0.04}>
              <blockquote>"{quote}"</blockquote>
              <figcaption>
                <Photo name={photo} />
                <div><span>{name}</span><span className="muted">{role}</span></div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function CustomerLogos() {
  const scope = useRef(null)
  const [paused, setPaused] = useState(false)
  useTickerMotion(scope, paused)

  return (
    <div className="customer-logos" data-reveal>
      <p>Used by 1,200+ teams worldwide</p>
      <div className="ticker" ref={scope}>
        <div className="ticker-mask">
          <div className="ticker-track" data-ticker-track aria-hidden="true">
            {[0, 1].map((group) => (
              <div className="ticker-group" key={group}>
                {customerLogos.map(([name, width, height]) => (
                  <img key={name} src={'/media/' + name + '.svg'} width={width} height={height} alt="" style={{ '--logo-width': width }} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <button type="button" className="ticker-toggle" aria-label={paused ? 'Play customer logos' : 'Pause customer logos'}
          onClick={() => setPaused(!paused)}>
          {paused ? '▶' : 'Ⅱ'}
        </button>
      </div>
    </div>
  )
}

function Pricing() {
  const [yearly, setYearly] = useState(false)
  return (
    <section className="section pricing" id="pricing">
      <div className="shell section-stack">
        <SectionTitle label="Pricing" center>Start free,<br /><span className="muted">scale when ready.</span></SectionTitle>
        <div className="pricing-content" data-reveal>
          <button type="button" className="billing-switch" role="switch" aria-label="Yearly billing"
            aria-checked={yearly} onClick={() => setYearly(!yearly)}>
            <span className={yearly ? 'muted' : ''}>Monthly</span>
            <span className="billing-track" aria-hidden="true"><span /></span>
            <span className={yearly ? '' : 'muted'}>Yearly</span>
            <span className="pill discount">20% off</span>
          </button>
          <div className="plan-grid">
            {plans.map((plan) => {
              const popular = plan.name === 'Pro'
              return (
                <article className={'surface plan' + (popular ? ' plan-popular' : '')} key={plan.name}>
                  <div className="plan-heading">
                    <h3>{plan.name}</h3>
                    {popular && <span className="pill">Popular</span>}
                  </div>
                  <p className="plan-price"><span>${yearly ? plan.yearly : plan.monthly}</span> user/mo</p>
                  <p className="plan-description">{plan.description}</p>
                  <RollButton href="/contact" variant={popular ? 'solid' : 'outline'} className="w-full">Get started</RollButton>
                  <ul>
                    {plan.includes.map((item) => <li key={item}><Icon name="check" />{item}</li>)}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
        <CustomerLogos />
      </div>
    </section>
  )
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <article className="surface faq-item" data-open={open}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(previous => !previous)}>
          {question}<span className="faq-plus" aria-hidden="true" />
        </button>
      </h3>
      <div className="faq-answer" id={id} inert={!open} aria-hidden={!open}>
        <div><p>{answer}</p></div>
      </div>
    </article>
  )
}

function FAQ() {
  return (
    <section className="section faq" id="faq">
      <div className="shell section-stack">
        <SectionTitle label="FAQ">You have questions.<br /><span className="muted">We have answers.</span></SectionTitle>
        <div className="faq-columns" data-reveal data-enter-y="40">
          {[questions.slice(0, 3), questions.slice(3)].map((group) => (
            <div className="faq-group" key={group[0][0]}>
              {group.map(([question, answer]) => <FAQItem key={question} question={question} answer={answer} />)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="section final-section">
      <div className="shell">
        <div className="surface final-cta">
          <Photo name="cta" alt={desertDescription} className="final-image" />
          <div className="final-copy">
            <h2>The work doesn't stop.<br /><span className="muted">Neither does Nouva.</span></h2>
            <p>From your first task to your entire team's workflow — Nouva grows with you.</p>
            <RollButton href="/contact">Get started free</RollButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Intro />
      <Features />
      <TeamBenefits />
      <Comparison />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  )
}
