"use client";
import { useEffect, useState } from "react";

interface Workshop {
  id: string; slug: string; title: string; description: string;
  coverImage?: string; startAt?: string; endAt?: string;
  timezone?: string; location?: string; targetAudience?: string;
  ageRange?: string; status: "draft"|"published"|"cancelled"|"completed";
  registrationOpen: boolean; featured: boolean; whatsappMessage?: string;
}

const BLANK: Omit<Workshop, "id" | "slug"> = {
  title: "", description: "", coverImage: "", startAt: "", endAt: "",
  timezone: "Asia/Kolkata", location: "", targetAudience: "Kids & Adults",
  ageRange: "", status: "draft", registrationOpen: false, featured: false,
  whatsappMessage: "",
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft: { bg: "rgba(245,198,94,.2)", color: "#9a7a10" },
  published: { bg: "rgba(105,169,129,.15)", color: "#3a7a52" },
  cancelled: { bg: "rgba(220,60,60,.1)", color: "#dc3c3c" },
  completed: { bg: "rgba(37,140,167,.1)", color: "#258ca7" },
};

const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{ fontSize: "13px", fontWeight: 600, color: "rgba(32,36,59,.65)" }}>{label}</label>
    {children}
  </div>
);

export default function AdminWorkshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "add" | Workshop>(null);
  const [form, setForm] = useState<Omit<Workshop, "id" | "slug">>(BLANK);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const fetch_ = () => { setLoading(true); fetch("/api/admin/workshops").then(r => r.json()).then(d => { setWorkshops(d); setLoading(false); }); };
  useEffect(() => { fetch_(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const openAdd = () => { setForm({ ...BLANK }); setModal("add"); };
  const openEdit = (ws: Workshop) => { setForm({ ...ws }); setModal(ws); };
  const closeModal = () => setModal(null);

  const handleSave = async () => {
    setSaving(true);
    if (modal === "add") {
      const res = await fetch("/api/admin/workshops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { showToast("Workshop created!"); fetch_(); closeModal(); }
    } else if (modal && typeof modal === "object") {
      const res = await fetch(`/api/admin/workshops/${modal.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { showToast("Saved!"); fetch_(); closeModal(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/workshops/${id}`, { method: "DELETE" });
    showToast("Deleted."); fetch_();
  };



  return (
    <div style={{ padding: "clamp(24px,4vw,40px)", position: "relative" }}>
      {toast && <div style={{ position: "fixed", top: "20px", right: "20px", background: "#166534", color: "#fff", padding: "12px 20px", borderRadius: "12px", zIndex: 9999, fontSize: "14px" }}>✓ {toast}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>Workshops</h1>
          <p style={{ fontSize: "14px", color: "rgba(32,36,59,.5)", margin: 0 }}>{workshops.length} workshop{workshops.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: "14px", padding: "11px 22px" }}>+ Add Workshop</button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: "40px", textAlign: "center", color: "rgba(32,36,59,.4)" }}>Loading…</p>
        ) : workshops.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <p style={{ fontSize: "18px", color: "rgba(32,36,59,.4)", marginBottom: "16px" }}>No workshops yet</p>
            <button onClick={openAdd} className="btn-primary">Add First Workshop</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead><tr>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
                <th>Registration</th>
                <th>Actions</th>
              </tr></thead>
              <tbody>
                {workshops.map(ws => (
                  <tr key={ws.id}>
                    <td style={{ fontWeight: 600 }}>{ws.title}</td>
                    <td style={{ fontSize: "13px", color: "rgba(32,36,59,.6)" }}>
                      {ws.startAt ? new Date(ws.startAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td>
                      <span style={{ ...STATUS_COLORS[ws.status], padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, display: "inline-block" }}>
                        {ws.status}
                      </span>
                    </td>
                    <td>
                      <span className={ws.registrationOpen ? "badge-pub" : "badge-draft"}>
                        {ws.registrationOpen ? "Open" : "Closed"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => openEdit(ws)} style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--canvas-alt)", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}>Edit</button>
                        <button onClick={() => handleDelete(ws.id, ws.title)} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(220,60,60,.25)", background: "rgba(220,60,60,.07)", color: "#dc3c3c", cursor: "pointer", fontSize: "13px" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal !== null && (
        <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "rgba(10,10,20,.7)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "580px", maxHeight: "92vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", margin: 0 }}>{modal === "add" ? "Add Workshop" : "Edit Workshop"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "rgba(32,36,59,.5)" }}>✕</button>
            </div>

            <F label="Title *"><input className="admin-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Mandala Art Summer Workshop" /></F>
            <F label="Description *"><textarea className="admin-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the workshop…" style={{ resize: "vertical" }} /></F>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <F label="Start Date & Time">
                <input className="admin-input" type="datetime-local" value={form.startAt || ""} onChange={e => setForm(f => ({ ...f, startAt: e.target.value }))} />
              </F>
              <F label="End Date & Time">
                <input className="admin-input" type="datetime-local" value={form.endAt || ""} onChange={e => setForm(f => ({ ...f, endAt: e.target.value }))} />
              </F>
            </div>

            <F label="Location"><input className="admin-input" value={form.location || ""} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Online / Studio name / Address" /></F>
            <F label="Target Audience"><input className="admin-input" value={form.targetAudience || ""} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))} placeholder="e.g. Kids & Adults" /></F>
            <F label="Age Range"><input className="admin-input" value={form.ageRange || ""} onChange={e => setForm(f => ({ ...f, ageRange: e.target.value }))} placeholder="e.g. 8–60 years" /></F>

            <F label="Status">
              <select className="admin-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Workshop["status"] }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </F>

            <F label="WhatsApp Registration Message">
              <input className="admin-input" value={form.whatsappMessage || ""} onChange={e => setForm(f => ({ ...f, whatsappMessage: e.target.value }))} placeholder="Pre-filled message when user taps 'Register'" />
            </F>

            <div style={{ display: "flex", gap: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
                <input type="checkbox" checked={form.registrationOpen} onChange={e => setForm(f => ({ ...f, registrationOpen: e.target.checked }))} style={{ width: "16px", height: "16px" }} />
                Registration Open
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: "16px", height: "16px" }} />
                Featured
              </label>
            </div>

            <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
              <button onClick={handleSave} disabled={saving || !form.title || !form.description} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                {saving ? "Saving…" : modal === "add" ? "Create Workshop" : "Save Changes"}
              </button>
              <button onClick={closeModal} className="btn-secondary" style={{ padding: "13px 20px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
