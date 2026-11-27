import { Arrow } from './Carousel.jsx'

export function Button({ to, children, className = '', plain = false, reveal = false, onClick }) {
  return <a href={to} className={`action ${plain ? 'action-plain' : ''} ${className}`} data-reveal={reveal || undefined} onClick={onClick}>
    <span>{children}</span>
    {!plain && <span className="action-icon"><Arrow /></span>}
  </a>
}

export function SectionHeading({ title, children, className = '' }) {
  return <div className={`section-heading ${className}`}>
    <h2 data-words>{title}</h2>
    {children && <p data-copy>{children}</p>}
  </div>
}

export function Image({ name, alt = '', className = '', eager = false, reveal = false }) {
  return <img src={`/media/${name}`} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'}
    fetchPriority={eager ? 'high' : 'auto'} decoding="async" data-reveal={reveal || undefined} />
}

export function PhotoCard({ title, summary, name, path, reveal }) {
  return <a className="photo-card" href={path} draggable="false" data-reveal={reveal}>
    <span className="photo-frame"><Image name={name} /></span>
    <h3>{title}</h3>
    {summary && <p aria-hidden={summary === title || undefined}>{summary}</p>}
  </a>
}
