"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import MopArtwork from "./MopArtwork";

const sectionIds=["home","about","gallery","workshops","recognition","contact"];
const half=92;
const selectors:Record<string,string>={home:".kv-reference-hero",about:".kv-portrait",gallery:".kv-art-stage",workshops:".kv-moment-track",recognition:".kv-award-grid",contact:".kv-footer-cta .kv-pill"};
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
  useEffect(()=>{
    const node=host.current;if(!node)return;
    const sections=sectionIds.map(id=>document.getElementById(id)).filter((element):element is HTMLElement=>!!element);
    let frame=0,initialized=false;
    const update=()=>{
      frame=0;if(document.hidden||document.getElementById("kv-content")?.hasAttribute("inert"))return;
      const viewport=window.visualViewport;
      const height=viewport?.height??innerHeight,top=viewport?.offsetTop??0;
      const middle=top+height*.52;
      const previous=sections.find(section=>section.id===scene.current),previousBox=previous?.getBoundingClientRect();
      const section=previousBox&&previousBox.top<middle+24&&previousBox.bottom>middle-24?previous:sections.find(section=>{const box=section.getBoundingClientRect();return box.top<=middle&&box.bottom>middle;})??sections.find(section=>{const box=section.getBoundingClientRect();return box.bottom>0&&box.top<innerHeight;});
      if(!section)return;
      if(scene.current!==section.id){scene.current=section.id;pinned.current=false;node.dataset.pinned="false";}
      node.dataset.stop=scene.current;
      if(drag.current||pinned.current)return;

      const target=section.querySelector(selectors[section.id])??section,box=target.getBoundingClientRect();
      const offset=section.id==="contact"?-110:section.id==="about"?110:90;
      const sectionBox=section.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(middle-sectionBox.top)/Math.max(1,sectionBox.height)));
      const edge=section.id==="about"?24:section.id==="workshops"?48:36;
      const desiredY=box.top+offset;
      const nextX=clampX(innerWidth-edge-Math.sin(progress*Math.PI)*12)-half;
      // Continue a visible journey while the anchor lies beyond the phone viewport.
      const nextY=clampY(desiredY<top+half?top+height*(.3+progress*.22):desiredY>top+height-half?top+height*(.5+progress*.2):desiredY)-half;

      targetX.set(nextX);targetY.set(nextY);targetAngle.set((angles[section.id]??-5)+Math.sin(progress*Math.PI)*8);
      if(reduced||!initialized){x.jump(nextX);y.jump(nextY);rotate.jump(angles[section.id]??-5);}
      if(!initialized){initialized=true;setReady(true);}
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const resize=()=>{
      if(pinned.current){const nextX=clampX(targetX.get()+half)-half,nextY=clampY(targetY.get()+half)-half;targetX.set(nextX);targetY.set(nextY);}
      schedule();
    };
    const observer=new MutationObserver(schedule),content=document.getElementById("kv-content");if(content)observer.observe(content,{attributes:true,attributeFilter:["inert"]});
    window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",resize);document.addEventListener("visibilitychange",schedule);window.addEventListener("pageshow",schedule);window.visualViewport?.addEventListener("resize",resize);window.visualViewport?.addEventListener("scroll",schedule);schedule();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",resize);document.removeEventListener("visibilitychange",schedule);window.removeEventListener("pageshow",schedule);window.visualViewport?.removeEventListener("resize",resize);window.visualViewport?.removeEventListener("scroll",schedule);};
  },[targetX,targetY,targetAngle,x,y,rotate,reduced]);
  const pin=()=>{pinned.current=true;if(host.current)host.current.dataset.pinned="true";targetX.set(x.get());targetY.set(y.get());targetAngle.set(-5);};
  const down=(event:ReactPointerEvent<HTMLButtonElement>)=>{
    if(event.button!==0)return;event.preventDefault();targetX.set(x.get());targetY.set(y.get());x.jump(x.get());y.jump(y.get());drag.current={id:event.pointerId,x:x.get(),y:y.get(),px:event.clientX,py:event.clientY,moved:false};event.currentTarget.setPointerCapture(event.pointerId);
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
