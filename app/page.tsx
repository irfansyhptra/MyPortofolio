"use client";
import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FiHome, FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";
import { HeroParallax } from "@/app/components/HeroParallax";
import RotatingText from "@/app/components/RotatingText";

const Lanyard = dynamic(() => import("@/app/components/Lanyard"), {
  ssr: false,
});

const parallaxProducts = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/moonbeam.png",
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  {
    title: "Rogue",
    link: "https://userogue.com",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/rogue.png",
  },
  {
    title: "Editorially",
    link: "https://editorially.org",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/editorially.png",
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/editrix.png",
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/pixelperfect.png",
  },
  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/algochurn.png",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/aceternityui.png",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail: "https://tailwindmasterkit.com/images/products/thumbnails/new/tailwindmasterkit.png",
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/smartbridge.png",
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/renderwork.png",
  },
  {
    title: "Creme Digital",
    link: "https://cremedigital.com",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/cremedigital.png",
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png",
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/invoker.png",
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail: "https://www.aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
  },
];
import SplitText from "@/app/components/SplitText";
import BlurText from "@/app/components/BlurText";
import AnimatedContent from "@/app/components/AnimatedContent";
import LogoLoop from "@/app/components/LogoLoop";
import { useData } from "@/app/components/DataContext";
import BgmPlayerWidget from "@/app/components/BgmPlayerWidget";
import BgmLyricsWidget from "@/app/components/BgmLyricsWidget";
import TestimonialsSection from "@/app/components/TestimonialsSection";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

export default function Home() {
  const { data } = useData();
  const { hero, stats, projects, testimonials = [] } = data;

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  const monthOrder: { [key: string]: number } = {
    "januari": 1, "februari": 2, "maret": 3, "april": 4, "mei": 5, "juni": 6,
    "juli": 7, "agustus": 8, "september": 9, "oktober": 10, "november": 11, "desember": 12,
    "january": 1, "february": 2, "march": 3, "may": 5, "july": 7, "august": 8, "december": 12
  };

  const sortedProjects = [...(projects || [])].sort((a, b) => {
    const yearA = parseInt(a.yearCreated || "0", 10);
    const monthA = monthOrder[(a.monthCreated || "").toLowerCase().trim()] || 0;
    const valA = yearA * 100 + monthA;

    const yearB = parseInt(b.yearCreated || "0", 10);
    const monthB = monthOrder[(b.monthCreated || "").toLowerCase().trim()] || 0;
    const valB = yearB * 100 + monthB;

    return valB - valA;
  });

  const featuredProjects = sortedProjects.slice(0, 10);

  return (
    <div className="w-full min-h-screen py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-4 sm:gap-5">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Box 1: Hero & Greeting (editorial, negative letter spacing) */}
        <div className="lg:col-span-2 card-minimal p-8 sm:p-12 flex flex-col justify-between min-h-[350px] relative overflow-hidden">
          <div 
            className="absolute inset-y-0 right-0 w-full sm:w-[50%] z-0 pointer-events-none opacity-20"
            style={{ 
              maskImage: "linear-gradient(to left, white 20%, transparent 95%)",
              WebkitMaskImage: "linear-gradient(to left, white 20%, transparent 95%)"
            }}
          >
            <HeroParallax products={parallaxProducts} />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full w-full">
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
        </div>

        {/* Box 2: Interactive 3D Lanyard */}
        <div className="lg:col-span-1 card-minimal overflow-hidden relative min-h-[450px] p-0">
          <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
        </div>

        {/* Box 3: Background Music Player */}
        <div className="lg:col-span-2 card-minimal p-4 sm:p-5 flex flex-col justify-center h-[180px] lg:h-[165px] overflow-hidden">
          <BgmPlayerWidget />
        </div>

        {/* Box 3.5: Background Music Lyrics */}
        <div className="lg:col-span-1 card-minimal p-4 sm:p-5 flex flex-col justify-center h-[180px] lg:h-[165px] overflow-hidden">
          <BgmLyricsWidget />
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
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <Link href="/portfolio" className="btn-ghost text-xs">
                Semua Proyek <FiArrowRight className="ml-1.5" />
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  className="w-8 h-8 rounded-full border border-cream-border flex items-center justify-center bg-cream hover:bg-cream-light text-charcoal transition-all hover:border-charcoal shadow-sm active:scale-95"
                  aria-label="Previous Project"
                >
                  <FiChevronLeft className="text-base" />
                </button>
                <button
                  onClick={scrollRight}
                  className="w-8 h-8 rounded-full border border-cream-border flex items-center justify-center bg-cream hover:bg-cream-light text-charcoal transition-all hover:border-charcoal shadow-sm active:scale-95"
                  aria-label="Next Project"
                >
                  <FiChevronRight className="text-base" />
                </button>
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4"
          >
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col bg-cream rounded-xl border border-cream-border overflow-hidden transition-all duration-300 hover:border-charcoal-border hover:shadow-sm snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[360px]"
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
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-base font-bold text-charcoal group-hover:text-charcoal transition-colors line-clamp-1">
                        {project.title}
                      </h4>
                      {(project.monthCreated || project.yearCreated) && (
                        <span className="text-[10px] font-mono text-charcoal-muted flex-shrink-0 bg-cream-light border border-cream-border px-2 py-0.5 rounded">
                          {project.monthCreated || ""} {project.yearCreated || ""}
                        </span>
                      )}
                    </div>
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

        {/* Box 6: Bento Testimonials list */}
        <TestimonialsSection />

      </div>
    </div>
  );
}
