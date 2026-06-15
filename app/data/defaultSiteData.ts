import { SiteData } from "./siteDataManager";

export const defaultSiteData: SiteData = {
  profile: {
    name: "Irfan Syahputra",
    role: "Full Stack Developer",
    bio: "Seorang pengembang web profesional dengan fokus pada teknologi modern untuk menciptakan aplikasi yang cepat, responsif, dan intuitif.",
    journeyText: "Saya adalah seorang pengembang web dengan spesialisasi dalam membangun aplikasi modern menggunakan React.js, Next.js, dan ekosistem JavaScript. Saya bersemangat dalam mengubah ide-ide kompleks menjadi solusi digital yang elegan dan fungsional.\n\nDengan pengalaman lebih dari 5 tahun di industri teknologi, saya telah mengerjakan berbagai proyek dari website company profile hingga aplikasi web kompleks dengan fitur real-time. Fokus saya adalah memberikan solusi yang tidak hanya terlihat menarik, tetapi juga memiliki performa tinggi dan pengalaman pengguna yang optimal.",
    photo: "https://res.cloudinary.com/dpjwfljvc/image/upload/v1781457883/portfolio/profile/rfgwpe0lowl0j8z9pw5c.png",
    cv: "/assets/CV_Irfan_Syahputra.pdf",
    location: "Jakarta, Indonesia",
    email: "kontak@irfansyahputra.com",
    phone: "+62 812 3456 7890",
    availability: "Tersedia untuk proyek freelance & full-time",
    socialLinks: {
      github: "https://github.com/irfansyhptra",
      linkedin: "https://linkedin.com/in/irfansyahputra",
      instagram: "",
      twitter: ""
    }
  },
  hero: {
    greeting: "I'm Ready For Job",
    name: "I'm Irfan Syahputra",
    role: "Full Stack Developer",
    description: "Crafting seamless web experiences with React, Node.js, and beyond.",
    rotatingTexts: [
      "React",
      "Next.js",
      "Is",
      "Cool!"
    ]
  },
  stats: [
    {
      value: 50,
      label: "Projects Completed",
      suffix: "+"
    },
    {
      value: 95,
      label: "Client Satisfaction",
      suffix: "%"
    },
    {
      value: 5,
      label: "Years Experience",
      suffix: "+"
    },
    {
      value: 100,
      label: "Code Reviews",
      suffix: "+"
    }
  ],
  skills: [
    {
      name: "HTML5 & CSS3",
      level: 95,
      category: "Frontend"
    },
    {
      name: "JavaScript (ES6+)",
      level: 90,
      category: "Frontend"
    },
    {
      name: "React.js",
      level: 92,
      category: "Frontend"
    },
    {
      name: "Next.js",
      level: 85,
      category: "Frontend"
    },
    {
      name: "TypeScript",
      level: 80,
      category: "Frontend"
    },
    {
      name: "Tailwind CSS",
      level: 88,
      category: "Frontend"
    },
    {
      name: "Node.js",
      level: 78,
      category: "Backend"
    },
    {
      name: "MongoDB",
      level: 70,
      category: "Backend"
    },
    {
      name: "Git & GitHub",
      level: 85,
      category: "Tools"
    },
    {
      name: "GraphQL",
      level: 75,
      category: "Backend"
    },
    {
      name: "Redux",
      level: 82,
      category: "Frontend"
    },
    {
      name: "Firebase",
      level: 70,
      category: "Backend"
    }
  ],
  educations: [
    {
      id: 1,
      institution: "Universitas Syiah Kuala",
      degree: "S1 Pendidikan Teknologi Informasi",
      period: "2021 - Sekarang",
      description: "Menempuh pendidikan di bidang teknologi informasi dengan fokus pada pengembangan web, pemrograman, dan sistem informasi."
    },
    {
      id: 2,
      institution: "SMK N 3 Kejuruan Muda",
      degree: "Rekayasa Perangkat Lunak",
      period: "2018 - 2021",
      description: "Mempelajari dasar-dasar pemrograman, basis data, dan pengembangan perangkat lunak di tingkat menengah kejuruan."
    }
  ],
  experiences: [
    {
      id: 1,
      position: "Senior Frontend Developer",
      company: "TechSolutions Inc.",
      period: "2023 - Sekarang",
      description: "Memimpin tim frontend dalam mengembangkan aplikasi web kompleks, bertanggung jawab atas arsitektur, optimasi performa, dan implementasi fitur baru."
    },
    {
      id: 2,
      position: "Frontend Developer",
      company: "Digital Agency",
      period: "2021 - 2023",
      description: "Mengembangkan website dan aplikasi web untuk berbagai klien, berfokus pada UI/UX, responsivitas, dan pengalaman pengguna."
    }
  ],
  organizations: [
    {
      id: 1,
      name: "HIMAPRODI PPKn USK",
      role: "Web Developer",
      period: "2023 - 2024",
      description: "Bertanggung jawab dalam pengembangan dan pemeliharaan website organisasi mahasiswa."
    },
    {
      id: 2,
      name: "Komunitas Developer Aceh",
      role: "Anggota Aktif",
      period: "2022 - Sekarang",
      description: "Berkontribusi dalam kegiatan komunitas developer lokal, sharing knowledge, dan kolaborasi proyek open source."
    }
  ],
  services: [
    {
      id: 1,
      title: "Web Development",
      description: "Membuat website modern dan responsif dengan teknologi terkini untuk meningkatkan presence digital bisnis Anda.",
      icon: "💻"
    },
    {
      id: 2,
      title: "Frontend Development",
      description: "Membangun antarmuka pengguna yang menarik dan interaktif dengan fokus pada pengalaman pengguna yang optimal.",
      icon: "🎨"
    },
    {
      id: 3,
      title: "Backend Development",
      description: "Mengembangkan sistem backend yang handal dan scalable untuk mendukung aplikasi web Anda.",
      icon: "⚙️"
    }
  ],
  workProcess: [
    {
      step: 1,
      title: "Discovery & Konsultasi",
      description: "Memahami kebutuhan, tujuan, dan ekspektasi Anda melalui diskusi mendalam."
    },
    {
      step: 2,
      title: "Perencanaan & Desain",
      description: "Menyusun rencana proyek, membuat wireframe, dan merancang UI/UX yang intuitif."
    },
    {
      step: 3,
      title: "Pengembangan",
      description: "Mengimplementasikan desain menjadi kode dengan teknologi modern dan standar kualitas tinggi."
    },
    {
      step: 4,
      title: "Testing & Revisi",
      description: "Melakukan pengujian komprehensif untuk memastikan semua berfungsi dengan baik dan sesuai."
    },
    {
      step: 5,
      title: "Deployment & Support",
      description: "Meluncurkan proyek dan memberikan dukungan paska-peluncuran untuk pemeliharaan."
    }
  ],
  projects: [
    {
      id: 1,
      title: "Split Math",
      description: "Split Math is a web-based learning platform specifically designed to help students, particularly elementary school students, understand the concept of fractions in mathematics easily and enjoyably. This website transforms conventional, often theoretical, learning methods into a colorful, interactive, and visual experience, making complex material easier to digest.",
      image: "https://res.cloudinary.com/dpjwfljvc/image/upload/v1781455402/portfolio/projects/kr8ddzzglchfockdwsoo.png",
      link: "https://split-math-v5.vercel.app/",
      category: [
        "Education Web"
      ],
      technologies: [
        "HTML"
      ],
      featured: false,
      monthCreated: "Desember",
      yearCreated: "2024",
      testimonial: "Aplikasi yang sangat membantu anak-anak belajar pecahan dengan cara yang seru."
    },
    {
      id: 2,
      title: "Eventory",
      description: "Eventory is a front-end web application that functions as a complete and interactive event management system. The platform is designed to connect event organizers with attendees, providing a suite of features for creating, discovering, joining, and managing various types of events. The application has two main roles: Users, who can create and participate in events, and Administrators.",
      image: "https://res.cloudinary.com/dpjwfljvc/image/upload/v1781456513/portfolio/projects/tofuh0w9ygerefcchgyw.png",
      link: "https://eventoryy.vercel.app/",
      category: [
        "Web"
      ],
      technologies: [
        "React"
      ],
      featured: false,
      monthCreated: "Maret",
      yearCreated: "2025",
      testimonial: "Sistem manajemen event yang sangat mudah digunakan."
    },
    {
      id: 3,
      title: "ABSENTEEISM",
      description: "The Teacher Attendance System is a web-based dashboard application designed specifically for teachers at SMK N 3 Kejuruan Muda. Its primary purpose is to modernize and simplify the process of recording attendance, managing teaching schedules, and digitally monitoring absence history. With a clean and interactive interface, the system provides all the information and tools teachers need in one centralized platform.",
      image: "https://res.cloudinary.com/dpjwfljvc/image/upload/v1781459625/portfolio/projects/o3z1zbsedwgwjzliid9n.png",
      link: "",
      category: [
        "School System",
        "Web Dev"
      ],
      technologies: [
        "HTML",
        "Java Script",
        "CSS",
        "Tailwind",
        "MonggoDB",
        "Express.js"
      ],
      featured: false,
      monthCreated: "Oktober",
      yearCreated: "2024",
      testimonial: "Mempermudah pencatatan absen guru secara digital dan real-time."
    },
    {
      id: 4,
      title: "SILAPOR BANDA ACEH",
      description: "SILAPOR is a web application platform that functions as an Online Complaints Information System for Banda Aceh City residents. This project is designed to bridge communication between the community and the city government, providing an efficient, transparent, and structured means for residents to report various issues or problems encountered in their environment.",
      image: "https://res.cloudinary.com/dpjwfljvc/image/upload/v1781459808/portfolio/projects/tksfjwxub09yjrau7nvg.png",
      link: "https://silapor.vercel.app/",
      category: [
        "Web Development"
      ],
      technologies: [
        "HTML",
        "Java Script",
        "CSS",
        "Tailwind",
        "MonggoDB",
        "cloudinary",
        "Express.js"
      ],
      featured: false,
      monthCreated: "Januari",
      yearCreated: "2025",
      testimonial: "Aplikasi pengaduan online yang transparan dan sangat membantu warga."
    },
    {
      id: 5,
      title: "HIMADIKWARA",
      description: "This project is a modern web platform built as a profile site and information system for the Pancasila and Citizenship Education Student Association (HIMAPRODI PPKn) at Syiah Kuala University. As the digital face of the organization, it provides comprehensive information on the association's profile, management structure, work programs, and activity agenda to students and the public.",
      image: "https://res.cloudinary.com/dpjwfljvc/image/upload/v1781459975/portfolio/projects/kktvkyf7xkzowb9kz2n0.png",
      link: "https://himadikwara-usk.my.id/",
      category: [
        "Web Development"
      ],
      technologies: [
        "HTML",
        "Tailwind CSS",
        "Express.js",
        "React.js",
        "MonggoDB",
        "Supabase",
        "Java Script"
      ],
      featured: false,
      monthCreated: "September",
      yearCreated: "2024",
      testimonial: "Website profil mahasiswa PPKn yang sangat informatif dan responsif."
    },
    {
      id: 6,
      title: "FreshChain",
      description: "FreshChain: Sistem Distribusi Pangan\nLokal untuk Mengurangi Food Loss dalam Mendukung Sustainable Food\nSystem ,Solusi End-to-End Crowdfunding dan Marketplace Pertanian",
      image: "https://res.cloudinary.com/dpjwfljvc/image/upload/v1781460340/portfolio/projects/xhdpt7c6oxdzmjqrtlf0.jpg",
      link: "https://freshchain.vercel.app/",
      category: [
        "Web Dev",
        "Crowdfunding",
        "Marketplace"
      ],
      technologies: [
        "Next.js",
        "MonggoDB",
        "Cloudenary"
      ],
      featured: false,
      monthCreated: "Februari",
      yearCreated: "2025",
      testimonial: "Platform crowdfunding pertanian yang sangat inovatif untuk mendukung petani lokal."
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CEO at TechCorp",
      quote: "Pengerjaan yang sangat profesional dan hasil yang memuaskan. Komunikasi yang baik selama proses pengembangan.",
      avatar: "/assets/testimonials/avatar1.svg"
    },
    {
      id: 2,
      name: "David Chen",
      position: "Product Manager",
      quote: "Website kami menjadi lebih modern dan performa yang sangat baik. Sangat merekomendasikan jasanya!",
      avatar: "/assets/testimonials/avatar2.svg"
    },
    {
      id: 3,
      name: "Amanda Torres",
      position: "Marketing Director",
      quote: "Hasil pengerjaan sesuai dengan ekspektasi dan tepat waktu. Sangat membantu dalam transformasi digital bisnis kami.",
      avatar: "/assets/testimonials/avatar3.svg"
    }
  ],
  blogPosts: [
    {
      id: 1,
      title: "Getting Started with Next.js",
      excerpt: "Learn how to build modern web applications with Next.js",
      content: "Next.js is a powerful framework for building React applications...",
      date: "2025-09-05",
      author: "Irfan Syahputra",
      image: "/assets/blog/nextjs.svg",
      category: "Web Development"
    }
  ]
};
