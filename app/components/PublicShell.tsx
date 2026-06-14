"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FixedBackground from "@/app/components/FixedBackground";
import { DataProvider } from "@/app/components/DataContext";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Admin routes get bare children (admin has its own layout)
  if (isAdmin) {
    return <>{children}</>;
  }

  // Public routes get Navbar + Footer + background + dynamic DataProvider
  return (
    <DataProvider>
      <FixedBackground />
      <Navbar />
      <main className="flex min-h-screen flex-col relative z-10 md:pl-20 pt-16 md:pt-0 bg-cream text-charcoal">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </DataProvider>
  );
}
