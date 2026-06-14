import { projects, Project } from "@/app/data/mockData";
import { getDb } from "@/app/lib/mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiArrowUpRight, FiTag, FiCpu } from "react-icons/fi";

type PortfolioDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function getProject(id: string): Promise<Project | undefined> {
  const projectId = parseInt(id, 10);
  try {
    const db = await getDb();
    const collection = db.collection<any>("site_data");
    const data = await collection.findOne({ _id: "site_data_main" });
    if (data && data.projects) {
      const p = data.projects.find((proj: any) => proj.id === projectId);
      if (p) return p as Project;
    }
  } catch (err) {
    console.error("Failed to fetch project from database", err);
  }
  return projects.find((p: Project) => p.id === projectId);
}

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-4 sm:gap-5">
      
      {/* Back button */}
      <div className="flex items-center">
        <Link href="/portfolio" className="btn-ghost text-xs py-2 px-4 inline-flex items-center gap-2">
          <FiArrowLeft /> Kembali ke Portofolio
        </Link>
      </div>

      {/* Asymmetric 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Main Content Column (Left - 2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Card containing title and image */}
          <div className="card-minimal p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-1.5px] text-charcoal leading-none">
                {project.title}
              </h1>
            </div>
            
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-cream-border bg-cream">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card containing description */}
          <div className="card-minimal p-8 sm:p-10">
            <h2 className="text-xl font-bold text-charcoal mb-4">Deskripsi Proyek</h2>
            <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

        </div>

        {/* Sidebar Info Column (Right - 1 col) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Meta card */}
          <div className="card-minimal p-8 flex flex-col gap-6">
            
            {/* Category */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3 font-mono flex items-center gap-1.5">
                <FiTag /> Kategori
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.category.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-medium px-3 py-1 bg-cream border border-cream-border text-charcoal rounded-full"
                  >
                    {cat.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3 font-mono flex items-center gap-1.5">
                <FiCpu /> Teknologi
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium px-3 py-1 bg-cream-light border border-cream-border text-charcoal-muted rounded-md font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-cream-border flex flex-col gap-3">
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-dark w-full py-3 flex justify-center items-center gap-2"
              >
                Kunjungi Situs <FiArrowUpRight />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const db = await getDb();
    const collection = db.collection<any>("site_data");
    const data = await collection.findOne({ _id: "site_data_main" });
    if (data && data.projects) {
      return data.projects.map((p: any) => ({
        id: p.id.toString(),
      }));
    }
  } catch (err) {
    console.error("Failed to generate static params from database", err);
  }
  return projects.map((project: Project) => ({
    id: project.id.toString(),
  }));
}
