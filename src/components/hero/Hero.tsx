"use client";
import Image from "next/image";
import { waLink } from "@/lib/data";
import WatercolourCanvas from "./WatercolourCanvas";

const HERO_WORDS = ["Where", "Creativity", "Blooms."];

export default function Hero() {
  const waGeneral = waLink("Hello, I would like to know more about Kalavridhi Arts classes.");

  return (
    <section
      id="hero"
      className="hero-gradient"
      style={{
        minHeight: "100svh",
        paddingTop: "72px",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Hero — Where Creativity Blooms"
    >
      {/* Watercolour canvas layer */}
      <WatercolourCanvas />

      {/* Static fallback blobs for reduced-motion / SSR */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", left: "-8%", width: "clamp(300px,50vw,700px)", height: "clamp(300px,50vw,700px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(243,165,199,.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: "clamp(200px,35vw,500px)", height: "clamp(200px,35vw,500px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,182,237,.15) 0%, transparent 70%)", filter: "blur(35px)" }} />
        <div style={{ position: "absolute", top: "40%", left: "40%", width: "clamp(150px,25vw,380px)", height: "clamp(150px,25vw,380px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,198,94,.08) 0%, transparent 70%)", filter: "blur(30px)" }} />
      </div>

      <div
        className="content-max"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px,5vw,80px)",
          alignItems: "center",
          paddingBlock: "clamp(40px,8vw,100px)",
          width: "100%",
        }}
      >
        {/* Left — Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Brand pill */}
          <div
            className="hero-pill"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(243,165,199,.18)", border: "1px solid rgba(243,165,199,.4)",
              borderRadius: "999px", padding: "6px 16px", fontSize: "13px",
              fontWeight: 500, color: "var(--maroon)", alignSelf: "flex-start",
            }}
          >
            <span style={{ width: "6px", height: "6px", background: "var(--maroon)", borderRadius: "50%", display: "inline-block" }} />
            Art Classes &amp; Creative Workshops
          </div>

          {/* Word-reveal heading */}
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(42px,6.5vw,88px)",
              fontWeight: 600,
              lineHeight: 1.08,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            {HERO_WORDS.map((word, i) => (
              <span
                key={word}
                className="hero-word"
                style={{ animationDelay: `${i * 0.14}s` }}
              >
                {word === "Creativity" ? (
                  <em style={{ color: "var(--maroon)", fontStyle: "italic" }}>{word}</em>
                ) : word}
                {i < HERO_WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          {/* Subheading */}
          <p
            className="hero-sub"
            style={{ fontSize: "clamp(16px,1.4vw,19px)", color: "rgba(32,36,59,.72)", lineHeight: 1.65, maxWidth: "480px", margin: 0 }}
          >
            Discover traditional and contemporary art through classes and workshops led by{" "}
            <strong style={{ color: "var(--ink)" }}>Nishkala Krishna</strong>.
          </p>

          {/* Trust line */}
          <div className="hero-trust" style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "rgba(32,36,59,.6)" }}>
              <span style={{ fontSize: "20px" }}>🎨</span>
              <span><strong style={{ color: "var(--ink)" }}>20 years</strong> of artistic experience</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "rgba(32,36,59,.6)" }}>
              <span style={{ fontSize: "20px" }}>🖌️</span>
              <span><strong style={{ color: "var(--ink)" }}>13</strong> art forms taught</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="hero-ctas" style={{ display: "flex", gap: "14px", flexWrap: "wrap", paddingTop: "8px" }}>
            <a href="#art-forms" className="btn-primary">
              Explore Art Classes
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Scroll cue */}
          <div
            className="hero-scroll"
            style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(32,36,59,.4)", letterSpacing: "0.08em", marginTop: "8px" }}
          >
            <div style={{ width: "24px", height: "1px", background: "rgba(32,36,59,.3)" }} />
            SCROLL TO EXPLORE
          </div>
        </div>

        {/* Right — Art card composition */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "clamp(400px,55vw,680px)",
          }}
          aria-hidden="false"
        >
          {/* Central — Tanjore (largest) */}
          <div
            className="art-card hero-card-1"
            style={{
              position: "absolute",
              width: "clamp(200px,28vw,340px)",
              zIndex: 3,
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%) rotate(-1deg)",
              boxShadow: "0 20px 60px rgba(32,36,59,.18)",
            }}
          >
            <Image
              src="/images/artwork/tanjore-fabric-painting.jpeg"
              alt="Tanjore Fabric Painting — gold and jewel-adorned Goddess by Nishkala Krishna"
              width={340}
              height={440}
              style={{ width: "100%", height: "auto", display: "block", objectFit: "cover", borderRadius: "24px" }}
            />
            <div style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px", background: "rgba(255,249,242,.92)", borderRadius: "10px", padding: "6px 10px", fontSize: "11px", fontWeight: 600, color: "var(--maroon)", letterSpacing: "0.05em" }}>
              TANJORE FABRIC PAINTING
            </div>
          </div>

          {/* Top-left — Kerala Mural */}
          <div
            className="art-card hero-card-2"
            style={{
              position: "absolute",
              width: "clamp(140px,18vw,220px)",
              zIndex: 2,
              left: "-2%",
              top: "5%",
              transform: "rotate(-4deg)",
              boxShadow: "0 12px 36px rgba(32,36,59,.14)",
            }}
          >
            <Image
              src="/images/artwork/kerala-mural-painting.jpeg"
              alt="Kerala Mural Painting — vibrant traditional mural by Nishkala Krishna"
              width={220}
              height={270}
              style={{ width: "100%", height: "auto", display: "block", objectFit: "cover", borderRadius: "18px" }}
            />
          </div>

          {/* Bottom-right — Madhubani */}
          <div
            className="art-card hero-card-3"
            style={{
              position: "absolute",
              width: "clamp(130px,17vw,210px)",
              zIndex: 2,
              right: "-4%",
              bottom: "5%",
              transform: "rotate(3.5deg)",
              boxShadow: "0 12px 36px rgba(32,36,59,.14)",
            }}
          >
            <Image
              src="/images/artwork/madhubani-art.jpeg"
              alt="Madhubani Art — colourful peacock on black background by Nishkala Krishna"
              width={210}
              height={270}
              style={{ width: "100%", height: "auto", display: "block", objectFit: "cover", borderRadius: "18px" }}
            />
          </div>

          {/* Top-right — Acrylic small accent */}
          <div
            className="art-card hero-card-4"
            style={{
              position: "absolute",
              width: "clamp(90px,11vw,140px)",
              zIndex: 4,
              right: "6%",
              top: "8%",
              transform: "rotate(5deg)",
              boxShadow: "0 8px 24px rgba(32,36,59,.13)",
            }}
          >
            <Image
              src="/images/artwork/acrylic-painting.jpeg"
              alt="Acrylic painting — vibrant portrait by Nishkala Krishna"
              width={140}
              height={180}
              style={{ width: "100%", height: "auto", display: "block", objectFit: "cover", borderRadius: "14px" }}
            />
          </div>

          {/* Decorative paint dots */}
          <div aria-hidden="true" style={{ position: "absolute", bottom: "15%", left: "5%", width: "60px", height: "60px", borderRadius: "50%", background: "rgba(243,165,199,.25)", zIndex: 1 }} />
          <div aria-hidden="true" style={{ position: "absolute", top: "20%", right: "30%", width: "30px", height: "30px", borderRadius: "50%", background: "rgba(245,198,94,.35)", zIndex: 1 }} />
          <div aria-hidden="true" style={{ position: "absolute", top: "60%", left: "20%", width: "18px", height: "18px", borderRadius: "50%", background: "rgba(37,140,167,.25)", zIndex: 1 }} />
        </div>
      </div>

      {/* Mobile responsive override */}
      <style>{`
        @media (max-width: 767px) {
          #hero > div.content-max {
            grid-template-columns: 1fr !important;
          }
          #hero > div.content-max > div:last-child {
            min-height: 320px !important;
            margin-top: 24px;
          }
        }
      `}</style>
    </section>
  );
}
