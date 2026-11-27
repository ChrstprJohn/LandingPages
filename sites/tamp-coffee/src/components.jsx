import { useEffect, useRef, useState } from 'react'
import { email, photo } from './data'

export function Link({ to, children, button, className = '', ...props }) {
  const variant = button === 'solid' ? 'pill pill-solid' : button ? 'pill' : ''
  return <a href={to} className={[variant, className].filter(Boolean).join(' ') || undefined} {...props}>{children}</a>
}

export function SectionHeading({ title, children, as: Heading = 'h2' }) {
  return <div className="section-heading"><Heading>{title}</Heading>{children && <p>{children}</p>}</div>
}

export function MenuCard({ item }) {
  return (
    <Link to={item.href} className="menu-card">
      <div className="photo-frame"><img src={photo(item.slug)} width="768" height="572" loading="lazy" alt="" /></div>
      <div className="menu-card-copy">
        <div className="menu-card-title flex justify-between"><h3>{item.name}</h3><span>{item.price}</span></div>
        <p>{item.description}</p>
      </div>
    </Link>
  )
}

export function EmailCopy() {
  const [message, setMessage] = useState('')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(email)
      setMessage('Copied')
    } catch {
      setMessage('Copy unavailable')
    }
    timer.current = setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="footer-email flex items-center">
      <a href={`mailto:${email}`}>{email}</a>
      <button type="button" onClick={copy} aria-label="Copy email address">{message || 'Copy'}</button>
      <span className="sr-only" role="status">{message}</span>
    </div>
  )
}
