import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CategoryRail, Hero, Testimonials } from './carousels'
import { posts, products } from './content'
import { dampedEase } from './motion'
import { Cta, Icon, Photo } from './ui'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const revealDuration = 1.9
const revealEase = dampedEase(revealDuration, 3.08, 16)
const revealStart = ({ trigger }) => `top bottom-=${Math.min(trigger.offsetHeight / 2, window.innerHeight * 0.75)}`

export function ProductCard({ item, reveal }) {
  return <a className="product-card" href={`/shop/${item.slug}`} data-reveal={reveal ? 'card' : undefined}>
    <div className="product-image"><Photo file={item.file || `product-${item.image}.jpg`} /></div>
    <h3>{item.name}</h3>
    <p className="product-price">{item.price} {item.old && <s>{item.old}</s>}</p>
  </a>
}

export function BlogCard({ post, reveal }) {
  return <a className="blog-card" href={`/blog/${post.slug}`} data-reveal={reveal ? 'card' : undefined}>
    <div className="blog-image"><Photo file={`blog-${post.image}.jpg`} /></div>
    <div className="blog-caption"><span>{post.category}</span><h3>{post.name}</h3></div>
  </a>
}

export function Banner({ title, text, button, to, media = 'membership.jpg' }) {
  return <section className="membership" aria-label={title} data-reveal="fade">
    <Photo file={media} />
    <div className="membership-content" data-reveal><h2 className="section-title">{title}</h2><p>{text}</p><Cta to={to}>{button}</Cta></div>
  </section>
}

const storyHeading = 'Make each room feel more like home with furniture that fits the way you live day to day.'

function Story() {
  return <section className="story page-width" aria-label="Behind the brand">
    <div className="story-intro" data-reveal>
      <h2 className="section-title" aria-label={storyHeading}>{storyHeading.split(' ').map((word, index) =>
        <span key={index} aria-hidden="true"><span data-story-word>{word}</span>{' '}</span>)}</h2>
      <div><Cta to="/about-us" plain>Behind the brand</Cta></div>
    </div>
    <div className="story-grid">
      <figure className="story-room"><figcaption data-reveal>Made for years of daily use</figcaption><Photo file="story-room.jpg" alt="A cream chair in a contemporary workspace" /></figure>
      <div className="story-left">
        <div className="story-text" data-reveal><p className="story-description">Our solid oak furniture takes its character from century-old beams. Made for life indoors and out, each piece brings the warmth of old wood to rooms and gathering places you’ll use for years.</p></div>
        <figure className="story-chair"><Photo file="story-chair.jpg" alt="A sculptural wooden lounge chair" /><figcaption data-reveal><strong>Relaxed Living</strong><span>Soft-lined sofas and chairs for lounging</span></figcaption></figure>
      </div>
    </div>
  </section>
}

function Offer() {
  return <section className="offer" aria-labelledby="offer-title">
    <div className="offer-background" aria-hidden="true" />
    <div className="offer-side offer-left">
      <a href="/shop/terra-chair"><div className="offer-left-art"><Photo file="offer.jpg" /></div><Photo className="terra-image" file="terra.png" /><div className="offer-label"><h3>Terra Chair</h3><p>$99 <s>$149.00</s></p></div></a>
    </div>
    <div className="offer-middle">
      <Photo file="offer.jpg" />
      <div className="offer-copy"><p className="pill">This week’s offer</p><h2 id="offer-title" className="section-title">50% Off</h2><p>On Select Favorites</p><Cta to="/shop">Shop offers</Cta></div>
    </div>
    <div className="offer-side offer-right">
      <a href="/shop/dining-chair"><Photo file="dining.jpg" /><div className="offer-label"><h3>Dining Chair</h3><p>$99.00 <s>$129.00</s></p></div></a>
    </div>
  </section>
}

const metrics = [
  ['800', '+', 'Furniture projects completed with care'],
  ['16k', '+', 'Customers who chose our furniture'],
  ['100', '%', 'Customer satisfaction backed by attentive service'],
]

function Why() {
  return <section className="why page-width" aria-labelledby="why-title">
    <div className="why-intro">
      <h2 className="pill" id="why-title" data-reveal>What sets us apart</h2>
      <p><span data-why-word>Look for forms that last,</span> <i data-why-word><Icon name="chair" /></i> <span data-why-word>comfortable seats, and carefully</span> <i data-why-word><Icon name="cabinet" /></i> <span data-why-word>worked materials that feel at home wherever you live or work. Every</span> <i data-why-word><Icon name="lamp" /></i> <span data-why-word>piece pairs everyday use with a clean silhouette.</span></p>
    </div>
    <div className="metrics">{metrics.map(([value, suffix, label]) => <div key={label} data-reveal>
      <p className="metric-value" aria-label={`${value}${suffix}`}><span aria-hidden="true">{value.split('').map((digit, index) => /\d/.test(digit)
        ? <span key={index} className="metric-roller"><span data-digit={digit}>{Array.from({ length: 10 }, (_, n) => <span key={n}>{n}</span>)}</span></span>
        : digit)}</span><sup aria-hidden="true">{suffix}</sup></p>
      <p>{label}</p>
    </div>)}</div>
  </section>
}

function SocialGallery() {
  return <section className="social-gallery" aria-label="Follow DCRAFTS">
    <p data-reveal>Follow DCRAFTS</p>
    <div className="social-window" data-reveal>
      <div className="social-track">
        {[0, 1].map((copy) => <ul key={copy} aria-hidden="true">{[1, 2, 3, 4].map((index) => <li key={index}><Photo file={`social-${index}.jpg`} /></li>)}</ul>)}
      </div>
      <div className="social-overlay"><h2>Find ideas for your space</h2><Cta to="/shop">Shop offers</Cta></div>
    </div>
  </section>
}

export function Home() {
  const root = useRef(null)

  useGSAP(() => {
    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('[data-reveal]', root.current).forEach((element) => {
        const kind = element.dataset.reveal
        gsap.from(element, {
          opacity: 0, y: kind === 'fade' ? 0 : 40, duration: revealDuration, ease: revealEase,
          delay: 0.07 + (kind === 'card' ? [...element.parentElement.children].indexOf(element) % 3 * 0.09 : 0),
          scrollTrigger: { trigger: element, start: revealStart, once: true },
        })
      })

      gsap.from('[data-story-word]', { opacity: 0, y: 26, duration: 0.55, stagger: 0.038, ease: 'power3.out',
        scrollTrigger: { trigger: '.story-intro', start: revealStart, once: true },
      })
      gsap.from('[data-why-word]', { opacity: 0.18, duration: 0.7, stagger: 0.09, ease: 'power2.out',
        scrollTrigger: { trigger: '.why-intro p', start: 'top 78%', once: true },
      })

      const offer = root.current.querySelector('.offer')
      const offerMotion = gsap.timeline({ defaults: { duration: revealDuration, ease: revealEase }, scrollTrigger: { trigger: offer, start: 'top 55%', once: true } })
      offerMotion.from(offer, { opacity: 0 }, 0)
      offerMotion.from('.offer-background', { scale: 0.5, rotateY: -90, rotateZ: 17 }, 0.2)
      offerMotion.from('.offer-middle > img', { opacity: 0, y: 40 }, 0.65)
      offerMotion.from('.offer-left', { opacity: 0, x: -300 }, 0.78)
      offerMotion.from('.offer-right', { opacity: 0, x: 300 }, 0.97)
      offerMotion.from('.terra-image', { opacity: 0, x: 100 }, 1.05)
      offerMotion.from('.offer-copy', { opacity: 0, y: 40 }, 1.16)

      gsap.from('.testimonials-background', { opacity: 0, scale: 1.07, duration: 0.95, scrollTrigger: { trigger: '.testimonials', start: 'top 85%' } })
      gsap.fromTo('[data-digit]', { y: 0 }, {
        y: (_, element) => `-${Number(element.dataset.digit) * 1.13}em`, duration: 1.15, stagger: 0.08, ease: 'power3.inOut',
        scrollTrigger: { trigger: '.metrics', start: revealStart, once: true },
      })
    }, root)
    return () => motion.revert()
  }, { scope: root })

  return <main ref={root} id="main-content">
    <Hero />
    <CategoryRail />
    <Story />
    <Offer />
    <section className="best-sellers page-width" aria-labelledby="best-title">
      <h2 className="sub-title" id="best-title">Customer Favorites</h2>
      <div className="product-grid">{products.map((item) => <ProductCard key={item.slug} item={item} reveal />)}</div>
    </section>
    <Why />
    <Testimonials />
    <section className="journal page-width" aria-labelledby="journal-title">
      <h2 className="section-title text-center" id="journal-title" data-reveal>The Journal</h2>
      <div className="blog-grid">{posts.slice(0, 3).map((post) => <BlogCard key={post.slug} post={post} reveal />)}</div>
    </section>
    <SocialGallery />
    <Banner title="Member Access" text="Join to see new collections early, get special offers, and save on pieces you have your eye on." button="Sign up" to="/contact-us" />
  </main>
}
