"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { animate } from "motion";
import "./living-artwork.css";

const petals = [[-78,.86,1],[-51,.97,.96],[-26,.86,1.04],[0,.72,1.08],[29,.87,1.01],[55,.98,.94],[82,.88,.93],[-105,.78,.76],[-61,.82,.72],[-25,.78,.72],[19,.8,.74],[61,.81,.7],[104,.78,.72]];

export default function LivingArtwork({variant="hero"}:{variant?:"hero"|"footer"}) {
  const host=useRef<HTMLDivElement>(null),flower=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const node=host.current,bloom=flower.current;if(!node||!bloom)return;
    const media=matchMedia("(prefers-reduced-motion:reduce)");
    const elements=Array.from(bloom.querySelectorAll<HTMLElement>(".kv-painted-petal"));
    let opened=variant==="footer",visible=false;
    const controls=new Set<ReturnType<typeof animate>>();
    const open=()=>{
      if(opened||media.matches)return;opened=true;node.dataset.bloom="opening";
      elements.forEach((petal,i)=>{
        const [angle,sx,sy]=petals[i];
        const control=animate(petal,{rotate:[angle*.08,angle],scaleX:[.3,sx],scaleY:[.72,sy]}, {duration:3.4,delay:.25+i*.045,ease:[.22,1,.36,1]});controls.add(control);
        void control.then(()=>{controls.delete(control);if(i===elements.length-1)node.dataset.bloom="open";});
      });
    };
    const place=()=>{
      if(variant!=="hero")return;
      const mobile=matchMedia("(max-width:767px)").matches;
      const width=node.clientWidth,height=node.clientHeight;
      const naturalWidth=mobile?1280:1484,naturalHeight=mobile?1280:1060;
      const scale=Math.min(width/naturalWidth,height/naturalHeight),x=(width-naturalWidth*scale)/2,y=mobile?height-naturalHeight*scale:0;
      bloom.style.left=`${x+(mobile?250:310)*scale}px`;bloom.style.top=`${y+(mobile?825:640)*scale}px`;bloom.style.width=`${400*scale}px`;bloom.style.height=`${390*scale}px`;
    };
    const pause=()=>{
      const running=visible&&!document.hidden&&!document.getElementById("kv-content")?.hasAttribute("inert")&&!media.matches;
      node.dataset.active=String(running);controls.forEach(control=>running?control.play():control.pause());
    };
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>=.2;if(visible)open();pause();},{threshold:.2});observer.observe(node);
    const resize=new ResizeObserver(place);resize.observe(node);place();
    const modal=new MutationObserver(pause),content=document.getElementById("kv-content");if(content)modal.observe(content,{attributes:true,attributeFilter:["inert"]});
    const reduce=()=>{if(media.matches){controls.forEach(c=>c.complete());elements.forEach((petal,i)=>{const[a,x,y]=petals[i];petal.style.transform=`rotate(${a}deg) scale(${x},${y})`;});opened=true;node.dataset.bloom="open";}pause();};
    media.addEventListener("change",reduce);document.addEventListener("visibilitychange",pause);reduce();
    return()=>{observer.disconnect();resize.disconnect();modal.disconnect();controls.forEach(c=>c.stop());media.removeEventListener("change",reduce);document.removeEventListener("visibilitychange",pause);};
  },[variant]);
  return <div ref={host} className={`kv-living-artwork kv-living-${variant}`} data-bloom={variant==="footer"?"open":"bud"} aria-hidden="true"><div ref={flower} className="kv-painted-lotus"><div className="kv-lotus-sway">
    <svg className="kv-painted-stem" viewBox="0 0 400 390" fill="none"><path d="M205 389C185 350 222 316 200 276" stroke="#53764e" strokeWidth="3"/><path d="M204 356C160 363 150 328 126 320C159 312 191 325 204 356Z" fill="#718b60" opacity=".9"/><path d="M203 355L141 325" stroke="#d3c998" strokeWidth="1"/></svg>
    {petals.map(([angle,sx,sy],i)=><span className="kv-painted-petal" key={i} style={{"--petal-angle":`${angle}deg`,"--petal-x":sx,"--petal-y":sy,transform:variant==="footer"?`rotate(${angle}deg) scale(${sx},${sy})`:`rotate(${angle*.08}deg) scale(.3,.72)`} as CSSProperties}><Image unoptimized src="/images/decoration/lotus-painted-petal-v1.webp" alt="" width={320} height={640} loading={variant==="hero"?"eager":"lazy"}/></span>)}
  </div></div></div>;
}
