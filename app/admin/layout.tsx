"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminProvider, useAdmin } from "./AdminContext";
import AdminLogin from "./AdminLogin";

/* ─── Sidebar nav items ──────────────────────────── */
const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/profile", label: "Profile", icon: "👤" },
  { href: "/admin/hero", label: "Hero", icon: "🏠" },
  { href: "/admin/projects", label: "Projects", icon: "🚀" },
  { href: "/admin/services", label: "Services", icon: "💼" },
  { href: "/admin/blog", label: "Blog", icon: "📝" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "💬" },
  { href: "/admin/skills", label: "Skills", icon: "⚡" },
  { href: "/admin/education", label: "Education", icon: "🎓" },
  { href: "/admin/experience", label: "Experience", icon: "📋" },
  { href: "/admin/organization", label: "Organization", icon: "🏛️" },
  { href: "/admin/stats", label: "Stats", icon: "📈" },
  { href: "/admin/contact", label: "Contact", icon: "📞" },
];

/* ─── Inner layout (requires auth) ───────────────── */
function AdminShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, logout, loading, isOffline } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (!isLoggedIn) return <AdminLogin />;

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <Link href="/admin" className="text-lg font-bold gradient-text">
            Admin Panel
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/50 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#d10000]/20 text-[#d10000] border border-[#d10000]/30"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/[0.08] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            🌐 View Site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 sm:h-16 border-b border-white/[0.08] bg-[#0a0a0a] flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/70 hover:text-white p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden lg:block text-sm text-white/40">
            {navItems.find((n) => n.href === pathname)?.label || "Admin"}
          </div>

          <div className="flex items-center gap-3">
            {loading && (
              <span className="text-xs text-white/30 animate-pulse">
                Saving...
              </span>
            )}
            <div className="w-8 h-8 rounded-full bg-[#d10000]/20 flex items-center justify-center text-xs font-bold text-[#d10000]">
              IS
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {isOffline && (
            <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <strong>Offline Mode (Read-Only)</strong>: Aplikasi tidak terhubung ke database MongoDB. Perubahan tidak dapat disimpan. Silakan tambahkan variabel lingkungan <code>MONGODB_URI</code> di dashboard Vercel Anda.
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

/* ─── Exported layout ────────────────────────────── */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
