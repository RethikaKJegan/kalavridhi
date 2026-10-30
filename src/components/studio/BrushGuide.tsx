"use client";

import { useEffect, useRef } from "react";
import type { BufferGeometry, Material } from "three";

const stops = ["home", "about", "gallery", "workshops", "recognition", "contact"];
const positions = [0, -70, 50, 78, -25, 30];
const angles = [-.31, -.4, -.24, -.34, -.44, -.29];

/** Original, low-poly artist's brush with physically lit materials. */
export default function BrushGuide() {
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
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
      renderer.setSize(170, 300);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      element.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 170 / 300, .1, 100);
      camera.position.set(0, 0, 5.1);
      const brush = new THREE.Group(); scene.add(brush);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x8794ad, 1.65));
      const key = new THREE.DirectionalLight(0xfff5e9, 2.3); key.position.set(-3, 4, 5); scene.add(key);
      const edge = new THREE.DirectionalLight(0xb9d6ff, 1.2); edge.position.set(3, -1, -2); scene.add(edge);

      const grain = document.createElement("canvas"); grain.width = 128; grain.height = 512;
      const ctx = grain.getContext("2d")!; ctx.fillStyle = "#593547"; ctx.fillRect(0, 0, 128, 512);
      for (let i = 0; i < 170; i++) {
        const x = (i * 79) % 128, y = (i * 137) % 512;
        ctx.strokeStyle = i % 3 === 0 ? "#ba7a7860" : "#26172d55";
        ctx.lineWidth = i % 6 === 0 ? 1.4 : .45;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 5, y + 35, x - 4, y + 70, x + 2, y + 135); ctx.stroke();
      }
      const grainTexture = new THREE.CanvasTexture(grain); grainTexture.colorSpace = THREE.SRGBColorSpace;
      const handle = new THREE.MeshPhysicalMaterial({ map: grainTexture, roughness: .43, clearcoat: .32, clearcoatRoughness: .34 });
      const ferrule = new THREE.MeshStandardMaterial({ color: 0xc7c8d0, metalness: .68, roughness: .25 });
      const ridge = new THREE.MeshStandardMaterial({ color: 0xf0eee8, metalness: .55, roughness: .2 });
      const natural = new THREE.MeshStandardMaterial({ color: 0xc8a684, roughness: .9, side: THREE.DoubleSide });
      const inked = new THREE.MeshStandardMaterial({ color: 0xb84879, roughness: .77, side: THREE.DoubleSide });
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
        shade.set(i % 4 === 0 ? 0xf3d6ac : i % 4 === 1 ? 0xb79875 : 0xd9b994); strands.setColorAt(i, shade);
      }
      for (let i = 0; i < 21; i++) {
        const radius = Math.sqrt(i / 21) * .039, angle = i * 2.39996;
        dummy.position.set(Math.cos(angle) * radius, -1.775 + (i % 4) * .01, Math.sin(angle) * radius * .8);
        dummy.rotation.set(Math.sin(angle) * .045, 0, Math.PI);
        dummy.scale.set(1, .78 + (i % 5) * .05, 1); dummy.updateMatrix(); dipped.setMatrixAt(i, dummy.matrix);
      }
      brush.add(strands, dipped); brush.rotation.set(.1, -.26, -.31);

      let frame = 0, previous = 0;
      const render = (now: number) => {
        frame = requestAnimationFrame(render);
        if (document.hidden || now - previous < 33) return;
        previous = now; brush.rotation.y = -.26 + Math.sin(now * .00055) * .025;
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(render);
      let current = -1;
      const move = (index: number) => {
        if (index === current) return;
        current = index; element.dataset.stop = stops[index];
        element.classList.remove("kv-brush-draw"); void element.offsetWidth; element.classList.add("kv-brush-draw");
        gsap.to(element, { y: positions[index], x: index % 2 ? 2 : -8, duration: 1.4, ease: "power3.out", overwrite: true });
        gsap.to(brush.rotation, { z: angles[index], duration: 1.3, ease: "power2.out", overwrite: true });
      };
      const triggers = stops.map((id, index) => ScrollTrigger.create({ trigger: `#${id}`, start: "top 66%", end: "bottom 34%", onEnter: () => move(index), onEnterBack: () => move(index) }));
      move(0);
      dispose = () => {
        triggers.forEach(trigger => trigger.kill()); gsap.killTweensOf(element); gsap.killTweensOf(brush.rotation);
        cancelAnimationFrame(frame);
        brush.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
        [handle, ferrule, ridge, natural, inked].forEach(material => material.dispose());
        grainTexture.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    })();
    return () => { disposed = true; dispose(); };
  }, []);
  return <div ref={host} className="kv-brush-guide" aria-hidden="true"><span className="kv-brush-stroke" /></div>;
}
