"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface StatsData {
  totalArtworks: number;
  publishedArtworks: number;
  totalWorkshops: number;
  publishedWorkshops: number;
  recentArtworks: Array<{ id: string; title: string; artForm: string; published: boolean; image?: string }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/artworks").then(r => r.json()),
      fetch("/api/admin/workshops").then(r => r.json()),
    ]).then(([artworks, workshops]) => {
      setStats({
        totalArtworks: artworks.length,
        publishedArtworks: artworks.filter((a: { published: boolean }) => a.published).length,
        totalWorkshops: workshops.length,
        publishedWorkshops: workshops.filter((w: { status: string }) => w.status === "published").length,
        recentArtworks: artworks.slice(-5).reverse(),
      });
    });
  }, []);

  const StatCard = ({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) => (
    <div className="admin-card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <p style={{ fontSize: "13px", color: "rgba(32,36,59,.5)", margin: 0, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ fontSize: "48px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, margin: 0, color, lineHeight: 1 }}>{value ?? "—"}</p>
      <p style={{ fontSize: "13px", color: "rgba(32,36,59,.5)", margin: 0 }}>{sub}</p>
    </div>
  );

  return (
    <div style={{ padding: "clamp(24px,4vw,40px)" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 600, color: "var(--ink)", margin: "0 0 6px" }}>
          Welcome back 🎨
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(32,36,59,.55)", margin: 0 }}>
          Kalavridhi Arts — Content Management Dashboard
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "16px", marginBottom: "32px" }}>
        <StatCard label="Total Artworks" value={stats?.totalArtworks ?? 0} sub="in gallery" color="var(--maroon)" />
        <StatCard label="Published" value={stats?.publishedArtworks ?? 0} sub="visible on site" color="var(--leaf)" />
        <StatCard label="Workshops" value={stats?.totalWorkshops ?? 0} sub="total entries" color="var(--peacock)" />
        <StatCard label="Active" value={stats?.publishedWorkshops ?? 0} sub="published sessions" color="var(--saffron)" />
      </div>

      {/* Quick actions */}
      <div className="admin-card" style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 16px", color: "var(--ink)" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "Add Artwork", href: "/admin/artworks", emoji: "🖼" },
            { label: "Add Workshop", href: "/admin/workshops", emoji: "📅" },
            { label: "Edit Settings", href: "/admin/settings", emoji: "⚙" },
            { label: "View Public Site", href: "/", emoji: "↗" },
          ].map(a => (
            <Link
              key={a.href}
              href={a.href}
              target={a.href === "/" ? "_blank" : undefined}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 18px",
                background: "var(--canvas-alt)",
                border: "1px solid var(--line)",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--ink)",
                textDecoration: "none",
                transition: "background .2s, transform .15s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(129,46,72,.08)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--canvas-alt)"}
            >
              <span>{a.emoji}</span> {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent artworks */}
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, margin: 0, color: "var(--ink)" }}>Recent Artworks</h2>
          <Link href="/admin/artworks" style={{ fontSize: "13px", color: "var(--maroon)", textDecoration: "none", fontWeight: 500 }}>
            View all →
          </Link>
        </div>
        {stats ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Art Form</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentArtworks.length === 0 ? (
                <tr><td colSpan={3} style={{ color: "rgba(32,36,59,.4)", textAlign: "center", padding: "24px" }}>No artworks yet. <Link href="/admin/artworks" style={{ color: "var(--maroon)" }}>Add one →</Link></td></tr>
              ) : (
                stats.recentArtworks.map(art => (
                  <tr key={art.id}>
                    <td style={{ fontWeight: 500 }}>{art.title}</td>
                    <td style={{ color: "rgba(32,36,59,.6)" }}>{art.artForm}</td>
                    <td><span className={art.published ? "badge-pub" : "badge-draft"}>{art.published ? "Published" : "Draft"}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "rgba(32,36,59,.4)", textAlign: "center", padding: "24px 0" }}>Loading…</p>
        )}
      </div>
    </div>
  );
}
