"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Input, TextArea, Button, SaveToast, EmptyState } from "../components/AdminUI";
import type { ExperienceItem } from "@/app/data/siteDataManager";

export default function AdminExperience() {
  const { siteData, updateSection } = useAdmin();
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [editing, setEditing] = useState<ExperienceItem | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (siteData?.experiences) setItems([...siteData.experiences]);
  }, [siteData]);

  const openNew = () => {
    const nextId = items.length > 0 ? Math.max(...items.map((e) => e.id)) + 1 : 1;
    setEditing({ id: nextId, position: "", company: "", period: "", description: "" });
  };

  const handleSave = async () => {
    if (!editing) return;
    const exists = items.find((e) => e.id === editing.id);
    const updated = exists ? items.map((e) => (e.id === editing.id ? editing : e)) : [...items, editing];
    const ok = await updateSection("experiences", updated);
    if (ok) { setItems(updated); setEditing(null); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    const updated = items.filter((e) => e.id !== id);
    const ok = await updateSection("experiences", updated);
    if (ok) setItems(updated);
  };

  return (
    <div>
      <PageHeader title="Experience" description="Manage your work experience" action={<Button onClick={openNew}>+ Add</Button>} />

      {editing && (
        <Card className="mb-6 border-[#d10000]/30">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Position" value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value })} />
              <Input label="Company" value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} />
              <Input label="Period" value={editing.period} onChange={(e) => setEditing({ ...editing, period: e.target.value })} placeholder="2023 - Sekarang" />
            </div>
            <TextArea label="Description" value={editing.description} rows={3} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState icon="📋" title="No experience yet" />
      ) : (
        <div className="space-y-3">
          {items.map((exp) => (
            <Card key={exp.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-white">{exp.position}</h3>
                  <p className="text-xs text-white/50">{exp.company} • {exp.period}</p>
                  <p className="text-xs text-white/40 mt-1 line-clamp-2">{exp.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setEditing({ ...exp })}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(exp.id)}>Del</Button>
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
