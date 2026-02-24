import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FixedBackground from "@/app/components/FixedBackground";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Irfan Syahputra Portfolio",
  description: "Personal portfolio website of Irfan Syahputra",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {/* Fixed Background */}
        <FixedBackground />
        
        <main className="flex min-h-screen flex-col relative z-10">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
