import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import Home from './Home.jsx'
import Pages, { routeTitle } from './Pages.jsx'
import { Footer, Navigation } from './ui.jsx'
import { useSiteMotion } from './motion.js'
import './styles.css'

const readPath = () => window.location.pathname.replace(/\/+$/, '') || '/'
const defaultTitle = document.title

function SitePage({ path, restoreScroll }) {
  const scope = useRef(null)
  const home = path === '/'
  const lightNavigation = !path.startsWith('/blog/') && !path.startsWith('/work/')

  useSiteMotion(scope, restoreScroll)

  useEffect(() => {
    const title = routeTitle(path)
    document.title = title ? title + ' — Aldena Studio' : defaultTitle
  }, [path])

  return (
    <div ref={scope} className="site">
      <Navigation path={path} light={lightNavigation} />
      <main id="main-content" tabIndex={-1}>{home ? <Home /> : <Pages path={path} />}</main>
      <Footer />
      <div className="custom-cursor" aria-hidden="true"><span>View More</span></div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState(() => ({ path: readPath(), key: 0, restoreScroll: false }))

  useEffect(() => {
    const savedScroll = new Map()
    const previousRestoration = history.scrollRestoration
    let currentKey = history.state?.agencyPage ?? 0
    let nextKey = currentKey
    let updateId = 0
    let transition
    history.scrollRestoration = 'manual'
    history.replaceState({ ...history.state, agencyPage: currentKey }, '')

    function navigate(path, key, url) {
      savedScroll.set(currentKey, window.scrollY)
      const restoredY = url ? 0 : (savedScroll.get(key) ?? 0)
      const id = ++updateId
      transition?.skipTransition()

      function update() {
        if (id !== updateId) return
        if (url) history.pushState({ agencyPage: key }, '', url)
        currentKey = key
        flushSync(() => setPage({ path, key, restoreScroll: restoredY > 0 }))
        window.scrollTo({ top: restoredY, behavior: 'instant' })
        document.getElementById('main-content')?.focus({ preventScroll: true })
      }

      if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        update()
        return
      }

      transition = document.startViewTransition(update)
      transition.ready.catch(() => {})
    }

    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      const anchor = event.target.closest('.site a[href]')
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return
      const url = new URL(anchor.href)
      if (url.origin !== location.origin || url.hash) return
      const path = url.pathname.replace(/\/+$/, '') || '/'
      if (path !== '/' && !routeTitle(path)) return

      event.preventDefault()
      if (path === readPath() && url.search === location.search) {
        window.scrollTo({ top: 0, behavior: 'instant' })
        return
      }
      navigate(path, ++nextKey, url.href)
    }

    function onPopState(event) {
      const key = event.state?.agencyPage
      if (key === undefined || key === currentKey) return
      navigate(readPath(), key)
    }

    document.addEventListener('click', onClick)
    window.addEventListener('popstate', onPopState)
    return () => {
      updateId += 1
      transition?.skipTransition()
      history.scrollRestoration = previousRestoration
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  return <SitePage key={page.key} path={page.path} restoreScroll={page.restoreScroll} />
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)

if (import.meta.hot) import.meta.hot.dispose(() => root.unmount())
