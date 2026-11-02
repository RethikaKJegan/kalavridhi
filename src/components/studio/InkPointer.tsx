"use client";
import { useEffect, useRef } from "react";

export default function InkPointer(){
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=ref.current,root=document.querySelector<HTMLElement>(".kv-studio");if(!canvas||!root)return;
    const media=matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)"),ctx=canvas.getContext("2d");if(!ctx)return;
    const drops:{x:number;y:number;born:number;r:number;click:boolean}[]=[];
    let frame=0,x=-100,y=-100,lastX=-100,lastY=-100,lastSample=0,hover=false,visible=false;
    const resize=()=>{canvas.width=innerWidth;canvas.height=innerHeight;};
    const clear=()=>{cancelAnimationFrame(frame);frame=0;drops.length=0;visible=false;delete root.dataset.inkCursor;ctx.clearRect(0,0,canvas.width,canvas.height);};
    const draw=(now:number)=>{
      frame=0;ctx.clearRect(0,0,canvas.width,canvas.height);if(document.hidden||!media.matches)return;
      const dark=root.dataset.scene==="contact",colour=dark?"236,167,191":"124,47,89";
      if(visible){const glow=ctx.createRadialGradient(x,y,0,x,y,145);glow.addColorStop(0,`rgba(${colour},.055)`);glow.addColorStop(1,`rgba(${colour},0)`);ctx.fillStyle=glow;ctx.fillRect(x-145,y-145,290,290);}
      for(let i=drops.length-1;i>=0;i--){const d=drops[i],age=(now-d.born)/(d.click?820:480);if(age>=1){drops.splice(i,1);continue;}ctx.beginPath();ctx.fillStyle=`rgba(${colour},${(d.click?.16:.1)*(1-age)})`;ctx.ellipse(d.x,d.y,d.r*(1+age*(d.click?2:.8)),d.r*(.7+age),-.4,0,Math.PI*2);ctx.fill();}
      if(visible){ctx.beginPath();ctx.fillStyle=`rgba(${colour},.48)`;ctx.ellipse(x,y,hover?10:5.5,hover?9:5,-.4,0,Math.PI*2);ctx.fill();}
      if(drops.length)frame=requestAnimationFrame(draw);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw);};
    const move=(event:PointerEvent)=>{
      if(!media.matches||event.pointerType!=="mouse")return;
      const target=event.target as Element;
      if(target.closest("input,textarea,select,[contenteditable=true]")){clear();return;}
      x=event.clientX;y=event.clientY;hover=!!target.closest("a,button");visible=true;root.dataset.inkCursor="true";
      if(event.timeStamp-lastSample>24&&Math.hypot(x-lastX,y-lastY)>7){drops.push({x,y,born:performance.now(),r:3.5,click:false});if(drops.length>24)drops.shift();lastSample=event.timeStamp;lastX=x;lastY=y;}
      if(root.dataset.scene==="home"){root.style.setProperty("--petal-x",`${(x/innerWidth-.5)*14}px`);root.style.setProperty("--petal-y",`${(y/innerHeight-.5)*9}px`);}
      schedule();
    };
    const click=(event:PointerEvent)=>{if(event.pointerType!=="mouse"){clear();return;}move(event);if(!visible)return;drops.push({x,y,born:performance.now(),r:9,click:true});schedule();};
    window.addEventListener("pointermove",move,{passive:true});window.addEventListener("pointerdown",click,{passive:true});window.addEventListener("resize",resize);document.documentElement.addEventListener("pointerleave",clear);document.addEventListener("visibilitychange",clear);media.addEventListener("change",clear);resize();
    return()=>{clear();window.removeEventListener("pointermove",move);window.removeEventListener("pointerdown",click);window.removeEventListener("resize",resize);document.documentElement.removeEventListener("pointerleave",clear);document.removeEventListener("visibilitychange",clear);media.removeEventListener("change",clear);};
  },[]);
  return <canvas ref={ref} className="kv-ink-pointer" aria-hidden="true"/>;
}
