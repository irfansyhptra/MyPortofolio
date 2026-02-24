import React from "react";
import Link from "next/link";
import Image from "next/image";
import { blogPosts, BlogPost } from "../data/mockData";
import ScrollAnimation from "@/app/components/ScrollAnimation";

const BlogPage = () => {
  return (
    <div className="pt-24">
      <section className="py-16 px-4 bg-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Tulisan <span className="gradient-text">Terbaru</span>
            </h1>
            <p className="text-dark-300 max-w-3xl mx-auto">
              Berbagi pemikiran, panduan, dan tren terbaru seputar pengembangan
              web dan teknologi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post: BlogPost, index: number) => (
              <ScrollAnimation key={post.id} delay={index * 0.1}>
                <div className="card overflow-hidden h-full flex flex-col">
                  <Link href={`/blog/${post.id}`}>
                    <div className="relative h-60 w-full">
                      <Image
                        src={post.image}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-primary-400 mb-2">
                      {post.category}
                    </p>
                    <h2 className="text-xl font-semibold mb-3 flex-grow">
                      <Link
                        href={`/blog/${post.id}`}
                        className="hover:text-primary-300 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-dark-300 mb-4">{post.excerpt}</p>
                    <p className="text-sm text-dark-400 mt-auto">{post.date}</p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-dark-950">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Punya Ide Proyek?</h2>
          <p className="text-dark-300 mb-8">
            Mari wujudkan ide Anda menjadi solusi digital yang luar biasa.
          </p>
          <Link
            href="/contact"
            className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-md hover:shadow-lg transition duration-300"
          >
            Hubungi Saya
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
