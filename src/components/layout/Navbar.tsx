"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE, waLink } from "@/lib/data";

const NAV_LINKS = [
  { label: "Art Forms", href: "#art-forms" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Workshops", href: "#workshops" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="nav-enter"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          transition: "background 0.35s, box-shadow 0.35s",
          background: scrolled
            ? "rgba(255,249,242,0.97)"
            : "rgba(255,249,242,0.75)",
          backdropFilter: "blur(12px)",
          boxShadow: scrolled ? "0 2px 24px rgba(32,36,59,.08)" : "none",
          borderBottom: scrolled ? "1px solid rgba(32,36,59,.07)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "0 clamp(20px,5vw,60px)",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Image
              src="/images/logo/logo.png"
              alt="Kalavridhi Arts — Grow Your Dream"
              width={130}
              height={60}
              style={{ objectFit: "contain", height: "52px", width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  padding: "8px 16px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--ink)",
                  textDecoration: "none",
                  transition: "background 0.2s, color 0.2s",
                  whiteSpace: "nowrap",
                }}
                className="nav-link"
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(243,165,199,.2)";
                  (e.target as HTMLElement).style.color = "var(--maroon)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "transparent";
                  (e.target as HTMLElement).style.color = "var(--ink)";
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop WhatsApp CTA */}
          <a
            href={waLink("Hello, I would like to know more about Kalavridhi Arts classes.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ display: "none", fontSize: "13px", padding: "10px 20px" }}
            id="nav-wa"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>

          {/* Mobile menu toggle */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: "var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              minWidth: "44px",
              minHeight: "44px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ display: "block", width: "22px", height: "2px", background: "currentColor", transition: "transform 0.25s", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "currentColor", transition: "opacity 0.25s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "currentColor", transition: "transform 0.25s", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </button>
        </div>

        <style>{`
          @media (min-width: 768px) {
            #nav-wa { display: inline-flex !important; }
            button[aria-label] { display: none !important; }
            nav { display: flex !important; }
          }
          @media (max-width: 767px) {
            nav { display: none !important; }
          }
        `}</style>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "16px 20px",
                  fontSize: "24px",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 600,
                  color: "var(--ink)",
                  textDecoration: "none",
                  borderRadius: "12px",
                  transition: "background 0.2s",
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href={waLink("Hello, I would like to know more about Kalavridhi Arts classes.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ marginTop: "32px", alignSelf: "flex-start" }}
            onClick={() => setMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
          <p style={{ marginTop: "auto", fontSize: "13px", color: "rgba(32,36,59,.5)" }}>
            © 2026 Kalavridhi Arts
          </p>
        </div>
      )}
    </>
  );
}
