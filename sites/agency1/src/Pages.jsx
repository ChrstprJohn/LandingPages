import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Action, ContactBanner, Grain, Media, RollingLink, WordReveal } from './ui.jsx'
import { PostCards, ProjectPanels } from './Home.jsx'
import pages from './page-data.json'

const listPages = {
  '/work': {
    title: 'Selected Works',
    subtitle: 'A selection of work for brands with something to say, crafted to look sharp and read even sharper.',
    categories: ['All', 'Branding', 'Design', 'Content'],
    entries: pages.projects,
  },
  '/blog': {
    title: 'Studio Journal',
    subtitle: "What we're thinking about and learning along the way — a place for the conversations and ideas that shape how we build.",
    categories: ['All', 'Design', 'Branding', 'Development', 'Insights'],
    entries: pages.posts,
  },
}

function getRecord(path) {
  const [, type, slug] = path.split('/')
  const data = type === 'work' ? pages.projects : type === 'blog' ? pages.posts : []
  return data.find((item) => item.slug === slug)
}

export function routeTitle(path) {
  const clean = path.replace(/\/+$/, '')
  return listPages[clean]?.title || getRecord(clean)?.title || { '/about': 'About Aldena', '/contact': 'Get in Touch' }[clean]
}

function PageHeading({ title, subtitle, description, className = '' }) {
  return (
    <div className={'page-heading gutters ' + className}>
      <h1 className="letter-heading" aria-label={title}>{title.split(/(\s+)/).map((word, index) => (
        /^\s+$/.test(word) ? word : <span key={index} aria-hidden="true">{Array.from(word, (letter, position) => <span key={position} data-letter>{letter}</span>)}</span>
      ))}</h1>
      {description ? <div className="work-head-copy">
        <p data-reveal>{subtitle}</p>
        <p className="work-overview" data-reveal>{description}</p>
      </div> : subtitle && <p data-reveal>{subtitle}</p>}
    </div>
  )
}

function Catalog({ path }) {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const { title, subtitle, categories, entries } = listPages[path]
  const isWork = path === '/work'
  const query = search.trim().toLowerCase()
  const shown = entries.filter((item) => {
    return (category === 'All' || item.category === category)
      && (!query || (item.title + ' ' + item.summary).toLowerCase().includes(query))
  })
  useEffect(() => { ScrollTrigger.refresh() }, [category, search])

  return (
    <div className="catalog">
      <div className="catalog-head">
        <PageHeading title={title} subtitle={subtitle} className={isWork ? 'catalog-work-heading' : ''} />
        <div className="catalog-controls gutters" data-reveal>
          <label className="catalog-search">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
              <circle cx="6.6" cy="6.6" r="3.5" stroke="currentColor" /><path d="m9.2 9.2 3 3" stroke="currentColor" />
            </svg>
            <input type="search" placeholder="Search…" aria-label="Search" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label={'Filter ' + (isWork ? 'works' : 'articles')}>
            {categories.map((name) => <option key={name}>{name}</option>)}
          </select>
          <span role="status" className="catalog-count">({String(shown.length).padStart(2, '0')})</span>
        </div>
      </div>
      {shown.length ? (isWork ? <ProjectPanels entries={shown} /> : <div className="catalog-posts gutters"><PostCards entries={shown} /></div>)
        : <p className="catalog-empty gutters">No results found.</p>}
    </div>
  )
}

function ImageGrid({ images }) {
  return <div className="detail-gallery">{images.map((image) => (
    <div className="detail-image" key={image} data-reveal><Media name={image} /><Grain /></div>
  ))}</div>
}

function WorkDetail({ entry }) {
  const next = pages.projects[pages.projects.indexOf(entry) + 1]
  const challengeGallery = entry.gallery.slice(0, 2)
  const outcomeGallery = entry.gallery.slice(-2)
  return (
    <article className="work-detail">
      <div className="work-detail-hero">
        <PageHeading title={entry.title} subtitle={entry.summary} description={entry.overview} />
      </div>
      <div className="detail-content gutters">
        <div className="detail-image work-cover" data-cover-entry><Media name={entry.image} alt={entry.title + ' project thumbnail'} eager /><Grain /></div>
        <div className="project-info" data-reveal>
          <dl>
            <div><dt>Type</dt><dd>{entry.category}</dd></div>
            <div><dt>Year</dt><dd>{entry.year}</dd></div>
            <div><dt>Client</dt><dd>{entry.client}</dd></div>
            {entry.live && <div><dt>Website</dt><dd><RollingLink href={entry.live} target="_blank" rel="noreferrer">View Live Site</RollingLink></dd></div>}
          </dl>
        </div>
        <ImageGrid images={challengeGallery} />
        <div className="detail-editorial" data-reveal><span>The Challenge</span><div><h2>{entry.challenge}</h2>{entry.paragraphs.slice(0, 2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
        <ImageGrid images={outcomeGallery} />
        <div className="detail-editorial" data-reveal><span>The Outcome</span><div><h2>{entry.outcome}</h2>{entry.paragraphs.slice(2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
        {entry.gallery.length > 4 && <ImageGrid images={entry.gallery.slice(2, -2)} />}
      </div>
      {next && <div className="detail-next">
        <div className="detail-next-intro gutters">
          <div>
            <WordReveal as="h2" data-heading-reveal>Next Project.</WordReveal>
            <p data-reveal>Keep exploring—here’s another project from our studio, shaped by the same care and craft.</p>
          </div>
        </div>
        <ProjectPanels entries={[next]} />
      </div>}
    </article>
  )
}

function PostDetail({ entry }) {
  const related = entry.related.map((slug) => pages.posts.find((post) => post.slug === slug))
  return (
    <article className="post-detail">
      <div className="post-detail-top gutters">
        <div className="post-detail-heading">
          <h1>{entry.title}</h1><p data-reveal>{entry.summary}</p>
        </div>
      </div>
      <div className="post-article gutters">
        <aside className="post-byline">
          <div className="post-author" data-reveal>
            {entry.portrait && <Media name={entry.portrait} alt={'Portrait of ' + entry.author} />}
            <div><strong>{entry.author}</strong><span>{entry.role}</span></div>
          </div>
          <div className="post-byline-meta smallcaps" data-reveal><span>{entry.category}</span><span>{entry.date}</span></div>
        </aside>
        <div className="post-article-content">
          <div className="post-detail-cover detail-image" data-reveal><Media name={entry.image} alt={entry.title} eager /><Grain /></div>
          {entry.headings.map((title, index) => (
            <div key={title}>
              <div className="post-detail-copy" data-reveal><h2>{title}</h2>{entry.paragraphs.slice(index * 2, index * 2 + 2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              <ImageGrid images={entry.gallery.slice(index * 2, index * 2 + 2)} />
            </div>
          ))}
        </div>
      </div>
      <section className="post-more gutters">
        <WordReveal as="h2" className="section-title" data-heading-reveal>More to explore.</WordReveal>
        <p data-reveal>A few more articles worth your time, covering the ideas, process, and craft behind the work we do.</p>
        <PostCards entries={related} />
      </section>
      <ContactBanner />
    </article>
  )
}

function AboutPage() {
  const { images, content } = pages.about
  const values = ['Built to Last', 'One Voice', 'Clarity First', 'True Partners']
  const team = [
    ['Aldena Rhodes', 'Founder & Creative Director', images[7]], ['Elena Rossi', 'Founder & Creative Director', images[8]],
    ['Theo Vasquez', 'Motion & Interaction Designer', images[9]], ['Priya Nandakumar', 'Brand Strategist', images[10]],
  ]
  return (
    <>
      <section className="about-hero">
        <div className="page-hero-picture"><Media name={images[0]} alt="Aldena studio photograph" eager /></div>
        <Grain strength="grain--hero" />
        <PageHeading title="About Aldena" subtitle={content[0]} />
        <div className="about-trust" data-reveal>
          <div>{images.slice(1, 6).map((name) => <Media name={name} key={name} />)}</div>
          <span><span aria-hidden="true">★★★★★</span><br />TRUSTED BY 50+ CLIENTS</span>
        </div>
      </section>
      <section className="about-details gutters">
        <div className="about-editorial">
          <span className="smallcaps" data-reveal>The Studio</span>
          <div>
            <WordReveal as="p" className="about-statement" data-reading-reveal data-reveal>{content[1]}</WordReveal>
            <div className="about-intro-copy" data-reveal>{content.slice(2, 4).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </div>
        </div>
        <div className="about-image detail-image parallax-image" data-reveal="photo"><Media name={images[6]} alt="Aldena studio interior" /><Grain /></div>
        <div className="about-editorial">
          <span className="smallcaps" data-reveal>Our Values</span>
          <div className="about-values">
            {values.map((value, i) => (
              <div key={value} data-reveal>
                <span className="value-markers" aria-hidden="true">
                  {values.map((dot, index) => <span key={dot} data-lit={index <= i} />)}
                </span>
                <h3>{value}</h3>
                <p>{content[i + 4]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="team-section gutters">
        <div className="team-heading">
          <WordReveal as="h2" className="section-title" data-heading-reveal>The team behind Aldena.</WordReveal>
          <p data-reveal>{content[8]}</p>
        </div>
          <div className="team-grid">
            {team.map(([name, role, image], i) => (
              <article key={name} data-reveal>
                <p className="team-bio">{content[i + 9]}</p>
                <div className="detail-image team-portrait parallax-image"><Media name={image} alt={name} /></div>
                <div className="team-identity">
                  <h3>{name}</h3><span className="smallcaps">{role}</span>
                  <div className="team-social">
                    <a aria-label={name + ' on LinkedIn'} href="https://www.linkedin.com/" target="_blank" rel="noreferrer">in</a>
                    <a aria-label={name + ' on Facebook'} href="https://www.facebook.com/" target="_blank" rel="noreferrer">f</a>
                    <a aria-label={name + ' on X'} href="https://x.com/" target="_blank" rel="noreferrer">𝕏</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
      </section>
      <section className="about-stats-section">
        <div className="about-awards" aria-label="Awards and recognition" data-reveal>
          <div className="about-awards-track">
            {[0, 1, 2].map((copy) => <div className="about-awards-group" key={copy} aria-hidden={copy > 0 ? true : undefined}>
              {images.slice(-7).map((image) => <div className="about-award" key={image}><Media name={image} /></div>)}
            </div>)}
          </div>
        </div>
        <div className="about-stats gutters">
          {[
            ['+', 'Projects Completed', 'From full rebrands to focused identity work.'],
            ['+', 'Brands launched', "From first sketch to client's public debut."],
            ['', 'Industry Awards', 'Design and craft, recognized internationally.'],
            ['%', 'Client retention', 'Most of our clients return for the next chapter.'],
          ].map(([suffix, label, text]) => <div key={label}><strong aria-label={'3,100' + suffix}><span data-metric aria-hidden="true">3,100{suffix}</span></strong><h3>{label}</h3><p>{text}</p></div>)}
        </div>
      </section>
      <ContactBanner />
    </>
  )
}

function ContactPage() {
  const [draft, setDraft] = useState('')
  const prepareDraft = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const body = 'Name: ' + data.get('name') + '\nEmail: ' + data.get('email')
      + '\nPhone: ' + data.get('phone') + '\n\n' + data.get('message')
    const subject = data.get('projectType') || 'Aldena project inquiry'
    setDraft('mailto:hello@aldena.studio?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body))
  }
  return (
    <article className="contact-page">
      <section className="contact-hero">
        <div className="page-hero-picture"><Media name={pages.contact.images[0]} alt="" eager /></div>
        <Grain strength="grain--hero" />
        <PageHeading title="Get in Touch" subtitle="Have a project in mind? Tell us about it and we will be in touch within 24 hours." />
      </section>
      <div className="contact-form-wrap gutters">
        <div className="contact-details" data-reveal>
          <RollingLink href="mailto:hello@aldena.studio">hello@aldena.studio</RollingLink>
          <RollingLink href="tel:2125550198">+1 (212) 555-0198</RollingLink>
          <RollingLink href="https://www.linkedin.com/company/lunisdesign/" target="_blank" rel="noreferrer">Find us on LinkedIn</RollingLink>
        </div>
        <form className="contact-form" data-reveal onSubmit={prepareDraft} onChange={() => { if (draft) setDraft('') }}>
          <label className="form-wide">Name<input name="name" placeholder="Jane Doe" autoComplete="name" required /></label>
          <label>Email<input name="email" placeholder="jane@company.com" autoComplete="email" type="email" required /></label>
          <label>Phone (optional)<input name="phone" placeholder="+1 (555) 000-0000" autoComplete="tel" type="tel" /></label>
          <label className="form-wide">Project Type<select name="projectType" defaultValue=""><option value="">Select a project type</option><option>Brand Identity</option><option>Web Design</option><option>Product Design</option><option>Other</option></select></label>
          <label className="form-wide">Message<textarea name="message" placeholder="Tell us about your project..." rows="5" required /></label>
          <button type="submit">Submit</button>
          {draft && <p className="form-status" role="status"><a href={draft}>Open your email draft</a> to send your message.</p>}
        </form>
      </div>
      <div className="contact-photo-grid gutters">
        {pages.contact.images.slice(1, 3).map((image, i) => (
          <figure key={image} className="detail-image parallax-image" data-reveal><Media name={image} alt={i === 0 ? 'The Aldena team' : 'The Aldena office'} /><figcaption>{i === 0 ? 'The Team.' : 'The Office.'}</figcaption></figure>
        ))}
      </div>
    </article>
  )
}

export default function Pages({ path }) {
  if (listPages[path]) return <Catalog path={path} />
  if (path === '/about') return <AboutPage />
  if (path === '/contact') return <ContactPage />
  const entry = getRecord(path)
  if (entry && path.startsWith('/work/')) return <WorkDetail entry={entry} />
  if (entry && path.startsWith('/blog/')) return <PostDetail entry={entry} />
  return <div className="not-found gutters"><h1>Page not found.</h1><Action href="/" light>BACK TO HOME</Action></div>
}
