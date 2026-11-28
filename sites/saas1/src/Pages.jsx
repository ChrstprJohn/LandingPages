import { useState } from 'react'
import { legalPages } from './legal.js'
import { Icon, RollButton } from './ui.jsx'

const subjects = ['General inquiry', 'Pricing & plans', 'Technical support', 'Partnership', 'Other']

export function routeTitle(path) {
  if (path === '/') return 'Nouva — AI Content'
  const title = legalPages[path]?.title ?? {
    '/contact': 'Contact us',
    '/sign-in': 'Sign In',
    '/sign-up': 'Sign Up',
  }[path] ?? 'Page not found'
  return title + ' — Nouva'
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
        <PageLead title="Contact us">
          Have a question or need help?<br />We'll get back to you shortly.
        </PageLead>
        <form className="surface contact-form" onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
        }}>
          <div className="form-grid">
            <label>First name*<input name="First name" autoComplete="given-name" placeholder="Jane" required /></label>
            <label>Last name*<input name="Last name" autoComplete="family-name" placeholder="Smith" required /></label>
          </div>
          <label>Email*<input name="Email" type="email" autoComplete="email" placeholder="jane@framer.com" required /></label>
          <label>Company<input name="Company" autoComplete="organization" placeholder="Acme Inc." /></label>
          <label>Subject*
            <span className="select-field">
              <select name="Subject" defaultValue="" required>
                <option value="" disabled>Select…</option>
                {subjects.map((subject) => <option key={subject}>{subject}</option>)}
              </select>
              <Icon name="chevron" />
            </span>
          </label>
          <label>Your message*<textarea name="Message" placeholder="Tell us what's on your mind..." required /></label>
          <label className="newsletter">
            <input name="Newsletter" type="checkbox" />
            <span>I'd like to receive updates and news via email.</span>
          </label>
          <RollButton className="w-full">Send message</RollButton>
          {submitted && <p className="form-status" role="status">This preview can’t send messages.</p>}
          <p className="form-terms">
            By submitting, you agree to our <a href="/legal/terms-of-service">Terms of Service</a>{' '}
            and <a href="/legal/privacy-policy">Privacy Policy</a>.
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
        <PageLead title={signUp ? 'Sign Up' : 'Sign In'} className={signUp ? '' : 'sign-in-lead'}>
          {signUp ? 'Create your account to get started.' : 'Welcome back. Enter your email to continue.'}
        </PageLead>
        <form className="auth-form surface" onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
        }}>
          <input type="email" name="email" aria-label="Email" placeholder="Email" autoComplete="email" required />
          <RollButton className="w-full">Send Code</RollButton>
          {submitted && <p className="form-status" role="status">This preview can’t send sign-in codes.</p>}
        </form>
        <p className="auth-alternative">
          {signUp ? 'Already have an account?' : 'Don’t have an account yet?'}{' '}
          <a href={signUp ? '/sign-in' : '/sign-up'}>{signUp ? 'Sign in' : 'Sign up'}</a>
        </p>
        <a className="auth-credit" href="https://dub.frameauth.com/hello" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#bcff00" d="M0 0h24v11a12 12 0 1 1-24 0z" />
            <path stroke="#11181b" strokeWidth="2.8" fill="none" d="M8 17a5 5 0 1 1 8.7-4.8v4.7m-.7-6.5V8a4 4 0 1 0-8 0" />
          </svg>
          FrameAuth in the original
        </a>
      </div>
    </section>
  )
}

function withEmail(text) {
  const address = 'hello@nouva.com'
  if (!text.includes(address)) return text
  const [before, after] = text.split(address)
  return <>{before}<a href={'mailto:' + address}>{address}</a>{after}</>
}

function Legal({ page }) {
  return (
    <section className="inner-page legal-page">
      <div className="shell">
        <PageLead title={page.title}>Last Updated: Apr 22, 2026</PageLead>
        <div className="legal-copy">
          {page.intro && <p>{page.intro}</p>}
          {page.sections.map(([name, text, list, after]) => (
            <section key={name}>
              <h2>{name}</h2>
              <p>{withEmail(text)}</p>
              {list && <ul role="list">{list.map((item) => <li key={item}>{item}</li>)}</ul>}
              {after && <p>{withEmail(after)}</p>}
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
        <PageLead title="This page doesn't exist">The page you're looking for may have moved or no longer exists.</PageLead>
        <RollButton href="/#hero">Back to Homepage</RollButton>
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
