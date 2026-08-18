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
    cover: '/bg.jpg',
  });
  
  const [nextTrack, setNextTrack] = useState<{ title: string; time: string } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playedJingleForHour = useRef<number>(-1);
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

      // Check for Top of the Hour Jingle
      if (!data.isLive && data.dhakaTime) {
        const { hour, minute } = data.dhakaTime;
        
        // Exact top of the hour (minute 0) and we haven't played a jingle for this hour yet
        if (minute === 0 && JINGLE_HOURS.includes(hour) && playedJingleForHour.current !== hour) {
          playedJingleForHour.current = hour;
          isJinglePlayingRef.current = true;
          lastFetchedBlock.current = data.block; // Save schedule for when jingle finishes
          
          let jingleToPlay = '';
          if (hour === 7 || hour === 8) {
            jingleToPlay = '/audio/jingle/7am_8am_নতুন_সকাল.mp3';
          } else if (hour === 1 || hour === 2) {
            jingleToPlay = '/audio/jingle/T_Double_H_FM_lofi.mp3';
          } else {
            jingleToPlay = GENERIC_JINGLES[Math.floor(Math.random() * GENERIC_JINGLES.length)];
          }
          
          setAudioMode('jingle');
          setCurrentTrack({
            title: 'Station ID',
            artist: 'T Double H FM',
            cover: '/bg.jpg'
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
      if (!block) return;
      
      if (data.nextBlock) {
        setNextTrack(data.nextBlock);
      }

      const currentSrcPath = new URL(audioRef.current?.src || 'http://localhost').pathname;
      const targetSrcPath = new URL(block.url, window.location.origin).pathname;

      if (currentSrcPath !== targetSrcPath || forcePlay) {
        setAudioMode(block.mode);
        setCurrentTrack({
          title: block.title,
          artist: block.artist,
          cover: '/bg.jpg'
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
          cover: '/bg.jpg'
        });
      }

    } catch (err) {
      console.error("Failed to sync radio schedule", err);
    }
  }, [isPlaying]);

  // Handle when jingle finishes
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
          cover: '/bg.jpg'
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
    }
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
        onError={() => setLoading(false)}
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
