import { useEffect, useRef, useState } from 'react'
import { navigation, socialLinks } from './content.js'

export function Icon({ name, size = 16 }) {
  const paths = {
    left: 'M12 8H4m4 4L4 8l4-4',
    right: 'M4 8h8m-4 4 4-4-4-4',
    plus: 'M3 8h10M8 3v10',
  }
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" fill="none">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function Media({ name, alt = '', eager = false, className }) {
  const src = name.includes('.') ? name : name + '.webp'
  return <img className={className} src={'/media/' + src} alt={alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async" />
}

export function RollingLink({ href, children, className = '', ...props }) {
  return (
    <a href={href} className={'roll-link ' + className} {...props}>
      <span className="roll-rest">{children}</span>
      <span className="roll-next" aria-hidden="true">
        {Array.from(children).map((letter, index) => (
          <span style={{ '--delay': index * 10 + 'ms' }} key={index}>{letter === ' ' ? '\u00a0' : letter}</span>
        ))}
      </span>
    </a>
  )
}

export function Action({ href, children, light = false }) {
  return <RollingLink href={href} className={'outline-link ' + (light ? 'outline-link--light' : '')}>{children}</RollingLink>
}

export function Navigation({ path, light = true }) {
  const dialog = useRef(null)
  const button = useRef(null)
  const [open, setOpen] = useState(false)

  function openMenu() {
    dialog.current.showModal()
    setOpen(true)
  }

  function closeMenu() {
    dialog.current.close()
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className={'header ' + (light ? '' : 'header--ink')}>
        <a className="mobile-brand" href="/" aria-label="dcd home" aria-current={path === '/' ? 'page' : undefined}>dcd</a>
        <nav className="main-nav" aria-label="Main navigation" data-nav-entry>
          {navigation.map(([label, url]) => (
            <RollingLink key={url} href={url} aria-current={path === url ? 'page' : undefined}>{label.toUpperCase()}</RollingLink>
          ))}
        </nav>
      </header>
      <button ref={button} className="menu-toggle" type="button" onClick={openMenu}
        aria-label="Open menu" aria-haspopup="dialog" aria-controls="menu-panel" aria-expanded={open}>
        <MenuMark />
      </button>
      <dialog className="menu-dialog" id="menu-panel" ref={dialog} aria-label="Site menu"
        onClose={() => { setOpen(false); button.current?.focus({ preventScroll: true }) }}
        onClick={(event) => { if (event.target === event.currentTarget) closeMenu() }}>
        <div className="menu-layout">
          <nav className="menu-links" aria-label="Menu navigation">
            {navigation.map(([label, url], index) => (
              <RollingLink key={url} href={url} onClick={closeMenu} style={{ '--menu-index': index }}>{label}</RollingLink>
            ))}
          </nav>
          <button className="menu-toggle menu-toggle--close" type="button" onClick={closeMenu} aria-label="Close menu" autoFocus><MenuMark close /></button>
        </div>
      </dialog>
    </>
  )
}

function MenuMark({ close = false }) {
  return <span aria-hidden="true" className={'menu-mark ' + (close ? 'menu-mark--close' : '')}><i /><i /><i /></span>
}

export function Grain({ strength = '' }) {
  return <span className={'grain ' + strength} aria-hidden="true" />
}

export function StudioFilm() {
  const ref = useRef(null)

  useEffect(() => {
    const video = ref.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false

    const update = () => {
      if (visible && !motion.matches && !document.hidden) video.play().catch(() => {})
      else video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(video)
    motion.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
      video.pause()
    }
  }, [])

  return <video className="studio-film" ref={ref} src="/media/studio-film.mp4" poster="/media/studio-poster.png" muted loop playsInline preload="none" aria-hidden="true" />
}

export function WordReveal({ children, className = '', as: Tag = 'span', ...props }) {
  const tokens = children.split(/(\s+)/)
  return (
    <Tag className={'word-reveal ' + className} aria-label={children} {...props}>
      {tokens.map((word, index) => /^\s+$/.test(word) ? word : (
        <span key={index} aria-hidden="true" data-word>{word}</span>
      ))}
    </Tag>
  )
}

export function ContactBanner() {
  return (
    <section className="contact-banner" aria-labelledby="contact-banner-title">
      <div className="contact-motif" aria-hidden="true">
        <StudioFilm />
        <Grain />
      </div>
      <h2 className="contact-big" id="contact-banner-title"><span>Good Work</span>{' '}<span>Starts Here</span></h2>
      <Action href="/contact" light>TELL US YOUR IDEA</Action>
      <div className="contact-facts gutters">
        <span>EST. 2016</span><span>BRAND &amp; EDITORIAL</span><span>NEW YORK STUDIO</span><span>50+ BRAND PROJECTS</span>
      </div>
    </section>
  )
}

export function Footer() {
  const [message, setMessage] = useState('')

  return (
    <footer className="site-footer gutters">
      <div className="footer-content">
        <div className="newsletter">
          <div data-reveal>
            <h2>Notes in your inbox.</h2>
            <p>Get new essays and studio updates by email.</p>
          </div>
          <form data-reveal onSubmit={(event) => { event.preventDefault(); setMessage('The newsletter form is inactive in this local preview.') }}>
            <input name="email" type="email" placeholder="you@example.com" aria-label="Email address" required autoComplete="email" />
            <button type="submit">SUBSCRIBE</button>
          </form>
          {message && <p role="status" className="form-status">{message}</p>}
        </div>
        <div className="footer-right">
          <div className="footer-nav" data-reveal>
            <nav aria-label="Footer navigation">
              {navigation.map(([label, url]) => <RollingLink href={url} key={url}>{label}</RollingLink>)}
            </nav>
            <nav aria-label="Social media">
              {socialLinks.map(([label, url]) => <RollingLink href={url} key={url} target="_blank" rel="noreferrer">{label}</RollingLink>)}
            </nav>
          </div>
          <address data-reveal><a href="tel:2125550198">+1 (212) 555-0198</a><a href="mailto:hello@decode.studio">hello@decode.studio</a></address>
        </div>
        <a className="site-credit" href="https://lunisdesign.com/" target="_blank" rel="noreferrer">ORIGINAL DESIGN BY LUNIS. RIGHTS RESERVED.</a>
      </div>
      <div className="footer-wordmark" data-reveal>Decode Studio</div>
    </footer>
  )
}
