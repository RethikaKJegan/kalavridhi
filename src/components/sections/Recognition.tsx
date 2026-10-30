"use client";
import { useState } from "react";
import Image from "next/image";
import { RECOGNITION } from "@/lib/data";

export default function Recognition() {
  const [lightbox, setLightbox] = useState<null | typeof RECOGNITION[0]>(null);

  return (
    <section id="recognition" className="section-space" aria-labelledby="recognition-heading">
      <div className="content-max">
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,64px)" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--maroon)", fontWeight: 600, marginBottom: "12px" }}>
            Achievements & Recognition
          </p>
          <h2 id="recognition-heading" className="font-display" style={{ fontSize: "clamp(32px,5vw,60px)", margin: "0 0 16px" }}>
            A Journey of{" "}
            <em style={{ color: "var(--maroon)" }}>Dedication</em>
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(32,36,59,.65)", maxWidth: "480px", margin: "0 auto" }}>
            Recognised for commitment to art, teaching and community contribution.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(260px,28vw,340px), 1fr))",
          gap: "24px",
          maxWidth: "1040px",
          margin: "0 auto",
        }}>
          {RECOGNITION.map((item, idx) => (
            <div
              key={item.id}
              className={`art-card reveal reveal-d${Math.min(idx + 1, 3)}`}
              style={{ background: "var(--surface)" }}
            >
              {/* Image / placeholder */}
              <div
                style={{
                  aspectRatio: item.type === "certificate" ? "3/4" : "4/3",
                  overflow: "hidden",
                  background: "var(--canvas-alt)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-card) var(--radius-card) 0 0",
                  cursor: item.image && !item.pending ? "pointer" : "default",
                  position: "relative",
                }}
                onClick={() => item.image && !item.pending && setLightbox(item)}
                role={item.image && !item.pending ? "button" : undefined}
                tabIndex={item.image && !item.pending ? 0 : undefined}
                aria-label={item.image && !item.pending ? `View ${item.caption} in detail` : undefined}
                onKeyDown={e => item.image && !item.pending && e.key === "Enter" && setLightbox(item)}
              >
                {item.pending ? (
                  /* Pending award slot — uses the new nishkala-with-paintings image as placeholder */
                  <div style={{ width: "100%", height: "100%", position: "relative" }}>
                    <Image
                      src="/images/founder/nishkala-with-paintings.png"
                      alt="Nishkala Krishna with her artworks — award details to be confirmed"
                      fill
                      style={{ objectFit: "cover", opacity: 0.85 }}
                      sizes="340px"
                    />
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(255,249,242,.55)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      backdropFilter: "blur(2px)",
                    }}>
                      <span style={{ fontSize: "36px" }}>🏅</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--maroon)", background: "rgba(255,249,242,.9)", padding: "4px 12px", borderRadius: "8px" }}>
                        Award details coming soon
                      </span>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={item.image!}
                    alt={item.alt}
                    fill
                    style={{ objectFit: item.type === "certificate" ? "contain" : "cover", padding: item.type === "certificate" ? "12px" : "0" }}
                    sizes="340px"
                  />
                )}

                {/* Gold rule accent top */}
                <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "3px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)", opacity: 0.6 }} />
              </div>

              {/* Content */}
              <div style={{ padding: "20px 24px 24px", borderTop: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ fontSize: "24px", flexShrink: 0, marginTop: "2px" }}>
                    {item.type === "award" ? "🏆" : "📜"}
                  </span>
                  <div>
                    <h3 className="font-display" style={{ fontSize: "20px", margin: "0 0 4px", fontWeight: 600, lineHeight: 1.25 }}>
                      {item.caption}
                    </h3>
                    {item.organization && (
                      <p style={{ fontSize: "13px", color: "var(--peacock)", fontWeight: 500, margin: "0 0 4px" }}>
                        {item.organization}
                      </p>
                    )}
                    {item.period && (
                      <p style={{ fontSize: "12px", color: "rgba(32,36,59,.5)", margin: 0 }}>
                        {item.period}
                      </p>
                    )}
                  </div>
                </div>

                {item.image && !item.pending && (
                  <button
                    onClick={() => setLightbox(item)}
                    style={{
                      marginTop: "16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--maroon)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    View in detail
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && lightbox.image && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption}
          onClick={() => setLightbox(null)}
          onKeyDown={e => e.key === "Escape" && setLightbox(null)}
          tabIndex={-1}
        >
          <div onClick={e => e.stopPropagation()} style={{
            background: "var(--surface)",
            borderRadius: "20px",
            overflow: "hidden",
            maxWidth: "min(90vw, 600px)",
            maxHeight: "90vh",
            boxShadow: "0 40px 120px rgba(0,0,0,.5)",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ overflow: "auto", maxHeight: "70vh", position: "relative" }}>
              <Image src={lightbox.image} alt={lightbox.alt} width={600} height={700} style={{ width: "100%", height: "auto", display: "block" }} />
              <button onClick={() => setLightbox(null)} aria-label="Close" style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(32,36,59,.7)", color: "#fff", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <h3 className="font-display" style={{ fontSize: "20px", margin: "0 0 4px", fontWeight: 600 }}>{lightbox.caption}</h3>
              {lightbox.organization && <p style={{ fontSize: "13px", color: "var(--peacock)", margin: "0 0 2px" }}>{lightbox.organization}</p>}
              {lightbox.period && <p style={{ fontSize: "12px", color: "rgba(32,36,59,.5)", margin: 0 }}>{lightbox.period}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
