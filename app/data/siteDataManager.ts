import { defaultSiteData } from "./defaultSiteData";

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
  image?: string;
}

export interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  period: string;
  description: string;
  image?: string;
}

export interface OrganizationItem {
  id: number;
  name: string;
  role: string;
  period: string;
  description: string;
  image?: string;
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
  monthCreated?: string;
  yearCreated?: string;
  testimonial?: string;
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
  educations: EducationItem[];
  experiences: ExperienceItem[];
  organizations: OrganizationItem[];
  services: ServiceItem[];
  workProcess: WorkProcessItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  blogPosts: BlogPostItem[];
}

// ─── Read ────────────────────────────────────────────
export function getSiteData(): SiteData {
  return defaultSiteData;
}

// ─── Write ───────────────────────────────────────────
// This is now a no-op since we write only to MongoDB
export function writeSiteData(data: SiteData): void {
  console.log("writeSiteData called (no-op as we write only to MongoDB)");
}

// ─── Section helpers ─────────────────────────────────
export function getSection<K extends keyof SiteData>(key: K): SiteData[K] {
  return defaultSiteData[key];
}

// This is now a no-op since updates go through MongoDB
export function updateSection<K extends keyof SiteData>(
  key: K,
  value: SiteData[K]
): void {
  console.log(`updateSection called for ${key} (no-op as we update only in MongoDB)`);
}
