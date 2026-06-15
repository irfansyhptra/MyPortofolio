"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Input, TextArea, Button, SaveToast, EmptyState } from "../components/AdminUI";
import type { ProjectItem } from "@/app/data/siteDataManager";

const emptyProject: ProjectItem = {
  id: 0,
  title: "",
  description: "",
  image: "",
  link: "",
  category: [],
  technologies: [],
  featured: false,
  monthCreated: "",
  yearCreated: "",
  testimonial: "",
};

export default function AdminProjects() {
  const { siteData, updateSection, uploadFile } = useAdmin();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [catRaw, setCatRaw] = useState("");
  const [techRaw, setTechRaw] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (siteData?.projects) setProjects([...siteData.projects]);
  }, [siteData]);

  const openEditor = (p: ProjectItem) => {
    setEditing({ ...p });
    setCatRaw(p.category.join(", "));
    setTechRaw(p.technologies.join(", "));
  };

  const openNew = () => {
    const nextId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    openEditor({ ...emptyProject, id: nextId });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = await uploadFile(file, "projects");
    if (url) setEditing({ ...editing, image: url });
  };

  const handleSaveItem = async () => {
    if (!editing) return;
    const item: ProjectItem = {
      ...editing,
      category: catRaw.split(",").map((c) => c.trim()).filter(Boolean),
      technologies: techRaw.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const exists = projects.find((p) => p.id === item.id);
    const updated = exists
      ? projects.map((p) => (p.id === item.id ? item : p))
      : [...projects, item];

    const ok = await updateSection("projects", updated);
    if (ok) {
      setProjects(updated);
      setEditing(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    const updated = projects.filter((p) => p.id !== id);
    const ok = await updateSection("projects", updated);
    if (ok) setProjects(updated);
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects"
        action={<Button onClick={openNew}>+ Add Project</Button>}
      />

      {/* Editor modal */}
      {editing && (
        <Card className="mb-6 border-[#d10000]/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">
              {editing.id && projects.find((p) => p.id === editing.id) ? "Edit" : "New"} Project
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>✕ Cancel</Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input label="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <Input label="Live Link" value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} />
            <div className="lg:col-span-2">
              <TextArea label="Description" value={editing.description} rows={4} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <Input label="Categories (comma separated)" value={catRaw} onChange={(e) => setCatRaw(e.target.value)} placeholder="Web Development, E-Commerce" />
            <Input label="Technologies (comma separated)" value={techRaw} onChange={(e) => setTechRaw(e.target.value)} placeholder="React, Node.js, MongoDB" />
            <Input label="Month Created" value={editing.monthCreated || ""} onChange={(e) => setEditing({ ...editing, monthCreated: e.target.value })} placeholder="Desember" />
            <Input label="Year Created" value={editing.yearCreated || ""} onChange={(e) => setEditing({ ...editing, yearCreated: e.target.value })} placeholder="2025" />
            <div className="lg:col-span-2">
              <TextArea label="Testimonial" value={editing.testimonial || ""} rows={3} onChange={(e) => setEditing({ ...editing, testimonial: e.target.value })} placeholder="Client testimonial / feedback for this project (optional)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-white/10 file:text-white/70" />
              {editing.image && <p className="text-xs text-white/30 mt-1 truncate">{editing.image}</p>}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-white/60">Featured:</label>
              <input type="checkbox" checked={editing.featured || false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="rounded" />
            </div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSaveItem}>Save Project</Button>
          </div>
        </Card>
      )}

      {/* Project list */}
      {projects.length === 0 ? (
        <EmptyState icon="🚀" title="No projects yet" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card key={p.id} className="hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-sm font-medium text-white truncate">{p.title}</h3>
                {p.featured && <span className="text-[10px] px-2 py-0.5 bg-[#d10000]/20 text-[#d10000] rounded-full flex-shrink-0">Featured</span>}
              </div>
              <p className="text-xs text-white/40 mb-3 line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {p.technologies.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 bg-white/[0.06] rounded text-white/50">{t}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEditor(p)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <SaveToast show={saved} />
    </div>
  );
}
