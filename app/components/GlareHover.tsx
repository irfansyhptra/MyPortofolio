"use client";

import React, { useRef, useState } from "react";

interface GlareHoverProps {
  children: React.ReactNode;
  width?: string;
  height?: string;
  borderRadius?: string;
  glareColor?: string;
  glareOpacity?: number;
  className?: string;
}

const GlareHover: React.FC<GlareHoverProps> = ({
  children,
  width = "100%",
  height = "100%",
  borderRadius = "0.75rem",
  glareColor = "#d10000",
  glareOpacity = 0.2,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glarePosition, setGlarePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setGlarePosition({ x, y });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height, borderRadius }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          left: glarePosition.x,
          top: glarePosition.y,
          width: "300px",
          height: "300px",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${glareColor} 0%, rgba(255, 255, 255, 0) 70%)`,
          opacity: isHovering ? glareOpacity : 0,
          filter: "blur(40px)",
        }}
      />
    </div>
  );
};

export default GlareHover;
