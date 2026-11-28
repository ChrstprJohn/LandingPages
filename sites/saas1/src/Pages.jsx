import { useState } from 'react'
import { legalPages } from './legal.js'
import { Icon, RollButton } from './ui.jsx'

const subjects = ['Product questions', 'Plans and billing', 'Using Decode', 'Working together', 'Something else']

export function routeTitle(path) {
  if (path === '/') return 'Decode — AI Workspace for Content Teams'
  const title = legalPages[path]?.title ?? {
    '/contact': 'Talk to Decode',
    '/sign-in': 'Sign in',
    '/sign-up': 'Create an account',
  }[path] ?? 'Page not found'
  return title + ' — Decode'
}

function PageLead({ title, children, className = '' }) {
  return (
    <div className={'page-lead text-center ' + className}>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  )
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="inner-page contact-page">
      <div className="shell">
        <PageLead title="Talk to Decode">
          Tell us what you’re working on<br />and where your team could use a hand.
        </PageLead>
        <form className="surface contact-form" onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
        }}>
          <div className="form-grid">
            <label>First name*<input name="First name" autoComplete="given-name" placeholder="Alex" required /></label>
            <label>Last name*<input name="Last name" autoComplete="family-name" placeholder="Rivera" required /></label>
          </div>
          <label>Email*<input name="Email" type="email" autoComplete="email" placeholder="alex@example.com" required /></label>
          <label>Company<input name="Company" autoComplete="organization" placeholder="Your organization" /></label>
          <label>Subject*
            <span className="select-field">
              <select name="Subject" defaultValue="" required>
                <option value="" disabled>Choose a topic</option>
                {subjects.map((subject) => <option key={subject}>{subject}</option>)}
              </select>
              <Icon name="chevron" />
            </span>
          </label>
          <label>Your message*<textarea name="Message" placeholder="What would you like to ask about?" required /></label>
          <label className="newsletter">
            <input name="Newsletter" type="checkbox" />
            <span>Send me occasional Decode news.</span>
          </label>
          <RollButton className="w-full">Submit inquiry</RollButton>
          {submitted && <p className="form-status" role="status">Form checked. This preview does not send the inquiry.</p>}
          <p className="form-terms">
            Read the <a href="/legal/terms-of-service">Terms of Service</a>{' '}
            and <a href="/legal/privacy-policy">Privacy Policy</a> for this preview.
          </p>
        </form>
      </div>
    </section>
  )
}

function Auth({ signUp = false }) {
  const [submitted, setSubmitted] = useState(false)
  return (
    <section className="inner-page auth-page">
      <div className="shell">
        <PageLead title={signUp ? 'Create an account' : 'Sign in to Decode'} className={signUp ? '' : 'sign-in-lead'}>
          {signUp ? 'Use your email to try the account setup.' : 'Use your email to continue to your workspace.'}
        </PageLead>
        <form className="auth-form surface" onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
        }}>
          <input type="email" name="email" aria-label="Email" placeholder="you@example.com" autoComplete="email" required />
          <RollButton className="w-full">Request a code</RollButton>
          {submitted && <p className="form-status" role="status">Email checked. This preview does not send a code.</p>}
        </form>
        <p className="auth-alternative">
          {signUp ? 'Returning to Decode?' : 'New to Decode?'}{' '}
          <a href={signUp ? '/sign-in' : '/sign-up'}>{signUp ? 'Sign in' : 'Create an account'}</a>
        </p>
        <a className="auth-credit" href="/legal/privacy-policy">
          <Icon name="lock" />
          How this preview uses email
        </a>
      </div>
    </section>
  )
}

function withContact(text) {
  const label = 'preview contact form'
  if (!text.includes(label)) return text
  const [before, after] = text.split(label)
  return <>{before}<a href="/contact">{label}</a>{after}</>
}

function Legal({ page }) {
  return (
    <section className="inner-page legal-page">
      <div className="shell">
        <PageLead title={page.title}>Preview version · November 2026</PageLead>
        <div className="legal-copy">
          {page.intro && <p>{page.intro}</p>}
          {page.sections.map(([name, text, list, after]) => (
            <section key={name}>
              <h2>{name}</h2>
              <p>{withContact(text)}</p>
              {list && <ul role="list">{list.map((item) => <li key={item}>{item}</li>)}</ul>}
              {after && <p>{withContact(after)}</p>}
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <section className="inner-page not-found">
      <div className="shell text-center">
        <PageLead title="We couldn’t find that page">Check the address or head back to the Decode homepage.</PageLead>
        <RollButton href="/#hero">Back to Decode</RollButton>
      </div>
    </section>
  )
}

export default function Pages({ path }) {
  if (path === '/contact') return <Contact />
  if (path === '/sign-in' || path === '/sign-up') return <Auth signUp={path === '/sign-up'} />
  if (legalPages[path]) return <Legal page={legalPages[path]} />
  return <NotFound />
}
