"use client";
import React from "react";
import Link from "next/link";
import { FiHome, FiArrowRight } from "react-icons/fi";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";
import Lanyard from "@/app/components/Lanyard";
import RotatingText from "@/app/components/RotatingText";
import SplitText from "@/app/components/SplitText";
import BlurText from "@/app/components/BlurText";
import AnimatedContent from "@/app/components/AnimatedContent";
import LogoLoop from "@/app/components/LogoLoop";
import { useData } from "@/app/components/DataContext";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

export default function Home() {
  const { data } = useData();
  const { hero, stats, projects } = data;

  return (
    <div className="w-full min-h-screen py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-4 sm:gap-5">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Box 1: Hero & Greeting (editorial, negative letter spacing) */}
        <div className="lg:col-span-2 card-minimal p-8 sm:p-12 flex flex-col justify-between min-h-[350px]">
          <div>
            <AnimatedContent
              distance={40}
              direction="vertical"
              reverse={false}
              duration={0.8}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={1}
              threshold={0.1}
              delay={0.1}
            >
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <h2 className="text-charcoal-muted text-xs sm:text-sm font-semibold tracking-wider uppercase font-mono">
                  {hero.greeting}
                </h2>
                <RotatingText
                  texts={hero.rotatingTexts}
                  mainClassName="px-2.5 py-0.5 bg-charcoal text-cream-light overflow-hidden justify-center rounded text-xs sm:text-sm font-mono font-bold inline-flex transition-all shadow-[rgba(255,255,255,0.15)_0px_0.5px_0px_0px_inset]"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.02}
                  splitLevelClassName="overflow-hidden pb-0.5"
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 350,
                  }}
                  rotationInterval={2500}
                />
              </div>
            </AnimatedContent>

            <div className="flex flex-col gap-1 mt-2">
              <SplitText
                text={hero.name}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-1.5px] text-charcoal leading-none"
                delay={30}
                duration={0.5}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                textAlign="left"
              />
              <SplitText
                text={hero.role}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-1.5px] text-charcoal-muted leading-none"
                delay={60}
                duration={0.5}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                textAlign="left"
              />
            </div>

            <div className="mt-6">
              <BlurText
                text={hero.description}
                delay={100}
                animateBy="words"
                direction="top"
                className="text-base sm:text-lg md:text-xl text-charcoal-muted max-w-lg leading-relaxed"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary-dark">
              Hire Me <FiArrowRight className="ml-2" />
            </Link>
            <Link href="/portfolio" className="btn-ghost">
              Lihat Proyek
            </Link>
          </div>
        </div>

        {/* Box 2: 3D Lanyard (Fills depth container on right) */}
        <div className="lg:col-span-1 card-minimal overflow-hidden relative min-h-[450px] lg:h-auto flex items-center justify-center bg-cream-light">
          <div className="absolute inset-0 w-full h-full scale-100">
            <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
          </div>
        </div>

        {/* Box 3: Stats row */}
        <div className="lg:col-span-2 card-minimal p-8 flex flex-wrap gap-8 justify-around items-center">
          {stats.map((stat, i) => (
            <div key={i} className="text-center sm:text-left flex flex-col min-w-[120px]">
              <div className="text-4xl sm:text-5xl font-bold tracking-tight text-charcoal font-sans">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-charcoal-muted mt-1.5 font-semibold font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Box 4: Tech logo loop (cream-light container) */}
        <div className="lg:col-span-3 card-minimal py-6 px-4 overflow-hidden bg-cream-light flex items-center">
          <div style={{ height: "40px", width: "100%", position: "relative", overflow: "hidden" }}>
            <LogoLoop
              logos={techLogos}
              speed={100}
              direction="left"
              logoHeight={24}
              gap={48}
              pauseOnHover
              scaleOnHover
              fadeOut
              fadeOutColor="#fcfbf8"
              ariaLabel="Technology partners"
            />
          </div>
        </div>

        {/* Box 5: Bento Featured Projects list */}
        <div className="lg:col-span-3 card-minimal p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">Proyek Pilihan</h3>
              <p className="text-charcoal-muted text-sm mt-1 leading-relaxed">
                Beberapa proyek terbaik yang baru-baru ini saya selesaikan.
              </p>
            </div>
            <Link href="/portfolio" className="btn-ghost text-xs">
              Semua Proyek <FiArrowRight className="ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="group flex flex-col bg-cream rounded-xl border border-cream-border overflow-hidden transition-all duration-300 hover:border-charcoal-border hover:shadow-sm"
              >
                {/* Project Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-cream-light border-b border-cream-border">
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
                {/* Project Info */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-base font-bold text-charcoal group-hover:text-charcoal transition-colors line-clamp-1">
                      {project.title}
                    </h4>
                    <p className="text-charcoal-muted text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-cream-border flex items-center justify-between">
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
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
