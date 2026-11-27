import { useEffect, useRef, useState } from 'react'
import { boxes, catalog, flavours, money, nav, promises, questions, reviews } from './content.js'
import { cartLines, loadCart, saveCart } from './cart.js'
import { ArrowLink, Display, Donut, Edge, RouteHero, Seal, Sparkle } from './ui.jsx'
import { BoxBuilder, CartExtras, CartItems, CartPage, ProductPage, Shop } from './StorePages.jsx'
import { Contact, Delivery, Legal, Locations, Story } from './InfoPages.jsx'
import { useLandingMotion } from './motion.js'
import './routes.css'

const ticker = ['belgian dark cocoa', 'baked at 5am', 'dunked twice', 'no shortcuts', 'boxes of 6 & 12', 'delivered warm']
const path = location.pathname.replace(/\/+$/, '') || '/'
const isHome = path === '/'
const activeNav = `/${path.split('/')[1]}`
const product = catalog.find(item => path === `/shop/${item.slug}`)
const pageNames = { '/shop': 'Shop all donuts', '/build-a-box': 'Build a box', '/our-story': 'Our story', '/delivery': 'Delivery & FAQ', '/contact': 'Contact', '/find-a-shop': 'Find a shop', '/cart': 'Your box', '/privacy': 'Privacy policy', '/terms': 'Terms of service' }

function Icon({ kind }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === 'cart' && <><path d="M2.5 3h3l2.4 10.6a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.1l1.4-6.5H6.5" /><path d="M10 20h.02m7.2 0h.02" strokeWidth="3.2" /></>}
      {kind === 'menu' && <path d="M4 7h16M4 12h14M4 17h10" />}
      {kind === 'close' && <path d="m6 6 12 12m0-12L6 18" />}
    </svg>
  )
}

function Navigation({ count, onBox }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const mobile = useRef(null)
  const toggle = useRef(null)

  useEffect(() => {
    if (!menuOpen) return

    const dismissOutside = (event) => {
      if (!mobile.current.contains(event.target)) setMenuOpen(false)
    }
    const dismissOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggle.current.focus()
      }
    }
    document.addEventListener('pointerdown', dismissOutside)
    document.addEventListener('keydown', dismissOnEscape)
    return () => {
      document.removeEventListener('pointerdown', dismissOutside)
      document.removeEventListener('keydown', dismissOnEscape)
    }
  }, [menuOpen])

  return (
    <nav className="nav" aria-label="Main navigation" ref={mobile}>
      <div className="nav-links nav-left">
        {nav.slice(0, 3).map(([label, href]) => <a key={href} href={href} aria-current={activeNav === href ? 'page' : undefined}>{label}</a>)}
      </div>
      <a className="wordmark" href={isHome ? '#top' : '/'} aria-label="dcdonut home" onClick={() => setMenuOpen(false)}>dcdonut</a>
      <div className="nav-right flex items-center">
        <div className="nav-links">
          {nav.slice(3).map(([label, href]) => <a key={href} href={href} aria-current={activeNav === href ? 'page' : undefined}>{label}</a>)}
        </div>
        <button className="round-button cart-toggle" type="button" aria-label="Your box" aria-haspopup="dialog" onClick={() => { setMenuOpen(false); onBox() }}>
          <Icon kind="cart" />{count > 0 && <span className="cart-count">{count}</span>}
        </button>
        <button className="round-button menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Menu'} ref={toggle} onClick={() => setMenuOpen(!menuOpen)}>
          <Icon kind={menuOpen ? 'close' : 'menu'} />
        </button>
      </div>
      <div className="mobile-menu" id="mobile-menu" hidden={!menuOpen} inert={!menuOpen}>
        {[0, 1, 2, 5, 3, 4].map((index) => {
          const [label, href] = nav[index]
          return <a key={href} href={href} aria-current={activeNav === href ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{index === 3 ? 'delivery & faq' : label}<span aria-hidden="true">→</span></a>
        })}
        <span className="menu-note">order by 2pm · lands warm same-day</span>
      </div>
    </nav>
  )
}

function Hero({ count, onBox }) {
  return (
    <header className="hero" id="top">
      <div className="hero-stage">
        <Navigation count={count} onBox={onBox} />
        <Display as="h1" className="hero-heading">DUNKED DAILY</Display>
        <div className="hero-ticker" aria-hidden="true">
          <div className="ticker-track">
            {[0, 1, 2].map(group => <div className="ticker-group" key={group}>{ticker.map(label => <span key={label}>{label}<b>✦</b></span>)}</div>)}
          </div>
        </div>
        <div className="hero-art"><Donut className="hero-donut" kind="hero" alt="Chocolate glazed donut with sprinkles" eager /></div>
        <p className="hero-copy">Rich chocolate donuts,<br />baked fresh every morning.</p>
        <div className="hero-action"><ArrowLink href="/shop">shop the drop</ArrowLink></div>
        <div className="sprinkles" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>
        <div className="hero-badge"><Seal badge /><div className="hero-badge-copy"><span>NEW</span><strong>triple<br />cocoa</strong></div></div>
      </div>
    </header>
  )
}

function Flavour({ flavour, index, onAdd, recentlyAdded }) {
  const { id, word, name, alt, price, note, description } = flavour
  return (
    <>
      <div className="flavour-anchor" aria-hidden="true" />
      <section className={`flavour flavour-${id}`} id={index === 0 ? 'flavours' : undefined} aria-labelledby={`flavour-${id}`}>
        <Edge />
        <div className="flavour-stage">
          <div className="flavour-eyebrow flex items-center justify-between"><span>pick your dunk</span><small>0{index + 1} / 03</small></div>
          <div id={`flavour-${id}`}><Display className="flavour-word">{word}</Display></div>
          <div className="flavour-art"><Donut className="flavour-image" kind={id} alt={alt} /></div>
          <div className="flavour-tag"><span>{name}</span></div>
          <div className="flavour-add">
            <button type="button" aria-label={`Add ${name} to your box`} onClick={() => onAdd(id)}>
              {recentlyAdded === id ? <>added<br /><span>✓</span></> : <>add to<br /><span>box +</span></>}
            </button>
          </div>
          {[0, 1, 2].map(i => <Sparkle className={`flavour-sparkle sparkle-${i}`} key={i} />)}
          <div className="flavour-description"><p>{description}</p><small>{money(price)} each&nbsp; · &nbsp;{note}</small></div>
        </div>
      </section>
    </>
  )
}

function BoxPlans() {
  return (
    <section className="box-plans section-field" id="build-a-box">
      <Edge />
      <div className="content-width">
        <div className="section-intro text-center" data-heading>
          <span className="eyebrow">pick · pack · dunk</span>
          <Display>BUILD YOUR BOX</Display>
          <p>Mix any flavours you like. We bake at 5am and ship them warm, straight to your door.</p>
        </div>
        <Sparkle className="plan-sparkle-one" />
        <Sparkle className="plan-sparkle-two" />
        <div className="plans-grid grid grid-cols-1 md:grid-cols-3">
          {boxes.map(box => (
            <article className={`plan plan-${box.id}`} key={box.id}>
              <div className="plan-top flex justify-between"><h3>{box.name}</h3><span>{box.count} donuts</span></div>
              {box.id === 'dozen' && <span className="plan-favourite">most loved ♥</span>}
              <div className="plan-art">{box.images.map(kind => <Donut key={kind} kind={kind} />)}</div>
              <div className="plan-bottom flex items-end justify-between">
                <div><strong>{money(box.price)}</strong><p>{box.note}</p></div>
                <a className="small-link" href={`/build-a-box?size=${box.id}`}>add box +</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PromiseSection() {
  return (
    <section className="promise section-field">
      <Edge />
      <div className="content-width promise-layout">
        <div className="promise-intro" data-heading>
          <span className="eyebrow">our promise</span>
          <Display className="stacked">THE DCDONUT WAY</Display>
          <p>Four rules we never break. Not on Mondays, not on holidays, not ever.</p>
          <div className="promise-art"><Seal /><div className="promise-donut-float"><Donut kind="hero" /></div></div>
        </div>
        <div className="promise-rows">
          {promises.map(([name, text, kind], i) => (
            <article key={name}>
              <div className="promise-row-content" data-reveal><span className="rule-number">0{i + 1}</span><div><h3>{name}</h3><p>{text}</p></div><Donut kind={kind} /></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="reviews section-field">
      <Edge />
      <div className="content-width reviews-layout">
        <div className="reviews-intro" data-heading>
          <span className="eyebrow">the verdict is in</span>
          <Display className="stacked">DUNKERS SAY</Display>
          <p>12,400 boxes later, here’s what our dunkers keep telling us. Keep scrolling for the love.</p>
          <div className="rating flex items-center">
            <div className="rating-avatars" aria-hidden="true">{['cocoa', 'berry', 'hazel', 'hero'].map(kind => <Donut key={kind} kind={kind} />)}<b>+12k</b></div>
            <strong>4.9</strong><div><span aria-label="5 stars">★★★★★</span><p>12,400 happy dunkers</p></div>
          </div>
        </div>
        <div className="review-list">
          {reviews.map(([quote, name, item, kind], i) => (
            <article className={`review-card review-${i}`} key={name}>
              <div className="review-top flex items-center justify-between"><span aria-label="5 stars">★★★★★</span><small>0{i + 1} / 04</small></div>
              <blockquote>“{quote}”</blockquote>
              <div className="review-byline flex items-center"><Donut kind={kind} /><div><b>{name}</b><small>{item}</small></div></div>
              <Donut className="review-art" kind={kind} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section className="faq section-field" id="faq">
      <Edge />
      <div className="section-intro text-center" data-heading>
        <span className="eyebrow">good to know</span>
        <Display>GOT QUESTIONS?</Display>
        <p>Everything you need to know before your first dunk.</p>
      </div>
      <div className="faq-grid grid grid-cols-1 md:grid-cols-2">
        {questions.map(([question, answer]) => <article className="faq-card" key={question}><span aria-hidden="true">?</span><div><h3>{question}</h3><p>{answer}</p></div></article>)}
      </div>
      <div className="help-band flex items-center justify-center"><p>Still curious? We reply faster than a donut disappears.</p><ArrowLink href="/contact">chat with us</ArrowLink></div>
    </section>
  )
}

const footerLinks = [
  ['shop', [['all donuts', '/shop'], ['build a box', '/build-a-box'], ['your box', '/cart']]],
  ['dcdonut', [['our story', '/our-story'], ['find a shop', '/find-a-shop'], ['contact us', '/contact']]],
  ['help', [['delivery', '/delivery'], ['faq', '/delivery#faq'], ['privacy', '/privacy'], ['terms', '/terms']]],
]

function Footer() {
  const [signupMessage, setSignupMessage] = useState('')
  return (
    <footer className="footer section-field">
      <Edge />
      <div className="content-width">
        <div className="footer-top">
          <div className="footer-news" data-reveal>
            <span className="eyebrow">the dunk club</span>
            <h3>First dibs on<br />every fresh drop.</h3>
            <p>New flavours, secret menus and a free donut on your birthday. No spam, just sprinkles.</p>
            <form className="newsletter flex" onSubmit={event => { event.preventDefault(); setSignupMessage('Signup is unavailable in this preview.') }}>
              <label className="sr-only" htmlFor="club-email">Your email address</label>
              <input id="club-email" type="email" name="email" placeholder="your email address" autoComplete="email" required />
              <button type="submit">sign me up</button>
            </form>
            <p className="newsletter-status" role="status">{signupMessage}</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation" data-reveal>
            {footerLinks.map(([heading, links]) => <div key={heading}><h4>{heading}</h4>{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>)}
          </nav>
        </div>
        <div className="footer-art">
          <p data-reveal>life’s better when it’s</p>
          <div className="footer-logo">dcdonut</div>
          <span className="drag-hint">(go on, drag a donut)</span>
          {['cocoa', 'berry', 'hazel', 'hero'].map((kind, i) => <div className={`drag-donut drag-${i}`} data-drag key={kind}><div className="drag-donut-hover"><Donut kind={kind} /></div></div>)}
        </div>
        <div className="footer-bottom">
          <p>© 2026 dcdonut</p>
          <div className="socials flex flex-wrap justify-center">{['instagram', 'tiktok', 'pinterest'].map(name => <a key={name} href={`https://${name}.com/`}>{name}</a>)}</div>
          <p>baked fresh · never frozen</p>
        </div>
      </div>
    </footer>
  )
}

function BoxDrawer({ dialog, lines, items, count, total, change, remove }) {
  const outsidePress = useRef(false)
  const outside = event => {
    const rect = dialog.current.getBoundingClientRect()
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom
  }

  return (
    <dialog className="drawer" ref={dialog} aria-labelledby="drawer-title" closedby="any"
      onPointerDown={event => { outsidePress.current = outside(event) }}
      onPointerUp={event => { if (!('closedBy' in dialog.current) && outsidePress.current && outside(event)) dialog.current.close() }}>
      <div className="drawer-heading flex items-center">
        <h1 id="drawer-title">your box</h1><span>{count ? `${count} ${count === 1 ? 'item' : 'items'}` : 'empty'}</span>
        <form method="dialog"><button className="round-button" type="submit" aria-label="Close cart" autoFocus><Icon kind="close" /></button></form>
      </div>
      <div className="drawer-scroll">
        <div className="delivery-meter">
          <p>{total === 0 ? 'free delivery on orders over $40' : total < 4000 ? `add ${money(4000 - total)} more for free delivery` : 'you unlocked free delivery!'}</p>
          <progress value={Math.min(total, 4000)} max="4000" aria-label="Free delivery progress" />
        </div>
        <CartItems lines={lines} change={change} remove={remove} />
        <CartExtras items={items} change={change} />
      </div>
      <div className="drawer-bottom">
        <div className="flex items-center justify-between"><p>subtotal</p><strong>{money(total)}</strong></div>
        <p>delivery and taxes are worked out at checkout.</p>
        <a className="small-link drawer-view" href="/cart" onClick={() => dialog.current.close()}>view your box →</a>
        <form method="dialog"><button className="text-link" type="submit">keep shopping</button></form>
      </div>
    </dialog>
  )
}

export default function App() {
  const page = useRef(null)
  const dialog = useRef(null)
  const addedTimer = useRef(null)
  const [items, setItems] = useState(loadCart)
  const [recentlyAdded, setRecentlyAdded] = useState('')
  const lines = cartLines(items)
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce((sum, line) => sum + line.quantity * line.price, 0)
  useLandingMotion(page, isHome)

  useEffect(() => saveCart(items), [items])
  useEffect(() => {
    const restoreCart = event => { if (event.persisted || event.key === 'dunkly-box-v1') setItems(loadCart()) }
    window.addEventListener('pageshow', restoreCart)
    window.addEventListener('storage', restoreCart)
    const name = product?.name || pageNames[path]
    if (!isHome) document.title = `${name || 'Page not found'} — dcdonut`
    const fragment = location.hash.slice(1)
    if (!isHome && fragment) document.getElementById(fragment)?.scrollIntoView()
    return () => {
      window.removeEventListener('pageshow', restoreCart)
      window.removeEventListener('storage', restoreCart)
    }
  }, [])
  useEffect(() => () => clearTimeout(addedTimer.current), [])

  function change(id, delta) {
    setItems(current => ({ ...current, [id]: Math.max(0, (current[id] || 0) + delta) }))
  }

  function addFlavour(id, quantity = 1) {
    change(id, quantity)
    setRecentlyAdded(id)
    clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setRecentlyAdded(''), 1000)
  }

  const openBox = () => dialog.current.showModal()
  const remove = id => setItems(current => ({ ...current, [id]: 0 }))
  const cart = { lines, items, count, total, change, remove }
  const store = { add: addFlavour, recentlyAdded }
  const pages = {
    '/shop': <Shop {...store} />,
    '/build-a-box': <BoxBuilder addBundle={id => { change(id, 1); openBox() }} />,
    '/cart': <CartPage {...cart} />,
    '/our-story': <Story />,
    '/find-a-shop': <Locations />,
    '/delivery': <Delivery />,
    '/contact': <Contact />,
    '/privacy': <Legal type="privacy" />,
    '/terms': <Legal type="terms" />,
  }

  return (
    <div ref={page} className={isHome ? 'page' : 'page route-page'}>
      {isHome ? <>
        <Hero count={count} onBox={openBox} />
        <main>
          {flavours.map((flavour, index) => <Flavour key={flavour.id} flavour={flavour} index={index} onAdd={addFlavour} recentlyAdded={recentlyAdded} />)}
          <BoxPlans /><PromiseSection /><Reviews /><FAQ />
        </main>
      </> : <>
        <header className="route-header"><div className="hero-stage"><Navigation count={count} onBox={openBox} /></div></header>
        <main className="route-main">
          {product ? <ProductPage item={product} {...store} /> : pages[path] || <RouteHero title="PAGE NOT FOUND" text="This page is out of the box."><ArrowLink href="/">back to dcdonut</ArrowLink></RouteHero>}
        </main>
      </>}
      <Footer />
      <BoxDrawer dialog={dialog} {...cart} />
      <span className="sr-only" role="status">{recentlyAdded ? `${catalog.find(item => item.id === recentlyAdded).name} added to your box.` : ''}</span>
    </div>
  )
}
