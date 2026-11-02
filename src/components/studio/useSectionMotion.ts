"use client";

import { useEffect, type RefObject } from "react";
import { animate, inView, type AnimationPlaybackControls } from "motion";

export default function useSectionMotion(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let disposeMotion = () => {};
    const setup = () => {
      disposeMotion();
      const sections = Array.from(root.querySelectorAll<HTMLElement>("section[id],footer[id]"));
      const animations = new Set<AnimationPlaybackControls>();
      const seen = new Set<Element>();
      const play = (...args: Parameters<typeof animate>) => {
        const control = animate(...args);
        animations.add(control);
        void control.then(() => animations.delete(control));
      };
      let frame = 0;
      let active = "";
      const selectScene = () => {
        frame = 0;
        if (document.hidden) return;
        const middle = innerHeight * .52;
        const section = sections.find(node => { const box = node.getBoundingClientRect(); return box.top <= middle && box.bottom > middle; })
          ?? sections.find(node => { const box = node.getBoundingClientRect(); return box.bottom > 0 && box.top < innerHeight; });
        if (!section || section.id === active) return;
        active = section.id;
        root.dataset.scene = active;
        window.dispatchEvent(new CustomEvent("kv:scene-change", { detail: active }));
        if (media.matches) return;
        const pigment = section.querySelector<HTMLElement>(".kv-boundary-pigment");
        if (pigment) play(pigment, { opacity: [0, .13, .055], scale: [.96, 1.035, 1] }, { duration: 1.15, ease: "easeOut" });
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(selectScene); };
      const stopReveal = media.matches ? () => {} : inView(root.querySelectorAll(".kv-reveal"), node => {
        if (seen.has(node)) return;
        seen.add(node);
        play(node, { opacity: [.65, 1], y: [matchMedia("(max-width:767px)").matches ? 10 : 18, 0] }, { duration: .55, ease: [.22, 1, .36, 1] });
      }, { margin: "0px 0px -6% 0px" });
      const stopAccent = media.matches ? () => {} : inView(root.querySelectorAll(".kv-painted-stroke"), node => {
        if(matchMedia("(min-width:960px) and (pointer:fine)").matches && ["home","workshops","recognition"].includes(node.closest("section")?.id ?? "")) return;
        const path = node.querySelector("path");
        if (path) play(path, { pathLength: [0, 1], opacity: [.2, .8] }, { duration: .8, delay: .22, ease: [.22, 1, .36, 1] });
      }, { margin: "0px 0px -8% 0px" });
      const stopHeadings = media.matches ? () => {} : inView(root.querySelectorAll(".kv-section-top h2,.kv-about-copy h2"), node => {
        play(node,{opacity:[.65,1],y:[10,0]},{duration:.55,ease:[.22,1,.36,1]});
      },{margin:"0px 0px -5% 0px"});
      const gallery = root.querySelector(".kv-scene-gallery");
      const stopBloom = !gallery || media.matches ? () => {} : inView(gallery, () => {
        const lotus = gallery.querySelector(".kv-botanical-one");
        const mandala = gallery.querySelector(".kv-mandala");
        if (lotus) play(lotus, { clipPath: ["inset(85% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] }, { duration: 1.05, ease: [.22, 1, .36, 1] });
        if (mandala) {
          const opacity = Number(getComputedStyle(mandala).opacity);
          play(mandala, { opacity: [0, opacity] }, { duration: 1.15, delay: .12 });
        }
      }, { margin: "0px 0px -15% 0px" });
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      document.addEventListener("visibilitychange", schedule);
      schedule();
      disposeMotion = () => {
        cancelAnimationFrame(frame); stopReveal(); stopAccent(); stopBloom(); stopHeadings();
        window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
        document.removeEventListener("visibilitychange", schedule);
        animations.forEach(control => control.complete()); animations.clear();
        root.querySelectorAll<HTMLElement>(".kv-boundary-pigment").forEach(node => { node.style.opacity = "0"; });
        delete root.dataset.scene;
      };
    };
    setup(); media.addEventListener("change", setup);
    return () => { media.removeEventListener("change", setup); disposeMotion(); };
  }, [ref]);
}
