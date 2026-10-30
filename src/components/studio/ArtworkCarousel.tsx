"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
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

export default function ArtworkCarousel({ artworks, onOpen }: { artworks: Artwork[]; onOpen: (artwork: Artwork) => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const total = artworks.length;
  const active = artworks[index];
  const next = artworks[(index + 1) % total];
  const colours = active ? artworkColours[active.id] ?? fallbackColours[active.category] ?? fallbackColours.Painting : fallbackColours.Painting;
  const palette = { "--gallery-wash": colours[0], "--gallery-highlight": colours[1], "--gallery-accent": colours[2] } as CSSProperties;

  const go = (step: 1 | -1) => {
    if (total < 2) return;
    setDirection(step);
    setIndex(current => (current + step + total) % total);
  };
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (touch) start.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    if (!start.current || !touch) return;
    const dx = touch.clientX - start.current.x;
    const dy = touch.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    swiped.current = true;
    go(dx < 0 ? 1 : -1);
    window.setTimeout(() => { swiped.current = false; }, 350);
  };
  if (!active) return <p className="kv-empty">New work is on its way. Explore another category.</p>;

  return <div className="kv-art-carousel kv-reveal" style={palette} role="region" aria-roledescription="carousel" aria-label="Selected artworks" tabIndex={0}
    onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); go(1); } else if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); } }}>
    <div className="kv-art-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="kv-art-ambient" aria-hidden="true" />
      {total > 1 && <button className="kv-art-next-sheet" onClick={() => go(1)} aria-label={`Next artwork: ${next.title}`} tabIndex={-1}>
        <Image src={next.image} alt="" fill sizes="(max-width: 760px) 75vw, 450px" />
      </button>}
      <button key={active.id} className={`kv-art-sheet kv-art-enter-${direction === 1 ? "next" : "previous"}`} onClick={() => { if (!swiped.current) onOpen(active); }} aria-label={`View ${active.title}`}>
        <span className="kv-art-sheet-top"><span>FROM NISHKALA&apos;S STUDIO</span><span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span></span>
        <span className="kv-art-sheet-image"><Image src={active.image} alt={active.alt} fill sizes="(max-width: 760px) 85vw, 630px" priority={index === 0} /></span>
        <span className="kv-art-sheet-bottom"><span>{active.artForm}</span><ArrowUpRight size={19} /></span>
      </button>
    </div>
    <div className="kv-art-story" aria-live="polite" aria-atomic="true">
      <p className="kv-art-story-kicker">SELECTED WORK <span /> {active.category.toUpperCase()}</p>
      <h3 key={active.id}>{active.title}</h3>
      <p className="kv-art-medium">{active.medium || active.artForm}</p>
      {active.description && <p className="kv-art-description">{active.description}</p>}
      <button className="kv-art-open" onClick={() => onOpen(active)}>View artwork <ArrowUpRight size={18} /></button>
      <div className="kv-art-pagination"><div><button onClick={() => go(-1)} disabled={total < 2} aria-label="Previous artwork"><ArrowLeft size={20} /></button><button onClick={() => go(1)} disabled={total < 2} aria-label="Next artwork"><ArrowRight size={20} /></button></div><span>{String(index + 1).padStart(2, "0")} <i /> {String(total).padStart(2, "0")}</span></div>
      <div className="kv-art-progress" aria-hidden="true"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
      <p className="kv-art-hint">Use the arrows or swipe to explore.</p>
    </div>
  </div>;
}
