"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode, type FormEvent } from "react";
import Lenis from "lenis";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Camera, Menu, MessageCircle, Sparkles, X } from "lucide-react";
import type { Artwork, SiteSettings, Workshop } from "@/lib/server-data";
import { ART_FORMS, RECOGNITION } from "@/lib/data";
import InkCanvas from "./InkCanvas";
import "./studio.css";

const navigation = [["The studio", "about"], ["Selected work", "gallery"], ["Art classes", "art-forms"], ["Workshops", "workshops"]];
const categories = ["All", "Traditional", "Painting", "Drawing & Patterns", "Fabric & Crafts", "Kids"];

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`kv-eyebrow${light ? " kv-light" : ""}`}><span />{children}</p>;
}
function Pill({ children, onClick, href, light = false, outline = false, external = false }: { children: ReactNode; onClick?: () => void; href?: string; light?: boolean; outline?: boolean; external?: boolean }) {
  const cls=`kv-pill${light ? " kv-pill-light" : ""}${outline ? " kv-pill-outline" : ""}`;
  const content=<>{children}<span><ArrowUpRight size={18} strokeWidth={1.6} /></span></>;
  return href ? <a className={cls} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{content}</a> : <button className={cls} onClick={onClick}>{content}</button>;
}

function Modal({ children, title, close, wide = false }: { children: ReactNode; title: string; close: () => void; wide?: boolean }) {
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null;
    const original=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const root=document.getElementById("kv-content"); root?.setAttribute("inert", "");
    const panel=ref.current;
    panel?.querySelector<HTMLElement>("button, input, a, select, textarea")?.focus();
    const keyboard=(e: KeyboardEvent)=>{
      if(e.key==="Escape") { e.preventDefault(); close(); }
      if(e.key!=="Tab" || !panel) return;
      const nodes=Array.from(panel.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]'));
      const first=nodes[0],last=nodes[nodes.length-1];
      if(e.shiftKey && document.activeElement===first) {e.preventDefault();last?.focus();}
      else if(!e.shiftKey && document.activeElement===last) {e.preventDefault();first?.focus();}
    };
    document.addEventListener("keydown",keyboard);
    return ()=>{document.body.style.overflow=original;root?.removeAttribute("inert");document.removeEventListener("keydown",keyboard);previous?.focus();};
  },[close]);
  return <div className="kv-overlay" data-lenis-prevent onClick={close}><div ref={ref} role="dialog" aria-modal="true" aria-label={title} className={`kv-modal${wide ? " kv-modal-wide" : ""}`} onClick={e=>e.stopPropagation()}><button className="kv-icon kv-close" aria-label="Close dialog" onClick={close}><X size={21}/></button>{children}</div></div>;
}

export default function StudioPage({artworks, workshops, settings}: {artworks: Artwork[];workshops: Workshop[];settings: SiteSettings}) {
  const [overlay,setOverlay]=useState<"menu"|"enquiry"|null>(null);
  const [lightbox,setLightbox]=useState<{image:string;alt:string;title:string;description?:string}|null>(null);
  const [filter,setFilter]=useState("All"),[expanded,setExpanded]=useState(false);
  const [classCategory,setClassCategory]=useState("All");
  const [featured,setFeatured]=useState(0);
  const [interest,setInterest]=useState("Art classes");
  const [enquiryLink,setEnquiryLink]=useState("");
  const [clock,setClock]=useState("");
  const [intro,setIntro]=useState(true),[progress,setProgress]=useState(0),[introOut,setIntroOut]=useState(false);
  const lenis=useRef<Lenis|null>(null);
  const closeOverlay=useRef(()=>{setOverlay(null);setEnquiryLink("");}).current;
  const closeLightbox=useRef(()=>setLightbox(null)).current;
  const wa=(message: string)=>`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(message)}`;
  const enquire=(value="Art classes")=>{setInterest(value);setEnquiryLink("");setOverlay("enquiry");};
  const collection=artworks.filter(a=>filter==="All"||a.category===filter);
  const displayed=expanded?collection:collection.slice(0,4);
  const art=artworks[featured%Math.max(artworks.length,1)];
  const classes=ART_FORMS.filter(a=>classCategory==="All"||a.category===classCategory);

  useEffect(()=>{
    let seen=false;try{seen=sessionStorage.getItem("kv-intro")==="yes";}catch{}
    if(seen || matchMedia("(prefers-reduced-motion: reduce)").matches){setIntro(false);return;}
    const start=performance.now();let frame=0;let timer:ReturnType<typeof setTimeout>;
    const tick=(now:number)=>{const t=Math.min((now-start)/950,1);setProgress(Math.round((1-Math.pow(1-t,3))*100));if(t<1)frame=requestAnimationFrame(tick);else{setIntroOut(true);timer=setTimeout(()=>{setIntro(false);try{sessionStorage.setItem("kv-intro","yes");}catch{}},620);}};
    frame=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(frame);clearTimeout(timer);};
  },[]);

  useEffect(()=>{
    const media=matchMedia("(prefers-reduced-motion: reduce)");
    if(media.matches)return;
    const scroll=new Lenis({autoRaf:true,smoothWheel:true,duration:1.05,anchors:{offset:-92}});lenis.current=scroll;
    return()=>{scroll.destroy();lenis.current=null;};
  },[]);
  useEffect(()=>{
    const locked=!!overlay||!!lightbox||intro;
    if(locked)lenis.current?.stop();else lenis.current?.start();
    if(intro) {const old=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=old;};}
  },[overlay,lightbox,intro]);
  useEffect(()=>{
    const tick=()=>setClock(new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date()));tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[]);
  useEffect(()=>{
    const root=document.querySelector(".kv-studio");if(!root)return;
    root.classList.add("kv-motion");
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("kv-visible");observer.unobserve(e.target);}}),{threshold:.08});
    root.querySelectorAll(".kv-reveal").forEach(el=>observer.observe(el));return()=>observer.disconnect();
  },[expanded,classCategory,filter]);

  const submit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();const data=new FormData(event.currentTarget);
    setEnquiryLink(wa(`Hello ${settings.founderName}, I'd like to enquire about ${data.get("interest")}.\nName: ${data.get("name")}\nContact: ${data.get("contact")}\n${data.get("message")||"Please share the available classes and details."}`));
  };

  return <div className={`kv-studio${!intro ? " kv-ready" : ""}`}>
    {intro&&<div className={`kv-intro${introOut?" kv-intro-out":""}`} aria-hidden="true"><div><Sparkles size={27}/><strong>Kalavridhi<span>Grow your dream.</span></strong></div><p>A little colour. Endless possibilities.</p><div className="kv-intro-track"><i style={{width:`${progress}%`}}/></div><div className="kv-intro-count"><span>ENTERING THE STUDIO</span><span>{String(progress).padStart(3,"0")}</span></div></div>}
    <div id="kv-content">
    <a className="kv-skip" href="#main">Skip to content</a>
    <header className="kv-header">
      <a href="#home" className="kv-brand" aria-label={`${settings.siteName} home`}><Image src="/images/logo/logo.png" width={50} height={50} alt=""/><span>kalavridhi<small>ARTS & CREATIVE EXPERIENCES</small></span></a>
      <nav aria-label="Main navigation">{navigation.map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <div className="kv-header-right"><span className="kv-clock">INDIA <span>{clock||"—:—"}</span></span><button className="kv-menu-button" onClick={()=>setOverlay("menu")} aria-label="Open navigation menu" aria-expanded={overlay==="menu"}>Menu<Menu size={17}/></button></div>
    </header>

    <main id="main">
      <section id="home" className="kv-hero" aria-labelledby="kv-hero-title">
        <div className="kv-hero-photo"><Image src="/images/founder/nishkala-fabric-hoop.jpeg" alt="Nishkala Krishna with her colourful hand-painted peacock fabric artwork" fill sizes="100vw" preload /></div>
        <div className="kv-hero-wash" aria-hidden="true"/>
        <InkCanvas/>
        <div className="kv-hero-content kv-shell">
          <div className="kv-hero-copy"><Eyebrow>A space to learn. A world to create.</Eyebrow>
            <h1 id="kv-hero-title">{settings.heroHeading==="Where Creativity Blooms." ? <><span>Where</span><span>creativity</span><span className="kv-colour-word">blooms.</span></> : <span>{settings.heroHeading}</span>}</h1>
            <p className="kv-hero-description">{settings.heroSubheading}</p>
            <div className="kv-hero-actions"><Pill href="#art-forms">Explore art classes</Pill><button className="kv-text-link" onClick={()=>enquire()}>Let&apos;s talk <ArrowUpRight size={18}/></button></div>
            <p className="kv-hero-note"><span className="kv-avatar"><Image src="/images/founder/nishkala-blue-painting.jpeg" alt="" fill sizes="36px"/></span>Led by {settings.founderName}<span className="kv-note-dot"/>{settings.yearsExperience} years of artistic experience</p>
          </div>
          <div className="kv-hero-aside"><span className="kv-photo-caption">THE ARTIST, IN HER ELEMENT.<br/><span>Real hands. Real art. Your next beginning.</span></span>
            {art&&<div className="kv-feature-card"><button className="kv-feature-image" onClick={()=>setLightbox(art)} aria-label={`Enlarge ${art.title}`}><Image src={art.image} alt={art.alt} fill sizes="110px"/></button><div><span className="kv-micro">FROM THE STUDIO</span><strong key={art.id}>{art.title}</strong><div className="kv-feature-controls"><span>{String(featured+1).padStart(2,"0")} / {String(artworks.length).padStart(2,"0")}</span><button aria-label="Previous featured artwork" onClick={()=>setFeatured((featured-1+artworks.length)%artworks.length)}><ArrowLeft size={15}/></button><button aria-label="Next featured artwork" onClick={()=>setFeatured((featured+1)%artworks.length)}><ArrowRight size={15}/></button></div></div></div>}
          </div>
        </div>
        <div className="kv-hero-watermark" aria-hidden="true">KALAVRIDHI</div>
        <div className="kv-hero-bottom kv-shell"><span>TRADITIONAL ROOTS. BOUNDLESS EXPRESSION.</span><a href="#about">SCROLL TO DISCOVER <ArrowDown size={15}/></a></div>
      </section>

      <section id="about" className="kv-about kv-shell kv-space">
        <div className="kv-about-visual kv-reveal"><div className="kv-portrait"><Image src="/images/founder/nishkala-blue-painting.jpeg" alt="Nishkala carefully painting a Krishna and Radha artwork" fill sizes="(max-width: 760px) 90vw, 40vw"/></div><div className="kv-experience"><strong>{settings.yearsExperience}<span>+</span></strong><span>YEARS OF ART,<br/>HEART & CURIOSITY</span></div><span className="kv-image-note">NISHKALA KRISHNA · ARTIST & EDUCATOR</span></div>
        <div className="kv-about-copy kv-reveal"><Eyebrow>The heart behind the art</Eyebrow><h2>Art is a skill.<br/><span className="kv-muted">And a little bit<br/>of finding yourself.</span></h2><p>{settings.shortBio}</p><div className="kv-qualifications">{settings.qualifications.map(q=><span key={q}>{q}</span>)}</div><div className="kv-about-links"><Pill onClick={()=>enquire()}>Meet your creative side</Pill><a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="kv-icon" aria-label="Kalavridhi on Instagram"><Camera size={20}/></a></div></div>
      </section>

      <div className="kv-create-band kv-shell kv-reveal" aria-label="Learn, create, bloom"><span>Learn.</span><span>Create.</span><span><ArrowRight strokeWidth={1} aria-hidden="true"/></span><span>Bloom.</span></div>

      <section id="gallery" className="kv-gallery kv-shell kv-space">
        <div className="kv-section-top kv-reveal"><div><Eyebrow>Made with patience. Filled with colour.</Eyebrow><h2>A world in<br/><span className="kv-muted">every brushstroke.</span></h2></div><p>Traditional stories. Contemporary expression.<br/>Original artworks from Nishkala&apos;s studio.</p></div>
        <div className="kv-filter" aria-label="Filter artworks">{categories.filter(c=>c==="All"||artworks.some(a=>a.category===c)).map(c=><button key={c} aria-pressed={filter===c} onClick={()=>{setFilter(c);setExpanded(false);}} className={filter===c?"kv-active":""}>{c}</button>)}</div>
        <div className="kv-art-grid">{displayed.map((a,i)=><button className="kv-art-card kv-reveal" key={a.id} onClick={()=>setLightbox(a)} aria-label={`View ${a.title}`}><div className="kv-art-meta"><span>{a.category} / {String(i+1).padStart(2,"0")}</span><span className="kv-card-arrow"><ArrowUpRight size={23}/></span></div><div className="kv-art-image"><Image src={a.image} alt={a.alt} fill sizes="(max-width: 760px) 90vw, 44vw"/></div><div className="kv-art-info"><div><h3>{a.title}</h3><p>{a.medium||a.artForm}</p></div><span className="kv-tag">{a.artForm}</span></div></button>)}</div>
        {collection.length===0&&<p className="kv-empty">New work is on its way. Explore another category.</p>}
        {collection.length>4&&<div className="kv-center"><Pill outline onClick={()=>setExpanded(!expanded)}>{expanded?"Show selected works":`Explore all ${collection.length} artworks`}</Pill></div>}
      </section>

      <section id="art-forms" className="kv-classes kv-space"><div className="kv-shell"><div className="kv-section-top kv-reveal"><div><Eyebrow>Your next creative beginning</Eyebrow><h2>Find your medium.<br/><span className="kv-muted">Make it your own.</span></h2></div><p>From your very first line to your next masterpiece.<br/>Patient guidance. Space to experiment.</p></div>
        <div className="kv-filter" aria-label="Filter art classes">{categories.map(c=><button key={c} aria-pressed={classCategory===c} className={classCategory===c?"kv-active":""} onClick={()=>setClassCategory(c)}>{c}</button>)}</div>
        <div className="kv-class-list">{classes.map((a,i)=><button key={a.id} className="kv-class-row" onClick={()=>enquire(a.name)}><span className="kv-class-number">{String(i+1).padStart(2,"0")}</span>{a.image&&<span className="kv-class-thumb"><Image src={a.image} alt="" fill sizes="64px"/></span>}<span className="kv-class-name">{a.name}<small>{a.category}</small></span><span className="kv-class-description">{a.tagline}</span><span className="kv-class-arrow"><ArrowUpRight size={21}/></span></button>)}</div>
        <div className="kv-class-bottom"><span><Check size={16}/> For children & adults <span>·</span> Beginners welcome</span><button className="kv-text-link" onClick={()=>enquire("Help choosing an art class")}>Not sure where to start? Let&apos;s find your fit <ArrowUpRight size={17}/></button></div>
      </div></section>

      <section id="workshops" className="kv-workshops kv-shell kv-space"><div className="kv-section-top kv-reveal"><div><Eyebrow>A little time. Something beautiful.</Eyebrow><h2>Come for the art.<br/><span className="kv-muted">Stay for the joy.</span></h2></div><Pill outline onClick={()=>enquire("Upcoming workshops")}>Find your next workshop</Pill></div>
        <div className="kv-workshop-grid kv-reveal">{[{image:"workshop-adult-butterfly.jpeg",alt:"Women holding their completed butterfly fabric hoop paintings",title:"New skills. Shared smiles.",label:"ADULT WORKSHOPS"},{image:"workshop-fabric-hoop-kids.jpg",alt:"Children and teens painting flower hoops together",title:"Small hands. Big imaginations.",label:"CHILDREN'S SESSIONS"},{image:"workshop-adult-fabric.jpeg",alt:"Participants painting fabric together during a workshop",title:"A moment to make your own.",label:"CREATIVE EXPERIENCES"}].map(w=><div className="kv-workshop-photo" key={w.image}><Image src={`/images/workshop/${w.image}`} alt={w.alt} fill sizes="(max-width: 760px) 85vw, 30vw"/><div><span className="kv-micro">{w.label}</span><h3>{w.title}</h3></div></div>)}</div>
        <div id="upcoming-classes" className="kv-upcoming kv-reveal"><div><span className="kv-live-dot"/><span className="kv-micro">NEXT AT THE STUDIO</span></div>{workshops.length ? <div className="kv-session-list">{workshops.map(w=><div key={w.id}><h3>{w.title}</h3><p>{w.description}</p>{w.startAt&&<span>{new Intl.DateTimeFormat("en-IN",{dateStyle:"medium",timeZone:w.timezone||"Asia/Kolkata"}).format(new Date(w.startAt))}{w.location?` · ${w.location}`:""}</span>}{w.registrationOpen?<Pill onClick={()=>enquire(w.title)}>Enquire about this session</Pill>:<span className="kv-tag">Registration closed</span>}</div>)}</div>:<><div><h3>Your next creative adventure is on its way.</h3><p>New batches and workshops are announced on WhatsApp and Instagram.</p></div><button className="kv-text-link" onClick={()=>enquire("The next class or workshop batch")}>Ask about the next batch <ArrowUpRight size={18}/></button></>}</div>
      </section>

      <section className="kv-facts kv-shell kv-reveal" aria-label="The studio at a glance"><div><Eyebrow light>Rooted in craft. Open to everyone.</Eyebrow><h2>A practice of art.<br/>A passion for sharing it.</h2></div><div className="kv-fact"><strong>{settings.yearsExperience}<span>+</span></strong><p>Years of artistic experience</p></div><div className="kv-fact"><strong>{ART_FORMS.length}</strong><p>Art forms to explore</p></div><div className="kv-fact"><Sparkles size={43} strokeWidth={1}/><p>Children & adults welcome</p></div></section>

      <section id="recognition" className="kv-recognition kv-shell kv-space"><div className="kv-section-top kv-reveal"><div><Eyebrow>Milestones along the way</Eyebrow><h2>Craft, community<br/><span className="kv-muted">& a little recognition.</span></h2></div><p>Celebrating dedication to art,<br/>teaching, and creative community.</p></div><div className="kv-award-grid">{RECOGNITION.filter(r=>r.image).map(r=><button className="kv-award kv-reveal" key={r.id} onClick={()=>setLightbox({image:r.image!,alt:r.alt,title:r.caption,description:r.organization})}><span className="kv-award-image"><Image src={r.image!} alt={r.alt} fill sizes="160px"/></span><span><small className="kv-micro">{r.period}</small><strong>{r.caption}</strong><span>{r.organization}</span></span><ArrowUpRight size={22}/></button>)}</div></section>
    </main>

    <footer id="contact" className="kv-footer"><div className="kv-shell"><div className="kv-footer-cta kv-reveal"><div><Eyebrow light>Your imagination is a good place to start.</Eyebrow><h2>Let&apos;s make<br/>something <span>beautiful.</span></h2></div><Pill light onClick={()=>enquire()}>Start your creative journey</Pill></div><div className="kv-footer-grid"><div><a className="kv-footer-brand" href="#home">kalavridhi<span>ARTS</span></a><p>{settings.tagline}.<br/>Art classes, original artworks, and creative<br/>experiences with {settings.founderName}.</p></div><div><span className="kv-micro">EXPLORE</span>{navigation.map(([label,id])=><a href={`#${id}`} key={id}>{label}<ArrowUpRight size={13}/></a>)}</div><div><span className="kv-micro">LET&apos;S CONNECT</span><a href={wa("Hello, I would like to know more about Kalavridhi Arts.")} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={14}/></a><a href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={14}/></a>{settings.contactEmail&&<a href={`mailto:${settings.contactEmail}`}>Email <ArrowUpRight size={14}/></a>}<button onClick={()=>enquire()}>Enquire about a class <ArrowUpRight size={14}/></button></div></div><div className="kv-legal"><span>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</span><span>MADE OF COLOUR. MADE WITH HEART.</span><a href="#home">Back to top <ArrowUpRight size={14}/></a></div><div className="kv-footer-watermark" aria-hidden="true">KALAVRIDHI</div></div></footer>
    <button className="kv-floating-contact" onClick={()=>enquire()} aria-label="Enquire about art classes"><MessageCircle size={22}/><span>Let&apos;s create</span></button>
    </div>

    {overlay==="menu"&&<Modal title="Navigation" close={closeOverlay} wide><div className="kv-menu-content"><span className="kv-micro">KALAVRIDHI ARTS · GROW YOUR DREAM</span><nav aria-label="Expanded navigation">{[["Home","home"],...navigation,["Get in touch","contact"]].map(([label,id],i)=><a key={id} href={`#${id}`} onClick={closeOverlay}><small>0{i+1}</small>{label}<ArrowUpRight/></a>)}</nav><div><span>India · {clock} IST</span><button onClick={()=>enquire()}>Start your creative journey <ArrowUpRight size={18}/></button></div></div></Modal>}
    {overlay==="enquiry"&&<Modal title="Enquire with Kalavridhi Arts" close={closeOverlay}><div className="kv-enquiry"><Eyebrow>Something creative starts here</Eyebrow><h2>Make room<br/>for a little colour.</h2>{settings.enableEnquiryForm ? enquiryLink ? <div className="kv-enquiry-ready"><span className="kv-ready-icon"><Check size={25}/></span><h3>Your message is ready.</h3><p>Continue to WhatsApp, review your message, and tap send to contact {settings.founderName}.</p><Pill href={enquiryLink} external>Continue in WhatsApp</Pill><button className="kv-text-link" onClick={()=>setEnquiryLink("")}>Edit your details <ArrowLeft size={16}/></button></div>:<form onSubmit={submit}><label>Your name<input name="name" autoComplete="name" placeholder="What should we call you?" required maxLength={100}/></label><label>Phone or email<input name="contact" autoComplete="email" placeholder="How can we reach you?" required maxLength={180}/></label><label>I&apos;m interested in<select name="interest" value={interest} onChange={e=>setInterest(e.target.value)}>{Array.from(new Set([interest,"Art classes","Kids classes","Adult classes","Upcoming workshops","Artwork / commission enquiry",...ART_FORMS.map(a=>a.name)])).map(v=><option key={v}>{v}</option>)}</select></label><label>A little about what you have in mind<textarea name="message" rows={3} placeholder="Your interests, experience, or a question…" maxLength={1600}/></label><p className="kv-form-note">We&apos;ll prepare your message. You choose when to send it in WhatsApp.</p><button className="kv-pill" type="submit">Prepare my enquiry<span><ArrowUpRight size={18}/></span></button></form>:<><p>Talk to {settings.founderName} about classes, workshops, or original artworks.</p><Pill href={wa(`Hello, I would like to enquire about ${interest}.`)} external>Continue in WhatsApp</Pill></>}</div></Modal>}
    {lightbox&&<Modal title={lightbox.title} close={closeLightbox} wide><div className="kv-lightbox-image"><Image src={lightbox.image} alt={lightbox.alt} fill sizes="90vw"/></div><div className="kv-lightbox-caption"><div><h3>{lightbox.title}</h3>{lightbox.description&&<p>{lightbox.description}</p>}</div><button className="kv-text-link" onClick={()=>{setLightbox(null);enquire(lightbox.title);}}>Enquire <ArrowUpRight size={18}/></button></div></Modal>}
  </div>;
}

