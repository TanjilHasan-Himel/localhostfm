'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';

interface TrackInfo {
  title: string;
  artist: string;
  cover: string;
}

type AudioMode = 'live' | 'scheduled' | 'jingle';

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
  nextTrack: { title: string; time: string } | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const JINGLE_HOURS = [0, 1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const GENERIC_JINGLES = [
  '/audio/jingle/Non_Stop_Drive.mp3',
  '/audio/jingle/On_The_Air.mp3',
  '/audio/jingle/T_Double_H.mp3',
  '/audio/jingle/The_Music_Hub.mp3',
  '/audio/jingle/মিউজিক_নন_স্টপ.mp3'
];

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [audioMode, setAudioMode] = useState<AudioMode>('scheduled');
  
  // We won't need nextScheduledTime anymore since backend handles everything instantly
  const [nextScheduledTime] = useState<string | null>(null);
  
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>({
    title: 'Connecting...',
    artist: 'T Double H FM',
    cover: '/bg_images/laptop and pc/bg_day_pc.jpg',
  });
  
  const [nextTrack, setNextTrack] = useState<{ title: string; time: string } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playedJingleForHour = useRef<string>('');
  const isJinglePlayingRef = useRef<boolean>(false);
  
  // Store the last fetched block so we can resume it after jingle
  const lastFetchedBlock = useRef<any>(null);

  const syncSchedule = useCallback(async (forcePlay = false) => {
    try {
      const res = await fetch('/api/radio-schedule');
      const data = await res.json();

      // If we are currently playing a jingle, DO NOT interrupt it!
      if (isJinglePlayingRef.current) {
        lastFetchedBlock.current = data.block; // Save it for later
        return;
      }

        // Check for Jingles
        if (data.dhakaTime) {
          const { hour, minute } = data.dhakaTime;
          
          let shouldPlayJingle = false;
          let jingleToPlay = '';
          const jingleId = `${hour}-${minute}`; // Unique ID for this hour+minute
  
          // News Jingles Countdown (7:57 AM, 7:58 PM, 7:59 PM)
          if (hour === 7 && minute === 57) {
            shouldPlayJingle = true; jingleToPlay = '/audio/jingle/news_jingle/news_jingle_1_2.49sec.mp3';
          } else if (hour === 19 && minute === 58) {
            shouldPlayJingle = true; jingleToPlay = '/audio/jingle/news_jingle/news_jingle_2.mp3';
          } else if (hour === 19 && minute === 59) {
            shouldPlayJingle = true; jingleToPlay = '/audio/jingle/news_jingle/news_jingle_3.mp3';
          }
          // 1. 12am, 1am, 2am -> Top of the hour (minute 0)
          else if (!data.isLive && (hour === 0 || hour === 1 || hour === 2) && minute === 0) {
            shouldPlayJingle = true;
            jingleToPlay = '/audio/jingle/T_Double_H_FM_lofi.mp3';
          }
          // 2. 7am, 8am -> At minute 15
          else if (!data.isLive && (hour === 7 || hour === 8) && minute === 15) {
            shouldPlayJingle = true;
            jingleToPlay = '/audio/jingle/7am_8am_নতুন_সকাল.mp3';
          }
          // 3. Other hours (9am to 11pm, plus 3am, 4am) -> Top of the hour (minute 0) (excluding 5am, 6am, 7pm, 8pm)
          else if (!data.isLive && minute === 0 && ![0, 1, 2, 5, 6, 7, 8, 19, 20].includes(hour)) {
            shouldPlayJingle = true;
            jingleToPlay = GENERIC_JINGLES[Math.floor(Math.random() * GENERIC_JINGLES.length)];
          }
        
        // Execute jingle if matched and not already played
        if (shouldPlayJingle && playedJingleForHour.current !== jingleId) {
          playedJingleForHour.current = jingleId as any;
          isJinglePlayingRef.current = true;
          lastFetchedBlock.current = data.block; // Save schedule for when jingle finishes
          
          setAudioMode('jingle');
          setCurrentTrack({
            title: 'Station ID',
            artist: 'T Double H FM',
            cover: '/bg_images/laptop and pc/bg_day_pc.jpg'
          });
          
          if (audioRef.current) {
            setLoading(true);
            audioRef.current.src = jingleToPlay;
            audioRef.current.load();
            if (isPlaying || forcePlay) {
              audioRef.current.play().catch(e => {
                console.error("Jingle play error:", e);
                setLoading(false);
                isJinglePlayingRef.current = false; // fallback if fails
              });
              setIsPlaying(true);
            }
          }
          return; // Skip playing the scheduled block right now
        }
      }

      // Normal Schedule Playback
      const block = data.block;
      if (!block) {
        if (isPlaying && audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
          setLoading(false);
          setAudioMode('scheduled');
          setCurrentTrack({
            title: 'Silence',
            artist: 'Quiet Time',
            cover: '/bg_images/laptop and pc/bg_day_pc.jpg'
          });
        }
        if (data.nextBlock) setNextTrack(data.nextBlock);
        return;
      }
      
      if (data.nextBlock) {
        setNextTrack(data.nextBlock);
      }

      const currentSrcPath = new URL(audioRef.current?.src || 'http://localhost').pathname + new URL(audioRef.current?.src || 'http://localhost').search;
      const targetSrcPath = new URL(block.url, window.location.origin).pathname + new URL(block.url, window.location.origin).search;

      if (currentSrcPath !== targetSrcPath || forcePlay) {
        setAudioMode(block.mode);
        setCurrentTrack({
          title: block.title,
          artist: block.artist,
          cover: '/bg_images/laptop and pc/bg_day_pc.jpg'
        });

        if (audioRef.current) {
          setLoading(true);
          audioRef.current.src = block.url;
          audioRef.current.load();
          
          if (block.mode === 'scheduled' && block.offset > 0) {
            const handleLoadedMetadata = () => {
              if (audioRef.current) audioRef.current.currentTime = block.offset;
              audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
          }
          
          if (isPlaying || forcePlay) {
            audioRef.current.play().catch(e => {
              console.error("Stream play error:", e);
              setLoading(false);
            });
            setIsPlaying(true);
          }
        }
      } else {
        // Just update metadata if stream hasn't changed
        setAudioMode(block.mode);
        setCurrentTrack({
          title: block.title,
          artist: block.artist,
          cover: '/bg_images/laptop and pc/bg_day_pc.jpg'
        });
      }

    } catch (err) {
      console.error("Failed to sync radio schedule", err);
    }
  }, [isPlaying]);

  // Handle when audio finishes or stream drops
  const handleAudioEnded = () => {
    if (isJinglePlayingRef.current) {
      // Jingle is done!
      isJinglePlayingRef.current = false;
      
      // Resume the scheduled block
      if (lastFetchedBlock.current) {
        const block = lastFetchedBlock.current;
        setAudioMode(block.mode);
        setCurrentTrack({
          title: block.title,
          artist: block.artist,
          cover: '/bg_images/laptop and pc/bg_day_pc.jpg'
        });

        if (audioRef.current) {
          setLoading(true);
          audioRef.current.src = block.url;
          audioRef.current.load();
          
          // Note: offset might be slightly inaccurate after jingle, but backend corrects it on next poll
          if (block.mode === 'scheduled' && block.offset > 0) {
            const handleLoadedMetadata = () => {
              if (audioRef.current) audioRef.current.currentTime = block.offset;
              audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
          }

          audioRef.current.play().catch(console.error);
        }
      } else {
        // Safety fallback
        syncSchedule(true);
      }
    } else if (audioMode === 'live') {
      // Live stream dropped (e.g. Vercel proxy timeout). Auto-reconnect!
      console.warn("Live stream ended unexpectedly! Reconnecting...");
      setTimeout(() => {
        if (isPlaying) syncSchedule(true);
      }, 2000);
    }
  };

  const handleAudioError = () => {
    setLoading(false);
    console.warn("Audio stream error! Reconnecting in 3s...");
    setTimeout(() => {
      if (isPlaying) syncSchedule(true);
    }, 3000);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // Poll the backend every 10 seconds to stay in sync
    syncSchedule();
    const interval = setInterval(() => syncSchedule(), 10000);
    return () => clearInterval(interval);
  }, [syncSchedule]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setLoading(false);
    } else {
      setLoading(true);
      syncSchedule(true);
    }
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
        nextTrack,
      }}
    >
      <audio 
        ref={audioRef} 
        preload="none" 
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onCanPlay={() => setLoading(false)}
        onError={handleAudioError}
        onEnded={handleAudioEnded}
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
