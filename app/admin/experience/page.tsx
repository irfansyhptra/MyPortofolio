"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiDownload, FiArrowRight, FiBriefcase, FiCalendar } from "react-icons/fi";
import { useData } from "@/app/components/DataContext";
import AnimatedContent from "@/app/components/AnimatedContent";
import SplitText from "@/app/components/SplitText";
import { cn } from "@/app/lib/utils";
import { StickyScroll } from "@/app/components/sticky-scroll-reveal";
export default function AboutPage() {
  const { data } = useData();
  const { skills, experiences, profile } = data;
  const [hoveredSkillIndex, setHoveredSkillIndex] = useState<number | null>(null);
  // Group skills by category
  const categories = {
    Frontend: skills.filter(s => s.category === "Frontend"),
    Backend: skills.filter(s => s.category === "Backend"),
    Tools: skills.filter(s => s.category === "Tools"),
  };
  // Define colors for the skills
  const skillColors = [
    "#1c1c1c", // React.js - Charcoal
    "#d10000", // Next.js - Red
    "#5f5f5d", // TypeScript - Muted Charcoal
    "#ff4d4d", // Tailwind CSS - Light Red
    "#333333", // Node.js - Dark Gray
    "#8b0000", // HTML5 & CSS3 - Dark Red
    "#a8a8a6", // JavaScript - Grayish
    "#7f7f7d", // MongoDB - Medium Gray
    "#c2c2c0", // Git & GitHub - Cool Silver
    "#ff6666", // GraphQL - Coral Red
    "#3d3d3c", // Redux - Anthracite
    "#e2e2e0", // Firebase - Light Silver
  ];
  // Map skills with colors for matching
  const skillsWithColors = skills.map((skill, index) => ({
    ...skill,
    color: skillColors[index % skillColors.length],
    originalIndex: index
  }));
  // Render SVG Sector path helper
  const getSectorPath = (
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
  ) => {
    const rad = Math.PI / 180;
    const x1 = cx + r * Math.cos(startAngle * rad);
    const y1 = cy + r * Math.sin(startAngle * rad);
    const x2 = cx + r * Math.cos(endAngle * rad);
    const y2 = cy + r * Math.sin(endAngle * rad);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  };
  const numSkills = skillsWithColors.length;
  const anglePerSector = 360 / numSkills;
  const gap = 3.5; // Gap in degrees between sectors
  const activeSkill = hoveredSkillIndex !== null ? skillsWithColors[hoveredSkillIndex] : null;
  // Map experiences to StickyScroll items
  const stickyExperiences = experiences.map((exp, idx) => {
    // Generate some elegant initials
    const initials = exp.company
      ? exp.company
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
      : "DA";
    // Select dynamic styling based on index (even = dark theme card, odd = light cream card)
    const isDark = idx % 2 === 0;
    const badgeColor = isDark
      ? "bg-cream-light/10 text-cream border-cream/20"
      : "bg-charcoal/5 text-charcoal border-charcoal/10";

    const labelColor = isDark ? "text-cream-light/60" : "text-charcoal-muted";
    const highlightBorder = isDark ? "border-cream-light/10" : "border-charcoal/10";
    // Dynamic key metrics based on role
    const isSenior = exp.position.toLowerCase().includes("senior") || exp.position.toLowerCase().includes("lead");
    const isFrontend = exp.position.toLowerCase().includes("frontend") || exp.position.toLowerCase().includes("ui");

    let highlights = ["Project Delivery", "Clean Code Architecture", "Responsive Design"];
    let techBadges = ["React.js", "Next.js", "TypeScript"];

    if (isSenior) {
      highlights = ["Team Leadership", "Arsitektur Skala Besar", "Optimasi Performa Web"];
    } else if (isFrontend) {
      highlights = ["UI/UX Implementation", "Responsive Layouts", "State Management"];
    }

    if (isFrontend) {
      techBadges = ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "GSAP"];
    } else if (exp.position.toLowerCase().includes("full stack") || exp.position.toLowerCase().includes("backend")) {
      techBadges = ["Node.js", "Express", "MongoDB", "React.js", "Git"];
      highlights = ["RESTful APIs", "Database Design", "Deployment & CI/CD"];
    } else {
      techBadges = ["JavaScript", "HTML5 & CSS3", "Tailwind CSS", "Git"];
    }
    return {
      title: exp.position,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      content: (
        <div
          className={cn(
            "w-full h-full flex flex-col justify-between rounded-xl p-5 border transition-all duration-300 shadow-md",
            isDark
              ? "bg-gradient-to-br from-charcoal to-[#2e2e2e] text-[#fcfbf8] border-charcoal-border"
              : "bg-gradient-to-br from-[#eceae4] to-[#fcfbf8] text-charcoal border-cream-border"
          )}
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono text-sm tracking-wider shadow-sm",
                  isDark ? "bg-[#3d3d3c] text-cream" : "bg-cream-light text-charcoal border border-cream-border"
                )}
              >
                {initials}
              </div>
              <div>
                <h5 className="font-bold text-sm line-clamp-1">{exp.company}</h5>
                <span className={cn("text-[10px] font-mono", labelColor)}>
                  {exp.period}
                </span>
              </div>
            </div>

            <div className={cn(
              "px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold font-mono border",
              isDark ? "bg-charcoal/30 text-[#ff4500] border-[#ff4500]/20" : "bg-[#d10000]/10 text-[#d10000] border-[#d10000]/20"
            )}>
              {isSenior ? "Lead Role" : "Core Team"}
            </div>
          </div>
          {/* Body - Metrics & Accomplishments */}
          <div className="my-4 flex flex-col gap-2.5">
            <span className={cn("text-[9px] uppercase tracking-wider font-bold font-mono block", labelColor)}>
              Kontribusi & Fokus
            </span>
            <div className="flex flex-col gap-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isDark ? "bg-[#ff4500]" : "bg-[#d10000]")} />
                  <span className="line-clamp-1 opacity-90">{h}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Footer - Tech badges */}
          <div className={`pt-3 border-t ${highlightBorder} flex flex-col gap-2`}>
            <span className={cn("text-[9px] uppercase tracking-wider font-bold font-mono block", labelColor)}>
              Tech Stack
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-[64px] overflow-y-auto no-scrollbar">
              {techBadges.map((tech) => (
                <span
                  key={tech}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors",
                    badgeColor
                  )}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    };
  });
  return (
    <div className="w-full min-h-screen py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-4 sm:gap-5">

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

        {/* Box 1: Journey & Professional Bio (Left) */}
        <div className="lg:col-span-2 card-minimal p-8 sm:p-12 flex flex-col justify-between min-h-[400px]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted block mb-3">
              Tentang Saya
            </span>
            <SplitText
              text="Perjalanan Profesional"
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

            <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed whitespace-pre-line max-w-2xl">
              {profile.journeyText}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-cream-border">
            <a href={profile.cv} download className="btn-primary-dark">
              <FiDownload className="mr-2" /> Download CV
            </a>
            <Link href="/contact" className="btn-ghost">
              Hubungi Saya <FiArrowRight className="ml-1.5" />
            </Link>
          </div>
        </div>
        {/* Box 2: Profile Picture Container (Right) */}
        <div className="lg:col-span-1 card-minimal p-6 flex flex-col justify-center items-center bg-cream-light min-h-[350px]">
          <div className="relative w-full aspect-square max-w-[280px] rounded-xl overflow-hidden border border-cream-border bg-cream p-3 shadow-inner">
            <div className="w-full h-full rounded-lg overflow-hidden relative border border-cream-border bg-cream-light">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
          <h3 className="text-charcoal font-bold text-lg mt-4">{profile.name}</h3>
          <p className="text-charcoal-muted text-xs uppercase font-mono tracking-wider mt-1">{profile.role}</p>
        </div>
        {/* Box 3: Skills Section with Interactive Donut Chart */}
        <div className="lg:col-span-3 card-minimal p-8 sm:p-12">
          <div className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">Teknologi & Tools</h3>
            <p className="text-charcoal-muted text-sm mt-1 leading-relaxed">
              Skala keahlian dan ekosistem pengembangan teknologi yang saya gunakan sehari-hari.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

            {/* Left Column: Grouped Tags (7 Cols) */}
            <div className="md:col-span-7 flex flex-col gap-6">
              {Object.entries(categories).map(([categoryName, skillList]) => (
                <div key={categoryName}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3 font-mono">
                    {categoryName}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => {
                      // Find matching color / index from our master array
                      const masterIndex = skills.findIndex(s => s.name === skill.name);
                      const isHovered = hoveredSkillIndex === masterIndex;

                      return (
                        <button
                          key={skill.name}
                          onMouseEnter={() => setHoveredSkillIndex(masterIndex)}
                          onMouseLeave={() => setHoveredSkillIndex(null)}
                          className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 ${isHovered
                            ? "bg-charcoal text-cream-light border-charcoal shadow-[rgba(255,255,255,0.15)_0px_0.5px_0px_0px_inset]"
                            : "bg-cream-light text-charcoal-muted border-cream-border hover:border-charcoal-border hover:text-charcoal"
                            }`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {/* Right Column: Donut Chart Sync (5 Cols) */}
            <div className="md:col-span-5 flex justify-center items-center">
              <div className="relative w-64 h-64 flex items-center justify-center bg-cream-light rounded-2xl border border-cream-border p-4">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90 select-none">
                  {skillsWithColors.map((skill, i) => {
                    const startAngle = i * anglePerSector + gap / 2;
                    const endAngle = (i + 1) * anglePerSector - gap / 2;

                    // Base inner boundary radius is 48. Level (0-100) maps to radius increments up to 92 max
                    const baseRadius = 48;
                    const maxRadius = 92;
                    const isHovered = hoveredSkillIndex === i;
                    const r = baseRadius + (maxRadius - baseRadius) * (skill.level / 100);

                    return (
                      <path
                        key={skill.name}
                        d={getSectorPath(100, 100, isHovered ? r + 4 : r, startAngle, endAngle)}
                        fill={skill.color}
                        className="transition-all duration-300 cursor-pointer"
                        style={{
                          opacity: hoveredSkillIndex === null || isHovered ? 1 : 0.45,
                        }}
                        onMouseEnter={() => setHoveredSkillIndex(i)}
                        onMouseLeave={() => setHoveredSkillIndex(null)}
                      />
                    );
                  })}
                  {/* Center cutout circle */}
                  <circle cx="100" cy="100" r="44" fill="#fcfbf8" className="stroke-cream-border stroke-[1px]" />
                </svg>

                {/* Center Content Overlaid */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-charcoal-muted">
                    {activeSkill ? activeSkill.category : "Kategori"}
                  </span>
                  <span className="text-xs font-bold text-charcoal leading-tight mt-0.5 line-clamp-2 max-w-[85px]">
                    {activeSkill ? activeSkill.name : "Ekosistem"}
                  </span>
                  <span className="text-base font-extrabold text-charcoal mt-1">
                    {activeSkill ? `${activeSkill.level}%` : `${skills.length} Tools`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Box 4: Experiences Professional Timeline */}
        <div className="lg:col-span-3 card-minimal p-8 sm:p-12">
          <div className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">Pengalaman Kerja</h3>
            <p className="text-charcoal-muted text-sm mt-1 leading-relaxed">
              Riwayat karir profesional dan kontribusi industri saya selama ini.
            </p>
          </div>
          <StickyScroll content={stickyExperiences} />
        </div>
      </div>
    </div>
  );
}
