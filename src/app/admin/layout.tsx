"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "⊞" },
  { label: "Artworks", href: "/admin/artworks", icon: "🖼" },
  { label: "Workshops", href: "/admin/workshops", icon: "📅" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const Sidebar = () => (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,249,242,.08)" }}>
        <div style={{ background: "rgba(255,249,242,.06)", borderRadius: "12px", padding: "10px 14px", display: "inline-flex", marginBottom: "8px" }}>
          <Image src="/images/logo/logo.png" alt="Kalavridhi Arts" width={110} height={50} style={{ objectFit: "contain", height: "40px", width: "auto" }} />
        </div>
        <p style={{ fontSize: "11px", color: "rgba(255,249,242,.35)", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Admin Panel
        </p>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-link${pathname === item.href ? " active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div style={{ margin: "8px 12px", height: "1px", background: "rgba(255,249,242,.08)" }} />

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-nav-link"
          style={{ fontSize: "13px" }}
        >
          <span style={{ fontSize: "14px", width: "20px", textAlign: "center" }}>↗</span>
          View Site
        </a>
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,249,242,.08)" }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            width: "100%",
            padding: "10px 16px",
            background: "rgba(255,249,242,.07)",
            border: "1px solid rgba(255,249,242,.1)",
            borderRadius: "10px",
            color: "rgba(255,249,242,.6)",
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "background .2s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(220,60,60,.15)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,249,242,.07)"}
        >
          <span>⏻</span>
          {loggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop sidebar */}
      <div className="admin-sidebar" style={{ display: "flex", flexDirection: "column" }}>
        <Sidebar />
      </div>

      {/* Mobile top bar */}
      <div style={{
        display: "none",
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: "60px",
        background: "var(--ink)",
        borderBottom: "1px solid rgba(255,249,242,.08)",
        zIndex: 200,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }} className="admin-mobile-bar">
        <Image src="/images/logo/logo.png" alt="Kalavridhi" width={90} height={40} style={{ objectFit: "contain", height: "36px", width: "auto" }} />
        <button
          onClick={() => setMobileOpen(m => !m)}
          style={{ background: "none", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer" }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
            zIndex: 198, display: "none",
          }}
          className="admin-mobile-overlay"
        />
      )}

      {/* Main content */}
      <div className="admin-main">
        {children}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .admin-sidebar { display: none !important; }
          .admin-mobile-bar { display: flex !important; }
          .admin-main { margin-left: 0 !important; padding-top: 60px; }
        }
      `}</style>
    </div>
  );
}
