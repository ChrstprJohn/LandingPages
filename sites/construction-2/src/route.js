import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

function normalizePath(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  return path === '/home' ? '/' : path
}

const currentPath = () => normalizePath(window.location.pathname)
const newKey = () => Math.random().toString(36).slice(2)

export function useRoute() {
  const active = useRef(null)
  const activePath = useRef(currentPath())
  const positions = useRef(new Map())
  const revision = useRef(0)
  const currentTransition = useRef(null)
  const [route, setRoute] = useState(() => ({ path: currentPath() }))

  function navigate(update, animate = true) {
    const nextRevision = ++revision.current
    currentTransition.current?.skipTransition()
    function commit() {
      if (nextRevision === revision.current) flushSync(update)
    }
    if (!animate || !document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      commit()
      return
    }

    const transition = document.startViewTransition(commit)
    currentTransition.current = transition
    transition.ready.catch(() => {})
    const clear = () => {
      if (currentTransition.current === transition) currentTransition.current = null
    }
    transition.finished.then(clear, clear)
  }

  useEffect(() => {
    const restoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    active.current = history.state?.ironwoodKey ?? newKey()
    history.replaceState({ ...history.state, ironwoodKey: active.current }, '')

    function restore(event) {
      const path = currentPath()
      if (path === activePath.current) {
        ++revision.current
        currentTransition.current?.skipTransition()
        return
      }
      positions.current.set(active.current, scrollY)
      const key = event.state?.ironwoodKey ?? newKey()
      navigate(() => {
        active.current = key
        activePath.current = path
        setRoute({ path, scroll: positions.current.get(key) ?? 0, focus: true })
      })
    }
    window.addEventListener('popstate', restore)
    return () => {
      ++revision.current
      currentTransition.current?.skipTransition()
      history.scrollRestoration = restoration
      window.removeEventListener('popstate', restore)
    }
  }, [])

  useLayoutEffect(() => {
    if (route.scroll === undefined) return
    window.scrollTo({ top: route.scroll, behavior: 'instant' })
    if (route.focus) document.querySelector('main')?.focus({ preventScroll: true })
  }, [route])

  function followLink(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.target.closest('a[href]')
    const href = link?.getAttribute('href')
    if (!href?.startsWith('/') || href.startsWith('//') || link.target || link.hasAttribute('download')) return

    const destination = new URL(link.href)
    if (destination.hash || destination.search) return
    event.preventDefault()
    positions.current.set(active.current, scrollY)
    const isNewPath = normalizePath(destination.pathname) !== activePath.current
    navigate(() => {
      if (destination.pathname !== location.pathname || location.hash || location.search) {
        active.current = newKey()
        history.pushState({ ironwoodKey: active.current }, '', destination.pathname)
      }
      activePath.current = currentPath()
      setRoute({ path: activePath.current, scroll: 0, focus: true })
    }, isNewPath)
  }

  return { path: route.path, followLink }
}
