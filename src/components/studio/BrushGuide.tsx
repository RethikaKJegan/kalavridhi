"use client";

import { useEffect, useRef } from "react";

const stops=["home","about","gallery","workshops","recognition","contact"];
export default function BrushGuide(){
  return <div className="kv-brush-layer"><GuidedBrush/></div>;
}
function GuidedBrush(){
  const host=useRef<HTMLDivElement>(null),grip=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    const element=host.current,handle=grip.current;if(!element||!handle)return;
    let disposed=false,cleanup=()=>{};
    void import("motion").then(({animate,motionValue})=>{
      if(disposed)return;
      const reduced=matchMedia("(prefers-reduced-motion:reduce)"),mobile=matchMedia("(max-width:959px)");
      const x=motionValue(0),y=motionValue(0),angle=motionValue(-.2);
      let frame=0,dragging=false,pinned="",active="",startX=0,startY=0,startPointerX=0,startPointerY=0;
      let painting=false,paintTimer:ReturnType<typeof setTimeout>|undefined,path:SVGPathElement|null=null,stroke:ReturnType<typeof animate>|undefined;
      let renderModel=(rotation:number)=>{void rotation;},disposeModel=()=>{};
      let travel:ReturnType<typeof animate>[]=[];
      const content=document.getElementById("kv-content"),sections=stops.map(id=>document.getElementById(id)).filter((node):node is HTMLElement=>!!node),paintedAt=new Map<string,number>();
      const size=()=>mobile.matches?180:320;
      const blocked=()=>document.hidden||!!content?.hasAttribute("inert");
      const position=()=>{element.style.transform=`translate3d(${x.get()-size()/2}px,${y.get()-size()/2}px,0)`;};
      const rotation=(value:number)=>{handle.style.transform=`translate(-50%,-50%) rotate(${-value}rad)`;const fallback=element.querySelector<SVGElement>(".kv-mop-fallback");if(fallback)fallback.style.transform=`rotate(${-value}rad)`;if(!blocked())renderModel(value);};
      const offX=x.on("change",position),offY=y.on("change",position),offAngle=angle.on("change",rotation);
      const stopTravel=()=>{travel.forEach(c=>c.stop());travel=[];};
      const finishPaint=()=>{if(paintTimer)clearTimeout(paintTimer);paintTimer=undefined;stroke?.stop();if(path){path.style.removeProperty("stroke-dasharray");path.style.removeProperty("stroke-dashoffset");}path=null;painting=false;};
      const trace=(section:HTMLElement)=>{
        if(mobile.matches||reduced.matches||pinned||!["home","workshops","recognition"].includes(section.id)||performance.now()-(paintedAt.get(section.id)??-10000)<6000)return;
        paintTimer=setTimeout(()=>{
          if(disposed||blocked()||dragging||pinned||active!==section.id)return;
          const candidate=section.querySelector<SVGPathElement>(".kv-painted-stroke path"),matrix=candidate?.getScreenCTM(),rect=candidate?.getBoundingClientRect();
          if(!candidate||!matrix||!rect||rect.top<90||rect.bottom>innerHeight-70)return;
          path=candidate;painting=true;paintedAt.set(section.id,performance.now());stopTravel();angle.set(-.4);
          const length=path.getTotalLength(),progress=motionValue(0),offsetX=Math.sin(-.4)*size()*.5,offsetY=Math.cos(-.4)*size()*.5;
          const place=(value:number)=>{if(!path)return;const p=path.getPointAtLength(length*value);x.set(p.x*matrix.a+p.y*matrix.c+matrix.e-offsetX);y.set(p.x*matrix.b+p.y*matrix.d+matrix.f-offsetY);path.style.strokeDashoffset=`${length*(1-value)}`;};
          const p=path.getPointAtLength(0),toX=p.x*matrix.a+p.y*matrix.c+matrix.e-offsetX,toY=p.x*matrix.b+p.y*matrix.d+matrix.f-offsetY;
          const approach=animate(y,toY,{duration:.32,ease:"easeOut"});travel=[animate(x,toX,{duration:.32,ease:"easeOut"}),approach];
          void approach.then(()=>{if(!painting||disposed||blocked())return;path!.removeAttribute("pathLength");path!.style.strokeDasharray=`${length}`;path!.style.strokeDashoffset=`${length}`;const off=progress.on("change",place);stroke=animate(progress,1,{duration:.75,ease:"easeInOut"});void stroke.then(()=>{off();finishPaint();schedule();});});
        },650);
      };
      const move=()=>{
        frame=0;if(disposed||blocked())return;
        const middle=innerHeight*.52,section=sections.find(node=>{const r=node.getBoundingClientRect();return r.top<=middle&&r.bottom>middle;})??sections.find(node=>{const r=node.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;});if(!section)return;
        const changed=active!==section.id;
        if(changed){active=section.id;pinned="";element.dataset.pinned="false";finishPaint();stopTravel();}
        element.dataset.stop=active;
        if(dragging||pinned===active||painting)return;
        const target=section.querySelector(active==="about"?".kv-portrait":active==="gallery"?".kv-art-stage":active==="contact"?".kv-footer-cta .kv-pill":"h1,h2")??section,rect=target.getBoundingClientRect();
        let tx=innerWidth-62,ty=innerHeight*.46,turn=-.08;
        if(mobile.matches){ty=active==="home"?Math.min(innerHeight-150,(section.querySelector('.kv-reference-hero')?.getBoundingClientRect().top??500)+85):innerHeight-190;tx=innerWidth-27;turn=-.08;}
        else if(active==="about"&&rect.top>120){tx=Math.min(innerWidth-90,rect.right+32);ty=Math.max(175,rect.top-65);turn=-.12;}
        else if(active==="gallery"&&rect.top>280){tx=rect.right-5;ty=rect.top-85;turn=-.5;}
        else if(active==="contact"){tx=rect.left-100;ty=rect.top-85;turn=.4;}
        ty=Math.max(size()/2+10,Math.min(innerHeight-size()/2-10,ty));
        if(changed&&!reduced.matches){travel=[animate(x,tx,{duration:.45,ease:[.22,1,.36,1]}),animate(y,ty,{duration:.45,ease:[.22,1,.36,1]}),animate(angle,turn,{duration:.4})];void travel[1].then(()=>{if(!disposed)schedule();});trace(section);}
        else if(!travel.some(control=>control.state==="running")){x.set(tx);y.set(ty);angle.set(turn);}
        element.style.opacity="1";position();
      };
      function schedule(){if(!frame)frame=requestAnimationFrame(move);}
      const pin=()=>{pinned=active;element.dataset.pinned="true";finishPaint();stopTravel();angle.set(-.08);};
      const down=(event:PointerEvent)=>{if(event.button!==0||blocked())return;event.preventDefault();pin();dragging=true;startX=x.get();startY=y.get();startPointerX=event.clientX;startPointerY=event.clientY;handle.setPointerCapture(event.pointerId);};
      const drag=(event:PointerEvent)=>{if(!dragging)return;x.set(Math.max(28,Math.min(innerWidth-28,startX+event.clientX-startPointerX)));y.set(Math.max(size()/2+8,Math.min(innerHeight-size()/2-8,startY+event.clientY-startPointerY)));};
      const up=()=>{dragging=false;};
      const keyboard=(event:KeyboardEvent)=>{if(event.key==="Escape"){pinned="";element.dataset.pinned="false";schedule();return;}if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key))return;event.preventDefault();pin();const step=event.shiftKey?25:10;x.set(Math.max(28,Math.min(innerWidth-28,x.get()+(event.key==="ArrowLeft"?-step:event.key==="ArrowRight"?step:0))));y.set(Math.max(size()/2+8,Math.min(innerHeight-size()/2-8,y.get()+(event.key==="ArrowUp"?-step:event.key==="ArrowDown"?step:0))));};
      const visibility=()=>{element.style.visibility=blocked()?"hidden":"visible";if(blocked()){finishPaint();stopTravel();}else{renderModel(angle.get());schedule();}};
      const resize=()=>{finishPaint();stopTravel();pinned="";active="";schedule();};
      const modal=new MutationObserver(visibility);if(content)modal.observe(content,{attributes:true,attributeFilter:["inert"]});
      handle.addEventListener("pointerdown",down);handle.addEventListener("pointermove",drag);handle.addEventListener("pointerup",up);handle.addEventListener("pointercancel",up);handle.addEventListener("lostpointercapture",up);handle.addEventListener("keydown",keyboard);
      window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",resize);document.addEventListener("visibilitychange",visibility);reduced.addEventListener("change",resize);
      cleanup=()=>{cancelAnimationFrame(frame);finishPaint();stopTravel();offX();offY();offAngle();modal.disconnect();disposeModel();handle.removeEventListener("pointerdown",down);handle.removeEventListener("pointermove",drag);handle.removeEventListener("pointerup",up);handle.removeEventListener("pointercancel",up);handle.removeEventListener("lostpointercapture",up);handle.removeEventListener("keydown",keyboard);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",resize);document.removeEventListener("visibilitychange",visibility);reduced.removeEventListener("change",resize);};
      schedule();
      if(!mobile.matches&&!reduced.matches)void Promise.all([import("three"),import("./botanicalScene")]).then(async([THREE,{makeBrush}])=>{
        if(disposed)return;let renderer:InstanceType<typeof THREE.WebGLRenderer>;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});}catch{return;}
        renderer.setSize(320,320);renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;element.prepend(renderer.domElement);
        const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.z=7.2;const model=makeBrush();scene.add(model.root);scene.add(new THREE.HemisphereLight(0xfff8ef,0x858c99,2));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(-3,4,5);scene.add(light);
        const loss=(event:Event)=>{event.preventDefault();element.dataset.renderer="fallback";};renderer.domElement.addEventListener("webglcontextlost",loss);
        disposeModel=()=>{renderer.domElement.removeEventListener("webglcontextlost",loss);model.root.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>material.dispose());}});model.texture.dispose();renderer.dispose();renderer.domElement.remove();};
        await renderer.compileAsync(scene,camera);if(disposed)return;
        renderModel=value=>{if(blocked()||mobile.matches||reduced.matches)return;model.root.rotation.set(.1,-.15,value);renderer.render(scene,camera);};element.dataset.renderer="webgl";renderModel(angle.get());
      }).catch(()=>{});
    });
    return()=>{disposed=true;cleanup();};
  },[]);
  return <div ref={host} className="kv-guided-mop"><svg className="kv-mop-fallback" viewBox="0 0 120 400" aria-hidden="true"><defs><linearGradient id="mop-wood"><stop stopColor="#d6bb7d"/><stop offset=".4" stopColor="#fff0bd"/><stop offset="1" stopColor="#bea367"/></linearGradient><linearGradient id="mop-metal"><stop stopColor="#52616b"/><stop offset=".35" stopColor="#e4e8df"/><stop offset=".7" stopColor="#68757a"/><stop offset="1" stopColor="#bec5c3"/></linearGradient><linearGradient id="mop-hair"><stop stopColor="#172031"/><stop offset=".55" stopColor="#0c1525"/><stop offset="1" stopColor="#283147"/></linearGradient></defs><path d="M55 18Q60 9 65 18L70 254H50Z" fill="url(#mop-wood)"/><path d="M48 251H72L76 287H44Z" fill="url(#mop-metal)"/><path d="M44 284C12 318 28 350 60 391C92 350 108 318 76 284Z" fill="url(#mop-hair)"/><g stroke="#8e929d" strokeWidth=".6" opacity=".55">{Array.from({length:12},(_,i)=><path key={i} d={`M${46+i*2.5} 289Q${17+i*7} 336 60 388`}/>)}</g><path d="M48 257H72M46 277H74" stroke="#f0eee2" strokeWidth="2"/></svg><button ref={grip} className="kv-brush-handle" aria-label="Move paintbrush. Drag or use arrow keys; Escape restores automatic movement." title="Drag to move · Escape to reset"/></div>;
}
