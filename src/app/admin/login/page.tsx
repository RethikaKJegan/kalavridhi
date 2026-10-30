"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Incorrect password. Please try again.");
        setPw("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--ink)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background blobs */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-15%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(243,165,199,.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,182,237,.06) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      <div style={{
        background: "rgba(255,249,242,.04)",
        border: "1px solid rgba(255,249,242,.1)",
        borderRadius: "28px",
        padding: "clamp(36px,5vw,56px)",
        width: "100%",
        maxWidth: "420px",
        position: "relative",
        zIndex: 1,
        backdropFilter: "blur(10px)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ background: "rgba(255,249,242,.06)", borderRadius: "16px", display: "inline-flex", padding: "12px 20px", marginBottom: "20px" }}>
            <Image src="/images/logo/logo.png" alt="Kalavridhi Arts" width={140} height={60} style={{ objectFit: "contain", height: "52px", width: "auto" }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 600, color: "#fff", margin: "0 0 6px" }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,249,242,.5)", margin: 0 }}>
            Kalavridhi Arts CMS
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="admin-pw" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,249,242,.65)", marginBottom: "8px" }}>
              Admin Password
            </label>
            <input
              id="admin-pw"
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Enter your password"
              required
              autoFocus
              style={{
                width: "100%",
                padding: "13px 16px",
                background: "rgba(255,249,242,.07)",
                border: `1.5px solid ${error ? "rgba(220,60,60,.5)" : "rgba(255,249,242,.15)"}`,
                borderRadius: "12px",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                boxSizing: "border-box",
              }}
            />
            {error && (
              <p style={{ fontSize: "13px", color: "#f87171", margin: "8px 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
                ⚠ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              background: "var(--maroon)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity .2s, transform .2s",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: "4px",
            }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p style={{ fontSize: "12px", color: "rgba(255,249,242,.3)", textAlign: "center", marginTop: "24px" }}>
          Admin access only. This page is not indexed.
        </p>
      </div>

      <style>{`
        input::placeholder { color: rgba(255,249,242,.25); }
        input:focus { border-color: rgba(243,165,199,.5) !important; box-shadow: 0 0 0 3px rgba(243,165,199,.12); }
      `}</style>
    </div>
  );
}
