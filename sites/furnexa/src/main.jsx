import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Header, Icon, Logo } from './ui'
import { Home } from './home'
import { RoutePage, usesFullHero } from './pages'
import { catalog } from './catalog'
import { footerLinks } from './content'
import './styles.css'
import './pages.css'

const storageKey = 'furnexa-cart-v1'

function loadCart() {
  try {
    const rows = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return rows.flatMap(({ slug, color, quantity }) => {
      const item = catalog.find((product) => product.slug === slug)
      return item && [0, 1, 2].includes(color) && Number.isInteger(quantity) && quantity > 0
        ? [{ key: `${slug}:${color}`, item, color, quantity: Math.min(quantity, 10) }]
        : []
    })
  } catch {
    return []
  }
}

function Footer({ path }) {
  const [status, setStatus] = useState('')
  const footer = useRef(null)

  useGSAP(() => {
    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      for (const group of ['.footer-top', '.footer-main', '.footer-bottom']) {
        const block = footer.current.querySelector(group)
        gsap.from(block.children, { opacity: 0, y: 30, stagger: 0.09, duration: 0.72, ease: 'power3.out',
          scrollTrigger: { trigger: block, start: 'top 96%', once: true },
        })
      }
    })
    return () => motion.revert()
  }, { scope: footer, dependencies: [path], revertOnUpdate: true })

  return <footer className="footer" ref={footer}><div className="page-width">
    <div className="footer-top">
      <Logo />
      <form className="newsletter" onSubmit={(event) => { event.preventDefault(); setStatus('Email sign-ups are disabled in this storefront preview.') }}>
        <label htmlFor="newsletter-email">Email updates</label>
        <div className="newsletter-field"><input id="newsletter-email" type="email" required placeholder="Enter your email" autoComplete="email" /><button aria-label="Subscribe to the newsletter"><Icon name="right" /></button></div>
        {status && <p role="status" className="newsletter-status">{status}</p>}
      </form>
    </div>
    <div className="footer-main">
      <div className="footer-contact">
        <p>Well-made furniture for the rooms you live and work in every day.</p>
        <a className="contact-row" href="mailto:support@furnexa.com"><span><Icon name="email" size={16} /></span>support@furnexa.com</a>
        <a className="contact-row" href="tel:+18004528392"><span><Icon name="phone" size={15} /></span>+1 (800) 452-8392</a>
        <p className="contact-row"><span><Icon name="map" size={16} /></span><span>214 Westwood Avenue,<br />California, USA</span></p>
      </div>
      <nav className="footer-nav" aria-label="Footer navigation">
        {footerLinks.map(([title, links]) => <div key={title}><h3>{title}</h3><ul>{links.map(([label, path]) => <li key={path}><a href={path}>{label}</a></li>)}</ul></div>)}
      </nav>
    </div>
    <div className="footer-bottom"><p>© 2026 DCRAFTS. All rights reserved.</p>
      <div className="footer-social">{[['Facebook', 'facebook.com'], ['Instagram', 'instagram.com'], ['Twitter', 'twitter.com']].map(([label, domain]) =>
        <a className="round-button" href={`https://${domain}/`} key={domain} aria-label={label}><Icon name={label.toLowerCase()} size={16} /></a>)}</div>
    </div>
  </div></footer>
}

function App() {
  const [locationUrl, setLocationUrl] = useState(() => new URL(window.location.href))
  const { pathname: path, search } = locationUrl
  const isHome = path === '/' || /^\/home\/?$/.test(path)
  const [cart, setCart] = useState(loadCart)
  const [cartRequested, requestCart] = useState(0)

  useEffect(() => {
    const pop = () => setLocationUrl(new URL(window.location.href))
    window.addEventListener('popstate', pop)
    return () => window.removeEventListener('popstate', pop)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart.map(({ item, color, quantity }) => ({ slug: item.slug, color, quantity }))))
    } catch {
      // Keep the cart available for the current tab if storage is unavailable.
    }
  }, [cart])

  function navigate(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.target.closest('a[href]')
    if (!link || link.target || link.hasAttribute('download')) return
    const url = new URL(link.href)
    if (url.origin !== location.origin || url.hash) return
    event.preventDefault()
    if (url.pathname !== path || url.search !== search) {
      history.pushState(null, '', url.pathname + url.search)
      setLocationUrl(url)
    }
    if (url.pathname !== path || !url.pathname.startsWith('/blog')) window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function addToCart(item, color, quantity) {
    const key = `${item.slug}:${color}`
    setCart((lines) => lines.some((line) => line.key === key)
      ? lines.map((line) => line.key === key ? { ...line, quantity: Math.min(10, line.quantity + quantity) } : line)
      : [...lines, { key, item, color, quantity }])
    requestCart((value) => value + 1)
  }

  function updateCart(key, quantity) {
    setCart((lines) => quantity > 0
      ? lines.map((line) => line.key === key ? { ...line, quantity } : line)
      : lines.filter((line) => line.key !== key))
  }

  return <div onClick={navigate}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header inner={!isHome && !usesFullHero(path)} cart={cart} cartRequested={cartRequested} onCartUpdate={updateCart} />
    {isHome ? <Home /> : <RoutePage key={path} path={path} search={search} cart={cart} addToCart={addToCart} />}
    <Footer path={path} />
  </div>
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)

if (import.meta.hot) import.meta.hot.dispose(() => root.unmount())
