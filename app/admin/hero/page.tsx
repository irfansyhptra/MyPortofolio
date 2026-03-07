"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Input, TextArea, Button, SaveToast } from "../components/AdminUI";
import type { HeroData } from "@/app/data/siteDataManager";

export default function AdminHero() {
  const { siteData, updateSection } = useAdmin();
  const [form, setForm] = useState<HeroData | null>(null);
  const [textsRaw, setTextsRaw] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (siteData?.hero) {
      setForm({ ...siteData.hero });
      setTextsRaw(siteData.hero.rotatingTexts.join(", "));
    }
  }, [siteData]);

  if (!form) return null;

  const handleSave = async () => {
    const updated = {
      ...form,
      rotatingTexts: textsRaw.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const ok = await updateSection("hero", updated);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div>
      <PageHeader
        title="Hero Section"
        description="Customize the hero section on the homepage"
        action={<Button onClick={handleSave}>Save Changes</Button>}
      />

      <Card>
        <div className="space-y-4 max-w-2xl">
          <Input label="Greeting" value={form.greeting} onChange={(e) => setForm({ ...form, greeting: e.target.value })} placeholder="I'm Ready For Job" />
          <Input label="Name Display" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="I'm Irfan Syahputra" />
          <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Full Stack Developer" />
          <TextArea label="Description" value={form.description} rows={2} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Crafting seamless web experiences..." />
          <Input label="Rotating Texts (comma separated)" value={textsRaw} onChange={(e) => setTextsRaw(e.target.value)} placeholder="React, Next.js, Is, Cool!" />
          <p className="text-xs text-white/30">Preview: {textsRaw.split(",").map(t => t.trim()).filter(Boolean).join(" → ")}</p>
        </div>
      </Card>

      <SaveToast show={saved} />
    </div>
  );
}
