"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FixedBackground from "@/app/components/FixedBackground";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Admin routes get bare children (admin has its own layout)
  if (isAdmin) {
    return <>{children}</>;
  }

  // Public routes get Navbar + Footer + background
  return (
    <>
      <FixedBackground />
      <main className="flex min-h-screen flex-col relative z-10">
        <Navbar />
        {children}
        <Footer />
      </main>
    </>
  );
}
