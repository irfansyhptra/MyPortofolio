"use client";

import React from "react";

/* ─── Page header ──────────────────────────────────── */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-sm text-white/40 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/* ─── Card wrapper ─────────────────────────────────── */
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#111] border border-white/[0.08] rounded-2xl p-4 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Input ────────────────────────────────────────── */
export function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#d10000]/50 transition-colors"
      />
    </div>
  );
}

/* ─── Textarea ─────────────────────────────────────── */
export function TextArea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-1.5">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#d10000]/50 transition-colors resize-none"
      />
    </div>
  );
}

/* ─── Button ───────────────────────────────────────── */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm" };
  const variants = {
    primary: "bg-gradient-to-r from-[#d10000] to-[#ff4500] text-white hover:opacity-90",
    secondary: "bg-white/[0.08] text-white hover:bg-white/[0.12] border border-white/[0.1]",
    danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20",
    ghost: "text-white/60 hover:text-white hover:bg-white/[0.05]",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ─── Save status toast ────────────────────────────── */
export function SaveToast({
  show,
  message = "Saved!",
}: {
  show: boolean;
  message?: string;
}) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-green-500/90 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg animate-bounce">
      ✓ {message}
    </div>
  );
}

/* ─── Empty state ──────────────────────────────────── */
export function EmptyState({
  icon = "📭",
  title = "No data yet",
  description = "Click the button above to add your first item.",
}: {
  icon?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-white/70 font-medium mb-1">{title}</h3>
      <p className="text-white/40 text-sm max-w-xs">{description}</p>
    </div>
  );
}
