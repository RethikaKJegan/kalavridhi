"use client";
import { useEffect, useRef, useCallback } from "react";

interface Blob {
  x: number; y: number;
  baseX: number; baseY: number;
  radius: number;
  r: number; g: number; b: number;
  phase: number;
  speed: number;
  opacity: number;
}

const PALETTE = [
  [243, 165, 199], // lotus pink
  [201, 182, 237], // lavender
  [146, 209, 227], // light peacock
  [245, 198, 94],  // saffron
  [157, 200, 172], // light leaf
  [243, 165, 199], // lotus again
  [245, 220, 170], // warm gold
];

export default function WatercolourCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const blobsRef  = useRef<Blob[]>([]);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });

  const init = useCallback((w: number, h: number) => {
    blobsRef.current = PALETTE.map(([r, g, b], i) => {
      // Start from edges, not centre
      const edge = i % 4;
      let bx: number, by: number;
      if (edge === 0) { bx = Math.random() * 0.35; by = Math.random(); }
      else if (edge === 1) { bx = 0.65 + Math.random() * 0.35; by = Math.random(); }
      else if (edge === 2) { bx = Math.random(); by = Math.random() * 0.3; }
      else { bx = Math.random(); by = 0.7 + Math.random() * 0.3; }

      return {
        x: bx * w, y: by * h,
        baseX: bx * w, baseY: by * h,
        radius: (130 + Math.random() * 180) * (w / 1440),
        r, g, b,
        phase: (i / PALETTE.length) * Math.PI * 2,
        speed: 0.0006 + Math.random() * 0.0006,
        opacity: 0.14 + Math.random() * 0.11,
      };
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      init(w, h);
    };

    resize();

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX / window.innerWidth, y: e.touches[0].clientY / window.innerHeight };
      }
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    let lastFrame = 0;
    const TARGET = 1000 / 28; // ~28fps cap

    const draw = (ts: number) => {
      animRef.current = requestAnimationFrame(draw);
      if (ts - lastFrame < TARGET) return;
      lastFrame = ts;

      if (document.hidden) return;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const t = ts * 0.001;
      const mx = mouseRef.current.x * w;
      const my = mouseRef.current.y * h;

      blobsRef.current.forEach((blob) => {
        // Gentle sine drift + slight mouse attract
        const driftX = Math.sin(t * blob.speed * 1000 + blob.phase) * w * 0.06;
        const driftY = Math.cos(t * blob.speed * 700 + blob.phase * 1.3) * h * 0.06;
        const attractX = (mx - blob.baseX) * 0.04;
        const attractY = (my - blob.baseY) * 0.04;

        blob.x = blob.baseX + driftX + attractX;
        blob.y = blob.baseY + driftY + attractY;

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        grad.addColorStop(0, `rgba(${blob.r},${blob.g},${blob.b},${blob.opacity})`);
        grad.addColorStop(0.5, `rgba(${blob.r},${blob.g},${blob.b},${blob.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(${blob.r},${blob.g},${blob.b},0)`);

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        filter: "blur(55px) saturate(1.1)",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.85,
      }}
    />
  );
}
