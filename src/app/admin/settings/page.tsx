"use client";
import { useEffect, useState } from "react";

interface Settings {
  siteName: string; tagline: string; whatsapp: string; instagram: string;
  founderName: string; founderTitle: string; yearsExperience: string;
  shortBio: string; qualifications: string[];
  heroHeading: string; heroSubheading: string;
  enableEnquiryForm: boolean; metaDescription: string;
}

const F = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{ fontSize: "13px", fontWeight: 600, color: "rgba(32,36,59,.65)" }}>{label}</label>
    {hint && <p style={{ fontSize: "12px", color: "rgba(32,36,59,.4)", margin: 0 }}>{hint}</p>}
    {children}
  </div>
);

export default function AdminSettings() {
  const [form, setForm] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [newQual, setNewQual] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.json()).then(setForm);
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) showToast("Settings saved! Changes are live on the site.");
    else showToast("Error saving settings.");
    setSaving(false);
  };

  const addQual = () => {
    if (!newQual.trim() || !form) return;
    setForm(f => f ? ({ ...f, qualifications: [...f.qualifications, newQual.trim()] }) : f);
    setNewQual("");
  };
  const removeQual = (i: number) => {
    setForm(f => f ? ({ ...f, qualifications: f.qualifications.filter((_, idx) => idx !== i) }) : f);
  };

  if (!form) return <div style={{ padding: "40px", textAlign: "center", color: "rgba(32,36,59,.4)" }}>Loading settings…</div>;



  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="admin-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: 600, margin: 0, color: "var(--ink)", paddingBottom: "12px", borderBottom: "1px solid var(--line)" }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ padding: "clamp(24px,4vw,40px)", position: "relative", maxWidth: "760px" }}>
      {toast && (
        <div style={{ position: "fixed", top: "20px", right: "20px", background: "#166534", color: "#fff", padding: "12px 20px", borderRadius: "12px", zIndex: 9999, fontSize: "14px", fontWeight: 500, maxWidth: "340px" }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>Site Settings</h1>
        <p style={{ fontSize: "14px", color: "rgba(32,36,59,.5)", margin: 0 }}>Changes here update the live website immediately after saving.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Contact */}
        <Section title="🔗 Contact & Social">
          <F label="WhatsApp Number" hint="Include country code, no spaces or +. e.g. 918925626784">
            <input className="admin-input" value={form.whatsapp} onChange={e => setForm(f => ({ ...f!, whatsapp: e.target.value }))} placeholder="918925626784" />
          </F>
          <F label="Instagram URL">
            <input className="admin-input" value={form.instagram} onChange={e => setForm(f => ({ ...f!, instagram: e.target.value }))} placeholder="https://www.instagram.com/..." />
          </F>
        </Section>

        {/* Founder */}
        <Section title="👩‍🎨 Founder / About">
          <F label="Founder Name">
            <input className="admin-input" value={form.founderName} onChange={e => setForm(f => ({ ...f!, founderName: e.target.value }))} />
          </F>
          <F label="Founder Title">
            <input className="admin-input" value={form.founderTitle} onChange={e => setForm(f => ({ ...f!, founderTitle: e.target.value }))} placeholder="Artist & Art Educator" />
          </F>
          <F label="Years of Experience">
            <input className="admin-input" value={form.yearsExperience} onChange={e => setForm(f => ({ ...f!, yearsExperience: e.target.value }))} placeholder="20" style={{ maxWidth: "120px" }} />
          </F>
          <F label="Short Bio">
            <textarea className="admin-input" rows={4} value={form.shortBio} onChange={e => setForm(f => ({ ...f!, shortBio: e.target.value }))} style={{ resize: "vertical" }} />
          </F>
          <F label="Qualifications">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
              {form.qualifications.map((q, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--canvas-alt)", border: "1px solid var(--line)", borderRadius: "8px", padding: "5px 10px", fontSize: "13px" }}>
                  {q}
                  <button onClick={() => removeQual(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(32,36,59,.4)", fontSize: "14px", padding: 0, lineHeight: 1 }}>✕</button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input className="admin-input" value={newQual} onChange={e => setNewQual(e.target.value)} onKeyDown={e => e.key === "Enter" && addQual()} placeholder="Add qualification…" style={{ flex: 1 }} />
              <button onClick={addQual} style={{ padding: "10px 16px", borderRadius: "10px", border: "1.5px solid var(--maroon)", color: "var(--maroon)", background: "transparent", cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Add</button>
            </div>
          </F>
        </Section>

        {/* Hero */}
        <Section title="🏠 Hero Section">
          <F label="Hero Heading">
            <input className="admin-input" value={form.heroHeading} onChange={e => setForm(f => ({ ...f!, heroHeading: e.target.value }))} placeholder="Where Creativity Blooms." />
          </F>
          <F label="Hero Subheading">
            <textarea className="admin-input" rows={2} value={form.heroSubheading} onChange={e => setForm(f => ({ ...f!, heroSubheading: e.target.value }))} style={{ resize: "vertical" }} />
          </F>
        </Section>

        {/* SEO */}
        <Section title="🔍 SEO">
          <F label="Site Name">
            <input className="admin-input" value={form.siteName} onChange={e => setForm(f => ({ ...f!, siteName: e.target.value }))} />
          </F>
          <F label="Tagline">
            <input className="admin-input" value={form.tagline} onChange={e => setForm(f => ({ ...f!, tagline: e.target.value }))} placeholder="Grow Your Dream" />
          </F>
          <F label="Meta Description" hint="Appears in Google search results (recommended: 140–160 chars)">
            <textarea className="admin-input" rows={3} value={form.metaDescription} onChange={e => setForm(f => ({ ...f!, metaDescription: e.target.value }))} style={{ resize: "vertical" }} />
            <p style={{ fontSize: "12px", color: form.metaDescription.length > 160 ? "#dc3c3c" : "rgba(32,36,59,.4)", margin: 0, textAlign: "right" }}>{form.metaDescription.length} / 160</p>
          </F>
        </Section>

        {/* Features */}
        <Section title="⚙ Features">
          <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.enableEnquiryForm}
              onChange={e => setForm(f => ({ ...f!, enableEnquiryForm: e.target.checked }))}
              style={{ width: "18px", height: "18px" }}
            />
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "14px" }}>Enable Enquiry Form</p>
              <p style={{ margin: 0, fontSize: "13px", color: "rgba(32,36,59,.5)" }}>Show the contact form in the Contact section (form submits to WhatsApp)</p>
            </div>
          </label>
        </Section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
          style={{ alignSelf: "flex-start", fontSize: "15px", padding: "14px 32px" }}
        >
          {saving ? "Saving…" : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}
