"use client";

import { useEffect, useState, useRef } from "react";

interface CountUpAnimationProps {
  endValue: number;
  duration?: number;
}

const CountUpAnimation: React.FC<CountUpAnimationProps> = ({
  endValue,
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animateCount = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = timestamp - startTime;
      const progressFraction = Math.min(progress / duration, 1);
      const currentValue = Math.floor(progressFraction * endValue);

      setCount(currentValue);

      if (progress < duration) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isVisible, endValue, duration]);

  return <span ref={ref}>{count}</span>;
};

export default CountUpAnimation;
