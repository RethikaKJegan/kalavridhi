"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Workshop } from "@/lib/server-data";
import useDeckGesture from "./useDeckGesture";
import useCarouselPlayback from "./useCarouselPlayback";

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
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const update = () => setVisibleCount(window.innerWidth <= 520 ? 1 : window.innerWidth <= 900 ? 2 : 3);
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", update); };
  }, []);


  const move = (step: number) => {
    setDirection(step);
    setIndex(current => (current + step + photos.length) % photos.length);
  };
  const gesture = useDeckGesture(step => move(step));
  const playback = useCarouselPlayback(galleryRef, () => move(1), 2600, photos.length);
  const visibleMoments = Array.from({ length: Math.min(visibleCount, photos.length) }, (_, slot) => ({ ...photos[(index + slot) % photos.length], number: (index + slot) % photos.length + 1 }));

  return (
    <div ref={galleryRef} className="kv-moments kv-reveal" role="region" aria-roledescription="carousel" aria-label="Workshop and exhibition photos" {...playback.events}>
      <link rel="prefetch" as="image" href={photos[(index+visibleCount)%photos.length].image}/>
      <div className="kv-moment-track" aria-live={playback.live} aria-atomic="true" {...gesture}>
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
      {visibleMoments.map(moment => (
        <motion.figure layout="position" className="kv-moment-card" key={`${moment.image}-${moment.number}`} custom={direction} variants={{enter:(step:number)=>({x:playback.reduced?0:step*70,opacity:0}),exit:(step:number)=>({x:playback.reduced?0:-step*70,opacity:0})}} initial="enter" animate={{x:0,opacity:1}} exit="exit" transition={{duration:playback.reduced?.12:.75,ease:[.22,1,.36,1]}}>
          <div className="kv-moment-photo">
            <Image unoptimized src={moment.image} alt={moment.alt} fill sizes="(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 30vw" />
            <span className="kv-moment-type">{moment.type}</span>
            <span className="kv-moment-index">{String(moment.number).padStart(2, "0")}</span>
          </div>
        </motion.figure>
      ))}
      </AnimatePresence></div>
      <div className="kv-moments-controls">
        <span>{String(index + 1).padStart(2, "0")} — {String((index + visibleCount - 1) % photos.length + 1).padStart(2, "0")} <i /> {String(photos.length).padStart(2, "0")}</span>
        {!playback.reduced && <button type="button" className="kv-playback" onClick={playback.toggle} aria-label={`${playback.paused ? "Play" : "Pause"} workshop slideshow`}>{playback.paused ? <Play size={15}/> : <Pause size={15}/>}</button>}
        <button type="button" onClick={() => move(-1)} aria-label="Previous workshop and exhibition photos"><ArrowLeft size={18} /></button>
        <button type="button" onClick={() => move(1)} aria-label="Next workshop and exhibition photos"><ArrowRight size={18} /></button>
      </div>
    </div>
  );
}
