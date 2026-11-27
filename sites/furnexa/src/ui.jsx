import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { categories, navigation } from './content'
import { amount, articles, catalog, colors, money } from './catalog'

const icons = {
  search: <><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4 4"/></>,
  cart: <><path d="M3 10h18l-2 9H5l-2-9Zm4 0 4-6m6 6-4-6M8.5 13l.5 3m3-3v3m3.5-3-.5 3"/></>,
  menu: <path d="M4 7h16M7 12h13M11 17h9"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  left: <path d="M19 12H5m0 0 5-5m-5 5 5 5"/>,
  right: <path d="M5 12h14m0 0-5-5m5 5-5 5"/>,
  diagonal: <path d="M6 18 18 6m-10 0h10v10"/>,
  play: <path d="m9 5 10 7-10 7V5Z"/>,
  email: <path d="M3 6h18v12H3zM3 6l9 7 9-7"/>,
  phone: <path d="M7 3H4c-1 0-1 2-1 3 1 8 7 14 15 15 1 0 3 0 3-1v-3l-5-3-2 2a12 12 0 0 1-6-6l2-2-3-5Z"/>,
  map: <><path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  filter: <path d="M3 4h18l-7 8v6l-4 2v-8Z"/>,
  support: <path d="M4 13v-2a8 8 0 0 1 16 0v6a4 4 0 0 1-4 4h-3m-9-9h4v6H4zm12 0h4v6h-4z"/>,
  location: <path d="m21 3-6 18-4-8-8-4Z"/>,
  payment: <path d="M3 5h18v14H3zm0 5h18M6 15h4"/>,
  truck: <><path d="M2 5h12v13H2zm12 5h4l4 4v4h-8"/><circle cx="6" cy="18" r="2" fill="white"/><circle cx="18" cy="18" r="2" fill="white"/></>,
  return: <path d="m9 4-5 5 5 5M4 9h10a6 6 0 0 1 0 12h-3"/>,
  award: <><circle cx="12" cy="9" r="6"/><path d="m8 14-1 8 5-3 5 3-1-8"/></>,
  chair: <path d="M7 4h10v7H7zM5 12h14v4H5zm2 4v4m10-4v4M7 9H4v6m13-6h3v6"/>,
  cabinet: <path d="M5 3h14v18H5zm0 6h14M5 15h14m-8-9h2m-2 6h2m-2 6h2"/>,
  lamp: <path d="M8 3h8l4 10H4Zm4 10v8m-4 0h8"/>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/></>,
  facebook: <path d="M14 21v-8h3l.5-4H14V7c0-1 .5-2 3-2V2h-2c-3 0-5 1-5 5v2H7v4h3v8"/>,
  twitter: <path d="M4 4h4l12 16h-4zm0 16L20 4"/>,
}

export function Icon({ name, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>
}

export function Photo({ file, alt = '', eager = false, ...props }) {
  return <img src={`/media/${file}`} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false" {...props} />
}

export function Logo() {
  return <a className="logo" href="/" aria-label="DCRAFTS home"><Photo file="dcrafts.svg" eager /></a>
}

export function Cta({ to, children, plain = false, type }) {
  if (plain) return <a href={to} className="text-cta">{children}<Icon name="right" size={16} /></a>

  const faces = <>
    <span className="cta-label">{children}</span>
    <span className="cta-face cta-front" aria-hidden="true">{children}</span>
    <span className="cta-face cta-back" aria-hidden="true">{children}</span>
  </>
  return type === 'submit'
    ? <button className="cta" type="submit">{faces}</button>
    : <a className="cta" href={to}>{faces}</a>
}

export function ArrowControls({ label, move, children }) {
  return <div className="arrows" role="group" aria-label={label}>
    {children}
    <button type="button" aria-label={`Previous ${label.toLowerCase()}`} onClick={() => move(-1)}><Icon name="left" /></button>
    <button type="button" aria-label={`Next ${label.toLowerCase()}`} onClick={() => move(1)}><Icon name="right" /></button>
  </div>
}

function NavLinks({ close }) {
  return navigation.map(([name, path]) => <a key={path} href={path} onClick={close}>{name}</a>)
}

const searchItems = [
  ...catalog.map((item) => [item.name, `/shop/${item.slug}`, item.file || `product-${item.image}.jpg`]),
  ...categories.map((item) => [item.name, `/shop/${item.slug}`, `category-${item.image ?? item.slug}.png`]),
  ...articles.map((item) => [item.name, `/blog/${item.slug}`, `blog-${item.image}.jpg`]),
]

export function Header({ inner, cart, cartRequested, onCartUpdate }) {
  const [dark, setDark] = useState(false)
  const [panel, setPanel] = useState(null)
  const [query, setQuery] = useState('')
  const dialog = useRef(null)
  const trigger = useRef(null)
  const panelContent = useRef(null)
  const results = query.trim() ? searchItems.filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase())) : []
  const count = cart.reduce((total, line) => total + line.quantity, 0)
  const subtotal = cart.reduce((total, line) => total + amount(line.item.price) * line.quantity, 0)

  useEffect(() => {
    if (cartRequested) {
      trigger.current = document.activeElement
      setPanel('cart')
    }
  }, [cartRequested])

  useEffect(() => {
    const updateHeader = () => setDark(window.scrollY > 80)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  useGSAP(() => {
    if (!panel) return
    const element = dialog.current
    element.showModal()
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.from(panelContent.current, { opacity: 0, x: panel === 'cart' ? 40 : 0, y: panel === 'menu' ? -18 : 0, duration: 0.3, ease: 'power2.out' })
    }
    return () => { if (element.open) element.close() }
  }, { dependencies: [panel], revertOnUpdate: true })

  function open(event, next) {
    trigger.current = event.currentTarget
    setQuery('')
    setPanel(next)
  }

  function close() {
    setPanel(null)
    requestAnimationFrame(() => trigger.current?.focus())
  }

  return <>
    <header className={`header${dark || inner ? ' header-dark' : ''}`}>
      <div className="page-width header-inner flex items-center justify-between">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation"><NavLinks /></nav>
        <div className="header-actions flex items-center">
          <button className="round-button" aria-label="Search" aria-haspopup="dialog" onClick={(event) => open(event, 'search')}><Icon name="search" size={18} /></button>
          <button className="round-button cart-button" aria-label={`Cart, ${count} items`} aria-haspopup="dialog" onClick={(event) => open(event, 'cart')}><Icon name="cart" size={20} /><span className="cart-count" aria-hidden="true">{count}</span></button>
          <button className="round-button menu-button" aria-label="Open menu" aria-haspopup="dialog" onClick={(event) => open(event, 'menu')}><Icon name="menu" size={22} /></button>
        </div>
      </div>
    </header>
    {panel && <dialog ref={dialog} className={`overlay overlay-${panel}`} aria-label={{ cart: 'Your cart', menu: 'Menu', search: 'Search DCRAFTS' }[panel]}
      onCancel={(event) => { event.preventDefault(); close() }} onClick={(event) => { if (event.target === event.currentTarget) close() }}>
      {panel === 'menu' && <div ref={panelContent} className="menu-panel">
        <div className="page-width header-inner flex items-center justify-between"><Logo /><button className="round-button" aria-label="Close menu" onClick={close}><Icon name="close" /></button></div>
        <nav aria-label="Main navigation"><NavLinks close={close} /></nav>
      </div>}
      {panel === 'search' && <div ref={panelContent} className="search-panel">
        <label className="search-field flex items-center"><Icon name="search" /><span className="sr-only">Search</span><input autoFocus type="search" placeholder="Find a piece…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        {!!query.trim() && <ul className="search-results" aria-live="polite">
          {results.length ? results.map(([name, path, photo]) => <li key={path}><a href={path} onClick={close}><Photo file={photo} alt="" />{name}<Icon name="right" size={18} /></a></li>) : <li className="no-results">No matches</li>}
        </ul>}
      </div>}
      {panel === 'cart' && <div ref={panelContent} className="cart-panel">
        <div className="cart-heading flex items-center justify-between"><p>Your cart <span>{count}</span></p><button aria-label="Close cart" onClick={close}><Icon name="close" size={24} /></button></div>
        {count === 0 ? <p className="empty-cart">No items in your cart</p> : <ul className="cart-lines">
          {cart.map(({ item, color, key, quantity }) => <li key={key}>
            <Photo file={item.file || `product-${item.image}.jpg`} />
            <div><a href={`/shop/${item.slug}`} onClick={close}>{item.name}</a><p>{colors[color][0]} · {item.price}</p>
              <Quantity quantity={quantity} onChange={(value) => onCartUpdate(key, value)} />
              <button className="remove-line" onClick={() => onCartUpdate(key, 0)}>Remove</button>
            </div>
          </li>)}
        </ul>}
        <div className="cart-total"><p>Subtotal <span>{money(subtotal)}</span></p>{count ? <a href="/checkout" className="solid-button" onClick={close}>Checkout</a> : <button type="button" disabled>Checkout</button>}</div>
      </div>}
    </dialog>}
  </>
}

export function Quantity({ quantity, onChange }) {
  return <div className="quantity" aria-label="Quantity selector">
    <button type="button" disabled={quantity <= 1} onClick={() => onChange(quantity - 1)} aria-label="Decrease quantity">−</button>
    <output aria-label="Quantity">{quantity}</output>
    <button type="button" disabled={quantity >= 10} onClick={() => onChange(quantity + 1)} aria-label="Increase quantity">+</button>
  </div>
}
