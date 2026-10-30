import Image from "next/image";
import type { SiteSettings } from "@/lib/server-data";

const WA_NUMBER = "918925626784";
function waLink(msg: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

interface AboutProps {
  settings: SiteSettings;
}

export default function About({ settings }: AboutProps) {
  const { founderName, yearsExperience, shortBio, qualifications } = settings;

  return (
    <section id="about" className="section-space" aria-labelledby="about-heading">
      <div className="content-max">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px,6vw,100px)",
            alignItems: "center",
          }}
        >
          {/* Portrait — slide in from left */}
          <div className="reveal-left" style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: "clamp(24px,4vw,48px)",
                overflow: "hidden",
                boxShadow: "0 24px 80px rgba(32,36,59,.14)",
                position: "relative",
                aspectRatio: "3/4",
              }}
            >
              <Image
                src="/images/founder/nishkala-blue-painting.jpeg"
                alt={`${founderName} painting an intricate Kerala mural artwork`}
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Secondary small portrait */}
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                right: "-20px",
                width: "clamp(100px,18vw,200px)",
                aspectRatio: "1",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 12px 40px rgba(32,36,59,.18)",
                border: "4px solid var(--canvas)",
              }}
            >
              <Image
                src="/images/founder/nishkala-red-kerala-art.jpeg"
                alt={`${founderName} with Kerala mural artwork`}
                fill
                style={{ objectFit: "cover" }}
                sizes="200px"
              />
            </div>

            {/* Experience badge */}
            <div
              style={{
                position: "absolute",
                top: "24px",
                left: "-16px",
                background: "var(--maroon)",
                color: "#fff",
                borderRadius: "16px",
                padding: "12px 18px",
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(129,46,72,.35)",
              }}
            >
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, lineHeight: 1 }}>{yearsExperience}</div>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.85, lineHeight: 1.3, marginTop: "2px" }}>Years of<br/>Experience</div>
            </div>
          </div>

          {/* Content — slide in from right */}
          <div className="reveal-right" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <p style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--maroon)", fontWeight: 600, marginBottom: "12px" }}>
                Meet the Artist
              </p>
              <h2 id="about-heading" className="font-display" style={{ fontSize: "clamp(30px,4.5vw,56px)", margin: "0 0 8px", lineHeight: 1.12 }}>
                Meet the Artist<br />
                <em style={{ color: "var(--maroon)" }}>Behind the Art</em>
              </h2>
            </div>

            <p style={{ fontSize: "17px", lineHeight: 1.75, color: "rgba(32,36,59,.75)", margin: 0 }}>
              For two decades, <strong style={{ color: "var(--ink)" }}>{founderName}</strong> has immersed herself in the rich world of traditional and contemporary Indian art. She brings a rare depth of creative and human understanding to every class she leads.
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.75, color: "rgba(32,36,59,.65)", margin: 0 }}>
              {shortBio}
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.75, color: "rgba(32,36,59,.65)", margin: 0 }}>
              From the meditative precision of Mandala and Zendoodle to the vibrant heritage of Kerala Mural and Madhubani, Nishkala teaches art not just as a skill, but as a joyful journey of self-expression. Her workshops welcome children and adults alike — creating a warm, encouraging space where every student discovers their own creative voice.
            </p>

            {/* Qualifications */}
            <div
              style={{
                background: "var(--canvas-alt)",
                borderRadius: "18px",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <p style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--peacock)", fontWeight: 600, margin: 0 }}>
                Qualifications
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {qualifications.map(q => (
                  <span
                    key={q}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                      padding: "5px 12px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--ink)",
                    }}
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", paddingTop: "8px" }}>
              <a href={waLink("Hello, I would like to enquire about art classes with Nishkala Krishna.")} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Enquire About Classes
              </a>
              <a href="https://www.instagram.com/kala_vridhi_arts/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                View on Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          #about > div > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
