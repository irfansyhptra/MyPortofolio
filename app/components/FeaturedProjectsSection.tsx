"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { projects, type Project } from "@/app/data/mockData";
import ScrollAnimation from "@/app/components/ScrollAnimation";

/* ─────────────────────────────────────────
   Bento Container – individual grid cell
   ───────────────────────────────────────── */
interface BentoContainerProps {
  project: Project;
  index: number;
  variant: "large" | "medium" | "wide";
}

const BentoContainer: React.FC<BentoContainerProps> = ({
  project,
  index,
  variant,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Description lengths based on variant
  const descLength = variant === "large" ? 180 : variant === "wide" ? 150 : 100;

  return (
    <motion.div
      ref={containerRef}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-sm cursor-pointer h-full"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight glow that follows cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(209,0,0,0.12), transparent 40%)`,
        }}
      />

      {/* Animated border glow on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(209,0,0,0.25), transparent 40%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes={
            variant === "large"
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        {/* Extra darken on hover for readability */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 lg:p-8">
        {/* Top: Categories & Tech */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {project.category.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-white/80 backdrop-blur-sm border border-white/[0.06] transition-colors duration-300 group-hover:bg-primary/20 group-hover:text-white group-hover:border-primary/30"
              >
                {cat}
              </span>
            ))}
          </div>
          {/* Arrow icon */}
          <motion.div
            className="flex-shrink-0 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 text-white/60 backdrop-blur-sm border border-white/[0.08] transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary/50"
            whileHover={{ rotate: -45 }}
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </motion.div>
        </div>

        {/* Bottom: Title, Description, Tech Stack */}
        <div className="mt-auto">
          {/* Tech stack pills */}
          <div className="mb-3 flex flex-wrap gap-1.5 opacity-0 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            {project.technologies.slice(0, variant === "large" ? 4 : 3).map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] sm:text-xs font-mono text-primary/90 border border-primary/20"
              >
                {tech}
              </span>
            ))}
          </div>

          <h3
            className={`font-bold text-white mb-2 leading-tight transition-colors duration-300 group-hover:text-white ${
              variant === "large"
                ? "text-xl sm:text-2xl lg:text-3xl"
                : variant === "wide"
                ? "text-lg sm:text-xl lg:text-2xl"
                : "text-base sm:text-lg lg:text-xl"
            }`}
          >
            {project.title}
          </h3>
          <p
            className={`text-white/50 leading-relaxed transition-colors duration-300 group-hover:text-white/70 ${
              variant === "large" ? "text-sm sm:text-base" : "text-xs sm:text-sm"
            }`}
          >
            {project.description.substring(0, descLength)}...
          </p>

          {/* "Lihat Detail" link – slides up on hover */}
          <Link
            href={`/portfolio/${project.id}`}
            className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 hover:gap-3"
          >
            Lihat Detail
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Subtle noise texture overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   Main Section
   ───────────────────────────────────────── */
const FeaturedProjectsSection = () => {
  const featuredProjects = projects.slice(0, 3);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <ScrollAnimation>
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <motion.span
              className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium inline-block mb-4 border border-primary/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              Portofolio
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Proyek <span className="gradient-text">Unggulan</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
              Beberapa proyek terbaik yang telah saya kerjakan untuk klien dari
              berbagai industri.
            </p>
          </div>
        </ScrollAnimation>

        {/* ── Bento Grid ── */}
        {/* Desktop: asymmetric 2-column layout
            Row 1: Large (spans 7 cols) + Medium (spans 5 cols)
            Row 2: Wide (spans full 12 cols)
            Mobile: stacked single column */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 lg:gap-5 auto-rows-[minmax(280px,1fr)] md:auto-rows-[minmax(320px,1fr)] lg:auto-rows-[minmax(380px,1fr)]">
          {/* Cell 1: Large – spans 7 columns */}
          {featuredProjects[0] && (
            <div className="md:col-span-7 min-h-[320px] sm:min-h-[360px] lg:min-h-[420px]">
              <BentoContainer
                project={featuredProjects[0]}
                index={0}
                variant="large"
              />
            </div>
          )}

          {/* Cell 2: Medium – spans 5 columns */}
          {featuredProjects[1] && (
            <div className="md:col-span-5 min-h-[280px] sm:min-h-[320px] lg:min-h-[420px]">
              <BentoContainer
                project={featuredProjects[1]}
                index={1}
                variant="medium"
              />
            </div>
          )}

          {/* Cell 3: Wide – spans full width */}
          {featuredProjects[2] && (
            <div className="md:col-span-12 min-h-[280px] sm:min-h-[300px] lg:min-h-[340px]">
              <BentoContainer
                project={featuredProjects[2]}
                index={2}
                variant="wide"
              />
            </div>
          )}
        </div>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-12 sm:mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/portfolio"
            className="group relative inline-flex items-center gap-2 px-8 py-3 sm:px-10 sm:py-4 bg-gradient-primary text-white font-medium rounded-xl hover:shadow-[0_0_30px_rgba(209,0,0,0.3)] transition-all duration-300 text-sm sm:text-base overflow-hidden"
          >
            <span className="relative z-10">Lihat Semua Proyek</span>
            <svg
              className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
