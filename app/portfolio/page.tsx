"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/app/components/DataContext";
import type { ProjectItem as Project } from "@/app/data/siteDataManager";
import SplitText from "@/app/components/SplitText";

export default function PortfolioPage() {
  const { data } = useData();
  const { projects } = data;
  const [activeCategory, setActiveCategory] = useState("all");
  const categories = [
    "all",
    "web",
    "web app",
    "API",
    "integrasi sistem",
    "blockchain",
    "web3",
  ];

  const monthOrder: { [key: string]: number } = {
    "januari": 1, "februari": 2, "maret": 3, "april": 4, "mei": 5, "juni": 6,
    "juli": 7, "agustus": 8, "september": 9, "oktober": 10, "november": 11, "desember": 12,
    "january": 1, "february": 2, "march": 3, "may": 5, "july": 7, "august": 8, "december": 12
  };

  const getProjectDateValue = (p: Project) => {
    const year = parseInt(p.yearCreated || "0", 10);
    const month = monthOrder[(p.monthCreated || "").toLowerCase().trim()] || 0;
    return year * 100 + month;
  };

  const sortedProjects = [...(projects || [])].sort((a, b) => getProjectDateValue(b) - getProjectDateValue(a));

  const filteredProjects: Project[] =
    activeCategory === "all"
      ? sortedProjects
      : sortedProjects.filter((project: Project) =>
          project.category.includes(activeCategory)
        );

  return (
    <div className="w-full min-h-screen py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-4 sm:gap-5">
      
      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Header Box (Full width) */}
        <div className="lg:col-span-3 card-minimal p-8 sm:p-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted block mb-3">
              Portofolio & Karya
            </span>
            <SplitText
              text="Proyek Terbaik Saya"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-1.5px] text-charcoal leading-none mb-6"
              delay={35}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              textAlign="left"
            />
            <p className="text-charcoal-muted text-sm sm:text-base max-w-2xl leading-relaxed">
              Jelajahi berbagai proyek pengembangan web, aplikasi, dan integrasi sistem yang telah saya selesaikan dengan cermat.
            </p>
          </div>
        </div>

        {/* Filters Box (Full width) */}
        <div className="lg:col-span-3 card-minimal p-6 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                className={`text-xs font-medium px-4 py-2 rounded-full border transition-all duration-200 ${
                  isActive
                    ? "bg-charcoal text-cream-light border-charcoal shadow-[rgba(0,0,0,0.15)_0px_1.5px_2px_0px_inset]"
                    : "bg-cream-light text-charcoal-muted border-cream-border hover:border-charcoal-border hover:text-charcoal shadow-sm"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category === "all" ? "Semua" : category.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Projects Grid Container (Full width) */}
        <div className="lg:col-span-3">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group flex flex-col bg-cream-light rounded-xl border border-cream-border overflow-hidden transition-all duration-300 hover:border-charcoal-border hover:shadow-sm h-full justify-between"
                >
                  <div>
                    {/* Project Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-cream border-b border-cream-border">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {project.category.slice(0, 2).map((cat) => (
                          <span
                            key={cat}
                            className="text-[9px] font-bold uppercase tracking-wider bg-cream-light/95 border border-cream-border text-charcoal px-2 py-0.5 rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-base font-bold text-charcoal group-hover:text-charcoal transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        {(project.monthCreated || project.yearCreated) && (
                          <span className="text-[10px] font-mono text-charcoal-muted flex-shrink-0 bg-cream border border-cream-border px-2 py-0.5 rounded">
                            {project.monthCreated || ""} {project.yearCreated || ""}
                          </span>
                        )}
                      </div>
                      <p className="text-charcoal-muted text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  {/* Footer metadata */}
                  <div className="p-6 pt-0 mt-auto">
                    <div className="pt-4 border-t border-cream-border flex items-center justify-between font-sans">
                      <span className="text-[10px] font-mono text-charcoal-muted line-clamp-1 pr-2">
                        {project.technologies.slice(0, 3).join(" • ")}
                      </span>
                      <Link
                        href={`/portfolio/${project.id}`}
                        className="text-xs font-semibold text-charcoal hover:underline inline-flex items-center gap-1 flex-shrink-0"
                      >
                        Detail <FiArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
