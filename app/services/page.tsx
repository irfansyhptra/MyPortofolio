"use client";

import React from "react";
import Link from "next/link";
import { services, Service, workProcess } from "@/app/data/mockData";
import GSAPReveal from "@/app/components/GSAPReveal";
import ParallaxSection from "@/app/components/ParallaxSection";

const ServicesPage = () => {
  return (
    <div className="pt-20 sm:pt-24">
      {/* ═══ Section Layanan ═══ */}
      <section className="py-12 sm:py-16 px-4 bg-dark-900">
        <div className="container mx-auto">
          {/* Title — Clip circle */}
          <GSAPReveal preset="clip-circle" duration={1.2}>
            <div className="text-center mb-10 sm:mb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Solusi <span className="gradient-text">Digital</span>
              </h1>
              <p className="text-dark-300 max-w-3xl mx-auto text-sm sm:text-base">
                Berbagai layanan pengembangan web yang saya tawarkan untuk
                membantu bisnis Anda.
              </p>
            </div>
          </GSAPReveal>

          {/* Service cards — Flip up staggered */}
          <GSAPReveal preset="flip-up" stagger={0.15} duration={1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service: Service) => (
              <div key={service.id} className="card p-6 sm:p-8 h-full group hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                <div className="text-3xl sm:text-4xl mb-4 sm:mb-6 group-hover:scale-125 transition-transform duration-500 inline-block">{service.icon}</div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h2>
                <p className="text-dark-300 text-sm sm:text-base">{service.description}</p>
              </div>
            ))}
          </GSAPReveal>
        </div>
      </section>

      {/* ═══ Section Proses Kerja ═══ */}
      <section className="py-12 sm:py-20 px-4 bg-dark-950">
        <div className="container mx-auto">
          {/* Title — Blur-in */}
          <GSAPReveal preset="blur-in" duration={1}>
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Bagaimana Saya <span className="gradient-text">Bekerja</span>
              </h2>
              <p className="text-dark-300 max-w-2xl mx-auto text-sm sm:text-base">
                Proses pengembangan yang sistematis untuk memastikan hasil
                terbaik.
              </p>
            </div>
          </GSAPReveal>

          {/* Work process timeline — Slide-rotate staggered with parallax numbers */}
          <div className="max-w-4xl mx-auto">
            {workProcess.map((process, index) => (
              <GSAPReveal key={index} preset="slide-rotate" duration={0.9} delay={index * 0.12}>
                <div className="relative pl-12 sm:pl-16 pb-10 sm:pb-12 border-l-2 border-dark-700 last:border-0 last:pb-0">
                  <ParallaxSection speed={-0.05}>
                    <div className="absolute top-0 -left-5 sm:-left-6 w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-full bg-gradient-primary shadow-lg shadow-primary/20">
                      <span className="text-white font-bold text-sm sm:text-base">{process.step}</span>
                    </div>
                  </ParallaxSection>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                    {process.title}
                  </h3>
                  <p className="text-dark-300 text-sm sm:text-base">{process.description}</p>
                </div>
              </GSAPReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA Section — Blur-in with scale ═══ */}
      <section className="py-12 sm:py-20 px-4 bg-dark-900">
        <div className="container mx-auto text-center">
          <GSAPReveal preset="scale-up" duration={1}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Siap untuk Memulai?</h2>
            <p className="text-dark-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Jadwalkan konsultasi gratis untuk mendiskusikan proyek Anda dan
              melihat bagaimana saya dapat membantu mewujudkannya.
            </p>
            <Link
              href="/contact"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-primary text-white font-semibold rounded-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 inline-block hover:-translate-y-1"
            >
              Jadwalkan Konsultasi
            </Link>
          </GSAPReveal>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
