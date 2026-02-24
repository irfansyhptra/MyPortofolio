"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { testimonials } from "@/app/data/mockData";
import ScrollAnimation from "@/app/components/ScrollAnimation";

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-dark-900">
      <div className="container mx-auto">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Apa Kata <span className="gradient-text">Klien Kami</span>
            </h2>
            <p className="text-dark-300 max-w-2xl mx-auto">
              Pendapat mereka yang telah mempercayakan proyeknya kepada kami.
            </p>
          </div>
        </ScrollAnimation>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index: number) => (
            <ScrollAnimation key={testimonial.id} delay={index * 0.1}>
              <motion.div
                className="card p-8 h-full flex flex-col"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-dark-300 mb-6 flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-dark-400">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              </motion.div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
