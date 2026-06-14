"use client";
import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiGithub, FiLinkedin, FiInstagram, FiTwitter } from "react-icons/fi";
import { useData } from "@/app/components/DataContext";
import SplitText from "@/app/components/SplitText";

export default function ContactPage() {
  const { data } = useData();
  const { profile } = data;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    alert("Pesan Anda telah terkirim! (Simulasi)");
  };

  return (
    <div className="w-full min-h-screen py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-4 sm:gap-5">
      
      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        
        {/* Header Box (Full width / spans 2 columns on desktop) */}
        <div className="lg:col-span-2 card-minimal p-8 sm:p-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted block mb-3">
              Hubungi Saya
            </span>
            <SplitText
              text="Mari Bekerja Sama"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-1.5px] text-charcoal leading-none mb-6"
              delay={35}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              textAlign="left"
            />
            <p className="text-charcoal-muted text-sm sm:text-base max-w-2xl leading-relaxed">
              Punya proyek menarik, lowongan pekerjaan, atau sekadar ingin berdiskusi? Jangan ragu untuk mengirim pesan di bawah ini.
            </p>
          </div>
        </div>

        {/* Box 1: Contact Info */}
        <div className="card-minimal p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-charcoal mb-8 border-b border-cream-border pb-4">
              Informasi Kontak
            </h2>
            
            <div className="space-y-6">
              {/* Telepon */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-cream rounded-lg border border-cream-border text-charcoal">
                  <FiPhone size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted font-mono">
                    Telepon
                  </h3>
                  <p className="text-charcoal text-sm sm:text-base mt-1 font-medium">
                    {profile.phone}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-cream rounded-lg border border-cream-border text-charcoal">
                  <FiMail size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted font-mono">
                    Email
                  </h3>
                  <p className="text-charcoal text-sm sm:text-base mt-1 font-medium break-all">
                    {profile.email}
                  </p>
                </div>
              </div>

              {/* Lokasi */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-cream rounded-lg border border-cream-border text-charcoal">
                  <FiMapPin size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted font-mono">
                    Lokasi
                  </h3>
                  <p className="text-charcoal text-sm sm:text-base mt-1 font-medium">
                    {profile.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="mt-12 pt-6 border-t border-cream-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted font-mono mb-4">
              Sosial Media
            </h3>
            <div className="flex flex-wrap gap-3">
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5"
                >
                  <FiGithub /> GitHub
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5"
                >
                  <FiLinkedin /> LinkedIn
                </a>
              )}
              {profile.socialLinks.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5"
                >
                  <FiInstagram /> Instagram
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5"
                >
                  <FiTwitter /> Twitter
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Box 2: Form */}
        <div className="card-minimal p-8 sm:p-10">
          <h2 className="text-xl font-bold text-charcoal mb-8 border-b border-cream-border pb-4">
            Kirim Pesan
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted font-mono mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cream border border-cream-border rounded-lg text-charcoal text-sm focus:outline-none focus:border-charcoal-border focus:ring-1 focus:ring-charcoal/10 transition-colors duration-200 font-sans"
                placeholder="Masukkan nama Anda"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted font-mono mb-2">
                Alamat Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cream border border-cream-border rounded-lg text-charcoal text-sm focus:outline-none focus:border-charcoal-border focus:ring-1 focus:ring-charcoal/10 transition-colors duration-200 font-sans"
                placeholder="email@contoh.com"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted font-mono mb-2">
                Subjek
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cream border border-cream-border rounded-lg text-charcoal text-sm focus:outline-none focus:border-charcoal-border focus:ring-1 focus:ring-charcoal/10 transition-colors duration-200 font-sans"
                placeholder="Judul pesan"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted font-mono mb-2">
                Pesan
              </label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cream border border-cream-border rounded-lg text-charcoal text-sm focus:outline-none focus:border-charcoal-border focus:ring-1 focus:ring-charcoal/10 transition-colors duration-200 resize-none font-sans"
                placeholder="Tulis pesan Anda di sini..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-primary-dark w-full py-3 mt-4 flex items-center justify-center gap-2">
              Kirim Pesan <FiSend />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
