import { Fragment } from 'react'

export function Donut({ kind, alt = '', className = '', eager = false }) {
  return <img className={className} src={`${import.meta.env.BASE_URL}media/${kind}.png`} alt={alt} draggable="false" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} />
}

export function Edge() {
  return <div className="scallops" aria-hidden="true" />
}

const badgeSeal = 'M75 3 86.11 11.97 99.63 7.34 107 19.57 121.28 19.84 124.03 33.86 137.35 39 135.14 53.11 145.91 62.5 139 75 145.91 87.5 135.14 96.89 137.35 111 124.03 116.14 121.28 130.16 107 130.43 99.63 142.66 86.11 138.03 75 147 63.89 138.03 50.37 142.66 43 130.43 28.72 130.16 25.97 116.14 12.65 111 14.86 96.89 4.09 87.5 11 75 4.09 62.5 14.86 53.11 12.65 39 25.97 33.86 28.72 19.84 43 19.57 50.37 7.34 63.89 11.97Z'
const promiseSeal = 'M120 2 140.3 18 165.2 11 177.8 33.5 203.4 36.6 206.5 62.2 229 74.8 222 99.7 238 120 222 140.3 229 165.2 206.5 177.8 203.4 203.4 177.8 206.5 165.2 229 140.3 222 120 238 99.7 222 74.8 229 62.2 206.5 36.6 203.4 33.5 177.8 11 165.2 18 140.3 2 120 18 99.7 11 74.8 33.5 62.2 36.6 36.6 62.2 33.5 74.8 11 99.7 18Z'

export function Seal({ badge = false }) {
  const size = badge ? 150 : 240
  return (
    <svg className="seal-spin" viewBox={`0 0 ${size} ${size}`} aria-hidden="true" stroke="var(--brown)" strokeLinejoin="round">
      <path d={badge ? badgeSeal : promiseSeal} fill={badge ? 'var(--orange)' : 'var(--cream)'} strokeWidth="2.5" />
      {badge && <circle cx="75" cy="75" r="53" fill="none" strokeWidth="1.5" strokeDasharray="3 5" strokeLinecap="round" opacity=".55" />}
    </svg>
  )
}

export function Sparkle({ className = '' }) {
  return <svg className={`sparkle ${className}`} viewBox="0 0 100 100" aria-hidden="true"><path fill="currentColor" d="M50 0C54 34 66 46 100 50 66 54 54 66 50 100 46 66 34 54 0 50 34 46 46 34 50 0Z" /></svg>
}

export function Display({ as: Tag = 'h2', children, className = '' }) {
  return (
    <Tag className={`display ${className}`} aria-label={children}>
      {children.split(' ').map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? ' ' : null}
          <span className="display-word" aria-hidden="true">
            {[...word].map((letter, i) => <span className="display-letter" key={i}>{letter}</span>)}
          </span>
        </Fragment>
      ))}
    </Tag>
  )
}

export function ArrowLink({ href, children }) {
  return <a className="arrow-link" href={href}>{children}<span aria-hidden="true">→</span></a>
}

export function ArrowButton({ children, ...props }) {
  return <button type="button" className="arrow-link" {...props}>{children}<span aria-hidden="true">→</span></button>
}

export function RouteHero({ title, label, text, art = [], children, className = '' }) {
  return (
    <section className={`route-hero ${className}`}>
      {art.map((kind, index) => <div key={kind} className={`route-orbit route-orbit-${index}`}><Donut kind={kind} eager /></div>)}
      {label && <div className="route-label"><span className="eyebrow">{label}</span></div>}
      <Display as="h1" className="route-title">{title}</Display>
      <p className="route-intro-copy">{text}</p>
      {children}
    </section>
  )
}

export function SectionTitle({ label, children, text }) {
  return (
    <div className="route-section-heading" data-heading>
      {label && <span className="eyebrow">{label}</span>}
      <Display>{children}</Display>
      {text && <p>{text}</p>}
    </div>
  )
}

export function RouteSection({ tone = 'cream', className = '', id, children }) {
  return <section className={`route-section section-field tone-${tone} ${className}`} id={id}><Edge />{children}</section>
}

export function Quantity({ amount, onLess, onMore, lessLabel, moreLabel, canRemove = true, canAdd = true }) {
  return <div className="quantity route-quantity">
    <button type="button" aria-label={lessLabel} onClick={onLess} disabled={!canRemove}>−</button>
    <span aria-live="polite">{amount}</span>
    <button type="button" aria-label={moreLabel} onClick={onMore} disabled={!canAdd}>+</button>
  </div>
}
