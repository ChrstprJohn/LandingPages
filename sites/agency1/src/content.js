import pages from './page-data.json'

export const navigation = [
  ['Home', '/'],
  ['About', '/about'],
  ['Works', '/work'],
  ['Contact', '/contact'],
  ['Blog', '/blog'],
]

export const socialLinks = [
  ['Instagram', 'https://www.instagram.com/lunisdesign/'],
  ['LinkedIn', 'https://www.linkedin.com/company/lunisdesign/'],
  ['X (Twitter)', 'https://x.com/lunisdesign'],
  ['Dribbble', 'https://dribbble.com/lunisdesign'],
]

export const studioCopy = [
  "We're a brand and editorial studio for companies with something clear to say. We give that idea a lasting form through identities, publications, and content systems made with care.",
  'We take on a few projects at a time and give each the same care, from a full campaign to a single printed card.',
]

export const services = [
  {
    title: 'Brand Identity',
    summary: 'An identity comes to life in every place people meet your brand.',
    detail: 'We start with strategy and build a full visual identity around it, including marks, type, colors, and a flexible design system. Each piece has room to suit its setting while still belonging to the same brand. Your team gets a practical set of guidelines for using the system day to day.',
    price: '$6,000',
    image: 'brand',
  },
  {
    title: 'Visual Design',
    summary: 'A visual system that holds together wherever it appears.',
    detail: 'We turn your brand into pieces you can use, from packaging and web layouts to social templates and campaign materials. We design across those formats so they read as one family at any size. It suits teams with an identity ready to put to work.',
    price: '$3,500',
    image: 'visual',
  },
  {
    title: 'Content & Voice',
    summary: 'A voice people can recognize in every story you tell.',
    detail: 'We give your brand an editorial voice and a plan for using it. Together we work out the tone, the messages customers need to hear, and a schedule your team can keep up with. It gives an established visual identity a voice that feels equally considered.',
    price: '$2,500',
    image: 'content',
  },
  {
    title: 'Brand Refresh',
    summary: 'A sharper identity expressed through design and movement.',
    detail: "We review what people already recognize in your brand and build from those strengths. The refresh tightens the identity, brings consistency to the system, and updates the places that feel dated. It's a focused way to move forward with the identity you already have.",
    price: '$4,000',
    image: 'refresh',
  },
]

export const projects = pages.projects.slice(0, 3)

export const process = [
  ['Discovery', '1–2 weeks', 'We interview the people closest to the business, look at your current brand, and review the market around you. That gives everyone a shared picture of what works today and what the next phase needs to accomplish.'],
  ['Strategy', '1 week', 'The research informs your positioning, the messages people need to hear, and the story that ties them together. We use those decisions as a brief for the visual and editorial work that follows.'],
  ['Design', '2–3 weeks', 'We explore a few visual directions, agree on one, and work through the details. Type and color establish the character early, and we carry it through to the smallest details people will see in everyday use.'],
  ['Development', '2–4 weeks', 'We turn the design into a working product and check how it responds on different screens. Testing the interactions and layouts during the build helps us carry the care in the design into the finished experience.'],
  ['Launch', '1 week', 'Once the work is approved, we make the final checks and prepare for launch. We hand over the assets and guidelines, then walk your team through what they\'ll need to keep using the work after release.'],
]

export const customers = [
  ['AlphaWave', 'alphawave', 376], ['Boltshift', 'boltshift', 310],
  ['Capsule', 'capsule', 298], ['Codecraft', 'codecraft', 404],
  ['Euphoria', 'euphoria', 314], ['Frequencii', 'frequencii', 354],
]

export const testimonials = [
  {
    name: 'Marcus Bennett', role: 'Founder of Northlight Studio', image: 'marcus', project: 'Brand identity engagement',
    quote: 'They picked up on what we were trying to become from the first conversation. The identity finally feels like it belongs to us, and people recognize our work much more readily now.',
  },
  {
    name: 'Elena Ruiz', role: 'Head of Product at Cadence Labs', image: 'elena', project: 'Visual design engagement',
    quote: 'The screens came back clearer and easier to use. The visual system gave our product the consistency we\'d been trying to find, and our team can now carry that through to the next release.',
  },
  {
    name: 'Priya Nair', role: 'Brand Lead at Veritas Group', image: 'priya', project: 'Editorial voice engagement',
    quote: 'They put words to ideas we\'d struggled to explain for years. What we publish now sounds like one team speaking plainly and with confidence, even when several of us contribute to it.',
  },
]

export const questions = [
  ['What kind of work can we hire you for?', 'We work across identity, visual and web design, and editorial voice. That could mean building a brand from the ground up or improving one part of it. We\'ll agree on what the business needs before the work begins.'],
  ['How much time should I plan for?', 'A brand or website project usually takes four to eight weeks, depending on the work involved. After the first call, we\'ll share a schedule showing the main milestones and where we\'ll need your input.'],
  ['What should I prepare before we start?', 'A short brief and a kickoff call are enough to get started. We\'ll take it from there and bring you into the reviews where your knowledge and feedback can make the biggest difference to the work.'],
  ['Can we keep working together after launch?', 'Yes, we offer flexible retainers for design, improvements, and support after a project goes live. This gives your team a way to keep the brand or site current as your business changes.'],
  ['How do you quote and bill for projects?', 'We agree on a fixed fee based on what\'s in scope. You\'ll usually pay a deposit at the start and the remaining balance on delivery. We invoice ongoing retainers each month.'],
  ['Can we work together from another city?', 'Yes. Our studio is in New York, and we run projects remotely with teams around the world. We set up a regular check-in time that fits everyone\'s schedule and makes approvals easy to plan.'],
]

export const posts = pages.posts.slice(0, 3)
