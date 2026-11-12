import { createRoot } from 'react-dom/client'
import './styles.css'

function App() {
  return (
    <>
      <header>
        <nav className="frame flex flex-wrap items-center justify-between gap-x-5 gap-y-2 py-5" aria-label="Main">
          <a className="font-semibold" href="#home">Flower Shop</a>
          <a className="underline underline-offset-4" href="#footer">Site info</a>
        </nav>
      </header>

      <main id="home" className="hero relative isolate flex flex-1 flex-col justify-center overflow-hidden py-16">
        <div className="frame">
          <h1>Flowers in season.</h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed">A florist for seasonal bouquets, gifts, and special occasions.</p>
        </div>
      </main>

      <footer id="footer" className="frame flex flex-wrap items-center justify-between gap-x-5 gap-y-2 py-5">
        <span>Flower Shop · Showcase concept</span>
        <a className="underline underline-offset-4" href="#top">Back to top</a>
      </footer>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
