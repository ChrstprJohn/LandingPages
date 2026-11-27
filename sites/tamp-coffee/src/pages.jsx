import { useEffect, useState } from 'react'
import { EmailCopy, Link, MenuCard, SectionHeading } from './components'
import { catalogue, email, locations, menuItems, photo } from './data'
import { itemDetails } from './item-details'
import { beanBags, milestones, policies, purchaseTips, storageTips, story, team } from './page-content'

function PageHeading({ title, children }) {
  return <div className="page-heading"><SectionHeading title={title} as="h1">{children}</SectionHeading></div>
}

function PhotoFrame({ image, alt = '', className = '', eager = false }) {
  return (
    <div className={`photo-frame ${className}`}>
      <img src={photo(image)} alt={alt} loading={eager ? 'eager' : 'lazy'} />
    </div>
  )
}

function CardGrid({ items }) {
  return <div className="menu-grid grid">{items.map(item => <MenuCard key={item.slug} item={item} />)}</div>
}

const filters = [['all', 'All'], ...catalogue.map(([key, title]) => [key, title]), ['beans', 'Beans']]

function readCatalogueFilter() {
  const filter = new URLSearchParams(location.search).get('category')
  return filters.some(([key]) => key === filter) ? filter : 'all'
}

function MenuPage() {
  const [filter, setFilter] = useState(readCatalogueFilter)

  useEffect(() => {
    const onHistory = () => setFilter(readCatalogueFilter())
    window.addEventListener('popstate', onHistory)
    return () => window.removeEventListener('popstate', onHistory)
  }, [])

  function choose(key) {
    if (key === filter) return
    const url = new URL(location.href)
    if (key === 'all') url.searchParams.delete('category')
    else url.searchParams.set('category', key)
    history.replaceState(history.state, '', url)
    setFilter(key)
  }

  const groups = filter === 'all' ? catalogue : catalogue.filter(([key]) => key === filter)
  return (
    <>
      <section className="section catalogue-header">
        <div className="shell">
          <PageHeading title="The menu">Everything we make, all day at all three cafés. Oat and almond milk at no extra charge.</PageHeading>
          <div className="filters flex" role="group" aria-label="Menu categories">
            {filters.map(([key, title]) => <button className="pill" type="button" aria-pressed={key === filter} onClick={() => choose(key)} key={key}>{title}</button>)}
          </div>
        </div>
      </section>
      <div>
        {groups.length > 0 && <div className="shell catalogue-results">
          {groups.map(([key, title, items]) => (
            <section className="catalogue-group" key={key} aria-labelledby={`category-${key}`}>
              <h2 id={`category-${key}`}>{title}</h2>
              <CardGrid items={items} />
            </section>
          ))}
        </div>}
        {(filter === 'all' || filter === 'beans') && <section className="section route-panel">
          <div className="shell">
            <SectionHeading title="Beans to take home">Roasted Tuesday and Friday in Logan Square. Whole bean or ground to order for your brewer, free.</SectionHeading>
            <div className="section-action"><Link to="/beans" button="solid">Prices, grinds and how to buy</Link></div>
            <BeanCards summary />
          </div>
        </section>}
      </div>
    </>
  )
}

const suggestedItems = ['iced-oat-latte', 'flat-white', 'iced-matcha-latte', 'cold-brew']
  .map(slug => menuItems.find(item => item.slug === slug))

export function ItemPage({ item }) {
  const [description, milk, caffeine, large] = itemDetails[item.slug]
  const facts = [['Milk', milk], ['Caffeine', caffeine && `${caffeine} mg`], ['Large size', large]].filter(([, value]) => value)
  const related = suggestedItems.filter(candidate => candidate.slug !== item.slug).slice(0, 3)
  return (
    <>
      <section className="section detail-page">
        <div className="shell">
          <Link className="detail-back" to="/menu" button="outline"><span aria-hidden="true">←</span> All drinks</Link>
          <div className="detail-grid grid">
            <PhotoFrame className="detail-photo" image={item.slug} eager />
            <div className="detail-info">
              <PageHeading title={item.name}>{description}</PageHeading>
              {facts.length > 0 && <dl className="detail-facts grid">
                {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>}
              <div className="detail-price flex items-center"><strong>{item.price}</strong><Link to="/locations" button="solid">Find a café</Link></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section route-panel">
        <div className="shell"><SectionHeading title="Goes well with" /><CardGrid items={related} /></div>
      </section>
    </>
  )
}

function RoastLevel({ level }) {
  return (
    <div className="roast-level" role="img" aria-label={level === 2 ? 'Light roast' : 'Medium roast'}>
      <div className="flex justify-between" aria-hidden="true"><span>Light</span><span>Medium</span><span>Dark</span></div>
      <div className="roast-meter bean-roast-meter grid" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => <i key={index} data-filled={index < level || undefined} />)}
      </div>
    </div>
  )
}

function BeanCards({ summary = false }) {
  return <div className="route-card-grid grid">
    {beanBags.map(bag => (
      <article className="bag-card" key={bag.name}>
        <PhotoFrame image={bag.photo} alt={`${bag.name} coffee bag`} />
        {summary ? <div className="menu-card-copy">
          <div className="menu-card-title flex justify-between"><h3>{bag.name}</h3><span>{bag.sizes[0][1]} · {bag.sizes[0][0]}</span></div>
          <p>{bag.summary}</p>
        </div> : <div className="bag-copy">
          <h2>{bag.name}</h2><p className="route-muted">{bag.origin}</p>
          <p className="bag-notes">{bag.notes}</p>
          <RoastLevel level={bag.level} />
          <p><strong>Best for: </strong>{bag.for}</p>
          <dl className="bag-sizes flex">
            {bag.sizes.map(([size, price]) => <div key={size}><dt>{size}</dt><dd>{price}</dd></div>)}
          </dl>
        </div>}
      </article>
    ))}
  </div>
}

function BeanTips({ title, intro, cards, children }) {
  return <section className={`section ${children ? 'route-panel' : ''}`}>
    <div className="shell">
      <SectionHeading title={title}>{intro}</SectionHeading>
      <div className="route-card-grid tip-grid grid">
        {cards.map(([image, title, text, stat]) => <article className="tip-card" key={image}>
          <PhotoFrame image={image} />
          <div className="tip-copy">
            {stat && <strong className="tip-stat">{stat}</strong>}
            <h3>{title}</h3><p>{text}</p>
          </div>
        </article>)}
      </div>
      {children}
    </div>
  </section>
}

function BeansPage() {
  return (
    <>
      <section className="section">
        <div className="shell">
          <PageHeading title="Coffee beans to take home">
            Our house blend and two single origins, roasted every Tuesday and Friday in Logan Square. Buy a bag at any of our three cafés and we’ll grind it for your brewer, free.
          </PageHeading>
          <BeanCards />
        </div>
      </section>
      <BeanTips title="How to buy a bag" intro="We sell beans in our cafés, so every bag is fresh and ground the way you need it." cards={purchaseTips}>
        <div className="route-actions flex">
          <Link to="/locations" button="solid">Find a café</Link>
          <Link to="/contact" button="outline">Wholesale and offices</Link>
        </div>
      </BeanTips>
      <BeanTips title="Keep it fresh at home" intro="Three things that make the biggest difference in the cup." cards={storageTips} />
    </>
  )
}

function Telephone({ number = '0187' }) {
  return <a href={`tel:+1312555${number}`}>(312) 555-{number}</a>
}

function LocationsPage() {
  return (
    <section className="section">
      <div className="shell">
        <PageHeading title="Three cafés in Chicago">Each one pours the same house roast. Come in for a seat, or grab a cup on your way to work.</PageHeading>
        <div className="location-rows grid">
          {locations.map(([image, name, address, , phone, hours, amenities]) => {
            const query = encodeURIComponent(address)
            return <article className="location-row grid" key={image} id={image}>
              <div className="location-info">
                <h2>{name}</h2><address>{address}</address>
                <dl className="location-hours">
                  {hours.map(([day, time]) => <div className="flex justify-between" key={day}><dt>{day}</dt><dd>{time}</dd></div>)}
                </dl>
                <p>{amenities}</p><Telephone number={phone} />
                <Link to={`https://maps.google.com/?q=${query}`} button="outline" target="_blank" rel="noreferrer">Get directions</Link>
              </div>
              <PhotoFrame className="location-page-photo" image={image} />
              <iframe className="location-map" title={`Map of Decõ ${name}`} loading="lazy" src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`} />
            </article>
          })}
        </div>
      </div>
    </section>
  )
}

function AboutPage() {
  return (
    <>
      <section className="section">
        <div className="shell">
          <PageHeading title="A neighborhood coffee house, three times over">
            Nora and Theo opened Decõ on Milwaukee Avenue in 2019 with one espresso machine and a used roaster.
          </PageHeading>
          <div className="about-story grid">
            <PhotoFrame image="roastery" alt="A coffee roasting machine" />
            <div className="story-copy">
              <h2>How it started</h2>
              {story.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              <p className="story-signature">Nora &amp; Theo</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section route-panel">
        <div className="shell">
          <SectionHeading title="Six years, three cafés">One café a year or two, never faster than we could keep the coffee right.</SectionHeading>
          <ol className="timeline-list">
            {milestones.map(([image, name, year, title, text], index) => <li className="timeline-card grid" key={year} style={{ '--stack-index': index }}>
              <PhotoFrame image={image} />
              <div className="timeline-copy">
                <div>
                  <p className="timeline-location">{name}</p>
                  <time dateTime={year}>{year}</time>
                </div>
                <div className="timeline-bottom"><h3>{title}</h3><p>{text}</p></div>
              </div>
            </li>)}
          </ol>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <SectionHeading title="The people behind the bar">Forty baristas across three cafés, led by these three.</SectionHeading>
          <div className="route-card-grid grid">
            {team.map(([image, name, role]) => <article className="team-card" key={image}>
              <PhotoFrame image={image} /><div className="team-copy"><h3>{name}</h3><p>{role}</p></div>
            </article>)}
          </div>
        </div>
      </section>
    </>
  )
}

function ContactPage() {
  const [draft, setDraft] = useState('')

  function prepareMessage(event) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const subject = encodeURIComponent(`Decõ Coffee · ${values.get('topic')}`)
    const body = encodeURIComponent(`${values.get('message')}\n\n${values.get('name')}\nReply to: ${values.get('email')}`)
    setDraft(`mailto:${email}?subject=${subject}&body=${body}`)
  }

  return (
    <section className="section">
      <div className="shell">
        <PageHeading title="Say hello">Catering, wholesale or just a question. We reply within two working days.</PageHeading>
        <div className="contact-grid grid">
          <form className="contact-form" aria-label="Contact form" onSubmit={prepareMessage} onChange={() => setDraft('')} data-route-reveal>
            <div className="contact-inputs grid">
              <label>Name <span aria-hidden="true">*</span><input name="name" placeholder="Your name" autoComplete="name" required maxLength={100} /></label>
              <label>Email <span aria-hidden="true">*</span><input name="email" type="email" placeholder="you@example.com" autoComplete="email" required maxLength={254} /></label>
            </div>
            <label>Topic<select name="topic">{['Catering', 'Wholesale', 'Coffee beans', 'Something else'].map(topic => <option key={topic}>{topic}</option>)}</select></label>
            <label>Message <span aria-hidden="true">*</span><textarea name="message" placeholder="Tell us the date, the café and how many people" required rows={5} maxLength={1500} /></label>
            <div className="contact-submit">
              <button type="submit" className="pill pill-solid">Prepare email</button>
              <p role="status">{draft ? 'Your draft is ready.' : 'Opens a draft in your email app.'}</p>
              {draft && <Link to={draft} button="outline">Open email draft</Link>}
            </div>
          </form>
          <div className="contact-side grid">
            <article className="route-tile" data-route-reveal><h2>Write or call</h2><EmailCopy /><Telephone /></article>
            <article className="route-tile" data-route-reveal>
              <h2>At the café?</h2>
              <p>Something not right with your drink? Tell the barista or call the café. They will fix it on the spot.</p>
              <ul className="contact-phones">{locations.map(([slug, name, , , phone]) => <li className="flex justify-between" key={slug}><span>{name}</span><Telephone number={phone} /></li>)}</ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

function PolicyPage({ kind }) {
  const policy = policies[kind]
  return (
    <section className="section legal-page">
      <div className="shell">
        <nav className="policy-nav flex" aria-label="Legal">
          {[['terms', 'Terms'], ['privacy', 'Privacy']].map(([slug, name]) => <Link key={slug} to={`/${slug}`} button="outline" aria-current={kind === slug ? 'page' : undefined}>{name}</Link>)}
        </nav>
        <PageHeading title={policy.title}>Last updated <time dateTime="2026-10-25">October 25, 2026</time></PageHeading>
        <div className="legal-grid grid">
          <nav className="legal-toc" aria-label="On this page">
            <p>On this page</p>
            <ul>{policy.sections.map(([id, title]) => <li key={id}><Link to={`#${id}`}>{title}</Link></li>)}</ul>
          </nav>
          <div className="legal-body">
            <article className="route-tile"><h2>In short</h2><ul>{policy.summary.map(item => <li key={item}>{item}</li>)}</ul></article>
            {policy.sections.map(([id, heading, copy], index) => <section id={id} key={id}><h2>{index + 1}. {heading}</h2><p>{copy}</p></section>)}
            <article className="route-tile"><h2>{policy.questions}</h2><p>Email us and a real person will reply within two working days.</p><EmailCopy /></article>
          </div>
        </div>
      </div>
    </section>
  )
}

export function NotFoundPage() {
  return <section className="section"><div className="shell">
    <PageHeading title="Page not found">This page may have moved.</PageHeading>
    <div className="section-action"><Link to="/" button="solid">Back to Decõ</Link></div>
  </div></section>
}

export const pages = {
  '/menu': { title: 'Menu', Component: MenuPage },
  '/beans': { title: 'Coffee beans', Component: BeansPage },
  '/locations': { title: 'Locations', Component: LocationsPage },
  '/about': { title: 'About', Component: AboutPage },
  '/contact': { title: 'Contact', Component: ContactPage },
  '/terms': { title: policies.terms.title, Component: () => <PolicyPage kind="terms" /> },
  '/privacy': { title: policies.privacy.title, Component: () => <PolicyPage kind="privacy" /> },
}
