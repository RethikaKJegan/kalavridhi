"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useReducedMotion } from "motion/react";
import DecorativeAsset from "./DecorativeAsset";
import "./living-artwork.css";

export default function LivingArtwork({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ dispose: () => void; replay: () => void } | null>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const budId = `bud-${useId().replace(/:/g, "")}`;
  useEffect(() => {
    let cancelled = false;
    let started = false;
    const loader = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true; loader.disconnect();
      void import("./botanicalScene").then(({ mountBotanicalScene }) => {
        if (!cancelled && host.current) api.current = mountBotanicalScene(host.current, variant, value => { if (!cancelled) setReady(value); });
      }).catch(() => {});
    }, { rootMargin: "200px" });
    if (host.current) loader.observe(host.current);
    return () => { cancelled = true; loader.disconnect(); api.current?.dispose(); api.current = null; };
  }, [variant]);
  return <div className={`kv-living-artwork kv-living-${variant}`} data-ready={ready}>
    <div ref={host} className="kv-botanical-stage" aria-hidden="true">{variant === "footer" ? <DecorativeAsset name="lotus-sprig-v2" className="kv-lotus-fallback"/> : <svg className="kv-lotus-fallback" viewBox="0 0 240 320" fill="none">
      <defs><linearGradient id={budId} x1=".3" y1="0" x2=".7" y2="1"><stop stopColor="#cf397c"/><stop offset=".5" stopColor="#e78dad"/><stop offset="1" stopColor="#f4d5d9"/></linearGradient></defs>
      <path d="M120 312C108 260 132 225 120 180" stroke="#637d56" strokeWidth="3"/>
      <path d="M120 80C65 112 83 163 120 190C157 163 175 112 120 80Z" fill={`url(#${budId})`}/>
      <path d="M120 84C100 130 111 168 120 187M120 84C142 131 130 165 120 187" stroke="#ac386a" strokeWidth=".7" opacity=".5"/>
    </svg>}</div>
    {variant === "hero" && ready && !reduced && <button className="kv-bloom-replay" onClick={() => api.current?.replay()} aria-label="Replay the lotus bloom"><RotateCcw size={13}/><span>Bloom again</span></button>}
  </div>;
}
