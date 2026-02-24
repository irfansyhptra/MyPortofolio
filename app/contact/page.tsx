"use client";

import React, { useState } from "react";
import ScrollAnimation from "@/app/components/ScrollAnimation";
import StarBorder from "@/app/components/StarBorder"; // Impor komponen StarBorder

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
    // Tambahkan logika pengiriman form di sini (misal: API call ke backend)
    console.log("Form data submitted:", formData);
    alert("Pesan Anda telah terkirim! (Simulasi)");
  };

  return (
    <div className="pt-20 sm:pt-24">
      <section className="py-12 sm:py-16 px-4 bg-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Hubungi <span className="gradient-text">Saya</span>
            </h1>
            <p className="text-dark-300 max-w-3xl mx-auto text-sm sm:text-base">
              Ada pertanyaan atau ingin mendiskusikan proyek? Jangan ragu untuk
              menghubungi saya.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            <ScrollAnimation>
              <div className="card p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                  Informasi Kontak
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {/* Informasi Kontak */}
                  <div>
                    <h3 className="font-medium mb-1 text-sm sm:text-base">Telepon</h3>
                    <p className="text-dark-300 text-sm sm:text-base">+62 812 3456 7890</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-sm sm:text-base">Email</h3>
                    <p className="text-dark-300 text-sm sm:text-base break-all">kontak@irfansyahputra.com</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-sm sm:text-base">Lokasi</h3>
                    <p className="text-dark-300 text-sm sm:text-base">Jakarta, Indonesia</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.2}>
              <div className="card p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Kirim Pesan</h2>
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
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-primary-400 text-white text-sm sm:text-base"
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
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-primary-400 text-white text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div className="mb-4 sm:mb-6">
                    <label
                      htmlFor="subject"
                      className="block text-dark-300 mb-2 text-sm sm:text-base"
                    >
                      Subjek
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-primary-400 text-white text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div className="mb-4 sm:mb-6">
                    <label
                      htmlFor="message"
                      className="block text-dark-300 mb-2 text-sm sm:text-base"
                    >
                      Pesan
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-800 border border-dark-700 rounded-md focus:outline-none focus:border-primary-400 text-white resize-none text-sm sm:text-base"
                      required
                    ></textarea>
                  </div>
                  {/* Ganti <button> dengan <StarBorder> */}
                  <StarBorder
                    type="submit"
                    className="w-full"
                  >
                    Kirim Pesan
                  </StarBorder>
                </form>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
