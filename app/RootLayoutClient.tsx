"use client";

import { useEffect } from "react";

interface RootLayoutClientProps {
  children: React.ReactNode;
  geistSans: { variable: string };
  geistMono: { variable: string };
}

export default function RootLayoutClient({
  children,
  geistSans,
  geistMono,
}: RootLayoutClientProps) {
  useEffect(() => {
    // Remove any unwanted attributes that might be added by browser extensions
    const html = document.documentElement;
    const attributesToRemove = ["bbai-tooltip-injected"];
    attributesToRemove.forEach((attr) => {
      if (html.hasAttribute(attr)) {
        html.removeAttribute(attr);
      }
    });
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
