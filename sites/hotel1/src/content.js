export const booking = 'https://www.booking.com/'
export const hotelName = 'DcdHotel'
export const hotelEmail = 'info@dcdhotel.example'

export const navigation = [
  ['Rooms', '/rooms'],
  ['Services', '/services'],
  ['Dining', '/dining'],
  ['About', '/about'],
  ['Gallery', '/gallery'],
]

export const photos = {
  hero: 'A grand hotel lobby with chandeliers and seating',
  'classic-room': 'A hotel bedroom with a tall upholstered headboard',
  'deluxe-room': 'A bed with a carved wooden headboard',
  'penthouse-suite': 'A modern suite with a seating area and city views',
  'junior-suite': 'A bright bedroom with framed artwork',
  'garden-villa': 'A villa bedroom with wood furnishings',
  'family-room': 'A warmly lit room with two beds',
  'services-feature': 'A bed framed by two bedside lamps',
  story: 'Sunlight falling across a hotel lobby',
  'dining-feature': 'A plated dish photographed from above',
  'journal-local': 'A square surrounded by historic buildings',
  'journal-food': 'Dishes and drinks on a restaurant table',
  'journal-travel': 'Small waves reaching a sandy beach',
  reception: 'A reception counter in a hotel lobby',
  parking: 'A white car in a dim parking garage',
  laundry: 'Front-loading washers beside a window',
  wellness: 'An indoor pool viewed through a doorway',
  concierge: 'A brass service bell on a counter',
  'dining-hero': 'A carefully arranged dish on a white plate',
  restaurant: 'A hotel dining room set for service',
  'gallery-hero': 'An indoor swimming pool lit by warm wall lights',
  'about-feature': 'A hotel bedroom with warm lamps and a large window',
  'team-jonathan': 'A suited person holding a folder',
  'team-marco': 'A chef arranging food on a plate',
  'team-elena': 'A receptionist passing a room key card to a guest',
  'private-dining': 'Candles and glasses on a dining table',
  'gallery-room': 'A bedroom lit by warm bedside lamps',
  'gallery-villa': 'A villa bedroom with windows looking onto greenery',
  'gallery-dining': 'A dining room with dark wood details',
  'gallery-exterior': 'An illuminated hotel beside a pool at dusk',
  'gallery-pool': 'Lounge chairs on a pool deck',
  'gallery-table': 'Hands raising glasses over a candlelit table',
}

export const rooms = [
  { slug: 'classic-room', name: 'Classic Room', type: 'Standard', photo: 'classic-room', rate: 120, size: 280, guests: 2, beds: 'Queen bed', description: 'A quiet, comfortable room with all the essentials for a good night’s rest.' },
  { slug: 'deluxe-room', name: 'Deluxe Room', type: 'Deluxe', photo: 'deluxe-room', rate: 185, size: 350, guests: 2, beds: 'King bed', description: 'A spacious room with a king bed and a sitting area of its own.' },
  { slug: 'penthouse-suite', name: 'Penthouse Suite', type: 'Suite', photo: 'penthouse-suite', rate: 420, size: 920, guests: 2, beds: 'King bed', description: 'Set on the top floor, with a separate living area, a private terrace, and sweeping city views.' },
  { slug: 'junior-suite', name: 'Junior Suite', type: 'Suite', photo: 'junior-suite', rate: 290, size: 510, guests: 2, beds: 'King bed', description: 'An open-plan suite with room to read, work, or relax.' },
  { slug: 'garden-villa', name: 'Garden Villa', type: 'Villa', photo: 'garden-villa', rate: 550, size: 1150, guests: 4, beds: 'King bed and two twins', description: 'A secluded villa with its own garden terrace and plunge pool.' },
  { slug: 'family-room', name: 'Family Room', type: 'Standard', photo: 'family-room', rate: 220, size: 480, guests: 4, beds: 'Queen bed and two twins', description: 'A room for families, with enough space for everyone to get comfortable.' },
]

export const services = [
  {
    title: 'Restaurant', category: 'Dining', photo: 'journal-food',
    description: 'A seasonal menu, a thoughtfully chosen wine list, and a dining room worth making time for.',
    detail: 'DcdHotel’s restaurant serves breakfast, lunch, and dinner every day. The kitchen works with nearby producers and builds the menu around what is in season. The main room seats 60, and the private room seats up to 14. Join us for weekend brunch from 10am to 3pm. Explore the menu.',
  },
  {
    title: 'Garage & Parking', category: 'Transport', photo: 'parking',
    description: 'Park underground with valet service, electric vehicle charging, and round-the-clock security on every level.',
    detail: 'The underground garage has space for up to 80 vehicles, with CCTV and 24-hour security on each level. Valet service is available at the main entrance, and electric vehicle charging is on Level B1. Both daily and overnight parking rates apply.',
  },
  {
    title: 'Laundry', category: 'Laundry', photo: 'laundry',
    description: 'Laundry, dry cleaning, and pressing for all garments. Leave them by 9am for return by that evening.',
    detail: 'We collect clothes from your room and return them cleaned and pressed the same day when you drop them off before 9am. A four-hour express service is available for an extra charge. You can also request dry cleaning, pressing on its own, or shoe care.',
  },
  {
    title: 'Spa & Wellness', category: 'Wellness', photo: 'wellness',
    description: 'Take time for the pool, sauna, and steam room, or choose from a full menu of spa treatments.',
    detail: 'The spa at DcdHotel offers massages, facials, body wraps, and hydrotherapy. You’ll find a heated indoor pool, a steam room, a sauna, and a lounge for unwinding between treatments. Book at the spa desk. Day passes are available for guests visiting from outside the hotel.',
  },
  {
    title: 'Concierge', category: 'Other', photo: 'concierge',
    detail: 'The concierge is on hand day and night for airport transfers, dinner reservations, city tours, theatre tickets, and other details that make a trip go more smoothly. Ask the team to arrange a private car or chauffeur whenever you need one.',
  },
]

export const guestNotes = [
  { quote: 'Someone had thought of every little thing. Our room was quiet, the bed was wonderfully comfortable, and the staff made even our smallest requests feel welcome.', name: 'Sophie Andersen', location: 'Copenhagen, Denmark', stay: 'Deluxe Room' },
  { quote: 'I’ve stayed in hotels all over the world, and the penthouse is among my favorites. I’d go back for the terrace alone. Breakfast was excellent, too. An easy recommendation.', name: 'James Whitfield', location: 'London, UK', stay: 'Penthouse Suite' },
  { quote: 'We spent our anniversary here and the team made it special in such a thoughtful, understated way. The villa had room and privacy, and we loved the plunge pool. Thank you.', name: 'Marta Ferrara', location: 'Milan, Italy', stay: 'Garden Villa' },
]

export const journal = [
  {
    slug: 'local-guide-neighbourhood', title: 'A Local’s Guide to Our Neighbourhood', category: 'Local', photo: 'journal-local', date: '2025-05-15',
    summary: 'Six places to eat, explore, and spend time just a short walk from the hotel.',
    author: 'The DcdHotel Team',
    body: [
      ['Around the Old Quarter', 'DcdHotel stands on the edge of the old quarter. Follow the cobblestones and you’ll find contemporary galleries alongside neighborhood restaurants. These are our favorite stops.'],
      ['Breakfast and Dinner', 'Walk two blocks south to the corner bakery for pastries baked fresh every morning and a good cup of coffee. At dinner, try the trattoria on the main square. Three generations of the same family have run it.'],
      ['Places to Visit', 'Give yourself two hours at the city museum, a ten-minute walk from the hotel. The central square hosts a market on Sundays from 8am to 2pm. It’s a good place to get a feel for everyday life here.'],
      ['Exploring Further', 'You can get to most places easily on foot. For a day out, the concierge can arrange a bicycle or book a private car for a longer trip.'],
    ],
  },
  {
    slug: 'how-we-think-about-food', title: 'What Guides Our Cooking', category: 'Food', photo: 'journal-food', date: '2025-04-28',
    summary: 'Our head chef talks about local suppliers, seasonal produce, and the pleasure of keeping things simple.',
    author: 'Chef Marco Ricci',
    body: [
      ['Following the Seasons', 'Twenty years of cooking professionally have taught me to start with whatever is perfectly ripe that day. Everything else follows from there. It’s the one rule we keep in this kitchen.'],
      ['Where We Source', 'Our vegetables come from a family farm forty kilometres outside the city, and a small dairy in the hills makes our cheese. We bake our own bread with a sourdough starter that predates the hotel.'],
      ['On This Month’s Menu', 'Stone fruits and early autumn herbs are making their way into the kitchen this month. The new tasting menu starts on the first Friday. Reserve early.'],
      ['Keeping It Simple', 'A good dish lets you pick out the flavor of every ingredient. We arrange each plate with the person who’s about to eat it in mind.'],
    ],
  },
  {
    slug: 'art-of-a-good-hotel-stay', title: 'How to Settle Into a Hotel Stay', category: 'Travel', photo: 'journal-travel', date: '2025-03-10',
    summary: 'A few practical ways to unpack, find your own pace, and enjoy the place you came to see.',
    author: 'The DcdHotel Team',
    body: [
      ['Give It Another Night', 'Most guests reserve two nights, and those who stay four tend to return the next year. By the third morning, the place feels familiar and you’ve usually found a pace that suits you.'],
      ['Make Yourself at Home', 'Hang up your clothes, put your toiletries in the bathroom, and leave your book on the nightstand. Those small habits can make your room feel like somewhere you’ve settled in for a few days.'],
      ['Make Time for the Restaurant', 'Plan a few meals here. The kitchen is something we put real care into, and breakfast on the terrace when the sky is clear is a lovely reason to get up early.'],
      ['Ask the Concierge for a Local Tip', 'The concierge knows which viewpoint catches the evening light and where to find the market that sets up only on Thursdays. Ask for something a little unexpected.'],
    ],
  },
]

export const diningHours = [
  ['Breakfast', '7:00', 'am', '11:00', 'am'],
  ['Lunch', '12:00', 'pm', '3:00', 'pm'],
  ['Dinner', '6:00', 'pm', '10:30', 'pm'],
  ['Brunch', '10:00', 'am', '3:00', 'pm', '(weekends only)'],
]

export const menuItems = [
  ['Breakfast', 'Sourdough Toast', 'House-baked sourdough with whipped butter and seasonal jam. Choose coffee or tea to go with it.', 9],
  ['Breakfast', 'Eggs Benedict', 'Poached eggs and smoked ham on toasted brioche, finished with hollandaise. A breakfast favorite.', 18],
  ['Lunch', 'Burrata & Tomato', 'Fresh burrata and heirloom tomatoes dressed with basil oil and a pinch of sea salt.', 22],
  ['Dinner', 'Roasted Sea Bass', 'Line-caught sea bass with fennel purée, caperberries, and brown butter. Our signature dinner dish.', 38],
  ['Drinks', 'Negroni', 'Our most ordered cocktail is stirred with Campari, sweet vermouth, and gin, then finished with orange peel.', 14],
  ['Desserts', 'Chocolate Fondant', 'Warm dark chocolate fondant with vanilla bean ice cream and cocoa soil. Ready in 12 minutes.', 16],
]

export const hotelStats = [
  ['Years in hospitality', 16],
  ['Room types', 6],
  ['Restaurant seats', 72],
  ['Average guest rating', 5],
]

export const chefBio = 'Marco trained in Bologna and Lyon, then led kitchens in London and Singapore. He came to DcdHotel to cook simply with ingredients from nearby producers. He writes a new tasting menu each month.'

export const team = [
  { name: 'Jonathan Reed', role: 'General Manager', photo: 'team-jonathan',
    bio: 'Jonathan has been part of DcdHotel since opening day. He previously spent fifteen years managing hospitality teams across Europe and Asia. His measure of a good hotel is simple: guests feel heard the first time they ask.' },
  { name: 'Marco Ricci', role: 'Head Chef', photo: 'team-marco', bio: chefBio },
  { name: 'Elena Vasquez', role: 'Head of Guest Experience', photo: 'team-elena',
    bio: 'Elena leads the teams that work directly with guests and keeps each stay running smoothly. Her background in luxury travel consultancy taught her how much the smallest details can shape what guests remember.' },
]
