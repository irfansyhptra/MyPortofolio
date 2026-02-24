"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { projects } from "@/app/data/mockData";
import ScrollAnimation from "@/app/components/ScrollAnimation";
import StarBorder from "@/app/components/StarBorder";

const FeaturedProjectsSection = () => {
  // Ambil 3 proyek pertama dari data untuk ditampilkan sebagai unggulan
  const featuredProjects = projects.slice(0, 3);

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-dark-950">
      <div className="container mx-auto">
        <ScrollAnimation>
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-dark-800 text-primary-400 rounded-full text-xs sm:text-sm font-medium inline-block mb-3 sm:mb-4">
              Portofolio
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Proyek <span className="gradient-text">Unggulan</span>
            </h2>
            <p className="text-dark-300 max-w-2xl mx-auto text-sm sm:text-base">
              Beberapa proyek terbaik yang telah saya kerjakan untuk klien dari
              berbagai industri.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {featuredProjects.map((project, index) => (
            <ScrollAnimation key={project.id} delay={index * 0.1}>
              <StarBorder as="div" color="#d10000" speed="5s">
                <motion.div
                  className="overflow-hidden h-full flex flex-col bg-dark-800 rounded-lg"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Bagian Gambar Proyek */}
                  <div className="relative overflow-hidden h-48 sm:h-52 lg:h-60">
                    <Image
                      src={project.image}
                      alt={project.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2">
                      {project.category.slice(0, 2).map((cat) => (
                        <span
                          key={cat}
                          className="px-2 sm:px-3 py-0.5 sm:py-1 bg-dark-800 bg-opacity-80 text-primary-400 rounded-full text-[10px] sm:text-xs font-medium"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Bagian Deskripsi Proyek */}
                  <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                      {project.title}
                    </h3>
                    <p className="text-dark-300 mb-3 sm:mb-4 flex-grow text-xs sm:text-sm">
                      {project.description.substring(0, 120)}...
                    </p>
                    <Link
                      href={`/portfolio/${project.id}`}
                      className="text-primary-400 hover:text-primary-300 mt-auto font-semibold text-sm sm:text-base"
                    >
                      Lihat Detail →
                    </Link>
                  </div>
                </motion.div>
              </StarBorder>
            </ScrollAnimation>
          ))}
        </div>

        {/* Tombol untuk melihat semua proyek */}
        <div className="text-center mt-10 sm:mt-12 lg:mt-16">
          <Link
            href="/portfolio"
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-primary text-white font-medium rounded-md hover:shadow-lg transition duration-300 inline-block text-sm sm:text-base"
          >
            Lihat Semua Proyek
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
