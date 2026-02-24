export interface Stats {
  value: number;
  label: string;
  suffix?: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string; // Made required
  category?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  category: string[];
  technologies: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  quote: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "CEO at TechCorp",
    quote:
      "Pengerjaan yang sangat profesional dan hasil yang memuaskan. Komunikasi yang baik selama proses pengembangan.",
    avatar: "/assets/testimonials/avatar1.jpg",
  },
  {
    id: 2,
    name: "David Chen",
    position: "Product Manager",
    quote:
      "Website kami menjadi lebih modern dan performa yang sangat baik. Sangat merekomendasikan jasanya!",
    avatar: "/assets/testimonials/avatar2.jpg",
  },
  {
    id: 3,
    name: "Amanda Torres",
    position: "Marketing Director",
    quote:
      "Hasil pengerjaan sesuai dengan ekspektasi dan tepat waktu. Sangat membantu dalam transformasi digital bisnis kami.",
    avatar: "/assets/testimonials/avatar3.jpg",
  },
];

export const services: Service[] = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Membuat website modern dan responsif dengan teknologi terkini",
    icon: "💻",
  },
  {
    id: 2,
    title: "Frontend Development",
    description: "Membangun antarmuka pengguna yang menarik dan interaktif",
    icon: "🎨",
  },
  {
    id: 3,
    title: "Backend Development",
    description: "Mengembangkan sistem backend yang handal dan scalable",
    icon: "⚙️",
  },
];

export const stats: Stats[] = [
  {
    value: 50,
    label: "Projects Completed",
    suffix: "+",
  },
  {
    value: 95,
    label: "Client Satisfaction",
    suffix: "%",
  },
  {
    value: 5,
    label: "Years Experience",
    suffix: "+",
  },
  {
    value: 100,
    label: "Code Reviews",
    suffix: "+",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    excerpt: "Learn how to build modern web applications with Next.js",
    content:
      "Next.js is a powerful framework for building React applications...",
    date: "2025-09-05",
    author: "Irfan Syahputra",
    image: "/assets/blog/nextjs.jpg",
    category: "Web Development",
  },
];

export const projects: Project[] = [
  {
    id: 1,
    title: "Modern Portfolio Website",
    description:
      "A personal portfolio website built with Next.js and Three.js, featuring interactive 3D elements and smooth animations. This project showcases modern web development practices and creative design implementation.",
    image: "/assets/projects/portfolio.jpg",
    link: "https://portfolio.example.com",
    category: ["Web Development", "3D Graphics"],
    technologies: ["Next.js", "Three.js", "TailwindCSS", "Framer Motion"],
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with real-time inventory management, secure payment processing, and responsive design for optimal user experience across all devices.",
    image: "/assets/projects/ecommerce.jpg",
    link: "https://ecommerce.example.com",
    category: ["Web Development", "E-Commerce"],
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
  },
];
