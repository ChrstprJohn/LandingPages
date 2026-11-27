import { useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'
import { boxes, catalog, extras, money } from './content.js'
import { boxKey } from './cart.js'
import { ArrowButton, ArrowLink, Display, Donut, Quantity, RouteHero, RouteSection, SectionTitle } from './ui.jsx'

const productLink = item => `/shop/${item.slug}`
gsap.registerPlugin(Flip)

function ProductCard({ item, add, recentlyAdded }) {
  return (
    <article className={`product-card tone-${item.tone}`} data-flip-id={item.id}>
      <a className="product-card-link" href={productLink(item)} aria-label={`View ${item.name}`}>
        <div className="product-card-media"><Donut kind={item.id} alt={item.alt} /></div>
        {item.badge && <span className="eyebrow product-badge">{item.badge}</span>}
        <span className="category">{item.category}</span>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </a>
      <div className="product-card-bottom">
        <strong>{money(item.price)}</strong>
        <button type="button" className="product-card-add" aria-label={`Add ${item.name} to your box`} onClick={() => add(item.id)}>{recentlyAdded === item.id ? 'added ✓' : 'add +'}</button>
      </div>
    </article>
  )
}

export function Shop({ add, recentlyAdded }) {
  const [filter, setFilter] = useState('all donuts')
  const grid = useRef(null)
  const beforeFilter = useRef(null)
  const filters = ['all donuts', 'classic', 'nutty', 'fruity', 'limited']
  const visible = filter === 'all donuts' ? catalog : catalog.filter(item => item.category === filter)

  useGSAP(() => {
    const state = beforeFilter.current
    if (!state) return
    beforeFilter.current = null
    Flip.from(state, { targets: grid.current.children, duration: 0.58, ease: 'back.out(0.8)', prune: true })
  }, { scope: grid, dependencies: [filter] })

  function chooseFilter(name) {
    if (filter === name) return
    if (matchMedia('(prefers-reduced-motion: no-preference)').matches) beforeFilter.current = Flip.getState(grid.current.children)
    setFilter(name)
  }

  return <>
    <RouteHero title="THE SHOP" label="baked this morning" text="Eight ways to get dunked. Pick a favourite, mix a box, or try them all." art={['triple', 'orange']} className="shop-hero" />
    <RouteSection className="shop-grid-section">
      <div className="route-width">
        <search className="catalog-filters" aria-label="Filter donuts">{filters.map(name => <button type="button" key={name} className="filter-pill" aria-pressed={filter === name} onClick={() => chooseFilter(name)}>{name}</button>)}</search>
        <span className="sr-only" role="status">{visible.length} donuts</span>
        <div className="catalog-grid" data-single={visible.length === 1} ref={grid}>{visible.map(item => <ProductCard item={item} key={item.id} add={add} recentlyAdded={recentlyAdded} />)}</div>
      </div>
    </RouteSection>
    <RouteSection tone="orange" className="route-end-cta shop-builder-cta">
      <SectionTitle text="Build a box of six, twelve or twenty-four and mix any flavours you like.">CAN’T DECIDE?</SectionTitle>
      <ArrowLink href="/build-a-box">build your box</ArrowLink>
    </RouteSection>
  </>
}

export function ProductPage({ item, add, recentlyAdded }) {
  const [amount, setAmount] = useState(1)
  const related = catalog.filter(other => other.id !== item.id).slice(0, 3)

  return <>
    <section className="product-hero route-width">
      <div className="product-stage">
        <div className="product-circle" aria-hidden="true" />
        <div className="product-donut-float"><Donut className="product-donut" kind={item.id} alt={item.alt} eager /></div>
        {item.badge && <div className="product-sticker sticker"><strong>{item.badge}</strong></div>}
        <span className="sparkle product-sparkle-left" aria-hidden="true">✦</span><span className="sparkle product-sparkle-right" aria-hidden="true">✦</span>
      </div>
      <div className="product-info">
        <p className="product-breadcrumb"><a href="/shop">shop</a><span aria-hidden="true">/</span><span className="category">{item.category}</span></p>
        <Display as="h1" className="route-title">{item.name}</Display>
        <p className="route-intro-copy">{item.description}</p>
        <div className="product-price"><strong>{money(item.price)}</strong><span>each · baked this morning</span></div>
        <div className="product-actions">
          <Quantity amount={amount} onLess={() => setAmount(amount - 1)} onMore={() => setAmount(amount + 1)} canRemove={amount > 1} lessLabel="Fewer" moreLabel="More" />
          <ArrowButton aria-label={`Add ${item.name} to your box`} onClick={() => add(item.id, amount)}>{recentlyAdded === item.id ? 'added ✓' : 'add to box'}</ArrowButton>
        </div>
        <div className="product-perks">{['baked at 5am', 'dunked twice', 'delivered warm'].map(text => <span key={text}>✦ {text}</span>)}</div>
      </div>
    </section>
    <RouteSection className="product-details">
      <div className="route-width route-split">
        <div data-route-reveal><SectionTitle label="the story">WHY WE LOVE IT</SectionTitle><p>{item.story}</p></div>
        <ul className="product-facts">
          {[['what’s inside', item.ingredients], ['allergens', item.allergens], ['keep it fresh', 'Best on day one, still great on day two. Keep cool, never in the fridge.']].map(([name, text]) => <li key={name} data-route-reveal><h3>{name}</h3><p>{text}</p></li>)}
        </ul>
      </div>
    </RouteSection>
    <section className="route-section related-section tone-cream">
      <div className="route-width">
        <div className="related-heading"><SectionTitle>YOU MIGHT ALSO LIKE</SectionTitle><ArrowLink href="/shop">see all donuts</ArrowLink></div>
        <div className="catalog-grid">{related.map(other => <ProductCard key={other.id} item={other} add={add} recentlyAdded={recentlyAdded} />)}</div>
      </div>
    </section>
  </>
}

export function BoxBuilder({ addBundle }) {
  const requestedSize = new URLSearchParams(location.search).get('size')
  const [box, setBox] = useState(() => boxes.find(item => item.id === requestedSize) || boxes[0])
  const [selection, setSelection] = useState({})
  const tray = useRef(null)
  const beforeSize = useRef(null)
  const count = Object.values(selection).reduce((sum, qty) => sum + qty, 0)
  const remaining = box.count - count
  const trayAngles = [-30, 7, -16, 21, -2, -25, 12, -11, 26, 3, -20, 17]

  useGSAP(() => {
    if (!beforeSize.current) return
    const state = beforeSize.current
    beforeSize.current = null
    Flip.from(state, {
      targets: [tray.current, ...tray.current.querySelectorAll('.size-slot')],
      duration: .55, ease: 'back.out(.75)', nested: true, prune: true,
      onEnter: slots => gsap.from(slots, { scale: .8, opacity: 0, duration: .32, stagger: .016, ease: 'power2.out', clearProps: 'transform,opacity' }),
    })
  }, { scope: tray, dependencies: [box.id] })

  function chooseSize(item) {
    if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      beforeSize.current = Flip.getState([tray.current, ...tray.current.querySelectorAll('.size-slot')])
    }
    setBox(item)
    if (count > item.count) setSelection({})
  }

  function change(id, delta) {
    setSelection(current => {
      const currentCount = Object.values(current).reduce((sum, qty) => sum + qty, 0)
      if (delta > 0 && currentCount >= box.count) return current
      return { ...current, [id]: Math.max(0, (current[id] || 0) + delta) }
    })
  }

  return <>
    <RouteHero title="BUILD YOUR BOX" label="pick · pack · dunk" text="Three easy steps between you and a box full of warm, double-dunked donuts." className="builder-hero">
      <ol className="builder-steps">{['pick a size', 'fill it up', 'we deliver warm'].map((name, index) => <li key={name}><b>0{index + 1}</b>{name}</li>)}</ol>
    </RouteHero>
    <RouteSection className="choose-portion" id="pick-a-size">
      <div className="route-width route-split size-panel">
        <div>
          <SectionTitle label="step 01">PICK A SIZE</SectionTitle>
          <fieldset className="size-options"><legend className="sr-only">Box size</legend>{boxes.map(item => <label className="size-option" key={item.id}>
            <input className="sr-only" type="radio" name="box-size" value={item.id} checked={box.id === item.id} onChange={() => chooseSize(item)} />
            <span><strong>{item.name}</strong><small>{item.count} donuts</small></span><b>{money(item.price)}</b>
          </label>)}</fieldset>
          <div className="size-summary">
            <div className="size-price"><strong>{money(box.price)}</strong><span>{box.note}</span></div>
            <a className="small-link" href="#fill-it-up">fill it up ↓</a>
          </div>
        </div>
        <div className="size-art" aria-hidden="true">
          <div className="size-tray" data-box-size={box.id} data-flip-id="tray" ref={tray}>
            <div className="size-box-logo">dcdonut<span>box of {box.count}</span></div>
            <div className="size-slots">{Array.from({ length: box.count }, (_, index) => (
              <div className="size-slot" key={index} data-flip-id={`slot-${index}`} style={{ '--slot-angle': `${trayAngles[index % trayAngles.length]}deg` }}>
                <Donut kind={catalog[index % catalog.length].id} />
              </div>
            ))}</div>
          </div>
        </div>
      </div>
    </RouteSection>
    <section className="route-section fill-section tone-cream" id="fill-it-up">
      <SectionTitle label="step 02" text="Tap + to add a flavour. Mix as many as you like until the box is full.">FILL IT UP</SectionTitle>
      <div className="route-width fill-layout">
        <div className="builder-grid">{catalog.map(item => <article className={`builder-card tone-${item.tone}`} key={item.id}>
          <a href={productLink(item)}><Donut kind={item.id} /><div className="builder-card-meta"><h3>{item.name}</h3><span className="category">{item.category}</span></div></a>
          <Quantity amount={selection[item.id] || 0} onLess={() => change(item.id, -1)} onMore={() => change(item.id, 1)} canRemove={Boolean(selection[item.id])} canAdd={remaining > 0} lessLabel={`Remove ${item.name}`} moreLabel={`Add ${item.name}`} />
        </article>)}</div>
      </div>
      <aside className="route-width builder-meter" aria-label="Box progress">
        <div><h3>{box.name}</h3><p aria-live="polite">{count} of {box.count} picked{remaining ? ` · ${remaining} to go` : ' · ready to add'}</p></div>
        <div><progress value={count} max={box.count} aria-label="Donuts in box" /><div className="picked-flavours">{catalog.filter(item => selection[item.id]).map(item => <span key={item.id}>{item.name} ×{selection[item.id]}</span>)}</div></div>
        <button type="button" className="small-link" disabled={remaining !== 0} onClick={() => { addBundle(boxKey(box, selection)); setSelection({}) }}>{remaining ? `pick ${remaining} more` : `add box · ${money(box.price)} →`}</button>
      </aside>
    </section>
    <RouteSection tone="orange" className="boxed-delivery"><SectionTitle label="step 03">WE DO THE REST</SectionTitle>
      <div className="route-width note-grid">{[
        ['order by 2pm', 'Same-day delivery across the city. Later orders bake first thing tomorrow.'],
        ['packed warm', 'Insulated boxes keep every donut soft and glossy on the way to you.'],
        ['free over $40', 'No delivery fee on any dozen or party box. Small boxes ship for $4.'],
      ].map(([name, text], i) => <article className="route-note" data-route-reveal="box-promise" key={name}><b>0{i + 1}</b><h3>{name}</h3><p>{text}</p></article>)}</div>
    </RouteSection>
  </>
}

export function CartItems({ lines, change, remove }) {
  if (!lines.length) return <div className="cart-empty"><h3>your box is empty</h3><p>No donuts yet. Pick a few favourites or build a box.</p><a className="small-link" href="/shop">pick some donuts →</a></div>

  return <ul className="cart-items">{lines.map(item => (
    <li className="cart-line" key={item.id}>
      {item.alt || item.art ? <Donut kind={item.art || item.id} /> : <span className="item-initial" aria-hidden="true">{item.name[0]}</span>}
      <div><strong>{item.name}</strong><p>{item.price ? money(item.price) : 'free'} · {item.mixDescription || (item.alt ? 'donut' : 'add-on')}</p><button className="text-link" onClick={() => remove(item.id)} type="button" aria-label={`Remove ${item.name}`}>remove</button></div>
      <Quantity amount={item.quantity} onLess={() => change(item.id, -1)} onMore={() => change(item.id, 1)} canAdd={item.id !== 'gift'} lessLabel={`Remove one ${item.name}`} moreLabel={`Add one ${item.name}`} />
    </li>
  ))}</ul>
}

export function CartExtras({ items, change, includeGift = false }) {
  return <div className="cart-extras"><p>pairs well with</p><div className="cart-extra-grid">{extras.filter(item => includeGift || item.id !== 'gift').map(item => <button key={item.id} type="button" aria-label={`Add ${item.name}`} disabled={item.id === 'gift' && items.gift > 0} onClick={() => change(item.id, 1)}><span><strong>{item.name}</strong><small>{item.price ? money(item.price) : 'free'}</small></span><b aria-hidden="true">{items[item.id] ? '✓' : '+'}</b></button>)}</div></div>
}

export function CartPage({ lines, items, count, total, change, remove }) {
  const slots = ['today 4–6pm', 'today 6–8pm', 'tomorrow 10–12']
  const [slot, setSlot] = useState(slots[0])
  const [promoMessage, setPromoMessage] = useState('')
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const delivery = total > 0 && total < 4000 ? 400 : 0

  return <>
    <RouteHero title="YOUR BOX" label={count ? `${count} ${count === 1 ? 'item' : 'items'} in your box` : 'your box is empty'} text="Almost there. Check your order, pick a delivery slot and we’ll start dunking." art={['caramel', 'berry']} className="cart-hero" />
    <RouteSection className="cart-page-main">
      <div className="route-width cart-layout">
        <div>
          <div className="cart-page-heading"><Display>IN YOUR BOX</Display><a className="text-link" href="/shop">keep shopping →</a></div>
          <CartItems lines={lines} change={change} remove={remove} />
          <CartExtras items={items} change={change} includeGift />
          {items.gift > 0 && <label className="shop-field" htmlFor="gift-message">gift note<textarea id="gift-message" name="gift-note" rows="2" maxLength="160" placeholder="A short note for the box" /></label>}
        </div>
        <aside className="cart-summary">
          <h2>order summary</h2>
          <dl><div><dt>subtotal</dt><dd>{money(total)}</dd></div><div><dt>delivery</dt><dd>{delivery ? money(delivery) : 'free'}</dd></div></dl>
          <div className="delivery-meter"><p>{total >= 4000 ? 'you unlocked free delivery!' : 'free delivery on orders over $40'}</p><progress value={Math.min(total, 4000)} max="4000" aria-label="Free delivery progress" /></div>
          <fieldset className="delivery-slots"><legend>delivery slot</legend>{slots.map(value => <label className="filter-pill" key={value}><input type="radio" name="slot" value={value} checked={slot === value} onChange={() => { setSlot(value); setCheckoutMessage('') }} />{value}</label>)}</fieldset>
          <details className="promo-details"><summary>got a promo code?</summary><form aria-label="Apply promo code" onSubmit={e => { e.preventDefault(); setPromoMessage('There are no active promo codes in this preview.') }}><label className="sr-only" htmlFor="promo">Promo code</label><input id="promo" name="promo" placeholder="Promo code" required onInput={() => setPromoMessage('')} /><button className="small-link" type="submit">apply</button></form><p role="status">{promoMessage}</p></details>
          <dl className="summary-total"><div><dt>total</dt><dd>{money(total + delivery)}</dd></div></dl>
          <ArrowButton disabled={!count} onClick={() => setCheckoutMessage(`Selected delivery ${slot}. Payment and order submission are unavailable in this preview.`)}>checkout</ArrowButton>
          <p className="checkout-note" role="status">{checkoutMessage || 'secure checkout · warm same-day delivery'}</p>
        </aside>
      </div>
    </RouteSection>
  </>
}
