import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { testimonials } from './content.js'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function paintTitle(title, canvas, pointer = false) {
  const width = Math.round(title.clientWidth)
  const height = Math.round(title.clientHeight)
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!width || !height || !context) return null

  const style = getComputedStyle(title)
  canvas.width = width
  canvas.height = height
  context.font = style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily
  context.letterSpacing = style.letterSpacing
  const text = title.textContent
  const metrics = context.measureText(text)
  const baseline = (height + metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2
  context.fillStyle = '#fff'
  context.fillText(text, 0, baseline)

  const pixels = context.getImageData(0, 0, width, height).data
  const step = !pointer && width >= 700 ? 4 : 2
  const particles = []
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (pixels[(y * width + x) * 4 + 3] < 140) continue
      const seed = (x * 19 + y * 23) % 103
      particles.push([x, y, (seed % 21 - 10) * 1.7, ((seed * 11) % 23 - 11) * 1.8, seed / 260])
    }
  }

  if (pointer) return pointerField(canvas, context, particles, step)

  function entrance(progress) {
    context.clearRect(0, 0, width, height)
    context.globalAlpha = Math.min(1, progress * 3)
    context.fillStyle = '#fff'
    for (const [x, y, offsetX, offsetY, lag] of particles) {
      const amount = Math.max(0, 1 - progress / (1 + lag))
      const drift = amount * amount
      const size = step * (1 - 0.62 * amount)
      context.fillRect(x + offsetX * drift, y + offsetY * drift, size, size)
    }
  }
  return { entrance }
}

function pointerField(canvas, context, particles, step) {
  const { width, height } = canvas
  const solid = document.createElement('canvas')
  solid.width = width
  solid.height = height
  solid.getContext('2d').drawImage(canvas, 0, 0)

  const columns = Math.ceil(width / step)
  const rows = Math.ceil(height / step)
  const samples = new Int32Array(columns * rows).fill(-1)
  const influence = new Float32Array(particles.length)
  const strongest = new Uint8Array(particles.length)
  particles.forEach(([x, y], i) => { samples[y / step * columns + x / step] = i })

  function render(brushes, radius) {
    context.clearRect(0, 0, width, height)
    context.globalAlpha = 1
    context.drawImage(solid, 0, 0)
    context.globalCompositeOperation = 'destination-out'
    const affected = []

    brushes.forEach(({ x, y, strength }, brushIndex) => {
      const edge = context.createRadialGradient(x, y, radius * .6, x, y, radius)
      edge.addColorStop(0, `rgba(0,0,0,${strength})`)
      edge.addColorStop(1, 'transparent')
      context.fillStyle = edge
      context.fillRect(x - radius, y - radius, 2 * radius, 2 * radius)

      const left = Math.max(0, Math.floor((x - radius) / step))
      const right = Math.min(columns - 1, Math.ceil((x + radius) / step))
      const top = Math.max(0, Math.floor((y - radius) / step))
      const bottom = Math.min(rows - 1, Math.ceil((y + radius) / step))
      for (let row = top; row <= bottom; row++) {
        for (let column = left; column <= right; column++) {
          const i = samples[row * columns + column]
          if (i < 0) continue
          const distance = Math.hypot(column * step - x, row * step - y)
          const amount = (1 - distance / radius) * strength
          if (amount <= influence[i]) continue
          if (influence[i] === 0) affected.push(i)
          influence[i] = amount
          strongest[i] = brushIndex
        }
      }
    })

    context.globalCompositeOperation = 'source-over'
    context.fillStyle = '#fff'
    for (const i of affected) {
      const [x, y, jitterX, jitterY, seed] = particles[i]
      const brush = brushes[strongest[i]]
      const dx = x - brush.x
      const dy = y - brush.y
      const distance = Math.max(.5, Math.hypot(dx, dy))
      const amount = influence[i]
      const push = radius * amount * .28
      const spread = Math.sin(amount * Math.PI / 2) * 1.45
      const size = 1.05 + seed * 2.2
      context.globalAlpha = Math.min(1, (.82 + seed * .45) * brush.strength)
      context.fillRect(x + dx / distance * push + jitterX * spread,
        y + dy / distance * push + jitterY * spread, size, size)
      influence[i] = 0
    }
    context.globalAlpha = 1
  }

  return { render, clear: () => context.clearRect(0, 0, width, height) }
}

function titleEntrance(hero, contextSafe) {
  const title = hero.querySelector('[data-hero-title]')
  const canvas = hero.querySelector('.hero-letters')
  gsap.set(title, { opacity: 0 })
  let active = true

  const start = contextSafe(() => {
    if (!active) return
    const field = paintTitle(title, canvas)
    if (!field) {
      gsap.to(title, { opacity: 1, duration: .7, ease: 'power2.out' })
      return
    }
    const state = { progress: 0 }
    const timeline = gsap.timeline({ delay: .25, defaults: { ease: 'power2.out' } })
    timeline.to(state, { progress: 1.4, duration: 1.08, onUpdate: () => field.entrance(state.progress) })
    timeline.to(title, { opacity: 1, duration: .27 }, .81)
    timeline.to(canvas, { opacity: 0, duration: .28 }, .78)
  })

  document.fonts.load('600 48px Baskervville').then(start, start)
  return () => { active = false }
}

function connectTitlePointer(hero) {
  const title = hero.querySelector('[data-hero-title]')
  const canvas = hero.querySelector('.hero-letters--pointer')
  const recovery = 540
  let trail = []
  let pointer = null
  let field = null
  let paintFrame = 0

  function render(now) {
    paintFrame = 0
    trail = trail.filter(sample => now - sample.time < recovery)
    const brushes = trail.map(sample => ({
      ...sample, strength: .68 * Math.max(0, 1 - Math.max(0, now - sample.time - 65) / (recovery - 65)),
    }))
    if (pointer) brushes.push({ ...pointer, strength: 1 })
    title.toggleAttribute('data-particle-active', brushes.length > 0)
    if (brushes.length) {
      const radius = Math.min(52, Math.max(25, title.clientHeight * .23))
      field.render(brushes, radius)
    } else {
      field.clear()
    }
    if (trail.length) scheduleRender()
  }

  function scheduleRender() {
    if (!paintFrame) paintFrame = requestAnimationFrame(render)
  }

  function move(event) {
    if (event.pointerType !== 'mouse' || Number(getComputedStyle(title).opacity) < .98) return
    if (!field || canvas.width !== title.clientWidth || canvas.height !== title.clientHeight) {
      field = paintTitle(title, canvas, true)
      trail = []
      pointer = null
    }
    if (!field) return
    const bounds = title.getBoundingClientRect()
    const next = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, time: performance.now() }
    if (pointer) {
      const dx = next.x - pointer.x
      const dy = next.y - pointer.y
      const distance = Math.hypot(dx, dy)
      const elapsed = Math.min(recovery, next.time - pointer.time)
      const count = Math.min(40, Math.ceil(distance / 22))
      for (let i = 0; i < count; i++) {
        const position = i / count
        trail.push({
          x: pointer.x + dx * position, y: pointer.y + dy * position,
          time: next.time - elapsed * (1 - position),
        })
      }
      if (trail.length > 64) trail.splice(0, trail.length - 64)
    }
    pointer = next
    scheduleRender()
  }

  function leave() {
    if (!pointer) return
    trail.push({ ...pointer, time: performance.now() })
    pointer = null
    scheduleRender()
  }
  title.addEventListener('pointermove', move)
  title.addEventListener('pointerleave', leave)
  return () => {
    cancelAnimationFrame(paintFrame)
    field?.clear()
    title.removeAttribute('data-particle-active')
    title.removeEventListener('pointermove', move)
    title.removeEventListener('pointerleave', leave)
  }
}

function projectScroll(panel) {
  const foreground = panel.querySelector('.project-content')
  const background = panel.querySelector('.project-bg')
  const text = panel.querySelector('.project-type')
  const timeline = gsap.timeline({ scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: .28 } })
  timeline.fromTo(background, { scale: 1.2 }, { scale: 1, duration: .5, ease: 'none' }, 0)
  timeline.to(background, { scale: 1.2, duration: .5, ease: 'none' }, .5)
  timeline.fromTo(text, { x: 0 }, { x: () => -panel.clientWidth * .3, duration: 1, ease: 'none' }, 0)
  timeline.fromTo(foreground, { opacity: 0, y: 100, rotationX: 45, transformPerspective: 1200 }, {
    opacity: 1, y: 0, rotationX: 0, duration: .24, ease: 'power2.out',
  }, .26)
  timeline.to(foreground, { opacity: 0, y: -100, rotationX: -45, duration: .25, ease: 'power2.in' }, .52)
}

export function useProjectMotion(scope, entries) {
  useGSAP(() => {
    const media = gsap.matchMedia(scope.current)
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.project-panel', scope.current).forEach(projectScroll)
    })
    return () => media.revert()
  }, { scope, dependencies: [entries], revertOnUpdate: true })
}

function testimonialScroll(section) {
  const [first, second, third] = gsap.utils.toArray('.testimonial-card', section)
  const label = section.querySelector('.active-testimonial-project')
  const timeline = gsap.timeline({
    defaults: { duration: 1, ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: ({ progress }) => {
        const index = Math.min(2, Math.floor(progress * 3))
        label.textContent = testimonials[index].project
      },
    },
  })
  timeline.to(first, { x: 45, y: -900, rotation: 8 }, 0)
  timeline.to(second, { y: -40, scale: 1 }, 0)
  timeline.to(first, { opacity: 0 }, 1)
  timeline.to(second, { x: -45, y: -900, rotation: -8, scale: .95 }, 1)
  timeline.to(third, { y: -80, scale: .99 }, 1)
  timeline.to(second, { opacity: 0 }, 2)
}

function connectCursor(root, cursor) {
  const moveX = gsap.quickTo(cursor, 'x', { duration: .18, ease: 'power2' })
  const moveY = gsap.quickTo(cursor, 'y', { duration: .18, ease: 'power2' })
  const expandablePreview = window.matchMedia('(min-width: 810px)')
  let preview = null
  let point = null
  let scrollFrame = 0
  let variant = ''

  function updateTarget(target) {
    const project = expandablePreview.matches ? target?.closest('.project-content') : null
    const nextPreview = project && Number(project.style.opacity || 1) > .02 ? project : null
    if (nextPreview !== preview) {
      preview?.removeAttribute('data-preview')
      preview = nextPreview
      preview?.setAttribute('data-preview', '')
    }
    const next = preview ? 'project'
      : target?.closest('a:not(.skip-link, .project-panel), button, [tabindex="0"]') ? 'interactive' : ''
    if (variant !== next) {
      cursor.dataset.variant = next
      variant = next
    }
  }

  function move(event) {
    if (event.pointerType !== 'mouse') return
    root.classList.add('has-cursor')
    cursor.style.opacity = '1'
    point = [event.clientX, event.clientY]
    updateTarget(event.target)
    moveX(event.clientX)
    moveY(event.clientY)
  }

  function recheckTarget() {
    if (!point || scrollFrame) return
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0
      if (point) updateTarget(document.elementFromPoint(...point))
    })
  }

  function hide() {
    point = null
    updateTarget(null)
    root.classList.remove('has-cursor')
    cursor.style.opacity = '0'
  }
  window.addEventListener('pointermove', move)
  document.addEventListener('pointerleave', hide)
  window.addEventListener('blur', hide)
  window.addEventListener('scroll', recheckTarget, { passive: true })
  window.addEventListener('resize', recheckTarget)
  return () => {
    hide()
    cancelAnimationFrame(scrollFrame)
    window.removeEventListener('pointermove', move)
    document.removeEventListener('pointerleave', hide)
    window.removeEventListener('blur', hide)
    window.removeEventListener('scroll', recheckTarget)
    window.removeEventListener('resize', recheckTarget)
  }
}

function heroEntrance(hero, navigation, menu) {
  const desktop = window.matchMedia('(min-width: 1200px)').matches
  const title = hero.querySelector('.hero-title-size')
  const image = hero.querySelector('.hero-picture img')
  const grain = hero.querySelector(':scope > .grain')
  const bottom = hero.querySelector('.hero-bottom')
  const entrance = gsap.timeline({ defaults: { duration: 1.05, ease: 'expo.out' } })
  const artStart = desktop ? 1.8 : 1.45
  const navStart = artStart - .14

  entrance.from(navigation, { autoAlpha: .001, y: 10, duration: .5, ease: 'power2.out' }, navStart)
  entrance.from(menu, { autoAlpha: .001, duration: .35, ease: 'power2.out' }, navStart)
  entrance.from(image, { opacity: .001, scale: 1.2 }, artStart)
  entrance.from(grain, { opacity: .001 }, artStart)
  entrance.from(bottom, { autoAlpha: .001, y: desktop ? 200 : 80 }, artStart)
  entrance.from(title, { y: () => (hero.clientHeight - title.offsetHeight) / 2 - title.offsetTop }, artStart + .13)
}

function riseEase(duration, slow, fast) {
  const residual = (time) => (fast * Math.exp(-slow * time) - slow * Math.exp(-fast * time)) / (fast - slow)
  const total = 1 - residual(duration)
  return (progress) => (1 - residual(progress * duration)) / total
}

const quickRise = { duration: .95, ease: riseEase(.95, 9, 19) }
const journalRise = { duration: 1.25, ease: riseEase(1.25, 6.4, 30) }
const revealInView = { carousel: quickRise, edge: { ...quickRise, delay: .12 }, journal: journalRise, photo: journalRise }

export function useSiteMotion(scope, restoreScroll) {
  useGSAP((_, contextSafe) => {
    const root = scope.current
    const media = gsap.matchMedia(root)
    const select = gsap.utils.selector(root)

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = root.querySelector('.hero')
      let cancelTitle = () => {}
      const navigation = select('[data-nav-entry]')
      const letters = select('[data-letter]')
      if (letters.length) {
        gsap.from(letters, { opacity: .001, y: 20, duration: 1.25, delay: .18, stagger: .05, ease: 'expo.out', clearProps: 'transform' })
      }
      if (hero) {
        if (!restoreScroll) {
          heroEntrance(hero, navigation, root.querySelector(':scope > .menu-toggle'))
          cancelTitle = titleEntrance(hero, contextSafe)
        }
        gsap.to(select('.hero-picture'), { yPercent: 30, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      } else {
        gsap.from(navigation, { opacity: .001, y: 10, duration: .55, delay: .12, ease: 'power2.out' })
      }

      select('.page-hero-picture').forEach((picture) => {
        gsap.from(picture.querySelector('img'), { scale: 1.2, opacity: 1, duration: .9, ease: 'power2.out' })
        gsap.to(picture, { yPercent: 30, ease: 'none', scrollTrigger: { trigger: picture.parentElement, start: 'top top', end: 'bottom top', scrub: true } })
      })

      select('[data-cover-entry] img').forEach((image) => {
        gsap.from(image, { scale: 1.17, duration: .85, ease: 'power2.out', clearProps: 'transform' })
      })

      select('[data-text-reveal]').forEach((block) => {
        gsap.fromTo(block.querySelectorAll('[data-word]'), { opacity: .19 }, {
          opacity: 1, duration: .22, stagger: { amount: 1 }, ease: 'none',
          scrollTrigger: { trigger: block, start: 'top 80%', end: 'bottom 48%', scrub: .27 },
        })
      })

      select('[data-reading-reveal]').forEach((block) => {
        gsap.fromTo(block.querySelectorAll('[data-word]'), { opacity: .4 }, {
          opacity: 1, duration: .018, stagger: { amount: 1 }, ease: 'none',
          scrollTrigger: { trigger: block, start: 'top 90%', end: 'bottom 45%', scrub: true },
        })
      })

      select('[data-heading-reveal]').forEach((heading) => {
        gsap.fromTo(heading.querySelectorAll('[data-word]'), { opacity: .001, y: 20 }, {
          opacity: 1, y: 0, duration: .55, stagger: .045, ease: 'power2.out',
          scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
          clearProps: 'transform',
        })
      })

      select('[data-reveal]').forEach((block) => {
        const kind = block.dataset.reveal
        const motion = revealInView[kind]
        gsap.fromTo(block, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, ...(motion || { duration: .65, ease: 'power2.out' }),
          scrollTrigger: {
            trigger: block, once: true,
            start: () => {
              const rect = block.getBoundingClientRect()
              const top = rect.top + window.scrollY - Number(gsap.getProperty(block, 'y'))
              if (motion) {
                // The reference triggers on the portion in view while the layer is still 40 px down.
                const coverage = kind === 'carousel' ? .493 : .5
                return top + 40 - window.innerHeight + Math.min(rect.height, window.innerHeight) * coverage
              }
              return top - window.innerHeight * (kind === 'grid' ? .75 : .85)
            },
          },
          clearProps: 'transform',
        })
      })

      select('[data-ticker-reveal]').forEach((track) => {
        gsap.fromTo(track, { opacity: 0, x: -64 }, {
          opacity: 1, x: 0, duration: .65, ease: 'power2.out',
          scrollTrigger: { trigger: track.parentElement, start: 'top 85%', once: true },
        })
      })

      select('.process-rows, .faq-rows').forEach((rows) => {
        gsap.from(rows.querySelectorAll('.disclosure-divider'), {
          scaleX: .001, opacity: 1, duration: .85, ease: 'power2.inOut',
          scrollTrigger: { trigger: rows, start: 'top 80%', once: true },
        })
      })

      select('[data-metric]').forEach((number) => {
        const count = { value: 1000 }
        const suffix = number.textContent.slice('3,100'.length)
        number.textContent = '1,000' + suffix
        gsap.to(count, {
          value: 3100, duration: 1.15, ease: 'power2.out',
          onUpdate: () => { number.textContent = Math.round(count.value).toLocaleString('en-US') + suffix },
          scrollTrigger: { trigger: number, start: 'top 85%', once: true },
        })
      })

      select('.parallax-image').forEach((frame) => {
        const image = frame.querySelector('img')
        if (frame.matches('.about-image') && window.matchMedia('(min-width: 700px)').matches) {
          gsap.fromTo(image, { y: -250 }, {
            y: 0, ease: 'none', scrollTrigger: {
              trigger: frame, scrub: true,
              start: () => frame.getBoundingClientRect().top + window.scrollY - Number(gsap.getProperty(frame, 'y')) - window.innerHeight,
              end: () => '+=' + frame.clientHeight * 3,
            },
          })
        } else {
          gsap.fromTo(image, { yPercent: -12 }, {
            yPercent: 0, ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: .3 },
          })
        }
      })

      select('.testimonials').forEach(testimonialScroll)

      select('.contact-banner').forEach((banner) => {
        const words = banner.querySelectorAll('.contact-big span')
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: banner, start: 'top bottom', end: 'top top', scrub: true },
        })
        timeline.from(words[0], { x: -500, ease: 'none' }, 0)
        timeline.from(words[1], { x: 500, ease: 'none' }, 0)
      })
      return cancelTitle
    })

    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const removeCursor = connectCursor(root, root.querySelector('.custom-cursor'))
      const hero = root.querySelector('.hero')
      const removeTitlePointer = hero ? connectTitlePointer(hero) : null
      return () => { removeCursor(); removeTitlePointer?.() }
    })

    let active = true
    document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh() })
    return () => { active = false; media.revert() }
  }, { scope })
}
