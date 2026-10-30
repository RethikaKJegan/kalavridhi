"use client";
import { useState } from "react";
import Image from "next/image";
import { ART_FORMS, waLink } from "@/lib/data";

const CATEGORIES = ["All", "Traditional", "Painting", "Drawing & Patterns", "Fabric & Crafts", "Kids"];

export default function ArtForms() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? ART_FORMS.slice(0, 12) : ART_FORMS.filter(a => a.category === active);

  return (
    <section id="art-forms" className="section-space section-alt" aria-labelledby="art-forms-heading">
      <div className="content-max">
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,64px)" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--maroon)", fontWeight: 600, marginBottom: "12px" }}>
            What You Can Learn
          </p>
          <h2 id="art-forms-heading" className="font-display" style={{ fontSize: "clamp(32px,5vw,60px)", margin: "0 0 16px" }}>
            Every Stroke Tells a Story
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(32,36,59,.65)", maxWidth: "520px", margin: "0 auto" }}>
            From ancient temple murals to meditative patterns — explore 13 art forms taught with patience and passion.
          </p>
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "40px" }} role="group" aria-label="Filter art forms by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                border: active === cat ? "1.5px solid var(--maroon)" : "1.5px solid var(--line)",
                background: active === cat ? "var(--maroon)" : "transparent",
                color: active === cat ? "#fff" : "var(--ink)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                minHeight: "40px",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(200px,22vw,300px), 1fr))",
          gap: "24px",
        }}>
          {filtered.map((art, idx) => (
            <div
              key={art.id}
              className={`art-card reveal-scale reveal-d${Math.min((idx % 4) + 1, 5)}`}
              style={{ cursor: "pointer" }}
            >
              {/* Image */}
              <div style={{ aspectRatio: "4/3", overflow: "hidden", borderRadius: "24px 24px 0 0", background: "var(--canvas-alt)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {art.image ? (
                  <Image
                    src={art.image}
                    alt={art.alt}
                    width={400}
                    height={300}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s var(--ease-art)" }}

                  />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "32px", opacity: 0.5 }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <span style={{ fontSize: "12px", color: "var(--maroon)", fontWeight: 500 }}>Image coming soon</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: "20px 22px 22px" }}>
                <span style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--peacock)", fontWeight: 600 }}>
                  {art.category}
                </span>
                <h3 className="font-display" style={{ fontSize: "22px", margin: "6px 0 6px", fontWeight: 600 }}>
                  {art.name}
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(32,36,59,.6)", margin: "0 0 16px", lineHeight: 1.5 }}>
                  {art.tagline}
                </p>
                <a
                  href={waLink(`Hello, I am interested in learning ${art.name}. Could you share the details?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "13px", fontWeight: 600, color: "var(--maroon)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", transition: "gap 0.2s" }}
                >
                  Enquire About This Class
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <a
            href={waLink("Hello, I would like to know about all the art classes available at Kalavridhi Arts.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Enquire About All Art Forms
          </a>
        </div>
      </div>
    </section>
  );
}
