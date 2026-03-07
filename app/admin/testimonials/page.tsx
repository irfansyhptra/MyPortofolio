"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Input, TextArea, Button, SaveToast, EmptyState } from "../components/AdminUI";
import type { TestimonialItem } from "@/app/data/siteDataManager";

export default function AdminTestimonials() {
  const { siteData, updateSection, uploadFile } = useAdmin();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (siteData?.testimonials) setItems([...siteData.testimonials]);
  }, [siteData]);

  const openNew = () => {
    const nextId = items.length > 0 ? Math.max(...items.map((t) => t.id)) + 1 : 1;
    setEditing({ id: nextId, name: "", position: "", quote: "", avatar: "" });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = await uploadFile(file, "testimonials");
    if (url) setEditing({ ...editing, avatar: url });
  };

  const handleSave = async () => {
    if (!editing) return;
    const exists = items.find((t) => t.id === editing.id);
    const updated = exists ? items.map((t) => (t.id === editing.id ? editing : t)) : [...items, editing];
    const ok = await updateSection("testimonials", updated);
    if (ok) { setItems(updated); setEditing(null); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    const updated = items.filter((t) => t.id !== id);
    const ok = await updateSection("testimonials", updated);
    if (ok) setItems(updated);
  };

  return (
    <div>
      <PageHeader title="Testimonials" description="Manage client testimonials" action={<Button onClick={openNew}>+ Add</Button>} />

      {editing && (
        <Card className="mb-6 border-[#d10000]/30">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <Input label="Position" value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value })} />
            </div>
            <TextArea label="Quote" value={editing.quote} rows={3} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Avatar</label>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-white/10 file:text-white/70" />
            </div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState icon="💬" title="No testimonials yet" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((t) => (
            <Card key={t.id}>
              <p className="text-xs text-white/50 italic mb-3 line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/50 flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">{t.name}</p>
                  <p className="text-[10px] text-white/40 truncate">{t.position}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing({ ...t })}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)}>Del</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <SaveToast show={saved} />
    </div>
  );
}
