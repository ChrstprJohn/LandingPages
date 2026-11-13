import { createRoot } from 'react-dom/client'
import './styles.css'

const navigation = [
  ['Home', '#home'],
  ['Projects', '#projects'],
  ['Services', '#services'],
  ['About', '#about'],
  ['Contact', '#contact'],
]

const gardenHouse = new URL('./garden-house.webp', import.meta.url).href

function App() {
  return (
    <>
      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <header className="hero-header">
            <a className="wordmark" href="#home">Tanaka Architecture Office</a>
            <nav aria-label="Main navigation">
              {navigation.map(([label, href]) => (
                <a key={href} href={href}>{label}</a>
              ))}
            </nav>
          </header>

          <div className="hero-copy">
            <h1 id="hero-title">Architecture<br />for Better Living</h1>
            <p>Homes <span aria-hidden="true">/</span> Workplaces <span aria-hidden="true">/</span> Communities</p>
            <a className="project-link" href="#projects">Our Projects <span className="project-arrow" aria-hidden="true"></span></a>
          </div>
        </section>

        <section className="section project-section" id="projects">
          <h2>Our Projects</h2>
          <figure>
            <img src={gardenHouse} alt="A concrete and glass home opening onto a wooded garden" loading="lazy" width="1536" height="1024" />
            <figcaption>
              <h3>Garden House</h3>
              <p>A residential concept with a concrete canopy and full-height glazing overlooking a shaded garden.</p>
            </figcaption>
          </figure>
        </section>

        <section className="section services-section" id="services">
          <h2>Services</h2>
          <p>We design homes, workplaces, and community spaces around the people who use them.</p>
          <dl className="service-list">
            <div><dt>Homes</dt><dd>New homes and renovations shaped by daily routines, daylight, and the landscape.</dd></div>
            <div><dt>Workplaces</dt><dd>Adaptable spaces for focused work, collaboration, and meetings.</dd></div>
            <div><dt>Community spaces</dt><dd>Welcoming places for gathering, learning, and sharing resources.</dd></div>
          </dl>
        </section>

        <section className="section about-section" id="about">
          <h2>About the studio</h2>
          <div>
            <p>Tanaka Architecture Office designs spaces shaped by everyday life and the landscape around them.</p>
            <p>Our approach starts with the site. We look at how light moves, how people arrive, and how a building can open onto the landscape. Those observations guide the plan and the materials we choose.</p>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <h2>Contact</h2>
          <p>Planning a project? Tell us about your site, what you’d like to build, and when you hope to start.</p>
          <p>Studio contact details are pending.</p>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark" href="#home">Tanaka Architecture Office</a>
        <a className="text-link" href="#home">Back to top ↑</a>
      </footer>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
