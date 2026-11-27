import { useRef, useState } from 'react'
import { Arrow } from './Carousel.jsx'
import { contactDetails, services } from './content.js'
import { useBlogCardMotion } from './motion.js'
import pages from './pages.json'
import { Button, Image, PhotoCard, SectionHeading } from './ui.jsx'
import './pages.css'

export function pageTitle(path) {
  if (path === '/') return 'Dconstruct — Custom Homes & Design-Build'
  return pages[path]?.documentTitle ?? 'Page Not Found — Dconstruct'
}

function PageHero({ page, variant = 'catalog', smallCopy = false }) {
  const { title, summary, image } = page
  return <section className={`route-hero route-hero-${variant}`} data-page-entrance data-small-copy={smallCopy || undefined}>
    {image && variant === 'photo' && <Image name={image} className="cover" eager />}
    <div className="shell route-hero-inner">
      <div className="route-title">
        <h1 data-page-title>{title}</h1>
      </div>
      {summary && <div className="route-subtitle"><p data-page-summary>{summary}</p></div>}
    </div>
  </section>
}

function ContentShell({ children, className = '' }) {
  return <div className="grid-background"><div className={`shell ${className}`}>{children}</div></div>
}

function RouteCTA({ content, contact = false, team = false }) {
  if (!content) return null
  return <section className={`route-cta${team ? ' route-cta-team' : ''}`}>
    <Image name={content.image} className="cover" />
    <div className="route-cta-inner">
      <div><h2 data-words>{content.title}</h2><p data-copy>{content.text}</p></div>
      <Button to={contact ? '#contact-form' : '/contact'} reveal="cta">Book a Consultation</Button>
    </div>
  </section>
}

function Directory({ directory, more = false }) {
  return <section className={`route-section route-directory${more ? ' route-directory-about' : ''}`}>
    <SectionHeading title={directory.title} className={more ? '' : 'centered'}>{directory.summary || null}</SectionHeading>
    <div className="directory-grid">
      {directory.members.map(person => <article className="team-card" key={person.name} data-reveal="team">
        <div className="portrait"><Image name={person.image} alt={person.name} />{person.tag && <span>{person.tag}</span>}</div>
        <h3>{person.name}</h3>
        <p>{person.role}</p>
      </article>)}
      {more && <div className="team-link" data-reveal>
        <p>Meet the designers and builders at Dconstruct</p>
        <Button to="/our-team">Meet The Team</Button>
      </div>}
    </div>
  </section>
}

function AboutPage({ page }) {
  const { intro, principles, story, team, cta } = page
  return <>
    <PageHero page={page} variant="photo" />
    <ContentShell>
      <section className="route-section about-overview">
        <h2 data-words>{intro.title}</h2>
        <div className="about-overview-content">
          <Image name={intro.image} alt="Home construction in progress" reveal="process" />
          <div>
            <ul className="team-tags flex flex-wrap">{services.map(([name]) => <li key={name} data-reveal="team">{name}</li>)}</ul>
            <p data-copy>{intro.summary}</p>
            <Button to="/contact" reveal>Contact Us</Button>
          </div>
        </div>
      </section>
      <section className="route-section principles">
        <SectionHeading title={principles.title} className="centered" />
        <div className="principles-grid">
          {principles.points.map(([title, copy], index) => <article key={title} data-reveal="team">
            <span className="item-number" aria-hidden="true">0{index + 1}.</span><h3>{title}</h3><p>{copy}</p>
          </article>)}
        </div>
      </section>
      <section className="route-story">
        <Image name={story.image} alt="Builders working on a custom home" reveal="process" />
        <SectionHeading title={story.title}>{story.summary}</SectionHeading>
      </section>
      <Directory directory={team} more />
      <RouteCTA content={cta} />
    </ContentShell>
  </>
}

function Catalog({ page, type }) {
  return <>
    <PageHero page={page} smallCopy />
    <ContentShell>
      <section className="route-section catalog">
        <SectionHeading title={page.sectionTitle} className="centered" />
        <div className="project-grid">
          {page.entries.map(path => {
            const entry = pages[path]
            const summary = type === 'projects' ? entry.label : entry.title
            return <PhotoCard key={path} path={path} title={entry.title} summary={summary} name={entry.image} reveal="project" />
          })}
        </div>
      </section>
      <RouteCTA content={page.cta} />
    </ContentShell>
  </>
}

function RichContent({ blocks }) {
  return <div className="route-prose">
    {blocks.map(([kind, value], index) => {
      if (kind === 'ul' || kind === 'ol') {
        const List = kind
        return <List key={index}>{value.map(item => <li key={item}>{item}</li>)}</List>
      }
      const Tag = kind === 'h3' || kind === 'h4' ? 'h2' : kind
      return <Tag key={index}>{value}</Tag>
    })}
  </div>
}

function DetailPager({ paths, parent, parentText }) {
  return <nav className="detail-pager" aria-label={parentText}>
    <a href={parent}><Arrow direction="left" />{parentText}</a>
    {paths.map(path => <a href={path} key={path}>{pages[path].title}<Arrow direction="right" /></a>)}
  </nav>
}

function BuildDetail({ page, type }) {
  return <ContentShell className="detail-shell">
    <article className="build-detail">
      <div className="build-detail-head centered" data-page-entrance>
        <h1 data-page-title>{page.title}</h1>
        {page.location && <p className="build-location">{page.location}</p>}
        <p data-page-summary>{page.summary}</p>
      </div>
      <Image name={page.image} alt={page.title} className="detail-hero-image" reveal eager />
      <RichContent blocks={page.body} />
      {Boolean(page.gallery?.length) && <div className="detail-gallery">
        {page.gallery.map((image, i) => <figure key={image} data-reveal><Image name={image} alt={`${page.title}, view ${i + 1}`} /></figure>)}
      </div>}
      {Boolean(page.related?.length) && <section className="related-builds">
        <h2 data-words>Related projects</h2>
        <div className="related-build-grid">
          {page.related.map(path => <PhotoCard key={path} path={path} name={pages[path].image} title={pages[path].title} summary={pages[path].label} />)}
        </div>
      </section>}
      <DetailPager paths={page.pager} parent={`/${type}`} parentText={type === 'services' ? 'All services' : 'All projects'} />
    </article>
  </ContentShell>
}

function Byline({ post, date = false }) {
  return <div className="byline">
    {post.avatar && <Image name={post.avatar} />}
    <span>{post.author}</span>
    {date && <><span aria-hidden="true">•</span><span>{post.date}</span></>}
  </div>
}

function BlogCard({ path, feature = false }) {
  const post = pages[path]
  return <article className={`route-blog-card ${feature ? 'route-blog-feature' : ''}`}>
    <a href={path} className="route-blog-image" aria-label={post.title}>
      <Image name={post.image} />{!feature && <span className="category">{post.category}</span>}
    </a>
    <div className="route-blog-card-content">
      {feature ? <span className="category">{post.category}</span> : <Byline post={post} date />}
      <div>
        {feature ? <h2><a href={path}>{post.title}</a></h2> : <h3><a href={path}>{post.title}</a></h3>}
        <p><a href={path}>{post.summary}</a></p>
      </div>
      {feature && <div className="featured-post-meta"><Byline post={post} date /><a className="read-more" href={path}>Read More<Arrow /></a></div>}
    </div>
  </article>
}

function BlogIndex({ page, tag }) {
  const [category, setCategory] = useState('All')
  const grid = useRef(null)
  useBlogCardMotion(grid, category)
  const visible = category === 'All' ? page.entries : page.entries.filter(path => pages[path].category === category)
  return <>
    <PageHero page={page} />
    <ContentShell>
      <section className="route-section route-blog-index">
        {tag ? <Button to="/blogs" plain>All Posts</Button> : <>
          <SectionHeading title={page.sectionTitle} className="centered" />
          <div className="featured-post" data-reveal="article"><BlogCard path={page.entries[0]} feature /></div>
          <div className="blog-filters">
            <h2>Category</h2>
            <div aria-label="Article categories" role="group">
              {page.filters.map(filter => <button key={filter} type="button" aria-pressed={category === filter} onClick={() => setCategory(filter)}>{filter}</button>)}
            </div>
          </div>
        </>}
        <div className="route-blog-grid" ref={grid}>
          {visible.map(path => <BlogCard path={path} key={path} />)}
        </div>
      </section>
      <RouteCTA content={page.cta} />
    </ContentShell>
  </>
}

function BlogArticle({ page }) {
  return <>
    <PageHero page={page} variant="article" />
    <ContentShell>
      <div className="post-layout">
        <article>
          <Image name={page.image} className="post-cover" alt={page.title} eager />
          <RichContent blocks={page.body} />
        </article>
        <aside className="article-meta">
          <p>Author</p>
          <Byline post={page} />
          {page.authorRole && <p className="author-role">{page.authorRole}</p>}
          <dl><div><dt>Category</dt><dd>{page.category}</dd></div>
            <div><dt>Read Time</dt><dd>{page.readTime} mins</dd></div></dl>
          {Boolean(page.tags.length) && <div className="post-tags">
            <p>Tags</p>
            {page.tags.map(([tag, path]) => <a href={path} key={path}>{tag}</a>)}
          </div>}
        </aside>
      </div>
      <div className="post-pager">
        {page.pager.map(path => <BlogCard key={path} path={path} />)}
      </div>
      <div className="post-index-link"><Button to="/blogs">View All Blogs</Button></div>
    </ContentShell>
  </>
}

function ContactPage({ page }) {
  const [draft, setDraft] = useState('')
  function prepareDraft(event) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const subject = values.get('Subject') || 'Dconstruct consultation'
    const body = `${values.get('Message')}\n\n${values.get('Name')}\n${values.get('Email')}`
    setDraft(`mailto:${contactDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  return <>
    <PageHero page={page} />
    <ContentShell>
      <section className="route-section contact-layout">
        <form className="inquiry-form" id="contact-form" onSubmit={prepareDraft} onChange={() => { if (draft) setDraft('') }}>
          <div className="inquiry-heading">
            <h2 data-words>{page.formTitle}</h2>
            <p data-copy>{page.formIntro}</p>
          </div>
          {page.fields.map(([tag, name, type, placeholder, required]) => <label key={name}>{name}
            {tag === 'textarea' ? <textarea name={name} required={required} placeholder={placeholder} rows={4} />
              : <input name={name} type={type || 'text'} required={required} placeholder={placeholder} autoComplete={name === 'Name' ? 'name' : name === 'Email' ? 'email' : undefined} />}
          </label>)}
          <button type="submit" className="action action-plain">Submit</button>
          {draft && <p role="status">Your draft is ready. <a href={draft}>Open it in your email app</a>.</p>}
        </form>
        <div className="contact-info">
          <div className="contact-directory" data-reveal>
            <div><p>Email</p><a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></div>
            <div><p>Phone</p><a href={contactDetails.phoneHref}>{contactDetails.phone}</a></div>
            <div><p>Address</p><address>{contactDetails.address}</address></div>
          </div>
          {page.map && <div className="contact-map">
            <iframe src={page.map} title="Map of the Dconstruct studio in Austin" loading="lazy" />
            <a href="https://www.google.com/maps/search/?api=1&query=120%20Maker%20Street%2C%20Austin%2C%20TX%2078701" target="_blank" rel="noreferrer">Open in Maps <Arrow /></a>
          </div>}
        </div>
      </section>
      <RouteCTA content={page.cta} contact />
    </ContentShell>
  </>
}

export default function RoutedPages({ path }) {
  const page = pages[path]
  if (!page) return <ContentShell className="missing-page"><h1>Page not found</h1><Button to="/">Back to home</Button></ContentShell>
  if (path === '/about') return <AboutPage page={page} />
  if (path === '/services' || path === '/projects') return <Catalog page={page} type={path.slice(1)} />
  if (path === '/our-team') return <>
    <PageHero page={page} />
    <ContentShell><Directory directory={page.team} /><RouteCTA content={page.cta} team /></ContentShell>
  </>
  if (path === '/contact') return <ContactPage page={page} />
  if (path === '/privacy-policy') return <ContentShell className="privacy-shell">
    <div data-page-entrance><h1 data-page-title>{page.title}</h1><p>Last Updated: July 2026</p></div>
    <RichContent blocks={page.body} />
  </ContentShell>
  if (path === '/blogs' || path.startsWith('/blogs/tags/')) return <BlogIndex page={page} tag={path !== '/blogs'} />
  if (path.startsWith('/blogs/')) return <BlogArticle page={page} />
  return <BuildDetail page={page} type={path.split('/')[1]} />
}
