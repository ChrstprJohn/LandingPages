import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { amount, articles, catalog, collectionsBySlug, colors, money, shopItems } from './catalog'
import { reviews } from './content'
import { Banner, BlogCard, ProductCard } from './home'
import { ArrowControls, Cta, Icon, Photo, Quantity } from './ui'
import { AboutPage } from './about'

function PageBanner({ title, text, image, children, variant }) {
  return <section className={`page-banner${image ? '' : ' page-banner-light'}${variant ? ` page-banner-${variant}` : ''}`}>
    {image && <Photo className="page-banner-image" file={image} eager />}
    {children}
    <div className="page-banner-copy page-width"><h1>{title}</h1>{text && <p>{text}</p>}</div>
  </section>
}

function Swatches({ value, change }) {
  return <div className="swatches" role="group" aria-label="Color options">
    {colors.map(([label, color], index) => <button key={label} type="button" aria-label={`Select ${label} variant`} title={label}
      aria-pressed={value === index} className="swatch" style={{ '--swatch': color }} onClick={() => change(index)} />)}
  </div>
}

function variantImage(item, color) {
  if (item.slug === 'modern-armchair' && color > 0) return color === 1 ? 'armchair-sage.jpg' : 'armchair-pink.jpg'
  return item.file || `product-${item.image}.jpg`
}

function CatalogCard({ item }) {
  const [color, select] = useState(0)
  return <div className="catalog-card"><ProductCard item={{ ...item, file: variantImage(item, color) }} /><Swatches value={color} change={select} /></div>
}

const shopTypes = ['Armchairs', 'Bedroom Furniture Sets', 'Tables', 'Clipboards', 'Laptop Stands', 'Rocking Chairs', 'Rugs']
const shopCollections = [['Living', 'living'], ['Bedroom', 'bedroom'], ['Dining', 'dining'], ['Lamps', 'lamps'], ['Office', 'office']]
const shopInventory = [...shopItems, ...catalog.filter((item) => !shopItems.some((first) => first.slug === item.slug))]
const madeToOrder = new Set([
  'modern-armchair', 'king-size-bed', 'hanger', 'rugs', 'halo-sectional', 'luxe-sofa', 'solace-chair', 'wooden-bookcase',
  'aspen-table', 'cutting-boards', 'elm-sideboard', 'maris-stool', 'vento-bench', 'ivory-twist', 'luna-dome', 'terra-desk',
])

function ShopFilters({ types, selected, availability, collection, onType, onAvailability, reset }) {
  return <div className="shop-filters">
    <fieldset><legend>Categories</legend>{types.map((type) => <label key={type}><input type="checkbox" checked={selected.includes(type)} onChange={() => onType(type)} />{type}</label>)}</fieldset>
    <nav aria-label="Collections"><h2>Collection</h2>{shopCollections.map(([name, slug]) => <a key={slug} aria-current={collection === slug ? 'page' : undefined} href={`/shop/${slug}`}><span className="filter-check" aria-hidden="true" />{name}</a>)}</nav>
    <fieldset className="availability-filters"><legend>Availability</legend>{['In Stock', 'Make to Order'].map((option) => <button type="button" className="filter-chip" key={option} aria-pressed={availability.includes(option)} onClick={() => onAvailability(option)}>{option}</button>)}</fieldset>
    <button className="solid-button" type="button" onClick={reset}>Reset filters</button>
  </div>
}

function ShopTail() {
  const benefits = [
    ['truck', 'Free Shipping', 'Prompt delivery on every order'],
    ['payment', 'Flexible Payment', 'Options at checkout'],
    ['return', 'Easy Returns', 'A simple seven-day return window'],
    ['support', 'Online Support', 'Find help online when you need it'],
  ]
  return <>
    <section className="page-width shop-feature">
      <div className="shop-feature-copy" data-page-reveal>
        <h2 className="section-title">Furniture That Fits Your Space</h2>
        <p>DCRAFTS makes furniture for spaces of all sizes, from a snug city apartment to a workspace shared by many.</p>
        <Cta to="/shop/office" plain>Browse collections</Cta>
      </div>
      <Photo file="shop-dining.png" alt="Dining chair in a furnished room" data-page-reveal />
    </section>
    <section className="shop-benefits" aria-label="Shopping benefits">
      <div className="page-width">
        {benefits.map(([icon, title, text]) => <article key={title} data-page-reveal><span><Icon name={icon} size={30} /></span><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
  </>
}

function ShopPage({ collection }) {
  const [selected, select] = useState([])
  const [availability, setAvailability] = useState([])
  const [limit, setLimit] = useState(9)
  const items = collection ? collectionsBySlug[collection] : shopInventory
  const title = collection ? collection[0].toUpperCase() + collection.slice(1) : 'Shop'
  const types = collection ? [...new Set(items.map((item) => item.type))] : shopTypes
  const madeToOrderOnly = availability.includes('Make to Order') && !availability.includes('In Stock')
  const filtered = items.filter((item) => {
    const type = !collection && item.type === 'Armchairs' && item.slug !== 'modern-armchair' ? null : item.type
    return (!selected.length || selected.includes(type)) && (!madeToOrderOnly || madeToOrder.has(item.slug))
  })
  const visibleItems = selected.length || madeToOrderOnly ? filtered : filtered.slice(0, limit)

  useEffect(() => { ScrollTrigger.refresh() }, [visibleItems.length])

  function toggle(value, setter) {
    setLimit(9)
    setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
  }

  const filterProps = {
    types, selected, availability, collection,
    onType: (type) => toggle(type, select),
    onAvailability: (option) => toggle(option, setAvailability),
    reset: () => { select([]); setAvailability([]); setLimit(9) },
  }

  return <>
    <PageBanner variant="shop" title={title} text="Everyday furniture with comfort built in" image="shop-banner.png">
      <div className="page-width shop-banner-scene">
        <div className="shop-banner-art">
          <span className="shop-banner-orbit shop-banner-orbit-upper" aria-hidden="true" /><span className="shop-banner-orbit shop-banner-orbit-lower" aria-hidden="true" />
          <Photo className="shop-banner-object shop-banner-chair" file="shop-chair.png" eager />
          <Photo className="shop-banner-object shop-banner-cabinet" file="shop-cabinet.png" eager />
        </div>
      </div>
    </PageBanner>
    <section className="page-width shop-layout" aria-label={`${title} products`}>
      <aside className="shop-sidebar" aria-label="Shop filters" data-page-reveal><ShopFilters {...filterProps} /></aside>
      <aside className="shop-filter-mobile" aria-label="Shop filters">
        <button type="button" popoverTarget="shop-filter-popover" className="shop-filter-toggle">Filter <Icon name="filter" size={16} /></button>
        <div id="shop-filter-popover" className="shop-filter-popover" popover="auto"><ShopFilters {...filterProps} /></div>
      </aside>
      <div className="shop-results" data-page-reveal>
        {visibleItems.length ? <div className="product-grid">{visibleItems.map((item) => <CatalogCard item={item} key={item.slug} />)}</div>
          : <p className="no-items" role="status">No pieces fit your current filters.</p>}
        {filtered.length > visibleItems.length && <button className="solid-button shop-load-more" type="button" onClick={() => setLimit((current) => current + 9)}>Load more</button>}
      </div>
    </section>
    <ShopTail />
  </>
}

function ProductPage({ item, addToCart }) {
  const [color, select] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [review, setReview] = useState(0)
  const person = reviews[review]
  const file = variantImage(item, color)
  const description = item.slug === 'modern-armchair'
    ? 'A deep seat and soft upholstery make this armchair a comfortable place to read, unwind, or settle in for a conversation.'
    : `${item.name} pairs a simple silhouette with an understated finish for the ${item.collection === 'lamps' ? 'room' : item.collection === 'living' ? 'living room' : item.collection}.`
  const related = [...collectionsBySlug[item.collection], ...shopItems].filter((product, index, all) => product.slug !== item.slug && all.findIndex((entry) => entry.slug === product.slug) === index).slice(0, 3)

  return <div className="page-width product-detail">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/shop">Shop</a><span>/</span><span>{item.name}</span></nav>
    <section className="product-detail-grid">
      <div className="product-gallery"><Photo key={file} className="primary-product" file={file} alt={`${item.name} in ${colors[color][0]}`} eager />
        {item.slug === 'modern-armchair' && <div className="product-thumbnails">{colors.map(([label], index) => <button key={label} aria-label={`${label} photo`} aria-pressed={color === index} onClick={() => select(index)}><Photo file={variantImage(item, index)} /></button>)}</div>}
      </div>
      <div className="product-summary"><h1>{item.name}</h1><p className="product-price">{item.price}{item.old && <s>{item.old}</s>}</p><p className="product-intro">{description}</p>
        <p className="product-color">Color <span>{colors[color][0]}</span></p><Swatches value={color} change={select} />
        <div className="purchase-row"><Quantity quantity={quantity} onChange={setQuantity} /><button className="solid-button" onClick={() => addToCart(item, color, quantity)}>Add to cart</button></div>
        <div className="product-benefits">{[['Free Shipping', 'On all orders'], ['Easy Returns', '7–10 business days'], ['Secure checkout', '7-Day Returns'], ['Support', 'Available online']].map(([label, text]) => <div key={label}><strong>{label}</strong><p>{text}</p></div>)}</div>
      </div>
    </section>
    <div className="product-disclosures">
      <details open><summary>About This Piece</summary><p>{description}</p></details>
      <details><summary>Specifications</summary><dl><dt>Collection</dt><dd>{item.collection}</dd><dt>Category</dt><dd>{item.type}</dd><dt>Color</dt><dd>{colors[color][0]}</dd></dl></details>
      <details><summary>Shipping and returns</summary><p>See our <a href="/legal/shipping">shipping information</a> and <a href="/legal/refund-policy">return policy</a>.</p></details>
    </div>
    <section className="detail-reviews"><h2 className="sub-title">Furniture in Daily Use</h2><figure><Photo file={`${person.key}.jpg`} /><div><blockquote>{person.quote}</blockquote><figcaption>{person.name}</figcaption></div></figure>
      <ArrowControls label="Furniture styling ideas" move={(direction) => setReview((review + direction + reviews.length) % reviews.length)} />
    </section>
    <section className="detail-related"><h2 className="sub-title">More to explore</h2><div className="product-grid">{related.map((product) => <ProductCard key={product.slug} item={product} />)}</div></section>
  </div>
}

const blogTopics = [['All', ''], ['Furniture Guides', 'furniture-guides'], ['Office Design', 'office-design'], ['Living Spaces', 'living-spaces']]

function BlogPage({ search }) {
  const category = blogTopics.find(([, slug]) => slug === new URLSearchParams(search).get('blog-category')) ?? blogTopics[0]
  const posts = category[1] ? articles.filter((article) => article.category === category[0]) : articles
  useEffect(() => { ScrollTrigger.refresh() }, [category])

  return <>
    <PageBanner variant="blog" title="Articles" text="Read about furnishing rooms, working comfortably, and finding your style" image="blog-banner.jpg" />
    <section className="page-width articles-list articles-index" aria-label="Articles">
      <div className="article-topics" data-page-reveal>
        <p>Explore by topic</p>
        <nav aria-label="Article topics">{blogTopics.map(([label, slug]) => <a className="filter-chip" key={label}
          aria-current={category[1] === slug ? 'page' : undefined} href={slug ? `/blog?blog-category=${slug}` : '/blog'}>{label}</a>)}</nav>
      </div>
      <div className={`blog-grid${category[1] ? '' : ' blog-grid-featured'}`} data-page-reveal>
        {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
      </div>
    </section>
  </>
}

const articleGuides = {
  'design-styling-tips': [
    ['Begin with your routine', 'Think through a typical day in the room. Pick furniture that supports those activities first and see what gaps remain after that.'],
    ['Make the layout work', 'A curved chair can add a softer line and a place to settle. Compare the size of each piece and leave enough room to walk comfortably between them.'],
    ['Mix a few textures', 'Combine visible grain, woven fabric, and matte surfaces in colors that work well together.'],
    ['Give one piece the focus', 'Let the space around a favorite piece draw attention to its shape and finish.'],
    ['Take a final pass', 'Put a few things away and keep what makes the room feel comfortable and useful.'],
  ],
  'office-setup-ideas': [['Give yourself room', 'Leave an open patch of desk beside the tools you use most.'], ['Check the light', 'Position the desk away from glare and switch on a task lamp as the room gets darker.'], ['Set your sitting height', 'Adjust your seat and work surface so you can sit comfortably and move around without strain.']],
  'home-décor-inspiration': [['Pick the main piece', 'Start with the piece you’ll use most and arrange the rest of the room around it.'], ['Tie old and new together', 'Repeat a wood tone or fabric texture to link a new purchase with pieces you already have.'], ['Open up the layout', 'Space out the larger pieces so the room has clear paths and feels restful.']],
  'modern-living-essentials': [['Start with the basics', 'Choose a seat you like, a table you can reach easily, and lights suited to your everyday tasks.'], ['Keep walkways open', 'Leave an easy route from the doorway to seats and cupboards.']],
  'workday-workspace-upgrade': [['Reorder your supplies', 'Keep daily supplies close by and file away the things you only need occasionally.'], ['Move during the day', 'Make room to get up, stretch, or tackle a different task between seated work.']],
  'dining-mood-table-design': [['Allow room for serving', 'Leave space for platters on the table and check that each chair can slide out easily.'], ['Soften the lighting', 'Keep the light above the table gentle and bring texture in through linens and dishes.']],
  'comfort-driven-design': [['Pay attention to posture', 'Sit the way you do at home when checking whether a chair or sofa is the right size.'], ['Check the whole seat', 'The feel of a seat depends on its depth, backrest, and upholstery as well as its cushioning.']],
  'thoughtful-furniture-choices': [['Measure the full route', 'Check the fit in the room and measure every turn and doorway along the delivery path.'], ['Consider upkeep at home', 'Choose surfaces and upholstery you can clean and maintain as part of your usual routine.']],
}

function ArticlePage({ post }) {
  return <><PageBanner title={post.name} text={post.category} image={`blog-${post.image}.jpg`} />
    <article className="reading-width article-body"><a href="/blog" className="back-link"><Icon name="left" size={17} /> All articles</a>
      {articleGuides[post.slug].map(([heading, text], index) => <section key={heading}><h2>{heading}</h2><p>{text}</p>{index === 2 && <Photo file={`blog-${post.image}.jpg`} />}</section>)}
    </article>
    <section className="page-width articles-list related-articles"><h2 className="sub-title">More From the Journal</h2><div className="blog-grid">{articles.filter((item) => item !== post).slice(0, 3).map((item) => <BlogCard key={item.slug} post={item} />)}</div></section>
  </>
}

function ContactPage() {
  const [draft, setDraft] = useState('')
  function prepareMessage(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const text = `${fields.get('message')}\n\n${fields.get('name')}\n${fields.get('email')}`
    setDraft(`mailto:support@furnexa.com?subject=${encodeURIComponent(fields.get('subject'))}&body=${encodeURIComponent(text)}`)
  }
  return <><PageBanner variant="contact" title="Let’s talk furniture" text="Ask us about finding the right piece, putting a room together, or checking on an order." />
    <div className="page-width contact-layout">
      <div className="support-copy">
        <section className="contact-info" data-page-reveal="top 62%">
          <span className="contact-icon"><Icon name="support" size={24} /></span>
          <div><h2>Help with your order</h2><p>Call or email our team about an order, a return, or a piece you’re considering. We can help you compare options and answer questions about the collection.</p>
            <dl><div><dt>Email</dt><dd><a href="mailto:support@furnexa.com">support@furnexa.com</a></dd></div>
              <div><dt>Phone</dt><dd><a href="tel:+15551234567">+1 (555) 123-4567</a></dd></div>
              <div><dt>Available</dt><dd>Mon–Fri, 9am–6pm EST</dd></div></dl>
          </div>
        </section>
        <section className="contact-showroom">
          <div className="contact-info" data-page-reveal="top 88%">
            <span className="contact-icon"><Icon name="map" size={24} /></span>
            <div><h2>Come by our showroom</h2><p>See the collection up close, try out a seat, and see how different finishes and pieces look together.</p>
              <address><Icon name="location" size={24} /><span>123 Modern Lane, Design City, CA 90001, USA</span></address>
            </div>
          </div>
          <div className="contact-map" data-page-reveal>
            <iframe title="Showroom map" src="https://maps.google.com/maps?q=California%2C%20USA&z=15&output=embed" loading="lazy" referrerPolicy="no-referrer" />
          </div>
        </section>
        <section className="contact-connect" data-page-reveal>
          <h2>Find Us Online</h2><div className="contact-socials">
            {[['instagram', 'Instagram', 'https://www.instagram.com/'], ['facebook', 'Facebook', 'https://facebook.com/'], ['twitter', 'X', 'https://x.com/']].map(([icon, label, url]) =>
              <a key={icon} href={url} target="_blank" rel="noreferrer"><Icon name={icon} size={20} /><span>{label}</span></a>)}
          </div>
        </section>
      </div>
      <form className="contact-form" aria-labelledby="contact-form-title" onChange={() => setDraft('')} onSubmit={prepareMessage} data-page-reveal="top 62%">
        <div><h2 id="contact-form-title">Write to our team</h2><p>Tell us what’s on your mind.</p></div>
        <div className="contact-fields">
          <label htmlFor="contact-name">Name<input id="contact-name" name="name" placeholder="Taylor Reed" autoComplete="name" required /></label>
          <label htmlFor="contact-email">Email<input id="contact-email" name="email" type="email" placeholder="taylor@example.com" autoComplete="email" required /></label>
          <label htmlFor="contact-subject">Subject<select id="contact-subject" name="subject" defaultValue="General Inquiry"><option>General Inquiry</option></select></label>
          <label htmlFor="contact-message">Message<textarea id="contact-message" name="message" placeholder="What can we help you with?" rows="5" required /></label>
          {draft ? <p role="status"><a className="solid-button" href={draft}>View email draft</a></p> : <Cta type="submit">Send Message</Cta>}
        </div>
      </form>
    </div></>
}

const questions = {
  'Orders and payment': [
    ['How do I order furniture online?', 'Pick a piece, choose its color and quantity, then add it to the cart. In this preview your choices are saved in the current browser.'],
    ['What can I use to pay for an order?', 'Ask our support team which payment options are available.'],
    ['Can I change or cancel an existing order?', 'Send your order details to support as soon as you can.'],
    ['Can I buy a gift card or voucher through the shop?', 'Check with our team to see whether gift cards are available.'],
    ['Where should I enter a discount or promo code?', 'Apply an active code at checkout when online ordering is available.'],
    ['Will my selections still be there when I return?', 'Items stay in the preview cart when you come back using the same browser.'],
    ['Will the preview ask for my payment information?', 'Payment details are never requested or processed by this preview.'],
    ['Who can I call about placing an order?', 'Call our support team for help with the ordering process.'],
  ],
  'Shipping and delivery': [['What delivery options are there?', 'Find delivery and tracking details in the shipping guide.'], ['Where do I track my order?', 'Look for the tracking details that came with your shipment, or contact our support team.']],
  'Returns and exchanges': [['Who do I contact for a return?', 'Tell our support team which item you’re returning and include the order details.'], ['Is an exchange possible?', 'Our team can check which replacements and exchange options are available.']],
  'Furniture care': [['What’s the best way to clean a piece?', 'Use the care directions for your piece’s particular material and finish.'], ['How can I care for a wood surface?', 'Put down mats or coasters and clean up any spills as soon as they happen.']],
}

function FaqPage() {
  const [selected, setSelected] = useState(Object.keys(questions)[0])
  return <><PageBanner title="Frequently Asked Questions" text="Find help with buying furniture, arranging delivery, returning an item, and caring for your pieces." />
    <section className="page-width faq-layout" aria-label="Frequently asked questions">
      <div className="faq-topics" role="group" aria-label="FAQ topics">{Object.keys(questions).map((topic) => <button key={topic} onClick={() => setSelected(topic)} aria-pressed={topic === selected}>{topic}</button>)}</div>
      <div className="faq-answers" key={selected}>{questions[selected].map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>
    <Banner title="Need a Hand?" text="Talk to our team about finding the right furniture." button="Contact support" to="/contact-us" media="faq-banner.jpg" />
  </>
}

const policies = {
  shipping: ['Shipping', ['Standard shipping at no cost', 'Expedited shipping', 'International shipping', 'Following your shipment', 'Before delivery day', 'If an item arrives damaged']],
  'refund-policy': ['Refund Policy', ['Items eligible for return', 'Starting a return', 'When refunds are issued', 'Replacing an item', 'How to report a problem', 'Damage on arrival']],
  'privacy-policy': ['Privacy Policy', ['What the browser saves', 'How contact details are used', 'Payment details', 'Local browser storage', 'When information is sent', 'Removing stored information']],
  terms: ['Terms', ['Using the storefront', 'Browsing the collection', 'Prices and payment', 'Selections and orders', 'Delivery services', 'Photos and typefaces']],
}

const policyNotes = {
  shipping: ['Ask our team which shipping services reach your address.', 'Check for faster shipping before you place your order.', 'Shipping options and timing vary by destination.', 'Look for the tracking details in your shipping confirmation.', 'Check doorway widths and clear the delivery route ahead of time.', 'Send our team clear photos of the damage and your order details.'],
  'refund-policy': ['Whether a piece can be returned depends on its condition, the item, and your order terms.', 'Tell our team what you ordered and why you’d like to return it.', 'Our team can explain how your refund will be issued and when to expect it.', 'Check with our team to see if a replacement is in stock.', 'Describe what happened and attach photos and order information when relevant.', 'Save the box and take photos of the damage before reaching out to our team.'],
  'privacy-policy': ['Your browser saves the pieces, colors, and quantities selected in the cart.', 'What you type in the contact form is used to create an email draft.', 'This storefront preview never requests payment details.', 'The browser keeps a local copy of your cart for your next visit.', 'Your contact details are sent only when you send the drafted message from your email app.', 'Remove your saved choices by emptying the cart or clearing this site’s browser data.'],
  terms: ['You’re viewing a local preview of the DCRAFTS shop.', 'You can browse products and their details here.', 'Prices appear in US dollars. Payments are unavailable in this preview.', 'Items in the cart remain selections in this preview.', 'Ask our team about shipping options before placing an order.', 'Photography and fonts remain the property of their respective rights holders.'],
}

function PolicyPage({ slug }) {
  const [title, headings] = policies[slug]
  return <><PageBanner title={title} /><article className="reading-width article-body">{headings.map((heading, index) => <section key={heading}><h2>{index + 1}. {heading}</h2><p>{policyNotes[slug][index]}</p></section>)}<Cta to="/contact-us" plain>Contact support</Cta></article></>
}

function CheckoutPage({ cart }) {
  const total = cart.reduce((sum, { item, quantity }) => sum + amount(item.price) * quantity, 0)
  return <><PageBanner title="Checkout" /><section className="reading-width article-body checkout-view" aria-label="Order summary"><h2>Order summary</h2>
    {cart.length ? <><ul>{cart.map(({ key, item, color, quantity }) => <li key={key}><span>{item.name} · {colors[color][0]} × {quantity}</span><span>{money(amount(item.price) * quantity)}</span></li>)}</ul><p className="checkout-total">Subtotal <strong>{money(total)}</strong></p><p>This storefront preview cannot process online orders.</p></> : <p>You haven’t added any items yet.</p>}
    <Cta to="/shop" plain>Continue shopping</Cta>
  </section></>
}

export function RoutePage({ path, search, cart, addToCart }) {
  const main = useRef(null)
  let [area, slug] = path.split('/').filter(Boolean)
  try { slug = decodeURIComponent(slug ?? '') } catch { slug = '' }
  const item = catalog.find((product) => product.slug === slug)
  const post = articles.find((article) => article.slug === slug)
  let page = <PageBanner title="Page not found" text="Browse the shop or head back to the homepage." />
  if (area === 'shop' && (!slug || Object.hasOwn(collectionsBySlug, slug))) page = <ShopPage collection={slug} />
  else if (area === 'shop' && item) page = <ProductPage item={item} addToCart={addToCart} />
  else if (area === 'blog' && !slug) page = <BlogPage search={search} />
  else if (area === 'blog' && post) page = <ArticlePage post={post} />
  else if (area === 'about-us') page = <AboutPage />
  else if (area === 'contact-us') page = <ContactPage />
  else if (area === 'faq') page = <FaqPage />
  else if (area === 'legal' && Object.hasOwn(policies, slug)) page = <PolicyPage slug={slug} />
  else if (area === 'checkout') page = <CheckoutPage cart={cart} />

  useEffect(() => {
    const title = document.querySelector('main h1')?.textContent
    if (title) document.title = `${title} - DCRAFTS`
    return () => { document.title = 'DCRAFTS - Furniture for Everyday Living' }
  }, [path])

  useGSAP(() => {
    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const opening = main.current.querySelectorAll('.page-banner-copy > *, .shop-banner-object, .about-hero-figure, .product-gallery, .product-summary')
      if (opening.length) gsap.from(opening, { opacity: 0, y: 32, duration: 0.65, stagger: 0.08, ease: 'power3.out' })

      for (const item of main.current.querySelectorAll('[data-page-reveal], .related-articles .blog-card, .product-disclosures, .detail-reviews')) {
        gsap.from(item, { opacity: 0, y: 40, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: item.dataset.pageReveal || 'top 84%', once: true },
        })
      }
    })
    return () => motion.revert()
  }, { scope: main })

  const fullHero = usesFullHero(path)
  return <main ref={main} className={`inner-page${fullHero ? ' inner-page-overlay' : ''}`} id="main-content">{page}</main>
}

export function usesFullHero(path) {
  const [area, slug] = path.split('/').filter(Boolean)
  return (area === 'about-us' || area === 'blog') && !slug || area === 'shop' && (!slug || Object.hasOwn(collectionsBySlug, slug))
}
