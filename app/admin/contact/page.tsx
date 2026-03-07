"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Input, Button, SaveToast } from "../components/AdminUI";
import type { SiteProfile } from "@/app/data/siteDataManager";

export default function AdminContact() {
  const { siteData, updateSection } = useAdmin();
  const [form, setForm] = useState<Pick<SiteProfile, "email" | "phone" | "location" | "availability" | "socialLinks"> | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (siteData?.profile) {
      const { email, phone, location, availability, socialLinks } = siteData.profile;
      setForm({ email, phone, location, availability, socialLinks });
    }
  }, [siteData]);

  if (!form) return null;

  const handleSave = async () => {
    if (!siteData) return;
    const updated = { ...siteData.profile, ...form };
    const ok = await updateSection("profile", updated);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  return (
    <div>
      <PageHeader
        title="Contact Info"
        description="Edit contact details displayed on the site"
        action={<Button onClick={handleSave}>Save Changes</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <h3 className="text-sm font-medium text-white/50 mb-4">Contact Details</h3>
          <div className="space-y-4">
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input label="Availability Status" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-white/50 mb-4">Social Links</h3>
          <div className="space-y-4">
            <Input label="GitHub" value={form.socialLinks.github} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, github: e.target.value } })} />
            <Input label="LinkedIn" value={form.socialLinks.linkedin} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })} />
            <Input label="Instagram" value={form.socialLinks.instagram} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })} />
            <Input label="Twitter / X" value={form.socialLinks.twitter} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, twitter: e.target.value } })} />
          </div>
        </Card>
      </div>

      <SaveToast show={saved} />
    </div>
  );
}
