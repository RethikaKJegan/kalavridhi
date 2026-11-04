"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { animate, motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import MopArtwork from "./MopArtwork";

const sectionIds=["home","about","gallery","workshops","recognition","contact"];
const half=104;
const selectors:Record<string,string>={home:".kv-reference-hero",about:".kv-portrait",gallery:".kv-art-sheet:not([disabled]) .kv-art-sheet-image",workshops:"h2",recognition:".kv-award-grid",contact:".kv-footer-cta .kv-pill"};
const angles:Record<string,number>={home:-12,about:8,gallery:-24,workshops:20,recognition:-10,contact:14};
const spring={stiffness:240,damping:34,mass:.55};
export default function MobileBrush(){
  const host=useRef<HTMLDivElement>(null);
  const targetX=useMotionValue(0),targetY=useMotionValue(0),targetAngle=useMotionValue(-5);
  const x=useSpring(targetX,spring),y=useSpring(targetY,spring),rotate=useSpring(targetAngle,spring);
  const reduced=useReducedMotion();
  const [ready,setReady]=useState(false);
  const scene=useRef(""),pinned=useRef(false),drag=useRef<{id:number;x:number;y:number;px:number;py:number;moved:boolean}|null>(null);
  const clampX=(value:number)=>Math.max(28,Math.min(innerWidth-28,value));
  const clampY=(value:number)=>{const viewport=window.visualViewport;const top=viewport?.offsetTop??0;return Math.max(top+half+12,Math.min(top+(viewport?.height??innerHeight)-half-75,value));};
  const cancelAction=useRef<()=>void>(()=>{});
  useEffect(()=>{
    const node=host.current;if(!node)return;
    const sections=sectionIds.map(id=>document.getElementById(id)).filter((element):element is HTMLElement=>!!element);
    let frame=0,initialized=false,paintedForVisit=false,disposed=false;
    let paint:ReturnType<typeof animate>|null=null,paintingPath:SVGPathElement|null=null;
    let pointUntil=0;
    const originalPaths=new Map<SVGPathElement,string|null>();
    const accentFor=(section:HTMLElement)=>Array.from(section.querySelectorAll<SVGPathElement>(section.id==="home"?"h1 .kv-painted-stroke path":"h2 .kv-painted-stroke path")).find(path=>path.getBoundingClientRect().width>0)??null;
    for(const section of sections){
      if(!["home","workshops","recognition"].includes(section.id))continue;
      const path=accentFor(section);if(!path)continue;
      originalPaths.set(path,path.getAttribute("style"));
    }
    const visibleBox=(box:DOMRect,margin=30)=>{const viewport=window.visualViewport,top=viewport?.offsetTop??0;return box.bottom>top+margin&&box.top<top+(viewport?.height??innerHeight)-75;};
    const stopPaint=()=>{
      paint?.stop();paint=null;
      if(paintingPath)paintingPath.style.strokeDashoffset="0";
      paintingPath=null;delete node.dataset.paintProgress;
    };
    cancelAction.current=stopPaint;
    // The 208px SVG has its bristle tip 99.32px below the centre.
    const tipRadius=half*(391/200-1);
    const poseForTip=(tipX:number,tipY:number,angle:number)=>{
      const radians=angle*Math.PI/180;
      return {x:tipX+Math.sin(radians)*tipRadius-half,y:tipY-Math.cos(radians)*tipRadius-half,angle};
    };
    const setPose=(px:number,py:number,angle:number,immediate=false)=>{
      targetX.set(px);targetY.set(py);targetAngle.set(angle);
      if(immediate||reduced){x.jump(px);y.jump(py);rotate.jump(angle);}
    };
    const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(update);};
    const startPaint=(section:HTMLElement,path:SVGPathElement)=>{
      if(reduced||paint||paintedForVisit)return;
      const length=path.getTotalLength(),startX=x.get(),startY=y.get(),startAngle=rotate.get(),angle=24;
      const at=(fraction:number)=>{
        const point=path.getPointAtLength(length*fraction),matrix=path.getScreenCTM();
        if(!matrix)return null;
        return poseForTip(point.x*matrix.a+point.y*matrix.c+matrix.e,point.x*matrix.b+point.y*matrix.d+matrix.f,angle);
      };
      if(!at(0))return;
      paintedForVisit=true;paintingPath=path;
      path.style.stroke=section.id==="recognition"?"#bc8b31":"#d33778";
      path.style.opacity="1";path.style.strokeDasharray=String(length);path.style.strokeDashoffset=String(length);
      node.dataset.action=`painting-${section.id}`;
      paint=animate(0,1,{duration:1.35,ease:"linear",onUpdate:value=>{
        if(disposed||drag.current||pinned.current)return;
        const fraction=Math.max(0,Math.min(1,(value-.24)/.76)),point=at(fraction);if(!point)return;
        if(value<.24){const progress=1-Math.pow(1-value/.24,3);setPose(startX+(point.x-startX)*progress,startY+(point.y-startY)*progress,startAngle+(angle-startAngle)*progress,true);}
        else{setPose(point.x,point.y,angle,true);path.style.strokeDashoffset=String(length*(1-fraction));}
        node.dataset.paintProgress=fraction.toFixed(3);
      },onComplete:()=>{paint=null;paintingPath=null;path.style.strokeDashoffset="0";node.dataset.action=`finished-${section.id}`;delete node.dataset.paintProgress;schedule();}});
    };
    const update=()=>{
      frame=0;
      if(document.hidden||document.getElementById("kv-content")?.hasAttribute("inert")){stopPaint();return;}
      const viewport=window.visualViewport,height=viewport?.height??innerHeight,top=viewport?.offsetTop??0,middle=top+height*.6;
      const section=sections.find(section=>{const box=section.getBoundingClientRect();return box.top<=middle&&box.bottom>middle;})??sections.find(section=>visibleBox(section.getBoundingClientRect()));
      if(!section)return;
      if(scene.current!==section.id){stopPaint();scene.current=section.id;pinned.current=false;paintedForVisit=false;node.dataset.pinned="false";}
      node.dataset.stop=scene.current;
      if(drag.current||pinned.current){node.dataset.action="parked";return;}
      if(!initialized){setPose(innerWidth-40-half,clampY(top+height*.45)-half,-8,true);initialized=true;setReady(true);}
      if(paint){
        if(paintingPath&&!visibleBox(paintingPath.getBoundingClientRect(),45)){stopPaint();paintedForVisit=false;}
        else return;
      }
      const accent=["home","workshops","recognition"].includes(section.id)?accentFor(section):null;
      if(accent&&!paintedForVisit){
        const box=accent.getBoundingClientRect();
        if(box.top>top+half+14&&box.bottom<top+height-100){
          if(reduced){accent.style.stroke=section.id==="recognition"?"#bc8b31":"#d33778";accent.style.strokeDashoffset="0";paintedForVisit=true;}
          else{startPaint(section,accent);return;}
        }
      }
      const target=section.querySelector(selectors[section.id])??section,box=target.getBoundingClientRect();
      const targetVisible=visibleBox(box,80),angle=angles[section.id]??-8;
      let tipX=innerWidth-36,tipY=top+height*.53,action="travelling";
      if(targetVisible){
        if(section.id==="about"){tipX=Math.min(innerWidth-18,box.right-3);tipY=Math.max(top+half+25,Math.min(top+height-110,box.top+box.height*.35));action="beside-portrait";}
        else if(section.id==="gallery"){tipX=Math.min(innerWidth-45,box.right-28);tipY=Math.max(top+half+25,Math.min(top+height-110,box.top+Math.min(120,box.height*.4)));action="pointing-artwork";}
        else if(section.id==="contact"){tipX=Math.min(innerWidth-24,box.right-4);tipY=Math.max(top+half+20,Math.min(top+height-110,box.top+box.height*.5));action="beside-enquiry";}
        else{tipY=Math.max(top+half+25,Math.min(top+height-110,box.top+90));action=`finished-${section.id}`;}
      }
      const nudge=section.id==="gallery"&&performance.now()<pointUntil?Math.sin((pointUntil-performance.now())/800*Math.PI)*12:0;
      const pose=poseForTip(tipX-nudge,tipY,section.id==="gallery"?32:angle);
      // Keep the full handle inside the visible viewport while pointing at the real target.
      setPose(clampX(pose.x+half)-half,clampY(pose.y+half)-half,pose.angle);
      node.dataset.action=action;
      if(nudge)schedule();
    };
    const resize=()=>{stopPaint();if(pinned.current){targetX.set(clampX(targetX.get()+half)-half);targetY.set(clampY(targetY.get()+half)-half);}schedule();};
    const artwork=()=>{pointUntil=performance.now()+800;schedule();};
    const observer=new MutationObserver(schedule),content=document.getElementById("kv-content");if(content)observer.observe(content,{attributes:true,attributeFilter:["inert"]});
    window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",resize);window.addEventListener("kv:artwork-change",artwork);document.addEventListener("visibilitychange",schedule);window.addEventListener("pageshow",schedule);window.visualViewport?.addEventListener("resize",resize);window.visualViewport?.addEventListener("scroll",schedule);schedule();
    return()=>{disposed=true;cancelAnimationFrame(frame);stopPaint();cancelAction.current=()=>{};for(const[path,style]of originalPaths){if(style===null)path.removeAttribute("style");else path.setAttribute("style",style);}observer.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",resize);window.removeEventListener("kv:artwork-change",artwork);document.removeEventListener("visibilitychange",schedule);window.removeEventListener("pageshow",schedule);window.visualViewport?.removeEventListener("resize",resize);window.visualViewport?.removeEventListener("scroll",schedule);};
  },[targetX,targetY,targetAngle,x,y,rotate,reduced]);
  const pin=()=>{cancelAction.current();pinned.current=true;if(host.current)host.current.dataset.pinned="true";targetX.set(x.get());targetY.set(y.get());targetAngle.set(-5);};
  const down=(event:ReactPointerEvent<HTMLButtonElement>)=>{
    if(event.button!==0)return;event.preventDefault();cancelAction.current();targetX.set(x.get());targetY.set(y.get());x.jump(x.get());y.jump(y.get());drag.current={id:event.pointerId,x:x.get(),y:y.get(),px:event.clientX,py:event.clientY,moved:false};event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move=(event:ReactPointerEvent<HTMLButtonElement>)=>{
    const start=drag.current;if(!start||start.id!==event.pointerId)return;
    if(!start.moved){if(Math.hypot(event.clientX-start.px,event.clientY-start.py)<8)return;start.moved=true;pin();}
    const nextX=clampX(start.x+half+event.clientX-start.px)-half,nextY=clampY(start.y+half+event.clientY-start.py)-half;
    targetX.set(nextX);targetY.set(nextY);x.jump(nextX);y.jump(nextY);
  };
  const up=()=>{drag.current=null;if(!pinned.current)window.dispatchEvent(new Event("scroll"));};
  const keyboard=(event:ReactKeyboardEvent<HTMLButtonElement>)=>{
    if(event.key==="Escape"){pinned.current=false;if(host.current)host.current.dataset.pinned="false";window.dispatchEvent(new Event("scroll"));return;}
    if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key))return;
    event.preventDefault();pin();const step=event.shiftKey?25:10;
    targetX.set(clampX(targetX.get()+half+(event.key==="ArrowLeft"?-step:event.key==="ArrowRight"?step:0))-half);
    targetY.set(clampY(targetY.get()+half+(event.key==="ArrowUp"?-step:event.key==="ArrowDown"?step:0))-half);
  };
  return <motion.div ref={host} className="kv-guided-mop kv-mobile-mop" style={{x,y,rotate,opacity:ready?1:0}}><MopArtwork/><button className="kv-brush-handle" aria-label="Move paintbrush. Drag or use arrow keys; Escape restores automatic movement." title="Drag to move" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onKeyDown={keyboard}/></motion.div>;
}
