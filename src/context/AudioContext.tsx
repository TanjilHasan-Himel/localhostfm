'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react';

interface TrackInfo {
  title: string;
  artist: string;
  cover: string;
}

type AudioMode = 'live' | 'scheduled';

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (value: number) => void;
  currentTrack: TrackInfo;
  setCurrentTrack: (track: TrackInfo) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioMode: AudioMode;
  nextScheduledTime: string | null;
  loading: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// ─── Scheduled morning audio tracks ─────────────────────────────────────────
// Hardcoded durations in seconds to enable pseudo-live playback
const MORNING_TRACKS = [
  {
    src: '/audio/morning1.mp3',
    title: 'Durood e Ibrahimi',
    artist: 'The Best Durood Sharif',
    cover: '/bg.jpg',
    durationSec: 24,
  },
  {
    src: '/audio/morning2.mp3',
    title: 'Morning Routine',
    artist: 'T Double H FM',
    cover: '/bg.jpg',
    durationSec: 8613, // 2h 23m 33s
  },
];

const SCHEDULED_HOUR = 4;
const SCHEDULED_MINUTE = 30;

function formatNextScheduledTime(): string {
  const now = new Date();
  const next = new Date();
  next.setHours(SCHEDULED_HOUR, SCHEDULED_MINUTE, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
    (next.getDate() !== now.getDate() ? ' (tomorrow)' : ' (today)');
}

import { getActiveScheduledStream } from '@/config/schedule';

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [audioMode, setAudioMode] = useState<AudioMode>('live');
  const [nextScheduledTime, setNextScheduledTime] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>({
    title: 'Loading...',
    artist: 'T Double H FM',
    cover: '/bg.jpg',
  });
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Generic Live Stream Detection ─────────────────────────────────────────
  // Polls our own backend every 10 seconds to see if the stream URL is actually returning audio (200 OK)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const checkLiveStatus = async () => {
      try {
        const res = await fetch('/api/check-live');
        const data = await res.json();
        setIsLiveStreamActive(data.isLive === true);
      } catch {
        setIsLiveStreamActive(false);
      }
    };

    // Check immediately, then every 10 seconds
    checkLiveStatus();
    interval = setInterval(checkLiveStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fetch secure stream URL
  useEffect(() => {
    fetch('/api/stream-url')
      .then(r => r.json())
      .then(data => {
        if (data.url) setStreamUrl(data.url);
      })
      .catch(() => console.warn('Could not load stream URL'));
  }, []);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Central logic to evaluate what should be playing RIGHT NOW based on current time
  const evaluateAndPlay = useCallback((isInitialPlay = false) => {
    if (!audioRef.current) return;
    
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(SCHEDULED_HOUR, SCHEDULED_MINUTE, 0, 0);
    
    const elapsedSeconds = (now.getTime() - scheduledTime.getTime()) / 1000;
    
    let targetSrc = streamUrl;
    let targetOffset = 0;
    let targetMode: AudioMode = 'live';
    let targetTrack = null;
    let timeUntilNextEventMs = 0;

    const t1Duration = MORNING_TRACKS[0].durationSec;
    const t2Duration = MORNING_TRACKS[1].durationSec;
    const totalScheduledDuration = t1Duration + t2Duration;

    if (isLiveStreamActive) {
      // 🚀 HARD OVERRIDE: If the real stream is active, override the morning routine!
      targetSrc = streamUrl;
      targetOffset = 0;
      targetMode = 'live';
      targetTrack = {
        title: 'ON AIR',
        artist: 'T Double H FM',
        cover: '/bg.jpg',
      };
      timeUntilNextEventMs = 10000; // re-evaluate when status might change
    } else if (elapsedSeconds >= 0 && elapsedSeconds < t1Duration) {
      // We are within Track 1
      targetSrc = MORNING_TRACKS[0].src;
      targetOffset = elapsedSeconds;
      targetMode = 'scheduled';
      targetTrack = MORNING_TRACKS[0];
      timeUntilNextEventMs = (t1Duration - elapsedSeconds) * 1000;
    } else if (elapsedSeconds >= t1Duration && elapsedSeconds < totalScheduledDuration) {
      // We are within Track 2
      targetSrc = MORNING_TRACKS[1].src;
      targetOffset = elapsedSeconds - t1Duration;
      targetMode = 'scheduled';
      targetTrack = MORNING_TRACKS[1];
      timeUntilNextEventMs = (totalScheduledDuration - elapsedSeconds) * 1000;
    } else {
      // Outside local MP3 scheduled block
      // Let's check the dynamic 24/7 internet radio schedule
      const activeSlot = getActiveScheduledStream(now);

      if (activeSlot && activeSlot.streams.length > 0) {
        // Base logic for alternating days
        const dayOfWeek = now.getDay();
        const baseIndex = dayOfWeek % activeSlot.streams.length;
        
        // Include fallback index in case of errors
        const actualIndex = (baseIndex + fallbackIndex) % activeSlot.streams.length;
        const selectedStream = activeSlot.streams[actualIndex];

        targetSrc = selectedStream.url;
        targetOffset = 0;
        targetMode = 'live'; // Treat internet radio as live
        targetTrack = {
          title: `${activeSlot.genre} - ${selectedStream.stationName}`,
          artist: activeSlot.artist,
          cover: '/bg.jpg',
        };
        // Re-evaluate when this slot ends
        const slotEndTime = new Date(now);
        slotEndTime.setHours(activeSlot.endHour, activeSlot.endMinute, 0, 0);
        if (slotEndTime.getTime() <= now.getTime()) {
          slotEndTime.setDate(slotEndTime.getDate() + 1); // Edge case for midnight crossover
        }
        timeUntilNextEventMs = slotEndTime.getTime() - now.getTime();
      } else {
        // Fallback if no schedule matched (shouldn't happen with 24/7 coverage, but just in case)
        targetSrc = streamUrl;
        targetOffset = 0;
        targetMode = 'live';
        targetTrack = null;
        timeUntilNextEventMs = 60000; // Check every minute
      }
    }

    if (!targetSrc) return; // streamUrl not loaded yet

    // Update state
    setAudioMode(targetMode);
    setNextScheduledTime(formatNextScheduledTime());
    if (targetTrack) {
      setCurrentTrack({ title: targetTrack.title, artist: targetTrack.artist, cover: targetTrack.cover });
    }

    // Update audio element if source changed or if we need to force play
    // Compare full URLs to support external internet radio streams correctly
    const currentSrcUrl = audioRef.current.src || '';
    const targetSrcUrl = new URL(targetSrc, window.location.origin).href;

    if (currentSrcUrl !== targetSrcUrl || isInitialPlay) {
      setLoading(true);
      audioRef.current.src = targetSrc;
      audioRef.current.load();
      
      // We can only set currentTime after loadedmetadata for static files
      if (targetMode === 'scheduled' && targetOffset > 0) {
        const handleLoadedMetadata = () => {
          if (audioRef.current) audioRef.current.currentTime = targetOffset;
          audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
        audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      }
      
      if (isPlaying || isInitialPlay) {
        audioRef.current.play().catch((e) => {
          console.error(e);
          setLoading(false);
        });
        setIsPlaying(true);
      }
    }

    // Schedule the next evaluation
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setFallbackIndex(0); // Reset fallback index for the new slot
      evaluateAndPlay();
    }, timeUntilNextEventMs);

  }, [streamUrl, isPlaying, isLiveStreamActive, fallbackIndex]);

  // Evaluate state when streamUrl loads, isLiveStreamActive changes, or periodically to catch boundaries
  useEffect(() => {
    if (streamUrl) evaluateAndPlay();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [streamUrl, isLiveStreamActive, evaluateAndPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setLoading(false);
    } else {
      setLoading(true);
      setFallbackIndex(0); // Reset fallback index when manually playing
      // Force an evaluation to ensure we jump to the correct pseudo-live timestamp
      evaluateAndPlay(true);
    }
  };

  const handleAudioError = () => {
    console.warn("Audio stream failed to load, trying next fallback...");
    setLoading(true);
    setFallbackIndex(prev => prev + 1);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        togglePlay,
        volume,
        setVolume,
        currentTrack,
        setCurrentTrack,
        audioRef,
        audioMode,
        nextScheduledTime,
        loading,
      }}
    >
      <audio 
        ref={audioRef} 
        preload="none" 
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onCanPlay={() => setLoading(false)}
        onError={handleAudioError}
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

