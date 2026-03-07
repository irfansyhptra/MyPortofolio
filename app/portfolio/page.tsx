"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { projects, Project } from "@/app/data/mockData";
import StarBorder from "@/app/components/StarBorder";
import GSAPReveal from "@/app/components/GSAPReveal";

const PortfolioPage = () => {
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

  const filteredProjects: Project[] =
    activeCategory === "all"
      ? projects
      : projects.filter((project: Project) =>
          project.category.includes(activeCategory)
        );

  return (
    <div className="pt-20 sm:pt-24">
      <section className="py-12 sm:py-16 px-4 bg-dark-900">
        <div className="container mx-auto">
          {/* Title — Glitch entrance */}
          <GSAPReveal preset="glitch" duration={0.8}>
            <div className="text-center mb-10 sm:mb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Proyek <span className="gradient-text">Terbaik</span> Saya
              </h1>
              <p className="text-dark-300 max-w-3xl mx-auto text-sm sm:text-base">
                Koleksi proyek yang telah saya kerjakan dengan berbagai teknologi
                dan solusi digital.
              </p>
            </div>
          </GSAPReveal>

          {/* Filter tabs — Fade up */}
          <GSAPReveal preset="fade-up" duration={0.6} delay={0.2}>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-gradient-primary text-white shadow-lg shadow-primary/20"
                      : "bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </GSAPReveal>

          {/* Projects grid — Scale-rotate staggered */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project: Project, index: number) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <StarBorder as="div" color="#d10000" speed="5s">
                    <motion.div
                      className="overflow-hidden h-full flex flex-col bg-dark-800 rounded-lg"
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative overflow-hidden h-48 sm:h-60">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 hover:scale-110"
                        />
                      </div>
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                          {project.title}
                        </h3>
                        <p className="text-dark-300 mb-3 sm:mb-4 flex-grow text-xs sm:text-sm">
                          {project.description.substring(0, 100)}...
                        </p>
                        <Link
                          href={`/portfolio/${project.id}`}
                          className="text-primary-400 hover:text-primary-300 mt-auto text-sm sm:text-base"
                        >
                          Lihat Detail →
                        </Link>
                      </div>
                    </motion.div>
                  </StarBorder>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
