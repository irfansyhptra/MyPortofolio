"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Input, Button, SaveToast, EmptyState } from "../components/AdminUI";
import type { SkillItem } from "@/app/data/siteDataManager";

export default function AdminSkills() {
  const { siteData, updateSection } = useAdmin();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (siteData?.skills) setSkills([...siteData.skills]);
  }, [siteData]);

  const addSkill = () => {
    setSkills([...skills, { name: "", level: 80, category: "Frontend" }]);
  };

  const updateSkill = (idx: number, key: keyof SkillItem, val: string | number) => {
    const u = [...skills];
    u[idx] = { ...u[idx], [key]: val };
    setSkills(u);
  };

  const removeSkill = (idx: number) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    const ok = await updateSection("skills", skills);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Manage your technical skills"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={addSkill}>+ Add Skill</Button>
            <Button onClick={handleSave}>Save All</Button>
          </div>
        }
      />

      {skills.length === 0 ? (
        <EmptyState icon="⚡" title="No skills yet" />
      ) : (
        <div className="space-y-3">
          {skills.map((skill, idx) => (
            <Card key={idx}>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end">
                <Input label="Skill Name" value={skill.name} onChange={(e) => updateSkill(idx, "name", e.target.value)} />
                <Input label="Category" value={skill.category} onChange={(e) => updateSkill(idx, "category", e.target.value)} placeholder="Frontend, Backend, Tools" />
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Level: {skill.level}%</label>
                  <input
                    type="range" min="0" max="100" value={skill.level}
                    onChange={(e) => updateSkill(idx, "level", parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d10000]"
                  />
                </div>
                <Button variant="danger" size="sm" onClick={() => removeSkill(idx)} className="mb-0.5">✕</Button>
              </div>
              {/* Visual bar */}
              <div className="mt-2 w-full bg-white/[0.06] rounded-full h-1.5">
                <div className="bg-gradient-to-r from-[#d10000] to-[#ff4500] h-1.5 rounded-full transition-all" style={{ width: `${skill.level}%` }} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <SaveToast show={saved} />
    </div>
  );
}
