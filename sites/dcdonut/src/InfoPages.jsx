import { useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowButton, ArrowLink, Donut, RouteHero, RouteSection, Seal, SectionTitle } from './ui.jsx'

function RouteSeal({ children }) {
  return <div className="route-seal"><Seal /><span>{children}</span></div>
}

const milestones = [
  ['2019', 'the first dunk', 'A folding table, a borrowed pot and 60 donuts. Gone by ten.'],
  ['2020', 'a real shop', 'Our tiny pink corner shop opens on Baker Lane.'],
  ['2022', 'the dunk club', 'Members get first dibs on every new flavour.'],
  ['2024', 'delivered warm', 'Insulated boxes and local riders, door to door.'],
  ['2026', 'eight flavours', 'From classic double dark to triple cocoa.'],
]

export function Story() {
  return <>
    <RouteHero title="OUR STORY" label="est. 2019" text="Two friends, one pot of chocolate and a very stubborn idea: a donut should be dunked twice." art={['cocoa', 'berry']} className="story-hero" />
    <RouteSection className="story-origin">
      <div className="route-width route-split feature-split">
        <figure className="feature-photo kitchen-photo" data-route-reveal="kitchen-photo"><Donut kind="story-origin" alt="Fresh chocolate donuts in the Dunkly kitchen" /><figcaption>5am,<br />every day</figcaption></figure>
        <div className="article-copy" data-route-reveal="from-right"><SectionTitle label="how it started">IT STARTED WITH ONE POT OF CHOCOLATE</SectionTitle>
          <p>Back in 2019, Mina and Theo were selling donuts from a folding table at the Saturday market. One morning they ran out of glaze and dunked the whole batch in the dark chocolate meant for brownies. Then they did it again.</p>
          <p>The line went round the block by ten. Every Dunkly donut is still made the same way. Small batches, real Belgian chocolate, two dunks, no shortcuts.</p>
          <p><b>— mina &amp; theo, founders</b></p>
        </div>
      </div>
    </RouteSection>
    <RouteSection tone="orange" className="story-timeline">
      <SectionTitle label="the dunk timeline">HOW WE GOT HERE</SectionTitle>
      <ol className="route-width timeline-grid">{milestones.map(([year, title, text]) => <li className="route-note" key={year} data-route-reveal="milestone"><b>{year}</b><h3>{title}</h3><p>{text}</p></li>)}</ol>
    </RouteSection>
    <RouteSection tone="pink" className="story-numbers">
      <div className="route-width number-grid">{[['2', 'dunks in every donut'], ['70%', 'Belgian dark cocoa'], ['5am', 'first batch, every day'], ['12k', 'happy dunkers a week']].map(([amount, label]) => <div key={label} data-route-reveal="stat"><b>{amount}</b><p>{label}</p></div>)}</div>
    </RouteSection>
    <RouteSection className="story-visit">
      <div className="route-width route-split feature-split">
        <div className="article-copy" data-route-reveal="from-left"><SectionTitle label="come say hi">THE DOOR IS ALWAYS OPEN</SectionTitle><p>Pop into the shop for a warm one straight off the rack, or let us bring the box to you. Either way, the kettle is on.</p><div className="route-actions"><ArrowLink href="/shop">shop online</ArrowLink><a className="filter-pill" href="/find-a-shop">find a shop</a></div></div>
        <figure className="feature-photo store-photo" data-route-reveal="store-photo"><Donut kind="story-shop" alt="The Dunkly shop" /></figure>
      </div>
    </RouteSection>
  </>
}

const locations = [
  ['baker lane', 'the original', '14 Baker Lane, Old Town', 'mon–fri 7am–6pm · sat–sun 8am–5pm'],
  ['riverside', 'dunk bar inside', '88 Canal Street, Riverside', 'every day 7am–8pm'],
  ['market hall', 'weekends only', 'Stall 12, Saturday Market Hall', 'sat–sun 8am–2pm'],
]

function LocationMap() {
  return <div className="location-map" aria-hidden="true" data-route-reveal="map">
    <svg className="map-art" viewBox="0 0 500 580" preserveAspectRatio="none">
      <rect x="292" y="34" width="170" height="128" rx="42" fill="var(--orange)" />
      <g fill="var(--brown)" opacity=".35"><circle cx="330" cy="72" r="5" /><circle cx="372" cy="118" r="5" /><circle cx="420" cy="80" r="5" /><circle cx="430" cy="134" r="5" /><circle cx="348" cy="138" r="4" /></g>
      <path d="M-20 488C110 430 200 560 320 508S470 420 530 454" fill="none" stroke="white" strokeOpacity=".7" strokeWidth="40" strokeLinecap="round" />
      <path d="M-10 214H510 M-10 368H510 M86-10V600 M252-10V600 M-20 600L520 150" fill="none" stroke="var(--cream)" strokeWidth="18" strokeLinecap="round" />
      <path d="M-10 110H252 M170 214V368 M400 214V368 M252 290H510" fill="none" stroke="var(--cream)" strokeWidth="8" strokeLinecap="round" opacity=".9" />
      <path d="M150 178C220 210 300 240 352 312C300 380 240 410 206 432" fill="none" stroke="var(--brown)" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" opacity=".55" />
    </svg>
    <b className="map-pin"><span>01</span></b><b className="map-pin"><span>02</span></b><b className="map-pin"><span>03</span></b>
    <RouteSeal>3 pink<br />doors</RouteSeal>
  </div>
}

export function Locations() {
  return <>
    <RouteHero title="FIND A SHOP" label="3 pink doors · open from 7am" text="Warm donuts, cold milk and a seat by the window. Pick the pink door closest to you." art={['hero', 'hazel']} className="locations-hero" />
    <RouteSection className="shops-section">
      <div className="route-width route-split feature-split">
        <LocationMap />
        <div className="article-copy"><SectionTitle label="our shops">COME DUNK WITH US</SectionTitle>
          {locations.map(([name, label, address, hours], i) => <article className="location-row" key={name} data-route-reveal="shop-card">
            <div className="location-row-top"><span>0{i + 1}</span><h3>{name}</h3><small>{label}</small></div>
            <address>{address}</address>
            <div className="location-row-bottom"><p>{hours}</p><a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}>directions →</a></div>
          </article>)}
        </div>
      </div>
    </RouteSection>
    <RouteSection tone="orange" className="counter-section">
      <div className="route-width route-split feature-split">
        <div className="article-copy" data-route-reveal="from-left"><SectionTitle label="in-store extras">ONLY AT THE SHOP</SectionTitle><p>Some things don’t travel. The 7am batch is still warm, the chocolate is still runny, and the dunk bar lets you go as deep as you like.</p></div>
        <div className="counter-menu" data-route-reveal="counter"><RouteSeal>made to<br />order</RouteSeal><h3>the counter</h3><p>chalked fresh every morning</p><dl>{[['dunk-your-own bar', '$5'], ['the 7am warm batch', '$3'], ['double-dunk hot choc', '$4.50'], ['cold milk shot', '$1.50'], ['bottomless drip coffee', '$3']].map(([name, price]) => <div key={name}><dt>{name}</dt><dd>{price}</dd></div>)}</dl></div>
      </div>
    </RouteSection>
    <RouteSection tone="pink" className="route-end-cta locations-cta"><SectionTitle label="too far?" text="We deliver warm boxes across the city, seven days a week. Order by 2pm for same-day.">NO PINK DOOR NEAR YOU?</SectionTitle><div className="route-actions"><ArrowLink href="/build-a-box">build a box</ArrowLink><a className="filter-pill" href="/shop">shop online</a></div></RouteSection>
  </>
}

const deliverySteps = [
  ['2pm', 'order by two', 'Pick your box online before 2pm for same-day.'],
  ['3pm', 'we dunk twice', 'Fresh batch, two dunks, sprinkles while it’s wet.'],
  ['4pm', 'boxed warm', 'Insulated boxes keep the chocolate glossy.'],
  ['6pm', 'at your door', 'A local rider texts you when it’s five minutes out.'],
]

const deliveryFaq = [
  ['ordering & delivery', [
    ['what time do I need to order by?', 'Order by 2pm for same-day delivery. Anything after that, we bake yours first thing tomorrow morning.'],
    ['how much is delivery?', 'Delivery is $4 within 5km of a shop and $7 up to 10km. Orders over $40 nearby or over $60 across town ship free.'],
    ['can I choose a delivery time?', 'Yes. Pick a 2-hour slot at checkout, between 10am and 8pm, seven days a week.'],
    ['what if I’m not home?', 'Our rider will call first. If we can’t reach you, we’ll leave the box somewhere safe and shady and text you a photo.'],
  ]],
  ['the donuts', [
    ['how long do they stay fresh?', 'Best on the day, still great the next. Give one 8 seconds in the microwave to bring the melt right back.'],
    ['any vegan or gluten-free options?', <>Ask us about current batches before ordering. Check the ingredients and allergen information for <a className="text-link" href="/shop/triple-cocoa">triple cocoa</a> and other flavours.</>],
    ['what about allergens?', 'Every donut page lists its allergens. Our kitchen handles nuts, dairy, eggs and gluten, so we can’t promise zero traces.'],
    ['can I order for a party or office?', 'Absolutely. For 50 or more donuts, give us 48 hours’ notice through the contact page.'],
  ]],
]

export function Delivery() {
  return <>
    <RouteHero title="WARM TO YOUR DOOR" label="delivery & faq" text="Order by 2pm, we bake, dunk and box it, and a rider drops it off still warm. Here’s everything you need to know." art={['orange', 'cocoa']} className="delivery-hero" />
    <RouteSection className="delivery-journey"><SectionTitle label="how it works">OVEN TO DOORSTEP</SectionTitle>
      <ol className="route-width note-grid four-notes">{deliverySteps.map(([time, name, text]) => <li key={time} className="delivery-step" data-route-reveal="delivery-step"><b>{time}</b><h3>{name}</h3><p>{text}</p></li>)}</ol>
    </RouteSection>
    <RouteSection tone="orange" className="delivery-prices"><SectionTitle label="zones & fees">HOW FAR WE GO</SectionTitle>
      <div className="route-width note-grid delivery-zones">{[
        ['pick it up', 'free', 'ready in 20 minutes at any shop', 'no minimum', 'grab a coffee while you wait'],
        ['nearby', '$4', 'within 5km of a pink door', 'free over $40', '2-hour slots, 10am–8pm', 'same day if ordered by 2pm'],
        ['across town', '$7', '5–10km from a shop', 'free over $60', '2-hour slots, 12pm–8pm'],
      ].map(([name, price, description, ...notes], i) => <article key={name} className="route-note" data-route-reveal="zone">{i === 1 && <span className="zone-tag">most orders</span>}<h3>{name}</h3><strong>{price}</strong><p>{description}</p><ul>{notes.map(note => <li key={note}>{note}</li>)}</ul></article>)}</div>
    </RouteSection>
    <RouteSection tone="pink" id="faq" className="delivery-faq">
      <div className="route-width route-split feature-split">
        <div className="article-copy"><SectionTitle label="faq" text="The short answers to the things people ask us most. Tap a question to open it.">GOT QUESTIONS?</SectionTitle><div className="route-note"><h3>still stuck?</h3><p>A real person replies within a day, usually much faster.</p><a className="small-link" href="/contact">contact us →</a></div></div>
        <div className="faq-disclosures" onTransitionEnd={event => { if (event.propertyName === 'block-size') ScrollTrigger.refresh() }}>
          {deliveryFaq.map(([group, entries], i) => <div key={group}><h3>{group}</h3>{entries.map(([question, answer], j) => <details key={question} open={i === 0 && j === 0 ? true : undefined} onToggle={() => ScrollTrigger.refresh(true)}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>)}
        </div>
      </div>
    </RouteSection>
  </>
}

const contactMethods = [
  ['email us', 'hello@dunkly.co', 'usually back within 24 hours', 'mailto:hello@dunkly.co'],
  ['call the shop', '+1 (555) 010-2019', '7am–6pm, when the fryer’s on', 'tel:+15550102019'],
  ['big orders', 'orders@dunkly.co', '48h notice for 50+ donuts', 'mailto:orders@dunkly.co'],
]

export function Contact() {
  const [draft, setDraft] = useState('')
  const topics = ['just saying hi', 'a big order or party', 'wholesale & cafés', 'a flavour idea', 'press & collabs']
  function prepareMessage(event) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const subject = encodeURIComponent(values.get('topic'))
    const signUpNote = values.has('newsletter') ? '\n\nI’d also like to hear from the Dunk Club.' : ''
    const body = encodeURIComponent(`${values.get('message')}\n\n${values.get('name')}\n${values.get('email')}${signUpNote}`)
    setDraft(`mailto:hello@dunkly.co?subject=${subject}&body=${body}`)
  }

  return <>
    <RouteHero title="SAY HELLO!" label="we reply within a day" text="Questions, big orders, a flavour idea or a donut you can’t stop thinking about. We read every single one." art={['triple', 'berry']} className="contact-hero" />
    <RouteSection className="contact-main">
      <div className="route-width contact-layout">
        <form className="contact-form" aria-labelledby="contact-form-heading" onSubmit={prepareMessage} onInput={() => setDraft('')} data-route-reveal="form">
          <RouteSeal>we read<br />everything</RouteSeal>
          <h2 id="contact-form-heading">DROP US A LINE</h2><p>Tell us what’s on your mind. Real humans (and their sticky fingers) reply.</p>
          <div className="contact-fields">
            <label className="shop-field">your name <span aria-hidden="true">*</span><input name="name" placeholder="Homer S." autoComplete="name" required maxLength="100" /></label>
            <label className="shop-field">email <span aria-hidden="true">*</span><input type="email" name="email" placeholder="you@email.com" autoComplete="email" required maxLength="254" /></label>
            <label className="shop-field contact-wide">what’s it about?<select name="topic">{topics.map(topic => <option key={topic}>{topic}</option>)}</select></label>
            <label className="shop-field contact-wide">message <span aria-hidden="true">*</span><textarea name="message" placeholder="Tell us everything. Sprinkles optional." rows="5" required maxLength="1800" /></label>
            <label className="dunk-club-check contact-wide"><input type="checkbox" name="newsletter" />add me to the dunk club (first dibs on new flavours)</label>
          </div>
          <ArrowButton type="submit">prepare message</ArrowButton>
          <div className="contact-draft" role="status">{draft && <><p>Your draft is ready. Open it in your email app to review and send.</p><a className="text-link" href={draft}>open email draft →</a></>}</div>
        </form>
        <div className="contact-cards">{contactMethods.map(([label, name, text, href]) => <article className="route-note" key={label} data-route-reveal="contact-info"><span className="category">{label}</span><h3><a href={href}>{name}</a></h3><p>{text}</p></article>)}
          <div className="contact-socials"><p>or slide into our DMs</p>{['instagram', 'tiktok', 'pinterest'].map(name => <a className="filter-pill" href={`https://${name}.com/`} key={name}>{name}</a>)}</div>
        </div>
      </div>
    </RouteSection>
    <RouteSection tone="orange" className="quick-answers"><SectionTitle label="quick answers">BEFORE YOU ASK</SectionTitle>
      <div className="route-width note-grid">{[
        ['how fresh is fresh?', 'Baked from 5am, dunked by 7. Anything left at close goes to the shelter down the road.'],
        ['any allergy info?', 'Every donut page lists its allergens. Our kitchen handles nuts, so we can’t promise nut-free.'],
        ['where do you deliver?', 'Anywhere within 10km of a shop. Order by 2pm and it lands warm the same day.'],
      ].map(([name, text]) => <article className="route-note" key={name} data-route-reveal="quick-answer"><b>?</b><h3>{name}</h3><p>{text}</p></article>)}</div>
    </RouteSection>
  </>
}

const legalCopy = {
  privacy: {
    title: 'PRIVACY POLICY', text: 'We only collect what we need to get warm donuts to your door, and we never sell it. Here’s the full story.',
    summary: ['We collect your contact and delivery details to fulfil your order.', 'Card details are handled by the payment provider.', 'We never sell your data. You can ask us to delete it.'],
    sections: [
      ['collect', 'what we collect', 'When you order, sign up for the Dunk Club or contact us, we receive the details you share. This can include your contact information, delivery notes, order history and messages.'],
      ['use', 'how we use it', 'We use your details to fulfil and deliver orders, text you when your rider is near, and respond if something goes wrong.', 'Dunk Club subscribers receive occasional emails and can unsubscribe at any time.'],
      ['cookies', 'cookies', 'Essential storage keeps your cart working. With permission, analytics can help us understand how visitors use the site.'],
      ['sharing', 'who we share it with', 'Riders receive the details needed to deliver your order. Payment providers handle card information and the email service sends updates you’ve opted into.'],
      ['keeping', 'how long we keep it', 'Order records are kept for six years. Account and newsletter details stay until the account is deleted or you unsubscribe.'],
      ['rights', 'your rights', 'You can ask to access, correct, export or delete the details we hold. Email privacy@dunkly.co to make a request.'],
    ],
    question: 'questions about your data?', reply: 'Write to privacy@dunkly.co or use the contact page. A real person will answer.',
  },
  terms: {
    title: 'TERMS OF SERVICE', text: 'The ground rules for ordering, delivery and refunds. Written in plain words, because nobody likes small print.',
    summary: ['Order by 2pm for same-day delivery inside our zones.', 'Cancel up to 2 hours before your slot for a full refund.', 'Tell us within 24 hours if something isn’t right.'],
    sections: [
      ['ordering', 'ordering', 'Prices are in US dollars and include tax. Orders are accepted when we email a confirmation.', 'We bake in small batches. If a flavour sells out, we’ll swap it for a similar one or refund the item.'],
      ['delivery', 'delivery', 'Same-day orders must be placed by 2pm and be within 10km of a shop. Delivery slots are estimates. Your rider will text if they’re running late.'],
      ['refunds', 'cancellations & refunds', 'Cancel up to two hours before your slot for a full refund. If a fresh order arrives wrong or damaged, send us a photo within 24 hours so we can replace or refund it.'],
      ['allergens', 'allergens', 'Each product page lists allergens. Our kitchen handles nuts, dairy, eggs and gluten. Check before you order.'],
      ['gift-cards', 'gift cards & promos', 'Gift cards are valid for two years. Use one promo code per order. Promo codes don’t apply to gift cards.'],
      ['the-rest', 'the boring bit', 'Dunkly’s photos, recipes and branding belong to Dunkly. Changes to these terms are posted on this page.'],
    ],
    question: 'something unclear?', reply: 'Ask us anything about these terms. We’re happy to explain in even plainer words.',
  },
}

export function Legal({ type }) {
  const { title, text, summary, sections, question, reply } = legalCopy[type]
  return <>
    <RouteHero title={title} text={text} className="legal-hero" label={<span className="legal-tabs">{['privacy', 'terms'].map(tab => <a key={tab} href={`/${tab}`} aria-current={tab === type ? 'page' : undefined}>{tab}</a>)}</span>}>
      <small>last updated · 1 october 2026</small>
    </RouteHero>
    <RouteSection className="legal-body">
      <div className="route-width legal-layout">
        <nav aria-label="On this page" className="legal-toc"><h2>on this page</h2>{sections.map(([id, name], i) => <a key={id} href={`#${id}`}><span>0{i + 1}</span>{name}</a>)}</nav>
        <div className="legal-entries">
          <article className="route-note" data-route-reveal><h2>the short version</h2><ul>{summary.map(line => <li key={line}>{line}</li>)}</ul></article>
          {sections.map(([id, name, ...paragraphs], i) => <article id={id} key={id} data-route-reveal><span className="rule-number">0{i + 1}</span><div><h2>{name}</h2>{paragraphs.map(p => <p key={p}>{p}</p>)}</div></article>)}
          <article className="route-note" data-route-reveal><h2>{question}</h2><p>{reply}</p><a className="text-link" href="/contact">get in touch →</a></article>
        </div>
      </div>
    </RouteSection>
  </>
}
