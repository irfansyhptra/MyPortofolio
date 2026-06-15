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
  const {
    skills = [],
    experiences = [],
    educations = [],
    organizations = [],
    profile = {
      name: "",
      role: "",
      bio: "",
      journeyText: "",
      photo: "",
      cv: "",
      location: "",
      email: "",
      phone: "",
      availability: "",
      socialLinks: { github: "", linkedin: "", instagram: "", twitter: "" }
    }
  } = data || {};
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

  // Helper: build image card content for sticky scroll
  const buildImageCard = (item: { image?: string; label1: string; label2: string; label3: string }, idx: number) => (
    <div className="w-full h-full rounded-xl overflow-hidden relative group">
      {item.image ? (
        <>
          <img
            src={item.image}
            alt={`${item.label2} — ${item.label1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">
              {item.label3}
            </span>
            <h5 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
              {item.label1}
            </h5>
            <span className="text-xs text-white/60 mt-0.5">
              {item.label2}
            </span>
          </div>
        </>
      ) : (
        <div className={cn(
          "w-full h-full flex flex-col items-center justify-center gap-3",
          idx % 2 === 0
            ? "bg-gradient-to-br from-charcoal to-[#2e2e2e]"
            : "bg-gradient-to-br from-[#eceae4] to-[#fcfbf8]"
        )}>
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center font-bold font-mono text-lg tracking-wider shadow-lg",
            idx % 2 === 0
              ? "bg-[#3d3d3c] text-cream-light border border-cream-light/10"
              : "bg-cream-light text-charcoal border border-cream-border"
          )}>
            {item.label2.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()}
          </div>
          <div className="text-center px-3">
            <h5 className={cn("text-xs font-bold", idx % 2 === 0 ? "text-cream-light" : "text-charcoal")}>
              {item.label2}
            </h5>
            <span className={cn("text-[10px] font-mono", idx % 2 === 0 ? "text-cream-light/50" : "text-charcoal-muted")}>
              {item.label3}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // Map educations to StickyScroll items
  const stickyEducations = educations.map((edu, idx) => ({
    title: edu.degree,
    subTitle: edu.institution,
    period: edu.period,
    description: edu.description,
    content: buildImageCard({ image: edu.image, label1: edu.degree, label2: edu.institution, label3: edu.period }, idx),
  }));

  // Map experiences to StickyScroll items
  const stickyExperiences = experiences.map((exp, idx) => ({
    title: exp.position,
    subTitle: exp.company,
    period: exp.period,
    description: exp.description,
    content: buildImageCard({ image: exp.image, label1: exp.position, label2: exp.company, label3: exp.period }, idx),
  }));

  // Map organizations to StickyScroll items
  const stickyOrganizations = organizations.map((org, idx) => ({
    title: org.role,
    subTitle: org.name,
    period: org.period,
    description: org.description,
    content: buildImageCard({ image: org.image, label1: org.role, label2: org.name, label3: org.period }, idx),
  }));


  return (
    <div className="w-full min-h-screen py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-4 sm:gap-5">

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-5">

        {/* Box 1: Journey & Professional Bio (Left) */}
        <div className="lg:col-span-4 card-minimal p-8 sm:p-12 flex flex-col justify-between min-h-[400px]">
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
        <div className="lg:col-span-2 card-minimal p-6 flex flex-col justify-center items-center bg-cream-light min-h-[350px]">
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
        <div className="lg:col-span-6 card-minimal p-8 sm:p-12">
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

        {/* Box 4: Education Section */}
        <div className="lg:col-span-3 card-minimal p-8 sm:p-12">
          <div className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">Pendidikan</h3>
            <p className="text-charcoal-muted text-sm mt-1 leading-relaxed">
              Riwayat pendidikan formal yang telah saya tempuh.
            </p>
          </div>
          <StickyScroll content={stickyEducations} />
        </div>

        {/* Box 6: Organization Section */}
        <div className="lg:col-span-3 card-minimal p-8 sm:p-12">
          <div className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">Organisasi</h3>
            <p className="text-charcoal-muted text-sm mt-1 leading-relaxed">
              Pengalaman berorganisasi dan kontribusi dalam komunitas.
            </p>
          </div>
          <StickyScroll content={stickyOrganizations} />
        </div>

        {/* Box 5: Experiences Professional Timeline */}
        <div className="lg:col-span-6 card-minimal p-8 sm:p-12">
          <div className="mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">Pengalaman Kerja</h3>
            <p className="text-charcoal-muted text-sm mt-1 leading-relaxed">
              Riwayat karir profesional dan kontribusi industri saya selama ini.
            </p>
          </div>
          <StickyScroll content={stickyExperiences} cardClassName="lg:w-[70%] lg:h-[35rem] max-w-[1100px]" />
        </div>

      </div>
    </div>
  );
}
