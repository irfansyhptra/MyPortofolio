"use client";

import React from "react";
import { stats, Stats } from "@/app/data/mockData";
import CountUpAnimation from "@/app/components/CountUpAnimation";
import ScrollAnimation from "@/app/components/ScrollAnimation";

const StatsSection = () => {
  return (
    <section className="bg-dark-950 py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat: Stats, index: number) => (
            <ScrollAnimation key={index} delay={index * 0.1}>
              <div className="p-4">
                <h3 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  <CountUpAnimation endValue={stat.value} />
                  {stat.suffix || "+"}
                </h3>
                <p className="text-dark-300">{stat.label}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
