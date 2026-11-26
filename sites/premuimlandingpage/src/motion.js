import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { fingerprintPath } from './fingerprint'
import { fitDesktopHero } from './hero-thread'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function samplePath(path, length) {
  const segments = Math.max(1, Math.ceil(length / 6))
  const points = Array.from({ length: segments + 1 }, (_, index) => path.getPointAtLength(length * index / segments))
  return (progress) => {
    const position = gsap.utils.clamp(0, segments, progress * segments)
    const index = Math.min(segments - 1, Math.floor(position))
    const from = points[index]
    const to = points[index + 1]
    const fraction = position - index
    return [from.x + (to.x - from.x) * fraction, from.y + (to.y - from.y) * fraction]
  }
}

function positionDot(dot, [x, y]) {
  dot.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`)
}

function fitFingerprint(svg, path, phone) {
  const { width, height } = svg.getBoundingClientRect()
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  path.setAttribute('d', fingerprintPath(width, height, phone))
  return Math.min(.96, window.innerHeight * .72 / height)
}

function finishOpening() {
  document.documentElement.classList.remove('show-opening')
}

function playOpening(select) {
  const loader = document.getElementById('opening-signature')
  const animation = loader.querySelector('[data-pen-stroke]').getAnimations()[0]
  const exit = animation ? Math.max(0, (animation.effect.getComputedTiming().endTime + 500 - Number(animation.currentTime)) / 1000) : 0
  const timeline = gsap.timeline()

  timeline.to(loader, { yPercent: -100, duration: .73, ease: 'power3.inOut' }, exit)
  timeline.call(finishOpening, [], exit + .73)
  timeline.addLabel('reveal', exit + .36)
  timeline.from(select('.hero-title .line'), {
    opacity: 0, y: 18, filter: 'blur(10px)', duration: .73, stagger: .085,
    ease: 'power3.out', clearProps: 'filter,transform,opacity',
  }, 'reveal')
  timeline.from(select('.hero-description, .hero-follow'), {
    opacity: 0, y: 9, duration: .48, stagger: .055, clearProps: 'transform,opacity',
  }, 'reveal+=.24')
  return timeline
}

function animateThread(svg, study, opening, { phone, tablet }) {
  if (svg.getClientRects().length === 0) return
  const scene = svg.dataset.threadScene
  const hero = scene === 'hero'
  const desktopHero = hero && !phone && !tablet
  const about = scene === 'about'
  const contact = scene === 'contact'
  const isStudy = scene === 'study'
  const path = svg.querySelector('[data-thread]')
  const tip = svg.querySelector('[data-thread-tip]')
  const origin = svg.querySelector('[data-thread-start]')
  const ring = svg.querySelector('[data-thread-ring]')
  const delay = Number(svg.dataset.threadDelay ?? 0)
  let anchorProgress = about ? fitFingerprint(svg, path, phone) : 0
  if (desktopHero) fitDesktopHero(svg, path)
  let length = path.getTotalLength()
  if (!length) return

  let pointAt
  let drawingSize = about || desktopHero ? svg.getAttribute('viewBox') : ''
  const restingFraction = () => hero ? 1 - (desktopHero ? svg.querySelector('[data-hero-tail]').getTotalLength() : phone ? 116 : 157) / length : isStudy ? .06 : 0
  let rest = restingFraction()
  const intro = { value: opening && hero ? 0 : 1 }
  let progress = 0
  gsap.set(path, { strokeDasharray: 1 })
  const placeOrigin = () => {
    if (!origin) return
    const point = path.getPointAtLength(0)
    positionDot(origin, [point.x, point.y])
  }
  placeOrigin()

  function draw() {
    // Scrolling can finish the opening draw, and both gestures share this path.
    const traced = Math.max(0, (progress - delay) / (1 - delay))
    let value = hero && traced === 0 ? intro.value * rest : rest + (1 - rest) * traced
    if (about) {
      const drawnAtAnchor = .982
      value = traced < anchorProgress
        ? drawnAtAnchor * traced / anchorProgress
        : drawnAtAnchor + (1 - drawnAtAnchor) * (traced - anchorProgress) / (1 - anchorProgress)
    }
    svg.toggleAttribute('data-ink-waiting', value <= .002)
    if (contact) svg.parentElement.toggleAttribute('data-grip-waiting', value < .999)
    path.style.strokeDashoffset = 1 - value
    if (origin) origin.style.opacity = value > .002 ? '1' : '0'
    if (tip) {
      const active = value > .002 && value < .999
      if (active) {
        pointAt ??= samplePath(path, length)
        const position = pointAt(value)
        positionDot(tip, position)
        if (ring) positionDot(ring, position)
      }
      tip.style.opacity = active ? '1' : '0'
      if (ring) ring.style.opacity = active ? '1' : '0'
    }
  }

  draw()
  if (hero && opening) opening.to(intro, { value: 1, duration: .92, ease: 'power2.inOut', onUpdate: draw }, 'reveal+=.15')
  const trigger = ScrollTrigger.create({
      trigger: isStudy ? study : svg,
      start: isStudy || hero ? 'top top' : 'top 72%',
      end: isStudy ? 'bottom bottom' : contact ? 'clamp(bottom bottom)' : 'bottom 72%',
      onRefresh: about || desktopHero ? () => {
        const { width, height } = svg.getBoundingClientRect()
        if (drawingSize !== `0 0 ${width} ${height}`) {
          if (about) anchorProgress = fitFingerprint(svg, path, phone)
          else fitDesktopHero(svg, path)
          drawingSize = svg.getAttribute('viewBox')
          length = path.getTotalLength()
          rest = restingFraction()
          pointAt = undefined
          placeOrigin()
          draw()
        }
      } : undefined,
  })
  return (scrollY) => {
    const next = gsap.utils.clamp(0, 1, (scrollY - trigger.start) / Math.max(1, trigger.end - trigger.start))
    if (next === progress) return
    progress = next
    draw()
  }
}

function followScroll(drawings, opening) {
  if (!drawings.length) return
  const position = { y: window.scrollY }
  const render = () => drawings.forEach((draw) => draw(position.y))
  // The same eased scroll position drives every segment at the section seams.
  const easeScroll = gsap.quickTo(position, 'y', { duration: .24, ease: 'power2.out', onUpdate: render })
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onRefresh: (trigger) => {
      easeScroll.tween.pause()
      position.y = trigger.scroll()
      render()
    },
    onUpdate: (trigger) => {
      const next = trigger.scroll()
      if (opening?.isActive() && next > 24) opening.progress(1)
      easeScroll(next)
    },
  })
  render()
}

export function usePageMotion(root, pathname, intro) {
  useGSAP(() => {
    const select = gsap.utils.selector(root)
    const media = gsap.matchMedia()
    let playedOpening = !intro
    media.add({
      animate: '(prefers-reduced-motion: no-preference)',
      reduced: '(prefers-reduced-motion: reduce)',
      phone: '(max-width: 600px)',
      tablet: '(min-width: 601px) and (max-width: 900px)',
    }, ({ conditions }) => {
      const threads = select('[data-thread-scene]')
      if (conditions.phone) {
        threads.forEach((svg) => {
          if (!svg.dataset.mobileViewbox) return
          const path = svg.querySelector('[data-thread]')
          gsap.set(svg, { attr: { viewBox: svg.dataset.mobileViewbox } })
          gsap.set(path, { attr: { d: path.dataset.mobilePath } })
        })
      } else if (conditions.tablet) {
        const hero = threads.find((svg) => svg.dataset.baseViewbox)
        if (hero) {
          const path = hero.querySelector('[data-thread]')
          gsap.set(hero, { attr: { viewBox: hero.dataset.baseViewbox } })
          gsap.set(path, { attr: { d: path.dataset.basePath } })
        }
      }
      if (!conditions.animate) {
        const about = threads.find((svg) => svg.dataset.threadScene === 'about')
        const hero = threads.find((svg) => svg.dataset.threadScene === 'hero')
        if (!about && !hero) return
        const resizeArt = () => {
          if (about) fitFingerprint(about, about.querySelector('[data-thread]'), conditions.phone)
          if (hero && !conditions.phone && !conditions.tablet) fitDesktopHero(hero, hero.querySelector('[data-thread]'))
        }
        resizeArt()
        window.addEventListener('resize', resizeArt)
        return () => window.removeEventListener('resize', resizeArt)
      }
      const hero = select('.hero')[0]
      let opening
      if (hero && !playedOpening && window.scrollY < 40 && document.documentElement.classList.contains('show-opening')) {
        playedOpening = true
        opening = playOpening(select)
      } else if (!hero) {
        gsap.from(select('.study-title, .study-lede, .study-hero > .study-index'), {
          opacity: 0, y: 15, filter: 'blur(9px)', duration: .72, ease: 'power3.out', stagger: .09, clearProps: 'filter,transform,opacity',
        })
      }
      const study = select('.study')[0]
      const drawings = threads.map((svg) => animateThread(svg, study, opening, conditions)).filter(Boolean)
      followScroll(drawings, opening)
      select('.work-title, .capabilities-title, .about-copy h2, .contact-copy h2').forEach((heading) => {
        const lines = heading.querySelectorAll('.line')
        gsap.from(lines, {
          x: (index) => index % 2 ? 19 : -11, y: 10, opacity: 0, filter: 'blur(9px)',
          ease: 'power3.out', duration: .75, stagger: .095, clearProps: 'filter,transform,opacity',
          scrollTrigger: { trigger: heading, start: 'top 91%', once: true },
        })
        if (!conditions.phone) {
          const shifts = [-.029, .026, -.011, .013]
          gsap.to(heading.querySelectorAll('.line-ink'), {
            x: (index) => shifts[index] * Math.min(window.innerWidth, 1280),
            ease: 'none',
            scrollTrigger: { trigger: heading, start: 'top 84%', end: 'bottom top', scrub: .24, invalidateOnRefresh: true },
          })
        }
      })
      select('[data-reveal], .study-chapter h2').forEach((element) => {
        gsap.from(element, {
          y: 13, opacity: 0, duration: .74, ease: 'power3.out', clearProps: 'transform,opacity,filter',
          filter: element.matches('.world-title, .world-kicker, .world-description, .about-copy > p, .signature') ? 'blur(7px)' : 'none',
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        })
      })
      select('.capability-map li').forEach((row) => {
        gsap.fromTo(row, { opacity: 0, y: 9, filter: 'blur(7px)' }, {
          opacity: 1, y: 0, filter: 'blur(0px)', ease: 'none',
          scrollTrigger: { trigger: row, start: conditions.phone ? 'top 57%' : 'top 68%', end: conditions.phone ? 'top 48%' : 'top 58%', scrub: .24 },
        })
      })
      select('.project-world').forEach((scene) => {
        const layers = scene.querySelectorAll('.art-step')
        gsap.from(layers, {
          opacity: .14, ease: 'none', stagger: .12,
          scrollTrigger: { trigger: scene, start: 'top 85%', end: 'bottom 53%', scrub: .27 },
        })
        const link = scene.querySelector('.world-link')
        ScrollTrigger.create({
          trigger: link, start: 'top 89%', once: true,
          onEnter: () => scene.classList.add('world-active'),
        })
        scene.querySelectorAll('[data-count]').forEach((counter) => {
          const value = { count: 0 }
          counter.textContent = `0${counter.dataset.suffix}`
          gsap.to(value, {
            count: Number(counter.dataset.count), duration: .9, ease: 'power2.out',
            onUpdate: () => { counter.textContent = Math.round(value.count) + counter.dataset.suffix },
            scrollTrigger: { trigger: counter, start: 'top 86%', once: true },
          })
        })
      })
      const scanner = select('.scan-line')[0]
      if (scanner) {
        gsap.to(scanner, {
          y: 72, opacity: .3, ease: 'none',
          scrollTrigger: { trigger: scanner.closest('.world-papertrail'), start: 'top 60%', end: 'bottom 70%', scrub: true },
        })
      }

      let mounted = true
      document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh() })
      return () => {
        mounted = false
        if (opening) finishOpening()
        select('[data-thread]').forEach((path) => { path.style.removeProperty('stroke-dashoffset') })
        select('[data-thread-tip], [data-thread-start], [data-thread-ring]').forEach((node) => {
          node.style.removeProperty('opacity')
          node.removeAttribute('transform')
        })
        select('[data-ink-waiting], [data-grip-waiting]').forEach((node) => {
          node.removeAttribute('data-ink-waiting')
          node.removeAttribute('data-grip-waiting')
        })
        select('[data-count]').forEach((node) => { node.textContent = node.dataset.count + node.dataset.suffix })
      }
    })
    return () => media.revert()
  }, { scope: root, dependencies: [pathname], revertOnUpdate: true })
}
