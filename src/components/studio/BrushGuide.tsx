"use client";

import { useEffect, useRef, useState } from "react";
import type { BufferGeometry, Material } from "three";

const stops = ["home", "about", "gallery", "workshops", "recognition", "contact"];


/** True 3D brush modeled after the supplied burgundy / brass / pink-bristle reference. */
export default function BrushGuide() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = matchMedia("(min-width: 960px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(media.matches);
    const frame = requestAnimationFrame(update);
    media.addEventListener("change", update);
    return () => { cancelAnimationFrame(frame); media.removeEventListener("change", update); };
  }, []);
  return enabled ? <BrushRenderer/> : null;
}

function BrushRenderer() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element || !matchMedia("(min-width: 960px) and (prefers-reduced-motion: no-preference)").matches) return;
    let disposed = false;
    let dispose = () => {};

    void (async () => {
      const [THREE, { gsap }, { ScrollTrigger }] = await Promise.all([import("three"), import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed || !element.isConnected) return;
      gsap.registerPlugin(ScrollTrigger);
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setSize(220, 220);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      element.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
      camera.position.set(0, 0, 6.4);
      const brush = new THREE.Group(); scene.add(brush);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x8794ad, 1.65));
      const key = new THREE.DirectionalLight(0xfff5e9, 2.3); key.position.set(-3, 4, 5); scene.add(key);
      const edge = new THREE.DirectionalLight(0xb9d6ff, 1.2); edge.position.set(3, -1, -2); scene.add(edge);

      const grain = document.createElement("canvas"); grain.width = 128; grain.height = 512;
      const ctx = grain.getContext("2d")!; ctx.fillStyle = "#54212c"; ctx.fillRect(0, 0, 128, 512);
      for (let i = 0; i < 170; i++) {
        const x = (i * 79) % 128, y = (i * 137) % 512;
        ctx.strokeStyle = i % 3 === 0 ? "#ba7a7860" : "#26172d55";
        ctx.lineWidth = i % 6 === 0 ? 1.4 : .45;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 5, y + 35, x - 4, y + 70, x + 2, y + 135); ctx.stroke();
      }
      const grainTexture = new THREE.CanvasTexture(grain); grainTexture.colorSpace = THREE.SRGBColorSpace;
      const handle = new THREE.MeshPhysicalMaterial({ map: grainTexture, roughness: .27, clearcoat: .75, clearcoatRoughness: .2 });
      const ferrule = new THREE.MeshStandardMaterial({ color: 0xc89b4d, metalness: .8, roughness: .24 });
      const ridge = new THREE.MeshStandardMaterial({ color: 0xe7c77c, metalness: .8, roughness: .2 });
      const natural = new THREE.MeshStandardMaterial({ color: 0x795438, roughness: .9, side: THREE.DoubleSide });
      const inked = new THREE.MeshStandardMaterial({ color: 0xe38aab, roughness: .77, side: THREE.DoubleSide });
      const add = (geometry: BufferGeometry, material: Material, y: number) => {
        const mesh = new THREE.Mesh(geometry, material); mesh.position.y = y; brush.add(mesh); return mesh;
      };
      const profile = [[0, -.76], [.082, -.74], [.084, -.62], [.069, -.38], [.065, .16], [.059, .7], [.047, 1.1], [.034, 1.39], [.013, 1.55], [0, 1.58]].map(([radius, y]) => new THREE.Vector2(radius, y));
      add(new THREE.LatheGeometry(profile, 28), handle, 0);
      const metal = add(new THREE.CylinderGeometry(.079, .103, .49, 24), ferrule, -.985); metal.scale.x = .86;
      for (const y of [-.755, -1.13, -1.215]) {
        const ring = add(new THREE.TorusGeometry(y === -1.215 ? .098 : .081, .008, 7, 24), ridge, y);
        ring.rotation.x = Math.PI / 2; ring.scale.x = .86;
      }
      const core = add(new THREE.ConeGeometry(.087, .61, 20), natural, -1.515);
      core.rotation.z = Math.PI; core.scale.x = .84;

      const strands = new THREE.InstancedMesh(new THREE.ConeGeometry(.009, .6, 5), natural, 48);
      const dipped = new THREE.InstancedMesh(new THREE.ConeGeometry(.006, .19, 5), inked, 21);
      const dummy = new THREE.Object3D(), shade = new THREE.Color();
      for (let i = 0; i < 48; i++) {
        const radius = .011 + Math.sqrt(i / 48) * .063, angle = i * 2.39996;
        dummy.position.set(Math.cos(angle) * radius, -1.49 - (i % 5) * .012, Math.sin(angle) * radius * .82);
        dummy.rotation.set(Math.sin(angle) * .06, 0, Math.PI + Math.cos(angle) * .055);
        dummy.scale.set(1, .87 + (i % 7) * .025, 1); dummy.updateMatrix(); strands.setMatrixAt(i, dummy.matrix);
        shade.set(i % 4 === 0 ? 0xb79065 : i % 4 === 1 ? 0x5b3928 : 0x926844); strands.setColorAt(i, shade);
      }
      for (let i = 0; i < 21; i++) {
        const radius = Math.sqrt(i / 21) * .039, angle = i * 2.39996;
        dummy.position.set(Math.cos(angle) * radius, -1.775 + (i % 4) * .01, Math.sin(angle) * radius * .8);
        dummy.rotation.set(Math.sin(angle) * .045, 0, Math.PI);
        dummy.scale.set(1, .78 + (i % 5) * .05, 1); dummy.updateMatrix(); dipped.setMatrixAt(i, dummy.matrix);
      }
      brush.add(strands, dipped); brush.rotation.set(.1, -.26, -.31);

      // Render only during movement; no permanent animation loop.
      const render = () => { if (!document.hidden) renderer.render(scene, camera); };
      let frame = 0;
      const move = () => {
        frame = 0;
        if (document.hidden || !element.isConnected) return;
        const sections = stops.map(id => document.getElementById(id)).filter((node): node is HTMLElement => !!node);
        const active = sections.find(node => { const r = node.getBoundingClientRect(); return r.top <= innerHeight * .55 && r.bottom > innerHeight * .55; })
          ?? sections.find(node => {const r=node.getBoundingClientRect();return r.bottom>0 && r.top<innerHeight;});
        if (!active) return;
        const heading = active.querySelector('h1,h2') ?? active;
        const rect = heading.getBoundingClientRect();
        const targetY = Math.max(innerHeight * .25, Math.min(innerHeight * .7, rect.top + rect.height * .5));
        const y = Math.max(-90, Math.min(120, targetY - (innerHeight * .3 + 110)));
        const targetX = Math.min(innerWidth * .65, rect.left + rect.width * .5);
        const angle = Math.atan2(targetX - (innerWidth - 126), targetY - (innerHeight * .3 + 110 + y));
        element.dataset.stop = active.id;
        gsap.to(element, { y, duration: .9, ease: 'power2.out', overwrite: true, onUpdate: render });
        gsap.to(brush.rotation, { z: Math.max(-2.1, Math.min(-.45, angle)), y: -.24, duration: 1.05, ease: 'power2.out', overwrite: true, onUpdate: render });
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(move); };
      const visibility = () => { if (document.hidden) { if(frame)cancelAnimationFrame(frame);frame=0;gsap.killTweensOf(element);gsap.killTweensOf(brush.rotation); } else schedule(); };
      window.addEventListener('scroll', schedule, {passive:true});
      window.addEventListener('resize', schedule);
      document.addEventListener('visibilitychange', visibility);
      const triggers = stops.map(id => ScrollTrigger.create({trigger: '#' + id, start:'top 66%', end:'bottom 34%', onEnter:schedule, onEnterBack:schedule}));
      schedule();
      dispose = () => {
        triggers.forEach(trigger => trigger.kill()); gsap.killTweensOf(element); gsap.killTweensOf(brush.rotation);
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); document.removeEventListener("visibilitychange", visibility);
        brush.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
        [handle, ferrule, ridge, natural, inked].forEach(material => material.dispose());
        grainTexture.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    })();
    return () => { disposed = true; dispose(); };
  }, []);
  return <div ref={host} className="kv-brush-guide kv-reference-brush" aria-hidden="true" />;
}
