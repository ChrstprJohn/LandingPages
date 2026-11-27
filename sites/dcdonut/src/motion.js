import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { Draggable } from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable, CustomEase)
const entrance = CustomEase.create('dunkly-entrance', 'M0,0 C.29,0 .38,1.13 .65,1.029 C.81,.985 .93,1 1,1')
const revealCleanup = 'transform,translate,scale,rotate,opacity'
const routeEntrances = {
  'box-promise': { y: 70, angles: [-8, 6, -4] },
  'kitchen-photo': { y: 60, scale: .9, rotation: -13 },
  'store-photo': { y: 60, scale: .9, rotation: 13 },
  'from-right': { x: 60 },
  'from-left': { x: -60 },
  milestone: { y: 80, angles: [-12.5, 10, -7.5, 12.5, -10] },
  stat: { scale: .6, angles: [-26, -16, -23, -15] },
  'delivery-step': { y: 60, scale: .8, duration: .72 },
  zone: { y: 80, angles: [-10, 0, 10] },
  form: { y: 70, rotation: -3 },
  'contact-info': { x: 70, angles: [-7.5, 7.5, -5] },
  'quick-answer': { y: 80, angles: [-10, 7.5, -7.5] },
  map: { y: 60, scale: .92, rotation: -9.5 },
  'shop-card': { y: 70, angles: [-5, 5, -4] },
  counter: { y: 60, scale: .9, rotation: 12 },
}

export function useLandingMotion(page, isHome) {
  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const select = gsap.utils.selector(page.current)
      const hero = gsap.timeline({ defaults: { ease: 'power3.out' } })

      hero.from('.nav', { y: -40, opacity: 0, duration: 0.75, ease: 'back.out(0.64)' }, 0.06)
      if (isHome) {
        hero.from('.hero-heading .display-letter', { y: 120, rotation: 8, opacity: 0, duration: 0.78, stagger: 0.04, ease: entrance }, 0.49)
          .from('.hero-donut', { y: 420, rotation: -35, scale: 0.7, opacity: 0, duration: 1.26, ease: entrance }, 0.53)
          .from('.hero-ticker', { x: -200, rotation: 4, opacity: 0, duration: 0.97, ease: 'power2.out' }, 0.75)
          .from('.hero-copy, .hero-action', { y: 30, opacity: 0, duration: 0.68, stagger: 0.1, ease: entrance }, 1.01)
          .from('.sprinkles i', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.03, ease: 'back.out(1.55)' }, 1.01)
          .from('.hero-badge', { scale: 0, rotation: -20, opacity: 0, duration: 0.73, ease: 'elastic.out(1, 0.46)' }, 1.24)
      } else if (select('.product-info').length) {
        hero.from('.product-circle', { scale: 0.6, rotation: -20, opacity: 0, duration: 0.85, ease: entrance }, 0.23)
          .from('.product-donut', { y: 80, rotation: -40, scale: 0.8, opacity: 0, duration: 0.95, ease: entrance }, 0.43)
          .from('.product-info', { x: 60, opacity: 0, duration: 0.8, ease: entrance }, 0.51)
      } else {
        hero.from('.route-title .display-letter', { y: 100, rotation: 8, opacity: 0, duration: 0.74, stagger: 0.036 }, 0.12)
          .from('.route-label, .route-intro-copy, .route-hero > small', { y: 28, opacity: 0, duration: 0.62, stagger: 0.065 }, 0.28)
        const steps = select('.builder-steps li')
        if (steps.length) hero.from(steps, { y: 40, opacity: 0, stagger: .09, duration: .68, ease: entrance }, .65)
        const art = select('.route-orbit img')
        if (art.length) hero.from(art, { y: 80, rotation: -24, scale: 0.72, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'back.out(1.2)' }, 0.22)
      }

      function runWhileVisible(trigger, targets, vars, end = 'bottom top') {
        const animation = gsap.to(targets, { ...vars, repeat: -1, paused: true })
        const visibility = ScrollTrigger.create({ trigger, start: 'top bottom', end, onToggle: ({ isActive }) => animation.paused(!isActive) })
        return animation.paused(!visibility.isActive)
      }

      select('.hero-art, .flavour-art, .product-donut-float').forEach((element, i) => {
        runWhileVisible(element, element, { y: i ? -13 : -10, rotation: i % 2 ? 1.5 : -1.2, duration: 2.3 + i * 0.24, yoyo: true, ease: 'sine.inOut' })
      })
      select('.route-orbit').forEach((element, i) => {
        runWhileVisible(element.closest('.route-hero'), element, { y: -14, rotation: i === 0 ? '+=7' : '-=7', duration: i === 0 ? 2.8 : 2.4, yoyo: true, ease: 'sine.inOut' }).totalTime(i * .65)
      })
      select('.map-pin').forEach((pin, index) => {
        runWhileVisible(pin.closest('.location-map'), pin, { y: -8, duration: 1.1 + index * .13, yoyo: true, repeatDelay: .3, ease: 'sine.inOut' }).totalTime(index * .48)
      })
      if (isHome) {
        const header = select('.hero')[0]
        runWhileVisible(header, select('.hero-badge .seal-spin'), { rotation: 360, transformOrigin: '50% 50%', duration: 14, ease: 'none' })
        select('.sprinkles i:nth-child(-n+4)').forEach((sprinkle, index) => {
          const direction = index % 2 ? 1 : -1
          runWhileVisible(header, sprinkle, { y: direction * 10, rotation: `${direction < 0 ? '-' : '+'}=12`, duration: [1.8, 1.9, 1.65, 1.8][index], yoyo: true, ease: 'sine.inOut' })
            .totalTime([0, .18, .53, 0][index])
        })

        const plans = select('.box-plans')[0]
        plans.querySelectorAll('.sparkle').forEach((star, index) => {
          runWhileVisible(plans, star, { rotation: 45, scale: .7, transformOrigin: '50% 50%', duration: 1.5, yoyo: true, ease: 'sine.inOut' }).totalTime(index * 1.15)
        })

        const promiseArt = select('.promise-art')[0]
        runWhileVisible(promiseArt, promiseArt.querySelector('.seal-spin'), { rotation: 360, transformOrigin: '50% 50%', duration: 22, ease: 'none' })
        runWhileVisible(promiseArt, promiseArt.querySelector('.promise-donut-float'), { y: -12, rotation: 5, duration: 2.2, yoyo: true, ease: 'sine.inOut' })
        gsap.from(promiseArt.querySelector('img'), {
          y: 120, rotation: -60, scale: .6, opacity: 0, duration: .94, ease: entrance,
          scrollTrigger: { trigger: promiseArt, start: 'top 89%', once: true },
        })
        select('.promise-rows article').forEach((row, index) => {
          const thumb = row.querySelector('img')
          runWhileVisible(row, thumb, { rotation: 360, duration: [17, 20, 23, 26][index], ease: 'none' })
        })
        runWhileVisible(select('.review-list')[0], select('.review-art'), { rotation: '+=360', duration: 27, ease: 'none' })
      }

      select('.flavour').forEach(section => {
        const anchor = section.previousElementSibling
        section.querySelectorAll('.flavour-sparkle').forEach((star, index) => {
          runWhileVisible(anchor, star, { rotation: 45, scale: .7, transformOrigin: '50% 50%', duration: 1.5, yoyo: true, ease: 'sine.inOut' }, () => `top+=${section.offsetHeight} top`)
            .totalTime(index * .48)
        })
        // The panel pins, so each trigger uses its normal-flow anchor and an untransformed layer offset.
        function reveal(selector, viewportEdge, fraction, vars, children, reverseRange = 0) {
          const layer = section.querySelector(selector)
          let toggleActions = 'play none none reverse'
          if (reverseRange > 0) toggleActions = 'none play none reverse'
          if (reverseRange < 0) toggleActions = 'play none reverse reverse'
          gsap.from(children ? layer.querySelectorAll(children) : layer, {
            opacity: 0, ease: entrance, ...vars,
            scrollTrigger: {
              trigger: anchor,
              start: () => `top+=${Math.round(layer.offsetTop + layer.offsetHeight * fraction - Math.max(0, reverseRange))} ${viewportEdge}`,
              end: reverseRange ? `+=${Math.abs(reverseRange)}` : undefined,
              toggleActions,
            },
          })
        }
        reveal('.flavour-eyebrow', '90%', 0, { y: -20, duration: 0.55 })
        reveal('.flavour-word', '81%', 0, { y: 100, rotation: -10, duration: 0.75, stagger: 0.055 }, '.display-letter')
        reveal('.flavour-art', '72%', 0.5, { y: 150, scale: 0.72, rotation: -24, duration: 0.95 }, '.flavour-image', 105)
        reveal('.flavour-tag', '100%', 0, { x: -120, rotation: -30, duration: 0.72 }, null, -30)
        reveal('.flavour-add', '86%', 0, { scale: 0, duration: 0.68, ease: 'back.out(1.55)' })
        reveal('.flavour-description', '92%', 0, { y: 40, duration: 0.65 })
      })

      select('[data-heading]').forEach(heading => {
        if (heading.closest('[data-route-reveal="from-left"], [data-route-reveal="from-right"]')) return
        gsap.from(heading.querySelectorAll('.display-letter'), {
          y: 65, rotation: 7, opacity: 0, duration: 0.66, stagger: 0.027, ease: 'power3.out',
          scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
        })
      })

      select('.promise [data-reveal], .footer [data-reveal], [data-route-reveal=""]').forEach(element => {
        const y = element.closest('.footer-top') ? 50 : 40
        gsap.from(element, {
          y, opacity: 0, duration: 0.7, ease: entrance,
          scrollTrigger: { trigger: element, start: 'top 92%', once: true },
        })
      })
      Object.entries(routeEntrances).forEach(([type, { angles, ...vars }]) => {
        select(`[data-route-reveal="${type}"]`).forEach((element, index) => {
          gsap.from(element, {
            opacity: 0, duration: .8, ease: entrance, delay: index * .07,
            ...(angles && { rotation: angles[index] }), ...vars,
            clearProps: revealCleanup,
            scrollTrigger: { trigger: element, start: 'top 92%', once: true },
          })
        })
      })

      select('.plan').forEach((card, index) => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 89%', once: true } })
        timeline.from(card, { y: 90, rotation: (index - 1) * 4, opacity: 0, delay: index * 0.09, duration: 0.82, ease: entrance, clearProps: revealCleanup }, 0)
          .from(card.querySelectorAll('.plan-art img'), { y: 120, rotation: i => [-53, -32, -44][i], opacity: 0, scale: 0.6, stagger: 0.08, duration: 0.87, ease: entrance }, 0.36 + index * 0.09)
      })
      select('.faq-card').forEach((card, index) => {
        gsap.from(card, {
          y: 60, opacity: 0, duration: 0.72, delay: (index % 2) * 0.11, ease: entrance, clearProps: revealCleanup,
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
        })
      })
      select('[data-drag]').forEach((donut, index) => {
        gsap.from(donut.querySelector('img'), { scale: 0, rotation: -175, opacity: 0, duration: 0.75, delay: index * 0.08, ease: 'back.out(1.65)', scrollTrigger: { trigger: donut, start: 'top 94%', once: true } })
      })

      const draggables = Draggable.create(select('[data-drag]'), { type: 'x,y', bounds: select('.footer-art')[0], zIndexBoost: false })
      return () => draggables.forEach(draggable => draggable.kill())
    }, page.current)

    return () => media.revert()
  }, { scope: page })
}
