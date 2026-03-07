"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Input, TextArea, Button, SaveToast } from "../components/AdminUI";
import type { SiteProfile } from "@/app/data/siteDataManager";

export default function AdminProfile() {
  const { siteData, updateSection, uploadFile } = useAdmin();
  const [form, setForm] = useState<SiteProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (siteData?.profile) setForm({ ...siteData.profile });
  }, [siteData]);

  if (!form) return null;

  const handleSave = async () => {
    const ok = await updateSection("profile", form);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "profile");
    if (url) setForm({ ...form, photo: url });
  };

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Edit your personal information"
        action={<Button onClick={handleSave}>Save Changes</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <h3 className="text-sm font-medium text-white/50 mb-4">Basic Info</h3>
          <div className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <TextArea label="Bio" value={form.bio} rows={3} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <TextArea label="Journey Text" value={form.journeyText} rows={5} onChange={(e) => setForm({ ...form, journeyText: e.target.value })} />
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-white/50 mb-4">Contact & Photo</h3>
          <div className="space-y-4">
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input label="Availability" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Photo</label>
              <div className="flex items-center gap-3">
                {form.photo && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.photo} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-white/10 file:text-white/70 hover:file:bg-white/20" />
              </div>
            </div>
            <Input label="CV File Path" value={form.cv} onChange={(e) => setForm({ ...form, cv: e.target.value })} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-sm font-medium text-white/50 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="GitHub" value={form.socialLinks.github} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, github: e.target.value } })} />
            <Input label="LinkedIn" value={form.socialLinks.linkedin} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })} />
            <Input label="Instagram" value={form.socialLinks.instagram} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })} />
            <Input label="Twitter" value={form.socialLinks.twitter} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, twitter: e.target.value } })} />
          </div>
        </Card>
      </div>

      <SaveToast show={saved} />
    </div>
  );
}
