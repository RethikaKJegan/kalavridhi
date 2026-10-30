"use client";

import { useEffect, useRef } from "react";

// Dye history is advected through an evolving curl field in two GPU buffers.
const vertex = `attribute vec2 a; varying vec2 uv; void main(){uv=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;
const simulation = `precision highp float;
varying vec2 uv; uniform sampler2D dye; uniform vec2 pixel,point,last; uniform float time,active,aspect,seed;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
float field(vec2 p){return noise(p)*.58+noise(p*2.03+3.)*.28+noise(p*4.01)*.14;}
void main(){
 vec2 p=uv*vec2(aspect,1.);vec2 q=p*3.4+vec2(time*.075,-time*.055);float e=.025;
 vec2 curl=vec2(field(q+vec2(0,e))-field(q-vec2(0,e)),-field(q+vec2(e,0))+field(q-vec2(e,0)))/(.05);
 vec2 back=uv-curl*vec2(1./aspect,1.)*.0032-vec2(0.,.00045);
 vec3 ink=texture2D(dye,back).rgb*.987;
 ink=mix(ink,(texture2D(dye,back+pixel).rgb+texture2D(dye,back-pixel).rgb)*.5,.045);
 vec2 a=last*vec2(aspect,1.),b=point*vec2(aspect,1.),pa=p-a,ba=b-a;
 float h=clamp(dot(pa,ba)/max(dot(ba,ba),.00001),0.,1.);
 float d=length(pa-ba*h);float splat=exp(-d*d/.0014)*active;
 vec3 colour=.5+.5*cos(seed+vec3(0.,2.1,4.2));
 ink+=colour*splat*.25;
 gl_FragColor=vec4(clamp(ink,0.,1.),1.);
}`;
const display = `precision highp float; varying vec2 uv; uniform sampler2D dye;
void main(){vec3 d=texture2D(dye,uv).rgb;float density=max(d.r,max(d.g,d.b));
vec3 c=(d.r*vec3(.94,.30,.52)+d.g*vec3(.10,.55,.85)+d.b*vec3(.96,.69,.16))/(d.r+d.g+d.b+.0001);
gl_FragColor=vec4(c,smoothstep(.012,.43,density)*.75);}`;

export default function InkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const programs: WebGLProgram[] = [];
    const shader = (type: number, source: string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s, source); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); throw new Error("Ink shader unavailable"); }
      shaders.push(s); return s;
    };
    const program = (source: string) => {
      const p = gl.createProgram()!; gl.attachShader(p, shader(gl.VERTEX_SHADER, vertex));
      gl.attachShader(p, shader(gl.FRAGMENT_SHADER, source)); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { gl.deleteProgram(p); throw new Error("Ink renderer unavailable"); }
      programs.push(p); return p;
    };
    let sim: WebGLProgram, out: WebGLProgram;
    try { sim = program(simulation); out = program(display); } catch { shaders.forEach(s => gl.deleteShader(s)); programs.forEach(p => gl.deleteProgram(p)); return; }
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const targets: { texture: WebGLTexture; frame: WebGLFramebuffer }[] = [];
    let width = 0, height = 0, frame = 0, visible = true, lost = false, previous = 0;
    let point = [-1,-1], last = [-1,-1], movement = 0;
    const clearTargets = () => { targets.forEach(t => { gl.deleteTexture(t.texture); gl.deleteFramebuffer(t.frame); }); targets.length = 0; };
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); if (!rect.width || !rect.height || lost) return;
      const scale = Math.min(1, 850 / Math.max(rect.width, rect.height));
      width = Math.max(2, Math.round(rect.width * scale)); height = Math.max(2, Math.round(rect.height * scale));
      canvas.width = width; canvas.height = height; clearTargets();
      for (let i=0;i<2;i++) {
        const texture = gl.createTexture()!, target = gl.createFramebuffer()!;
        gl.bindTexture(gl.TEXTURE_2D,texture); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
        gl.bindFramebuffer(gl.FRAMEBUFFER,target); gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
        targets.push({texture,frame:target});
      }
    };
    const move = (event: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if(event.clientY<r.top || event.clientY>r.bottom || event.clientX<r.left || event.clientX>r.right) return;
      last = point[0]<0 ? [(event.clientX-r.left)/r.width,1-(event.clientY-r.top)/r.height] : point;
      point = [(event.clientX-r.left)/r.width,1-(event.clientY-r.top)/r.height]; movement = 1;
    };
    const splat = (event: PointerEvent) => { const r=canvas.getBoundingClientRect(); if(event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom){move(event);movement=2.5;} };
    const draw = (p: WebGLProgram, texture: WebGLTexture, target: WebGLFramebuffer|null) => {
      gl.useProgram(p); gl.bindFramebuffer(gl.FRAMEBUFFER,target); gl.viewport(0,0,width,height);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,texture); gl.uniform1i(gl.getUniformLocation(p,"dye"),0);
      const a=gl.getAttribLocation(p,"a"); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    };
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if(lost || !visible || document.hidden || targets.length<2 || now-previous<30) return;
      previous=now; const time=now*.001;
      const auto=[.24+Math.sin(time*.46)*.18,.53+Math.cos(time*.34)*.28];
      const current = movement>.02 ? point : auto, prior=movement>.02 ? last : auto;
      draw(sim,targets[0].texture,targets[1].frame);
      gl.uniform2f(gl.getUniformLocation(sim,"pixel"),1/width,1/height);
      gl.uniform2f(gl.getUniformLocation(sim,"point"),current[0],current[1]);
      gl.uniform2f(gl.getUniformLocation(sim,"last"),prior[0],prior[1]);
      gl.uniform1f(gl.getUniformLocation(sim,"time"),time); gl.uniform1f(gl.getUniformLocation(sim,"aspect"),width/height);
      gl.uniform1f(gl.getUniformLocation(sim,"active"),movement>.02 ? movement : .38);
      gl.uniform1f(gl.getUniformLocation(sim,"seed"),time*.55); gl.drawArrays(gl.TRIANGLES,0,6);
      draw(out,targets[1].texture,null); gl.drawArrays(gl.TRIANGLES,0,6); targets.reverse(); movement*=.87; last=point;
    };
    const contextLost = (e: Event) => { e.preventDefault(); lost=true; };
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;}); observer.observe(canvas);
    const ro=new ResizeObserver(resize); ro.observe(canvas);
    canvas.addEventListener("webglcontextlost",contextLost); window.addEventListener("pointermove",move,{passive:true}); window.addEventListener("pointerdown",splat,{passive:true});
    resize(); frame=requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); ro.disconnect(); window.removeEventListener("pointermove",move); window.removeEventListener("pointerdown",splat); canvas.removeEventListener("webglcontextlost",contextLost); clearTargets(); gl.deleteBuffer(buffer); programs.forEach(p=>gl.deleteProgram(p)); shaders.forEach(s=>gl.deleteShader(s)); };
  }, []);
  return <canvas ref={ref} className="kv-ink" aria-hidden="true" />;
}
