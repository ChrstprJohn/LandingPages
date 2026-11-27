import { useCallback, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { categories, reviews } from './content'
import { ArrowControls, Cta, Photo } from './ui'

const reducedMotion = '(prefers-reduced-motion: reduce)'
const wrap = (value, count) => ((value % count) + count) % count
const heroSlides = [
  ['armchair', 'Cream modern armchair'],
  ['sofa', 'Luxe sofa'],
  ['rocker', 'Minimalist armchair'],
  ['ivory', 'Ivory curve chair'],
]
const announcements = [
  'Complimentary worldwide shipping', 'Save 50% this week', 'The latest pieces are here',
  'Browse special offers across the shop.', 'Available while stock lasts',
]

function Announcements() {
  return <div className="announcements">
    <div className="announcement-window" role="region" aria-label="Store announcements" tabIndex={0}>
      <div className="announcement-track">
        {[false, true].map((copy) => <ul key={String(copy)} aria-hidden={copy || undefined}>
          {announcements.map((text) => <li key={text}>{text}</li>)}
        </ul>)}
      </div>
    </div>
  </div>
}

function useCarouselTimer(root, advance, delay, paused = false) {
  useEffect(() => {
    if (paused) return
    const element = root.current
    const preference = window.matchMedia(reducedMotion)
    let timer
    let inView = false

    function update() {
      window.clearInterval(timer)
      if (inView && !document.hidden && !preference.matches) timer = window.setInterval(advance, delay)
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    }, { threshold: 0.2 })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    preference.addEventListener('change', update)
    return () => {
      window.clearInterval(timer)
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      preference.removeEventListener('change', update)
    }
  }, [root, advance, delay, paused])
}

function useDeck(count, delay) {
  const root = useRef(null)
  const gesture = useRef(null)
  const [focus, setFocus] = useState(false)
  const [position, setPosition] = useState({ current: 0, previous: null, direction: 1 })
  const move = useCallback((direction) => {
    setPosition(({ current }) => ({ current: wrap(current + direction, count), previous: current, direction }))
  }, [count])
  const advance = useCallback(() => move(1), [move])
  useCarouselTimer(root, advance, delay, focus)

  useGSAP(() => {
    if (window.matchMedia(reducedMotion).matches) return
    const cards = root.current.querySelectorAll('[data-slide]')
    const active = cards[position.current]
    const previous = cards[position.previous]
    const timeline = gsap.timeline()
    const travel = { duration: 0.78, ease: 'power3.inOut' }

    if (previous) {
      timeline.set(previous, { visibility: 'visible' })
      timeline.fromTo(previous, { xPercent: 0 }, { xPercent: -100 * position.direction, ...travel }, 0)
      timeline.fromTo(active, { xPercent: 100 * position.direction }, { xPercent: 0, ...travel }, 0)
      timeline.set(previous, { clearProps: 'visibility,transform' }, travel.duration)
    }
  }, { scope: root, dependencies: [position], revertOnUpdate: true })

  function pointerDown(event) {
    if (event.button !== 0 || event.target.closest('a, button')) return
    gesture.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function pointerUp(event) {
    if (gesture.current === null) return
    const delta = event.clientX - gesture.current
    gesture.current = null
    if (Math.abs(delta) > 42) move(delta < 0 ? 1 : -1)
  }

  return {
    active: position.current,
    move,
    bindings: {
      ref: root,
      onFocus: () => setFocus(true),
      onBlur: (event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocus(false) },
      onPointerDown: pointerDown,
      onPointerUp: pointerUp,
      onPointerCancel: () => { gesture.current = null },
      onKeyDown: (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
        event.preventDefault()
        move(['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1)
      },
    },
  }
}

export function Hero() {
  const root = useRef(null)
  const [slide, setSlide] = useState({ current: 0, previous: -1 })
  const advance = useCallback(() => {
    const hero = root.current
    if (!hero) return
    const rooms = hero.querySelectorAll('.hero-background')
    const products = hero.querySelectorAll('.hero-product')

    setSlide((position) => {
      const next = wrap(position.current + 1, heroSlides.length)
      const ready = [rooms[next], products[next]].every((image) => image.complete && image.naturalWidth)
      return ready
        ? { current: next, previous: position.current }
        : position
    })
  }, [])
  useCarouselTimer(root, advance, 6000)

  return <section className="hero" ref={root}>
    <div className="hero-scene">
      <div className="hero-backdrop" aria-hidden="true">
        {heroSlides.map(([key], index) => <Photo key={key} className="hero-background" file={`hero-${key}.jpg`} eager
          data-current={index === slide.current} data-previous={index === slide.previous}
          fetchPriority={index === 0 ? 'high' : 'low'} />)}
      </div>
      <div className="page-width hero-content">
        <div className="hero-showcase">
          <h1 className="hero-wordmark"><Photo file="dcrafts.svg" alt="DCRAFTS" eager /></h1>
          <div className="hero-products">
            {heroSlides.map(([key, alt], index) => <Photo key={key} className="hero-product" file={`${key}.png`} alt={alt} eager
              aria-hidden={index !== slide.current} data-current={index === slide.current}
              fetchPriority={index === 0 ? 'auto' : 'low'} />)}
          </div>
        </div>
        <div className="hero-feature">
          <h2>Modern furniture</h2>
          <Cta to="/shop">Shop</Cta>
        </div>
      </div>
    </div>
    <Announcements />
  </section>
}

const categoryOrder = [...categories, categories[2]]

function wrapCategoryRail(rail) {
  const start = rail.children[categoryOrder.length].offsetLeft
  if (rail.scrollLeft < start / 2) rail.scrollLeft += start
  else if (rail.scrollLeft >= start * 2) rail.scrollLeft -= start
}

export function CategoryRail() {
  const track = useRef(null)
  const animation = useRef(null)
  const drag = useRef(null)
  const dragged = useRef(false)
  const [focus, setFocus] = useState(false)
  const { contextSafe } = useGSAP({ scope: track })

  const move = useCallback(contextSafe((direction) => {
    const rail = track.current
    const step = rail.children[1].offsetLeft - rail.children[0].offsetLeft
    animation.current?.kill()
    wrapCategoryRail(rail)
    const next = rail.scrollLeft + step * direction
    if (window.matchMedia(reducedMotion).matches) {
      rail.scrollLeft = next
      return
    }
    animation.current = gsap.to(rail, {
      scrollLeft: next, duration: 0.8, ease: 'power3.out',
      onComplete: () => { animation.current = null; wrapCategoryRail(rail) },
      onInterrupt: () => { animation.current = null },
    })
  }), [contextSafe])
  const advance = useCallback(() => { if (!drag.current) move(1) }, [move])
  useCarouselTimer(track, advance, 3400, focus)

  useEffect(() => {
    const rail = track.current
    const reset = () => {
      animation.current?.kill()
      const gutter = parseFloat(getComputedStyle(rail).getPropertyValue('--gutter'))
      rail.scrollLeft = rail.children[categoryOrder.length].offsetLeft - gutter
    }
    reset()
    window.addEventListener('resize', reset)
    return () => window.removeEventListener('resize', reset)
  }, [])

  function startDrag(event) {
    dragged.current = false
    animation.current?.kill()
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { x: event.clientX, left: track.current.scrollLeft }
  }

  function moveDrag(event) {
    if (!drag.current || !event.buttons) return
    const offset = event.clientX - drag.current.x
    if (!dragged.current && Math.abs(offset) < 6) return
    dragged.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    track.current.scrollLeft = drag.current.left - offset
  }

  return <section className="categories" aria-labelledby="category-title">
    <h2 className="section-title page-width text-center" id="category-title" data-reveal>Browse by room</h2>
    <div className="category-track" ref={track} data-reveal="rail" onScroll={(event) => { if (!animation.current) wrapCategoryRail(event.currentTarget) }} onPointerDown={startDrag} onPointerMove={moveDrag}
      onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}
      onClickCapture={(event) => { if (dragged.current) event.preventDefault() }}
      onFocus={() => setFocus(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocus(false) }}>
      {[0, 1, 2].flatMap((copy) => categoryOrder.map(({ name, slug, image, price }, index) => <a
        key={`${copy}-${index}`} className="category-card" href={`/shop/${slug}`} tabIndex={copy === 1 && index < categories.length ? 0 : -1}
        aria-hidden={copy !== 1 || index === categories.length}>
        <Photo file={`category-${image ?? slug}.png`} eager />
        <span className="category-caption"><span>{name}</span><span>{price}</span></span>
      </a>))}
    </div>
    <ArrowControls label="Categories" move={move} />
  </section>
}

export function Testimonials() {
  const deck = useDeck(reviews.length, 8500)
  return <section className="testimonials" aria-labelledby="review-title">
    <Photo className="testimonials-background" file="reviews.jpg" />
    <div className="page-width review-inner">
      <h2 id="review-title" className="section-title text-center" data-reveal>Make It Feel Like Home</h2>
      <div className="review-deck deck" data-reveal="rail" aria-label="Furniture styling ideas" aria-roledescription="carousel" {...deck.bindings}>
        {reviews.map(({ name, key, quote }, index) => <figure key={key} data-slide data-active={deck.active === index}
          inert={deck.active !== index} aria-label={`${index + 1} of ${reviews.length}`} className="review-slide deck-slide">
          <Photo className="review-portrait" file={`${key}.jpg`} />
          <div className="review-copy"><span className="quote-mark" aria-hidden="true">“</span><blockquote>{quote}</blockquote><figcaption>{name}</figcaption></div>
          <div className="review-piece"><Photo file={`${key}-piece.png`} /></div>
        </figure>)}
        <ArrowControls label="Styling ideas" move={deck.move} />
      </div>
    </div>
  </section>
}
