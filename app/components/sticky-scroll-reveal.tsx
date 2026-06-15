"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { FiCalendar } from "react-icons/fi";

export const StickyScroll = ({
  content,
  contentClassName,
  cardClassName,
  className,
}: {
  content: {
    title: React.ReactNode | string;
    subTitle?: React.ReactNode | string;
    period?: string;
    description: React.ReactNode | string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
  cardClassName?: string;
  className?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const handleCardClick = (index: number) => {
    if (!ref.current) return;
    const cardElements = ref.current.querySelectorAll(".sticky-scroll-item");
    if (cardElements && cardElements[index]) {
      cardElements[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-[26rem] justify-between items-start gap-8 overflow-y-auto no-scrollbar bg-transparent scroll-smooth",
        className
      )}
      ref={ref}
    >
      <div className="relative flex items-start w-full pr-2">
        {/* Timeline vertical line with animated scroll progress */}
        <div className="absolute left-[16px] md:left-[24px] top-6 bottom-12 w-[1.5px] bg-cream-border/40">
          <motion.div
            className="w-full h-full bg-[#d10000] origin-top"
            style={{ scaleY: scrollYProgress }}
          />
        </div>

        <div className="max-w-2xl w-full pl-10 md:pl-14">
          {content.map((item, index) => {
            const isActive = activeCard === index;
            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className="sticky-scroll-item my-24 first:mt-4 last:mb-24 relative group cursor-pointer select-none"
              >
                {/* Timeline Dot Indicator */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.3 : 1,
                    backgroundColor: isActive ? "#d10000" : "#fcfbf8",
                    borderColor: isActive ? "#d10000" : "var(--cream-border)",
                  }}
                  transition={{ duration: 0.25 }}
                  className="absolute -left-[30px] md:-left-[38px] top-1.5 w-3 h-3 rounded-full border-2 z-10"
                />

                {/* Period Badge / Year */}
                {item.period && (
                  <motion.div
                    animate={{ 
                      opacity: isActive ? 1 : 0.4,
                      x: isActive ? 0 : -2
                    }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold text-charcoal-muted mb-1"
                  >
                    <FiCalendar className="text-[10px]" />
                    {item.period}
                  </motion.div>
                )}

                {/* Title */}
                <motion.div
                  animate={{ 
                    opacity: isActive ? 1 : 0.4,
                    x: isActive ? 0 : -2
                  }}
                  transition={{ duration: 0.25 }}
                  className="text-base sm:text-lg font-bold text-charcoal leading-snug"
                >
                  {item.title}
                </motion.div>

                {/* Subtitle / Company / Institution */}
                {item.subTitle && (
                  <motion.div
                    animate={{ 
                      opacity: isActive ? 0.9 : 0.4,
                      x: isActive ? 0 : -2
                    }}
                    transition={{ duration: 0.25 }}
                    className="text-xs uppercase tracking-wider text-charcoal-muted font-semibold mt-0.5 font-mono"
                  >
                    {item.subTitle}
                  </motion.div>
                )}

                {/* Description */}
                <motion.div
                  animate={{ 
                    opacity: isActive ? 1 : 0.25,
                    y: isActive ? 0 : 3
                  }}
                  transition={{ duration: 0.25 }}
                  className="text-xs sm:text-sm mt-3 text-charcoal-muted leading-relaxed max-w-md"
                >
                  {item.description}
                </motion.div>
              </div>
            );
          })}
          <div className="h-60" />
        </div>
      </div>
      
      {/* Right side sticky card */}
      <div
        className={cn(
          "sticky top-2 hidden h-56 w-72 overflow-hidden rounded-xl border border-cream-border bg-cream-light lg:block flex-shrink-0 self-start shadow-sm",
          cardClassName,
        )}
      >
        {content[activeCard]?.content ?? null}
      </div>
    </div>
  );
};
