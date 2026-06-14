"use client";
import React from "react";
import Link from "next/link";
import { FiLayers, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { useData } from "@/app/components/DataContext";
import SplitText from "@/app/components/SplitText";

export default function ServicesPage() {
  const { data } = useData();
  const { services, workProcess } = data;
  return (
    <div className="w-full min-h-screen py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-4 sm:gap-5">
      
      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Header Box (Full width) */}
        <div className="lg:col-span-3 card-minimal p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted block mb-3">
              Layanan & Solusi
            </span>
            <SplitText
              text="Solusi Digital Kreatif"
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
              Berbagai layanan pengembangan web yang saya tawarkan untuk membantu mentransformasikan bisnis Anda ke dunia digital dengan standar performa dan kualitas tinggi.
            </p>
          </div>
        </div>

        {/* Services Cards (3 columns) */}
        {services.map((service) => (
          <div 
            key={service.id} 
            className="card-minimal p-8 flex flex-col justify-between group hover:border-charcoal-border transition-colors duration-300"
          >
            <div>
              <div className="text-3xl mb-6 bg-cream p-3 rounded-lg border border-cream-border w-fit group-hover:bg-cream-light transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-4">
                {service.title}
              </h3>
              <p className="text-charcoal-muted text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
            <Link 
              href="/contact" 
              className="mt-8 pt-4 border-t border-cream-border flex items-center text-xs font-semibold text-charcoal group-hover:underline"
            >
              Mulai Konsultasi <FiArrowRight className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        ))}

        {/* Work Process Header Box */}
        <div className="lg:col-span-3 card-minimal p-8 sm:p-12 mt-4">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted block mb-3">
              Metodologi Kerja
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">Bagaimana Saya Bekerja</h3>
            <p className="text-charcoal-muted text-sm mt-1 leading-relaxed">
              Proses pengembangan terstruktur yang dirancang untuk memastikan transparansi, efisiensi, dan hasil berkualitas tinggi di setiap tahap.
            </p>
          </div>

          {/* Work Process Grid timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {workProcess.map((process) => (
              <div key={process.step} className="bg-cream p-6 rounded-xl border border-cream-border flex flex-col justify-between relative overflow-hidden group hover:border-charcoal-border transition-colors duration-300">
                <div>
                  <div className="text-3xl font-black text-charcoal-muted/20 font-mono absolute right-4 top-4">
                    {String(process.step).padStart(2, '0')}
                  </div>
                  <h4 className="text-base font-bold text-charcoal mt-8 mb-3 flex items-center gap-2">
                    <FiCheckCircle className="text-charcoal-muted text-sm" /> {process.title}
                  </h4>
                  <p className="text-charcoal-muted text-xs sm:text-sm leading-relaxed">
                    {process.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Box (Full width) */}
        <div className="lg:col-span-3 card-minimal p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-cream-light mt-4">
          <h3 className="text-2xl font-bold text-charcoal mb-4">Siap untuk Memulai Proyek Anda?</h3>
          <p className="text-charcoal-muted text-sm max-w-xl leading-relaxed mb-8">
            Diskusikan kebutuhan ide dan bisnis Anda bersama saya. Mari kita temukan solusi terbaik untuk menciptakan produk digital yang luar biasa.
          </p>
          <Link href="/contact" className="btn-primary-dark px-8 py-3">
            Jadwalkan Konsultasi Gratis <FiArrowRight className="ml-2" />
          </Link>
        </div>

      </div>
    </div>
  );
}
