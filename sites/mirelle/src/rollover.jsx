export function Rollover({ children }) {
  return (
    <span className="nav-word" aria-hidden="true">
      {[...children].map((letter, index) => (
        <span className="nav-letter" key={index}>
          <span style={{ '--letter-index': index }}>{letter === ' ' ? '\u00a0' : letter}</span>
        </span>
      ))}
    </span>
  )
}
