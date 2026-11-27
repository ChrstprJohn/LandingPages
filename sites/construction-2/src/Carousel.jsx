import { useEffect, useRef, useState } from 'react'

export function Arrow({ direction = 'diagonal' }) {
  const paths = {
    diagonal: 'M5 15 15 5M5 5h10v10',
    left: 'm10 5-5 5 5 5M5 10h10',
    right: 'm10 5 5 5-5 5M15 10H5',
  }
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={paths[direction]} stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function Carousel({ label, count, children, loop = false, className = '' }) {
  const track = useRef(null)
  const pointer = useRef(null)
  const suppressClick = useRef(false)
  const [index, setIndex] = useState(0)
  const [perView, setPerView] = useState(3)
  const [drag, setDrag] = useState(0)
  const last = Math.max(0, count - perView)
  const active = loop ? (index + last + 1) % (last + 1) : Math.min(index, last)
  const firstDot = Math.max(0, Math.min(last - 7, active - 5))
  const dotCount = Math.min(last + 1, 8)

  useEffect(() => {
    const update = () => {
      const visible = Number(getComputedStyle(track.current).getPropertyValue('--per-view'))
      setPerView(visible)
      if (!loop) setIndex(current => Math.min(current, Math.max(0, count - visible)))
    }
    const size = new ResizeObserver(update)
    update()
    size.observe(track.current)
    return () => size.disconnect()
  }, [count, loop])

  const move = delta => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    setIndex(current => {
      if (!loop) return Math.min(last, Math.max(0, current + delta))
      if (reduced) return (current + delta + count * 2) % count
      return current >= 0 && current <= last ? current + delta : current
    })
  }

  function settleLoop(event) {
    if (event.target !== track.current || event.propertyName !== 'transform' || index === active) return
    const strip = track.current
    strip.style.transition = 'none'
    setIndex(active)
    requestAnimationFrame(() => requestAnimationFrame(() => strip.style.removeProperty('transition')))
  }

  function startDrag(event) {
    if (!event.isPrimary || event.button !== 0) return
    suppressClick.current = false
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, active: false }
  }

  function moveDrag(event) {
    const start = pointer.current
    if (!start || start.id !== event.pointerId) return
    const x = event.clientX - start.x
    if (!start.active) {
      if (Math.abs(x) < 8 || Math.abs(x) < Math.abs(event.clientY - start.y)) return
      start.active = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    const atEdge = !loop && ((active === 0 && x > 0) || (active === last && x < 0))
    setDrag(atEdge ? x * 0.22 : x)
  }

  function endDrag(event) {
    const start = pointer.current
    if (!start || start.id !== event.pointerId) return
    pointer.current = null
    setDrag(0)
    if (!start.active || event.type === 'pointercancel') return
    suppressClick.current = true
    const distance = event.clientX - start.x
    if (Math.abs(distance) > 35) move(distance < 0 ? 1 : -1)
  }

  return (
    <div className={`carousel ${className}`} role="region" aria-roledescription="carousel" aria-label={label}
      onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault()
        move(event.key === 'ArrowLeft' ? -1 : 1)
      }}>
      <div className="carousel-window"
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}
        onPointerLeave={() => { if (!pointer.current?.active) pointer.current = null }}
        onDragStart={event => event.preventDefault()}
        onClickCapture={event => {
          if (!suppressClick.current || event.detail === 0) return
          event.preventDefault()
          event.stopPropagation()
          suppressClick.current = false
        }}>
        <div className="carousel-track" ref={track} data-dragging={drag !== 0} onTransitionEnd={settleLoop}
          style={{ '--index': loop ? index + 1 : active, '--drag': `${drag}px` }}>
          {loop && <div className="carousel-slide" aria-hidden="true" data-active={active === last} inert>{children.at(-1)}</div>}
          {children.map((child, position) => {
            const visible = position >= active && position < active + perView
            return (
              <div className="carousel-slide" key={child.key} role="group" aria-roledescription="slide"
                aria-label={`${position + 1} of ${count}`} data-active={visible} inert={!visible}>
                {child}
              </div>
            )
          })}
          {loop && <div className="carousel-slide" aria-hidden="true" data-active={active === 0} inert>{children[0]}</div>}
        </div>
      </div>
      <div className="carousel-controls">
        <div className="carousel-pages">
          {Array.from({ length: dotCount }, (_, offset) => firstDot + offset).map(page => (
            <button type="button" key={page} aria-label={`Go to slide ${page + 1}`}
              aria-current={page === active ? 'true' : undefined} onClick={() => setIndex(page)} />
          ))}
        </div>
        <div className="carousel-arrows">
          <button type="button" aria-label="Previous slide" aria-disabled={!loop && active === 0} onClick={() => move(-1)}><Arrow direction="left" /></button>
          <button type="button" aria-label="Next slide" aria-disabled={!loop && active === last} onClick={() => move(1)}><Arrow direction="right" /></button>
        </div>
      </div>
    </div>
  )
}
