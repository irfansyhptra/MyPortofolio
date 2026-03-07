import React from "react";
import Link from "next/link";
import Image from "next/image";
import GlareHover from "@/app/components/GlareHover";
import GSAPReveal from "@/app/components/GSAPReveal";
import ParallaxSection from "@/app/components/ParallaxSection";
import { skills, experiences, profile } from "@/app/data/mockData";

const AboutPage = () => {
  return (
    <div className="pt-20 sm:pt-24">
      {/* ═══ Section Perkenalan ═══ */}
      <section className="py-12 sm:py-16 px-4 bg-dark-900">
        <div className="container mx-auto">
          {/* Title — Clip circle reveal */}
          <GSAPReveal preset="clip-circle" duration={1.2}>
            <div className="text-center mb-10 sm:mb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Perkenalkan, Saya{" "}
                <span className="gradient-text">{profile.role}</span>
              </h1>
              <p className="text-dark-300 max-w-3xl mx-auto text-sm sm:text-base">
                {profile.bio}
              </p>
            </div>
          </GSAPReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Photo — Parallax + clip-path reveal */}
            <ParallaxSection speed={-0.15} overflow>
              <GSAPReveal preset="clip-left" duration={1.4}>
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  <GlareHover
                    width="100%"
                    height="400px"
                    borderRadius="0.75rem"
                    glareColor="#d10000"
                    glareOpacity={0.2}
                  >
                    <Image
                      src={profile.photo}
                      alt={profile.name}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </GlareHover>
                </div>
              </GSAPReveal>
            </ParallaxSection>

            {/* Bio — Skew entrance from right */}
            <GSAPReveal preset="fade-right" duration={1} delay={0.2}>
              <div className="text-center lg:text-left">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                  Perjalanan Profesional
                </h2>
                <p className="text-dark-300 mb-4 sm:mb-6 text-sm sm:text-base whitespace-pre-line">
                  {profile.journeyText}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center lg:justify-start">
                  <a
                    href={profile.cv}
                    download
                    className="px-6 py-2.5 bg-gradient-primary text-white font-medium rounded-md hover:shadow-lg transition duration-300 text-center"
                  >
                    Download CV
                  </a>
                  <Link
                    href="/contact"
                    className="px-6 py-2.5 bg-dark-800 text-white font-medium rounded-md border border-dark-700 hover:border-primary-400 transition duration-300 text-center"
                  >
                    Hubungi Saya
                  </Link>
                </div>
              </div>
            </GSAPReveal>
          </div>
        </div>
      </section>

      {/* ═══ Section Keahlian ═══ */}
      <section className="py-12 sm:py-20 px-4 bg-dark-950">
        <div className="container mx-auto">
          {/* Title — Blur-in */}
          <GSAPReveal preset="blur-in" duration={1}>
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Teknologi & <span className="gradient-text">Tools</span>
              </h2>
              <p className="text-dark-300 max-w-2xl mx-auto text-sm sm:text-base">
                Teknologi dan tools yang saya kuasai untuk mengembangkan solusi
                digital.
              </p>
            </div>
          </GSAPReveal>

          {/* Skills grid — Staggered scale-up */}
          <GSAPReveal preset="elastic-scale" stagger={0.08} duration={0.8} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {skills.map((skill, index) => (
              <div key={index} className="card p-4 sm:p-6 hover:border-primary/30 transition-colors duration-300">
                <h3 className="font-medium mb-3 text-sm sm:text-base">{skill.name}</h3>
                <div className="w-full bg-dark-800 rounded-full h-2 sm:h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-primary h-2 sm:h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <span className="text-xs text-white/40 mt-2 inline-block">{skill.level}%</span>
              </div>
            ))}
          </GSAPReveal>
        </div>
      </section>

      {/* ═══ Section Pengalaman ═══ */}
      <section className="py-12 sm:py-20 px-4 bg-dark-900">
        <div className="container mx-auto">
          {/* Title — Flip up */}
          <GSAPReveal preset="flip-up" duration={1}>
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Pengalaman <span className="gradient-text">Profesional</span>
              </h2>
            </div>
          </GSAPReveal>

          {/* Timeline — Skew entrance staggered */}
          <div className="max-w-4xl mx-auto">
            {experiences.map((exp, index) => (
              <GSAPReveal key={index} preset="skew-up" duration={0.9} delay={index * 0.15}>
                <div className="relative pl-6 sm:pl-8 pb-10 sm:pb-12 border-l-2 border-dark-700 last:border-0 last:pb-0">
                  <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-gradient-primary"></div>
                  <div className="mb-1">
                    <span className="px-3 py-1 bg-dark-800 text-primary-400 rounded-full text-xs font-medium">
                      {exp.period}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mt-2 mb-1">
                    {exp.position}
                  </h3>
                  <p className="text-dark-300 mb-3 sm:mb-4 text-sm sm:text-base">{exp.company}</p>
                  <p className="text-dark-400 text-sm sm:text-base">{exp.description}</p>
                </div>
              </GSAPReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
