"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode, type FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, Check, Menu, MessageCircle, Palette, Users, Flower2, X } from "lucide-react";
import type { Artwork, SiteSettings, Workshop } from "@/lib/server-data";
import { ART_FORMS, RECOGNITION } from "@/lib/data";
import SceneDecor from "./SceneDecor";
import HeroArtLayers from "./HeroArtLayers";
import BrushGuide from "./BrushGuide";
import InkCanvas from "./InkCanvas";
import ArtworkCarousel from "./ArtworkCarousel";
import WorkshopGallery from "./WorkshopGallery";
import "./studio.css";
import "./studio-refresh.css";
import "./studio-next.css";
import "./studio-approved.css";
import "./studio-phase-two.css";
import "./studio-living.css";

const navigation = [["The studio", "about"], ["Selected work", "gallery"], ["Workshops", "workshops"]];
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
  const studioRef = useRef<HTMLDivElement>(null);
  // Phase 2 is a static visual checkpoint. Existing motion source is retained for later.
  const [overlay,setOverlay]=useState<"menu"|"enquiry"|null>(null);
  const [lightbox,setLightbox]=useState<{image:string;alt:string;title:string;description?:string}|null>(null);
  const [filter,setFilter]=useState("All");
  const [interest,setInterest]=useState("Art classes");
  const [formError,setFormError]=useState("");
  const [enquiryLink,setEnquiryLink]=useState("");
  const [clock,setClock]=useState("");
  const closeOverlay=useCallback(()=>{setOverlay(null);setEnquiryLink("");},[]);
  const closeLightbox=useCallback(()=>setLightbox(null),[]);
  const wa=(message: string)=>`https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(message)}`;
  const enquire=(value="Art classes")=>{setInterest(value);setEnquiryLink("");setOverlay("enquiry");};
  const collection=artworks.filter(a=>filter==="All"||a.category===filter);
  useEffect(()=>{
    const tick=()=>setClock(new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date()));tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[]);

  const submit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();const data=new FormData(event.currentTarget);
    if(String(data.get("hp_field")||"").trim())return;
    const name=String(data.get("name")||"").trim();
    const contact=String(data.get("contact")||"").trim();
    const looksLikeEmail=contact.includes("@");
    const digits=contact.replace(/\D/g,"");
    if(!name){setFormError("Please enter your name.");return;}
    if(looksLikeEmail ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) : digits.length<10){setFormError(looksLikeEmail?"Please enter a valid email address.":"Please enter a phone number with at least 10 digits.");return;}
    setFormError("");
    setEnquiryLink(wa(`Hello ${settings.founderName}, I'd like to enquire about ${data.get("interest")}.\nName: ${name}\nContact: ${contact}\n${data.get("message")||"Please share the available classes and details."}`));
  };

  return <div ref={studioRef} className="kv-studio kv-approved">
    <InkCanvas/>
    <BrushGuide/>
    <div id="kv-content">
    <a className="kv-skip" href="#main">Skip to content</a>
    <header className="kv-header">
      <a href="#home" className="kv-brand kv-brand-pair" aria-label={`${settings.siteName} home`}><Image unoptimized className="kv-brand-square" src="/images/logo/kalavridhi-square.webp" width={72} height={72} alt=""/><Image unoptimized className="kv-brand-wordmark" src="/images/logo/kalavridhi-script-wordmark.webp" width={330} height={115} alt="Kalavridhi — Arts & Creative Experiences"/></a>
      <nav aria-label="Main navigation">{navigation.map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <div className="kv-header-right"><span className="kv-clock">INDIA <span>{clock||"—:—"}</span></span><button className="kv-menu-button" onClick={()=>setOverlay("menu")} aria-label="Open navigation menu" aria-expanded={overlay==="menu"}>Menu<Menu size={17}/></button></div>
    </header>

    <main id="main" tabIndex={-1}>
      <section id="home" className="kv-hero" aria-labelledby="kv-hero-title">
        <SceneDecor scene="hero"/>
        <div className="kv-hero-wash" aria-hidden="true"/>
        <div className="kv-hero-content kv-shell">
          <div className="kv-hero-copy"><Eyebrow>A space to learn. A world to create.</Eyebrow>
            <h1 id="kv-hero-title" tabIndex={-1}>{settings.heroHeading.toLowerCase()==="where creativity blooms." ? <><span>Where </span><span>creativity </span><span className="kv-colour-word">blooms.</span></> : <span>{settings.heroHeading}</span>}</h1>
            <p className="kv-hero-description">{settings.heroSubheading}</p>
            <div className="kv-hero-actions"><Pill href="#gallery">Explore the artwork</Pill><Pill outline onClick={()=>enquire()}>Let&apos;s talk</Pill></div>
            <ul className="kv-hero-benefits"><li><Palette/><span>Art Classes<br/>for All Ages</span></li><li><Users/><span>Workshops<br/>&amp; Events</span></li><li><Flower2/><span>Traditional<br/>&amp; Contemporary Art</span></li></ul>
          </div>
          <HeroArtLayers/>
        </div>
        <div className="kv-hero-bottom kv-shell"><span>TRADITIONAL ROOTS. BOUNDLESS EXPRESSION.</span><a href="#about">SCROLL TO DISCOVER <ArrowDown size={15}/></a></div>
      </section>

      <section id="about" className="kv-about kv-shell kv-space">
        <SceneDecor scene="about"/>
        <div className="kv-about-visual kv-reveal"><div className="kv-portrait"><Image unoptimized src="/images/founder/meet-nishkala.jpg" alt="Nishkala Krishna standing among her colourful paintings" fill sizes="(max-width: 760px) 90vw, 40vw"/></div><div className="kv-experience"><strong>{settings.yearsExperience}<span>+</span></strong><span>YEARS OF ART,<br/>HEART & CURIOSITY</span></div><span className="kv-image-note">NISHKALA KRISHNA · ARTIST & EDUCATOR</span></div>
        <div className="kv-about-copy kv-reveal"><Eyebrow>The heart behind the art</Eyebrow><h2>Meet <strong>{settings.founderName}.</strong></h2><p className="kv-about-deck">Art is a skill. And a little bit of finding yourself.</p><p>{settings.shortBio}</p><div className="kv-qualifications">{settings.qualifications.map(q=><span key={q}>{q}</span>)}</div><div className="kv-about-links"><Pill onClick={()=>enquire()}>Meet your creative side</Pill><Pill outline onClick={()=>enquire()}>Let&apos;s talk</Pill></div></div>
      </section>

      <section id="gallery" className="kv-gallery kv-shell kv-space">
        <SceneDecor scene="gallery"/>
        <div className="kv-section-top kv-reveal"><div><Eyebrow>Explore the art</Eyebrow><h2>A world in<br/><span className="kv-muted">every brushstroke.</span></h2></div><p>Traditional stories. Contemporary expression.<br/>Original artworks from Nishkala&apos;s studio.</p></div>
        <div className="kv-filter" aria-label="Filter artworks">{categories.filter(c=>c==="All"||artworks.some(a=>a.category===c)).map(c=><button key={c} aria-pressed={filter===c} onClick={()=>setFilter(c)} className={filter===c?"kv-active":""}>{c}</button>)}</div>
        <ArtworkCarousel key={filter} artworks={collection} onOpen={a=>setLightbox(a)} />
      </section>

      <section id="workshops" className="kv-workshops kv-shell kv-space"><SceneDecor scene="workshops"/><div className="kv-section-top kv-reveal"><div><Eyebrow>A little time. Something beautiful.</Eyebrow><h2>Workshops &amp; exhibitions.<br/><span className="kv-muted">Art shared together.</span></h2></div><Pill outline onClick={()=>enquire("Upcoming workshops")}>Find your next workshop</Pill></div>
        <WorkshopGallery workshops={workshops}/>
        <div id="upcoming-classes" className="kv-upcoming kv-reveal"><div><span className="kv-live-dot"/><span className="kv-micro">NEXT AT THE STUDIO</span></div>{workshops.length ? <div className="kv-session-list">{workshops.map(w=><div key={w.id}><h3>{w.title}</h3><p>{w.description}</p>{w.startAt&&<span>{new Intl.DateTimeFormat("en-IN",{dateStyle:"medium",timeZone:w.timezone||"Asia/Kolkata"}).format(new Date(w.startAt))}{w.location?` · ${w.location}`:""}</span>}{w.registrationOpen?<Pill href={wa(w.whatsappMessage||`Hello! I would like to register for the workshop '${w.title}'.`)} external>Register via WhatsApp</Pill>:<span className="kv-tag">Registration closed</span>}</div>)}</div>:<><div><h3>Your next creative adventure is on its way.</h3><p>New batches and workshops are announced on WhatsApp and Instagram.</p></div><button className="kv-text-link" onClick={()=>enquire("The next class or workshop batch")}>Ask about the next batch <ArrowUpRight size={18}/></button></>}</div>
      </section>

      <section id="recognition" className="kv-recognition kv-shell kv-space"><SceneDecor scene="recognition"/><div className="kv-section-top kv-reveal"><div><Eyebrow>Milestones along the way</Eyebrow><h2>Craft, community<br/><span className="kv-muted">& a little recognition.</span></h2></div><p>Celebrating dedication to art,<br/>teaching, and creative community.</p></div><div className="kv-award-grid">{RECOGNITION.filter(r=>r.image).map(r=><button className="kv-award kv-reveal" key={r.id} onClick={()=>setLightbox({image:r.image!,alt:r.alt,title:r.caption,description:r.organization})}><span className="kv-award-image"><Image unoptimized src={r.image!} alt={r.alt} fill sizes="160px"/></span><span><small className="kv-micro">{r.period}</small><strong>{r.caption}</strong><span>{r.organization}</span></span><ArrowUpRight size={22}/></button>)}</div></section>
    </main>

    <footer id="contact" className="kv-footer"><SceneDecor scene="footer"/><div className="kv-shell"><div className="kv-footer-cta kv-reveal"><div><Eyebrow light>Your imagination is a good place to start.</Eyebrow><h2>Let&apos;s make<br/>something <span>beautiful.</span></h2></div><Pill light onClick={()=>enquire()}>Start your creative journey</Pill></div><div className="kv-footer-grid"><div><a className="kv-footer-brand" href="#home">kalavridhi<span>ARTS</span></a><p>{settings.tagline}.<br/>Art classes, original artworks, and creative<br/>experiences with {settings.founderName}.</p></div><div><span className="kv-micro">EXPLORE</span>{navigation.map(([label,id])=><a href={`#${id}`} key={id}>{label}<ArrowUpRight size={13}/></a>)}</div><div><span className="kv-micro">LET&apos;S CONNECT</span><a href={wa("Hello, I would like to know more about Kalavridhi Arts.")} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={14}/></a><a href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={14}/></a>{settings.contactEmail&&<a href={`mailto:${settings.contactEmail}`}>Email <ArrowUpRight size={14}/></a>}<button onClick={()=>enquire()}>Enquire about a class <ArrowUpRight size={14}/></button></div></div><div className="kv-legal"><span>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</span><span>MADE OF COLOUR. MADE WITH HEART.</span><a href="#home" onClick={()=>requestAnimationFrame(()=>document.getElementById("kv-hero-title")?.focus({preventScroll:true}))}>Back to top <ArrowUpRight size={14}/></a></div><div className="kv-footer-watermark" aria-hidden="true">KALAVRIDHI</div></div></footer>
    <button className="kv-floating-contact" onClick={()=>enquire()} aria-label="Enquire about art classes"><MessageCircle size={22}/><span>Let&apos;s create</span></button>
    </div>

    {overlay==="menu"&&<Modal title="Navigation" close={closeOverlay} wide><div className="kv-menu-content"><span className="kv-micro">KALAVRIDHI ARTS · GROW YOUR DREAM</span><nav aria-label="Expanded navigation">{[["Home","home"],...navigation,["Get in touch","contact"]].map(([label,id],i)=><a key={id} href={`#${id}`} onClick={closeOverlay}><small>0{i+1}</small>{label}<ArrowUpRight/></a>)}</nav><div><span>India · {clock} IST</span><button onClick={()=>enquire()}>Start your creative journey <ArrowUpRight size={18}/></button></div></div></Modal>}
    {overlay==="enquiry"&&<Modal title="Enquire with Kalavridhi Arts" close={closeOverlay}><div className="kv-enquiry"><Eyebrow>Something creative starts here</Eyebrow><h2>Make room<br/>for a little colour.</h2>{settings.enableEnquiryForm ? enquiryLink ? <div className="kv-enquiry-ready"><span className="kv-ready-icon"><Check size={25}/></span><h3>Your message is ready.</h3><p>Continue to WhatsApp, review your message, and tap send to contact {settings.founderName}.</p><Pill href={enquiryLink} external>Continue in WhatsApp</Pill><button className="kv-text-link" onClick={()=>setEnquiryLink("")}>Edit your details <ArrowLeft size={16}/></button></div>:<form onSubmit={submit}><input name="hp_field" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{display:"none"}}/><p className="kv-form-error" role="alert" aria-live="polite">{formError}</p><label>Your name<input name="name" autoComplete="name" placeholder="What should we call you?" required maxLength={100}/></label><label>Phone or email<input name="contact" autoComplete="email" placeholder="How can we reach you?" required maxLength={180}/></label><label>I&apos;m interested in<select name="interest" value={interest} onChange={e=>{setInterest(e.target.value);setFormError("");}}>{Array.from(new Set([interest,"Art classes","Kids classes","Adult classes","Upcoming workshops","Artwork / commission enquiry",...ART_FORMS.map(a=>a.name)])).map(v=><option key={v}>{v}</option>)}</select></label><label>A little about what you have in mind<textarea name="message" rows={3} placeholder="Your interests, experience, or a question…" maxLength={1600}/></label><p className="kv-form-note">We&apos;ll prepare your message. You choose when to send it in WhatsApp.</p><button className="kv-pill" type="submit">Prepare my enquiry<span><ArrowUpRight size={18}/></span></button></form>:<><p>Talk to {settings.founderName} about classes, workshops, or original artworks.</p><Pill href={wa(`Hello, I would like to enquire about ${interest}.`)} external>Continue in WhatsApp</Pill></>}</div></Modal>}
    {lightbox&&<Modal title={lightbox.title} close={closeLightbox} wide><div className="kv-lightbox-image"><Image unoptimized src={lightbox.image} alt={lightbox.alt} fill sizes="90vw"/></div><div className="kv-lightbox-caption"><div><h3>{lightbox.title}</h3>{lightbox.description&&<p>{lightbox.description}</p>}</div><a className="kv-text-link" href={wa(`Hello Nishkala, I saw your artwork '${lightbox.title}' on Kalavridhi Arts and would like to enquire.`)} target="_blank" rel="noopener noreferrer">Enquire <ArrowUpRight size={18}/></a></div></Modal>}
  </div>;
}

