import {useRef,useState,useEffect,Fragment} from 'react'
import {createRoot} from 'react-dom/client'
import {flushSync} from 'react-dom'
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import './styles.css'
gsap.registerPlugin(useGSAP,ScrollTrigger)
const titles=['In the Garden','Mr & Mrs','Ascent Beauty','Black and White','Glamore Scents','The Waters']
const slugs=['in-the-garden','mr-mrs','ascent-beauty','black-and-white','glamore-scents','the-waters']
const groups=['garden','wedding','beauty','mono','scents','waters']
const counts=[6,5,6,6,6,6]
const clients=['Private Client','Mr and Mrs Galo','Ascent Beauty','Studio Project','Trade Kings','Bernad Mayers']
const years=['2024','2024','2026','2023','2025','2026']
const places=['San Francisco','California','Miami, Florida','New York','Dubai','Cape Town']
const descriptions=[
'A quiet portrait series captured in natural garden light, focusing on texture, color, and candid moments. The shoot explores the relationship between subject and environment, using soft shadows and organic compositions to create an intimate, timeless feel.',
'An intimate wedding story capturing quiet moments, genuine emotion, and timeless details. The focus is on connection rather than poses—documenting the day as it naturally unfolded with an elegant, understated approach.',
'A beauty-focused studio shoot highlighting makeup artistry, skin texture, and refined details. Controlled lighting and close compositions were used to emphasize precision, tone, and elegance—creating polished visuals for a modern beauty brand.',
'A monochrome series focused on form, contrast, and emotion. By removing color, the images highlight raw expression, light, and shadow—creating bold, timeless photographs with a strong visual presence.',
'A product-focused shoot designed to showcase the brand’s fragrance line with a clean, luxurious feel. The images emphasize texture, reflections, and detail—balancing elegance and simplicity to create strong visual appeal for digital and print use.',
'A poolside photoshoot capturing movement, reflections, and the calm energy of water. The series plays with light on the surface, fluid motion, and relaxed moments—creating a fresh, modern visual story with a clean summer tone.']
const services=['Wedding Photography','Event Photography','Portrait Photography','Product Photography']
const serviceText=['Capturing genuine moments, emotions, and details to tell the full story of your day in a timeless and elegant way.','Documentary-style coverage capturing key moments, atmosphere, and energy as events naturally unfold.','Personal and professional portraits focused on expression, light, and authenticity—crafted to feel natural and refined.','High-quality product visuals highlighting form, texture, and detail—perfect for e-commerce, campaigns, and social media.']
const nav=[['Works','/'],['About','/about'],['Services','/services'],['Contact','/contact']]

const image=(group,index)=>`/images/${group}-${index}.jpg`
function Title({children,as:Tag='h1',className=''}){
  return <Tag className={`animated-title ${className}`} aria-label={children}>{children.split(' ').map((word,i)=><Fragment key={i}><span className="word" aria-hidden="true">{[...word].map((c,j)=><span className="letter" key={j}>{c}</span>)}{'\u00a0'}</span>{((children==='Photography for Modern Stories'&&i===1)||(children==='We Dont just Capture Pictures'&&i===2))&&<br className="desktop-break"/>}</Fragment>)}</Tag>
}
function Footer(){
  const root=useRef()
  const {contextSafe}=useGSAP({scope:root})
  const animate=contextSafe(active=>{
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.to(root.current.querySelectorAll('.cta-line'),{scale:active?.9:1,duration:reduced?0:.45,ease:'power2.out',overwrite:true})
    gsap.to(root.current.querySelector('.aperture'),{rotation:active?180:0,duration:reduced?0:.55,ease:'power2.out',overwrite:true})
  })
  return <footer ref={root}>
    <div className="footer-links">{nav.map(([n,h])=><a href={h} key={n}><span>{n}</span></a>)}</div>
    <div className="footer-links">{['Instagram','Tiktok','Pinterest'].map(n=><a href={`https://www.${n.toLowerCase()}.com/`} target="_blank" rel="noreferrer" key={n}><span>{n}</span></a>)}</div>
    <a href="/contact" className="footer-cta" onMouseEnter={()=>animate(true)} onMouseLeave={()=>animate(false)} onFocus={()=>animate(true)} onBlur={()=>animate(false)}>
      <span className="cta-line">Let's Capture</span><span className="cta-bottom"><span className="cta-line">your Story</span><img className="aperture" src="/images/shutter.png" alt="" width="48" height="48"/></span>
    </a>
  </footer>
}
function Reel(){
  const root=useRef(),track=useRef(),motion=useRef(),drag=useRef(null)
  useGSAP(()=>{
    const mm=gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      motion.current=gsap.to(track.current,{xPercent:-50,duration:38.4,repeat:-1,ease:'none'})
      const visibility=()=>document.hidden?motion.current.pause():motion.current.resume()
      document.addEventListener('visibilitychange',visibility)
      return()=>document.removeEventListener('visibilitychange',visibility)
    })
    return()=>mm.revert()
  },{scope:root})
  const {contextSafe}=useGSAP({scope:root})
  const hover=contextSafe((element,active)=>gsap.to(element.querySelector('.card-content'),{scale:active?.9:1,duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:.5,ease:'power2.out',overwrite:true}))
  return <section ref={root} className="reel" aria-label="Selected photography projects"
    onPointerDown={e=>{if(e.target.closest('button'))return;drag.current={x:e.clientX,time:motion.current?.totalTime()||0,moved:false};motion.current?.pause()}}
    onPointerMove={e=>{if(!drag.current)return;const delta=e.clientX-drag.current.x;if(Math.abs(delta)>5)drag.current.moved=true;const speed=track.current.scrollWidth/2/38.4;motion.current?.totalTime(Math.max(0,drag.current.time-delta/speed))}}
    onPointerUp={()=>{motion.current?.resume()}}
    onPointerCancel={()=>{drag.current=null;motion.current?.resume()}}
    onPointerLeave={()=>{drag.current=null;motion.current?.resume()}}
    onClickCapture={e=>{if(drag.current?.moved){e.preventDefault();e.stopPropagation()}drag.current=null}}>
    <div className="reel-track" ref={track}>{[0,1].map(copy=><div className="reel-set" key={copy} aria-hidden={!!copy}>{titles.map((title,i)=><a key={title} className="photo-card" href={`/works/${slugs[i]}`} tabIndex={copy?-1:0} draggable="false" onMouseEnter={e=>hover(e.currentTarget,true)} onMouseLeave={e=>hover(e.currentTarget,false)} onFocus={e=>{motion.current?.pause();hover(e.currentTarget,true)}} onBlur={e=>{motion.current?.resume();hover(e.currentTarget,false)}}><div className="card-content"><div className="photo-window"><img src={image('covers',i)} alt="" draggable="false" fetchPriority={!copy&&i===0?'high':copy?'low':undefined}/></div><span>{title}</span></div></a>)}</div>)}</div>
  </section>
}
function Contact(){
  const [status,setStatus]=useState('')
  return <><section className="intro split-intro"><Title>Your Story Starts Here</Title><p>Have a project in mind or a question? Reach out and let’s bring your vision to life—our team is ready to collaborate and create something exceptional.</p></section>
    <section className="contact-layout frame"><aside><h3>Email</h3><p>Booking details coming soon.</p><h3>Phone</h3><p>Available when booking opens.</p><h3>Address</h3><p>Studio location to be announced.</p></aside>
    <form onSubmit={e=>{e.preventDefault();setStatus('This is a portfolio preview. Your message has not been sent.')}}>
      {[['Name','Your name','text'],['Email','Email Address','email'],['Phone','Phone number','tel'],['Budget','Budget','text']].map(([name,placeholder,type])=><label key={name}>{name}<input name={name} placeholder={placeholder} type={type} required={name==='Name'||name==='Email'} autoComplete={name==='Name'?'name':name==='Email'?'email':name==='Phone'?'tel':'off'}/></label>)}
      <label>Service<select name="service" defaultValue=""><option value="" disabled>Select…</option>{services.map(s=><option key={s}>{s}</option>)}</select></label>
      <label>Message<textarea name="message" placeholder="Message" required/></label><button type="submit">Send Message</button>{status&&<p role="status">{status}</p>}
    </form></section></>
}
function About(){return <>
  <section className="intro about-intro"><Title>We Dont just Capture Pictures</Title></section>
  <section className="about-hero"><img src={image('about',0)} alt="Portrait among garden flowers" fetchPriority="high"/><Title as="h2">We Preserve Memories</Title></section>
  <section className="about-story frame"><Title as="h3">We’re a studio shaped by light, detail, and story—focused on creating photography that feels intentional and refined.</Title><div className="story-content"><div className="story-text"><p>Decode Studio is a modern photography studio committed to producing high-quality, professional imagery. We combine technical precision with a refined creative approach, ensuring every shot is sharp, consistent, and thoughtfully composed. Our focus is on delivering visuals that feel polished and purposeful, whether for brands, individuals, or commercial projects.</p><p>From concept development to final retouching, we handle every stage of the process with care and clarity. Our goal is to make each project smooth, collaborative, and results-driven. Whether you’re looking for portraits, product shots, editorial work, or full commercial campaigns, Decode Studio is built to bring your ideas to life with confidence and professionalism.</p></div><img src={image('about',1)} alt="Editorial beauty portrait" loading="lazy"/></div></section>
  <section className="team-section frame"><div className="section-heading"><Title as="h2">Our Team</Title><p>Our team brings a mix of creativity and technical skill, working together to deliver clean, professional visuals for every project.</p></div>
    <div className="team">{['Ariana Bergh','Jason Miller','Olivia Hart','Marcus Reed','Lauren Brooks','Ethan Cole'].map((name,i)=><article className="team-card" key={name}><div className="team-image"><img src={image('about',i+2)} alt="Illustrative studio portrait" loading="lazy"/></div><h3>{name}</h3><p>{['Photographer','Studio & Lighting Assistant','Creative Director','Photographer','Photo & Video Editor','Art Director'][i]}</p></article>)}</div><p className="portfolio-note">Illustrative team profiles for this studio concept.</p>
  </section></>}
function BookLink(){return <a className="book" href="/contact"><span className="book-content"><svg viewBox="0 0 28 22" aria-hidden="true"><path d="M4 1v13h17m-6-6 7 6-7 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>Book Now</span><span className="book-rule"/></a>}
function Services(){return <>
  <section className="intro split-intro"><Title>What We Bring to the Frame</Title><p>We create striking images for every project, blending creativity and precision in every shot.</p></section>
  <img className="services-hero" src={image('services',0)} alt="Fashion studio portrait" fetchPriority="high"/>
  <section className="services frame">{services.map((service,i)=><article key={service}><h2>{service}</h2><div className="service-description"><p>{serviceText[i]}</p><p>Starting from ${i<2?'20,000':'1,500'}.</p><BookLink/></div><div className="service-media">{i%2===1&&<img className="secondary-service-image" src={image('services',i===1?5:6)} alt="" loading="lazy"/>}<img src={image('services',i+1)} alt={service} loading="lazy"/></div></article>)}</section></>}
function Project({index:i}){
  const drag=useRef(null)
  return <><section className="project-intro frame"><Title>{titles[i]}</Title><div className="project-info"><dl>{[['Client',clients[i]],['Year',years[i]],['Location',places[i]]].map(([key,value])=><div key={key}><dt>{key}:</dt><dd>{value}</dd></div>)}</dl><p>{descriptions[i]}</p></div></section>
    <div className={`project-gallery ${groups[i]==='mono'?'monochrome':''}`} tabIndex="0" role="region" aria-label={`${titles[i]} photo gallery, scroll horizontally`}
      onPointerDown={e=>{if(e.pointerType!=='mouse')return;drag.current={x:e.clientX,left:e.currentTarget.scrollLeft};e.currentTarget.setPointerCapture(e.pointerId)}}
      onPointerMove={e=>{if(drag.current)e.currentTarget.scrollLeft=drag.current.left+drag.current.x-e.clientX}}
      onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}>
      {Array.from({length:counts[i]},(_,j)=><img key={j} src={image(groups[i],j)} alt={`${titles[i]} — photograph ${j+1}`} loading={j<3?'eager':'lazy'} fetchPriority={j===0?'high':undefined} draggable="false"/>)}
    </div><nav className="project-paging frame" aria-label="Other projects">{i>0?<a href={`/works/${slugs[i-1]}`}>&lt;Previous</a>:<span/>}{i<5&&<a href={`/works/${slugs[i+1]}`}>Next&gt;</a>}</nav></>
}
function App(){
  const root=useRef(),menu=useRef(),toggle=useRef(),transition=useRef(),snapshot=useRef(),scrollReset=useRef(),menuMotion=useRef()
  const [open,setOpen]=useState(false)
  const [menuVisible,setMenuVisible]=useState(false)
  const [path,setPath]=useState(()=>location.pathname.replace(/\/$/,'')||'/')
  const project=slugs.indexOf(path.split('/')[2])
  function changePage(url,push=true){
    clearTimeout(scrollReset.current)
    transition.current?.kill()
    snapshot.current?.remove()
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches
    if(!reduced){
      const old=root.current.cloneNode(true)
      old.setAttribute('aria-hidden','true')
      old.inert=true
      Object.assign(old.style,{position:'fixed',top:`${-scrollY}px`,left:'0',width:`${document.documentElement.clientWidth}px`,pointerEvents:'none',zIndex:'100',background:'#fff'})
      document.body.appendChild(old)
      snapshot.current=old
      transition.current=gsap.to(old,{autoAlpha:0,duration:.45,ease:'power1.out',onComplete:()=>{old.remove();if(snapshot.current===old)snapshot.current=null}})
    }
    if(push)history.pushState({},'',url.pathname+url.search+url.hash)
    flushSync(()=>{setOpen(false);setPath(url.pathname.replace(/\/$/,'')||'/')})
    window.scrollTo({top:0,left:0,behavior:'instant'})
    if(!push)scrollReset.current=setTimeout(()=>window.scrollTo({top:0,left:0,behavior:'instant'}),0)
  }
  function navigate(event){
    const link=event.target.closest('a[href]')
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank'||link.hasAttribute('download'))return
    const url=new URL(link.href)
    if(url.origin!==location.origin||url.pathname===location.pathname)return
    event.preventDefault()
    changePage(url)
  }
  useEffect(()=>{const previous=history.scrollRestoration;history.scrollRestoration='manual';const back=()=>changePage(new URL(location.href),false);addEventListener('popstate',back);return()=>{history.scrollRestoration=previous;removeEventListener('popstate',back)}},[])
  useEffect(()=>{if(!menuVisible)return;const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';const escape=event=>{if(event.key==='Escape'){setOpen(false);toggle.current.focus()}if(event.key==='Tab'){const controls=[...root.current.querySelector('header').querySelectorAll('a,button')].filter(element=>element.getClientRects().length);const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}};addEventListener('keydown',escape);return()=>{document.body.style.overflow=previousOverflow;removeEventListener('keydown',escape)}},[menuVisible])
  useEffect(()=>()=>{transition.current?.kill();snapshot.current?.remove();clearTimeout(scrollReset.current)},[])
  useEffect(()=>{document.title=`${project>=0?titles[project]:path==='/'?'Photography for Modern Stories':path.slice(1).replace(/^./,c=>c.toUpperCase())} — Decode Studio`},[path,project])
  useGSAP(()=>{
    const mm=gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      root.current.querySelectorAll('.animated-title').forEach(title=>gsap.from(title.querySelectorAll('.letter'),{opacity:0,y:10,filter:'blur(10px)',duration:.85,stagger:.05,ease:'expo.out',scrollTrigger:{trigger:title,start:'top 95%',once:true}}))
    })
    document.fonts.ready.then(()=>ScrollTrigger.refresh())
    return()=>mm.revert()
  },{scope:root,dependencies:[path],revertOnUpdate:true})
  useGSAP(()=>{
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches
    menuMotion.current=gsap.timeline({paused:true,onReverseComplete:()=>setMenuVisible(false)})
      .fromTo(menu.current,{opacity:0},{opacity:1,duration:reduced?0:.3,ease:'power2.out'})
      .fromTo(menu.current.querySelectorAll('.menu-link,.menu-socials'),{opacity:0,y:20},{opacity:1,y:0,stagger:reduced?0:.07,duration:reduced?0:.4,ease:'power2.out'},0)
  },{scope:menu})
  useEffect(()=>{if(open)menuMotion.current?.play();else if(matchMedia('(prefers-reduced-motion: reduce)').matches)setMenuVisible(false);else menuMotion.current?.reverse()},[open])
  return <div ref={root} onClick={navigate}><header className={menuVisible?'menu-open':''}><a className="wordmark" href="/" aria-label="Decode Studio"><img src="/images/shutter.png" alt="" width="32" height="32"/><span className="brand-lines" aria-hidden="true">{["DECODE","STUDIO"].map(word=><span className="brand-line" key={word}>{[...word].map((letter,i)=><span key={i}>{letter}</span>)}</span>)}</span></a><nav className="desktop-nav" aria-label="Main navigation">{nav.map(([name,href])=><a href={href} aria-current={path===href?'page':undefined} key={name}><span>{name}</span></a>)}</nav><button ref={toggle} className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-controls="mobile-navigation" aria-expanded={open} onClick={()=>{if(!open)setMenuVisible(true);setOpen(!open)}}><span/><span/></button><nav ref={menu} id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation" hidden={!menuVisible}><div className="menu-main-links">{nav.map(([name,href])=><a className="menu-link" href={href} key={name}>{name}</a>)}</div><div className="menu-socials">{["Instagram","Tiktok","Pinterest"].map(name=><a href={`https://www.${name.toLowerCase()}.com/`} key={name} target="_blank" rel="noreferrer">{name}</a>)}</div></nav></header>
    <main key={path}>{path==='/'?<><section className="intro home-intro"><Title>Photography for Modern Stories</Title><p>We deliver clean, high-quality studio photography with professional lighting, sharp detail, and a refined look for brands, portraits, and commercial projects.</p></section><Reel/></>:path==='/about'?<About/>:path==='/services'?<Services/>:path==='/contact'?<Contact/>:project>=0?<Project index={project}/>:<section className="intro"><Title>Page not found</Title><a href="/">Back to works</a></section>}</main><Footer/></div>
}
createRoot(document.getElementById('root')).render(<App/> )
