import siteDataJson from "./siteData.json";

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
  image: string;
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
  featured?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  quote: string;
  avatar: string;
}

export interface WorkProcess {
  step: number;
  title: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface Experience {
  id: number;
  position: string;
  company: string;
  period: string;
  description: string;
}

// ─── All data comes from siteData.json (managed by admin) ───
export const testimonials: Testimonial[] = siteDataJson.testimonials;
export const services: Service[] = siteDataJson.services;
export const stats: Stats[] = siteDataJson.stats;
export const blogPosts: BlogPost[] = siteDataJson.blogPosts;
export const projects: Project[] = siteDataJson.projects;
export const workProcess: WorkProcess[] = siteDataJson.workProcess;
export const skills: Skill[] = siteDataJson.skills;
export const experiences: Experience[] = siteDataJson.experiences;
export const profile = siteDataJson.profile;
export const hero = siteDataJson.hero;
