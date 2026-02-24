"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { projects, Project } from "@/app/data/mockData";
import ScrollAnimation from "@/app/components/ScrollAnimation";
import StarBorder from "@/app/components/StarBorder";

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
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Proyek <span className="gradient-text">Terbaik</span> Saya
            </h1>
            <p className="text-dark-300 max-w-3xl mx-auto text-sm sm:text-base">
              Koleksi proyek yang telah saya kerjakan dengan berbagai teknologi
              dan solusi digital.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition duration-300 ${
                  activeCategory === category
                    ? "bg-gradient-primary text-white"
                    : "bg-dark-800 text-dark-300 hover:text-white"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProjects.map((project: Project, index: number) => (
              <ScrollAnimation key={project.id} delay={index * 0.1}>
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
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 hover:scale-110"
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
              </ScrollAnimation>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
