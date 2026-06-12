/**
 * Centralized Animation Variants Library
 *
 * Reusable Framer Motion animation configurations that can be imported and
 * composed across components (cards, buttons, sections, page wrappers, lists,
 * navigation, etc.). All timing, easing, and spring parameters are defined
 * explicitly here rather than relying on third-party animation presets.
 *
 * Conventions enforced by this module:
 * - Tween durations are constrained to the 0.3s - 2.0s range.
 * - Easing curves are custom cubic-bezier definitions with explicit control
 *   points, including anticipation (reverse motion) and follow-through
 *   (overshoot and settle).
 * - Spring physics use stiffness between 200-400 and damping between 15-30.
 * - Stagger delays are kept within 50ms - 300ms.
 *
 * Requirements: 8.1, 8.3, 8.4, 9.1, 9.2, 9.4, 11.5
 */

import type { Easing, TargetAndTransition, Transition } from 'framer-motion';

/**
 * Custom cubic-bezier easing curves with explicit control points
 * [x1, y1, x2, y2]. These replace named/library easing presets so that the
 * timing of every animation is defined and tunable in one place.
 */
export const easings = {
  /** Symmetric ease-in-out, balanced acceleration and deceleration. */
  standard: [0.42, 0, 0.58, 1] as Easing,
  /** Decelerate: fast start, gentle settle. Good for entrances. */
  decelerate: [0, 0, 0.2, 1] as Easing,
  /** Accelerate: gentle start, fast finish. Good for exits. */
  accelerate: [0.4, 0, 1, 1] as Easing,
  /** Emphasized ease-out with slight follow-through (settle past target). */
  emphasized: [0.22, 1, 0.36, 1] as Easing,
  /**
   * Anticipation + follow-through: pulls back below the start (y < 0) before
   * moving, then overshoots past the target (y > 1) and settles.
   */
  anticipate: [0.68, -0.55, 0.27, 1.55] as Easing,
} satisfies Record<string, Easing>;

/**
 * Tween durations in seconds. Constrained to the 0.3s - 2.0s range so that no
 * animation feels instantaneous or sluggish.
 */
export const durations = {
  fast: 0.3,
  medium: 0.5,
  base: 0.6,
  slow: 0.8,
  slower: 1.2,
} as const;

/**
 * Spring physics configurations for interactive (hover/tap) and natural-motion
 * animations. Stiffness is kept within 200-400 and damping within 15-30.
 */
export const springs = {
  /** Soft, slightly bouncy settle. */
  gentle: { type: 'spring', stiffness: 200, damping: 26 },
  /** Balanced response for most interactive elements. */
  responsive: { type: 'spring', stiffness: 300, damping: 20 },
  /** Quick, snappy feedback for taps and small UI affordances. */
  snappy: { type: 'spring', stiffness: 400, damping: 18 },
} satisfies Record<string, Transition>;

/**
 * Stagger timing for orchestrating multi-element animations. Delays are kept
 * within the 50ms - 300ms range between consecutive children.
 */
export const stagger = {
  staggerChildren: 0.1,
  delayChildren: 0.2,
} as const;

/**
 * A spreadable set of motion props. Spread onto a `motion.*` element to apply a
 * variant, e.g. `<motion.div {...fadeIn} />`.
 */
export interface MotionVariant {
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  exit?: TargetAndTransition;
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  transition?: Transition;
}

/** Simple opacity fade. Use for backgrounds, overlays, and text reveals. */
export const fadeIn: MotionVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: durations.base, ease: easings.standard },
};

/** Enter from below with fade. Use for section and card reveals. */
export const slideUp: MotionVariant = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: durations.slow, ease: easings.emphasized },
};

/** Enter from above with fade. Use for dropdowns and top-anchored content. */
export const slideDown: MotionVariant = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: durations.slow, ease: easings.emphasized },
};

/**
 * Scale up with fade, using the anticipation easing so the element overshoots
 * slightly and settles (follow-through). Use for modals and emphasis reveals.
 */
export const scaleIn: MotionVariant = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: durations.medium, ease: easings.anticipate },
};

/**
 * Orchestrates child animations with a staggered delay. Pair with children that
 * use a matching variant (e.g. `slideUp`) and a shared `variants` parent.
 */
export const staggerContainer: MotionVariant = {
  animate: {
    transition: {
      staggerChildren: stagger.staggerChildren,
      delayChildren: stagger.delayChildren,
    },
  },
};

/** Horizontal slide+fade for page-level entrance/exit transitions. */
export const pageTransition: MotionVariant = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: durations.fast, ease: easings.decelerate },
};

/**
 * Hover/tap micro-interaction driven by spring physics. Spread onto any
 * interactive element (button, link, card, icon button).
 */
export const hoverScale: MotionVariant = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: springs.responsive,
};

/**
 * All animation variants grouped for convenient namespaced import:
 * `import { animationVariants } from '@/app/lib/animation-variants'`.
 */
export const animationVariants = {
  fadeIn,
  slideUp,
  slideDown,
  scaleIn,
  staggerContainer,
  pageTransition,
  hoverScale,
} as const;

export type AnimationVariantName = keyof typeof animationVariants;
