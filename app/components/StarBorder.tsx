import React from "react";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties["animationDuration"];
    thickness?: number;
  };

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "Magenta",
  speed = "4s",
  thickness = 0,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "button";

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-xl font-medium select-none backdrop-blur-xl border border-white/20 bg-white/10 transition-all duration-300 ease-out will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[${color}] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97] hover:scale-[1.015] flex items-center justify-center gap-2 text-white/90 hover:text-white px-20 py-20 text-sm min-w-[120px] ${className}`}
      style={{
        boxShadow: `0 0 0 1px rgba(255,255,255,0.08) inset, 0 0 0 0 rgba(99,102,241,0)`,
        padding: `${thickness}px 0`,
        ...(rest as any).style,
      }}
      {...(rest as any)}
    >
      {/* Border Star Effect */}
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      {/* Glassmorphism Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 mix-blend-overlay" />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${color}22, transparent 60%)`,
        }}
      />
      {/* Shimmer effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{
            transform: "translateX(-100%)",
            animation: "shimmer 2s infinite linear",
          }}
        />
      </div>
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 px-8 py-2 text-sm whitespace-nowrap w-full justify-center">
        {children}
      </span>
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes star-movement-bottom {
          0% {
            right: -250%;
            opacity: 0.7;
          }
          60% {
            right: 0%;
            opacity: 1;
          }
          100% {
            right: 0%;
            opacity: 0;
          }
        }
        @keyframes star-movement-top {
          0% {
            left: -250%;
            opacity: 0.7;
          }
          60% {
            left: 0%;
            opacity: 1;
          }
          100% {
            left: 0%;
            opacity: 0;
          }
        }
      `}</style>
    </Component>
  );
};

export default StarBorder;
