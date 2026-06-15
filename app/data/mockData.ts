import { defaultSiteData } from "./defaultSiteData";

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
  monthCreated?: string;
  yearCreated?: string;
  testimonial?: string;
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

// ─── Fallbacks point to defaultSiteData constant ───
export const testimonials: Testimonial[] = defaultSiteData.testimonials;
export const services: Service[] = defaultSiteData.services;
export const stats: Stats[] = defaultSiteData.stats;
export const blogPosts: BlogPost[] = defaultSiteData.blogPosts;
export const projects: Project[] = defaultSiteData.projects;
export const workProcess: WorkProcess[] = defaultSiteData.workProcess;
export const skills: Skill[] = defaultSiteData.skills;
export const experiences: Experience[] = defaultSiteData.experiences;
export const profile = defaultSiteData.profile;
export const hero = defaultSiteData.hero;
