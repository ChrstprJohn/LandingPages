import { useEffect, useRef, useState } from 'react'

const links = [
  ['Overview', '/#benefits'],
  ['Workflow', '/#features'],
  ['Plans', '/#pricing'],
  ['FAQ', '/#faq'],
]

const footerLinks = [
  ['Product', links],
  ['Site information', [
    ['Contact', '/contact'],
    ['Privacy Policy', '/legal/privacy-policy'],
    ['Terms of Service', '/legal/terms-of-service'],
    ['Page not found', '/404'],
  ]],
  ['More', [
    ['Sign in', '/sign-in'],
    ['Create an account', '/sign-up'],
    ['Photography credits', '/media/photography.html'],
  ]],
]

const iconPaths = {
  lock: 'M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Zm2 0V7a4 4 0 0 1 8 0v4',
  plus: 'M12 6v12M6 12h12',
  close: 'm6 6 12 12M18 6 6 18',
  check: 'm5 12 4 4L19 6',
  chevron: 'm6 9 6 6 6-6',
  fingerprint: 'M3 12a9 9 0 0 1 18 0v2M6 13v-1a6 6 0 0 1 12 0v3c0 2 1 3 2 4M4 16c0 2 1 4 2 5m3-2v-7a3 3 0 0 1 6 0v3c0 4 2 6 3 7m-6-10v4c0 3 1 5 2 6',
  layers: 'm12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5',
  search: 'M21 21l-4.4-4.4M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m18 0v-2a4 4 0 0 0-3-3.9M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-7.9a4 4 0 0 1 0 7.8',
  chart: 'M3 3v18h18M7 15l4-4 4 2 6-6',
  bolt: 'm13 2-9 12h7l-1 8 10-12h-7l1-8Z',
}

export function Icon({ name, className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  )
}

export function Brand() {
  return (
    <a className="brand inline-flex items-center" href="/#hero">
      <img src="/media/decode.svg" width="22" height="22" alt="" />
      <span>Decode</span>
    </a>
  )
}

export function RollButton({ children, href, variant = 'solid', className = '' }) {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag className={'roll-button button-' + variant + ' ' + className} {...(href ? { href } : { type: 'submit' })}>
      <span className="roll-window">
        <span className="roll-line">
          {children}
          <span className="roll-copy" aria-hidden="true">{children}</span>
        </span>
      </span>
    </Tag>
  )
}

function HeaderActions({ mobile = false, path }) {
  return (
    <div className={'nav-actions' + (mobile ? ' nav-actions-mobile' : '')}>
      <a className="nav-link" href="/sign-in" aria-current={path === '/sign-in' ? 'page' : undefined}>Sign in</a>
      <RollButton href="/contact" variant="outline">Try Decode</RollButton>
    </div>
  )
}

export function Navigation({ path }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef(null)

  useEffect(() => {
    if (!open) return
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <header className="site-header" data-header data-menu-open={open}>
      <nav className="header-shell shell" aria-label="Main" onClick={(event) => {
        if (event.target.closest('a[href]')) setOpen(false)
      }}>
        <Brand />
        <div className="nav-links">
          {links.map(([text, href]) => <a className="nav-link" key={href} href={href}>{text}</a>)}
        </div>
        <div className="nav-desktop"><HeaderActions path={path} /></div>
        <button type="button" ref={trigger} className="menu-trigger" aria-expanded={open} aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(previous => !previous)}>
          <span /><span /><span />
        </button>
        <div className="mobile-panel" id="mobile-menu" inert={!open} aria-hidden={!open}>
          <div className="mobile-panel-clip">
            {links.map(([text, href], index) => (
              <a className="mobile-link" key={href} href={href} style={{ '--menu-index': index }}>{text}</a>
            ))}
            <HeaderActions mobile path={path} />
          </div>
        </div>
      </nav>
    </header>
  )
}

export function SectionTitle({ label, children, center = false, reveal = true, className = '' }) {
  return (
    <div className={'section-title ' + (center ? 'text-center ' : '') + className}>
      {label && (
        <p className="eyebrow" data-reveal={reveal ? '' : undefined} data-enter-y="32">
          <span aria-hidden="true" />{label}
        </p>
      )}
      <h2 data-reveal={reveal ? '' : undefined}>{children}</h2>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-layout">
          <div className="footer-info">
            <Brand />
            <p>An AI writing workspace for teams that plan, draft, and review together.</p>
          </div>
          <div className="footer-menu">
            {footerLinks.map(([label, items]) => (
              <nav key={label} aria-label={label}>
                <p>{label}</p>
                <ul>
                  {items.map(([text, href]) => (
                    <li key={text}><a href={href}>{text}</a></li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <p className="copyright">© 2026 Decode</p>
      </div>
    </footer>
  )
}

