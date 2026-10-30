"use client";
import { useState } from "react";
import Image from "next/image";
import type { Artwork, SiteSettings } from "@/lib/server-data";

const WA_NUMBER = "918925626784";
function waLink(msg: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

interface GalleryProps {
  artworks: Artwork[];
  settings: SiteSettings;
}

export default function Gallery({ artworks, settings }: GalleryProps) {
  const [lightbox, setLightbox] = useState<null | Artwork>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const items = artworks.length > 0 ? artworks : [];
  const total = items.length;

  const prev = () => setActiveIdx(i => (i - 1 + total) % total);
  const next = () => setActiveIdx(i => (i + 1) % total);

  const getPos = (i: number) => {
    const diff = ((i - activeIdx) % total + total) % total;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    return "hidden";
  };

  const waGeneral = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello, I would like to enquire about the artworks at Kalavridhi Arts.")}`;

  return (
    <section id="gallery" className="section-space section-alt" aria-labelledby="gallery-heading">
      <div className="content-max">
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,64px)" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--maroon)", fontWeight: 600, marginBottom: "12px" }}>
            Original Artworks
          </p>
          <h2 id="gallery-heading" className="font-display" style={{ fontSize: "clamp(32px,5vw,60px)", margin: "0 0 16px" }}>
            An Expression of <em style={{ color: "var(--maroon)" }}>Imagination</em>
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(32,36,59,.65)", maxWidth: "480px", margin: "0 auto" }}>
            Each piece is a window into a distinct tradition — crafted with care and signed by the artist.
          </p>
        </div>

        {/* 2.5D Carousel */}
        {total > 0 ? (
          <div style={{ position: "relative" }}>
            {/* Carousel track */}
            <div
              className="gallery-carousel"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                height: "clamp(360px,55vw,560px)",
                overflow: "visible",
              }}
            >
              {items.map((art, i) => {
                const pos = getPos(i);
                return (
                  <div
                    key={art.id}
                    className={`carousel-slide`}
                    data-pos={pos}
                    onClick={() => { if (pos === "center") setLightbox(art); else setActiveIdx(i); }}
                    role="button"
                    tabIndex={pos === "hidden" ? -1 : 0}
                    aria-label={pos === "center" ? `View ${art.title}` : `Go to ${art.title}`}
                    onKeyDown={e => e.key === "Enter" && (pos === "center" ? setLightbox(art) : setActiveIdx(i))}
                    style={{
                      position: "absolute",
                      width: "clamp(220px,30vw,380px)",
                      borderRadius: "var(--radius-card)",
                      overflow: "hidden",
                      background: "var(--surface)",
                      boxShadow: pos === "center" ? "var(--shadow-lift)" : "var(--shadow-card)",
                      transition: "all .55s cubic-bezier(.22,1,.36,1)",
                      cursor: pos === "center" ? "zoom-in" : "pointer",
                      ...(pos === "center" ? {
                        transform: "scale(1) rotateY(0deg) translateZ(0)",
                        opacity: 1, zIndex: 10,
                      } : pos === "left" ? {
                        transform: "scale(.78) rotateY(12deg) translateX(-200%)",
                        opacity: 0.65, zIndex: 5,
                        filter: "brightness(.95)",
                      } : pos === "right" ? {
                        transform: "scale(.78) rotateY(-12deg) translateX(200%)",
                        opacity: 0.65, zIndex: 5,
                        filter: "brightness(.95)",
                      } : {
                        transform: "scale(.6)",
                        opacity: 0, zIndex: 1,
                        pointerEvents: "none",
                      }),
                    }}
                  >
                    <div style={{ position: "relative", aspectRatio: "3/4" }}>
                      <Image
                        src={art.image}
                        alt={art.alt}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 80vw, 380px"
                      />
                    </div>
                    <div style={{ padding: "16px 20px" }}>
                      <p style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 2px", fontFamily: "'Cormorant Garamond', serif", color: "var(--ink)" }}>{art.title}</p>
                      <p style={{ fontSize: "12px", color: "var(--peacock)", margin: 0, fontWeight: 600, letterSpacing: "0.05em" }}>{art.artForm}</p>
                      {art.medium && <p style={{ fontSize: "12px", color: "rgba(32,36,59,.5)", margin: "2px 0 0" }}>{art.medium}</p>}
                    </div>
                    {pos === "center" && (
                      <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,255,255,.9)", borderRadius: "8px", padding: "4px 10px", fontSize: "11px", fontWeight: 600, color: "var(--maroon)" }}>
                        Click to enlarge
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Arrows */}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous artwork"
                  style={{
                    position: "absolute", left: "0", top: "50%", transform: "translateY(-50%)",
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: "var(--surface)", border: "1.5px solid var(--line)",
                    boxShadow: "var(--shadow-card)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", color: "var(--ink)", zIndex: 20,
                    transition: "transform .2s, box-shadow .2s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1.08)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1)"}
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  aria-label="Next artwork"
                  style={{
                    position: "absolute", right: "0", top: "50%", transform: "translateY(-50%)",
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: "var(--surface)", border: "1.5px solid var(--line)",
                    boxShadow: "var(--shadow-card)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", color: "var(--ink)", zIndex: 20,
                    transition: "transform .2s, box-shadow .2s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1.08)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1)"}
                >
                  ›
                </button>
              </>
            )}

            {/* Dots */}
            {total > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "28px" }}>
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Go to artwork ${i + 1}`}
                    className={`carousel-dot${i === activeIdx ? " active" : ""}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(32,36,59,.5)" }}>
            <p style={{ fontSize: "18px" }}>Gallery coming soon — check back shortly!</p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Enquire About Artworks
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Artwork detail: ${lightbox.title}`}
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
              maxWidth: "min(90vw, 800px)",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 40px 120px rgba(0,0,0,.5)",
            }}
          >
            <div style={{ position: "relative", maxHeight: "65vh", overflow: "hidden" }}>
              <Image
                src={lightbox.image}
                alt={lightbox.alt}
                width={800}
                height={600}
                style={{ width: "100%", height: "auto", objectFit: "contain", maxHeight: "65vh", display: "block" }}
              />
              <button
                onClick={() => setLightbox(null)}
                aria-label="Close artwork detail"
                style={{
                  position: "absolute", top: "12px", right: "12px",
                  background: "rgba(32,36,59,.7)", color: "#fff",
                  border: "none", borderRadius: "50%", width: "36px", height: "36px",
                  cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >✕</button>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <h3 className="font-display" style={{ fontSize: "26px", margin: "0 0 4px", fontWeight: 600 }}>{lightbox.title}</h3>
              <p style={{ fontSize: "13px", color: "var(--peacock)", fontWeight: 600, margin: "0 0 8px", letterSpacing: "0.05em" }}>{lightbox.artForm}</p>
              {lightbox.medium && <p style={{ fontSize: "14px", color: "rgba(32,36,59,.6)", margin: "0 0 20px" }}>Medium: {lightbox.medium}</p>}
              {lightbox.description && <p style={{ fontSize: "15px", color: "rgba(32,36,59,.7)", margin: "0 0 20px", lineHeight: 1.6 }}>{lightbox.description}</p>}
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hello, I saw the artwork "${lightbox.title}" on your website. Could I enquire about it?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ fontSize: "14px", padding: "11px 22px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Enquire About This Artwork
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
