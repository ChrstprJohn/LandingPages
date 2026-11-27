const interpolate = (from, to, progress) => from + (to - from) * progress

export function wrapIndex(index, count) {
  return ((index % count) + count) % count
}

export function gallerySlots(width, size, mobile) {
  if (mobile) {
    const tabletProgress = Math.min(1, Math.max(0, (width - 390) / 250))
    const sideDrop = interpolate(0.25, 0.261, tabletProgress)
    const sideScale = interpolate(0.6, 0.578, tabletProgress)
    return [
      [0, 0, 1, 0],
      [size * 0.925, size * sideDrop, sideScale, 4],
      [size * 1.64, size * 0.365, 0.578, 6],
      [Math.max(width * 0.53 + size * 0.27, size * 2.17), size * 1.16, 0.495, 16],
    ]
  }

  return [
    [0, 0, 1, 0],
    [width * 0.26, size * 0.212, 0.6686, 6],
    [width * 0.442, size * 0.422, 0.4946, 12],
    [width * 0.53 + size * 0.24, size * 0.584, 0.4946, 16],
  ]
}

export function cardPose(delta, count, slots) {
  const offset = delta - count * Math.round(delta / count)
  const distance = Math.abs(offset)
  const start = Math.min(Math.floor(distance), slots.length - 1)
  const end = Math.min(start + 1, slots.length - 1)
  const progress = distance - start
  const travel = start === 0 ? progress ** 1.6 : progress
  const [x, y, scale, angle] = slots[start].map((value, i) =>
    interpolate(value, slots[end][i], i === 1 || i === 2 ? travel : progress),
  )
  const side = Math.sign(offset)

  return { x: x * side, y, scale, angle: angle * side, distance }
}
