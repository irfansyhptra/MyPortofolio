// app/portfolio/[id]/page.tsx

// Perbaikan: Impor 'projects' dan tipe 'Project' secara spesifik
import { projects, Project } from "@/app/data/mockData";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollAnimation from "@/app/components/ScrollAnimation";

// Tipe untuk props halaman, ini adalah praktik yang baik
type PortfolioDetailPageProps = {
  params: { id: string };
};

// Fungsi untuk mendapatkan data proyek berdasarkan ID
// Menambahkan tipe 'Project' pada return value untuk kejelasan
async function getProject(id: string): Promise<Project | undefined> {
  const projectId = parseInt(id, 10);
  // Pastikan parameter 'p' memiliki tipe 'Project'
  return projects.find((p: Project) => p.id === projectId);
}

// Gunakan tipe PortfolioDetailPageProps untuk props komponen
export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {project.title}
          </h1>
          <div className="flex justify-center flex-wrap gap-2 mb-12">
            {project.category.map((cat: string) => (
              <span
                key={cat}
                className="px-3 py-1 bg-dark-800 text-primary-400 rounded-full text-xs font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          {/* Perbaikan pada komponen Image untuk Next.js versi baru */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-12">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        </ScrollAnimation>

        <div className="max-w-3xl mx-auto">
          <ScrollAnimation delay={0.3}>
            <h2 className="text-2xl font-semibold mb-4">Deskripsi Proyek</h2>
            <p className="text-dark-300 leading-relaxed mb-8">
              {project.description}
            </p>
          </ScrollAnimation>

          <ScrollAnimation delay={0.4}>
            <h2 className="text-2xl font-semibold mb-4">
              Teknologi yang Digunakan
            </h2>
            <div className="flex flex-wrap gap-3 mb-12">
              {project.technologies.map((tech: string) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-dark-800 text-dark-300 rounded-md text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.5}>
            <div className="text-center">
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-gradient-primary text-white font-medium rounded-md hover:shadow-lg transition duration-300 inline-block"
              >
                Kunjungi Situs
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
}

// Fungsi untuk menghasilkan path statis
export async function generateStaticParams() {
  return projects.map((project: Project) => ({
    id: project.id.toString(),
  }));
}
