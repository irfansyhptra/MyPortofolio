"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Input, TextArea, Button, SaveToast, EmptyState } from "../components/AdminUI";
import type { BlogPostItem } from "@/app/data/siteDataManager";

export default function AdminBlog() {
  const { siteData, updateSection, uploadFile } = useAdmin();
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [editing, setEditing] = useState<BlogPostItem | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (siteData?.blogPosts) setPosts([...siteData.blogPosts]);
  }, [siteData]);

  const openNew = () => {
    const nextId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
    setEditing({
      id: nextId, title: "", excerpt: "", content: "",
      date: new Date().toISOString().split("T")[0],
      author: siteData?.profile.name || "Irfan Syahputra",
      image: "", category: "Web Development",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = await uploadFile(file, "blog");
    if (url) setEditing({ ...editing, image: url });
  };

  const handleSave = async () => {
    if (!editing) return;
    const exists = posts.find((p) => p.id === editing.id);
    const updated = exists
      ? posts.map((p) => (p.id === editing.id ? editing : p))
      : [...posts, editing];
    const ok = await updateSection("blogPosts", updated);
    if (ok) {
      setPosts(updated);
      setEditing(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    const updated = posts.filter((p) => p.id !== id);
    const ok = await updateSection("blogPosts", updated);
    if (ok) setPosts(updated);
  };

  return (
    <div>
      <PageHeader title="Blog" description="Manage your blog posts" action={<Button onClick={openNew}>+ New Post</Button>} />

      {editing && (
        <Card className="mb-6 border-[#d10000]/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">{posts.find((p) => p.id === editing.id) ? "Edit" : "New"} Post</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>✕</Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <Input label="Category" value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              <Input label="Date" type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-white/10 file:text-white/70" />
              </div>
            </div>
            <TextArea label="Excerpt" value={editing.excerpt} rows={2} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            <TextArea label="Content (Markdown)" value={editing.content} rows={10} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save Post</Button>
          </div>
        </Card>
      )}

      {posts.length === 0 ? (
        <EmptyState icon="📝" title="No blog posts yet" />
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate">{p.title}</h3>
                <p className="text-xs text-white/40 mt-0.5">{p.date} • {p.category}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => setEditing({ ...p })}>Edit</Button>
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
