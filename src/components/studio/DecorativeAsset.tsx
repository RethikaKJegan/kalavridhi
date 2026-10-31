import Image from "next/image";

/** Explicit responsive sources avoid the production adapter's fill-image 320px fallback. */
export default function DecorativeAsset({ name, className = "", eager = false }: { name: string; className?: string; eager?: boolean }) {
  return <picture className={`kv-painted-asset ${className}`}>
    <source media="(max-width: 767px)" srcSet={`/images/decoration/${name}-small.webp`}/>
    <Image unoptimized src={`/images/decoration/${name}.webp`} alt="" fill sizes="(max-width: 767px) 100vw, 700px" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined}/>
  </picture>;
}
