"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxSectionProps {
  children: ReactNode;
  /** Parallax speed: negative = slower, positive = faster than scroll. Range: -0.5 to 0.5 */
  speed?: number;
  /** Additional class */
  className?: string;
  /** Scrub smoothness (true = instant, number = lerp seconds) */
  scrub?: boolean | number;
  /** Whether to add overflow hidden */
  overflow?: boolean;
  /** Direction of parallax */
  direction?: "vertical" | "horizontal";
  /** Scale on scroll (e.g., 1.1 for zoom effect) */
  scale?: number;
  /** Opacity fade based on scroll position */
  fade?: boolean;
  /** HTML tag */
  as?: keyof React.JSX.IntrinsicElements;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.2,
  className = "",
  scrub = 1,
  overflow = false,
  direction = "vertical",
  scale,
  fade = false,
  as: Tag = "div",
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const content = contentRef.current;
    if (!trigger || !content) return;

    const distance = speed * 200;
    const axis = direction === "vertical" ? "y" : "x";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "top bottom",
        end: "bottom top",
        scrub: typeof scrub === "number" ? scrub : scrub ? 0.5 : false,
      },
    });

    const fromVars: gsap.TweenVars = { [axis]: -distance };
    const toVars: gsap.TweenVars = { [axis]: distance, ease: "none" };

    if (scale) {
      fromVars.scale = scale;
      toVars.scale = 1;
    }

    if (fade) {
      fromVars.opacity = 0.3;
      toVars.opacity = 1;
    }

    tl.fromTo(content, fromVars, toVars);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === trigger) t.kill();
      });
    };
  }, [speed, scrub, direction, scale, fade]);

  return (
    <div
      ref={triggerRef}
      className={`${overflow ? "overflow-hidden" : ""} ${className}`}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

export default ParallaxSection;
