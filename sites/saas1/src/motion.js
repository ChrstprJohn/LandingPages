import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase)

const mediaEase = CustomEase.create('nouva-media', 'M0,0 C0.075,0.01,0.16,0.33,0.32,0.647 0.51,0.96,0.82,1,1,1')
const wordEase = CustomEase.create('nouva-words', 'M0,0 C0.22,0,0.31,0.09,0.41,0.39 0.53,0.77,0.70,1,1,1')
const springEase = CustomEase.create('nouva-entrance', 'M0,0 C0.13,0,0.20,0.44,0.36,0.67 0.55,0.94,0.76,1,1,1')
const panelEase = CustomEase.create('nouva-panel', 'M0,0 C0.13,0,0.23,0.62,0.48,0.88 0.71,1.09,0.86,1,1,1')
const motionQuery = '(prefers-reduced-motion: no-preference)'

function animateHero(select) {
  const [hero] = select('.hero')
  const [image] = select('[data-hero-media]')
  const playEntrance = scrollY < 80

  if (playEntrance) {
    const imageEntrance = gsap.fromTo(image, { opacity: 0, scale: 1.2 }, {
      opacity: 1, scale: 1, duration: 1.75, ease: mediaEase, paused: true,
    })
    const imageReady = () => imageEntrance.play()
    if (image.complete && image.naturalWidth) imageReady()
    else image.addEventListener('load', imageReady, { once: true })

    gsap.timeline()
      .from(select('[data-hero-word]'), {
        opacity: 0.001, y: 5, filter: 'blur(3px)', duration: 0.88, ease: wordEase,
        stagger: (index) => (index + (index >= 3 ? 2 : 0)) * 0.021,
      }, 0.27)
      .from(select('[data-hero-description]'), { opacity: 0.001, y: 12, duration: 0.87, ease: springEase }, 0.48)
      .from(select('[data-hero-action], [data-hero-cue]'), { opacity: 0.001, y: 12, duration: 0.88, stagger: 0.14, ease: springEase }, 0.56)
      .from(select('[data-header]'), { opacity: 0.001, y: -12, duration: 0.93, ease: springEase }, 0.86)

    setupHeroParallax(hero, select)
    return () => image.removeEventListener('load', imageReady)
  }

  setupHeroParallax(hero, select)
}

function setupHeroParallax(hero, select) {
  const backdrop = select('[data-hero-parallax]')
  gsap.to(backdrop, {
    y: () => hero.offsetHeight * 0.4,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.1, invalidateOnRefresh: true },
  })
  gsap.to(backdrop, {
    opacity: 0.5,
    ease: 'sine.inOut',
    scrollTrigger: { trigger: hero, start: 'top top', end: () => '+=' + hero.offsetHeight * 1.17, scrub: 0.12 },
  })
}

function animateCounters(select) {
  for (const node of select('[data-counter]')) {
    const value = Number(node.dataset.counter)
    const digits = Number.isInteger(value) ? 0 : 1
    const position = { value: 0 }
    const render = () => {
      node.textContent = position.value.toFixed(digits) + node.dataset.suffix
    }
    render()
    const counter = gsap.to(position, { value, duration: 0.86, ease: 'power2.out', paused: true, onUpdate: render })
    ScrollTrigger.create({
      trigger: node,
      start: 'top bottom',
      once: true,
      onEnter: () => counter.play(),
    })
  }
}

function animateSections(select) {
  for (const node of select('[data-reveal]')) {
    const distance = Number(node.dataset.enterY ?? (node.closest('#faq') ? 40 : 32))
    gsap.from(node, {
      y: distance,
      opacity: 0,
      duration: 0.72,
      delay: Number(node.dataset.delay ?? 0),
      ease: springEase,
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: node.closest('.stat-step') ?? node, start: 'center bottom', once: true },
    })
  }

  const [comparison] = select('[data-comparison-reveal]')
  gsap.from(comparison, {
    x: 128,
    opacity: 0,
    duration: 0.72,
    ease: panelEase,
    clearProps: 'transform,opacity',
    scrollTrigger: { trigger: comparison, start: 'center bottom', once: true },
  })
}

function animateFeatureStack(select) {
  const panels = select('[data-feature-panel]')
  select('[data-feature-marker]').forEach((marker, index) => {
    gsap.to(panels[index], {
      scale: 0.9,
      ease: 'none',
      scrollTrigger: { trigger: marker, start: 'top bottom', end: 'top top', scrub: true },
    })
  })
}

export function useSiteMotion(scope, path) {
  useGSAP(() => {
    const select = gsap.utils.selector(scope)
    const media = gsap.matchMedia()
    let mounted = true

    media.add(motionQuery, () => {
      if (path !== '/') {
        gsap.from(select('.page-lead, .contact-form, .auth-form, .legal-copy'), {
          opacity: 0,
          y: 12,
          duration: 0.54,
          stagger: 0.12,
          ease: springEase,
          clearProps: 'transform,opacity',
        })
        return
      }
      const cleanHero = animateHero(select)
      animateSections(select)
      animateCounters(select)
      return () => {
        cleanHero?.()
        for (const node of select('[data-counter]')) node.textContent = node.dataset.counter + node.dataset.suffix
      }
    })

    if (path === '/') media.add('(min-width: 1200px) and ' + motionQuery, () => animateFeatureStack(select))

    document.fonts.ready.then(() => {
      if (mounted) ScrollTrigger.refresh(true)
    })

    return () => {
      mounted = false
      media.revert()
    }
  }, { scope, dependencies: [path], revertOnUpdate: true })
}

export function useTickerMotion(scope, paused) {
  const wantsPause = useRef(paused)
  const sync = useRef(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add(motionQuery, () => {
      const ticker = scope.current
      const track = ticker.querySelector('[data-ticker-track]')
      const move = gsap.to(track, { xPercent: -50, duration: 35.24, ease: 'none', repeat: -1, paused: true })
      const enter = () => move.timeScale(0.72)
      const leave = () => move.timeScale(1)
      const update = () => move.paused(wantsPause.current || document.hidden || !trigger.isActive)
      const trigger = ScrollTrigger.create({
        trigger: ticker,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: ({ isActive }) => move.paused(wantsPause.current || document.hidden || !isActive),
      })

      sync.current = update
      update()
      ticker.addEventListener('pointerenter', enter)
      ticker.addEventListener('pointerleave', leave)
      document.addEventListener('visibilitychange', update)
      return () => {
        sync.current = null
        ticker.removeEventListener('pointerenter', enter)
        ticker.removeEventListener('pointerleave', leave)
        document.removeEventListener('visibilitychange', update)
      }
    })
    return () => media.revert()
  }, { scope })

  useEffect(() => {
    wantsPause.current = paused
    sync.current?.()
  }, [paused])
}
