import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase, SplitText)

export const wipeEase = CustomEase.create('decodeWipe', '0.82,0,0.18,1')
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useEntrance({ root, cover, counter, home, full, setLoading }) {
  useGSAP((context, contextSafe) => {
    if (reducedMotion()) {
      setLoading(false)
      return
    }

    let disposed = false
    let title
    const body = document.body
    const previousOverflow = body.style.overflow
    const fonts = document.fonts.ready
    const reveal = contextSafe(() => {
      if (disposed) return
      const heading = root.current.querySelector('main h1')
      const timeline = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.6 } })
      if (heading) {
        gsap.set(heading, { visibility: 'visible' })
        title = SplitText.create(heading, { type: 'lines', mask: 'lines', linesClass: 'intro-line' })
        timeline.from(title.lines, { yPercent: 150, stagger: 0.1, onComplete: () => title.revert() }, 0)
      }
      timeline.fromTo('.desktop-nav a, .mobile-nav button',
        { yPercent: 120, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, stagger: 0.08, clearProps: 'transform,visibility,opacity' }, 0.15)
      if (home) {
        const railStart = window.matchMedia('(width > 991px)').matches ? 0.92 : 0.4
        timeline
          .from('.hero .section-label, .hero .discipline', { clipPath: 'inset(0 0 100% 0)', duration: 1.2 }, 0.3)
          .from('.hero-mobile-model', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power2.inOut' }, 0.4)
          .fromTo('.rail-model .model', { yPercent: 30, autoAlpha: 0 }, {
            yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', clearProps: 'transform,visibility,opacity',
          }, railStart)
          .fromTo('.rail-index a', { autoAlpha: 0, clipPath: 'inset(100% 0 0)' }, {
            autoAlpha: 1, clipPath: 'inset(0% 0 0)', stagger: 0.09, duration: 0.65, clearProps: 'clipPath,visibility,opacity',
          }, railStart)
      } else {
        timeline.from('.editorial-head > :is(.project-icons, .website-link), .essay-links li',
          { y: 24, opacity: 0, stagger: 0.08, duration: 1.1 }, 0.2)
      }
      timeline.from('.sticky-cta', { clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'power2.inOut' }, 0.45)
    })

    if (full) {
      body.style.overflow = 'hidden'
      const wordmark = root.current.querySelector('.site-header .wordmark > span')
      const initialScale = window.matchMedia('(width > 991px)').matches ? 430 / 118 : 1
      gsap.set(wordmark, { scale: initialScale, transformOrigin: 'top left' })
      const value = { percent: 0 }
      const finish = contextSafe(() => {
        if (disposed) return
        gsap.timeline({
          onComplete: () => {
            body.style.overflow = previousOverflow
            setLoading(false)
            ScrollTrigger.refresh()
          },
        })
          .to('.loading-counter', { y: 32, opacity: 0, duration: 0.3, ease: 'power2.inOut' }, 0)
          .to(wordmark, { scale: 1, duration: 1, ease: 'power2.inOut', clearProps: 'transform,transformOrigin' }, 0)
          .to(cover.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.inOut' }, 0.15)
          .call(reveal, [], 0.15)
      })
      gsap.fromTo(wordmark, { clipPath: 'inset(100% 0 0)' }, {
        clipPath: 'inset(0% 0 0)', duration: 1, delay: 0.5, ease: 'power2.inOut', clearProps: 'clipPath',
      })
      gsap.to(value, {
        percent: 100, duration: 3.8, ease: 'none',
        onUpdate: () => { counter.current.textContent = String(Math.round(value.percent)).padStart(2, '0') },
        onComplete: () => { fonts.then(finish) },
      })
    } else {
      gsap.fromTo(cover.current, { autoAlpha: 1, yPercent: 0 }, {
        yPercent: -100, duration: 0.9, delay: 0.15, ease: wipeEase,
        onComplete: () => gsap.set(cover.current, { autoAlpha: 0 }),
      })
      fonts.then(reveal)
    }

    return () => {
      disposed = true
      body.style.overflow = previousOverflow
      title?.revert()
    }
  }, { scope: root })
}
