"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Animation Presets ─────────────────────────── */
type RevealPreset =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-up"
  | "scale-rotate"
  | "clip-up"
  | "clip-left"
  | "clip-circle"
  | "skew-up"
  | "blur-in"
  | "flip-up"
  | "slide-rotate"
  | "elastic-scale"
  | "glitch"
  | "typewriter";

interface GSAPRevealProps {
  children: ReactNode;
  preset?: RevealPreset;
  /** Custom GSAP from-vars (overrides preset) */
  from?: gsap.TweenVars;
  /** Custom GSAP to-vars (overrides preset) */
  to?: gsap.TweenVars;
  duration?: number;
  delay?: number;
  ease?: string;
  /** Stagger delay when wrapping multiple children */
  stagger?: number;
  /** ScrollTrigger start position */
  start?: string;
  /** Run animation only once */
  once?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** HTML tag for wrapper */
  as?: keyof React.JSX.IntrinsicElements;
  /** Parallax speed (-1 = slow, 1 = fast relative to scroll) */
  parallaxSpeed?: number;
  /** Scrub: tie animation to scroll position */
  scrub?: boolean | number;
}

/* ─── Preset Configurations ─────────────────────── */
const getPresetVars = (
  preset: RevealPreset
): { from: gsap.TweenVars; to: gsap.TweenVars; ease: string } => {
  switch (preset) {
    case "fade-up":
      return {
        from: { opacity: 0, y: 80 },
        to: { opacity: 1, y: 0 },
        ease: "power3.out",
      };
    case "fade-down":
      return {
        from: { opacity: 0, y: -80 },
        to: { opacity: 1, y: 0 },
        ease: "power3.out",
      };
    case "fade-left":
      return {
        from: { opacity: 0, x: -100 },
        to: { opacity: 1, x: 0 },
        ease: "power3.out",
      };
    case "fade-right":
      return {
        from: { opacity: 0, x: 100 },
        to: { opacity: 1, x: 0 },
        ease: "power3.out",
      };
    case "scale-up":
      return {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
        ease: "back.out(1.7)",
      };
    case "scale-rotate":
      return {
        from: { opacity: 0, scale: 0.6, rotation: -15 },
        to: { opacity: 1, scale: 1, rotation: 0 },
        ease: "back.out(2)",
      };
    case "clip-up":
      return {
        from: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
        to: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
        ease: "power4.inOut",
      };
    case "clip-left":
      return {
        from: { clipPath: "inset(0% 100% 0% 0%)", opacity: 0 },
        to: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
        ease: "power4.inOut",
      };
    case "clip-circle":
      return {
        from: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
        to: { clipPath: "circle(100% at 50% 50%)", opacity: 1 },
        ease: "power2.out",
      };
    case "skew-up":
      return {
        from: { opacity: 0, y: 100, skewY: 7 },
        to: { opacity: 1, y: 0, skewY: 0 },
        ease: "power3.out",
      };
    case "blur-in":
      return {
        from: { opacity: 0, filter: "blur(20px)", y: 30 },
        to: { opacity: 1, filter: "blur(0px)", y: 0 },
        ease: "power2.out",
      };
    case "flip-up":
      return {
        from: { opacity: 0, rotationX: 90, transformPerspective: 1000 },
        to: { opacity: 1, rotationX: 0, transformPerspective: 1000 },
        ease: "power3.out",
      };
    case "slide-rotate":
      return {
        from: { opacity: 0, x: -60, rotation: -12 },
        to: { opacity: 1, x: 0, rotation: 0 },
        ease: "power3.out",
      };
    case "elastic-scale":
      return {
        from: { opacity: 0, scale: 0.3 },
        to: { opacity: 1, scale: 1 },
        ease: "elastic.out(1, 0.5)",
      };
    case "glitch":
      return {
        from: { opacity: 0, x: -20, skewX: -15 },
        to: { opacity: 1, x: 0, skewX: 0 },
        ease: "power4.out",
      };
    case "typewriter":
      return {
        from: { opacity: 0, x: -10 },
        to: { opacity: 1, x: 0 },
        ease: "steps(1)",
      };
    default:
      return {
        from: { opacity: 0, y: 60 },
        to: { opacity: 1, y: 0 },
        ease: "power3.out",
      };
  }
};

/* ─── Component ─────────────────────────────────── */
const GSAPReveal: React.FC<GSAPRevealProps> = ({
  children,
  preset = "fade-up",
  from: customFrom,
  to: customTo,
  duration = 1,
  delay = 0,
  ease: customEase,
  stagger = 0,
  start = "top 85%",
  once = true,
  className = "",
  as: Tag = "div",
  parallaxSpeed,
  scrub = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const presetVars = getPresetVars(preset);
    const fromVars = customFrom || presetVars.from;
    const toVars = customTo || presetVars.to;
    const easeVal = customEase || presetVars.ease;

    // Parallax mode — scrub-based y offset
    if (parallaxSpeed !== undefined) {
      gsap.fromTo(
        el,
        { y: parallaxSpeed * -100 },
        {
          y: parallaxSpeed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: typeof scrub === "number" ? scrub : 1,
          },
        }
      );
      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === el) t.kill();
        });
      };
    }

    // Stagger children mode
    if (stagger > 0 && el.children.length > 1) {
      gsap.set(el.children, fromVars);
      gsap.to(el.children, {
        ...toVars,
        duration,
        ease: easeVal,
        delay,
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once
            ? "play none none none"
            : "play reverse play reverse",
        },
      });
    } else {
      // Single element
      gsap.set(el, fromVars);

      const tweenVars: gsap.TweenVars = {
        ...toVars,
        duration,
        ease: easeVal,
        delay,
        scrollTrigger: scrub
          ? {
              trigger: el,
              start,
              end: "bottom 20%",
              scrub: typeof scrub === "number" ? scrub : 1,
            }
          : {
              trigger: el,
              start,
              toggleActions: once
                ? "play none none none"
                : "play reverse play reverse",
            },
      };

      gsap.to(el, tweenVars);
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
      gsap.killTweensOf(el);
      if (el.children.length > 1) {
        Array.from(el.children).forEach((child) => gsap.killTweensOf(child));
      }
    };
  }, [preset, duration, delay, customEase, stagger, start, once, scrub, parallaxSpeed, customFrom, customTo]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default GSAPReveal;
