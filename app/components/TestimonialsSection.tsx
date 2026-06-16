"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiStar, FiX, FiCheck, FiAlertCircle, FiLoader } from "react-icons/fi";
import { z } from "zod";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string | null;
  avatar: string | null;
  message: string;
  rating: number;
  created_at: string;
}

// Zod Schema for Client-Side Validation
const testimonialFormSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  position: z.string().min(2, "Jabatan minimal 2 karakter").max(50, "Jabatan maksimal 50 karakter"),
  company: z.string().max(50, "Perusahaan maksimal 50 karakter").optional(),
  avatar: z.string().refine((val) => {
    if (!val) return true;
    return val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:image/");
  }, {
    message: "Avatar harus berupa URL valid atau file gambar yang diunggah",
  }).optional(),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(500, "Pesan maksimal 500 karakter"),
  rating: z.number().int().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
});

type FormFields = z.infer<typeof testimonialFormSchema>;

export default function TestimonialsSection() {
  // Testimonials Fetch States
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormFields>({
    name: "",
    position: "",
    company: "",
    avatar: "",
    message: "",
    rating: 5,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch Approved Testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/testimonials");
      if (!res.ok) {
        throw new Error("Gagal mengambil data testimoni (Koneksi ditolak / server mati)");
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server Express.js di port 5000 belum berjalan.");
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTestimonials(json.data);
      } else {
        throw new Error("Format response data testimoni tidak valid");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat memuat testimoni.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on type
    if (formErrors[name as keyof FormFields]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRatingSelect = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFormErrors((prev) => ({ ...prev, avatar: "Ukuran file foto maksimal 2MB" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setFormData((prev) => ({ ...prev, avatar: base64Url }));
      setFormErrors((prev) => ({ ...prev, avatar: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);
    setFormErrors({});

    // Validate inputs with Zod
    const validationResult = testimonialFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof FormFields, string>> = {};
      validationResult.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof FormFields;
        fieldErrors[fieldName] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        let errorMsg = "Gagal mengirim testimoni.";
        if (contentType && contentType.includes("application/json")) {
          const json = await res.json();
          errorMsg = json.error || errorMsg;
        } else if (res.status === 413) {
          errorMsg = "Ukuran gambar terlalu besar. Silakan pilih foto dengan resolusi lebih kecil (maksimal 2MB).";
        } else {
          errorMsg = `Gagal mengirim: Server merespon status ${res.status}`;
        }
        throw new Error(errorMsg);
      }

      const json = await res.json();

      setSubmitSuccess("Testimoni Anda berhasil dikirim dan sedang menunggu persetujuan admin!");
      // Reset form
      setFormData({
        name: "",
        position: "",
        company: "",
        avatar: "",
        message: "",
        rating: 5,
      });
      // Close modal after delay
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(null);
      }, 3000);
    } catch (err: any) {
      setSubmitError(err.message || "Gagal menghubungkan ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lg:col-span-3 card-minimal p-8 sm:p-12 relative overflow-hidden">
      {/* Header section with Give Testimonial Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-cream-border">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">Testimoni</h3>
          <p className="text-charcoal-muted text-sm mt-1 leading-relaxed">
            Apa pendapat mereka setelah mempercayakan proyeknya kepada saya.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary-dark self-start sm:self-center flex items-center gap-2 text-xs py-2.5 px-4 font-mono uppercase tracking-wider transition-all duration-300"
        >
          <FiMessageSquare className="text-sm" /> Berikan Testimoni
        </button>
      </div>

      {/* Testimonial Render States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex flex-col justify-between p-8 bg-cream rounded-xl border border-cream-border h-48 animate-pulse"
            >
              <div className="space-y-3">
                <div className="h-4 bg-charcoal/5 rounded w-3/4"></div>
                <div className="h-4 bg-charcoal/5 rounded w-5/6"></div>
                <div className="h-4 bg-charcoal/5 rounded w-1/2"></div>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-cream-border/60">
                <div className="w-10 h-10 rounded-full bg-charcoal/5"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-charcoal/5 rounded w-1/3"></div>
                  <div className="h-3 bg-charcoal/5 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 border border-red-100">
            <FiAlertCircle className="text-xl" />
          </div>
          <p className="text-charcoal font-medium mb-2">{error}</p>
          <button
            onClick={fetchTestimonials}
            className="text-xs text-charcoal underline hover:text-charcoal-muted"
          >
            Coba lagi
          </button>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-2xl mb-4 border border-cream-border">
            💬
          </div>
          <h4 className="text-base font-bold text-charcoal mb-1">Belum ada testimoni</h4>
          <p className="text-charcoal-muted text-xs max-w-sm mb-6 leading-relaxed">
            Jadilah yang pertama untuk memberikan umpan balik tentang kerja sama kita!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-ghost text-xs py-2 px-4 inline-flex items-center gap-2 hover:bg-cream"
          >
            Tulis Testimoni Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col justify-between p-8 bg-cream rounded-xl border border-cream-border relative hover:border-charcoal-border hover:shadow-sm transition-all duration-300 group"
            >
              <span className="text-6xl text-charcoal/5 font-serif absolute top-2 left-4 select-none pointer-events-none transition-colors group-hover:text-charcoal/10">“</span>
              
              {/* Rating stars */}
              <div className="flex gap-0.5 mb-4 relative z-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < t.rating ? "text-amber-500 fill-amber-500" : "text-charcoal/10"
                    }`}
                  />
                ))}
              </div>

              <p className="text-charcoal-muted text-sm italic relative z-10 mb-8 leading-relaxed">
                &ldquo;{t.message}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-cream-border/60">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-cream-border bg-white"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-charcoal/5 border border-cream-border flex items-center justify-center font-bold text-charcoal-muted text-sm font-mono">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-charcoal truncate">{t.name}</h4>
                  <p className="text-[11px] font-mono text-charcoal-muted truncate">
                    {t.position}
                    {t.company ? ` at ${t.company}` : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Give Testimonial Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-cream-light border border-cream-border rounded-xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                disabled={submitting}
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-charcoal-muted hover:text-charcoal p-1.5 rounded-lg hover:bg-cream-border/30 transition-colors"
              >
                <FiX className="text-lg" />
              </button>

              <h3 className="text-xl font-bold text-charcoal mb-2">Tulis Testimoni</h3>
              <p className="text-charcoal-muted text-xs mb-6 leading-relaxed">
                Bagikan pengalaman kerja Anda atau kesan yang Anda dapatkan saat bekerja sama dengan saya.
              </p>

              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs flex gap-2.5 items-start"
                >
                  <FiCheck className="text-emerald-500 text-base flex-shrink-0 mt-0.5" />
                  <p>{submitSuccess}</p>
                </motion.div>
              )}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-800 text-xs flex gap-2.5 items-start"
                >
                  <FiAlertCircle className="text-red-500 text-base flex-shrink-0 mt-0.5" />
                  <p>{submitError}</p>
                </motion.div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Row: Name and Position */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted font-mono mb-1.5">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={submitting}
                      placeholder="Contoh: Irfan Syahputra"
                      className="w-full px-3 py-2 bg-cream border border-cream-border rounded-lg text-charcoal text-xs focus:outline-none focus:border-charcoal-border focus:ring-1 focus:ring-charcoal/10 transition-all font-sans"
                    />
                    {formErrors.name && (
                      <span className="text-[10px] text-red-500 mt-1 block">{formErrors.name}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted font-mono mb-1.5">
                      Jabatan / Posisi *
                    </label>
                    <input
                      type="text"
                      name="position"
                      required
                      value={formData.position}
                      onChange={handleInputChange}
                      disabled={submitting}
                      placeholder="Contoh: Senior PM"
                      className="w-full px-3 py-2 bg-cream border border-cream-border rounded-lg text-charcoal text-xs focus:outline-none focus:border-charcoal-border focus:ring-1 focus:ring-charcoal/10 transition-all font-sans"
                    />
                    {formErrors.position && (
                      <span className="text-[10px] text-red-500 mt-1 block">{formErrors.position}</span>
                    )}
                  </div>
                </div>

                {/* Row: Company and Avatar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted font-mono mb-1.5">
                      Perusahaan (Opsional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={submitting}
                      placeholder="Contoh: Google Indonesia"
                      className="w-full px-3 py-2 bg-cream border border-cream-border rounded-lg text-charcoal text-xs focus:outline-none focus:border-charcoal-border focus:ring-1 focus:ring-charcoal/10 transition-all font-sans"
                    />
                    {formErrors.company && (
                      <span className="text-[10px] text-red-500 mt-1 block">{formErrors.company}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted font-mono mb-1.5">
                      Foto Profil (Opsional)
                    </label>
                    <div className="flex items-center gap-3">
                      {formData.avatar ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cream-border flex-shrink-0 bg-white">
                          <img
                            src={formData.avatar}
                            alt="Avatar Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, avatar: "" }))}
                            className="absolute inset-0 bg-charcoal/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                            title="Hapus foto"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full border border-dashed border-charcoal/20 bg-charcoal/5 flex items-center justify-center text-charcoal/40 text-[10px] font-mono flex-shrink-0">
                          NO IMG
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={submitting}
                        onChange={handleFileChange}
                        className="text-[10px] text-charcoal-muted file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-mono file:bg-charcoal file:text-cream hover:file:opacity-90 transition-all cursor-pointer"
                      />
                    </div>
                    {formErrors.avatar && (
                      <span className="text-[10px] text-red-500 mt-1 block">{formErrors.avatar}</span>
                    )}
                  </div>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted font-mono mb-1.5">
                    Rating Bintang *
                  </label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const ratingVal = i + 1;
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={submitting}
                          onClick={() => handleRatingSelect(ratingVal)}
                          className="text-lg p-0.5 transition-transform duration-100 hover:scale-125 focus:outline-none"
                        >
                          <FiStar
                            className={`w-6 h-6 ${
                              ratingVal <= formData.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-charcoal/20"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  {formErrors.rating && (
                    <span className="text-[10px] text-red-500 mt-1 block">{formErrors.rating}</span>
                  )}
                </div>

                {/* Message TextArea */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted font-mono mb-1.5">
                    Pesan Testimoni *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={submitting}
                    placeholder="Ceritakan kesan atau pengalaman Anda saat bekerja sama..."
                    className="w-full px-3 py-2 bg-cream border border-cream-border rounded-lg text-charcoal text-xs focus:outline-none focus:border-charcoal-border focus:ring-1 focus:ring-charcoal/10 transition-all resize-none font-sans"
                  ></textarea>
                  <div className="flex justify-between items-center mt-1 text-[10px] text-charcoal-muted">
                    <span>Minimal 10, Maksimal 500 karakter</span>
                    <span>{formData.message.length}/500</span>
                  </div>
                  {formErrors.message && (
                    <span className="text-[10px] text-red-500 block">{formErrors.message}</span>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex gap-3 justify-end border-t border-cream-border mt-6">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setIsModalOpen(false)}
                    className="btn-ghost text-xs py-2 px-4 border-none hover:bg-cream"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary-dark text-xs py-2 px-5 min-w-[120px] flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="animate-spin text-sm" /> Mengirim...
                      </>
                    ) : (
                      "Kirim Ulasan"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
