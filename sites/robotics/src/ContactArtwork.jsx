import { useId } from 'react'

const board = 'M25 0H295L320 25V295L295 320H25L0 295V25Z'
const lettering = 'M0 0H20L32 11V38L20 49H0ZM77 0H55L44 11V38L55 49H77M90 0H110L122 11V38L110 49H90Z'

export function ContactArtwork({ className }) {
  const id = useId()
  const pads = [28, 61, 94, 127, 160, 193, 226, 259, 292]

  return (
    <svg className={className} viewBox="0 0 570 336" fill="none" aria-hidden="true">
      <defs>
        <path id={`${id}-board`} d={board} />
        <path id={`${id}-lettering`} d={lettering} />
      </defs>
      <g transform="translate(0 10)" fill="#e9ebed" stroke="#666c74">
        <use href={`#${id}-board`} transform="matrix(.866 .5 -.866 .5 285 1)" />
      </g>
      <g transform="matrix(.866 .5 -.866 .5 285 1)" stroke="#666c74">
        <use href={`#${id}-board`} fill="#fff" />
        <path d="M16 38L38 16H282L304 38V282L282 304H38L16 282Z" />
        <rect x="61" y="61" width="198" height="198" rx="20" fill="#f5f6f7" />
        <rect x="71" y="71" width="178" height="178" rx="16" fill="#fff" />
        {pads.map((position) => (
          <g key={position}>
            <path d={`M${position} 18v20m0 244v20M18 ${position}h20m244 0h20`} />
            <path d={`M${position} 39l12 12m${-position + 280} 0l12 -12M39 ${position}l12 12m0 ${-position + 280}l-12 12`} opacity=".45" />
          </g>
        ))}
        {[44, 276].flatMap((x) => [44, 276].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="6" />))}
        <g transform="translate(105 137) scale(.9)" strokeLinejoin="round">
          <use href={`#${id}-lettering`} y="8" strokeWidth="13" stroke="#777d85" />
          <use href={`#${id}-lettering`} strokeWidth="10" stroke="#262933" />
          <use href={`#${id}-lettering`} strokeWidth="7" stroke="#fff" />
        </g>
      </g>
    </svg>
  )
}
