"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Input, TextArea, Button, SaveToast, EmptyState } from "../components/AdminUI";
import type { EducationItem } from "@/app/data/siteDataManager";

export default function AdminEducation() {
  const { siteData, updateSection, uploadFile } = useAdmin();
  const [items, setItems] = useState<EducationItem[]>([]);
  const [editing, setEditing] = useState<EducationItem | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (siteData?.educations) setItems([...siteData.educations]);
  }, [siteData]);

  const openNew = () => {
    const nextId = items.length > 0 ? Math.max(...items.map((e) => e.id)) + 1 : 1;
    setEditing({ id: nextId, institution: "", degree: "", period: "", description: "", image: "" });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadFile(file, "education");
    if (url) setEditing({ ...editing, image: url });
    setUploading(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    const exists = items.find((e) => e.id === editing.id);
    const updated = exists ? items.map((e) => (e.id === editing.id ? editing : e)) : [...items, editing];
    const ok = await updateSection("educations", updated);
    if (ok) { setItems(updated); setEditing(null); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    const updated = items.filter((e) => e.id !== id);
    const ok = await updateSection("educations", updated);
    if (ok) setItems(updated);
  };

  return (
    <div>
      <PageHeader title="Education" description="Manage your education history" action={<Button onClick={openNew}>+ Add</Button>} />

      {editing && (
        <Card className="mb-6 border-[#d10000]/30">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Institution" value={editing.institution} onChange={(e) => setEditing({ ...editing, institution: e.target.value })} />
              <Input label="Degree" value={editing.degree} onChange={(e) => setEditing({ ...editing, degree: e.target.value })} />
              <Input label="Period" value={editing.period} onChange={(e) => setEditing({ ...editing, period: e.target.value })} placeholder="2021 - Sekarang" />
              <Input label="Image URL" value={editing.image || ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="https://res.cloudinary.com/..." />
            </div>
            <TextArea label="Description" value={editing.description} rows={3} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            
            {/* Image Upload */}
            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">Image</label>
              {editing.image && (
                <div className="mb-3 relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border border-white/10">
                  <img src={editing.image} alt="Education preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, image: "" })}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white/80 text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-white/10 file:text-white/70"
              />
              {uploading && <p className="text-xs text-white/40 mt-1">Uploading...</p>}
            </div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState icon="🎓" title="No education yet" />
      ) : (
        <div className="space-y-3">
          {items.map((edu) => (
            <Card key={edu.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {edu.image && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                      <img src={edu.image} alt={edu.institution} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-white">{edu.degree}</h3>
                    <p className="text-xs text-white/50">{edu.institution} • {edu.period}</p>
                    <p className="text-xs text-white/40 mt-1 line-clamp-2">{edu.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setEditing({ ...edu })}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(edu.id)}>Del</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <SaveToast show={saved} />
    </div>
  );
}
