"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUser,
  FiBriefcase,
  FiLayers,
  FiBookOpen,
  FiMail,
  FiMenu,
  FiX,
  FiArrowRight,
} from "react-icons/fi";

/* ═══════════════════════════════════════════════════════
   Liquid-border sidebar.
   
   The sidebar's right edge is a straight line. When a
   menu item is hovered, the line bends outward at that
   position in a smooth S-curve, forming an organic
   bubble that holds the label text — then reconnects
   to the straight line above and below.
   ═══════════════════════════════════════════════════════ */

const navLinks = [
  { href: "/", label: "Beranda", icon: FiHome },
  { href: "/about", label: "Tentang", icon: FiUser },
  { href: "/portfolio", label: "Portofolio", icon: FiBriefcase },
  { href: "/services", label: "Layanan", icon: FiLayers },
  { href: "/blog", label: "Blog", icon: FiBookOpen },
  { href: "/contact", label: "Kontak", icon: FiMail },
];

/* ── Geometry ─────────────────────────────── */
const SIDEBAR_W = 72;
const ITEM_H = 48;
const CS = 16;                     // S-curve transition height
const BUBBLE_W = 136;              // how far bubble extends right
const R = 14;                      // bubble corner radius
const TOTAL_H = ITEM_H + CS * 2;  // 80 — SVG canvas height
const B_TOP = CS;                  // 16 — bubble top edge y
const B_BOT = CS + ITEM_H;        // 64 — bubble bottom edge y

/* Cubic-bézier quarter-circle approximation (k ≈ 0.55) */
const CK = +(CS * 0.55).toFixed(1);   // 8.8
const CK2 = +(CS - CK).toFixed(1);    // 7.2

/* Pre-computed SVG paths ──────────────────── */
const TOP_S = `C 0,${CK} ${CK2},${B_TOP} ${CS},${B_TOP}`;
const BOT_S = `C ${CK2},${B_BOT} 0,${B_BOT + CK2} 0,${TOTAL_H}`;
const TR = BUBBLE_W - R;   // 122
const TRY = B_TOP + R;     // 30
const BRY = B_BOT - R;     // 50

// Fill (closed) — covers the bubble + covers the sidebar border at this position
const FILL = [
  `M -1,-2 L -1,0 L 0,0`,        // slight left extension to fully cover the border
  TOP_S,
  `L ${TR},${B_TOP}`,
  `Q ${BUBBLE_W},${B_TOP} ${BUBBLE_W},${TRY}`,
  `L ${BUBBLE_W},${BRY}`,
  `Q ${BUBBLE_W},${B_BOT} ${TR},${B_BOT}`,
  `L ${CS},${B_BOT}`,
  BOT_S,
  `L -1,${TOTAL_H} L -1,${TOTAL_H + 2}`,
  `L -2,${TOTAL_H + 2} L -2,-2 Z`,
].join(" ");

// Stroke (open) — the visible curved border outline
const STROKE = [
  `M 0,-1 L 0,0`,                 // tiny overlap with the CSS border above
  TOP_S,
  `L ${TR},${B_TOP}`,
  `Q ${BUBBLE_W},${B_TOP} ${BUBBLE_W},${TRY}`,
  `L ${BUBBLE_W},${BRY}`,
  `Q ${BUBBLE_W},${B_BOT} ${TR},${B_BOT}`,
  `L ${CS},${B_BOT}`,
  BOT_S,
  `L 0,${TOTAL_H + 1}`,           // tiny overlap with the CSS border below
].join(" ");

/* ── NavItem ──────────────────────────────── */
function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center"
      style={{ width: SIDEBAR_W, height: ITEM_H }}
    >
      {/* Active background pill (inside the sidebar) */}
      {isActive && (
        <motion.div
          layoutId="activeNavPill"
          className="absolute inset-y-0.5 left-2.5 right-1 rounded-xl bg-charcoal"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{
            boxShadow:
              "rgba(255,255,255,0.12) 0 0.5px 0 0 inset, rgba(0,0,0,0.25) 0 2px 6px 0",
          }}
        />
      )}

      {/* Icon */}
      <motion.div
        className={`relative z-10 ${
          isActive
            ? "text-cream-light"
            : "text-charcoal-muted group-hover:text-charcoal"
        }`}
        animate={{ scale: hovered ? 1.12 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
      >
        <Icon size={20} />
      </motion.div>

      {/* ── Liquid bubble (extends from the sidebar border) ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: SIDEBAR_W - 1,          // align with the border pixel
              top: -CS,                      // extend above for S-curve
              width: BUBBLE_W + 4,
              height: TOTAL_H + 4,
              zIndex: 40,
              transformOrigin: "left center",
            }}
            initial={{ opacity: 0, scaleX: 0.15 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.1 }}
            transition={{
              type: "spring",
              stiffness: 480,
              damping: 30,
              mass: 0.5,
            }}
          >
            {/* SVG — liquid shape */}
            <svg
              viewBox={`-3 -3 ${BUBBLE_W + 6} ${TOTAL_H + 6}`}
              className="absolute inset-0 w-full h-full"
              overflow="visible"
            >
              {/* Filled background */}
              <path
                d={FILL}
                fill={isActive ? "#1c1c1c" : "#fcfbf8"}
              />
              {/* Curved border stroke */}
              <path
                d={STROKE}
                fill="none"
                stroke={isActive ? "rgba(255,255,255,0.08)" : "#eceae4"}
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>

            {/* Label text */}
            <motion.span
              className={`absolute whitespace-nowrap text-[13px] font-semibold tracking-wide ${
                isActive ? "text-cream-light" : "text-charcoal"
              }`}
              style={{
                left: CS + 10,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              initial={{ opacity: 0, x: -14, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 26,
                delay: 0.025,
              }}
            >
              {label}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active dot on the border line (when NOT hovered) */}
      {isActive && !hovered && (
        <motion.div
          layoutId="navActiveDot"
          className="absolute w-[3px] h-5 rounded-l-full bg-charcoal"
          style={{ right: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  );
}

/* ── Main Navbar ──────────────────────────── */
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* ═══ Desktop Sidebar ═══ */}
      <motion.aside
        initial={{ x: -SIDEBAR_W, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 26,
          delay: 0.12,
        }}
        className="hidden md:flex fixed left-0 top-0 h-screen z-50 bg-cream flex-col items-center py-6 select-none"
        style={{ width: SIDEBAR_W, overflow: "visible" }}
      >
        {/* ── Right border line (the line that "bends") ── */}
        <div
          className="absolute top-0 bottom-0 w-px bg-cream-border"
          style={{ right: 0 }}
        />

        {/* Logo */}
        <Link href="/" className="relative z-10 mb-8">
          <motion.div
            className="w-10 h-10 rounded-xl bg-charcoal text-cream flex items-center justify-center font-bold text-lg"
            whileHover={{ scale: 1.12, borderRadius: "14px" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            style={{
              boxShadow:
                "rgba(255,255,255,0.2) 0 0.5px 0 0 inset, rgba(0,0,0,0.25) 0 2px 8px 0",
            }}
          >
            I
          </motion.div>
        </Link>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col justify-center gap-1 relative z-10">
          {navLinks.map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              isActive={pathname === link.href}
            />
          ))}
        </nav>

        {/* Bottom arrow CTA */}
        <div className="relative z-10 mt-4">
          <Link href="/contact">
            <motion.div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                pathname === "/contact"
                  ? "bg-charcoal text-cream-light"
                  : "border border-cream-border text-charcoal-muted hover:text-charcoal hover:border-charcoal/30"
              }`}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{
                boxShadow:
                  pathname === "/contact"
                    ? "rgba(255,255,255,0.15) 0 0.5px 0 0 inset, rgba(0,0,0,0.2) 0 2px 4px 0"
                    : "none",
              }}
            >
              <FiArrowRight size={18} />
            </motion.div>
          </Link>
        </div>
      </motion.aside>

      {/* ═══ Mobile Header ═══ */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-cream/95 backdrop-blur-md border-b border-cream-border z-50 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-charcoal text-cream flex items-center justify-center font-bold text-lg shadow-[rgba(255,255,255,0.2)_0_0.5px_0_0_inset]">
            I
          </div>
          <span className="ml-2.5 font-bold text-base tracking-tight text-charcoal">
            Irfan<span className="text-charcoal-muted">Syahputra</span>
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-charcoal p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* ═══ Mobile Drawer ═══ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 top-16 bg-cream z-40 px-6 py-8 flex flex-col justify-between"
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link, i) => {
                const LIcon = link.icon;
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: i * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div
                        className={`flex items-center h-14 px-4 rounded-2xl ${
                          active
                            ? "bg-charcoal text-cream-light shadow-[rgba(255,255,255,0.15)_0_0.5px_0_0_inset,rgba(0,0,0,0.2)_0_2px_4px_0]"
                            : "text-charcoal-muted hover:text-charcoal hover:bg-charcoal/5 border border-cream-border"
                        }`}
                      >
                        <LIcon size={20} className="mr-4" />
                        <span className="font-semibold text-lg">
                          {link.label}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="space-y-4">
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="btn-primary-dark w-full h-12 flex justify-center items-center font-semibold text-base rounded-2xl">
                  Hire Me
                </div>
              </Link>
              <div className="text-center text-xs text-charcoal-muted">
                © 2026 Irfan Syahputra. All rights reserved.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
