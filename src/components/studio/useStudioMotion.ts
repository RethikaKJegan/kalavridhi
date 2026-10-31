"use client";

import { useEffect, type RefObject } from "react";

/** Progressive enhancement: SSR content stays visible; all effects are scoped and reversible. */
export default function useStudioMotion(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let disposed = false;
    let revert: (() => void) | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      const root = ref.current;
      if (disposed || !root) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      const context = gsap.context(() => {
        media.add("(prefers-reduced-motion: no-preference)", () => {
          root.dataset.motion = "enabled";
          const hero = root.querySelector<HTMLElement>(".kv-hero")!;
          gsap.from(root.querySelector(".kv-header"), { y: -8, opacity: .7, duration: .55 });
          if (hero.getBoundingClientRect().bottom > 0 && window.scrollY < 100) {
            gsap.from(hero.querySelectorAll(".kv-hero-copy > :not(.kv-hero-actions)"), { y: 14, opacity: .5, stagger: .08, duration: .8, ease: "power2.out" });
            gsap.from(hero.querySelector(".kv-hero-illustration"), { y: 20, opacity: .55, duration: 1.1, ease: "power2.out" });
            gsap.from(hero.querySelector(".kv-paper-wash-pink"), { opacity: .1, scale: .9, duration: 1.2 });
          }
          gsap.to(hero.querySelector(".kv-scene-hero"), { y: -10, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .5 } });
          root.querySelectorAll<HTMLElement>(".kv-reveal").forEach(el => {
            // Do not hide deep-link destinations or replay already visible content.
            if (el.getBoundingClientRect().top < window.innerHeight * .9) return;
            gsap.from(el, { y: 22, opacity: .4, duration: .75, ease: "power2.out", immediateRender: false,
              scrollTrigger: { trigger: el, start: "top 90%", once: true } });
          });
          const observer = new IntersectionObserver(([entry]) => {
            hero.dataset.ambient = entry.isIntersecting && !document.hidden ? "active" : "paused";
          });
          observer.observe(hero);
          const visibility = () => { hero.dataset.ambient = !document.hidden && hero.getBoundingClientRect().bottom > 0 && hero.getBoundingClientRect().top < innerHeight ? "active" : "paused"; };
          document.addEventListener("visibilitychange", visibility);
          return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); delete root.dataset.motion; delete hero.dataset.ambient; };
        });
        media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 901px)", () => {
          const hero = root.querySelector<HTMLElement>(".kv-hero")!;
          const layers = [[".kv-scene-hero .kv-mandala", 5], [".kv-hero-media", 10], [".kv-hero-petal-layer", 15]] as const;
          const setters = layers.map(([selector, amount]) => {
            const node = hero.querySelector(selector)!;
            return { amount, x: gsap.quickTo(node, "x", { duration: .65, ease: "power3.out" }), y: gsap.quickTo(node, "y", { duration: .65, ease: "power3.out" }) };
          });
          let box: DOMRect | undefined;
          const invalidate = () => { box = undefined; };
          const move = (event: PointerEvent) => {
            if (event.pointerType === "touch" || document.hidden) return;
            box ??= hero.getBoundingClientRect();
            const x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
            const y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
            setters.forEach(s => { s.x(x * s.amount); s.y(y * s.amount * .65); });
          };
          const reset = () => setters.forEach(s => { s.x(0); s.y(0); });
          hero.addEventListener("pointermove", move);
          hero.addEventListener("pointerleave", reset);
          window.addEventListener("resize", invalidate);
          window.addEventListener("scroll", invalidate, { passive: true });
          return () => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", reset); window.removeEventListener("resize", invalidate); window.removeEventListener("scroll", invalidate); };
        });
      }, root);
      revert = () => { media.revert(); context.revert(); };
    }).catch(() => { /* The complete static composition remains available. */ });
    return () => { disposed = true; revert?.(); };
  }, [ref]);
}
