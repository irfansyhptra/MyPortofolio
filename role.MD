# 🎯 Role Prompt — Portfolio Content Generator

> File ini digunakan sebagai prompt context untuk AI dalam men-generate konten kompleks website portfolio Irfan Syahputra.

---

## 📋 Identitas & Persona

```
Nama         : Irfan Syahputra
Role         : Full Stack Developer
Lokasi       : Jakarta, Indonesia
Email        : kontak@irfansyahputra.com
Telepon      : +62 812 3456 7890
Website      : irfansyahputra.com
Brand Color  : #d10000 (Primary Red), #ff4500 (Secondary Orange)
Font         : Poppins
Bahasa Utama : Bahasa Indonesia (konten), English (technical terms)
```

---

## 🏗️ Arsitektur Website

### Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom CSS variables
- **Animations:** Framer Motion, GSAP, Three.js (3D)
- **UI Components:** Custom (StarBorder, GlareHover, MagicBento, FloatingLines, Lanyard 3D)
- **Icons:** react-icons (Simple Icons)
- **Deployment:** Vercel

### Struktur Route
```
/                → Home (Hero + LogoLoop + MagicBento + Featured Projects)
/about           → About (Perkenalan + Skills + Pengalaman)
/portfolio       → Portfolio (Filter + Grid proyek)
/portfolio/[id]  → Detail proyek
/services        → Layanan (Services + Proses Kerja + CTA)
/blog            → Blog (Daftar artikel)
/contact         → Contact (Info kontak + Form)
/admin           → Admin Dashboard (CRUD semua konten)
```

### Sistem Data
- Data disimpan di `app/data/siteData.json` (server-side JSON file)
- Admin dashboard menggunakan API routes (`/api/admin/*`) untuk CRUD
- Komponen publik membaca data via server-side read (getServerSideData)
- Upload gambar disimpan di `public/uploads/`

---

## 📝 Panduan Generate Konten per Section

### 1. Hero Section (`/` — Home)
**Tujuan:** First impression, menampilkan identitas & value proposition.

**Konten yang diperlukan:**
- `heroTitle`: Greeting singkat (max 8 kata). Contoh: "I'm Ready For Job"
- `heroName`: Nama lengkap. "I'm Irfan Syahputra"
- `heroRole`: Role utama. "Full Stack Developer"
- `heroDescription`: Tagline (max 15 kata). "Crafting seamless web experiences with React, Node.js, and beyond."
- `heroRotatingTexts`: Array 4 kata untuk rotating text. ["React", "Next.js", "Is", "Cool!"]

**Tone:** Percaya diri, modern, profesional tapi tidak kaku.

---

### 2. About Page (`/about`)
**Tujuan:** Ceritakan perjalanan profesional, tunjukkan keahlian teknis.

**Konten yang diperlukan:**
- `aboutTitle`: Judul halaman. "Perkenalkan, Saya Developer Web"
- `aboutDescription`: Paragraf perkenalan (2-3 kalimat).
- `aboutJourney`: Cerita perjalanan karir (2-3 paragraf, ~150 kata).
- `skills`: Array skill dengan level (0-100).
  ```json
  { "name": "React.js", "level": 92, "category": "Frontend" }
  ```
- `experiences`: Array pengalaman kerja.
  ```json
  {
    "position": "Senior Frontend Developer",
    "company": "TechSolutions Inc.",
    "period": "2023 - Sekarang",
    "description": "Deskripsi tanggung jawab (2-3 kalimat)"
  }
  ```

**Tone:** Naratif, humble tapi tetap menunjukkan kompetensi.

---

### 3. Projects / Portfolio (`/portfolio`)
**Tujuan:** Showcase proyek terbaik, tunjukkan range kemampuan.

**Konten yang diperlukan per proyek:**
```json
{
  "id": 1,
  "title": "Nama Proyek (max 5 kata)",
  "description": "Deskripsi mendalam (150-250 kata). Jelaskan: masalah yang diselesaikan, pendekatan teknis, fitur utama, dan hasil/impact.",
  "image": "/uploads/projects/nama-file.jpg",
  "link": "https://live-url.com",
  "github": "https://github.com/repo",
  "category": ["Web Development", "E-Commerce"],
  "technologies": ["Next.js", "Node.js", "MongoDB", "Stripe"],
  "featured": true,
  "completedDate": "2025-06-15"
}
```

**Panduan deskripsi proyek:**
1. **Paragraf 1:** Konteks & masalah yang diselesaikan
2. **Paragraf 2:** Solusi teknis & arsitektur
3. **Paragraf 3:** Fitur utama & hasil yang dicapai

**Kategori yang tersedia:** Web Development, Frontend, Backend, Full Stack, Mobile, E-Commerce, 3D Graphics, AI/ML, API, Blockchain

---

### 4. Services (`/services`)
**Tujuan:** Jelaskan layanan yang ditawarkan, proses kerja, dan CTA.

**Konten yang diperlukan:**
- `services`: Array layanan.
  ```json
  {
    "id": 1,
    "title": "Web Development",
    "description": "Deskripsi layanan (2-3 kalimat). Fokus pada value untuk klien, bukan fitur teknis.",
    "icon": "💻",
    "features": ["Feature 1", "Feature 2", "Feature 3"]
  }
  ```
- `workProcess`: Array proses kerja (5 step).
  ```json
  {
    "step": 1,
    "title": "Discovery & Konsultasi",
    "description": "Deskripsi (1-2 kalimat)"
  }
  ```

**Tone:** Profesional, client-oriented, meyakinkan.

---

### 5. Blog Posts (`/blog`)
**Tujuan:** Tunjukkan thought leadership, bagikan pengetahuan teknis.

**Konten yang diperlukan per artikel:**
```json
{
  "id": 1,
  "title": "Judul Menarik (SEO-friendly, max 10 kata)",
  "excerpt": "Ringkasan (1-2 kalimat, max 30 kata)",
  "content": "Konten lengkap dalam format Markdown. Min 500 kata.",
  "date": "2025-09-05",
  "author": "Irfan Syahputra",
  "image": "/uploads/blog/nama-file.jpg",
  "category": "Web Development",
  "tags": ["nextjs", "react", "tutorial"]
}
```

**Topik yang relevan:**
- Tutorial framework modern (Next.js, React, Vue)
- Best practices (clean code, performance, SEO)
- Case study dari proyek
- Tren teknologi web terbaru

---

### 6. Testimonials
**Tujuan:** Social proof dari klien.

**Konten yang diperlukan:**
```json
{
  "id": 1,
  "name": "Nama Klien",
  "position": "Jabatan di Perusahaan",
  "quote": "Testimonial (2-3 kalimat, natural & spesifik)",
  "avatar": "/uploads/testimonials/avatar.jpg",
  "rating": 5,
  "projectId": 1
}
```

**Panduan quote:** Spesifik (sebutkan apa yang dilakukan), autentik (bukan generik), dan highlight value yang diberikan.

---

### 7. Contact Info (`/contact`)
**Tujuan:** Memudahkan calon klien menghubungi.

**Konten yang diperlukan:**
```json
{
  "phone": "+62 812 3456 7890",
  "email": "kontak@irfansyahputra.com",
  "location": "Jakarta, Indonesia",
  "socialLinks": {
    "github": "https://github.com/irfansyhptra",
    "linkedin": "https://linkedin.com/in/irfansyahputra",
    "instagram": "https://instagram.com/irfansyahputra",
    "twitter": "https://twitter.com/irfansyahputra"
  },
  "availability": "Tersedia untuk proyek freelance & full-time"
}
```

---

### 8. Stats
**Tujuan:** Quantify achievements, quick credibility.

**Konten:**
```json
[
  { "value": 50, "label": "Projects Completed", "suffix": "+" },
  { "value": 95, "label": "Client Satisfaction", "suffix": "%" },
  { "value": 5, "label": "Years Experience", "suffix": "+" },
  { "value": 100, "label": "Code Reviews", "suffix": "+" }
]
```

---

## 🎨 Design Guidelines

### Typography
- **Heading:** Poppins Bold/Semibold, size responsive (text-2xl → text-5xl)
- **Body:** Poppins Regular, text-sm → text-base
- **Accent text:** Gradient text (gradient-text class)

### Color Palette
```
Primary:      #d10000 (Red)
Primary Alt:  #ff4500 (Orange-Red)
Background:   #000000
Surface:      rgba(0,0,0,0.4) with border-white/[0.08]
Text Primary: #f3f4f6
Text Muted:   rgba(255,255,255,0.4-0.5)
Glass:        backdrop-blur + bg-black/80 + border-white/10
```

### Component Patterns
- **Cards:** Rounded-2xl, border-white/[0.08], bg-black/40, backdrop-blur-sm
- **Badges:** Rounded-full, bg-primary/10, text-primary, border-primary/20
- **Buttons CTA:** bg-gradient-primary, rounded-xl, hover:shadow glow effect
- **Section spacing:** py-16 (mobile) → py-28 (desktop)
- **Container:** max-w-7xl mx-auto px-4

### Animation Rules
- **Scroll reveal:** opacity 0→1, y 40→0, stagger 0.1-0.15s
- **Hover:** scale 1.02, y -10, color transitions
- **Page transitions:** Framer Motion variants
- **3D elements:** Three.js only on hero (Lanyard)

### Responsive Breakpoints
```
Mobile:    < 640px  (default / base)
SM:        640px+   (sm:)
MD:        768px+   (md:)
LG:        1024px+  (lg:)
XL:        1280px+  (xl:)
```

---

## 🔒 Admin Dashboard

### Fitur Admin (`/admin`)
1. **Dashboard Overview** — Quick stats, recent activity
2. **Profile** — Edit nama, role, bio, foto, social links
3. **Projects** — CRUD proyek, upload gambar, reorder
4. **Services** — CRUD layanan
5. **Blog** — CRUD artikel (markdown editor)
6. **Testimonials** — CRUD testimonial
7. **Skills** — CRUD skill & level
8. **Experience** — CRUD pengalaman kerja
9. **Stats** — Edit angka statistik
10. **Contact** — Edit info kontak
11. **Settings** — Hero content, SEO, general settings

### Admin Authentication
- Simple password protection (environment variable)
- Session via localStorage token

---

## 📌 Instruksi untuk AI

Ketika diminta generate konten untuk website ini:

1. **Bahasa:** Gunakan Bahasa Indonesia untuk konten yang ditampilkan ke pengunjung. Gunakan English untuk technical terms, variable names, dan code.
2. **Tone:** Profesional, modern, percaya diri tapi tidak arogan. Target audience: recruiter, calon klien, sesama developer.
3. **Format:** Sesuaikan dengan interface JSON yang sudah didefinisikan di `mockData.ts`.
4. **Gambar:** Referensikan path yang benar (`/uploads/[category]/filename.ext`).
5. **Konsistensi:** Pastikan kategori, teknologi, dan style penulisan konsisten di seluruh konten.
6. **SEO:** Title < 60 chars, description < 160 chars, gunakan keyword relevan.
7. **Realisme:** Buat konten yang realistis dan bisa digunakan langsung, bukan placeholder.
