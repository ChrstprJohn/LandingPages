import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const revealTransforms = {
  project: { y: 20, scale: 0.99 },
  process: { y: 30, scale: 0.9 },
  crew: { y: 10, scale: 0.9 },
  team: { y: 20, scale: 0.95 },
  article: { y: 30, scale: 0.9 },
  cta: { y: 10, scale: 0.9 },
}

function revealOnScroll(el, targets, from, duration, stagger = 0) {
  gsap.from(targets, {
    ...from,
    duration,
    stagger,
    ease: 'power1.out',
    scrollTrigger: { trigger: el, start: 'top 96%', once: true },
  })
}

export function useBlogCardMotion(scope, category) {
  useGSAP(() => {
    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      scope.current.querySelectorAll('.route-blog-card').forEach(card => {
        revealOnScroll(card, card, { opacity: 0, ...revealTransforms.project }, 0.45)
      })
    })
    return () => motion.revert()
  }, { scope, dependencies: [category], revertOnUpdate: true })
}

export function usePageMotion(scope, path) {
  useGSAP(() => {
    const page = scope.current
    const hero = page.querySelector('.hero')
    const headerTrigger = hero ?? page.querySelector('.route-hero-photo')
    if (headerTrigger) {
      ScrollTrigger.create({
        trigger: headerTrigger,
        start: 'center top',
        end: () => ScrollTrigger.maxScroll(window) + 1,
        toggleClass: { targets: page.querySelector('.site-header'), className: 'is-compact' },
      })
    }
    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const split = []
      const words = (element, type) => {
        const text = SplitText.create(element, { type })
        split.push(text)
        return type === 'words' ? text.words : text.chars
      }

      if (hero) {
        gsap.timeline({ defaults: { ease: 'power1.out' } })
          .from('.desktop-nav', { opacity: 0, duration: 0.5 }, 0)
          .from(words(hero.querySelector('h1'), 'words'), { opacity: 0.001, y: 10, duration: 0.4, stagger: 0.08 }, 0.5)
          .from(words(hero.querySelector('.hero-description'), 'words, chars'), {
            opacity: 0.001, y: 10, filter: 'blur(8px)', duration: 0.4, stagger: 0.002,
          }, 0.92)
          .from('.hero-action', { opacity: 0, y: 10, duration: 0.4 }, 1.21)
      } else {
        const entrance = page.querySelector('[data-page-entrance]')
        if (entrance) {
          const title = entrance.querySelector('[data-page-title]')
          const copy = entrance.querySelector('[data-page-summary]')
          const sequence = gsap.timeline({ defaults: { ease: 'power1.out', duration: 0.42 } })
          if (title) sequence.from(words(title, 'words'), { opacity: 0.001, y: 10, stagger: 0.055 }, 0.24)
          if (copy) sequence.from(words(copy, 'words, chars'), { opacity: 0.001, y: 10, filter: 'blur(8px)', stagger: 0.002 }, 0.48)
        }
      }

      page.querySelectorAll('[data-reveal], [data-words], [data-copy]').forEach(el => {
        if (el.hasAttribute('data-words')) {
          const from = { y: 10, opacity: 0.001 }
          if (el.closest('.about')) from.filter = 'blur(8px)'
          revealOnScroll(el, words(el, 'words'), from, 0.4, 0.045)
        } else if (el.hasAttribute('data-copy')) {
          revealOnScroll(el, words(el, 'words, chars'), { y: 10, opacity: 0.001 }, 0.4, 0.0017)
        } else {
          const from = revealTransforms[el.dataset.reveal] ?? { y: 30, scale: 0.98 }
          revealOnScroll(el, el, { opacity: 0, ...from }, 0.45)
        }
      })

      const quotes = page.querySelector('.quote-carousel')
      if (quotes) {
        ScrollTrigger.create({
          trigger: quotes,
          start: 'top 88%',
          once: true,
          onEnter: () => { quotes.dataset.reached = 'true' },
        })
      }
      page.querySelectorAll('[data-count]').forEach(el => {
        const value = { number: 0 }
        gsap.to(value, {
          number: Number(el.dataset.count),
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(value.number) },
          scrollTrigger: { trigger: el, start: 'top 92%', once: true, onEnter: () => { el.textContent = '0' } },
        })
      })

      let active = true
      document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh() })
      return () => {
        active = false
        if (quotes) delete quotes.dataset.reached
        split.forEach(text => text.revert())
        page.querySelectorAll('[data-count]').forEach(el => { el.textContent = el.dataset.count })
      }
    })
    motion.add('(min-width: 600px) and (prefers-reduced-motion: no-preference)', () => {
      const connector = page.querySelector('.process-connector')
      if (!connector) return
      gsap.fromTo(connector, { clipPath: 'inset(0% 100% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: { trigger: connector, start: 'top 96%', once: true },
      })
    })
    motion.add('(min-width: 1200px) and (prefers-reduced-motion: no-preference)', () => {
      const photo = page.querySelector('.about-feature img')
      if (!photo) return
      const maxScroll = () => ScrollTrigger.maxScroll(window)
      gsap.fromTo(photo, { y: 0 }, {
        y: () => maxScroll() * 0.1,
        ease: 'none',
        scrollTrigger: { start: 0, end: maxScroll, scrub: true, invalidateOnRefresh: true },
      })
    })
    return () => motion.revert()
  }, { scope, dependencies: [path], revertOnUpdate: true })
}
