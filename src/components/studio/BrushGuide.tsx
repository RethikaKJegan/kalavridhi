"use client";

import { useEffect, useRef } from "react";
import type { BufferGeometry, MeshStandardMaterial } from "three";

const stops = ["home", "about", "gallery", "art-forms", "workshops", "recognition", "contact"];

/** One lightweight, original brush model; the HTML underneath remains fully interactive. */
export default function BrushGuide() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    const media = matchMedia("(min-width: 960px) and (prefers-reduced-motion: no-preference)");
    if (!element || !media.matches) return;

    let disposed = false;
    let dispose = () => {};

    void (async () => {
      const [THREE, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("three"), import("gsap"), import("gsap/ScrollTrigger"),
      ]);
      if (disposed || !element.isConnected) return;
      gsap.registerPlugin(ScrollTrigger);

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      } catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setSize(170, 300);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      element.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 170 / 300, 0.1, 100);
      camera.position.set(0, 0, 5.1);
      const brush = new THREE.Group();
      scene.add(brush);
      scene.add(new THREE.AmbientLight(0xffffff, 2.3));
      const light = new THREE.DirectionalLight(0xffffff, 3.1);
      light.position.set(-2, 3, 5);
      scene.add(light);

      const wood = new THREE.MeshStandardMaterial({ color: 0x7b4d71, roughness: 0.36, metalness: 0.05 });
      const silver = new THREE.MeshStandardMaterial({ color: 0xd4cce1, roughness: 0.24, metalness: 0.78 });
      const bristle = new THREE.MeshStandardMaterial({ color: 0xefc79d, roughness: 0.9 });
      const pigment = new THREE.MeshStandardMaterial({ color: 0xd55a95, roughness: 0.55 });
      const add = (geometry: BufferGeometry, material: MeshStandardMaterial, y: number) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = y;
        brush.add(mesh);
        return mesh;
      };
      add(new THREE.CylinderGeometry(0.045, 0.082, 2.15, 14), wood, 0.33);
      add(new THREE.SphereGeometry(0.045, 12, 8), wood, 1.42);
      add(new THREE.CylinderGeometry(0.089, 0.105, 0.4, 16), silver, -0.95);
      add(new THREE.CylinderGeometry(0.106, 0.106, 0.035, 16), silver, -1.18);
      const hairs = add(new THREE.ConeGeometry(0.125, 0.62, 18), bristle, -1.49);
      hairs.rotation.z = Math.PI;
      const tip = add(new THREE.ConeGeometry(0.074, 0.18, 18), pigment, -1.75);
      tip.rotation.z = Math.PI;
      brush.rotation.set(0.12, -0.27, -0.42);

      let frame = 0;
      let previous = 0;
      const render = (now: number) => {
        frame = requestAnimationFrame(render);
        if (document.hidden || now - previous < 32) return;
        previous = now;
        brush.rotation.y = -0.27 + Math.sin(now * 0.00065) * 0.08;
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(render);

      let current = -1;
      const triggers = stops.map((id, index) => ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 66%",
        end: "bottom 34%",
        onEnter: () => move(index),
        onEnterBack: () => move(index),
      }));
      function move(index: number) {
        if (index === current || !element) return;
        current = index;
        element.dataset.stop = stops[index];
        element.classList.remove("kv-brush-draw");
        void element.offsetWidth;
        element.classList.add("kv-brush-draw");
        gsap.to(element, { y: [0, -80, 58, -44, 76, -15, 35][index], x: [-4, 6, -16, -3, -22, 8, -8][index], duration: 1.15, ease: "power3.out", overwrite: true });
        gsap.to(brush.rotation, { z: [-0.42, -0.57, -0.22, -0.48, -0.3, -0.58, -0.38][index], duration: 1.1, ease: "power2.out", overwrite: true });
      }
      move(0);
      dispose = () => {
        triggers.forEach(trigger => trigger.kill());
        gsap.killTweensOf(element);
        gsap.killTweensOf(brush.rotation);
        cancelAnimationFrame(frame);
        brush.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
        [wood, silver, bristle, pigment].forEach(material => material.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => { disposed = true; dispose(); };
  }, []);

  return <div ref={host} className="kv-brush-guide" aria-hidden="true"><span className="kv-brush-stroke" /></div>;
}
