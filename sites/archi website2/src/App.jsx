import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from './data.json';
import assetReplacements from './asset-replacements.json';
import './style.css';
gsap.registerPlugin(useGSAP, ScrollTrigger);
const {projects, articles, aboutMedia, homeMedia}=data;
const findProject=slug=>projects.find(p=>p.slug===slug);
const orderedProjects=['vale-house','meridian','birch-lane','croft-end','the-granary','westport','studio-six','the-mill','elmwood'].map(findProject);
const nav=[['Home','/'],['About','/about'],['Projects','/projects'],['Articles','/articles'],['Contact','/#contact']];
const A='/assets/';
const resolveAsset=src=>assetReplacements[src]||src;
function Media({media,className='',priority=false}){const video=useRef();useEffect(()=>{if(!media.video||!video.current)return;const el=video.current;const reduce=matchMedia('(prefers-reduced-motion: reduce)');let visible=false;const sync=()=>{if(visible&&!document.hidden&&!reduce.matches)el.play().catch(()=>{});else el.pause();};const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.1});observer.observe(el);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);reduce.removeEventListener('change',sync);el.pause();};},[media.video]);return media.video?<video ref={video} className={className} src={media.video} poster={media.poster} muted loop playsInline preload="none" aria-label={media.alt}/>:<img className={className+(media.motionStill?' motion-still':'')} src={resolveAsset(media.src)} alt={media.alt?.startsWith('var(')?'Decode interior':media.alt||'Decode interior'} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'}/>}
function Arrow({down=false}){return <span aria-hidden="true" className="arrow">{down?'↓':'↗'}</span>}
function Header({dark}){
  const dialog=useRef();
  const animation=useRef();
  const [open,setOpen]=useState(false);

  useLayoutEffect(()=>{
    const panel=dialog.current;
    if(!open)return;
    panel.showModal();
    panel.scrollTop=0;
    panel.querySelector('.menu-top button').focus({preventScroll:true});

    const context=gsap.context(()=>{
      if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      animation.current=gsap.timeline({onReverseComplete:()=>setOpen(false)})
        .fromTo(panel,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.55,ease:'power3.inOut'})
        .from('.menu-link span',{y:()=>20*parseFloat(getComputedStyle(panel).fontSize)/16,opacity:0,duration:.5,stagger:.025,ease:'power2.out'},.25)
        .from('.social-circles',{opacity:0,duration:.35},.38);
    },panel);

    return ()=>{
      animation.current=null;
      context.revert();
      panel.close();
    };
  },[open]);

  function close(){
    if(animation.current?.progress()>0)animation.current.reverse();
    else setOpen(false);
  }

  return <>
    <header className={dark?'light-header':''}>
      <a className="brand" href="/">DECODE</a>
      <button onClick={()=>setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>MENU <span className="plus" aria-hidden="true">+</span></button>
    </header>
    <dialog aria-label="Main menu" ref={dialog} className="menu" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===dialog.current)close();}}>
      <div className="menu-top">
        <a className="brand" href="/" onClick={()=>setOpen(false)}>DECODE</a>
        <button aria-label="Close menu" onClick={close}>MENU <span className="plus" aria-hidden="true">+</span></button>
      </div>
      <nav>{nav.map(([label,path])=><a className="menu-link" key={label} href={path} onClick={()=>setOpen(false)}><span>{label}</span></a>)}</nav>
      <div className="social-circles"><a aria-label="X" href="https://x.com">𝕏</a><a aria-label="YouTube" href="https://youtube.com">▻</a><a aria-label="LinkedIn" href="https://linkedin.com">in</a></div>
    </dialog>
  </>;
}
function Footer({dark=false}){const [notice,setNotice]=useState('');return <footer className={dark?'dark-footer':''}><div className="footer-top"><div><p>Design that outlasts the trend.<br/>Join our newsletter today.</p><form className="subscribe" onSubmit={e=>{e.preventDefault();setNotice('Newsletter signup is a demo. No email has been sent.');}}><input type="email" aria-label="Newsletter email" placeholder="name@email.com" required/><button>SUBSCRIBE</button></form><p className="form-notice" role="status">{notice}</p></div><nav>{[['Home','/'],['Projects','/projects'],['About','/about'],['Contact','/#contact'],['Articles','/articles']].map(([l,h])=><a key={l} href={h}>{l}</a>)}</nav></div><div className="footer-bottom"><div>{['Instagram','Youtube','Linkedin'].map(s=><a href={'https://'+s.toLowerCase()+'.com'} key={s}>{s}</a>)}</div><a href="/">Decode. All rights reserved.</a><a href="/asset-credits.html" data-native-navigation>Photography credits</a></div></footer>}
function ProjectCard({project:p}){return <a className="project-card" href={'/projects/'+p.slug}><div className="project-image"><Media media={p.hero}/><span className="view-more">VIEW MORE <Arrow/></span></div><h3>{p.title}</h3><div className="small project-meta"><span>{p.year}</span><span>{p.location}</span></div></a>}
function ProjectGrid({items=orderedProjects,className=''}){return <div className={'project-grid '+className}>{items.map(p=><ProjectCard key={p.slug} project={p}/>)}</div>}
function ArticleCard({article:a,home=false}){return <a className={'article-card '+(home?'home-article':'')} href={'/articles/'+a.slug}><div className="article-image"><Media media={a.hero}/><p className="article-hover-description">{a.description}</p><span className="round-arrow"><Arrow/></span></div><div className="article-caption">{!home&&<div className="small article-meta"><span>{a.category}</span><span>{a.date}</span></div>}<h3>{a.title}</h3>{home&&<p className="small author">— &nbsp;{a.author}</p>}</div></a>}
function Contact(){const [notice,setNotice]=useState('');return <section id="contact" className="contact section-pad"><h2 className="contact-title"><span className="corner-arrow">↳</span>Let's work together.</h2><div className="contact-layout"><div className="contact-info"><a href="mailto:hello@decode.studio"><span className="small">EMAIL</span><strong>hello@decode.studio</strong></a><img src={resolveAsset(A+'dR5dZhXAIL72IKtAVWr1N3e05U.png')} alt="Architectural light and shadow" loading="lazy"/><a href="tel:2053845055"><span className="small">PHONE</span><strong>205-384-5055</strong></a><picture><source media="(max-width: 809px)" srcSet={A+'free/pexels-29672793.jpg'}/><img src={resolveAsset(A+'JjpbEeevPKc7zTEHtwnJqFa2FdQ.png')} alt="Decode interior" loading="lazy"/></picture></div><form onSubmit={e=>{e.preventDefault();setNotice('This is a local demo. To send your inquiry, email hello@decode.studio.');}}><label>NAME<input name="name" placeholder="Jane Smith" autoComplete="name" required/></label><label>EMAIL<input type="email" name="email" placeholder="jane@framer.com" autoComplete="email" required/></label><label>TOPIC<select aria-label="Topic" name="topic" required defaultValue=""><option value="" disabled>Select…</option><option>Service</option><option>Support</option></select></label><label>MESSAGE<textarea name="message" placeholder="Enter your message" rows="4" required/></label><button className="submit">SUBMIT</button><p className="form-notice" role="status">{notice}</p></form></div></section>}
const services=[['Residential Design','Decode works closely with homeowners to develop a cohesive vision, managing everything from spatial planning and material selection to furniture procurement and final installation.','$8,000'],['Commercial Interiors',"Workplace and retail spaces designed for function, flow, and brand alignment. Decode translates a business’s identity into a physical environment.",'$15,000'],['Renovation Consulting','Focused guidance on layout, materials, and finishes before a renovation begins. Ideal for clients who want expert input early, this service helps avoid costly mistakes.','$2,500'],['FF&E Sourcing','Curated furniture, fixture, and equipment selection tailored to the project brief. Decode handles the research, procurement, and coordination so clients get cohesive, well-considered pieces.','$3,500']];
function GalleryStrip({start=0,reverse=false}){const [paused,setPaused]=useState(false);const names=start?['MbjVvoX3H3ffz0gbUNAakJCqb7I.png','jMvBazUHvKhX1miCZodgjxnAec.png','l12XWsHZXJHmsjkzHYlPhdPnXQ.png','XKwPSb0dw53OTxIlCUoBd25Sk.png','zmmaXGZ7qkqwsh5kGMxepwdOiE.png']:['CjhfXiN6PXAwzajoL7fTNa8Vuc.png','2Yk1H8lu4szlfwNgVikZePJNLs.png','VHnHvWhoLLo7c2s2gfNd3lQkDBg.png','heiti4kilGfA5lpfPJFtmH4wNU.png','aWVd65dbLbCdBq0934GBHI0D4ZY.png'];const imgs=names.map(n=>({src:A+n,alt:'Interior material and light study'}));return <div className={'gallery-strip '+(reverse?'reverse':'')+(paused?' paused':'')}><div className="gallery-track">{[...imgs,...imgs,...imgs].map((m,i)=><Media key={i} media={m}/>)}</div><button className="pause" onClick={()=>setPaused(!paused)}>{paused?'Play':'Pause'}</button></div>}
function AnimatedText({text,as:Tag='h3',className=''}){return <Tag className={'character-reveal '+className} aria-label={text}>{text.split(' ').map((word,i)=><React.Fragment key={i}><span className="word" aria-hidden="true">{[...word].map((c,j)=><span className="char" key={j}>{c}</span>)}</span>{' '}</React.Fragment>)}</Tag>}
// A damped response keeps the outgoing card visibly shrinking through the handoff.
function railResizeEase(progress){
  const time=9*progress;
  return (1-(1+time)*Math.exp(-time))/(1-10*Math.exp(-9));
}
function ProjectRail(){
  const [active,setActive]=useState(null);
  const selection=useRef(null);
  const rail=useRef();
  const items=['vale-house','meridian','birch-lane','croft-end','the-granary','studio-six'].map(findProject);

  function select(index){
    if(index===selection.current)return;
    selection.current=index;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){
      setActive(index);
      return;
    }

    const cards=Array.from(rail.current.children);
    const previous=cards.map(card=>card.firstElementChild.getBoundingClientRect());
    gsap.killTweensOf(cards);
    gsap.set(cards,{clearProps:'transform,--rail-edge,--rail-image-scale'});
    flushSync(()=>setActive(index));

    // Animate from the currently painted squares, including during a rapid hover change.
    cards.forEach((card,i)=>{
      const before=previous[i];
      const after=card.getBoundingClientRect();
      gsap.fromTo(card,{
        x:before.x+before.width/2-(after.x+after.width/2),
        y:before.y+before.height/2-(after.y+after.height/2),
        '--rail-image-scale':before.width/after.width,
        '--rail-edge':(before.width-after.width)/2+'px'
      },{
        x:0,
        y:0,
        '--rail-image-scale':1,
        '--rail-edge':'0px',
        duration:1.3,
        ease:railResizeEase,
        clearProps:'transform,--rail-edge,--rail-image-scale'
      });
    });
  }

  useLayoutEffect(()=>{
    const cards=Array.from(rail.current.children);
    const desktop=gsap.matchMedia();
    desktop.add('(min-width: 1200px)',()=>{
      let frame;
      const trigger=ScrollTrigger.create({
        trigger:rail.current.closest('.home-projects'),
        start:'top 50%',
        end:'bottom top',
        onToggle:({isActive})=>{
          cancelAnimationFrame(frame);
          frame=requestAnimationFrame(()=>select(isActive?2:null));
        }
      });
      if(trigger.isActive)frame=requestAnimationFrame(()=>select(2));
      return ()=>{
        cancelAnimationFrame(frame);
        trigger.kill();
        gsap.killTweensOf(cards);
        gsap.set(cards,{clearProps:'transform,--rail-edge,--rail-image-scale'});
        selection.current=null;
        setActive(null);
      };
    });
    return ()=>desktop.revert();
  },[]);

  return <div ref={rail} className="project-rail">{items.map((p,i)=><div className={'rail-item '+(active===i?'active':'')} key={p.slug}>
    <a href={'/projects/'+p.slug} onPointerEnter={e=>{if(e.pointerType!=='touch')select(i);}} onFocus={()=>select(i)}>
      <Media media={p.hero}/><i className="focus-corner top"/><i className="focus-corner bottom"/>
    </a>
    <div className="rail-caption" aria-hidden={active!==i}><h3>{p.title}</h3><p>{p.description}</p></div>
  </div>)}</div>;
}
function ServiceRow({service:[title,desc,price],index}){const [open,setOpen]=useState(index===0);return <div className={'service-accordion '+(open?'open':'')}><button className="service-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls={'service-'+index}><h2>{title}</h2><span className="service-plus" aria-hidden="true">+</span></button><div id={'service-'+index} className="service-content" inert={!open} onTransitionEnd={e=>{if(e.propertyName==='grid-template-rows')ScrollTrigger.refresh();}}><div><div className="service-content-inner"><div><p>{desc}</p><div className="price"><span className="small">FROM</span><h3>{price}</h3></div></div><img src={resolveAsset(A+['CjhfXiN6PXAwzajoL7fTNa8Vuc.png','WysWO1cb7kNoRK5UjP1VKU7o10.png','XKwPSb0dw53OTxIlCUoBd25Sk.png','WFrJbQlXv9XaTZ7LsHRHkmZCbY.png'][index])} alt="Service interior example" loading="lazy"/></div></div></div></div>}
function Home(){return <><section className="hero home-hero"><div className="hero-background"><Media media={homeMedia[0]} priority className="hero-media"/><div className="hero-shade"/></div><div className="hero-content"><div className="hero-center"><div className="hero-wordmark"><h1>DECODE</h1><h2>STUDIO.</h2></div><div className="small hero-location"><span>BASED IN NEW YORK</span><span>//</span><span>SINCE 2008</span></div></div><div className="hero-bottom"><p>Decode designs spaces that feel personal, look timeless, and work for the people inside them.</p><a className="small text-link" href="#project">VIEW PROJECTS <Arrow down/></a></div></div></section><section id="project" className="home-projects section-pad"><ProjectRail/><div className="compact-projects"><ProjectGrid items={['vale-house','meridian','birch-lane','croft-end','the-granary','studio-six'].map(findProject)}/></div></section><section id="services" className="services section-pad"><div className="services-inner"><p className="small section-label">SERVICES</p>{services.map((s,i)=><ServiceRow key={s[0]} service={s} index={i}/>)}</div></section><section className="home-about"><GalleryStrip/><div className="about-statement"><p className="small reveal-label">ABOUT US</p><AnimatedText text="Decode is a full-service interior design practice built on the belief that great spaces start with great listening."/><AnimatedText text="A rigorous process, deep material knowledge, and a sharp eye for light and proportion result in interiors that feel considered and lasting."/></div><GalleryStrip start={5} reverse/></section><section className="journal section-pad"><div className="section-heading"><span className="small reveal-label">JOURNAL</span><AnimatedText as="h2" text="Notes from the studio."/></div><div className="article-grid">{articles.slice(0,4).map(a=><ArticleCard key={a.slug} article={a} home/>)}</div></section><Contact/></>}
function Listing({journal=false}){const [filter,setFilter]=useState('All');const [query,setQuery]=useState('');const [expanded,setExpanded]=useState(false);const listingRef=useRef();useGSAP(()=>{if(!matchMedia('(prefers-reduced-motion: no-preference)').matches)return;const cards=gsap.utils.toArray('.project-card,.article-card');if(cards.length)gsap.from(cards,{opacity:0,y:20,duration:.7,stagger:.06,ease:'power2.out',clearProps:'transform,opacity'});},{scope:listingRef,dependencies:[filter,query,expanded],revertOnUpdate:true});const filters=journal?['All','Studio Practice','Materials','Process']:['All','Residential','Commercial','New Build','Renovation'];const categories={'vale-house':['Residential','Renovation'],'meridian':['Commercial','Renovation'],'birch-lane':['Residential','New Build'],'croft-end':['Residential','Renovation'],'the-granary':['Commercial','Renovation'],'westport':['Residential','Renovation'],'studio-six':['Commercial','Renovation'],'the-mill':['Commercial','Renovation'],'elmwood':['Residential','New Build']};let items=journal?articles:orderedProjects;items=items.filter(p=>(filter==='All'||(journal?p.category===filter:categories[p.slug].includes(filter)))&&(!query||p.title.toLowerCase().includes(query.toLowerCase())));if(!journal&&!expanded&&filter==='All')items=items.slice(0,6);return <section ref={listingRef} className="listing section-pad"><div className="listing-heading"><h1 className="entrance">{journal?'Studio Insights.':'Selected Projects.'}</h1><div className="listing-description"><p>{journal?'A running record of how Decode works, what we build with, and what we learn.':'A curated look at the spaces Decode has designed, renovated, and transformed.'}</p>{journal&&<span>({String(items.length).padStart(2,'0')})</span>}</div></div>{journal&&<input className="search" aria-label="Search articles" placeholder="⌕  Search…" type="search" value={query} onChange={e=>setQuery(e.target.value)}/>}<select className="mobile-filter" aria-label={journal?"Article category":"Project category"} value={filter} onChange={e=>setFilter(e.target.value)}>{filters.map(f=><option key={f}>{f}</option>)}</select><div className="filters">{filters.map(f=><button aria-pressed={filter===f} className={filter===f?'selected':''} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div>{journal?<div className="article-grid">{items.map(a=><ArticleCard key={a.slug} article={a}/>)}</div>:<ProjectGrid items={items}/>} {!items.length&&<p className="empty">No articles match your search.</p>}{!journal&&!expanded&&filter==='All'&&<button className="load-more" onClick={()=>setExpanded(true)}>LOAD MORE <span>+</span></button>}</section>}
function ProjectDetail({project:p}){const sections=[];let current;for(const b of p.body){if(b.tag==='h4'){current={title:b.text,paragraphs:[]};sections.push(current);}else if(current)current.paragraphs.push(b.text);}return <><section className="hero detail-hero"><Media media={p.hero} priority className="hero-media"/><div className="hero-shade"/><div className="detail-hero-title entrance"><div className="small"><span>{p.location}</span><span>//</span><span>{p.year}</span></div><h1>{p.title}</h1></div></section><section className="project-detail section-pad"><div className="project-summary"><div><h3>{p.title}</h3><p>{p.description}</p></div><dl>{[['YEAR',p.year],['LOCATION',p.location],['SIZE',p.size]].map(([l,v])=><div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl></div><div className="project-story">{sections.map((s,i)=><div className="story-section" key={s.title}><div className="detail-gallery">{p.gallery.slice(i*3,i*3+3).map((m,k)=><Media key={k} media={m}/>)}</div><div className="story-copy"><h3>{s.title}</h3>{s.paragraphs.map(t=><p key={t}>{t}</p>)}</div></div>)}</div></section><section className="related section-pad"><h2>More from the studio.</h2><ProjectGrid items={p.related.map(findProject).filter(Boolean)} className="three-columns"/></section></>}
function ArticleDetail({article:a}){return <><section className="article-hero"><Media media={a.hero} priority className="hero-media"/><div className="hero-shade"/><a className="all-articles small" href="/articles">← ALL ARTICLES</a><div className="article-hero-bottom"><span className="small">{a.read}</span><div className="entrance"><p className="small">{a.category}</p><h1 className="word-reveal" aria-label={a.title}>{a.title.split(' ').map((w,i)=><React.Fragment key={i}><span className="title-word" aria-hidden="true">{w}</span>{' '}</React.Fragment>)}</h1><p>{a.description}</p></div></div></section><section className="article-body section-pad"><aside><div className="author-profile"><Media media={a.portrait}/><h3>{a.author}</h3><p>{a.role}</p></div><div className="article-cta"><h3>Have a project in mind?</h3><p>Tell us about the space. We’ll start with the light.</p><a href="/#contact" className="small text-link">CONTACT US <Arrow/></a></div></aside><article>{a.body.map((b,i)=>b.tag==='h3'?<h2 key={i}>{b.text}</h2>:<p key={i}>{b.text}</p>)}</article></section><section className="related section-pad"><h2>More insights to explore.</h2><div className="article-grid three-columns">{articles.filter(x=>x.slug!==a.slug).slice(0,3).map(x=><ArticleCard key={x.slug} article={x}/>)}</div></section></>}
const awards=[['IDEA Awards','THE COVE',2023,'Recognized in the residential category for exceptional use of natural materials and coastal-inspired spatial planning.'],['Dezeen','VERDANA HQ',2022,'Shortlisted for best commercial interior, praised for its balance of biophilic design and flexible workspaces.'],['ELLE Design','ALDERTON',2021,'Won best home renovation for a full-scale residential transformation rooted in open-plan living and tactile materiality.'],['Frame Awards','STUDIO NOIR',2023,'Honored in the hospitality and experience category for a moody, high-contrast fit-out that redefined the studio environment.'],['Architizer A+','THE COVE',2022,'Won in the residential interiors category for its refined approach to vacation property design and FF&E curation.']];
function AwardRow({award:[name,project,year,description],index}){const [open,setOpen]=useState(index===0);return <div className={'award-row '+(open?'open':'')}><button className="award-toggle" aria-expanded={open} aria-controls={'award-'+index} onClick={()=>setOpen(!open)}><span className="award-name"><span className="service-plus" aria-hidden="true"/>{name}</span><span className="small">{project}</span><span>{year}</span></button><div id={'award-'+index} className="award-content" inert={!open} onTransitionEnd={e=>{if(e.propertyName==='grid-template-rows')ScrollTrigger.refresh();}}><div><p>{description}</p><Media media={data.aboutRoles.awards[index]}/></div></div></div>}
function Counter({value,suffix}){const ref=useRef();useGSAP(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const counter={value:0};gsap.to(counter,{value,duration:1.7,ease:'power2.out',scrollTrigger:{trigger:ref.current,start:'top 95%',once:true},onUpdate:()=>{ref.current.textContent=Math.round(counter.value)+suffix;}});},{scope:ref});return <strong ref={ref}>{value}{suffix}</strong>}
function About(){const teamNames=['Elena Decode','Marcus Hale','May Lee','Sarah Cole','Chloe Wren','Soo-Yeon Park'];const roles=['Founder and Creative Director','Senior Interior Designer','Project Manager','FF&E Specialist','Junior Designer','Brand and Communications'];const media=data.aboutRoles;const [paused,setPaused]=useState(false);return <><section className="about-intro section-pad"><h1 className="entrance">Our Story.</h1><div><p>Decode began as a small practice in Brooklyn, New York, built on one belief: good design should feel personal before it looks impressive.</p><p>A decade later, that still drives every project we take on, across residential, commercial, and hospitality spaces.</p><span className="small trusted-label">TRUSTED BY GREAT CLIENTS ↳</span></div></section><div className={'logo-strip '+(paused?'paused':'')}><div className="gallery-track">{[...media.logos,...media.logos,...media.logos].map((m,i)=><div key={i}><Media media={m}/></div>)}</div><button className="pause" onClick={()=>setPaused(!paused)}>{paused?'Play':'Pause'}</button></div><section className="about-photo section-pad"><Media media={media.main}/><span>DECODE.</span></section><section className="awards section-pad"><AnimatedText as="h2" text="A decade of work, recognized."/><div>{awards.map((a,i)=><AwardRow key={a[0]} award={a} index={i}/>)}</div></section><section className="stats section-pad">{[['Projects Completed',200,'+'],['Industry Awards',18,'+'],['Years of Experience',20,'+'],['Client Return Rate',78,'%']].map(([l,v,s])=><div key={l}><p>{l}</p><Counter value={v} suffix={s}/></div>)}</section><section className="team section-pad"><div className="team-intro"><span className="small reveal-label">WHO'S BEHIND THE WORK</span><AnimatedText as="h2" text="Designers, thinkers, and makers."/><div className="studio-address"><h3>197 Bridge Street, Brooklyn, New York.</h3><p>Visit us at our studio in Brooklyn, New York. We're a small team with a big range of perspective, and that mix is what makes every Decode project feel considered from every angle.</p></div></div><div className="team-grid">{teamNames.map((n,i)=><div className="team-card" key={n}><Media media={media.team[i]}/><div><h3>{n}</h3><p>{roles[i]}</p></div></div>)}</div></section><Contact/></>}
function App(){const [path,setPath]=useState(location.pathname);const root=useRef();useEffect(()=>{history.scrollRestoration='manual';const changeRoute=()=>{const update=()=>flushSync(()=>setPath(location.pathname));if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.startViewTransition(update);else update();};const pop=()=>changeRoute();addEventListener('popstate',pop);function click(e){const a=e.target.closest('a');if(!a||a.hasAttribute('data-native-navigation')||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const u=new URL(a.href);if(u.origin!==location.origin)return;e.preventDefault();if(u.pathname===location.pathname){if(u.hash)document.querySelector(u.hash)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});else window.scrollTo({top:0,behavior:'smooth'});history.pushState({},'',u);return;}history.pushState({},'',u);changeRoute();if(u.hash)requestAnimationFrame(()=>document.querySelector(u.hash)?.scrollIntoView());}document.addEventListener('click',click);return()=>{removeEventListener('popstate',pop);document.removeEventListener('click',click);};},[]);const project=projects.find(p=>path==='/projects/'+p.slug);const article=articles.find(a=>path==='/articles/'+a.slug);const dark=path==='/'||!!project||!!article;useLayoutEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[path]);useEffect(()=>{document.title=project?project.title:article?article.title:'Decode — '+(path==='/about'?'Our Story':path==='/projects'?'Selected Projects':path==='/articles'?'Studio Insights':'Interior Design');if(location.hash)requestAnimationFrame(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:'instant'}));},[path]);useGSAP(()=>{const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{
const intro=gsap.timeline({defaults:{ease:'power3.out'}});
intro.from('header',{autoAlpha:0,y:-40,duration:1.1},0);
if(path==='/'){
 intro.from('.hero-background',{scale:1.3,opacity:0,duration:1.7,ease:'power2.out'},0).from('.hero-content',{opacity:0,duration:1.1},.55);
 if(matchMedia('(min-width:810px)').matches)gsap.to('.home-hero',{opacity:0,ease:'none',scrollTrigger:{trigger:'.home-hero',start:'top top',end:'+=100%',scrub:true}});
 gsap.to('.hero-content',{scale:.9,ease:'none',scrollTrigger:{trigger:'.home-hero',start:'top top',end:'+=100%',scrub:true}});
}else{
 const cover=gsap.utils.toArray('.detail-hero .hero-media,.article-hero .hero-media');if(cover.length)intro.from(cover,{scale:article?1.2:1.1,opacity:0,duration:1.3},0);if(article)intro.from('.title-word',{opacity:0,y:40,stagger:.07,duration:.8},.3);const entrances=gsap.utils.toArray('.entrance');if(entrances.length)intro.from(entrances,{opacity:0,y:40,duration:1},.2);
}
gsap.utils.toArray('.service-accordion,.reveal-label,.project-summary,.story-copy,.article-body article,.award,.team-card,.contact-layout,footer .footer-top,.related>h2').forEach(el=>gsap.from(el,{opacity:0,y:20,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},clearProps:'transform,opacity'}));
gsap.utils.toArray('.character-reveal').forEach(el=>gsap.from(el.querySelectorAll('.char'),{opacity:0,y:20,duration:.55,stagger:.012,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%',once:true},clearProps:'transform,opacity'}));
gsap.utils.toArray('.compact-projects .project-card,.home-article,.related .article-card').forEach(el=>gsap.from(el,{opacity:0,duration:.9,scrollTrigger:{trigger:el,start:'top 96%',once:true},clearProps:'opacity'}));
});return()=>mm.revert();},{scope:root,dependencies:[path],revertOnUpdate:true});return <div ref={root} className={path==='/'?'home-page':''}><Header key={'header-'+path} dark={dark}/><main key={'main-'+path}>{path==='/'?<Home/>:path==='/projects'?<Listing/>:path==='/articles'?<Listing journal/>:path==='/about'?<About/>:project?<ProjectDetail project={project}/>:article?<ArticleDetail article={article}/>:<section className="listing section-pad"><h1>Page not found.</h1><a href="/">Return home</a></section>}</main><Footer dark={path!=='/'&&path!=='/about'}/></div>}
export default App;
