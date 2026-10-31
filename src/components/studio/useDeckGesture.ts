"use client";

import { useEffect, useRef, type PointerEvent, type MouseEvent } from "react";

/** Horizontal gestures leave vertical touch scrolling native. No global event handlers. */
export default function useDeckGesture(move: (step: 1 | -1) => void) {
  const start = useRef<{x: number; y: number; id: number} | null>(null);
  const dragged = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.button !== 0 || !event.isPrimary) return;
      clearTimeout(timer.current); dragged.current = false;
      start.current = {x: event.clientX, y: event.clientY, id: event.pointerId};
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      const origin = start.current;
      if (!origin || origin.id !== event.pointerId) return;
      const dx = event.clientX - origin.x, dy = event.clientY - origin.y;
      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        dragged.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      const origin = start.current;
      if (!origin || origin.id !== event.pointerId) return;
      const dx = event.clientX - origin.x, dy = event.clientY - origin.y;
      start.current = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) { dragged.current = true; move(dx < 0 ? 1 : -1); }
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      timer.current = setTimeout(() => { dragged.current = false; }, 350);
    },
    onPointerCancel() { start.current = null; dragged.current = false; },
    onClickCapture(event: MouseEvent<HTMLElement>) {
      if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; }
    },
    onDragStart(event: MouseEvent<HTMLElement>) { event.preventDefault(); },
  };
}
