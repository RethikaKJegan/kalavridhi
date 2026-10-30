"use client";
import Image from "next/image";
import { waLink } from "@/lib/data";

const WORKSHOP_PHOTOS = [
  {
    src: "/images/workshop/workshop-adult-butterfly.jpeg",
    alt: "Adult participants holding completed butterfly hoop artwork after a fabric painting workshop",
    caption: "Fabric Painting Workshop",
    size: "large",
  },
  {
    src: "/images/workshop/workshop-fabric-hoop-kids.jpg",
    alt: "Children and teens painting fabric flower hoops during a workshop",
    caption: "Kids Creative Session",
    size: "small",
  },
  {
    src: "/images/workshop/workshop-adult-fabric.jpeg",
    alt: "Adult women painting fabric designs at a table during an evening session",
    caption: "Adult Evening Session",
    size: "small",
  },
  {
    src: "/images/workshop/workshop-children-painting.png",
    alt: "Children painting together at a table during a home workshop",
    caption: "Home Workshop",
    size: "small",
  },
  {
    src: "/images/workshop/workshop-group-1.png",
    alt: "Group workshop session — participants creating artwork together",
    caption: "Group Art Workshop",
    size: "small",
  },
];

export default function WorkshopMoments() {
  return (
    <section id="workshops" className="section-space" aria-labelledby="workshops-heading">
      <div className="content-max">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px,6vw,80px)",
          alignItems: "center",
        }}>
          {/* Left — photo scrapbook — slide in from left */}
          <div className="reveal-left" style={{ position: "relative" }}>
            {/* Main large photo */}
            <div style={{
              borderRadius: "clamp(20px,3vw,36px)",
              overflow: "hidden",
              boxShadow: "0 20px 64px rgba(32,36,59,.14)",
              aspectRatio: "4/3",
              position: "relative",
            }}>
              <Image
                src={WORKSHOP_PHOTOS[0].src}
                alt={WORKSHOP_PHOTOS[0].alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 45vw"
              />
              <div style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                background: "rgba(255,249,242,.92)",
                borderRadius: "10px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--maroon)",
                letterSpacing: "0.05em",
              }}>
                {WORKSHOP_PHOTOS[0].caption}
              </div>
            </div>

            {/* Overlapping small photos */}
            <div style={{
              position: "absolute",
              bottom: "-24px",
              right: "-20px",
              width: "clamp(120px,18vw,200px)",
              aspectRatio: "1",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 12px 36px rgba(32,36,59,.18)",
              border: "4px solid var(--canvas)",
              transform: "rotate(2deg)",
            }}>
              <Image src={WORKSHOP_PHOTOS[1].src} alt={WORKSHOP_PHOTOS[1].alt} fill style={{ objectFit: "cover" }} sizes="200px" />
            </div>

            <div style={{
              position: "absolute",
              top: "-16px",
              right: "10%",
              width: "clamp(100px,15vw,170px)",
              aspectRatio: "1",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(32,36,59,.16)",
              border: "3px solid var(--canvas)",
              transform: "rotate(-3deg)",
            }}>
              <Image src={WORKSHOP_PHOTOS[2].src} alt={WORKSHOP_PHOTOS[2].alt} fill style={{ objectFit: "cover" }} sizes="170px" />
            </div>

            {/* Stats badge */}
            <div style={{
              position: "absolute",
              bottom: "30%",
              left: "-16px",
              background: "var(--peacock)",
              color: "#fff",
              borderRadius: "16px",
              padding: "14px 18px",
              boxShadow: "0 8px 24px rgba(37,140,167,.35)",
              textAlign: "center",
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, lineHeight: 1 }}>🎨</div>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", opacity: 0.9, marginTop: "4px" }}>Kids &<br/>Adults</div>
            </div>
          </div>

          {/* Right — text content — slide in from right */}
          <div className="reveal-right" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <p style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--maroon)", fontWeight: 600, marginBottom: "12px" }}>
                Workshop Moments
              </p>
              <h2 id="workshops-heading" className="font-display" style={{ fontSize: "clamp(28px,4vw,52px)", margin: "0 0 8px", lineHeight: 1.12 }}>
                Learning Together,<br />
                <em style={{ color: "var(--maroon)" }}>Creating Memories</em>
              </h2>
            </div>

            <p style={{ fontSize: "17px", lineHeight: 1.75, color: "rgba(32,36,59,.72)", margin: 0 }}>
              Every workshop is more than a class — it's a shared creative experience. From children discovering their first brushstroke to adults exploring new traditions, each session leaves participants with something they made with their own hands.
            </p>

            {/* Mini gallery row */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {WORKSHOP_PHOTOS.slice(3).map((p, i) => (
                <div key={i} style={{
                  width: "clamp(70px,10vw,110px)",
                  aspectRatio: "1",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-card)",
                  flexShrink: 0,
                }}>
                  <Image src={p.src} alt={p.alt} width={110} height={110} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                ["🧒", "Children's sessions", "Fun, guided, age-appropriate creative experiences"],
                ["👩‍🎨", "Adult workshops", "Learn traditional Indian art in a relaxed, welcoming space"],
                ["🏠", "Flexible formats", "In-person and online sessions available"],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "22px", lineHeight: 1, flexShrink: 0, marginTop: "2px" }}>{icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, margin: "0 0 2px", fontSize: "15px" }}>{title}</p>
                    <p style={{ fontSize: "14px", color: "rgba(32,36,59,.6)", margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", paddingTop: "8px" }}>
              <a href="#upcoming-classes" className="btn-primary">
                See Upcoming Workshops
              </a>
              <a
                href={waLink("Hello, I would like to know about upcoming workshops at Kalavridhi Arts.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          #workshops > div > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
