"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const collections = {
  Workshops: [
    { image: "workshop-creative-group.jpg", alt: "Children and adults sharing artwork made during a creative workshop" },
    { image: "workshop-floral-craft.jpg", alt: "A group displaying colourful floral craft work from a workshop" },
    { image: "workshop-hoop-painting.jpg", alt: "Participants painting floral designs on fabric hoops" },
  ],
  Exhibitions: [
    { image: "exhibition-outdoor.jpg", alt: "Kalavridhi art and painted bags displayed at an outdoor exhibition" },
    { image: "exhibition-market.jpg", alt: "Colourful artwork and handmade pieces arranged at an exhibition stall" },
    { image: "exhibition-showcase.jpg", alt: "Nishkala presenting painted artwork at an exhibition" },
  ],
} as const;

type CollectionName = keyof typeof collections;

export default function WorkshopGallery() {
  const [collection, setCollection] = useState<CollectionName>("Workshops");
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const resumeAt = useRef(0);
  const items = collections[collection];
  const active = items[index];

  useEffect(() => {
    const node = galleryRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden || performance.now() < resumeAt.current) return;
      setIndex(current => (current + 1) % items.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [collection, isVisible, items.length]);

  const navigate = (step: number, interactionTime: number) => {
    resumeAt.current = interactionTime + 60_000;
    setIndex(current => (current + step + items.length) % items.length);
  };
  const chooseCollection = (name: CollectionName, interactionTime: number) => {
    resumeAt.current = interactionTime + 60_000;
    setCollection(name);
    setIndex(0);
  };

  return (
    <div ref={galleryRef} className="kv-moments kv-reveal" aria-label="Workshops and exhibitions">
      <div className="kv-moments-heading">
        <div className="kv-moments-tabs" role="tablist" aria-label="Photo collection">
          {(Object.keys(collections) as CollectionName[]).map(name => (
            <button key={name} type="button" role="tab" aria-selected={collection === name} className={collection === name ? "is-active" : ""} onClick={event => chooseCollection(name, event.timeStamp)}>{name}</button>
          ))}
        </div>
        <span>{String(index + 1).padStart(2, "0")} <i /> {String(items.length).padStart(2, "0")}</span>
      </div>
      <div className="kv-moments-frame" aria-live="polite" aria-atomic="true">
        <Image key={active.image} src={`/images/workshop/${active.image}`} alt={active.alt} fill sizes="(max-width: 760px) 92vw, 1200px" priority={collection === "Workshops" && index === 0} />
        <div className="kv-moments-caption"><span>{collection.toUpperCase()} · {String(index + 1).padStart(2, "0")}</span><strong>{collection === "Workshops" ? "Made together, one brushstroke at a time." : "A little colour, shared beyond the studio."}</strong></div>
        <div className="kv-moments-controls">
          <button type="button" onClick={event => navigate(-1, event.timeStamp)} aria-label={`Previous ${collection.toLowerCase()} photo`}><ArrowLeft size={19} /></button>
          <button type="button" onClick={event => navigate(1, event.timeStamp)} aria-label={`Next ${collection.toLowerCase()} photo`}><ArrowRight size={19} /></button>
        </div>
      </div>
      <div className="kv-moments-dots" aria-label={`${collection} photos`}>
        {items.map((item, itemIndex) => <button key={item.image} type="button" className={itemIndex === index ? "is-active" : ""} aria-label={`Show ${collection.toLowerCase()} photo ${itemIndex + 1}`} aria-current={itemIndex === index ? "true" : undefined} onClick={event => { resumeAt.current = event.timeStamp + 60_000; setIndex(itemIndex); }} />)}
      </div>
      <p className="kv-moments-note">Changes every 3.5 seconds · Use the arrows to explore at your pace.</p>
    </div>
  );
}
