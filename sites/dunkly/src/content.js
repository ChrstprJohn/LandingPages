export const flavours = [
  { id: 'cocoa', word: 'COCOA', name: 'classic double dark', alt: 'Classic double dark chocolate donut', price: 450, note: 'baked this morning', description: 'Our original. Dunked twice in 70% Belgian dark chocolate, finished with silky cocoa curls.' },
  { id: 'hazel', word: 'HAZEL', name: 'hazelnut crunch', alt: 'Hazelnut crunch chocolate donut', price: 490, note: 'contains nuts', description: 'Milk chocolate glaze loaded with roasted hazelnuts and a slow drizzle of salted caramel.' },
  { id: 'berry', word: 'BERRY', name: 'strawberry dip', alt: 'Strawberry dip chocolate donut', price: 490, note: 'limited batch', description: 'Dark chocolate base, dipped in real strawberry glaze and topped with crunchy berry bits.' },
]

const catalogRows = [
  ['cocoa', 'classic-double-dark', 'classic double dark', 'classic', 450, 'pink', 'best seller', 'Our original. Dunked twice in 70% Belgian dark, finished with cocoa curls.', 'A soft brioche ring, rested between two dark chocolate dunks for a glaze that snaps before it melts. Finished by hand with dark chocolate curls.', 'brioche dough, 70% dark chocolate, cocoa butter, cane sugar, vanilla'],
  ['hazel', 'hazelnut-crunch', 'hazelnut crunch', 'nutty', 490, 'orange', '', 'Milk chocolate glaze loaded with roasted hazelnuts and a caramel drizzle.', 'Pillowy dough, milk chocolate and an extra layer of crunch from the hazelnuts we roast each morning.', 'brioche dough, milk chocolate, roasted hazelnuts, caramel, sea salt'],
  ['berry', 'strawberry-dip', 'strawberry dip', 'fruity', 490, 'cream', 'fan fave', 'Dark chocolate base, dipped in strawberry glaze and freeze-dried berries.', 'A dark chocolate dunk and a dip of real strawberry glaze. Freeze-dried berries give it a sharp, bright finish.', 'brioche dough, dark chocolate, strawberry purée, freeze-dried strawberries'],
  ['hero', 'sprinkle-party', 'sprinkle party', 'classic', 450, 'pink', '', 'Milk chocolate drip with pink and cream sprinkles. Pure joy in a ring.', 'Glossy milk chocolate drips down the sides of this ring, topped with our pink and cream sprinkles.', 'brioche dough, milk chocolate, sugar sprinkles, vanilla'],
  ['caramel', 'salted-caramel', 'salted caramel', 'classic', 490, 'orange', 'new', 'Milk chocolate glaze, golden caramel ribbons and flaky sea salt.', 'Our milk chocolate dunk, ribboned with slow-cooked caramel and finished with flaky sea salt.', 'brioche dough, milk chocolate, caramel, flaky sea salt, butter'],
  ['triple', 'triple-cocoa', 'triple cocoa', 'limited', 520, 'cream', 'limited', 'Dark glaze, chocolate shavings and cocoa nibs. For the serious cocoa crowd.', 'A cocoa dough, a very dark glaze, and a pile of chocolate shavings and crunchy cocoa nibs. Baked in limited weekend batches.', 'cocoa brioche dough, 80% dark chocolate, chocolate shavings, cocoa nibs'],
  ['cookie', 'cookies-and-cream', 'cookies & cream', 'classic', 490, 'cream', '', 'White chocolate glaze, dark cookie crumble and a chocolate drizzle.', 'Creamy white chocolate, crushed cocoa cookies and a zigzag of dark chocolate.', 'brioche dough, white chocolate, cocoa cookies, dark chocolate'],
  ['orange', 'dark-orange', 'dark orange', 'fruity', 490, 'pink', '', 'Dark chocolate with candied orange peel and fresh zest.', 'A dark chocolate glaze topped with candied orange peel and freshly grated zest.', 'brioche dough, dark chocolate, candied orange peel, orange zest'],
]

export const catalog = catalogRows.map(([id, slug, name, category, price, tone, badge, description, story, ingredients]) => ({
  id, slug, name, category, price, tone, badge, description, story, ingredients,
  alt: `${name} chocolate donut`, allergens: id === 'hazel' ? 'wheat, milk, egg, soy, tree nuts' : 'wheat, milk, egg, soy',
}))

export const extras = [
  { id: 'milk', name: 'cold milk shot', price: 150 },
  { id: 'choc', name: 'hot choc', price: 450 },
  { id: 'gift', name: 'gift note', price: 0 },
]

export const boxes = [
  { id: 'six', name: 'the six', count: 6, price: 2400, note: 'the everyday fix', images: ['cocoa', 'berry', 'hazel'] },
  { id: 'dozen', name: 'the dozen', count: 12, price: 4400, note: 'save $10 · most loved', images: ['hazel', 'hero', 'cocoa'] },
  { id: 'party', name: 'the party', count: 24, price: 8200, note: 'save $26 · serves 12', images: ['berry', 'cocoa', 'hero'] },
]

export const promises = [
  ['belgian cocoa', '70% dark, never compound. Melted by hand each morning.', 'cocoa'],
  ['baked at 5am', 'Small batches, real ovens, actual humans. Never, ever frozen.', 'hazel'],
  ['dunked twice', 'One dip to coat it. A second dip to make it unforgettable.', 'berry'],
  ['delivered warm', 'Insulated boxes and local riders, at your door within hours.', 'hero'],
]

export const reviews = [
  ['Honestly ruined every other donut for me. The cocoa one is dangerous.', 'maya r.', 'classic double dark', 'cocoa'],
  ['I drove forty minutes for a box of six. I’d do it again tomorrow.', 'tasha w.', 'berry dip', 'berry'],
  ['The hazelnut crunch is the best thing I’ve eaten this year. Easily.', 'priya s.', 'hazelnut crunch', 'hazel'],
  ['Arrived warm. WARM. I don’t know how and I don’t want to know.', 'jordan t.', 'the dozen', 'hero'],
]

export const questions = [
  ['How fresh are they?', 'Baked at 5am and dunked the same morning. Nothing sits overnight, ever.'],
  ['Do you deliver to me?', 'We deliver across the city in insulated boxes. Pop your postcode in at checkout to check.'],
  ['What’s the order cutoff?', 'Order by 2pm for same-day delivery. After that, yours gets baked first thing tomorrow.'],
  ['Can I mix flavours?', 'Always. Every box is build-your-own, so pick any combo you like.'],
  ['What about allergens?', 'Full allergen info sits on every product page. Hazelnut crunch contains nuts.'],
  ['How long do they keep?', 'Best on day one, still great on day two. Keep them cool, never in the fridge.'],
]

export const nav = [
  ['shop', '/shop'], ['build a box', '/build-a-box'], ['our story', '/our-story'],
  ['delivery', '/delivery'], ['contact', '/contact'], ['find a shop', '/find-a-shop'],
]

export function money(cents) {
  return `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`
}
