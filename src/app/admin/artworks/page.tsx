"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { prepareUpload } from "@/lib/prepare-upload";

interface Artwork {
  id: string; title: string; image: string; alt: string;
  medium?: string; artForm: string; category: string;
  description?: string; featured: boolean; published: boolean;
  sortOrder: number;
}

const ART_FORMS = [
  "Zendoodle art","Mandala art","Madhubani art","Water colour pencil art",
  "Kids colour pencil art","Fabric painting","Tanjore fabric painting",
  "Acrylic painting","Kerala mural painting","Poster painting",
  "Glass painting","Water colour painting","Pencil shading",
];

const BLANK: Omit<Artwork, "id"> = {
  title: "", image: "", alt: "", medium: "", artForm: ART_FORMS[0],
  category: "Painting", description: "", featured: false, published: true, sortOrder: 0,
};

const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{ fontSize: "13px", fontWeight: 600, color: "rgba(32,36,59,.65)" }}>{label}</label>
    {children}
  </div>
);

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "add" | Artwork>(null);
  const [form, setForm] = useState<Omit<Artwork, "id">>(BLANK);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchArtworks = () => {
    setLoading(true);
    fetch("/api/admin/artworks").then(r => r.json()).then(d => { setArtworks(d); setLoading(false); });
  };

  useEffect(() => { fetchArtworks(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const openAdd = () => { setForm({ ...BLANK, sortOrder: artworks.length + 1 }); setModal("add"); };
  const openEdit = (art: Artwork) => { setForm({ ...art }); setModal(art); };
  const closeModal = () => { setModal(null); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
    const fd = new FormData();
    fd.append("file", await prepareUpload(file));
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setForm(f => ({ ...f, image: data.url }));
    else showToast("Upload failed: " + (data.error || "unknown error"));
    } catch (error) { showToast(error instanceof Error ? error.message : "Upload failed. Please retry."); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    if (modal === "add") {
      const res = await fetch("/api/admin/artworks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { showToast("Artwork added!"); fetchArtworks(); closeModal(); }
    } else if (modal && typeof modal === "object") {
      const res = await fetch(`/api/admin/artworks/${modal.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { showToast("Saved!"); fetchArtworks(); closeModal(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/artworks/${id}`, { method: "DELETE" });
    showToast("Deleted.");
    fetchArtworks();
  };

  const toggleField = async (id: string, field: "published" | "featured", val: boolean) => {
    await fetch(`/api/admin/artworks/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: val }) });
    fetchArtworks();
  };



  return (
    <div style={{ padding: "clamp(24px,4vw,40px)", position: "relative" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "20px", right: "20px", background: "#166534", color: "#fff", padding: "12px 20px", borderRadius: "12px", zIndex: 9999, fontSize: "14px", fontWeight: 500 }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>Artworks</h1>
          <p style={{ fontSize: "14px", color: "rgba(32,36,59,.5)", margin: 0 }}>{artworks.length} total artwork{artworks.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: "14px", padding: "11px 22px" }}>+ Add Artwork</button>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: "40px", textAlign: "center", color: "rgba(32,36,59,.4)" }}>Loading…</p>
        ) : artworks.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <p style={{ fontSize: "18px", color: "rgba(32,36,59,.4)", marginBottom: "16px" }}>No artworks yet</p>
            <button onClick={openAdd} className="btn-primary">Add First Artwork</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead><tr>
                <th>Image</th>
                <th>Title</th>
                <th>Art Form</th>
                <th>Published</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr></thead>
              <tbody>
                {artworks.map(art => (
                  <tr key={art.id}>
                    <td>
                      {art.image ? (
                        <div style={{ width: "52px", height: "52px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                          <Image src={art.image} alt={art.title} width={52} height={52} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ) : <div style={{ width: "52px", height: "52px", borderRadius: "8px", background: "var(--canvas-alt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🖼</div>}
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: "200px" }}>{art.title}</td>
                    <td style={{ color: "rgba(32,36,59,.6)", fontSize: "13px" }}>{art.artForm}</td>
                    <td>
                      <button
                        onClick={() => toggleField(art.id, "published", !art.published)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <span className={art.published ? "badge-pub" : "badge-draft"}>{art.published ? "✓ Live" : "Draft"}</span>
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleField(art.id, "featured", !art.featured)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", padding: "4px" }}
                        title={art.featured ? "Remove from featured" : "Mark as featured"}
                      >
                        {art.featured ? "⭐" : "☆"}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => openEdit(art)}
                          style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--canvas-alt)", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}
                        >Edit</button>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(220,60,60,.25)", background: "rgba(220,60,60,.07)", color: "#dc3c3c", cursor: "pointer", fontSize: "13px" }}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "rgba(10,10,20,.7)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "540px", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", margin: 0 }}>{modal === "add" ? "Add Artwork" : "Edit Artwork"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "rgba(32,36,59,.5)" }}>✕</button>
            </div>

            <F label="Title *">
              <input className="admin-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Lotus Mandala" required />
            </F>

            <F label="Image">
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <input className="admin-input" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="/images/artwork/..." style={{ flex: 1 }} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1.5px solid var(--line)", background: "var(--canvas-alt)", cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {uploading ? "Uploading…" : "Upload"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
              </div>
              {form.image && (
                <div style={{ marginTop: "8px", width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden" }}>
                  <Image src={form.image} alt="Preview" width={80} height={80} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </F>

            <F label="Alt text (for accessibility)">
              <input className="admin-input" value={form.alt} onChange={e => setForm(f => ({ ...f, alt: e.target.value }))} placeholder="Describe the artwork for screen readers" />
            </F>

            <F label="Art Form *">
              <select className="admin-input" value={form.artForm} onChange={e => setForm(f => ({ ...f, artForm: e.target.value }))}>
                {ART_FORMS.map(af => <option key={af}>{af}</option>)}
              </select>
            </F>

            <F label="Medium">
              <input className="admin-input" value={form.medium || ""} onChange={e => setForm(f => ({ ...f, medium: e.target.value }))} placeholder="e.g. Watercolour on paper" />
            </F>

            <F label="Description">
              <textarea className="admin-input" rows={3} value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional artwork description" style={{ resize: "vertical" }} />
            </F>

            <div style={{ display: "flex", gap: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} style={{ width: "16px", height: "16px" }} />
                Published (visible on site)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: "16px", height: "16px" }} />
                Featured
              </label>
            </div>

            <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
              <button onClick={handleSave} disabled={saving || !form.title} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                {saving ? "Saving…" : modal === "add" ? "Add Artwork" : "Save Changes"}
              </button>
              <button onClick={closeModal} className="btn-secondary" style={{ padding: "13px 20px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
