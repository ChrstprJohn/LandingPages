import { useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

const pathname = () => window.location.pathname.replace(/\/+$/, '') || '/'

export function useRoute() {
  const [path, setPath] = useState(pathname)
  const positions = useRef(new Map())

  useLayoutEffect(() => {
    const previousRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    let entry = history.state?.key ?? 0
    let nextEntry = entry + 1
    history.replaceState({ key: entry }, '')
    function show(url, top) {
      window.scrollTo(0, 0)
      flushSync(() => setPath(url))
      if (top) window.scrollTo(0, top)
    }

    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      const link = event.target.closest('a[href]')
      if (!link || link.target || link.hasAttribute('download')) return
      const url = new URL(link.href)
      if (url.origin !== window.location.origin || url.hash) return
      event.preventDefault()
      if (url.pathname === pathname()) {
        window.scrollTo(0, 0)
        return
      }

      positions.current.set(entry, window.scrollY)
      entry = nextEntry++
      history.pushState({ key: entry }, '', url)
      show(pathname(), 0)
    }

    function onPop(event) {
      positions.current.set(entry, window.scrollY)
      entry = event.state?.key ?? 0
      show(pathname(), positions.current.get(entry) ?? 0)
    }

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
