"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { blogPosts, BlogPost } from "../data/mockData";
import GSAPReveal from "@/app/components/GSAPReveal";
import ParallaxSection from "@/app/components/ParallaxSection";

const BlogPage = () => {
  return (
    <div className="pt-24">
      <section className="py-16 px-4 bg-dark-900">
        <div className="container mx-auto">
          {/* Title — Glitch entrance */}
          <GSAPReveal preset="glitch" duration={0.8}>
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                Tulisan <span className="gradient-text">Terbaru</span>
              </h1>
              <p className="text-dark-300 max-w-3xl mx-auto">
                Berbagi pemikiran, panduan, dan tren terbaru seputar pengembangan
                web dan teknologi.
              </p>
            </div>
          </GSAPReveal>

          {/* Blog cards — Scale-rotate stagger */}
          <GSAPReveal preset="scale-rotate" stagger={0.12} duration={0.9} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post: BlogPost) => (
              <div key={post.id} className="card overflow-hidden h-full flex flex-col group hover:border-primary/20 transition-all duration-500">
                <Link href={`/blog/${post.id}`}>
                  <div className="relative h-60 w-full overflow-hidden">
                    <ParallaxSection speed={-0.08} overflow>
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </ParallaxSection>
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-sm text-primary-400 mb-2">
                    {post.category}
                  </p>
                  <h2 className="text-xl font-semibold mb-3 flex-grow group-hover:text-primary transition-colors duration-300">
                    <Link href={`/blog/${post.id}`} className="hover:text-primary-300 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-dark-300 mb-4">{post.excerpt}</p>
                  <p className="text-sm text-dark-400 mt-auto">{post.date}</p>
                </div>
              </div>
            ))}
          </GSAPReveal>
        </div>
      </section>

      {/* CTA Section — Scale-up */}
      <section className="py-20 px-4 bg-dark-950">
        <div className="container mx-auto text-center">
          <GSAPReveal preset="scale-up" duration={1}>
            <h2 className="text-3xl font-bold mb-4">Punya Ide Proyek?</h2>
            <p className="text-dark-300 mb-8">
              Mari wujudkan ide Anda menjadi solusi digital yang luar biasa.
            </p>
            <Link
              href="/contact"
              className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 inline-block hover:-translate-y-1"
            >
              Hubungi Saya
            </Link>
          </GSAPReveal>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
