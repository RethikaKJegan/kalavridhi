"use client";

import { useEffect, useRef, useState } from "react";

const mediaQuery="(min-width:960px) and (pointer:fine) and (prefers-reduced-motion:no-preference)";
const stops=["home","about","gallery","workshops","recognition","contact"];
export default function BrushGuide(){
  const [enabled,setEnabled]=useState(false);
  useEffect(()=>{const media=matchMedia(mediaQuery),update=()=>setEnabled(media.matches),frame=requestAnimationFrame(update);media.addEventListener("change",update);return()=>{cancelAnimationFrame(frame);media.removeEventListener("change",update);};},[]);
  return enabled?<TravellingBrush/>:null;
}
function TravellingBrush(){
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const element=host.current;if(!element)return;
    let disposed=false,cleanup=()=>{};
    void Promise.all([import("three"),import("motion"),import("./botanicalScene")]).then(async([THREE,{animate,motionValue},{makeBrush}])=>{
      if(disposed)return;
      let renderer:InstanceType<typeof THREE.WebGLRenderer>;
      try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});}catch{return;}
      renderer.setSize(380,380);renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.outputColorSpace=THREE.SRGBColorSpace;
      element.prepend(renderer.domElement);
      const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.z=6.4;
      const model=makeBrush(),brush=model.root;scene.add(brush);
      scene.add(new THREE.HemisphereLight(0xfff9ee,0x90818a,1.7));const light=new THREE.DirectionalLight(0xfff4dc,2.1);light.position.set(-3,4,5);scene.add(light);
      const content=document.getElementById("kv-content");
      let lost=false,warmed=false,frame=0,paintTimer:ReturnType<typeof setTimeout>|undefined,painting=false,contactHover=false,previous="";
      const x=motionValue(0),y=motionValue(0),angle=motionValue(-.5),progress=motionValue(0);
      const movements:ReturnType<typeof animate>[]=[];
      let stroke:ReturnType<typeof animate>|undefined,path:SVGPathElement|null=null,offProgress=()=>{};
      const painted=new Set<string>();
      const blocked=()=>disposed||lost||document.hidden||content?.hasAttribute("inert");
      const render=()=>{if(warmed&&!blocked())renderer.render(scene,camera);};
      const position=()=>{element.style.transform=`translate3d(${x.get()}px,${y.get()}px,0)`;};
      const offX=x.on("change",position),offY=y.on("change",position),offAngle=angle.on("change",value=>{brush.rotation.set(.1,-.2,value);render();});
      const finishPaint=()=>{if(paintTimer)clearTimeout(paintTimer);paintTimer=undefined;stroke?.stop();offProgress();if(path){path.style.removeProperty("stroke-dasharray");path.style.removeProperty("stroke-dashoffset");}path=null;painting=false;model.tuft.morphTargetInfluences![0]=0;element.dataset.action="settled";};
      const stopMoves=()=>{movements.forEach(c=>c.stop());movements.length=0;};
      const baseX=()=>innerWidth-198,baseY=()=>innerHeight*.22+190;
      const paint=(section:HTMLElement)=>{
        if(!["home","workshops","recognition"].includes(section.id)||painted.has(section.id))return;
        paintTimer=setTimeout(()=>{
          if(blocked()||element.dataset.stop!==section.id)return;
          const candidate=section.querySelector<SVGPathElement>(".kv-painted-stroke path"),matrix=candidate?.getScreenCTM(),rect=candidate?.getBoundingClientRect();
          if(!candidate||!matrix||!rect||rect.top<105||rect.bottom>innerHeight-50)return;
          path=candidate;painted.add(section.id);painting=true;stopMoves();brush.position.x=0;angle.set(-.53);brush.updateMatrixWorld(true);
          const tip=new THREE.Vector3(0,-1.98,0).applyMatrix4(brush.matrixWorld).project(camera),offsetX=tip.x*190,offsetY=-tip.y*190,length=path.getTotalLength();
          path.removeAttribute("pathLength");path.style.strokeDasharray=`${length}`;path.style.strokeDashoffset=`${length}`;
          element.dataset.action="approaching";progress.set(0);
          const start=path.getPointAtLength(0);
          const approach=animate(y,start.x*matrix.b+start.y*matrix.d+matrix.f-offsetY-baseY(),{duration:.45,ease:[.4,0,.2,1]});
          movements.push(animate(x,start.x*matrix.a+start.y*matrix.c+matrix.e-offsetX-baseX(),{duration:.45,ease:[.4,0,.2,1]}),approach);
          void approach.then(()=>{
            if(!painting||blocked())return;element.dataset.action="painting";
            offProgress=progress.on("change",value=>{if(!path)return;const p=path.getPointAtLength(value*length);x.set(p.x*matrix.a+p.y*matrix.c+matrix.e-offsetX-baseX());y.set(p.x*matrix.b+p.y*matrix.d+matrix.f-offsetY-baseY());path.style.strokeDashoffset=`${length*(1-value)}`;model.tuft.morphTargetInfluences![0]=Math.sin(value*Math.PI)*.55;render();});
            stroke=animate(progress,1,{duration:.95,ease:[.4,0,.2,1]});void stroke.then(()=>{finishPaint();previous="";schedule();});
          });
        },300);
      };
      const move=()=>{
        frame=0;if(blocked()||!warmed)return;finishPaint();
        const middle=innerHeight*.52;
        const sections=stops.map(id=>document.getElementById(id)).filter((n):n is HTMLElement=>!!n);
        const section=sections.find(n=>{const r=n.getBoundingClientRect();return r.top<=middle&&r.bottom>middle;})??sections.find(n=>{const r=n.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;});if(!section)return;
        const selector=section.id==="about"?".kv-portrait":section.id==="gallery"?".kv-art-stage":section.id==="contact"?".kv-footer-cta .kv-pill":"h1,h2";
        const target=section.querySelector(selector)??section,rect=target.getBoundingClientRect(),beside=section.id==="about"||section.id==="gallery";
        const sideDock=section.id==="workshops"||section.id==="recognition"||(section.id==="gallery"&&rect.top<300)||(section.id==="about"&&rect.top<120);
        brush.position.x=sideDock?1.6:0;
        const centerX=Math.max(200,Math.min(innerWidth-200,sideDock?innerWidth-205:section.id==="gallery"?rect.right-20:section.id==="about"?rect.right+28:section.id==="contact"?rect.left-(contactHover?95:125):innerWidth-205));
        const centerY=Math.max(200,Math.min(innerHeight-200,sideDock?innerHeight*.5:beside?rect.top-100:section.id==="contact"?rect.top-100:rect.top+90));
        const targetX=section.id==="about"?rect.right-10:beside?rect.left+rect.width*.65:section.id==="contact"?rect.left-28:rect.left+rect.width*.8;
        const targetY=Math.max(100,Math.min(innerHeight-70,beside?rect.top+rect.height*.5:rect.bottom));
        const rotation=section.id==="home"?-.48:sideDock?0:Math.max(-2.5,Math.min(.7,Math.atan2(targetX-centerX,targetY-centerY)));
        const signature=`${section.id}:${Math.round(centerX/6)}:${Math.round(centerY/6)}:${Math.round(rotation*30)}:${contactHover}`;
        element.dataset.stop=section.id;paint(section);
        if(signature===previous)return;previous=signature;stopMoves();element.style.opacity="1";
        movements.push(animate(x,centerX-baseX(),{duration:.85,ease:[.22,1,.36,1]}),animate(y,centerY-baseY(),{duration:.85,ease:[.22,1,.36,1]}),animate(angle,rotation,{duration:.85,ease:[.22,1,.36,1]}));render();
      };
      const schedule=()=>{if(!frame&&!painting)frame=requestAnimationFrame(move);else if(painting){finishPaint();if(!frame)frame=requestAnimationFrame(move);}};
      const visibility=()=>{if(blocked()){finishPaint();stopMoves();cancelAnimationFrame(frame);frame=0;element.style.opacity="0";}else{previous="";schedule();}};
      const hover=(event:PointerEvent)=>{const next=!!(event.target as Element)?.closest?.(".kv-footer-cta .kv-pill");if(next!==contactHover){contactHover=next;schedule();}};
      const loss=(event:Event)=>{event.preventDefault();lost=true;visibility();};const restore=()=>{lost=false;visibility();};
      const modal=new MutationObserver(visibility);if(content)modal.observe(content,{attributes:true,attributeFilter:["inert"]});
      window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);window.addEventListener("kv:scene-change",schedule);window.addEventListener("kv:artwork-change",schedule);window.addEventListener("pointerover",hover,{passive:true});document.addEventListener("visibilitychange",visibility);
      renderer.domElement.addEventListener("webglcontextlost",loss);renderer.domElement.addEventListener("webglcontextrestored",restore);
      cleanup=()=>{finishPaint();stopMoves();offX();offY();offAngle();modal.disconnect();cancelAnimationFrame(frame);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);window.removeEventListener("kv:scene-change",schedule);window.removeEventListener("kv:artwork-change",schedule);window.removeEventListener("pointerover",hover);document.removeEventListener("visibilitychange",visibility);renderer.domElement.removeEventListener("webglcontextlost",loss);renderer.domElement.removeEventListener("webglcontextrestored",restore);const geometries=new Set<InstanceType<typeof THREE.BufferGeometry>>(),materials=new Set<InstanceType<typeof THREE.Material>>();brush.traverse(object=>{if(object instanceof THREE.Mesh){geometries.add(object.geometry);(Array.isArray(object.material)?object.material:[object.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());model.texture.dispose();renderer.dispose();renderer.domElement.remove();};
      await renderer.compileAsync(scene,camera);if(disposed)return;warmed=true;schedule();
    }).catch(()=>{});
    return()=>{disposed=true;cleanup();};
  },[]);
  return <div ref={host} className="kv-brush-guide kv-reference-brush" aria-hidden="true"/>;
}
