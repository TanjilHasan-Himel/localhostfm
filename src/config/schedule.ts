export interface StreamOption {
  url: string;
  stationName: string;
}

export interface ScheduleSlot {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  genre: string;
  artist: string;
  streams: StreamOption[];
}

export interface ActiveStream {
  genre: string;
  artist: string;
  streamUrl: string;
  stationName: string;
  endHour: number;
  endMinute: number;
}

// Map real-time internet radio URLs to our psychological time slots
export const DAILY_SCHEDULE: ScheduleSlot[] = [
  {
    // 00:01 to 03:30 - Retro Hits
    startHour: 0,
    startMinute: 1,
    endHour: 3,
    endMinute: 30,
    genre: 'Retro Hits',
    artist: '70s, 80s, 90s',
    streams: [
      { url: 'https://media-ssl.musicradio.com/Heart80sMP3', stationName: 'Heart 80s UK' },
      { url: 'https://stream.zeno.fm/9eq506qbb1quv', stationName: '80s Hits (Zeno)' },
      { url: 'https://stream.zeno.fm/m95u52m39v8uv', stationName: 'Retro 80s' }
    ]
  },
  {
    // 03:30 to 04:30 - Ambient
    startHour: 3,
    startMinute: 30,
    endHour: 4,
    endMinute: 30,
    genre: 'Ambient & Meditation',
    artist: 'Relaxing Vibes',
    streams: [
      { url: 'https://ice5.somafm.com/groovesalad-128-mp3', stationName: 'SomaFM Groove Salad' },
      { url: 'https://ice6.somafm.com/secretagent-128-mp3', stationName: 'SomaFM Secret Agent' },
      { url: 'https://stream.zeno.fm/4wt8n21x8d0uv', stationName: 'Ambient Relax' }
    ]
  },
  {
    // 06:00 to 09:00 - Bollywood Morning
    startHour: 6,
    startMinute: 0,
    endHour: 9,
    endMinute: 0,
    genre: 'Bollywood Morning',
    artist: 'Top 40 & Pop',
    streams: [
      { url: 'https://stream-143.zeno.fm/fdgs82xkzhhvv', stationName: 'Retro Bollywood 90s' },
      { url: 'https://stream.zeno.fm/8ty8szwpwfeuv', stationName: 'Hits Of Bollywood' },
      { url: 'https://stream.zeno.fm/2p0y4wvubxquv', stationName: 'Desi Bollywood' }
    ]
  },
  {
    // 09:00 to 12:00 - Pure English All Eras
    startHour: 9,
    startMinute: 0,
    endHour: 12,
    endMinute: 0,
    genre: 'Pure English',
    artist: 'All Eras Hits',
    streams: [
      { url: 'https://icecast.walmradio.com:8443/classic', stationName: 'Classic Vinyl HD' },
      { url: 'https://media-ssl.musicradio.com/CapitalUK', stationName: 'Capital UK Hit Music' }
    ]
  },
  {
    // 12:00 to 15:30 - Lofi Chill
    startHour: 12,
    startMinute: 0,
    endHour: 15,
    endMinute: 30,
    genre: 'Lofi & Chillhop',
    artist: 'Focus Vibes',
    streams: [
      { url: 'https://0nlineradio.radioho.st/0r-lo-fi', stationName: '0R Lofi Focus Vibes' },
      { url: 'https://stream.zeno.fm/tabzverz0fctv', stationName: 'Box Lofi Radio' },
      { url: 'https://stream.zeno.fm/fvxndn98198uv', stationName: 'Lofi 24/7' }
    ]
  },
  {
    // 15:30 to 16:00 - K-Pop & Anime
    startHour: 15,
    startMinute: 30,
    endHour: 16,
    endMinute: 0,
    genre: 'K-Pop & Anime',
    artist: 'Afternoon Energy',
    streams: [
      { url: 'https://listen.moe/kpop/stream', stationName: 'Listen.moe K-Pop' },
      { url: 'https://nl4.mystreaming.net/er/bts/icecast.audio', stationName: 'Exclusively BTS' },
      { url: 'https://stream.zeno.fm/1f4w9e56n38uv', stationName: 'K-Pop Anime Mix' }
    ]
  },
  {
    // 16:00 to 17:00 - Spanish / Latin
    startHour: 16,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
    genre: 'Spanish & Latin',
    artist: 'Reggaeton Hits',
    streams: [
      { url: 'https://icecast.funradio.fr/fun-1-44-128', stationName: 'FUN Radio Latin' },
      { url: 'https://live.convoynetwork.com/stream', stationName: 'Convoy en vivo' },
      { url: 'https://breakz-2012-high.rautemusik.fm/?ref=radiobrowser-top100-clubcharts', stationName: 'Latin & Moombahton Mix' }
    ]
  },
  {
    // 17:00 to 20:00 - Bangla Melody
    startHour: 17,
    startMinute: 0,
    endHour: 20,
    endMinute: 0,
    genre: 'Bangla Melody',
    artist: 'Soft Acoustic',
    streams: [
      { url: 'https://radio.mellowbangla.com/stream', stationName: 'Mellow Bangla' },
      { url: 'https://stream.zeno.fm/w571sngmsxquv', stationName: 'Bangladesh Local Radio' }
    ]
  },
  {
    // 20:00 to 21:00 - EDM & Dance Club
    startHour: 20,
    startMinute: 0,
    endHour: 21,
    endMinute: 0,
    genre: 'EDM & Dance',
    artist: 'Club Mix',
    streams: [
      { url: 'https://breakz-2012-high.rautemusik.fm/?ref=rb-djclubcharts', stationName: 'DJ & CLUB CHARTS' },
      { url: 'https://stream.zeno.fm/xnvp64v2r2zuv', stationName: 'Dance Club Mix' }
    ]
  },
  {
    // 21:00 to 23:00 - Jazz/Hip-Hop
    startHour: 21,
    startMinute: 0,
    endHour: 23,
    endMinute: 0,
    genre: 'Jazz & Hip-Hop',
    artist: 'Night Vibes',
    streams: [
      { url: 'https://stream.zeno.fm/a83h16a3v2zuv', stationName: '101 Smooth Jazz' },
      { url: 'https://jazzblues.ice.infomaniak.ch/jazzblues-high.mp3', stationName: 'Jazz Radio Blues HQ' },
      { url: 'https://icecast.walmradio.com:8443/jazz', stationName: 'Adroit Jazz Underground' }
    ]
  },
  {
    // 23:00 to 23:30 - Classical Piano
    startHour: 23,
    startMinute: 0,
    endHour: 23,
    endMinute: 30,
    genre: 'Classical Piano',
    artist: 'Deep Focus',
    streams: [
      { url: 'https://stream.zeno.fm/8qgvw46c3qruv', stationName: 'Your Classical Relax' },
      { url: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8', stationName: 'Vivid Bharti Classical' }
    ]
  },
  {
    // 23:30 to 24:00 - Late Night Jazz
    startHour: 23,
    startMinute: 30,
    endHour: 24, // Midnight edge case
    endMinute: 0,
    genre: 'Late Night Jazz',
    artist: 'Midnight Mood',
    streams: [
      { url: 'https://jazzblues.ice.infomaniak.ch/jazzblues-high.mp3', stationName: 'Jazz Radio Blues HQ' },
      { url: 'https://stream.zeno.fm/a83h16a3v2zuv', stationName: '101 Smooth Jazz' }
    ]
  }
];

export function getActiveScheduledStream(now: Date, errorCount: number = 0): ActiveStream | null {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)

  let baseSlotIndex = -1;

  for (let i = 0; i < DAILY_SCHEDULE.length; i++) {
    const slot = DAILY_SCHEDULE[i];
    const startTimeInMinutes = slot.startHour * 60 + slot.startMinute;
    const endTimeInMinutes = slot.endHour * 60 + slot.endMinute;

    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
      baseSlotIndex = i;
      break;
    }
  }

  if (baseSlotIndex === -1) return null;

  // If errorCount > 0, we jump to the next group/category entirely!
  // This ensures that if a category is fully blocked, we play another category to cover the time.
  const actualSlotIndex = (baseSlotIndex + errorCount) % DAILY_SCHEDULE.length;
  const activeSlot = DAILY_SCHEDULE[actualSlotIndex];

  if (!activeSlot || activeSlot.streams.length === 0) return null;

  // Pick a stream based on the day of the week
  const streamIndex = dayOfWeek % activeSlot.streams.length;
  const selectedStream = activeSlot.streams[streamIndex];

  return {
    genre: activeSlot.genre,
    artist: activeSlot.artist,
    streamUrl: selectedStream.url,
    stationName: selectedStream.stationName,
    endHour: activeSlot.endHour,
    endMinute: activeSlot.endMinute
  };
}
