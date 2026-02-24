import React from "react";
import Link from "next/link";
import { services, Service } from "@/app/data/mockData";
import ScrollAnimation from "@/app/components/ScrollAnimation";

const workProcess = [
  {
    step: 1,
    title: "Discovery & Konsultasi",
    description:
      "Memahami kebutuhan, tujuan, dan ekspektasi Anda melalui diskusi mendalam.",
  },
  {
    step: 2,
    title: "Perencanaan & Desain",
    description:
      "Menyusun rencana proyek, membuat wireframe, dan merancang UI/UX yang intuitif.",
  },
  {
    step: 3,
    title: "Pengembangan",
    description:
      "Mengimplementasikan desain menjadi kode dengan teknologi modern dan standar kualitas tinggi.",
  },
  {
    step: 4,
    title: "Testing & Revisi",
    description:
      "Melakukan pengujian komprehensif untuk memastikan semua berfungsi dengan baik dan sesuai.",
  },
  {
    step: 5,
    title: "Deployment & Support",
    description:
      "Meluncurkan proyek dan memberikan dukungan paska-peluncuran untuk pemeliharaan.",
  },
];

const ServicesPage = () => {
  return (
    <div className="pt-20 sm:pt-24">
      {/* Section Layanan */}
      <section className="py-12 sm:py-16 px-4 bg-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Solusi <span className="gradient-text">Digital</span>
            </h1>
            <p className="text-dark-300 max-w-3xl mx-auto text-sm sm:text-base">
              Berbagai layanan pengembangan web yang saya tawarkan untuk
              membantu bisnis Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service: Service, index: number) => (
              <ScrollAnimation key={service.id} delay={index * 0.1}>
                <div className="card p-6 sm:p-8 h-full">
                  <div className="text-3xl sm:text-4xl mb-4 sm:mb-6">{service.icon}</div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                    {service.title}
                  </h2>
                  <p className="text-dark-300 text-sm sm:text-base">{service.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Section Proses Kerja */}
      <section className="py-12 sm:py-20 px-4 bg-dark-950">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Bagaimana Saya <span className="gradient-text">Bekerja</span>
            </h2>
            <p className="text-dark-300 max-w-2xl mx-auto text-sm sm:text-base">
              Proses pengembangan yang sistematis untuk memastikan hasil
              terbaik.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {workProcess.map((process, index) => (
              <ScrollAnimation key={index} delay={index * 0.1}>
                <div className="relative pl-12 sm:pl-16 pb-10 sm:pb-12 border-l-2 border-dark-700 last:border-0 last:pb-0">
                  <div className="absolute top-0 -left-5 sm:-left-6 w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-full bg-gradient-primary">
                    <span className="text-white font-bold text-sm sm:text-base">{process.step}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                    {process.title}
                  </h3>
                  <p className="text-dark-300 text-sm sm:text-base">{process.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 bg-dark-900">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Siap untuk Memulai?</h2>
          <p className="text-dark-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Jadwalkan konsultasi gratis untuk mendiskusikan proyek Anda dan
            melihat bagaimana saya dapat membantu mewujudkannya.
          </p>
          <Link
            href="/contact"
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-primary text-white font-semibold rounded-md hover:shadow-lg transition duration-300 inline-block"
          >
            Jadwalkan Konsultasi
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
