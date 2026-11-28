import { useId, useRef, useState } from 'react'
import { channels, comparison, features, plans, questions, shifts, stats, teamBenefits, workflows } from './content.js'
import { Icon, RollButton, SectionTitle } from './ui.jsx'
import { useTickerMotion } from './motion.js'

function Photo({ name, alt = '', className = '' }) {
  return <img className={className} src={'/media/' + name + '.avif'} alt={alt} loading="lazy" decoding="async" />
}

function Hero() {
  const lines = ['One brief.', 'Better drafts.']
  return (
    <section className="hero" id="hero">
      <div className="hero-parallax" data-hero-parallax>
        <img src="/media/hero.avif" alt="" fetchPriority="high" decoding="async" data-hero-media />
      </div>
      <div className="hero-copy shell text-center">
        <h1 aria-label={lines.join(' ')}>
          {lines.map(line => (
            <span className="block" key={line} aria-hidden="true">
              {line.split(' ').map((word, index) => (
                <span key={word}>
                  {index > 0 && ' '}<span className="hero-word" data-hero-word>{word}</span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className="hero-description" data-hero-description>Decode gives content teams one AI workspace to draft, edit, and see what’s ready to publish.</p>
        <div data-hero-action>
          <RollButton href="/contact">Talk to Decode</RollButton>
        </div>
      </div>
      <a className="scroll-cue" href="/#benefits" data-hero-cue>
        Explore the workflow
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
          Give every idea a path. <span className="muted">From brief to review.</span>
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
        <SectionTitle label="Inside Decode">See what’s moving<br className="wide-break" />{' '}
          <span className="muted">and what needs a pass.</span>
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
        <SectionTitle label="The writing workflow">Take a draft further<br className="wide-break" />{' '}
          <span className="muted">with the same team.</span>
        </SectionTitle>
        <div className="feature-stack" data-feature-stack>
          {features.map(({ image, alt, title, text }, index) => (
            <div className="feature-step" key={title} style={{ '--step': index }}>
              <article className="surface feature-panel" data-feature-panel>
                <Photo name={image} alt={alt} className="feature-photo" />
                <div className="feature-copy">
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <RollButton href="/contact">Ask about Decode</RollButton>
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
        <SectionTitle label="Team workspace" reveal={false}>Write together.<br />
          <span className="muted">Keep your voice.</span>
        </SectionTitle>
        <div className="team-layout">
          <article className="surface team-cta">
            <Photo name="teams" />
            <h3>One place for <br className="team-break" />the next draft.</h3>
            <RollButton href="/contact" className="w-full">Talk about your team</RollButton>
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
        <SectionTitle label="Why Decode" center reveal={false}>Less time chasing files.<br className="wide-break" />{' '}
          <span className="muted">More time editing.</span>
        </SectionTitle>
        <div className="surface comparison-box">
          {comparison.map((rows, index) => (
            <article key={rows[0]} className={'comparison-column' + (index ? ' comparison-decode' : '')}
              data-comparison-reveal={index ? '' : undefined}>
              {index > 0 && <Photo name="comparison" className="comparison-photo" />}
              {index > 0 ? (
                <h3 className="comparison-brand">
                  <img src="/media/decode.svg" width="26" height="26" alt="" />Decode
                </h3>
              ) : <h3>Scattered tools</h3>}
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

function WorkflowExamples() {
  return (
    <section className="section testimonials">
      <div className="shell section-stack">
        <SectionTitle label="Example workflows" reveal={false}>What teams <span className="muted">could make.</span></SectionTitle>
        <div className="testimonial-grid">
          {workflows.map(([photo, name, role, brief], index) => (
            <figure className="surface testimonial" key={name} data-reveal data-delay={(index % 4) * 0.04}>
              <p>{brief}</p>
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

function ChannelTicker() {
  const scope = useRef(null)
  const [paused, setPaused] = useState(false)
  useTickerMotion(scope, paused)

  return (
    <div className="customer-logos" data-reveal>
      <p>Write for the channels you use</p>
      <p className="sr-only">{channels.join(', ')}</p>
      <div className="ticker" ref={scope}>
        <div className="ticker-mask">
          <div className="ticker-track" data-ticker-track aria-hidden="true">
            {[0, 1].map((group) => (
              <div className="ticker-group" key={group}>
                {channels.map(channel => <span key={channel}>{channel}</span>)}
              </div>
            ))}
          </div>
        </div>
        <button type="button" className="ticker-toggle" aria-label={paused ? 'Play content formats' : 'Pause content formats'}
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
        <SectionTitle label="Plan preview" center>Find a plan<br /><span className="muted">for your team.</span></SectionTitle>
        <div className="pricing-content" data-reveal>
          <button type="button" className="billing-switch" role="switch" aria-label="Yearly billing"
            aria-checked={yearly} onClick={() => setYearly(!yearly)}>
            <span className={yearly ? 'muted' : ''}>Monthly</span>
            <span className="billing-track" aria-hidden="true"><span /></span>
            <span className={yearly ? '' : 'muted'}>Yearly</span>
            <span className="pill discount">Preview</span>
          </button>
          <div className="plan-grid">
            {plans.map((plan) => {
              const popular = plan.name === 'Studio'
              return (
                <article className={'surface plan' + (popular ? ' plan-popular' : '')} key={plan.name}>
                  <div className="plan-heading">
                    <h3>{plan.name}</h3>
                    {popular && <span className="pill">Featured</span>}
                  </div>
                  <p className="plan-price"><span>${yearly ? plan.yearly : plan.monthly}</span> per seat/mo</p>
                  <p className="plan-description">{plan.description}</p>
                  <RollButton href="/contact" variant={popular ? 'solid' : 'outline'} className="w-full">Ask about this plan</RollButton>
                  <ul>
                    {plan.includes.map((item) => <li key={item}><Icon name="check" />{item}</li>)}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
        <ChannelTicker />
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
        <SectionTitle label="FAQ">A few things to know<br /><span className="muted">before you start.</span></SectionTitle>
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
          <Photo name="cta" className="final-image" />
          <div className="final-copy">
            <h2>Bring your next brief.<br /><span className="muted">See where it can go.</span></h2>
            <p>Explore how Decode could fit the way your team writes, reviews, and publishes.</p>
            <RollButton href="/contact">Talk to Decode</RollButton>
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
      <WorkflowExamples />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  )
}
