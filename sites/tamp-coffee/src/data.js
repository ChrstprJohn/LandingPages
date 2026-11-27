export const email = 'hello@decocoffee.example'
export const photo = (name) => `/media/${name}.webp`

const items = [
  ['espresso', 'Espresso', '3.40', 'A double shot of Decõ House'],
  ['iced-oat-latte', 'Iced oat latte', '5.40', 'Two shots over oat milk and ice'],
  ['flat-white', 'Flat white', '4.60', 'A double shot with silky whole milk'],
  ['iced-matcha-latte', 'Iced matcha latte', '5.80', 'Ceremonial matcha over oat milk and ice'],
  ['cold-brew', 'Cold brew', '4.60', 'Steeped for 18 hours, served over ice'],
  ['espresso-tonic', 'Espresso tonic', '5.20', 'A shot over tonic with a twist of orange'],
  ['latte', 'Latte', '4.90', 'Two shots and steamed milk'],
  ['butter-croissant', 'Butter croissant', '4.20', 'Baked every morning by Halsted Bakehouse'],
  ['iced-americano', 'Iced americano', '4.20', 'Two shots over cold water and ice'],
  ['iced-chai', 'Iced chai', '5.40', 'Spiced black tea with milk over ice'],
  ['americano', 'Americano', '3.80', 'Two shots topped with hot water'],
  ['cappuccino', 'Cappuccino', '4.60', 'Two shots under thick, airy foam'],
  ['cortado', 'Cortado', '4.20', 'Equal parts espresso and warm milk'],
  ['banana-bread', 'Banana bread', '3.80', 'Baked in house, served warm'],
  ['egg-and-cheddar-sandwich', 'Egg and cheddar sandwich', '7.50', 'Soft egg and aged cheddar on a brioche bun'],
  ['turkey-sandwich', 'Turkey sandwich', '9.50', 'Roast turkey, avocado and tomato on sourdough'],
  ['caprese-focaccia', 'Caprese focaccia', '8.50', 'Tomato, mozzarella and basil on focaccia'],
  ['avocado-toast', 'Avocado toast', '8.00', 'Smashed avocado, chili and lemon on sourdough'],
  ['basque-cheesecake', 'Basque cheesecake', '6.50', 'Burnt top, creamy middle'],
  ['chocolate-chip-cookie', 'Chocolate chip cookie', '3.50', 'Dark chocolate and flaky sea salt'],
  ['cardamom-bun', 'Cardamom bun', '4.50', 'Swedish-style knot with pearl sugar'],
  ['matcha-latte', 'Matcha latte', '5.60', 'Ceremonial matcha with steamed oat milk'],
  ['chai-latte', 'Chai latte', '5.20', 'Our own spiced chai with steamed milk'],
  ['earl-grey', 'Earl Grey', '3.60', 'Black tea with bergamot, lemon on the side'],
]

export const menuItems = items.map(([slug, name, price, description]) => ({
  slug, name, price: `$${price}`, description, href: `/menu/${slug}`,
}))

const selectItems = (...indices) => indices.map((index) => menuItems[index])

export const featured = menuItems.slice(0, 7)
export const categories = {
  Popular: selectItems(1, 2, 3, 4, 5, 7),
  Espresso: selectItems(0, 2, 6, 10, 11, 12),
  Iced: selectItems(1, 3, 4, 5, 8, 9),
  Food: selectItems(7, 13, 14, 15, 16, 17),
  Desserts: selectItems(18, 19, 20),
}

export const catalogue = [
  ['espresso', 'Espresso', categories.Espresso],
  ['iced', 'Iced', categories.Iced],
  ['tea', 'Tea and matcha', selectItems(21, 22, 23)],
  ['food', 'Food', categories.Food],
  ['desserts', 'Desserts', categories.Desserts],
]

export const locations = [
  ['west-loop', 'West Loop', '1140 W Randolph St, Chicago, IL 60607', 'Mon–Fri 6:30 AM – 6 PM, Sat–Sun 7:30 AM – 5 PM',
    '0141', [['Mon–Fri', '6:30 AM – 6 PM'], ['Sat–Sun', '7:30 AM – 5 PM']], '28 seats · free Wi-Fi'],
  ['logan-square', 'Logan Square', '2618 N Milwaukee Ave, Chicago, IL 60647', 'Daily 7 AM – 7 PM',
    '0162', [['Every day', '7 AM – 7 PM'], ['Roastery', 'Tue and Fri mornings']], '40 seats and a patio · outlets at every table'],
  ['andersonville', 'Andersonville', '5309 N Clark St, Chicago, IL 60640', 'Daily 7 AM – 5 PM',
    '0193', [['Every day', '7 AM – 5 PM'], ['Window bar', '8 stools']], '22 seats · free Wi-Fi'],
]

export const reviews = [
  ['Priya S.', 'Flat white, oat · every weekday', 'Best flat white on Milwaukee Ave. They know me by name!', -7],
  ['Marcus T.', 'Cold brew, large · 8:10 AM', 'In and out in five minutes, every single morning. Never a wrong name.', 5],
  ['Lena K.', 'Iced matcha latte · weekends', 'That matcha. I dream about that matcha.', -4],
  ['Diego R.', 'Americano, refill · 2 PM', 'Quiet corner, fast Wi-Fi, refills for a dollar. My office now.', 6],
]

export const partners = [
  'Fulton Provisions', 'Lakeview Grocer', 'HALSTED BAKEHOUSE', 'North Pier Hotel',
  'wicker studio', 'UNION TABLE', 'Ravenswood Books', 'Pilsen Market',
]
