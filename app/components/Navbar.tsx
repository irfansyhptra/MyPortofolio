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
  FiArrowRight
} from "react-icons/fi";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/", label: "Beranda", icon: FiHome },
    { href: "/about", label: "Tentang", icon: FiUser },
    { href: "/portfolio", label: "Portofolio", icon: FiBriefcase },
    { href: "/services", label: "Layanan", icon: FiLayers },
    { href: "/blog", label: "Blog", icon: FiBookOpen },
    { href: "/contact", label: "Kontak", icon: FiMail },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        initial={{ width: 80 }}
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="hidden md:flex fixed left-0 top-0 h-screen z-50 bg-cream border-r border-cream-border text-charcoal flex-col justify-between py-6 overflow-hidden select-none"
      >
        {/* Top Logo */}
        <div className="px-6 flex items-center h-12">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-charcoal text-cream flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset]">
              I
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="ml-3 font-semibold text-lg tracking-tight font-sans whitespace-nowrap overflow-hidden"
                >
                  rfan<span className="text-charcoal-muted">Syahputra</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col justify-center px-3 space-y-2">
          {navLinks.map((link, i) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <motion.div
                  className={`relative flex items-center h-12 rounded-lg cursor-pointer transition-colors duration-150 ${
                    isActive 
                      ? "btn-primary-dark text-cream-light font-medium" 
                      : "text-charcoal-muted hover:text-charcoal hover:bg-charcoal/5"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-14 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      opacity: isExpanded ? 1 : 0, 
                      x: isExpanded ? 0 : -15,
                      display: isExpanded ? "block" : "none"
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 250, 
                      damping: 22,
                      delay: isExpanded ? i * 0.02 : 0 
                    }}
                    className="font-medium text-sm whitespace-nowrap pr-4"
                  >
                    {link.label}
                  </motion.div>

                  {/* Liquid dot indicator on hover */}
                  {isActive && !isExpanded && (
                    <motion.div 
                      layoutId="activeDot"
                      className="absolute right-0 w-1.5 h-6 bg-charcoal rounded-l-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTA / Profile status */}
        <div className="px-3">
          <Link href="/contact">
            <motion.div
              className={`relative flex items-center h-12 rounded-lg cursor-pointer overflow-hidden ${
                pathname === "/contact"
                  ? "bg-charcoal text-cream-light"
                  : "border border-charcoal-border hover:border-charcoal hover:bg-charcoal/5"
              }`}
            >
              <div className="w-14 flex items-center justify-center flex-shrink-0">
                <FiArrowRight size={20} className={isExpanded ? "rotate-0 transition-transform duration-300" : ""} />
              </div>
              <motion.div
                initial={false}
                animate={{ 
                  opacity: isExpanded ? 1 : 0, 
                  x: isExpanded ? 0 : -15,
                  display: isExpanded ? "block" : "none"
                }}
                className="font-semibold text-xs tracking-wider uppercase whitespace-nowrap"
              >
                Hire Me
              </motion.div>
            </motion.div>
          </Link>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-cream/95 backdrop-blur-md border-b border-cream-border z-50 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-charcoal text-cream flex items-center justify-center font-bold text-lg shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset]">
            I
          </div>
          <span className="ml-2.5 font-bold text-base tracking-tight font-sans text-charcoal">
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

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 top-16 bg-cream z-40 px-6 py-8 flex flex-col justify-between"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={`flex items-center h-14 px-4 rounded-xl ${
                      isActive 
                        ? "btn-primary-dark text-cream-light" 
                        : "text-charcoal-muted hover:text-charcoal hover:bg-charcoal/5 border border-cream-border"
                    }`}>
                      <Icon size={20} className="mr-4" />
                      <span className="font-semibold text-lg">{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-4">
              <Link 
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="btn-primary-dark w-full h-12 flex justify-center items-center text-center font-semibold text-base">
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
