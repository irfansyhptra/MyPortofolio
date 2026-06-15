"use client";

import React from "react";
import { useAdmin } from "./AdminContext";
import { Card, PageHeader } from "./components/AdminUI";
import Link from "next/link";

export default function AdminDashboard() {
  const { siteData, loading } = useAdmin();

  if (loading || !siteData) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-white/40 animate-pulse">Loading...</span>
      </div>
    );
  }

  const quickStats = [
    {
      label: "Projects",
      value: siteData.projects.length,
      icon: "🚀",
      href: "/admin/projects",
      color: "from-[#d10000]/20 to-[#ff4500]/20",
    },
    {
      label: "Services",
      value: siteData.services.length,
      icon: "💼",
      href: "/admin/services",
      color: "from-purple-500/20 to-blue-500/20",
    },
    {
      label: "Blog Posts",
      value: siteData.blogPosts.length,
      icon: "📝",
      href: "/admin/blog",
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      label: "Testimonials",
      value: siteData.testimonials.length,
      icon: "💬",
      href: "/admin/testimonials",
      color: "from-yellow-500/20 to-orange-500/20",
    },
    {
      label: "Skills",
      value: siteData.skills.length,
      icon: "⚡",
      href: "/admin/skills",
      color: "from-cyan-500/20 to-teal-500/20",
    },
    {
      label: "Education",
      value: (siteData.educations || []).length,
      icon: "🎓",
      href: "/admin/education",
      color: "from-indigo-500/20 to-blue-500/20",
    },
    {
      label: "Experience",
      value: siteData.experiences.length,
      icon: "📋",
      href: "/admin/experience",
      color: "from-pink-500/20 to-rose-500/20",
    },
    {
      label: "Organization",
      value: (siteData.organizations || []).length,
      icon: "🏛️",
      href: "/admin/organization",
      color: "from-amber-500/20 to-orange-500/20",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your portfolio content"
      />

      {/* Profile Summary */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#d10000]/20 flex items-center justify-center text-2xl flex-shrink-0">
            👤
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">
              {siteData.profile.name}
            </h2>
            <p className="text-sm text-white/50">{siteData.profile.role}</p>
            <p className="text-xs text-white/30 mt-1 truncate">
              {siteData.profile.email} • {siteData.profile.location}
            </p>
          </div>
          <Link
            href="/admin/profile"
            className="text-sm text-[#d10000] hover:text-[#ff4500] font-medium transition-colors"
          >
            Edit →
          </Link>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 mb-6">
        {quickStats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:border-white/20 transition-colors cursor-pointer h-full">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3`}
              >
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-sm font-medium text-white/60 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Edit Hero Section", href: "/admin/hero", icon: "🏠" },
            { label: "Add New Project", href: "/admin/projects", icon: "➕" },
            { label: "Write Blog Post", href: "/admin/blog", icon: "✍️" },
            { label: "Update Skills", href: "/admin/skills", icon: "⚡" },
            { label: "Manage Education", href: "/admin/education", icon: "🎓" },
            { label: "Manage Organization", href: "/admin/organization", icon: "🏛️" },
            { label: "Edit Contact Info", href: "/admin/contact", icon: "📞" },
            { label: "View Live Site", href: "/", icon: "🌐" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.href === "/" ? "_blank" : undefined}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              <span className="text-lg">{action.icon}</span>
              <span className="text-sm text-white/70">{action.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
