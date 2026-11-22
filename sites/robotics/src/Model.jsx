import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

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
    let closed = false
    let model
    let spin
    let scrollTurn

    const render = () => {
      pivot.rotation.set(angle.x, angle.y + scrollAngle.y, 0, 'YXZ')
      renderer.render(scene, camera)
    }
    const resize = () => {
      const { clientWidth: width, clientHeight: height } = element
      if (!width || !height) return
      const frustum = 1.48
      const aspect = width / height
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

    new GLTFLoader().load('/media/model.glb', ({ scene: asset }) => {
      if (closed) {
        asset.traverse((node) => {
          if (node.isMesh) {
            node.geometry.dispose()
            node.material.dispose()
          }
        })
        return
      }
      model = asset
      const bounds = new THREE.Box3().setFromObject(model)
      const size = bounds.getSize(new THREE.Vector3())
      const scale = 1.8 / Math.max(size.x, size.y, size.z)
      model.scale.setScalar(scale)
      model.position.copy(bounds.getCenter(new THREE.Vector3()).multiplyScalar(-scale))
      model.traverse((node) => {
        if (!node.isMesh) return
        const edge = node.name === 'Curve013_1'
        node.material.dispose()
        node.material = new THREE.MeshBasicMaterial({
          color: edge ? (inverted ? '#c5f0f7' : '#111111') : (inverted ? '#911a46' : '#ffffff'),
          side: THREE.DoubleSide,
          transparent: !edge,
          opacity: edge ? 1 : 0.70,
        })
      })
      pivot.add(model)
      element.dataset.ready = 'true'
      resize()
      if (inverted && !reduced.matches) {
        spin = gsap.to(angle, { y: Math.PI * 2, duration: 19, ease: 'none', repeat: -1, onUpdate: render })
      }
      if (!inverted && !reduced.matches) {
        scrollTurn = gsap.to(scrollAngle, {
          y: Math.PI, ease: 'none', onUpdate: render,
          scrollTrigger: { trigger: element.closest('.site').querySelector('.hero'), start: 'top top', end: 'bottom 10%', scrub: 2 },
        })
      }
    }, undefined, () => {})

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
      closed = true
      motion.current = null
      observer.disconnect()
      scrollTurn?.scrollTrigger?.kill()
      scrollTurn?.kill()
      if (spin) gsap.killTweensOf(spin)
      spin?.kill()
      gsap.killTweensOf(angle)
      model?.traverse((node) => {
        if (node.isMesh) {
          node.geometry.dispose()
          node.material.dispose()
        }
      })
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
      <span className="model-fallback">D</span>
    </div>
  )
}
