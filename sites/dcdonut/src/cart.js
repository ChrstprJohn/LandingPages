import { boxes, catalog, extras } from './content.js'

const storageKey = 'dunkly-box-v1'

export function boxKey(box, selection) {
  return `box/${box.id}/${catalog.map(item => selection[item.id] || 0).join('-')}`
}

function getItem(id) {
  const single = [...catalog, ...extras].find(item => item.id === id)
  if (single) return single

  const [type, name, mix, ...rest] = id.split('/')
  const box = boxes.find(item => item.id === name)
  if (rest.length || type !== 'box' || !box || !/^\d{1,2}(?:-\d{1,2}){7}$/.test(mix)) return null

  const amounts = mix.split('-').map(Number)
  if (amounts.reduce((sum, amount) => sum + amount, 0) !== box.count) return null

  const mixDescription = catalog.flatMap((item, index) => amounts[index] ? [`${item.name} ×${amounts[index]}`] : []).join(', ')
  return { id, name: box.name, price: box.price, art: box.images[0], mixDescription }
}

export function cartLines(items) {
  return Object.entries(items).flatMap(([id, quantity]) => {
    const item = getItem(id)
    return item && quantity > 0 ? [{ ...item, quantity }] : []
  })
}

export function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey))
    return Object.fromEntries(Object.entries(saved || {}).filter(([id, quantity]) => Number.isSafeInteger(quantity) && quantity > 0 && getItem(id)))
  } catch {
    return {}
  }
}

export function saveCart(items) {
  try { localStorage.setItem(storageKey, JSON.stringify(items)) } catch { /* The current page can still update the box. */ }
}
