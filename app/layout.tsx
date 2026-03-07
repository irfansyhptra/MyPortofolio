import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import PublicShell from "@/app/components/PublicShell";

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
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
