import DecorativeAsset from "./DecorativeAsset";

/** Original geometry and isolated ornamental imagery; never client artwork. */
export function Mandala({ className = "" }: { className?: string }) {
  return <svg className={`kv-mandala ${className}`} viewBox="0 0 400 400" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth=".65">
      <circle cx="200" cy="200" r="151"/><circle cx="200" cy="200" r="136"/><circle cx="200" cy="200" r="98"/>
      {Array.from({length:36},(_,i)=><g key={i} transform={`rotate(${i*10} 200 200)`}>
        <path d="M200 10L207 29Q224 54 216 77L200 112L184 77Q176 54 193 29Z"/>
        <path d="M200 35 Q217 63 200 94 Q183 63 200 35Z"/>
        <path d="M200 77 Q249 103 200 157 Q151 103 200 77Z"/>
        <path d="M200 111 Q220 133 200 178 Q180 133 200 111Z"/>
        <path d="M200 152 Q217 180 200 200 Q183 180 200 152Z"/>
        <circle cx="200" cy="27" r="2"/>
        <path d="M200 46L210 62L200 80L190 62Z M200 122L210 136L200 150L190 136Z"/>
      </g>)}
    </g>
  </svg>;
}

export function BotanicalLinework({className = ""}: {className?: string}) {
  return <svg className={`kv-botanical-linework ${className}`} viewBox="0 0 260 620" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1">
      <path d="M38 620C175 425 65 280 219 12M97 446C80 348 28 328 15 257M121 312C183 266 206 219 239 198"/>
      {Array.from({length:8},(_,i)=>{const y=55+i*65,x=197-i*12;return <g key={i} transform={`translate(${x} ${y}) rotate(${i%2 ? -22 : 15})`}>
        <path d="M0 48C-40 26-61-6-54-45C-19-31 3 8 0 48ZM0 48C39 25 62-7 55-45C20-28-1 10 0 48Z"/>
        <path d="M-54-45L0 48L55-45M-30-10L-38-14M-18 12L-39 8M-8 32L-31 27M29-6L39-12M17 14L38 11M8 33L29 29"/>
      </g>;})}
    </g>
  </svg>;
}

function PaintFlecks() {
  return <svg className="kv-paint-flecks" viewBox="0 0 1200 800" aria-hidden="true">
    <g fill="#ce9638">{Array.from({length:43},(_,i)=>{
      const x=(i*173+73)%1200,y=(i*257+41)%800,r=i%5===0?3:1.3;
      return <path key={i} opacity={.25+(i%4)*.12} d={`M${x-r} ${y}l${r*.7} ${-r*1.4} ${r*1.5} ${r*.3} ${r*.5} ${r*1.4} ${-r*1.4} ${r*.8}Z`}/>;
    })}</g>
  </svg>;
}

export default function SceneDecor({ scene }: { scene: "hero" | "about" | "gallery" | "workshops" | "recognition" | "footer" }) {
  return <div className={`kv-scene-decor kv-scene-${scene}`} aria-hidden="true">
    <div className="kv-paper-wash kv-paper-wash-pink"/>
    <div className="kv-paper-wash kv-paper-wash-blue"/>
    <Mandala />
    <DecorativeAsset name="watercolor-wash-v2" className="kv-textured-wash kv-textured-wash-one"/>
    <DecorativeAsset name="watercolor-wash-v2" className="kv-textured-wash kv-textured-wash-two"/>
    <DecorativeAsset name="lotus-sprig-v2" className="kv-botanical kv-botanical-one"/>
    <DecorativeAsset name="lotus-sprig-v2" className="kv-botanical kv-botanical-two"/>
    <BotanicalLinework/>
    <PaintFlecks/>
    <svg className="kv-gold-thread" viewBox="0 0 800 200" fill="none"><path d="M0 157C108 200 165 43 240 100S345 199 429 85 590 195 665 100 700 5 800 20" stroke="currentColor" strokeWidth="1"/></svg>
  </div>;
}
