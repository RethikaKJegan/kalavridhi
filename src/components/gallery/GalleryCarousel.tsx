"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { Artwork } from "@/lib/server-data";

interface Props { artworks: Artwork[]; }

export default function GalleryCarousel({ artworks }: Props) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<Artwork | null>(null);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const total = artworks.length;

  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) {
        if (e.key === "Escape") { setLightbox(null); }
        return;
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, lightbox]);

  const getPos = (i: number) => {
    const d = (i - current + total) % total;
    if (d === 0) return "center";
    if (d === 1) return "right";
    if (d === total - 1) return "left";
    return "hidden";
  };

  // Touch/drag
  const onTouchStart = (e: React.TouchEvent) => { startXRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startXRef.current;
    if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); }
  };
  const onMouseDown = (e: React.MouseEvent) => { startXRef.current = e.clientX; setDragging(false); };
  const onMouseUp = (e: React.MouseEvent) => {
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); setDragging(true); }
  };

  const wa = (num: string, msg: string) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

  return (
    <div>
      {/* Carousel */}
      <div
        className="gallery-carousel"
        style={{ position: "relative", height: "clamp(340px,55vw,580px)", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        role="region"
        aria-label="Artwork gallery carousel"
        aria-live="polite"
      >
        {artworks.map((art, i) => {
          const pos = getPos(i);
          return (
            <div
              key={art.id}
              className="carousel-slide"
              data-pos={pos}
              style={{
                position: "absolute",
                width: "clamp(220px,32vw,420px)",
                borderRadius: "var(--radius-card)",
                overflow: "hidden",
                boxShadow: pos === "center" ? "0 24px 80px rgba(32,36,59,.22)" : "0 12px 40px rgba(32,36,59,.12)",
                background: "var(--surface)",
                cursor: pos === "center" ? "zoom-in" : "pointer",
              }}
              onClick={() => {
                if (dragging) return;
                if (pos === "center") setLightbox(art);
                else if (pos === "left") prev();
                else if (pos === "right") next();
              }}
              aria-label={pos === "center" ? `View ${art.title}` : `Go to ${art.title}`}
              tabIndex={pos !== "hidden" ? 0 : -1}
              role="button"
              onKeyDown={e => e.key === "Enter" && (pos === "center" ? setLightbox(art) : pos === "left" ? prev() : next())}
            >
              <div style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden" }}>
                <Image
                  src={art.image}
                  alt={art.alt}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  sizes="(max-width: 768px) 90vw, 420px"
                />
                {pos === "center" && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(32,36,59,.7) 0%, transparent 50%)",
                    display: "flex", alignItems: "flex-end", padding: "20px"
                  }}>
                    <div>
                      <p style={{ color: "rgba(255,249,242,.7)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", marginBottom: "4px" }}>{art.artForm}</p>
                      <h3 style={{ color: "#fff", fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 600, margin: 0 }}>{art.title}</h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous artwork"
          style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", zIndex: 20, width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,249,242,.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(32,36,59,.12)", transition: "background .2s" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button
          onClick={next}
          aria-label="Next artwork"
          style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", zIndex: 20, width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,249,242,.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(32,36,59,.12)", transition: "background .2s" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px", alignItems: "center" }} role="tablist" aria-label="Gallery slides">
        {artworks.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === current}
            role="tab"
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Artwork: ${lightbox.title}`}
          onClick={() => setLightbox(null)}
          onKeyDown={e => e.key === "Escape" && setLightbox(null)}
          tabIndex={-1}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              borderRadius: "24px",
              overflow: "hidden",
              maxWidth: "min(92vw, 820px)",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 40px 120px rgba(0,0,0,.6)",
            }}
          >
            <div style={{ position: "relative", maxHeight: "68vh", overflow: "hidden", background: "#f8f7f5" }}>
              <Image
                src={lightbox.image}
                alt={lightbox.alt}
                width={820}
                height={700}
                style={{ width: "100%", height: "auto", maxHeight: "68vh", objectFit: "contain", display: "block" }}
              />
              <button
                onClick={() => setLightbox(null)}
                aria-label="Close"
                style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(32,36,59,.8)", color: "#fff", border: "none", borderRadius: "50%", width: "38px", height: "38px", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >×</button>
            </div>
            <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", margin: "0 0 4px", fontWeight: 600 }}>{lightbox.title}</h3>
                <p style={{ fontSize: "13px", color: "var(--peacock)", fontWeight: 600, margin: "0 0 2px" }}>{lightbox.artForm}</p>
                {lightbox.medium && <p style={{ fontSize: "13px", color: "rgba(32,36,59,.5)", margin: 0 }}>Medium: {lightbox.medium}</p>}
              </div>
              <a
                href={wa("918925626784", `Hello, I saw the artwork "${lightbox.title}" on your website. Could I enquire about it?`)}
                target="_blank" rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ fontSize: "14px", padding: "11px 20px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Enquire About This
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
