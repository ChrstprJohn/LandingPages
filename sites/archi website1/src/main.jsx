import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import './styles.css'
gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase, ScrollToPlugin)
const referenceEase = CustomEase.create('reference', 'M0,0 C0.5,0.5 0,1 1,1')
const carouselEase = CustomEase.create('carousel', '0.5,0,0,1', { precision: 2 })
const projects = [
 {slug:'terracotta-apartment',name:'Terracotta Apartment',carouselName:'Archi Apartment',category:'Interiors',image:'terracotta-apartment',area:'112',rooms:'4',materials:'Oak, red travertine, linen',description:'A warm apartment composed around a red travertine island and a circular dining table. Natural oak, soft plaster and filtered daylight give everyday rituals a quiet setting.'},
 {slug:'courtyard-house',name:'Courtyard House',category:'Architecture',image:'courtyard-house',area:'185',rooms:'5',materials:'Concrete, lime plaster, steel',description:'A low courtyard house organised around an olive tree. Deep openings draw the landscape inside, while mineral walls and a terracotta door create a simple, grounded material palette.'},
 {slug:'forest-retreat',name:'Forest Retreat',category:'Interiors',image:'forest-retreat',area:'86',rooms:'3',materials:'Stained timber, stone, wool',description:'A retreat shaped around the view into the forest. Dark timber, a tactile stone floor and low furniture bring warmth to a generous room with a single, expansive window.'},
 {slug:'meadow-cabin',name:'Meadow Cabin',category:'Architecture',image:'meadow-cabin',area:'72',rooms:'3',materials:'Oak, standing seam metal, glass',description:'A narrow timber cabin set at the edge of a meadow. A simple gable roof, generous front window and small deck connect a compact interior to its landscape.'},
 {slug:'atelier-office',name:'Atelier Office',category:'Design',image:'atelier-office',area:'94',rooms:'4',materials:'Travertine, plaster, stainless steel',description:'A compact creative workplace with a sculptural reception desk and curved plaster walls. Shared surfaces, honest materials and soft light balance focus with conversation.'},
{"slug": "plaster-loft", "name": "Plaster Loft", "category": "Interiors", "area": "148", "rooms": "5", "materials": "Plaster, oak, limestone", "description": "A generous living space softened by curved plaster walls, low furniture and long views toward the light.","image":"plaster-loft"},
{"slug": "stone-bath", "name": "Stone Bath", "category": "Interiors", "area": "24", "rooms": "1", "materials": "Limestone, travertine, oak", "description": "A tactile bathroom study with a sculptural stone bathtub, soft daylight and a restrained material palette.","image":"stone-bath"},
{"slug": "coastal-pavilion", "name": "Coastal Pavilion", "category": "Architecture", "area": "164", "rooms": "4", "materials": "Concrete, lime plaster, timber", "description": "A low pavilion composed of mineral volumes and generous glazing, opening onto the quiet landscape of the dunes.","image":"coastal-pavilion"},
{"slug": "garden-townhouse", "name": "Garden Townhouse", "category": "Architecture", "area": "138", "rooms": "5", "materials": "Brick, steel, terracotta", "description": "A compact urban home arranged around light, a modest garden and a simple rhythm of openings.","image":"garden-townhouse"},
{"slug": "arc-chair", "name": "Arc Chair", "category": "Design", "area": "—", "rooms": "—", "materials": "Oak plywood, wool", "description": "A lounge chair shaped from curved oak plywood and a generous upholstered seat. An exploration of a continuous line and everyday comfort.","image":"arc-chair"},
{"slug": "fold-pendant", "name": "Fold Pendant", "category": "Design", "area": "—", "rooms": "—", "materials": "Paper, steel, light", "description": "A folded paper shade that turns a simple sheet into a soft, sculptural source of light.","image":"fold-pendant"},
{"slug": "plinth-table", "name": "Plinth Table", "category": "Design", "area": "—", "rooms": "—", "materials": "Red travertine, dark oak", "description": "A side table balancing a substantial stone base with a thin circular timber surface. Two materials, one clear form.","image":"plinth-table"}
]
const featured=[projects[0],projects[1],projects[2],projects[4]]
const drawing=p=>'/images/'+(p.slug==='courtyard-house'?'courtyard':p.slug)+'-axon.png'
const image=(p)=>`/images/${p.image}.jpg`
const path=window.location.pathname.replace(/\/$/,'')||'/'
const project=projects.find(p=>path===`/projects/${p.slug}`)
const home=path==='/',listing=path==='/projects',about=path==='/about',contact=path==='/contact'
const fullMasthead=home||contact
const nav=[['Home','/'],['Projects','/projects'],['About studio','/about'],['Contact','/contact']]
function Logo(){return <svg viewBox="0 0 1856 503" role="img" aria-label="arch"><g fill="currentColor">
<path fillRule="evenodd" d="M250 0C105 0 0 108 0 251.5S105 503 250 503C321 503 371 475 390 435V490H500V13H390V70C364 30 315 0 250 0ZM250 106C170 106 110 168 110 251.5S170 397 250 397S395 335 395 251.5S330 106 250 106Z"/>
<path d="M560 15H670V80C700 25 740 0 815 0V115H800C711 115 670 163 670 247V490H560Z"/>
<path d="M1120 0C974 0 870 109 870 251.5S974 503 1120 503C1245 503 1330 423 1360 317H1242C1222 365 1178 398 1120 398C1038 398 980 336 980 251.5S1038 105 1120 105C1178 105 1222 138 1242 183H1360C1330 78 1245 0 1120 0Z"/>
<path d="M1420 0H1530V166C1557 122 1605 102 1660 102C1785 102 1856 176 1856 298V490H1746V305C1746 238 1711 205 1650 205C1576 205 1530 251 1530 323V490H1420Z"/>
</g></svg>}
function App(){
const root=useRef(),menu=useRef(),wipe=useRef(),busy=useRef(false),touch=useRef(0)
const [heroReady,setHeroReady]=useState(false)
const [entranceFinished,setEntranceFinished]=useState(false)
const [slide,setSlide]=useState(0),[filter,setFilter]=useState('All'),[menuOpen,setMenuOpen]=useState(false),[plan,setPlan]=useState(0),[saved,setSaved]=useState(false)
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches
const {contextSafe}=useGSAP(()=>{
 const mm=gsap.matchMedia()
 const visited=sessionStorage.getItem('arch-visited')==='true'
 sessionStorage.setItem('arch-visited','true')
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
 const cover=wipe.current.querySelector('.loader')
 gsap.set('.loader-ball',{display:visited?'none':'block'})
 const entrance=gsap.timeline({onComplete:()=>{setEntranceFinished(true);ScrollTrigger.refresh()}})
 if(!visited){
   entrance.set('.page-content',{visibility:'hidden'}).set(cover,{height:'0vh'})
   .to(cover,{height:'25vh',duration:.6,delay:.3,ease:referenceEase})
   .to(cover,{height:'65vh',duration:.6,delay:.01,ease:referenceEase})
   .to(cover,{height:'100vh',duration:.9,delay:.01,ease:referenceEase})
   .set('.page-content',{visibility:'visible'})
   .to(wipe.current,{height:0,duration:.9,delay:.1,ease:referenceEase})
   .set(wipe.current,{visibility:'hidden'})
 }else entrance.to(wipe.current,{height:0,duration:1,delay:.1,ease:referenceEase}).set(wipe.current,{visibility:'hidden'})
 if(fullMasthead){
  if(home)gsap.set('.slide-track',{x:0,xPercent:-100/6})
  const intro=gsap.timeline({delay:visited?1:3.42})
  intro.from('.grid-lines span',{scaleY:0,transformOrigin:'top',duration:3,ease:'power1.inOut'},0)
  .from('.header-rule',{scaleX:0,transformOrigin:'left',duration:3,ease:'power1.inOut'},0)
  .from('.brand svg',{yPercent:120,opacity:0,duration:2.8,ease:referenceEase},0)
  if(home)gsap.fromTo('.scroll-brand',{yPercent:-100,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.6,ease:referenceEase,scrollTrigger:{trigger:'.feature',start:'top top',toggleActions:'play none none reverse'}})
 }
 gsap.utils.toArray('.section-rule').forEach(el=>gsap.from(el,{scaleX:0,transformOrigin:'left center',duration:2.6,delay:.6,ease:'power1.inOut',scrollTrigger:{trigger:el,start:'top 95%',once:true}}))
 if(home){
  gsap.timeline({scrollTrigger:{trigger:'.home-about-image',start:'45% 50%',end:'90% 40%',toggleActions:'play reverse restart reverse'}})
  .to('.home-about-image',{backgroundColor:'#e7e7e4',duration:.6,ease:referenceEase},0)
  .to('.portrait-window',{scale:1,borderRadius:'0%',duration:.6,ease:referenceEase},0)
 }
 const journal=root.current.querySelector('.journal-grid')
 if(journal){
  gsap.from(journal.children,{
   y:20,opacity:0,duration:.6,stagger:.18,ease:'power1.inOut',
   clearProps:'opacity,transform',
   scrollTrigger:{trigger:journal,start:'top 85%',once:true}
  })
 }
 const cta=root.current.querySelector('.contact')
 if(cta){
  gsap.timeline({scrollTrigger:{trigger:cta,start:'top center'}})
  .from('.cta-bottom-line',{scaleX:0,transformOrigin:'left',duration:3,ease:'power1.inOut'},0)
  .from('.cta-grid span',{scaleY:0,transformOrigin:'top',duration:3,ease:'power1.inOut'},0)
  .from('.cta-copy>*',{y:20,opacity:0,duration:.6,stagger:.3,ease:'power1.inOut'},.1)

  if(home)gsap.to('.scroll-brand',{yPercent:100,autoAlpha:0,duration:.6,ease:referenceEase,scrollTrigger:{trigger:cta,start:'top 15%',toggleActions:'play none none reverse'}})
 }
 gsap.timeline({scrollTrigger:{trigger:'footer',start:'top 90%',once:true}}).from('.footer-brand svg',{yPercent:120,opacity:0,duration:2.8,ease:referenceEase}).from('.footer-grid>*',{y:20,opacity:0,duration:.6,stagger:.15,ease:'power1.inOut'},.4)
 gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:20,opacity:0,duration:.6,ease:'power1.inOut',scrollTrigger:{trigger:el,start:'top 80%',once:true}}))
 });if(reduced())gsap.set(wipe.current,{visibility:'hidden'});return()=>mm.revert()
},{scope:root})
useGSAP(()=>{gsap.utils.toArray('.filter-rule').forEach(el=>{if(!reduced())gsap.from(el,{scaleX:0,transformOrigin:'left center',duration:2.6,delay:.6,ease:'power1.inOut',scrollTrigger:{trigger:el,start:'top 95%',once:true}})});gsap.utils.toArray('.project').forEach(el=>{if(!reduced())gsap.from(el,{y:20,duration:1.1,ease:'power1.out',clearProps:'transform',scrollTrigger:{trigger:el,start:'top 95%',once:true}})});ScrollTrigger.refresh()},{scope:root,dependencies:[filter],revertOnUpdate:true})
const navigate=contextSafe(e=>{
 if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button>0)return
 const href=e.currentTarget.getAttribute('href')
 if(!href?.startsWith('/')||href.startsWith('//'))return
 // The reference navigates immediately; the destination performs its cover reveal.
 if(menu.current.open){menu.current.close();setMenuOpen(false)}
})
const scrollToProjects=contextSafe(e=>{
 e.preventDefault()
 gsap.to(window,{scrollTo:{y:root.current.querySelector('#projects'),autoKill:true},duration:reduced()?0:1.2,ease:referenceEase,onComplete:()=>history.replaceState(null,'','#projects')})
})
const closeMenu=contextSafe(()=>{
 if(busy.current)return;busy.current=true
 gsap.to(menu.current,{yPercent:-100,duration:reduced()?0:.6,ease:referenceEase,onComplete:()=>{menu.current.close();setMenuOpen(false);busy.current=false}})
})
const openMenu=contextSafe(()=>{
 if(busy.current)return;busy.current=true;menu.current.showModal();setMenuOpen(true)
 gsap.fromTo(menu.current,{yPercent:-150},{yPercent:0,duration:reduced()?0:.6,ease:referenceEase,onComplete:()=>{busy.current=false}})

})
const move=contextSafe(d=>{
 if(busy.current||d===0)return
 busy.current=true
 const raw=slide+d
 const next=(raw+featured.length)%featured.length
 const track=root.current.querySelector('.slide-track')
 gsap.to(track,{xPercent:-(raw+1)*100/6,duration:reduced()?0:.6,ease:carouselEase,onComplete:()=>{gsap.set(track,{xPercent:-(next+1)*100/6});busy.current=false}})
 setSlide(next)
})
function Card({p}){return <a key={p.slug} className={`project ${filter==='Architecture'&&p.category==='Architecture'?'architecture-card':''}`} href={`/projects/${p.slug}`} onClick={navigate}><div className="project-photo"><img src={image(p)} alt={p.name} loading="lazy" width="1536" height="1024"/>{p.category==='Architecture'&&<img className="architecture-drawing" src={drawing(p)} alt="" loading="lazy" width="1536" height="1024"/>}<span className="project-open" aria-hidden="true">↗</span></div><h3>{p.name}</h3><p>{p.category}</p></a>}
function Work(){return <section className="projects-section" id="projects" aria-label="Projects"><div className={`filters ${filter!=='All'?'has-filter':''}`}><h2 className="visually-hidden">Selected projects</h2><span className="filter-rule" aria-hidden="true"/><div role="group" aria-label="Filter projects">{['Interiors','Architecture','Design'].map(c=><button key={c} aria-pressed={filter===c} onClick={()=>setFilter(current=>current===c?'All':c)}>{c}</button>)}<button className="reset-filter" aria-label="Show all projects" onClick={()=>setFilter('All')}>×</button></div></div><div className="project-grid">{projects.filter(p=>filter==='All'||p.category===filter).map(p=>Card({p}))}</div></section>}
function Studio(){
 const copy=<div className="studio-copy"><p className="statement reveal">We are Arch. We create architecture and interiors with a clear purpose: simple compositions, natural materials and careful attention to the way we live.</p><p className="statement reveal">From the shape of a room to the smallest detail, we look for a quiet balance between form and everyday life.</p>{home&&<a className="line-link reveal" href="/about" onClick={navigate}>Learn more</a>}</div>
 if(home)return <section className="home-about" id="studio"><span className="section-rule" aria-hidden="true"/><h2>About studio</h2><div className="home-about-content"><div className="home-about-image reveal"><div className="portrait-window"><img src="/images/studio-portrait.jpg" alt="Illustrative portrait of a fictional architecture studio team" width="1536" height="1024" loading="lazy"/></div></div>{copy}</div></section>
 return <section className="about section-pad" id="studio"><span className="section-rule" aria-hidden="true"/><h2 className="reveal">About studio</h2>{copy}</section>
}
function ContactCTA(){return <section className="contact section-pad"><div className="cta-grid" aria-hidden="true">{Array.from({length:8},(_,i)=><span key={i}/>)}</div><span className="cta-bottom-line" aria-hidden="true"/><div className="cta-copy"><h2>Have a project in mind? Looking<br className="desktop-break"/> for a partner for your next design,<br className="desktop-break"/> architecture, interior design project?</h2><a className="line-link" href="/contact" onClick={navigate}>Submit your brief</a></div></section>}
return <div ref={root} className={`${home?'home-page':'inner-page'} ${project?'project-page':''} ${about?'about-page':''} ${contact?'contact-page':''} ${fullMasthead?'full-masthead':''}`}>
<div className="page-content"><header className={fullMasthead?"masthead":"inner-header"} id="top">{fullMasthead?<><div className="grid-lines" aria-hidden="true">{Array.from({length:8},(_,i)=><span key={i}/>)}</div><a className="studio-label" href="/" onClick={navigate}>DESIGN<br/>STUDIO</a><div className="header-rule" aria-hidden="true"/>{home?<><h1 className="brand"><Logo/></h1><a className="scroll-brand" href="/" onClick={navigate} aria-label="Arch home"><Logo/></a></>:<div className="brand" aria-hidden="true"><Logo/></div>}</>:<a className="small-brand" href="/" onClick={navigate}><Logo/></a>}<button className="menu-toggle" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={openMenu}><i/><i/></button>{project&&<a className="back-project" href="/projects" onClick={navigate} aria-label="Back to projects">‹</a>}</header>
<main>{home&&<><section className="feature" id="slider" aria-label="Featured projects" aria-roledescription="carousel"><div className={heroReady&&entranceFinished?"slide-visual is-ready":"slide-visual is-loading"} onTouchStart={e=>{touch.current=e.touches[0].clientX}} onTouchEnd={e=>{const d=e.changedTouches[0].clientX-touch.current;if(Math.abs(d)>50)move(d<0?1:-1)}}><div className="slide-track">{[featured[3],...featured,featured[0]].map((p,i)=><div className="slide-panel" key={`${p.slug}-${i}`} aria-hidden={i!==slide+1}><img className="slide-photo" src={image(p)} alt={p.name} fetchPriority={i===1?"high":"low"} loading={i===1?"eager":"lazy"} onLoad={i===1?()=>setHeroReady(true):undefined} onError={i===1?()=>setHeroReady(true):undefined} width="1536" height="1024" draggable="false"/><div className="slide-caption"><a href={`/projects/${p.slug}`} onClick={navigate} tabIndex={i===slide+1?0:-1}>{p.carouselName||p.name}</a><p>{p.category==='Interiors'?'Interior Design':p.category}</p></div></div>)}</div><a className="scroll-cue" href="#projects" onClick={scrollToProjects}>Scroll Down</a><button className="slide-arrow previous" aria-label="Previous project" onClick={()=>move(-1)}>←</button><button className="slide-arrow next" aria-label="Next project" onClick={()=>move(1)}>→</button><span className="visually-hidden" aria-live="polite">{featured[slide].carouselName||featured[slide].name}</span></div><div className="pagination" aria-label="Choose featured project">{featured.map((p,i)=><button key={p.slug} aria-label={`Show ${p.name}`} aria-current={i===slide?'true':undefined} onClick={()=>move(i-slide)}>{i+1}</button>)}</div></section>{Work()}<div className="categories-return"><a href="#projects" onClick={scrollToProjects}>Scroll up to categories</a></div>{Studio()}</>}
{listing&&<><h1 className="visually-hidden">Projects</h1>{Work()}</>}
{about&&<><h1 className="visually-hidden">About Arch</h1>{Studio()}<div className="studio-image parallax"><img src={image(projects[4])} alt="A sculptural workspace concept by Arch" width="1536" height="1024"/></div><section className="about section-pad"><span className="section-rule" aria-hidden="true"/><h2 className="reveal">How we work<br/>&amp; process</h2><div><p className="statement reveal">We start with how a space will be used. Light, movement and materials guide the decisions that follow.</p>{[['Design','Objects and furniture are considered as part of the space, with a focus on proportion, craft and lasting materials.'],['Architecture','We study the site, the brief and the relationship between inside and outside. Each decision gives the building a clear purpose.'],['Interior design','From the first plan to the final finish, we develop a consistent material language around the people who use the space.']].map(([title,copy])=><div className="process-item reveal" key={title}><h3>{title}</h3><p>{copy}</p></div>)}</div></section></>}
{project&&<article><div className="project-hero parallax"><img src={image(project)} alt={project.name} fetchPriority="high" width="1536" height="1024"/></div><a href="#description" className="project-title"><h1>{project.name}</h1><span>{project.category}</span><span aria-hidden="true">↓</span></a><section className="project-description section-pad" id="description"><h2 className="visually-hidden">Project details</h2><div className="project-facts">{[['Status','Concept study'],['Category',project.category],['Area',project.category==='Design'?'Object study':`${project.area} m²`],['Number of rooms',project.rooms],['Design direction','Arch'],['Materials',project.materials],['Visualisation','AI-generated concept'],['Approach','Form, light & everyday life']].map(([label,value])=><div className="fact reveal" key={label}><span>{label}</span><p>{value}</p></div>)}</div><div className="plan-panel reveal"><div className="plan-heading"><h3>Spatial study</h3><button onClick={()=>window.print()}>Print project ↗</button></div><svg viewBox="0 0 480 360" role="img" aria-label="Illustrative concept floor plan"><g fill="none" stroke="currentColor" strokeWidth="5"><path d={plan===0?'M45 45H435V315H45ZM45 180H190V45M190 180V315M300 45V180H435M190 245H300V315':'M45 45H435V315H45ZM190 45V315M190 145H435M310 145V315M45 245H190'}/><path strokeWidth="1" d="M70 70H160V150H70ZM220 75H270V130H220ZM330 210H405V285H330Z"/></g><text x="45" y="345" fill="currentColor" fontSize="12">ARCH — CONCEPT PLAN</text></svg><div className="plan-tabs" aria-label="Floor plan views">{[0,1].map(i=><button aria-pressed={plan===i} onClick={()=>setPlan(i)} key={i}>{i+1}</button>)}</div></div></section><p className="project-story section-pad reveal">{project.description}</p><div className="detail-image parallax"><img src={image(project)} alt={`${project.name}, material detail`} width="1536" height="1024" loading="lazy"/></div><section className="related section-pad"><h2 className="reveal">See also other projects</h2><div className="project-grid">{projects.filter(p=>p!==project).slice(0,2).map(p=>Card({p}))}</div></section></article>}
{contact&&<><h1 className="visually-hidden">Contact Arch</h1><section className="about section-pad contact-intro"><span className="section-rule" aria-hidden="true"/><h2>Contact</h2><div><p className="statement">Let’s work together. A new home, a different way to work, a place to slow down.</p><p className="statement">Tell us what you have in mind.</p><a className="line-link" href="#brief">— Fill the brief ↓</a></div></section><section className="brief-section about section-pad" id="brief"><h2>Fill the brief</h2><div><p className="brief-note">Share a little about your project. This local preview saves a draft on your device; sending will be available once the studio contact is connected.</p><form onSubmit={e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));localStorage.setItem('arch-project-brief',JSON.stringify(data));setSaved(true)}}><div className="form-grid">{[['Name','name','text'],['Company','company','text'],['Email address','email','email'],['Phone number','phone','tel'],['Subject','subject','text'],['Expected project start date','start','date']].map(([label,name,type])=><label key={name}>{label}<input type={type} name={name} required={['name','email','subject'].includes(name)}/></label>)}</div><label className="message-label">Tell us about your project<textarea name="message" rows="3" required/></label><fieldset><legend>Project type</legend>{['Interiors','Architecture','Design'].map(c=><label key={c}><input type="radio" name="type" value={c} required/>{c}</label>)}</fieldset><button className="line-link" type="submit">— Save project brief ↗</button>{saved&&<p className="form-status" role="status">Your brief is saved on this device. Nothing has been sent.</p>}</form></div></section><div className="contact-portrait"><img src="/images/studio-portrait.jpg" alt="Illustrative portrait of the Arch studio team" width="1536" height="1024" loading="lazy"/></div></>}
{(home||about)&&<section className="instagram section-pad"><span className="section-rule" aria-hidden="true"/><div className="section-heading"><h2 className="reveal">Instagram</h2><a className="line-link" href="/projects" onClick={navigate}>Studio journal</a></div><div className="journal-grid">{[projects[6],projects[0],projects[5],projects[4]].map(p=><a href={`/projects/${p.slug}`} onClick={navigate} key={p.slug}><img src={image(p)} alt={`${p.name}, material study`} loading="lazy" width="1536" height="1024"/></a>)}</div></section>}
{!contact&&ContactCTA()}</main>
<footer className="section-pad"><a className="footer-brand" href="/#top" aria-label="Arch, back to top"><Logo/></a><div className="footer-grid"><p>Architecture &amp; Interiors<br/>Independent practice</p><div className="footer-center"><div><a href="/projects" onClick={navigate}>PROJECTS</a><a href="/about" onClick={navigate}>ABOUT STUDIO</a></div><p className="credit">Arch — portfolio concept. Original AI-generated imagery.</p></div><a className="footer-contact" href="/contact" onClick={navigate}>Get in touch<br/>Contact studio ↗</a></div></footer></div>
<dialog ref={menu} className="menu-dialog" aria-label="Main menu" onCancel={e=>{e.preventDefault();closeMenu()}}><div className="menu-inner"><a href="/" className="menu-brand" onClick={navigate}><Logo/></a><div className="menu-socials"><a href="/projects" onClick={navigate}>PROJECTS</a><a href="/contact" onClick={navigate}>GET IN TOUCH</a></div><button className="close-button" aria-label="Close menu" onClick={closeMenu}><span/><span/></button><nav aria-label="Main navigation">{nav.map(([text,href])=><a key={href} href={href} onClick={navigate} aria-current={path===href?'page':undefined}><span className="nav-dot" aria-hidden="true">•</span><span>{text}</span></a>)}</nav></div></dialog><div ref={wipe} className="page-wipe" aria-hidden="true"><div className="loader"/><div className="loader-ball"/></div>
</div>}
const reactRoot=import.meta.hot?.data.reactRoot || createRoot(document.getElementById('root'))
if(import.meta.hot)import.meta.hot.data.reactRoot=reactRoot
reactRoot.render(<App/>)
