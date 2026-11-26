// In order from the leading dot to the resting ring. The marked sections cross in front of the letters.
const segments = [
  [false, 'M79.7 86 C109.8 107.3 191.6 152.7 403.2 186.4'],
  [true, 'M403.2 186.4 C412.7 188 433.1 192.9 414.7 209.8 C406.6 217.2 394.8 224.8 379.9 232.6'],
  [false, 'M379.9 232.6 C330.3 258.2 246.2 285.7 147.4 315.7'],
  [true, 'M147.4 315.7 C127 321.9 106.1 328.1 84.7 334.5'],
  [false, 'M84.7 334.5 C46.5 345.9 24.7 371.7 24.7 394.7'],
  [true, 'M24.7 394.7 C24.7 417.6 46.5 437.8 95.5 437.8 H839.1'],
  [false, 'M839.1 437.8 C1005.4 437.8 1042.8 426.7 1032.4 496.9'],
  [true, 'M1032.4 496.9 C1022.1 567 882.7 565.7 899.8 499.4'],
  [false, 'M899.8 499.4 C899.8 485.2 965.4 481.3 965.4 502 V572.2 C960.2 582.5 975.8 585.1 960.2 592.9 S966.7 607.2 948.5 613.7 S949.8 628 936.6 631 C928 633 931 639 926.5 638.4'],
].map(([front, path]) => [
  front,
  [...path.matchAll(/([MCHVS])([^MCHVS]+)/g)].map(([, command, coords]) => [command, coords.trim().split(/\s+/).map(Number)]),
])

export function fitDesktopHero(svg, path) {
  const bounds = svg.getBoundingClientRect()
  const title = svg.parentElement.querySelector('.hero-title')
  const text = getComputedStyle(title)
  const font = parseFloat(text.fontSize)
  const start = Math.min(107, Math.max(86, bounds.height * .116))
  const lane = title.getBoundingClientRect().top - bounds.top + 2 * parseFloat(text.lineHeight) + font * .028
  const x = (value) => +(value * bounds.width / 1264.8).toFixed(2)
  const y = (value) => +(value <= 437.8
    ? start + (value - 86) * (lane - start) / 351.8
    : lane + (value - 437.8) * font / 188.16).toFixed(2)
  const all = []
  const front = []
  for (const [foreground, commands] of segments) {
    const transformed = commands.map(([command, numbers]) =>
      command + numbers.map((number, index) => command === 'V' || index % 2 ? y(number) : x(number)).join(' '),
    )
    if (foreground) front.push(transformed.join(' '))
    all.push(...(all.length ? transformed.slice(1) : transformed))
  }
  const end = bounds.width * (922 / 1280)
  const rest = `${x(926.5)} ${y(638.4)}`
  const tail = `C${x(914)} ${y(657)} ${end} ${bounds.height * .97} ${end} ${bounds.height}`
  const viewBox = `0 0 ${bounds.width} ${bounds.height}`
  svg.setAttribute('viewBox', viewBox)
  svg.parentElement.querySelector('.hero-thread-front').setAttribute('viewBox', viewBox)
  const mask = svg.querySelector('mask')
  mask.setAttribute('width', bounds.width)
  mask.setAttribute('height', bounds.height)
  mask.querySelector('path').setAttribute('d', front.join(' '))
  svg.querySelector('[data-hero-tail]').setAttribute('d', `M${rest} ${tail}`)
  path.setAttribute('d', [...all, tail].join(' '))
}
