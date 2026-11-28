import { useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

const pathname = () => location.pathname.replace(/\/+$/, '') || '/'

export function useRoute() {
  const [path, setPath] = useState(pathname)
  const positions = useRef(new Map())

  useLayoutEffect(() => {
    const previousRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    let entry = history.state?.hotelEntry ?? 0
    let nextEntry = entry + 1
    let renderedPath = pathname()
    history.replaceState({ ...history.state, hotelEntry: entry }, '')

    function show(top, focus) {
      const nextPath = pathname()
      if (nextPath !== renderedPath) {
        window.scrollTo(0, top ?? 0)
        renderedPath = nextPath
        flushSync(() => setPath(nextPath))
      }
      const target = document.getElementById(location.hash.slice(1))
      if (focus) (target || document.querySelector('main h1'))?.focus({ preventScroll: true })
      if (top === undefined && target) target.scrollIntoView()
      else window.scrollTo(0, top ?? 0)
    }

    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      const link = event.target.closest('a[href]')
      if (!link || link.target || link.hasAttribute('download')) return
      const url = new URL(link.href)
      if (url.origin !== location.origin) return
      event.preventDefault()
      if (url.href !== location.href) {
        positions.current.set(entry, window.scrollY)
        entry = nextEntry++
        history.pushState({ hotelEntry: entry }, '', url)
      }
      show(undefined, event.detail === 0 || url.hash === '#main')
    }

    function onPop(event) {
      const next = event.state?.hotelEntry
      if (next === undefined || next === entry) return
      positions.current.set(entry, window.scrollY)
      entry = next
      show(positions.current.get(entry), false)
    }

    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView()
    document.addEventListener('click', onClick)
    window.addEventListener('popstate', onPop)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPop)
      history.scrollRestoration = previousRestoration
    }
  }, [])

  return path
}
