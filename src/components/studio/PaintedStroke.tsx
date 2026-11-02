import { useId } from "react";

export default function PaintedStroke({ flourish = false }: { flourish?: boolean }) {
  const id = `paint-${useId().replace(/:/g, "")}`;
  return <svg className={`kv-painted-stroke${flourish ? " kv-painted-flourish" : ""}`} viewBox="0 0 220 44" fill="none" aria-hidden="true" focusable="false">
    <defs><linearGradient id={id}><stop stopColor="#ee9ac0"/><stop offset=".55" stopColor="#c9dde6"/><stop offset="1" stopColor="#e7bf65"/></linearGradient></defs>
    <path d={flourish ? "M5 30C40 10 57 43 92 23S140 2 155 20 184 40 214 12" : "M7 28Q94 12 211 20"} stroke={`url(#${id})`} strokeWidth={flourish ? 3 : 5} strokeLinecap="round"/>
  </svg>;
}
