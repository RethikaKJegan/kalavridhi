"use client";
import { useEffect, useRef } from "react";

export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const selectors = ".reveal, .reveal-scale, .reveal-left, .reveal-right";
    const els = document.querySelectorAll<HTMLElement>(selectors);

    if (reduced) {
      els.forEach(el => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// Component wrapper that initialises the observer
export default function ScrollRevealInit() {
  useScrollReveal();
  return null;
}
