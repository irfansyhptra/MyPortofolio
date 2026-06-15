"use client";

import React, { useEffect, useState, useRef } from "react";
import { useBgm } from "./BgmContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlignLeft, FiMusic } from "react-icons/fi";

interface LyricLine {
  time: number;
  text: string;
}

const lyricsData: LyricLine[] = [
  { time: 0.70, text: "Bye-bye" },
  { time: 3.10, text: "Boy, bye, hmm" },
  { time: 8.20, text: "Hmm" },
  { time: 11.70, text: "Bye-bye" },
  { time: 13.30, text: "Boy, bye" },
  { time: 15.10, text: "It's over, it's over, oh yeah" },
  { time: 17.70, text: "This ain't the first time I've been hostage to these tears" },
  { time: 21.50, text: "I can't believe I'm finally movin' through my fears" },
  { time: 25.80, text: "At least, I know how hard we tried, both you and me" },
  { time: 30.30, text: "Didn't we? Didn't we?" },
  { time: 34.00, text: "So I grab my stuff" },
  { time: 36.20, text: "Courtney just pulled up in the driveway" },
  { time: 40.70, text: "It's time" },
  { time: 44.10, text: "Bye-bye" },
  { time: 46.10, text: "Boy, bye" },
  { time: 48.20, text: "Bye-bye" },
  { time: 50.00, text: "It's over, it's over, oh yeah" },
  { time: 52.70, text: "Bye-bye" },
  { time: 54.40, text: "I'm takin' what's mine, yeah" },
  { time: 56.90, text: "Bye-bye" },
  { time: 58.60, text: "It's over, it's over, oh yeah" },
  { time: 61.67, text: "You know, I'm stronger than I think" },
  { time: 65.59, text: "Usually, I'd join you on the floor, but this dance ain't for me" },
  { time: 70.00, text: "Boy, just turn the music up" },
  { time: 72.17, text: "Maybe, someday we'll look back with love" },
  { time: 74.55, text: "Didn't think you'd lose me" },
  { time: 76.86, text: "Now it's just too late to choose me" },
  { time: 78.36, text: "So I grab my stuff" },
  { time: 79.96, text: "Courtney just pulled up in the driveway" },
  { time: 84.36, text: "It's time (it's time)" },
  { time: 87.72, text: "Bye-bye" },
  { time: 89.99, text: "Boy, bye (boy, bye)" },
  { time: 92.13, text: "Bye-bye" },
  { time: 93.45, text: "It's over, it's over, oh yeah" },
  { time: 96.44, text: "Bye-bye" },
  { time: 97.88, text: "I'm takin' what's mine, yeah (takin' what's mine)" },
  { time: 100.83, text: "Bye-bye" },
  { time: 102.22, text: "It's over, it's over, oh yeah" },
  { time: 106.40, text: "Now it's certainly bittersweet" },
  { time: 111.10, text: "This hook feels too hard to sing" },
  { time: 116.20, text: "But it's better than repeat (than repeat, than repeat, than repeat)" },
  { time: 127.17, text: "Bye-bye (bye-bye)" },
  { time: 129.32, text: "Boy, bye (boy, bye)" },
  { time: 131.64, text: "Bye-bye" },
  { time: 132.83, text: "It's over, it's over, oh yeah (bye)" },
  { time: 135.71, text: "Bye-bye (bye-bye)" },
  { time: 137.50, text: "I'm takin' what's mine, yeah (takin' what's mine, ooh)" },
  { time: 140.12, text: "Bye-bye" },
  { time: 141.53, text: "It's over, it's over, oh yeah (ooh)" },
  { time: 144.47, text: "Bye-bye (bye-bye)" },
  { time: 146.96, text: "Boy, bye" },
  { time: 148.82, text: "Bye-bye" },
  { time: 150.33, text: "It's over, it's over, oh yeah (bye)" },
  { time: 153.49, text: "Bye-bye (bye-bye)" },
  { time: 154.79, text: "I'm takin' what's mine, yeah (I'm takin' what's mine)" },
  { time: 157.60, text: "Bye-bye" },
  { time: 159.03, text: "It's over, it's over, oh yeah" },
  { time: 164.00, text: "(Instrumental Outro)" }
];

export default function BgmLyricsWidget() {
  const { currentTime, isPlaying, seek } = useBgm();
  const [activeLineIdx, setActiveLineIdx] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const lottieRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  // Load Lottie animation dynamically on client-side
  useEffect(() => {
    let anim: any;
    import("lottie-web").then((LottieModule) => {
      const lottie = LottieModule.default;
      if (lottieRef.current) {
        lottieRef.current.innerHTML = "";
        anim = lottie.loadAnimation({
          container: lottieRef.current,
          renderer: "svg",
          loop: true,
          autoplay: isPlaying,
          path: "/assets/LottieFiles/Happy Spaceman.json",
        });
        animationRef.current = anim;
      }
    });

    return () => {
      if (anim) {
        anim.destroy();
      }
    };
  }, []);

  // Sync Lottie playback state with audio playing state
  useEffect(() => {
    if (animationRef.current) {
      if (isPlaying) {
        animationRef.current.play();
      } else {
        animationRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync active line based on current time
  useEffect(() => {
    if (lyricsData.length === 0) return;

    // Find current active index
    let activeIdx = -1;
    for (let i = 0; i < lyricsData.length; i++) {
      if (currentTime >= lyricsData[i].time) {
        activeIdx = i;
      } else {
        break;
      }
    }

    setActiveLineIdx(activeIdx);
  }, [currentTime]);

  // Center scroll the active line
  useEffect(() => {
    if (activeLineIdx !== -1 && linesRef.current[activeLineIdx] && containerRef.current) {
      const container = containerRef.current;
      const activeEl = linesRef.current[activeLineIdx];

      if (activeEl) {
        const activeOffsetTop = activeEl.offsetTop;
        const activeHeight = activeEl.offsetHeight;
        const containerHeight = container.offsetHeight;

        container.scrollTo({
          top: activeOffsetTop - containerHeight / 2 + activeHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeLineIdx]);

  const handleLineClick = (time: number) => {
    seek(time);
  };

  return (
    <div className="w-full h-full flex flex-col select-none">
      {/* Widget Header */}
      <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-cream-border">
        <FiAlignLeft className="text-charcoal-muted text-[10px] sm:text-xs" />
        <span className="text-[9px] font-mono uppercase tracking-wider text-charcoal-muted/80 font-bold">
          Lyrics
        </span>
        {isPlaying && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#d10000] animate-pulse ml-auto" />
        )}
      </div>

      {/* Main Content Layout (2:1 Ratio Split) */}
      <div className="flex-1 flex flex-row min-h-0 gap-3">
        {/* Left Column: Lyrics (2/3 width) */}
        <div className="w-2/3 flex flex-col min-h-0 relative">
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto no-scrollbar scroll-smooth py-4 flex flex-col items-center gap-3 relative h-full w-full"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, white 25%, white 75%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, white 25%, white 75%, transparent 100%)",
            }}
          >
            {lyricsData.map((line, idx) => {
              const isActive = activeLineIdx === idx;
              const isPassed = activeLineIdx > idx;
              const displayText = line.text || "•  •  •";

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    linesRef.current[idx] = el;
                  }}
                  onClick={() => handleLineClick(line.time)}
                  className={`text-center transition-all duration-300 cursor-pointer px-2 select-none leading-tight ${isActive
                    ? "text-charcoal font-bold text-sm sm:text-base md:text-lg scale-105"
                    : isPassed
                      ? "text-charcoal-muted/60 text-xs sm:text-sm font-medium hover:text-charcoal"
                      : "text-charcoal-muted/30 text-xs sm:text-sm font-medium hover:text-charcoal-muted"
                    }`}
                  style={{
                    textShadow: isActive ? "0 0 6px rgba(28, 28, 28, 0.15)" : "none",
                  }}
                >
                  {displayText}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Lottie Animation (1/3 width) */}
        <div className="w-1/3 flex items-center justify-center min-h-0 relative overflow-hidden">
          <div
            ref={lottieRef}
            className="w-full h-full max-h-[100px] flex items-center justify-center [&_svg]:max-h-full [&_svg]:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
