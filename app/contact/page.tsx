"use client";

import React, { useState } from "react";
import StarBorder from "@/app/components/StarBorder";
import GSAPReveal from "@/app/components/GSAPReveal";
import { profile } from "@/app/data/mockData";

const ContactPage = () => {
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
    <div className="pt-20 sm:pt-24">
      <section className="py-12 sm:py-16 px-4 bg-dark-900">
        <div className="container mx-auto">
          {/* Title — Clip circle */}
          <GSAPReveal preset="clip-circle" duration={1.2}>
            <div className="text-center mb-10 sm:mb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Hubungi <span className="gradient-text">Saya</span>
              </h1>
              <p className="text-dark-300 max-w-3xl mx-auto text-sm sm:text-base">
                Ada pertanyaan atau ingin mendiskusikan proyek? Jangan ragu untuk
                menghubungi saya.
              </p>
            </div>
          </GSAPReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Contact info — Fade left with stagger */}
            <GSAPReveal preset="fade-left" duration={1}>
              <div className="card p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                  Informasi Kontak
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="font-medium mb-1 text-sm sm:text-base">Telepon</h3>
                    <p className="text-dark-300 text-sm sm:text-base">{profile.phone}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-sm sm:text-base">Email</h3>
                    <p className="text-dark-300 text-sm sm:text-base break-all">{profile.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-sm sm:text-base">Lokasi</h3>
                    <p className="text-dark-300 text-sm sm:text-base">{profile.location}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 text-sm sm:text-base">Sosial Media</h3>
                    <div className="flex gap-3">
                      {profile.socialLinks.github && (
                        <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-dark-300 hover:text-primary-400 transition-colors text-sm sm:text-base">
                          GitHub
                        </a>
                      )}
                      {profile.socialLinks.linkedin && (
                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-dark-300 hover:text-primary-400 transition-colors text-sm sm:text-base">
                          LinkedIn
                        </a>
                      )}
                      {profile.socialLinks.instagram && (
                        <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-dark-300 hover:text-primary-400 transition-colors text-sm sm:text-base">
                          Instagram
                        </a>
                      )}
                      {profile.socialLinks.twitter && (
                        <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-dark-300 hover:text-primary-400 transition-colors text-sm sm:text-base">
                          Twitter
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GSAPReveal>

            {/* Contact form — Fade right, form fields stagger */}
            <GSAPReveal preset="fade-right" duration={1} delay={0.15}>
              <div className="card p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Kirim Pesan</h2>
                <GSAPReveal preset="fade-up" stagger={0.1} duration={0.6} className="" start="top 95%">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4 sm:mb-6">
                      <label htmlFor="name" className="block text-dark-300 mb-2 text-sm sm:text-base">
                        Nama
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary/30 text-white text-sm sm:text-base transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="mb-4 sm:mb-6">
                      <label htmlFor="email" className="block text-dark-300 mb-2 text-sm sm:text-base">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary/30 text-white text-sm sm:text-base transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="mb-4 sm:mb-6">
                      <label htmlFor="subject" className="block text-dark-300 mb-2 text-sm sm:text-base">
                        Subjek
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary/30 text-white text-sm sm:text-base transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="mb-4 sm:mb-6">
                      <label htmlFor="message" className="block text-dark-300 mb-2 text-sm sm:text-base">
                        Pesan
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary/30 text-white resize-none text-sm sm:text-base transition-all duration-300"
                        required
                      ></textarea>
                    </div>
                    <StarBorder type="submit" className="w-full">
                      Kirim Pesan
                    </StarBorder>
                  </form>
                </GSAPReveal>
              </div>
            </GSAPReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
