"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Workshop } from "@/lib/server-data";
import useDeckGesture from "./useDeckGesture";

const moments = [
  { image: "workshop-creative-group.jpg", type: "WORKSHOP", alt: "Children and adults sharing artwork made during a creative workshop" },
  { image: "workshop-floral-craft.jpg", type: "WORKSHOP", alt: "A group displaying colourful floral craft work from a workshop" },
  { image: "workshop-hoop-painting.jpg", type: "WORKSHOP", alt: "Participants painting floral designs on fabric hoops" },
  { image: "exhibition-outdoor.jpg", type: "EXHIBITION", alt: "Kalavridhi art and painted bags displayed at an outdoor exhibition" },
  { image: "exhibition-market.jpg", type: "EXHIBITION", alt: "Colourful artwork and handmade pieces arranged at an exhibition stall" },
  { image: "exhibition-showcase.jpg", type: "EXHIBITION", alt: "Nishkala presenting painted artwork at an exhibition" },
];

export default function WorkshopGallery({ workshops = [] }: { workshops?: Workshop[] }) {
  // Published CMS cover photos join the approved historical photo collection.
  const photos = [...workshops.filter(w => w.status === "published" && w.coverImage).map(w => ({image: w.coverImage!, type: "WORKSHOP", alt: w.title})), ...moments.map(m => ({...m, image: `/images/workshop/${m.image}`}))];
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const galleryRef = useRef<HTMLDivElement>(null);
  const resumeAt = useRef(0);

  useEffect(() => {
    const update = () => setVisibleCount(window.innerWidth <= 520 ? 1 : window.innerWidth <= 900 ? 2 : 3);
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", update); };
  }, []);


  const move = (step: number, interactionTime: number) => {
    resumeAt.current = interactionTime + 60_000;
    setIndex(current => (current + step + photos.length) % photos.length);
  };
  const gesture = useDeckGesture(step => move(step, performance.now()));
  const visibleMoments = Array.from({ length: Math.min(visibleCount, photos.length) }, (_, slot) => ({ ...photos[(index + slot) % photos.length], number: (index + slot) % photos.length + 1 }));

  return (
    <div ref={galleryRef} className="kv-moments kv-reveal" role="region" aria-roledescription="carousel" aria-label="Workshop and exhibition photos">
      <div className="kv-moment-track" aria-live="polite" aria-atomic="true" {...gesture}>
      {visibleMoments.map((moment, slot) => (
        <figure className="kv-moment-card" key={`${moment.image}-${slot}`}>
          <div className="kv-moment-photo">
            <Image unoptimized src={moment.image} alt={moment.alt} fill sizes="(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 30vw" />
            <span className="kv-moment-type">{moment.type}</span>
            <span className="kv-moment-index">{String(moment.number).padStart(2, "0")}</span>
          </div>
        </figure>
      ))}
      </div>
      <div className="kv-moments-controls">
        <span>{String(index + 1).padStart(2, "0")} — {String((index + visibleCount - 1) % photos.length + 1).padStart(2, "0")} <i /> {String(photos.length).padStart(2, "0")}</span>
        <button type="button" onClick={event => move(-1, event.timeStamp)} aria-label="Previous workshop and exhibition photos"><ArrowLeft size={18} /></button>
        <button type="button" onClick={event => move(1, event.timeStamp)} aria-label="Next workshop and exhibition photos"><ArrowRight size={18} /></button>
      </div>
    </div>
  );
}
