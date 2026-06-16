"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdmin } from "../AdminContext";
import { PageHeader, Card, Button, SaveToast, EmptyState } from "../components/AdminUI";
import { FiCheck, FiX, FiTrash2, FiStar, FiChevronLeft, FiChevronRight, FiAlertCircle } from "react-icons/fi";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string | null;
  avatar: string | null;
  message: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function AdminTestimonials() {
  const { token } = useAdmin();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination States
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(9); // 9 items per page
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Toast State
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Fetch Testimonials from Backend Express via rewritten API
  const fetchTestimonials = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        status: statusFilter,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`/api/admin/testimonials?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data testimoni (Koneksi ditolak / server mati)");
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server Express.js di port 5000 belum berjalan.");
      }

      const json = await res.json();
      if (json.success) {
        setItems(json.data);
        setTotalPages(json.pagination.totalPages);
        setTotalItems(json.pagination.total);
      } else {
        throw new Error(json.error || "Gagal mengambil data testimoni");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, page, limit]);

  useEffect(() => {
    if (token) {
      fetchTestimonials();
    }
  }, [token, fetchTestimonials]);

  // Handle status update (Approve/Reject)
  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal memperbarui status testimoni");
      }

      triggerToast(`Testimoni berhasil di-${newStatus === "approved" ? "setujui" : "tolak"}`);
      fetchTestimonials();
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui status.");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!token || !confirm("Apakah Anda yakin ingin menghapus testimoni ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal menghapus testimoni");
      }

      triggerToast("Testimoni berhasil dihapus");
      // Adjust page if current page becomes empty
      if (items.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchTestimonials();
      }
    } catch (err: any) {
      alert(err.message || "Gagal menghapus testimoni.");
    }
  };

  // Reset pagination on filter change
  const handleFilterChange = (filter: "all" | "pending" | "approved" | "rejected") => {
    setStatusFilter(filter);
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title="Ulasan & Testimoni"
        description="Kelola umpan balik, rating, dan testimoni dari klien atau pengunjung website secara dinamis."
      />

      {/* Filter Tabs */}
      <div className="flex border-b border-white/[0.08] mb-6 gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider border-b-2 font-medium transition-all ${
              statusFilter === filter
                ? "border-[#d10000] text-white"
                : "border-transparent text-white/40 hover:text-white/60"
            }`}
          >
            {filter} {filter === "all" ? "" : `(${filter})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse h-48">
              <div className="h-4 bg-white/5 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-white/5 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-white/5 rounded w-5/6 mb-6"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-white/5 rounded w-16"></div>
                <div className="h-8 bg-white/5 rounded w-16"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-white">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-4 border border-red-500/20">
            <FiAlertCircle className="text-xl" />
          </div>
          <p className="text-sm font-medium mb-2">{error}</p>
          <Button size="sm" onClick={fetchTestimonials}>Coba Lagi</Button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon="💬"
          title="Tidak ada testimoni"
          description={`Belum ada testimoni dengan status ${statusFilter} saat ini.`}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((t) => (
              <Card key={t.id} className="flex flex-col justify-between h-full border border-white/[0.05] hover:border-white/[0.1] transition-all relative">
                <div>
                  {/* Row: Header and rating */}
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        t.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10"
                          : t.status === "rejected"
                          ? "bg-red-500/15 text-red-400 border border-red-500/10"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/10"
                      }`}
                    >
                      {t.status}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-3 h-3 ${
                            i < t.rating ? "text-amber-500 fill-amber-500" : "text-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial message */}
                  <p className="text-white/80 text-xs italic mb-5 leading-relaxed">
                    &ldquo;{t.message}&rdquo;
                  </p>
                </div>

                {/* Profile row */}
                <div>
                  <div className="flex items-center gap-2.5 mb-5 pt-3 border-t border-white/[0.04]">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/15 border border-white/10 flex items-center justify-center font-bold text-white/50 text-[11px] font-mono">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{t.name}</p>
                      <p className="text-[10px] text-white/40 truncate">
                        {t.position}
                        {t.company ? ` at ${t.company}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 justify-between">
                    <div className="flex gap-1.5">
                      {t.status !== "approved" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/10 !px-2.5 !py-1"
                          onClick={() => handleUpdateStatus(t.id, "approved")}
                        >
                          <FiCheck className="text-xs" /> Setujui
                        </Button>
                      )}
                      {t.status !== "rejected" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/10 !px-2.5 !py-1"
                          onClick={() => handleUpdateStatus(t.id, "rejected")}
                        >
                          <FiX className="text-xs" /> Tolak
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      className="!px-2.5 !py-1"
                      onClick={() => handleDelete(t.id)}
                    >
                      <FiTrash2 className="text-xs" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Deck */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 border-t border-white/[0.05] pt-4">
              <span className="text-[10px] font-mono text-white/40">
                Menampilkan {items.length} dari {totalItems} testimoni
              </span>
              <div className="flex items-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-lg border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                <span className="text-xs font-mono text-white">
                  Halaman {page} dari {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <SaveToast show={showToast} message={toastMessage} />
    </div>
  );
}
