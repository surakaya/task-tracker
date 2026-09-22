import { useState } from "react";

interface Props { onSubmit: (title: string, description: string, isImportant: boolean, reminderAt: string | null) => Promise<void>; }

export default function TaskForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [reminderAt, setReminderAt] = useState("");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); if (!title.trim()) return; setLoading(true);
    try { await onSubmit(title.trim(), description.trim(), isImportant, reminderAt || null); setTitle(""); setDescription(""); setIsImportant(false); setReminderAt(""); }
    finally { setLoading(false); }
  }
  return <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"><h2 className="text-sm font-semibold text-slate-700 mb-4">Yeni görev</h2><form onSubmit={handleSubmit} className="flex flex-col gap-3"><input type="text" placeholder="Ne yapacaksın?" value={title} onChange={(e) => setTitle(e.target.value)} className="field" required /><textarea placeholder="Kısa not (isteğe bağlı)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="field resize-none" /><div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={isImportant} onChange={(e) => setIsImportant(e.target.checked)} className="accent-brand-600" /> Önemli</label><label className="flex items-center gap-2 text-xs text-slate-600">Hatırlat <input type="datetime-local" value={reminderAt} onChange={(e) => setReminderAt(e.target.value)} className="rounded-md border border-slate-200 px-2 py-1 text-xs" /></label><button type="submit" disabled={loading || !title.trim()} className="ml-auto bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition">{loading ? "Ekleniyor..." : "Ekle"}</button></div></form></div>;
}
