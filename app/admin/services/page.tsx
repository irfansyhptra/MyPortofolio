"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Input, TextArea, Button, SaveToast, EmptyState } from "../components/AdminUI";
import type { ServiceItem, WorkProcessItem } from "@/app/data/siteDataManager";

export default function AdminServices() {
  const { siteData, updateSection } = useAdmin();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [workProcess, setWorkProcess] = useState<WorkProcessItem[]>([]);
  const [editService, setEditService] = useState<ServiceItem | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (siteData) {
      setServices([...siteData.services]);
      setWorkProcess([...siteData.workProcess]);
    }
  }, [siteData]);

  const saveServices = async (updated: ServiceItem[]) => {
    const ok = await updateSection("services", updated);
    if (ok) { setServices(updated); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  const saveWorkProcess = async (updated: WorkProcessItem[]) => {
    const ok = await updateSection("workProcess", updated);
    if (ok) { setWorkProcess(updated); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  const handleSaveService = async () => {
    if (!editService) return;
    const exists = services.find((s) => s.id === editService.id);
    const updated = exists
      ? services.map((s) => (s.id === editService.id ? editService : s))
      : [...services, editService];
    await saveServices(updated);
    setEditService(null);
  };

  const addService = () => {
    const nextId = services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;
    setEditService({ id: nextId, title: "", description: "", icon: "💡" });
  };

  return (
    <div>
      <PageHeader title="Services" description="Manage your services and work process" />

      {/* ─── Services ────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-white/60">Services</h2>
        <Button size="sm" onClick={addService}>+ Add</Button>
      </div>

      {editService && (
        <Card className="mb-4 border-[#d10000]/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Icon (emoji)" value={editService.icon} onChange={(e) => setEditService({ ...editService, icon: e.target.value })} />
            <Input label="Title" value={editService.title} onChange={(e) => setEditService({ ...editService, title: e.target.value })} />
            <div className="sm:col-span-2">
              <TextArea label="Description" value={editService.description} rows={2} onChange={(e) => setEditService({ ...editService, description: e.target.value })} />
            </div>
          </div>
          <div className="mt-3 flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setEditService(null)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveService}>Save</Button>
          </div>
        </Card>
      )}

      {services.length === 0 ? (
        <EmptyState icon="💼" title="No services yet" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {services.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{s.title}</h3>
                  <p className="text-xs text-white/40 mt-1 line-clamp-2">{s.description}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => setEditService({ ...s })}>Edit</Button>
                <Button variant="danger" size="sm" onClick={async () => { const u = services.filter((x) => x.id !== s.id); await saveServices(u); }}>Del</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ─── Work Process ────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-white/60">Work Process</h2>
        <Button size="sm" onClick={() => {
          const nextStep = workProcess.length + 1;
          setWorkProcess([...workProcess, { step: nextStep, title: "", description: "" }]);
        }}>+ Add Step</Button>
      </div>

      <div className="space-y-3">
        {workProcess.map((wp, idx) => (
          <Card key={idx}>
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_auto] gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-[#d10000]/20 flex items-center justify-center text-sm font-bold text-[#d10000] flex-shrink-0">
                {wp.step}
              </div>
              <Input label="Title" value={wp.title} onChange={(e) => {
                const u = [...workProcess]; u[idx] = { ...u[idx], title: e.target.value }; setWorkProcess(u);
              }} />
              <Input label="Description" value={wp.description} onChange={(e) => {
                const u = [...workProcess]; u[idx] = { ...u[idx], description: e.target.value }; setWorkProcess(u);
              }} />
              <Button variant="danger" size="sm" className="mt-6" onClick={() => {
                const u = workProcess.filter((_, i) => i !== idx).map((w, i) => ({ ...w, step: i + 1 }));
                setWorkProcess(u);
              }}>✕</Button>
            </div>
          </Card>
        ))}
      </div>

      {workProcess.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button onClick={() => saveWorkProcess(workProcess)}>Save Work Process</Button>
        </div>
      )}

      <SaveToast show={saved} />
    </div>
  );
}
