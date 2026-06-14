"use client";

import React from "react";

export default function FixedBackground() {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none bg-cream"
      style={{ 
        backgroundImage: `
          linear-gradient(to right, rgba(28, 28, 28, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(28, 28, 28, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }}
    />
  );
}
