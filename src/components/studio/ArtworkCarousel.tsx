"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { AnimatePresence, motion, useIsPresent, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import useDeckGesture from "./useDeckGesture";
import useCarouselPlayback from "./useCarouselPlayback";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import type { Artwork } from "@/lib/server-data";

const artworkColours: Record<string, [string, string, string]> = {
  "1": ["#e7e8fb", "#f6d481", "#5d66c4"],
  "2": ["#e2f1f0", "#f4c784", "#52b6a7"],
  "3": ["#f7e3ec", "#f8d78c", "#cf6896"],
  "4": ["#eceafa", "#d7d8ef", "#8777bd"],
  "5": ["#f7e3e9", "#e9a76b", "#cb587c"],
  "6": ["#e9ecfa", "#e9cb89", "#718cc2"],
  "7": ["#f0ecf8", "#d6c8e8", "#8a79ba"],
  "8": ["#fff2c8", "#95d8df", "#e5ab4f"],
  "9": ["#e9eefc", "#eccce6", "#6f8ccd"],
};
const fallbackColours: Record<string, [string, string, string]> = {
  Traditional: ["#f5e7ed", "#f4d28a", "#b86d9a"],
  Painting: ["#e9effb", "#f9d787", "#6098cd"],
  "Drawing & Patterns": ["#efebfa", "#dbd7f0", "#8675b5"],
  "Fabric & Crafts": ["#e8f2f1", "#f5d7a6", "#72aca8"],
  Kids: ["#fff1c9", "#f9c9df", "#e2a858"],
};
const tiltQuery = "(min-width:960px) and (hover:hover) and (pointer:fine)";
const subscribeTilt = (notify: () => void) => {
  const media = matchMedia(tiltQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const readTilt = () => matchMedia(tiltQuery).matches;
const serverTilt = () => false;

function ArtworkSheet({ artwork, index, total, direction, onOpen }: { artwork: Artwork; index: number; total: number; direction: number; onOpen: (artwork: Artwork) => void }) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const fine = useSyncExternalStore(subscribeTilt, readTilt, serverTilt);
  const tiltX = useMotionValue(0), tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 180, damping: 28 });
  const rotateY = useSpring(tiltY, { stiffness: 180, damping: 28 });
  const reset = () => { tiltX.set(0); tiltY.set(0); };
  return <motion.button className="kv-art-sheet kv-art-motion" aria-label={`View ${artwork.title}`} disabled={!present} tabIndex={present ? 0 : -1} aria-hidden={!present}
    custom={direction} variants={{ enter: (step: number) => ({ opacity: .35, x: reduced ? 0 : step * 30, scale: reduced ? 1 : .97 }), center: { opacity: 1, x: 0, scale: 1 }, leave: (step: number) => ({ opacity: 0, x: reduced ? 0 : -step * 28, scale: reduced ? 1 : .96 }) }}
    initial="enter" animate="center" exit="leave" transition={{ duration: reduced ? .12 : .38, ease: [.22, 1, .36, 1] }}
    whileHover={!reduced && fine ? { y: -5 } : undefined}
    style={{ rotateX: reduced || !fine ? 0 : rotateX, rotateY: reduced || !fine ? 0 : rotateY }}
    onPointerMove={event => {
      if (reduced || !fine || event.pointerType !== "mouse") return;
      const box = event.currentTarget.getBoundingClientRect();
      tiltX.set((.5 - (event.clientY - box.top) / box.height) * 3);
      tiltY.set(((event.clientX - box.left) / box.width - .5) * 3);
    }} onPointerLeave={reset} onPointerDown={reset} onBlur={reset} onClick={() => onOpen(artwork)}>
    <span className="kv-art-sheet-top"><span>FROM NISHKALA&apos;S STUDIO</span><span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span></span>
    <motion.span layoutId={`artwork-${artwork.id}`} className="kv-art-sheet-image" transition={{ layout: { duration: reduced ? 0 : .42, ease: [.22, 1, .36, 1] } }}>
      <Image unoptimized src={artwork.image} alt={artwork.alt} fill sizes="(max-width: 760px) 85vw, 630px" />
    </motion.span>
    <span className="kv-paper-curl" aria-hidden="true"/>
    <span className="kv-art-sheet-bottom"><span>{artwork.title}</span><ArrowUpRight size={19} /></span>
  </motion.button>;
}

export default function ArtworkCarousel({ artworks, onOpen }: { artworks: Artwork[]; onOpen: (artwork: Artwork) => void }) {
  const [position, setIndex] = useState(() => Math.max(0, artworks.findIndex(a => a.artForm === "Mandala Art")));
  const index = position % Math.max(artworks.length, 1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const total = artworks.length;
  const active = artworks[index];
  const next = artworks[(index + 1) % total];
  const colours = active ? artworkColours[active.id] ?? fallbackColours[active.category] ?? fallbackColours.Painting : fallbackColours.Painting;
  const palette = { "--gallery-wash": colours[0], "--gallery-highlight": colours[1], "--gallery-accent": colours[2] } as CSSProperties;

  const go = (step: 1 | -1) => {
    if (total < 2) return;
    const keepFocus = document.activeElement?.classList.contains("kv-art-sheet");
    setDirection(step);
    setIndex(current => (current + step + total) % total);
    if (keepFocus) carouselRef.current?.focus({ preventScroll: true });
  };
  const gesture = useDeckGesture(step => go(step));
  const playback = useCarouselPlayback(carouselRef, () => go(1), 2000, total);
  useEffect(() => { window.dispatchEvent(new Event("kv:artwork-change")); }, [active?.id]);
  if (!active) return <p className="kv-empty">New work is on its way. Explore another category.</p>;

  return <div ref={carouselRef} className="kv-art-carousel kv-reveal" style={palette} role="region" aria-roledescription="carousel" aria-label="Selected artworks" tabIndex={0} {...playback.events}
    onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); go(1); } else if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); } }}>
    <div className="kv-art-stage" {...gesture}>
      <div className="kv-art-ambient" aria-hidden="true" />
      {total > 1 && <motion.button key={`back-${next.id}`} className="kv-art-next-sheet" initial={false} animate={{ opacity: .86, rotate: 4, x: "3%" }} transition={{ duration: .35 }} onClick={() => go(1)} aria-label={`Next artwork: ${next.title}`} tabIndex={-1}>
        <Image unoptimized src={next.image} alt="" fill sizes="(max-width: 760px) 75vw, 450px" />
      </motion.button>}
      <AnimatePresence initial={false} custom={direction}>
        <ArtworkSheet key={active.id} artwork={active} index={index} total={total} direction={direction} onOpen={onOpen}/>
      </AnimatePresence>
    </div>
    <div className="kv-art-story" aria-live={playback.live} aria-atomic="true">
      <p className="kv-art-story-kicker">SELECTED WORK <span /> {active.category.toUpperCase()}</p>
      <motion.h3 key={active.id} initial={{ opacity: .6, y: reduced ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>{active.title}</motion.h3>
      <p className="kv-art-medium">{active.medium || active.artForm}</p>
      {active.description && <p className="kv-art-description">{active.description}</p>}
      <button className="kv-art-open" onClick={() => onOpen(active)}>View artwork <ArrowUpRight size={18} /></button>
      <div className="kv-art-pagination"><div><button onClick={() => go(-1)} disabled={total < 2} aria-label="Previous artwork"><ArrowLeft size={20} /></button><button onClick={() => go(1)} disabled={total < 2} aria-label="Next artwork"><ArrowRight size={20} /></button></div><span>{String(index + 1).padStart(2, "0")} <i /> {String(total).padStart(2, "0")}</span></div>
      <div className="kv-art-progress" aria-hidden="true"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
      <p className="kv-art-hint">Use the arrows or swipe to explore.</p>
      {!playback.reduced && total > 1 && <button className="kv-playback" onClick={playback.toggle} aria-label={`${playback.paused ? "Play" : "Pause"} selected artworks`}>{playback.paused ? <Play size={14}/> : <Pause size={14}/>}<span>{playback.paused ? "Play slideshow" : "Pause slideshow"}</span></button>}
    </div>
  </div>;
}
