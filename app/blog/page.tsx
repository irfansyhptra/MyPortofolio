"use client";
import React from "react";
import Link from "next/link";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import { useData } from "@/app/components/DataContext";
import SplitText from "@/app/components/SplitText";

export default function BlogPage() {
  const { data } = useData();
  const { blogPosts } = data;
  return (
    <div className="w-full min-h-screen py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col gap-4 sm:gap-5">
      
      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Header Box (Full width) */}
        <div className="lg:col-span-3 card-minimal p-8 sm:p-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted block mb-3">
              Blog & Jurnal
            </span>
            <SplitText
              text="Tulisan Terbaru"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-1.5px] text-charcoal leading-none mb-6"
              delay={35}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              textAlign="left"
            />
            <p className="text-charcoal-muted text-sm sm:text-base max-w-2xl leading-relaxed">
              Berbagi pemikiran, panduan teknis, dan tren terbaru seputar pengembangan web modern, arsitektur sistem, dan teknologi.
            </p>
          </div>
        </div>

        {/* Blog Post Cards (3 Columns) */}
        {blogPosts.map((post) => (
          <div 
            key={post.id} 
            className="group flex flex-col bg-cream-light rounded-xl border border-cream-border overflow-hidden transition-all duration-300 hover:border-charcoal-border hover:shadow-sm h-full justify-between"
          >
            <div>
              {/* Blog Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-cream border-b border-cream-border">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                {post.category && (
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-cream-light/95 border border-cream-border text-charcoal px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-muted font-mono mb-2">
                  <FiCalendar /> {post.date}
                </div>
                <h3 className="text-lg font-bold text-charcoal leading-snug group-hover:text-charcoal transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-charcoal-muted text-xs sm:text-sm mt-3 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>
            
            {/* Footer read link */}
            <div className="p-6 pt-0 mt-auto">
              <div className="pt-4 border-t border-cream-border flex items-center justify-between">
                <span className="text-[10px] font-mono text-charcoal-muted">
                  Oleh: {post.author || "Irfan"}
                </span>
                <Link
                  href="/blog"
                  className="text-xs font-semibold text-charcoal hover:underline inline-flex items-center gap-1"
                >
                  Baca Selengkapnya <FiArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Bottom CTA Box (Full width) */}
        <div className="lg:col-span-3 card-minimal p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-cream-light mt-4">
          <h3 className="text-2xl font-bold text-charcoal mb-4">Ingin berdiskusi lebih lanjut?</h3>
          <p className="text-charcoal-muted text-sm max-w-xl leading-relaxed mb-8">
            Saya selalu terbuka untuk berdiskusi tentang teknologi baru, arsitektur kode, atau rencana proyek masa depan Anda.
          </p>
          <Link href="/contact" className="btn-primary-dark px-8 py-3">
            Hubungi Saya <FiArrowRight className="ml-2" />
          </Link>
        </div>

      </div>
    </div>
  );
}
