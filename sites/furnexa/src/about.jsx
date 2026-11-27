import { useRef, useState } from 'react'
import { ArrowControls, Icon, Photo } from './ui'

const reasons = [
  ['chair', 'Simple, enduring forms', 'Clean proportions work across different rooms and sit comfortably alongside the pieces you already own.'],
  ['support', 'Comfort for daily life', 'Supportive contours and soft finishes make each piece feel good to use, even after hours of sitting.'],
  ['award', 'Careful hand finishing', 'We pay close attention to joints, edges, and finishes, choosing materials that can take regular use.'],
  ['return', 'Responsibly chosen materials', 'We look for responsibly sourced wood and fabric with the strength and character to hold up over time.'],
]

const makers = [
  ['jane', 'Design', 'Proportion and material planning'],
  ['mark', 'Prototyping', 'From sketch to form'],
  ['lily', 'Upholstery', 'Cutting and stitching fabric'],
  ['ethan', 'Joinery', 'Measuring and fitting'],
  ['maya', 'Finishing', 'Smoothing wood surfaces'],
]

function AboutHero() {
  return <section className="about-hero">
    <Photo className="about-hero-background" file="about-banner.jpg" eager />
    <h1 className="sr-only">Our studio</h1>
    <div className="about-hero-ticker" aria-hidden="true">
      <div>{Array.from({ length: 8 }, (_, index) => <span key={index}>Our studio <i>–</i></span>)}</div>
    </div>
    <figure className="about-hero-figure">
      <div className="about-hero-arch"><Photo file="about-chair.png" alt="Sculptural wooden chair" eager /></div>
      <figcaption><span>Made for living<br /> and working well</span><span>• &nbsp;Est. 2019</span></figcaption>
    </figure>
  </section>
}

function Philosophy() {
  return <section className="page-width about-philosophy" aria-label="Our story">
    <div className="about-lead" data-page-reveal>
      <p>DCRAFTS started in a small workshop in 2019, building furniture by hand, one order at a time. Those first commissions taught us how much the details matter. Today our pieces find their way into homes and workspaces far beyond that original shop.</p>
      <p>The things we cared about then still guide the collection today. We choose materials for how they age, draw forms that make sense in everyday rooms, and work through the details until a piece feels as good to use as it looks.</p>
    </div>
    <div className="about-quality"><Photo file="about-quality.jpg" alt="Furniture made with care and attention to detail" /></div>
    <div className="about-mission-row">
      <Photo className="about-star" file="about-star.svg" />
      <div className="about-mission" data-page-reveal>
        <Photo file="about-shape.png" />
        <h2 className="sub-title">What Guides Our Work</h2>
        <p>At DCRAFTS, we start by asking how somebody will use the piece. Then we look closely at the shape, the points of contact, and the right materials for the job. Those decisions give each piece its feel as much as its appearance.</p>
        <p>A chair should feel as natural during a long conversation as it does when you first see it across the room. That same balance guides the pieces we make for the dining table, the office, and anywhere you spend time.</p>
      </div>
    </div>
  </section>
}

function AboutValues() {
  return <>
    <section className="about-nature">
      <div className="page-width" data-page-reveal>
        <h2 className="section-title">The character of natural materials</h2>
        <p>Run a hand over a piece of wood and you can feel what makes it distinct. We choose boards for their strength as well as their grain, then shape and finish them in ways that keep those qualities visible. The natural variation gives each finished piece a character of its own.</p>
      </div>
      <div className="about-forest"><Photo file="about-forest.jpg" alt="Forest" /></div>
    </section>
    <section className="about-why">
      <div className="page-width about-why-inner">
        <div className="about-why-copy" data-page-reveal>
          <h2 className="section-title">The DCRAFTS Difference</h2>
          <ul>{reasons.map(([icon, title, description]) => <li key={title}>
            <span className="contact-icon"><Icon name={icon} /></span>
            <div><h3>{title}</h3><p>{description}</p></div>
          </li>)}</ul>
        </div>
        <Photo file="about-why.jpg" alt="High quality furnishings" />
      </div>
    </section>
    <section className="page-width about-statement" data-page-reveal>
      <h2>Furniture for the way rooms change as you live, work, gather, and settle into them</h2>
      <div>
        <p>Rooms change with the people who use them. A living room can be a quiet place to read one afternoon and a place to host friends that evening. We design furniture with enough flexibility to serve both purposes, with shapes and finishes that feel at ease beside the things you already own.</p>
        <p>We think about what a piece will look and feel like after years of use. That means working with materials that wear well and attending to the places that see the most contact. From the chair you reach for on a quiet morning to the desk you use all week, we want those details to keep making daily life more comfortable.</p>
      </div>
    </section>
  </>
}

function AboutImpact() {
  const [playing, setPlaying] = useState(false)
  return <section className="page-width about-impact">
    <header data-page-reveal><h2 className="section-title">The Details That Matter</h2><p>A look at the decisions behind each DCRAFTS piece.</p></header>
    <div className="about-impact-grid">
      <article className="impact-precision" data-page-reveal>
        <Photo className="impact-texture" file="about-precision.jpg" />
        <Photo className="impact-chair" file="about-impact-chair.png" alt="Wooden chair" />
        <div><h3>Shaped for Comfort</h3><p>Support refined through testing</p></div>
      </article>
      <article className="impact-homes" data-page-reveal>
        <Photo file="about-comfort.jpg" alt="Comfort chair" />
        <div><strong>16k<sup>+</sup></strong><p>Homes We’ve Furnished</p></div>
      </article>
      <article className="impact-award" data-page-reveal>
        <Photo file="about-award.jpg" />
        <div><Icon name="award" size={48} /><h3>Recognized Design</h3><p>Honored for work in sustainable design.</p></div>
      </article>
      <div className="impact-process" data-page-reveal>
        {playing
          ? <iframe title="See how it’s made" src="https://www.youtube.com/embed/6aioEoCdBJw?rel=0&playsinline=1&autoplay=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          : <button type="button" onClick={() => setPlaying(true)} aria-label="See how it’s made">
            <Photo file="about-process.jpg" /><span><Icon name="play" size={27} /><strong>See how it’s made</strong></span>
          </button>}
      </div>
    </div>
  </section>
}

function MakerRail() {
  const rail = useRef(null)
  function move(direction) {
    const track = rail.current
    const step = track.children[1].offsetLeft - track.children[0].offsetLeft
    const end = track.scrollWidth - track.clientWidth
    let left = track.scrollLeft + direction * step
    if (direction > 0 && track.scrollLeft >= end - 2) left = 0
    if (direction < 0 && track.scrollLeft <= 2) left = end
    track.scrollTo({ left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <section className="about-makers" aria-labelledby="about-makers-title">
    <h2 className="section-title page-width" id="about-makers-title" data-page-reveal>Inside the Workshop</h2>
    <div className="maker-rail" ref={rail} data-page-reveal>
      {makers.map(([key, name, role]) => <figure key={key}>
        <div><Photo file={`${key}.jpg`} alt="" /></div>
        <figcaption><h3>{name}</h3><p>{role}</p></figcaption>
      </figure>)}
    </div>
    <ArrowControls label="Makers" move={move} />
  </section>
}

export function AboutPage() {
  return <><AboutHero /><Philosophy /><AboutValues /><AboutImpact /><MakerRail /></>
}
