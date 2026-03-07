"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Input, Button, SaveToast } from "../components/AdminUI";
import type { StatItem } from "@/app/data/siteDataManager";

export default function AdminStats() {
  const { siteData, updateSection } = useAdmin();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (siteData?.stats) setStats([...siteData.stats]);
  }, [siteData]);

  const addStat = () => {
    setStats([...stats, { value: 0, label: "", suffix: "+" }]);
  };

  const updateStat = (idx: number, key: keyof StatItem, val: string | number) => {
    const u = [...stats];
    u[idx] = { ...u[idx], [key]: val };
    setStats(u);
  };

  const removeStat = (idx: number) => {
    setStats(stats.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    const ok = await updateSection("stats", stats);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  return (
    <div>
      <PageHeader
        title="Stats"
        description="Edit your achievement numbers"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={addStat}>+ Add</Button>
            <Button onClick={handleSave}>Save All</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold gradient-text">
                  {stat.value}{stat.suffix}
                </span>
                <Button variant="danger" size="sm" onClick={() => removeStat(idx)}>✕</Button>
              </div>
              <Input label="Label" value={stat.label} onChange={(e) => updateStat(idx, "label", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Value" type="number" value={stat.value} onChange={(e) => updateStat(idx, "value", parseInt(e.target.value) || 0)} />
                <Input label="Suffix" value={stat.suffix || ""} onChange={(e) => updateStat(idx, "suffix", e.target.value)} placeholder="+ or %" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <SaveToast show={saved} />
    </div>
  );
}
