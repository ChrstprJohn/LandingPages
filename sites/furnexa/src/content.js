export const navigation = [
  ['Home', '/'], ['Shop', '/shop'], ['About', '/about-us'], ['Blog', '/blog'], ['Contact', '/contact-us'],
]

export const categories = [
  { name: 'Living Room', slug: 'living', price: '$2,099 - $5,099' },
  { name: 'Dining', slug: 'dining', price: '$1,099 - $3,099' },
  { name: 'Office', slug: 'office', price: '$3,099 - $6,099' },
  { name: 'Bedroom', slug: 'bedroom', price: '$2,099 - $9,099' },
  { name: 'Lamps', slug: 'lamps', image: 'lamp', price: '$1,099 - $6,099' },
]

export const products = [
  { name: 'Studio Armchair', slug: 'modern-armchair', image: 'armchair', price: '$2,099', old: '3,399$' },
  { name: 'Platform King Bed', slug: 'king-size-bed', image: 'bed', price: '$1,199', old: '1,500$' },
  { name: 'Round Side Table', slug: 'cozy-table', image: 'table', price: '$699' },
  { name: 'Low Cabinet', slug: 'cupboard', image: 'cupboard', price: '$299' },
  { name: 'Wood Hanger', slug: 'hanger', image: 'hanger', price: '$99' },
  { name: 'Nook Nightstand', slug: 'luna-nightstand', image: 'nightstand', price: '$99' },
]

export const reviews = [
  { name: 'Home office', key: 'emily', quote: 'A sturdy desk and a supportive chair make a good starting point for a home office. Keep the surface open enough to move between tasks during the day.' },
  { name: 'Living room', key: 'daniel', quote: 'Give the living room a spot to settle in at the end of the day. A deep seat and warm wood finishes can make the space feel inviting without adding clutter.' },
  { name: 'Reading corner', key: 'sophia', quote: 'Create a reading corner with a seat you can lean back in, a nearby lamp, and a small table for whatever you like to keep within reach.' },
  { name: 'Small spaces', key: 'alex', quote: 'A few well-proportioned pieces can make a smaller room feel warm and easy to use. Look for simple forms and leave space to walk between them.' },
]

export const posts = [
  { name: 'A room in balance', slug: 'design-styling-tips', image: 'style', category: 'Furniture Guides' },
  { name: 'Set up your workspace', slug: 'office-setup-ideas', image: 'office', category: 'Office Design' },
  { name: 'Ideas for a lived-in home', slug: 'home-décor-inspiration', image: 'decor', category: 'Living Spaces' },
]

export const footerLinks = [
  ['Explore', [['Home', '/'], ['Shop', '/shop'], ['About Us', '/about-us'], ['Blog', '/blog'], ['FAQ', '/faq']]],
  ['Shop by room', [0, 3, 2, 1, 4].map((index) => [categories[index].name, `/shop/${categories[index].slug}`])],
  ['Customer care', [
    ['Shipping Information', '/legal/shipping'], ['Return & Refund Policy', '/legal/refund-policy'],
    ['Privacy Policy', '/legal/privacy-policy'], ['Terms & Conditions', '/legal/terms'], ['Contact', '/contact-us'],
  ]],
]
