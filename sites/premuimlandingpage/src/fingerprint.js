// Reference ridge positions sampled from the public About thread, in a 400 × 531 frame.
const ridge = `
159,0 153,8 236,1 267,5 287,12 306,23 328,45 334,54 340,74 333,78 324,73 292,44 265,29 244,22 202,18 151,25 102,46 76,65 64,83 62,93
101,59 140,42 181,36 233,41 273,57 317,87 340,110 358,135 372,163 376,184 368,186 334,133 305,102 288,89 251,68 200,55 179,54 148,59 109,73 74,96 50,117 44,126 45,134
97,98 145,77 176,73 197,74 237,86 274,108 298,129 348,185 376,230 386,260 387,271 383,280 375,276 363,246 342,210 296,150 256,116 238,106 208,96 177,92 145,96
96,117 70,135 32,172 22,191 24,200 34,197 78,153 105,135 134,121 154,115 186,113 227,123 272,152 321,208 368,290 382,330 383,350 378,359 370,353 358,312 341,273
308,219 274,178 250,157 232,146 202,135 181,132 140,139 102,158 85,170 45,205 24,228 8,255 6,266 10,274 19,272 61,223 91,195 117,176 156,158 186,153 207,155
245,173 261,187 261,197 251,198 233,185 203,175 183,174 153,183 127,201 101,234 80,230 72,236 14,299 5,317 14,320 24,315 40,301 81,251 91,251 90,261 68,298
17,351 67,466 99,462 118,453 135,440 179,394 191,377 202,347 203,336 200,316 192,311 186,319 185,350 181,360 155,393 124,423 106,434 76,444 69,438 72,429
108,408 148,371 162,343 170,302 182,284 191,280 202,282 210,290 218,309 219,320 215,361 193,410 199,417 215,405 225,387 236,346 234,305 227,285 215,267 196,259
185,260 176,265 161,280 131,349 112,375 96,389 69,404 59,405 55,396 99,353 139,277 158,251 174,239 184,236 194,234 215,239 231,253 242,272 252,313 251,355
239,396 223,423 199,443 138,461 91,484 83,492 91,497 101,495 151,476 212,460 238,442 251,425 266,385 270,355 270,324 263,283 251,254 231,228 213,218 192,214
172,218 162,224 139,246 93,330 72,355 46,372 37,368 37,358 53,344 80,311 121,237 142,213 170,198 191,195 211,199 231,208 247,221 259,238 273,266 283,297
292,358 290,389 285,410 272,439 260,455 235,476 196,492 134,505 115,514 109,523 116,529 137,528 198,514 238,500 264,482 279,465 298,427 303,407 305,355 310,349
315,358 322,389 319,431 311,450 271,500 267,510 274,515 284,511 300,497 319,472 333,443 341,402 340,382 331,351 283,247 267,219 270,210 280,211 302,247 339,323
351,353 359,394 354,435 343,465 327,492 295,523
`.trim().split(/\s+/).map((pair) => pair.split(',').map(Number))

const tangents = ridge.map((point, index) => {
  const before = ridge[Math.max(0, index - 1)]
  const after = ridge[Math.min(ridge.length - 1, index + 1)]
  const incoming = Math.hypot(point[0] - before[0], point[1] - before[1])
  const outgoing = Math.hypot(after[0] - point[0], after[1] - point[1])
  const weight = Math.min(incoming, outgoing) / (3 * (incoming + outgoing))
  return [(after[0] - before[0]) * weight, (after[1] - before[1]) * weight]
})

export function fingerprintPath(width, height, phone = false) {
  const printWidth = phone ? Math.min(width * .60, height * .36) : Math.min(width * .335, 464)
  const scale = printWidth / 400
  const left = width * (phone ? .50 : .758) - printWidth / 2
  const top = phone ? height * .505 : (height - 531 * scale) / 2
  const point = (x, y) => `${(left + x * scale).toFixed(1)} ${(top + y * scale).toFixed(1)}`
  const edge = width * (phone ? .5 : .61)
  const start = width * (phone ? 290 / 390 : .61)
  const ridgeStart = point(...ridge[0])
  const ridgeEnd = point(...ridge.at(-1))
  const parts = [phone
    ? `M${start} 0 C${width * .91} ${top * .46} ${width * 1.07} ${top * .97} ${ridgeStart}`
    : `M${start} 0 C${start} 40 ${left + printWidth * .42} ${top - 16} ${ridgeStart}`]
  ridge.slice(1).forEach(([x, y], index) => {
    const [previousX, previousY] = ridge[index]
    const [fromX, fromY] = tangents[index]
    const [toX, toY] = tangents[index + 1]
    parts.push(`C${point(previousX + fromX, previousY + fromY)} ${point(x - toX, y - toY)} ${point(x, y)}`)
  })
  const [endX, endY] = ridgeEnd.split(' ').map(Number)
  parts.push(`C${endX - printWidth * .035} ${endY + 8} ${edge} ${height * .941} ${edge} ${height}`)
  return parts.join(' ')
}
