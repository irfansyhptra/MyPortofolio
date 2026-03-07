import fs from "fs";
import path from "path";

// ─── Types ───────────────────────────────────────────
export interface SiteProfile {
  name: string;
  role: string;
  bio: string;
  journeyText: string;
  photo: string;
  cv: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    twitter: string;
  };
}

export interface HeroData {
  greeting: string;
  name: string;
  role: string;
  description: string;
  rotatingTexts: string[];
}

export interface StatItem {
  value: number;
  label: string;
  suffix?: string;
}

export interface SkillItem {
  name: string;
  level: number;
  category: string;
}

export interface ExperienceItem {
  id: number;
  position: string;
  company: string;
  period: string;
  description: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface WorkProcessItem {
  step: number;
  title: string;
  description: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  category: string[];
  technologies: string[];
  featured?: boolean;
}

export interface TestimonialItem {
  id: number;
  name: string;
  position: string;
  quote: string;
  avatar: string;
}

export interface BlogPostItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category?: string;
}

export interface SiteData {
  profile: SiteProfile;
  hero: HeroData;
  stats: StatItem[];
  skills: SkillItem[];
  experiences: ExperienceItem[];
  services: ServiceItem[];
  workProcess: WorkProcessItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  blogPosts: BlogPostItem[];
}

// ─── File path ───────────────────────────────────────
const DATA_FILE = path.join(process.cwd(), "app", "data", "siteData.json");

// ─── Read ────────────────────────────────────────────
export function getSiteData(): SiteData {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as SiteData;
  } catch {
    throw new Error("Failed to read siteData.json");
  }
}

// ─── Write ───────────────────────────────────────────
export function writeSiteData(data: SiteData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ─── Section helpers ─────────────────────────────────
export function getSection<K extends keyof SiteData>(key: K): SiteData[K] {
  return getSiteData()[key];
}

export function updateSection<K extends keyof SiteData>(
  key: K,
  value: SiteData[K]
): void {
  const data = getSiteData();
  data[key] = value;
  writeSiteData(data);
}
