import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'

function createD(offset) {
  const shape = new THREE.Shape()
  shape.moveTo(offset, -0.83).lineTo(offset + 0.72, -0.83).lineTo(offset + 1.23, -0.43)
    .lineTo(offset + 1.23, 0.43).lineTo(offset + 0.72, 0.83).lineTo(offset, 0.83).closePath()
  const opening = new THREE.Path()
  opening.moveTo(offset + 0.33, -0.49).lineTo(offset + 0.33, 0.49).lineTo(offset + 0.62, 0.49)
    .lineTo(offset + 0.9, 0.28).lineTo(offset + 0.9, -0.28).lineTo(offset + 0.62, -0.49).closePath()
  shape.holes.push(opening)
  return shape
}

function createDecodeGeometry() {
  const c = new THREE.Shape()
  c.moveTo(2.66, 0.83).lineTo(1.93, 0.83).lineTo(1.49, 0.47).lineTo(1.49, -0.47)
    .lineTo(1.93, -0.83).lineTo(2.66, -0.83).lineTo(2.66, -0.49).lineTo(2.05, -0.49)
    .lineTo(1.82, -0.28).lineTo(1.82, 0.28).lineTo(2.05, 0.49).lineTo(2.66, 0.49).closePath()
  return new THREE.ExtrudeGeometry([createD(0), c, createD(2.92)], {
    depth: 0.4, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 2, steps: 1,
  }).center().scale(0.69, 0.69, 0.69)
}

export function Model({ inverted = false, compact = false }) {
  const host = useRef(null)
  const motion = useRef(null)
  const drag = useRef(null)

  useEffect(() => {
    const element = host.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    element.append(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    camera.position.set(5, 5, 5)
    camera.lookAt(0, 0, 0)
    const pivot = new THREE.Group()
    scene.add(pivot)
    const angle = { y: 0, x: 0 }
    const scrollAngle = { y: 0 }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const geometry = createDecodeGeometry()
    geometry.computeBoundingSphere()
    const rotationRadius = geometry.boundingSphere.radius * 1.06
    let spin
    let scrollTurn

    const render = () => {
      pivot.rotation.set(angle.x, angle.y + scrollAngle.y, 0, 'YXZ')
      renderer.render(scene, camera)
    }
    const resize = () => {
      const { clientWidth: width, clientHeight: height } = element
      if (!width || !height) return
      const aspect = width / height
      const frustum = Math.max(1.48, rotationRadius / aspect)
      camera.left = -frustum * aspect
      camera.right = frustum * aspect
      camera.top = frustum
      camera.bottom = -frustum
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      render()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)

    const edges = new THREE.EdgesGeometry(geometry, 28)
    const faces = new THREE.MeshBasicMaterial({
      color: inverted ? '#911a46' : '#ffffff', side: THREE.DoubleSide, transparent: true, opacity: 0.42, depthWrite: false,
    })
    const ink = new THREE.LineBasicMaterial({ color: inverted ? '#c5f0f7' : '#111111' })
    pivot.add(new THREE.Mesh(geometry, faces), new THREE.LineSegments(edges, ink))
    element.dataset.ready = 'true'
    resize()
    const stopMotion = () => {
      scrollTurn?.scrollTrigger?.kill()
      scrollTurn?.kill()
      if (spin) gsap.killTweensOf(spin)
      spin?.kill()
      spin = undefined
      scrollTurn = undefined
      gsap.killTweensOf(angle)
    }
    const updateMotion = () => {
      stopMotion()
      angle.x = 0
      angle.y = 0
      scrollAngle.y = 0
      render()
      if (reduced.matches) return
      if (inverted) {
        spin = gsap.to(angle, { y: Math.PI * 2, duration: 19, ease: 'none', repeat: -1, onUpdate: render })
      } else {
        scrollTurn = gsap.to(scrollAngle, {
          y: Math.PI, ease: 'none', onUpdate: render,
          scrollTrigger: { trigger: element.closest('.site').querySelector('.hero'), start: 'top top', end: 'bottom 10%', scrub: 0.85 },
        })
      }
    }
    updateMotion()
    reduced.addEventListener('change', updateMotion)

    motion.current = {
      rotate: (x, y) => {
        if (inverted || reduced.matches) return
        gsap.to(angle, { x, y, duration: 0.7, ease: 'power3.out', overwrite: true, onUpdate: render })
      },
      burst: () => {
        if (!spin) return
        spin.timeScale(7)
        gsap.to(spin, { timeScale: 1, duration: 0.8, ease: 'power3.out', overwrite: true })
      },
    }
    return () => {
      motion.current = null
      observer.disconnect()
      reduced.removeEventListener('change', updateMotion)
      stopMotion()
      geometry.dispose()
      edges.dispose()
      faces.dispose()
      ink.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      delete element.dataset.ready
    }
  }, [inverted])

  const endDrag = () => {
    if (!drag.current) return
    drag.current = null
    motion.current?.rotate(0, 0)
  }

  return (
    <div
      ref={host}
      className={`model ${compact ? 'model-compact' : ''}`}
      aria-hidden="true"
      onPointerDown={(event) => {
        if (inverted) {
          motion.current?.burst()
          return
        }
        if (event.button !== 0) return
        drag.current = { x: event.clientX, y: event.clientY }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (!drag.current) return
        motion.current?.rotate(
          gsap.utils.clamp(-0.436, 0.436, (event.clientY - drag.current.y) * 0.006),
          gsap.utils.clamp(-0.436, 0.436, (event.clientX - drag.current.x) * 0.006),
        )
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
    >
      <span className="model-fallback">DCD</span>
    </div>
  )
}
