"use client";

import { useEffect, useId, useState, useSyncExternalStore, type RefObject } from "react";
import { MotionConfig, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import DecorativeAsset from "./DecorativeAsset";
import "./hero-reference.css";

const WIDTH = 1484, HEIGHT = 1060;
const silhouettes = {
  mandala: "M 230 350 Q 220 205 365 110 L 481 52 L 625 97 L 730 196 L 685 400 L 539 566 L 325 581 L 256 480 Z",
  architecture: "M 1000 390 L 1054 384 L 1082 340 L 1103 376 L 1167 366 L 1181 340 L 1196 369 L 1263 348 L 1300 397 L 1342 386 L 1373 286 L 1404 293 L 1415 377 L 1458 386 L 1484 405 L 1484 605 L 1320 653 L 1172 614 L 1058 581 Z",
  botanical: "M 126 345 L 164 379 L 184 430 L 222 400 L 259 461 L 327 440 L 387 497 L 395 584 L 443 628 L 434 750 L 316 727 L 272 650 L 239 617 L 197 636 L 207 577 L 147 559 L 175 523 L 101 492 L 145 457 Z",
  woman: "M 1008 70 L 975 135 L 960 183 L 935 207 L 895 220 L 880 267 L 870 292 L 946 321 L 997 360 L 1043 408 L 1053 440 L 1028 474 L 988 511 L 946 551 L 919 603 L 902 663 L 917 706 L 974 748 L 1010 824 L 1020 1058 L 573 1058 L 577 926 L 612 828 L 623 746 L 624 679 L 578 667 Q 539 663 544 638 L 552 614 L 547 596 L 565 579 L 545 564 Q 532 557 545 541 L 547 529 Q 525 518 542 505 L 579 465 L 590 438 L 566 461 L 542 447 L 533 412 L 538 390 L 510 363 L 500 335 L 499 287 L 516 250 L 544 226 L 584 200 L 643 175 L 698 158 L 730 128 L 771 93 L 796 86 L 825 96 L 862 128 L 892 159 L 927 129 L 955 107 Z",
  lotusBack: "M 279 562 L 310 512 L 280 477 L 318 460 L 297 413 L 348 431 L 347 379 L 383 388 L 426 325 L 446 378 L 493 407 L 520 430 L 575 443 L 543 475 L 567 494 L 527 511 L 508 553 L 469 566 L 442 548 L 401 574 L 357 587 L 327 576 Z",
  lotusFront: "M 370 939 L 399 901 L 378 874 L 420 851 L 397 809 L 447 817 L 451 747 L 490 775 L 512 746 L 538 780 L 571 757 L 574 792 L 608 767 L 602 809 L 642 790 L 625 843 L 603 869 L 580 890 L 555 900 L 535 940 L 508 957 L 484 965 L 475 944 L 444 961 L 416 953 Z",
  peacock: "M 482 1060 L 548 1018 L 598 973 L 640 935 L 688 897 L 747 858 L 802 824 L 851 801 L 905 782 L 934 778 L 949 753 L 941 720 L 933 682 L 931 637 L 944 600 L 961 578 L 979 568 L 974 550 L 960 543 L 961 531 L 976 531 L 986 544 L 991 564 L 1002 561 L 1000 539 L 990 529 L 995 519 L 1008 523 L 1012 540 L 1012 562 L 1023 564 L 1022 542 L 1019 526 L 1028 522 L 1036 532 L 1031 548 L 1032 568 L 1052 578 L 1064 597 L 1105 615 L 1108 626 L 1083 642 L 1066 641 L 1056 656 L 1062 692 L 1080 738 L 1107 788 L 1121 839 L 1128 892 L 1124 938 L 1106 980 L 1076 1020 L 1050 1060 Z",
};
const parts = [
  { name: "background", depth: -1, lift: 12 },
  { name: "mandala", depth: -.4, lift: 14 },
  { name: "architecture", depth: .4, lift: 16 },
  { name: "botanical", depth: .8, lift: 18 },
  { name: "woman", depth: 1.5, lift: 20 },
  { name: "lotusBack", depth: 3, lift: 26 },
  { name: "lotusFront", depth: 4.5, lift: 34 },
  { name: "peacock", depth: 5.5, lift: 40 },
] as const;
const desktopQuery = "(min-width: 768px) and (hover: hover) and (pointer: fine)";
const subscribeDesktop = (notify: () => void) => {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const readDesktop = () => window.matchMedia(desktopQuery).matches;
const serverDesktop = () => false;
const subscribeWide = (notify: () => void) => {
  const media = window.matchMedia("(min-width: 768px)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const readWide = () => window.matchMedia("(min-width: 768px)").matches;

function ArtPlane({ name, depth, lift, x, y, progress, active, desktop, prefix, source, occlusion = false }: {
  name: string; depth: number; lift: number; x: MotionValue<number>; y: MotionValue<number>;
  progress: MotionValue<number>; active: boolean; desktop: boolean; prefix: string; source: string; occlusion?: boolean;
}) {
  const translateX = useTransform(() => active ? x.get() * depth : 0);
  const translateY = useTransform(() => active ? y.get() * depth - progress.get() * lift * (desktop ? 1 : .2) : 0);
  return <motion.g data-art-plane={occlusion ? undefined : name} style={{ x: translateX, y: translateY }}>
    {occlusion ? <rect width={WIDTH} height={HEIGHT} fill="black" mask={`url(#${prefix}-${name})`}/> : <image href={source} width={WIDTH} height={HEIGHT} mask={`url(#${prefix}-${name})`}/>}
  </motion.g>;
}

export default function HeroArtLayers({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
  const prefix = `hero-${useId().replace(/:/g, "")}`;
  const reduced = useReducedMotion();
  const desktop = useSyncExternalStore(subscribeDesktop, readDesktop, serverDesktop);
  const wide = useSyncExternalStore(subscribeWide, readWide, serverDesktop);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const rawX = useMotionValue(0), rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 90, damping: 24, mass: .7 });
  const y = useSpring(rawY, { stiffness: 90, damping: 24, mass: .7 });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 30 });
  const source = `/images/decoration/hero-reference-collage-v3${wide ? "" : "-small"}.webp`;
  const plate = `/images/decoration/hero-depth-backing${wide ? "" : "-small"}.webp`;
  const ready = loadedSource === source;
  const active = ready && reduced === false;

  useEffect(() => {
    let mounted = true;
    const images = [source, plate].map(src => {
      const image = new window.Image();
      image.src = src;
      return image.decode();
    });
    Promise.all(images).then(() => { if (mounted) setLoadedSource(source); }).catch(() => {});
    return () => { mounted = false; };
  }, [source, plate]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !active || !desktop) return;
    let visible = true;
    const reset = () => { rawX.set(0); rawY.set(0); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) reset(); });
    observer.observe(hero);
    const move = (event: PointerEvent) => {
      if (!visible || document.hidden || event.pointerType !== "mouse") return;
      rawX.set(Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1)) * 1.25);
      rawY.set(Math.max(-1, Math.min(1, event.clientY / window.innerHeight * 2 - 1)) * .9);
    };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      observer.disconnect(); hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset); window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset); reset();
    };
  }, [active, desktop, heroRef, rawX, rawY]);

  return <MotionConfig reducedMotion="user"><div className="kv-hero-media kv-layered-hero kv-reference-hero kv-depth-hero" data-depth-ready={ready} data-depth-active={active} aria-hidden="true">
    <DecorativeAsset name="hero-reference-collage-v3" className="kv-reference-collage kv-depth-fallback" eager/>
    <svg className="kv-depth-canvas" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio={wide ? "xMidYMax slice" : "xMidYMax meet"} focusable="false">
      <defs>
        <filter id={`${prefix}-edge`} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.2"/></filter>
        <mask id={`${prefix}-backing`} maskUnits="userSpaceOnUse" x="0" y="0" width={WIDTH} height={HEIGHT} style={{ maskType: "luminance" }}>
          {Object.values(silhouettes).map((path, index) => <path key={index} d={path} fill="white" stroke="white" strokeWidth="44"/>)}
          {parts.map(part => <ArtPlane key={part.name} {...part} x={x} y={y} progress={progress} active={active} desktop={desktop} prefix={prefix} source={source} occlusion/>)}
        </mask>
        {parts.map(({name}, index) => <mask key={name} id={`${prefix}-${name}`} maskUnits="userSpaceOnUse" x="0" y="0" width={WIDTH} height={HEIGHT} style={{ maskType: "luminance" }}>
          {name === "background" ? <rect width={WIDTH} height={HEIGHT} fill="white"/> : <path d={silhouettes[name as keyof typeof silhouettes]} fill="white" filter={`url(#${prefix}-edge)`}/>}
          {parts.slice(index + 1).map(part => <path key={part.name} d={silhouettes[part.name as keyof typeof silhouettes]} fill="black" filter={`url(#${prefix}-edge)`}/>)}
        </mask>)}
      </defs>
      <image href={plate} width={WIDTH} height={HEIGHT} mask={`url(#${prefix}-backing)`}/>
      {parts.map((part, index) => <motion.g key={part.name} initial={false} animate={active ? { opacity: [.82, 1], y: [8 + index * 2, 0] } : { opacity: 1, y: 0 }} transition={{ duration: .65, delay: index * .065, ease: [.22, 1, .36, 1] }}>
        <ArtPlane {...part} x={x} y={y} progress={progress} active={active} desktop={desktop} prefix={prefix} source={source}/>
      </motion.g>)}
    </svg>
  </div></MotionConfig>;
}
