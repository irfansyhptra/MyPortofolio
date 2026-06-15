"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface BgmContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  seek: (time: number) => void;
}

const BgmContext = createContext<BgmContextType | null>(null);

export function BgmProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.4); // 40% default volume
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync volume and mute states to HTML audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Synchronize dynamic play/pause state from DOM
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Autoplay blocked or play failed. Interaction needed.", err);
        });
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const setVolume = (v: number) => {
    const val = Math.max(0, Math.min(1, v));
    setVolumeState(val);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    // Restart audio when it ends for looping backsound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  return (
    <BgmContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        currentTime,
        duration,
        togglePlay,
        toggleMute,
        setVolume,
        seek,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src="/assets/backsound.mp3"
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
        loop
      />
    </BgmContext.Provider>
  );
}

export function useBgm() {
  const context = useContext(BgmContext);
  if (!context) {
    throw new Error("useBgm must be used within a BgmProvider");
  }
  return context;
}
