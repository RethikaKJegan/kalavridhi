import type { Workshop, SiteSettings } from "@/lib/server-data";

interface UpcomingWorkshopsProps {
  workshops: Workshop[];
  settings: SiteSettings;
}

export default function UpcomingWorkshops({ workshops, settings }: UpcomingWorkshopsProps) {
  const waAsk = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello! I would like to be notified about upcoming workshops and art classes at Kalavridhi Arts.")}`;

  return (
    <section id="upcoming-classes" className="section-space section-alt" aria-labelledby="upcoming-heading">
      <div className="content-max">
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,64px)" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--maroon)", fontWeight: 600, marginBottom: "12px" }}>
            Upcoming Sessions
          </p>
          <h2 id="upcoming-heading" className="font-display" style={{ fontSize: "clamp(32px,5vw,60px)", margin: "0 0 16px" }}>
            Your Next{" "}
            <em style={{ color: "var(--maroon)" }}>Creative Adventure</em>
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(32,36,59,.65)", maxWidth: "520px", margin: "0 auto" }}>
            New sessions are announced regularly for both children and adults.
          </p>
        </div>

        {workshops.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(280px,30vw,380px), 1fr))",
            gap: "24px",
          }}>
            {workshops.map((ws, i) => (
              <div
                key={ws.id}
                className={`reveal reveal-d${Math.min(i + 1, 5)}`}
                style={{
                  background: "var(--surface)",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div style={{ padding: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 600,
                      background: ws.registrationOpen ? "rgba(105,169,129,.15)" : "rgba(245,198,94,.2)",
                      color: ws.registrationOpen ? "#3a7a52" : "#9a7a10",
                    }}>
                      {ws.registrationOpen ? "Registrations Open" : "Coming Soon"}
                    </span>
                  </div>
                  <h3 className="font-display" style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 8px", color: "var(--ink)" }}>{ws.title}</h3>
                  {ws.startAt && (
                    <p style={{ fontSize: "13px", color: "var(--peacock)", fontWeight: 600, margin: "0 0 8px" }}>
                      📅 {new Date(ws.startAt).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                  {ws.location && <p style={{ fontSize: "13px", color: "rgba(32,36,59,.6)", margin: "0 0 8px" }}>📍 {ws.location}</p>}
                  {ws.targetAudience && <p style={{ fontSize: "13px", color: "rgba(32,36,59,.6)", margin: "0 0 16px" }}>👥 {ws.targetAudience}{ws.ageRange ? ` (${ws.ageRange})` : ""}</p>}
                  <p style={{ fontSize: "15px", color: "rgba(32,36,59,.7)", lineHeight: 1.65, margin: "0 0 20px" }}>{ws.description}</p>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(ws.whatsappMessage || `Hello! I would like to register for the workshop: ${ws.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                    style={{ fontSize: "14px", padding: "11px 20px" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Register via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Honest empty state */
          <div
            className="reveal"
            style={{
              maxWidth: "640px",
              margin: "0 auto",
              background: "var(--surface)",
              borderRadius: "28px",
              padding: "clamp(40px,6vw,72px)",
              textAlign: "center",
              boxShadow: "var(--shadow-card)",
              border: "1.5px dashed rgba(243,165,199,.5)",
            }}
          >
            <div style={{
              width: "80px", height: "80px",
              background: "linear-gradient(135deg, rgba(243,165,199,.2), rgba(245,198,94,.2))",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px", fontSize: "36px",
            }}>
              🎨
            </div>

            <h3 className="font-display" style={{ fontSize: "clamp(22px,3.5vw,32px)", margin: "0 0 12px", fontWeight: 600 }}>
              New Sessions Are on the Way
            </h3>
            <p style={{ fontSize: "16px", color: "rgba(32,36,59,.6)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: "400px", marginInline: "auto" }}>
              Upcoming workshops and class batches are announced on WhatsApp and Instagram. Reach out to get notified about the next batch — for kids, adults, or groups.
            </p>

            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href={waAsk} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Ask About Next Batch
              </a>
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Follow on Instagram
              </a>
            </div>
          </div>
        )}

        {/* Art forms offered chips */}
        <div className="reveal" style={{ textAlign: "center", marginTop: "48px" }}>
          <p style={{ fontSize: "14px", color: "rgba(32,36,59,.5)", marginBottom: "16px" }}>
            Classes available for:
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {["Zendoodle", "Mandala", "Madhubani", "Kerala Mural", "Tanjore Fabric", "Fabric Painting", "Acrylic", "Glass Painting", "Watercolour Pencil", "Poster Painting", "Kids Art", "+ more"].map(f => (
              <span key={f} style={{
                padding: "5px 14px",
                borderRadius: "999px",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                fontSize: "13px",
                color: "var(--ink)",
                fontWeight: 500,
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
