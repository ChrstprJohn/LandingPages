import { useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home.jsx'
import Pages, { routeTitle } from './Pages.jsx'
import { Footer, Navigation } from './ui.jsx'
import { useSiteMotion } from './motion.js'
import './styles.css'

function currentView() {
  return { path: location.pathname.replace(/\/+$/, '') || '/', hash: location.hash }
}

function App() {
  const [view, setView] = useState(currentView)
  const scope = useRef(null)
  const entry = useRef(null)
  const nextEntry = useRef(Date.now())
  const offsets = useRef(new Map())

  useLayoutEffect(() => {
    const previous = history.scrollRestoration
    history.scrollRestoration = 'manual'
    entry.current = history.state?.nouvaEntry ?? nextEntry.current++
    history.replaceState({ ...history.state, nouvaEntry: entry.current }, '')

    function restore(event) {
      offsets.current.set(entry.current, scrollY)
      entry.current = event.state?.nouvaEntry ?? nextEntry.current++
      setView({ ...currentView(), offset: offsets.current.get(entry.current) })
    }

    window.addEventListener('popstate', restore)
    return () => {
      window.removeEventListener('popstate', restore)
      history.scrollRestoration = previous
    }
  }, [])

  useLayoutEffect(() => {
    document.title = routeTitle(view.path)
    if (view.offset !== undefined) {
      window.scrollTo({ top: view.offset, behavior: 'instant' })
      return
    }
    const target = view.hash && document.getElementById(view.hash.slice(1))
    if (!target || target.id === 'hero') {
      window.scrollTo({ top: 0, behavior: view.smooth ? 'smooth' : 'instant' })
      return
    }
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop)
    const header = view.followedLink && window.matchMedia('(min-width: 810px)').matches
      ? scope.current.querySelector('header').offsetHeight
      : 0
    const top = scrollY + target.getBoundingClientRect().top - margin - header
    window.scrollTo({ top, behavior: view.smooth ? 'smooth' : 'instant' })
  }, [view])

  useSiteMotion(scope, view.path)

  function followLink(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return
    const anchor = event.target.closest('a[href]')
    if (!anchor || anchor.target || anchor.hasAttribute('download')) return

    const destination = new URL(anchor.href)
    if (destination.origin !== location.origin) return

    event.preventDefault()
    const smooth = destination.pathname === location.pathname && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (destination.href !== location.href) {
      offsets.current.set(entry.current, scrollY)
      entry.current = nextEntry.current++
      history.pushState({ nouvaEntry: entry.current }, '', destination.href)
    }
    setView({ ...currentView(), smooth, followedLink: true })
  }

  return (
    <div ref={scope} className="site" onClick={followLink}>
      <Navigation path={view.path} />
      <main id="main-content" key={view.path}>
        {view.path === '/' ? <Home /> : <Pages path={view.path} />}
      </main>
      <Footer />
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)

if (import.meta.hot) import.meta.hot.dispose(() => root.unmount())
