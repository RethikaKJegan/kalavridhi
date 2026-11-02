"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "motion/react";

export default function useCarouselPlayback(ref: RefObject<HTMLDivElement | null>, advance: () => void, interval: number, count: number) {
  const callback = useRef(advance);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => { callback.current = advance; }, [advance]);
  useEffect(() => {
    const element = ref.current;
    if (!element || count < 2 || paused || interacting || reduced) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= .25; }, { threshold: .25 });
    observer.observe(element);
    const timer = setInterval(() => {
      if (visible && !document.hidden && !document.getElementById("kv-content")?.hasAttribute("inert")) callback.current();
    }, interval);
    return () => { clearInterval(timer); observer.disconnect(); };
  }, [ref, count, interval, paused, interacting, reduced]);
  return { paused, reduced, live: paused || interacting ? "polite" as const : "off" as const,
    toggle: () => { setPaused(value => !value); if(paused)setInteracting(false); },
    events: {
      onPointerDownCapture: () => setInteracting(true),
      onPointerUpCapture: (event: React.PointerEvent) => { if(event.pointerType !== "mouse" && !ref.current?.contains(document.activeElement)) setInteracting(false); },
      onPointerEnter: (event: React.PointerEvent) => { if (event.pointerType === "mouse") setInteracting(true); },
      onPointerLeave: () => { if (!ref.current?.contains(document.activeElement)) setInteracting(false); },
      onFocusCapture: () => setInteracting(true),
      onBlurCapture: (event: React.FocusEvent) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !event.currentTarget.matches(":hover")) setInteracting(false); },
    },
  };
}
