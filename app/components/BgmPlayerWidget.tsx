"use client";

import React from "react";
import { useBgm } from "./BgmContext";
import { motion } from "framer-motion";
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMusic } from "react-icons/fi";

export default function BgmPlayerWidget() {
  const {
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    setVolume,
    seek,
  } = useBgm();

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // 8 bouncing bars for the equalizer
  const eqBars = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="w-full flex flex-row items-center gap-4 sm:gap-6 justify-between h-full p-0">
      {/* Left Column: Rotating Vinyl Record / CD */}
      <div className="relative flex-shrink-0">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#141414] to-[#2e2e2e] shadow-2xl border border-charcoal-border/30 flex items-center justify-center overflow-hidden">
          {/* Groove concentric circles */}
          <div className="absolute inset-1.5 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute inset-3 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute inset-4.5 rounded-full border border-white/5 pointer-events-none" />

          {/* Inner vinyl sticker label with spin animation */}
          <div
            className="w-full h-full rounded-full flex items-center justify-center bg-transparent animate-[spin_8s_linear_infinite]"
            style={{
              animationPlayState: isPlaying ? "running" : "paused",
            }}
          >
            {/* Artistic label background */}
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#d10000] border-[2px] border-[#111] flex items-center justify-center">
              <FiMusic className="text-cream text-xs animate-pulse" />
            </div>
          </div>

          {/* Center spindle hole */}
          <div className="absolute w-1.5 h-1.5 rounded-full bg-cream border border-charcoal shadow-inner" />
        </div>

        {/* Small floating playing indicator */}
        {isPlaying && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d10000] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#d10000] text-[9px] text-white font-bold items-center justify-center font-mono">
              ♪
            </span>
          </span>
        )}
      </div>

      {/* Middle/Right Column: Track Title, Controls, Progress */}
      <div className="flex-1 w-full min-w-0 flex flex-col justify-between h-full gap-2 py-1">
        {/* Track details & Equalizer */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-charcoal font-sans uppercase tracking-wider line-clamp-1">
              PLAY MY MUSIC
            </h3>
            <p className="text-[10px] sm:text-xs text-charcoal-muted truncate font-mono mt-0.5">
              Playing: Ariana Grande - bye [Altare Remix]
            </p>
          </div>

          {/* Equalizer animation */}
          <div className="flex items-end gap-[2px] h-5 flex-shrink-0">
            {eqBars.map((i) => {
              const bounceDuration = 0.5 + i * 0.08;
              const delay = i * 0.05;

              return (
                <motion.div
                  key={i}
                  animate={{
                    height: isPlaying
                      ? [3, 14, 6, 18, 10, 3]
                      : 3
                  }}
                  transition={{
                    duration: bounceDuration,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut"
                  }}
                  className="w-[2.5px] rounded-t bg-[#d10000]"
                />
              );
            })}
          </div>
        </div>

        {/* Progress seek bar */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1 bg-cream-border/50 rounded-lg appearance-none cursor-pointer accent-[#d10000] transition-all hover:bg-cream-border"
          />
          <div className="flex justify-between items-center text-[9px] font-mono font-bold text-charcoal-muted leading-none">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls row: Play, Mute, Volume */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-charcoal hover:bg-[#d10000] text-cream flex items-center justify-center transition-all shadow-md active:scale-95 group"
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isPlaying ? (
                <FiPause className="text-xs transition-transform group-hover:scale-110" />
              ) : (
                <FiPlay className="text-xs ml-0.5 transition-transform group-hover:scale-110" />
              )}
            </button>
            <span className="text-[10px] font-mono font-bold text-charcoal-muted">
              {isPlaying ? "PLAYING" : "PAUSED"}
            </span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5 max-w-[100px] w-full">
            <button
              onClick={toggleMute}
              className="text-charcoal-muted hover:text-charcoal transition-colors p-1"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <FiVolumeX className="text-xs" />
              ) : (
                <FiVolume2 className="text-xs" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-cream-border/50 rounded-lg appearance-none cursor-pointer accent-charcoal transition-all hover:bg-cream-border"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
