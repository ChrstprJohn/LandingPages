import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './styles.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)
const root = document.getElementById('root')
const links = [['#top', 'Home'], ['#about', 'About'], ['#services', 'Services'], ['#contact', 'Contact']]
const flowers = [
 { name: 'Bouquets', image: 'poppies', id: 'bouquets', copy: 'Expressive seasonal flowers for everyday gestures and meaningful moments. A mix of color, texture, and naturally beautiful shapes.' },
 { name: 'Subscriptions', image: 'peony', id: 'subscriptions', copy: 'Make room for a little beauty in your routine. Seasonal arrangements for your home or workspace, with something new to look forward to.' },
 { name: 'Gifts', image: 'blossom', id: 'gifts', copy: 'Say thank you, celebrate a new beginning, or let someone know they are on your mind. Thoughtful flowers for a personal gesture.' },
]
function Arrow() { return <svg viewBox="0 0 28 16" fill="none" aria-hidden="true"><path d="M1 8h24M19 2l6 6-6 6" stroke="currentColor" strokeWidth="1.2" /></svg> }
function BrandLogo({ onClick, decorative = false } = {}) {
 const Tag = decorative ? 'span' : 'a'
 return <Tag className="brand" href={decorative ? undefined : '#top'} aria-label={decorative ? undefined : 'FloraCo. home'} onClick={onClick}>
   <svg viewBox="0 0 230 60" aria-hidden="true">
     <g className="logo-icon" fill="currentColor">
       <circle cx="27" cy="30" r="24" fill="none" stroke="currentColor" strokeWidth="2" />
       {[0, 72, 144, 216, 288].map(angle => (
         <path key={angle} d="M27 27C21 24 19 17 24 13l3 3 3-3c5 4 3 11-3 14Z" transform={`rotate(${angle} 27 30)`} />
       ))}
       <circle cx="27" cy="30" r="2" />
     </g>
     <g className="logo-wordmark" fill="currentColor">
       <text x="62" y="45" fontSize="45">FloraCo.</text>
     </g>
   </svg>
 </Tag>
}
function Header() {
 const [menuOpen, setMenuOpen] = useState(false)
 const [menuClosing, setMenuClosing] = useState(false)
 const closeMenu = () => { if (menuOpen) setMenuClosing(true) }
 useEffect(() => {
   if (!menuClosing) return
   const timer = setTimeout(() => { setMenuOpen(false); setMenuClosing(false) }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 480)
   return () => clearTimeout(timer)
 }, [menuClosing])
 const [scrolled, setScrolled] = useState(false)
 useEffect(() => {
   const update = () => setScrolled(window.scrollY > 0)
   update()
   window.addEventListener('scroll', update, { passive: true })
   return () => window.removeEventListener('scroll', update)
 }, [])
 return <header className={scrolled ? 'header is-scrolled' : 'header'}>
   <BrandLogo onClick={closeMenu} />
   <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)}>
     <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
       <path d={menuOpen ? 'M5 5l14 14M19 5L5 19' : 'M3 6h18M3 12h18M3 18h18'} />
     </svg>
   </button>
   <nav id="main-navigation" className={menuOpen ? `is-open${menuClosing ? ' is-closing' : ''}` : undefined} aria-label="Main navigation">
     <div className="mobile-menu-header">
       <BrandLogo onClick={closeMenu} />
       <button className="menu-toggle" type="button" aria-label="Close navigation" onClick={closeMenu}>
         <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
       </button>
     </div>
     {links.map(([href, label]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}
   </nav>
 </header>
}
function FlowerPhoto({ flower, className = '' }) { return <span className={`collection-photo ${flower.image} ${className}`} role="img" aria-label={flower.image === 'poppies' ? 'Orange Icelandic poppies' : flower.image === 'peony' ? 'Pink peony petals' : 'Pink cherry blossom branches'} /> }
function Home() { return <><section id="top" className="hero" aria-labelledby="hero-title"><div className="hero-flowers" role="img" aria-label="Orange poppies, pink peonies and peach flowers against a red background" /><div className="hero-copy"><h1 id="hero-title">Seasonal<br />Blooms</h1><p>Fresh arrangements for life’s<br />meaningful moments.</p><a className="collection-link" href="#services">Explore services <Arrow /></a></div></section><section className="collections" aria-label="Flower services">{flowers.map(flower => <a className="collection" key={flower.id} aria-label={flower.name} href={`#${flower.id}`}><FlowerPhoto flower={flower} /></a>)}</section></> }
function About() { return <section id="about" className="content-page" aria-labelledby="about-title"><section className="about-layout"><div className="page-copy"><h2 className="section-title" id="about-title">A little closer <br />to nature.</h2><div className="about-description"><p>At FloraCo., flowers are a way to make an ordinary day feel meaningful. We take our cue from the season: expressive shapes, delicate textures, and colors that feel alive.</p><p>Each arrangement celebrates the natural character of the flowers. From a simple gesture to a special celebration, we believe beauty belongs in the moments you share.</p><a className="text-link" href="#services">Explore our services <Arrow /></a></div></div><FlowerPhoto flower={flowers[1]} className="about-photo" /></section></section> }
function Services({ onEnquire }) { return <section id="services" className="content-page" aria-labelledby="services-title"><div className="page-intro"><h2 className="section-title" id="services-title">Flowers for <br />your moments.</h2><p>Seasonal bouquets, thoughtful gifts, and flower subscriptions for every occasion.</p></div><div className="service-list">{flowers.map(flower => <section className="service-row" id={flower.id} key={flower.id}><FlowerPhoto flower={flower} /><div className="service-copy"><h3>{flower.name}</h3><div><p>{flower.copy}</p><a className="text-link" href="#contact" onClick={() => onEnquire(flower.id)}>Get in touch <Arrow /></a></div></div></section>)}</div></section> }
function Contact({ requestedService, onServiceChange }) {
 const [saved, setSaved] = useState(false)
 const [draft, setDraft] = useState(() => { try { return JSON.parse(localStorage.getItem('petal-enquiry')) || {} } catch { return {} } })
 const update = event => { if (event.target.name === 'service') onServiceChange(''); setDraft({ ...draft, [event.target.name]: event.target.value }); setSaved(false) }
 return <section id="contact" className="content-page" aria-labelledby="contact-title"><section className="contact-layout"><div className="page-copy"><h2 className="section-title" id="contact-title">Get in touch</h2><p>A bouquet, a celebration, or flowers for your space. Start with what you have in mind.</p><p className="contact-note">Sample contact details<br />Mobile: (212) 555-0142<br />Landline: (212) 555-0176<br />Email: hello@floraco.example</p></div><form className="enquiry-form" onSubmit={event => { event.preventDefault(); localStorage.setItem('petal-enquiry', JSON.stringify({ ...draft, service: requestedService || draft.service || 'bouquets' })); setSaved(true) }}><label>Your name<input name="name" autoComplete="name" value={draft.name || ''} onChange={update} required /></label><label>Email address<input name="email" type="email" autoComplete="email" value={draft.email || ''} onChange={update} required /></label><label>What do you have in mind?<select name="service" value={requestedService || draft.service || 'bouquets'} onChange={update}>{flowers.map(flower => <option value={flower.id} key={flower.id}>{flower.name}</option>)}</select></label><label>Your message<textarea name="message" rows="5" value={draft.message || ''} onChange={update} required placeholder="Tell us about the flowers, occasion, or colors you’re imagining." /></label><button className="collection-link" type="submit">Send enquiry <Arrow /></button><p className="form-note" role="status" hidden={!saved}>{saved ? 'Your enquiry is saved on this device. It has not been sent.' : ''}</p></form></section></section>
}
function App() {
 useEffect(() => {
   let idleTimer
   const showScrollbar = () => {
     const page = document.documentElement
     const thumb = document.querySelector('.scroll-indicator')
     const height = Math.max(32, window.innerHeight ** 2 / page.scrollHeight)
     thumb.style.height = `${height}px`
     thumb.style.transform = `translateY(${(window.innerHeight - height) * window.scrollY / Math.max(1, page.scrollHeight - window.innerHeight)}px)`
     document.documentElement.classList.add('is-scrolling')
     clearTimeout(idleTimer)
     idleTimer = setTimeout(() => document.documentElement.classList.remove('is-scrolling'), 900)
   }
   window.addEventListener('scroll', showScrollbar, { passive: true })
   return () => {
     window.removeEventListener('scroll', showScrollbar)
     clearTimeout(idleTimer)
     document.documentElement.classList.remove('is-scrolling')
   }
 }, [])
 useGSAP(() => {
   const motion = gsap.matchMedia()
   const allowMotion = '(prefers-reduced-motion: no-preference)'
   const reveal = element => {
     gsap.from(element, {
       opacity: 0.85,
       y: 4,
       duration: 0.32,
       ease: 'power2.out',
       clearProps: 'opacity,transform',
       scrollTrigger: { trigger: element, start: 'clamp(top bottom)', once: true },
     })
   }

   motion.add(allowMotion, () => {
     document.documentElement.classList.add('is-opening')
     gsap.timeline()
       .set('.opening-screen .logo-icon', { x: 88, rotation: -90, svgOrigin: '27 30' })
       .set('.opening-screen .logo-wordmark', { opacity: 0, y: 18 })
       .set('.opening-screen', { visibility: 'visible' })
       .to('.opening-screen .logo-icon', { rotation: 0, duration: 0.5, ease: 'sine.inOut' })
       .to('.opening-screen .logo-icon', { x: 0, duration: 0.65, ease: 'power3.inOut' })
       .to('.opening-screen .logo-wordmark', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
       .to('.opening-screen', { yPercent: -100, duration: 0.48, ease: 'power2.inOut' }, '+=0.65')
       .set('.opening-screen', { visibility: 'hidden', clearProps: 'transform' })
       .call(() => document.documentElement.classList.remove('is-opening'))

     gsap.utils.toArray('.page-intro, .service-row, .contact-layout', root).forEach(reveal)
     return () => document.documentElement.classList.remove('is-opening')
   }, root)
   motion.add(`${allowMotion} and (min-width: 701px)`, () => {
     reveal(root.querySelector('.about-layout'))
   }, root)
   return () => motion.revert()
 }, { scope: root })

 const [service, setService] = useState(() => {
   const requested = new URLSearchParams(location.search).get('service')
   return flowers.some(flower => flower.id === requested) ? requested : ''
 })
 useEffect(() => {
   const navigation = performance.getEntriesByType('navigation')[0]
   if (navigation?.type === 'reload') {
     window.scrollTo({ top: 0, behavior: 'instant' })
     return
   }
   const legacySection = links.find(([href]) => href.slice(1) === location.pathname.replace(/^\/|\/$/g, ''))
   const hash = location.hash || legacySection?.[0]
   if (legacySection) history.replaceState(null, '', '/' + hash)
   if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
 }, [])
 return <>
   <div className="scroll-indicator" aria-hidden="true" />
   <div className="opening-screen" aria-hidden="true"><BrandLogo decorative /></div>
   <a className="skip-link" href="#main-content">Skip to content</a>
   <Header />
   <main className="storefront" id="main-content" tabIndex={-1}>
     <Home />
     <About />
     <Services onEnquire={setService} />
     <Contact requestedService={service} onServiceChange={setService} />
   </main>
   <footer className="footer">
     <div className="footer-links">
       <div className="footer-brand">
         <BrandLogo />
         <p>Seasonal bouquets, flower subscriptions, and thoughtful gifts for everyday moments and special occasions.</p>
       </div>
       <nav aria-label="Explore FloraCo">
         <strong>Explore</strong>
         {links.slice(1).map(([href, label]) => <a key={href} href={href}>{label}</a>)}
       </nav>
       <nav aria-label="Flower services">
         <strong>Flowers</strong>
         {flowers.map(({ id, name }) => <a key={id} href={'#' + id}>{name}</a>)}
       </nav>
       <nav aria-label="Social links">
         <strong>Follow us</strong>
         <a href="https://www.instagram.com/">Instagram</a>
         <a href="https://www.facebook.com/">Facebook</a>
       </nav>
     </div>
     <div className="footer-wordmark" aria-hidden="true">{[...'FloraCo.'].map((letter, index) => <span key={index}>{letter}</span>)}</div>
     <div className="footer-bottom">
       <small>© {new Date().getFullYear()} FloraCo.</small>
       <a className="back-to-top" href="#top" aria-label="Back to top"><span>Back to top</span><Arrow /></a>
     </div>
   </footer>
 </>
}
createRoot(root).render(<App />)
