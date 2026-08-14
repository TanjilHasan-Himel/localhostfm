export interface ScheduleSlot {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  genre: string;
  artist: string;
  streamUrl: string;
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
    streamUrl: 'https://stream-163.zeno.fm/4eq3knd5v2zuv?zs=eGnt_4xOSsivcED0h3h5BA' // Example Retro URL
  },
  {
    // 03:30 to 04:30 - Ambient
    startHour: 3,
    startMinute: 30,
    endHour: 4,
    endMinute: 30,
    genre: 'Ambient & Meditation',
    artist: 'Relaxing Vibes',
    streamUrl: 'https://stream.zeno.fm/mqahtcm3r98uv' // Example Ambient URL
  },
  {
    // 06:00 to 10:00 - Bollywood Morning
    startHour: 6,
    startMinute: 0,
    endHour: 10,
    endMinute: 0,
    genre: 'Bollywood Morning',
    artist: 'Top 40 & Pop',
    streamUrl: 'https://stream-160.zeno.fm/8xsteb1071zuv?zs=m1Z17WWeR_q60c7sI6R85w' // Example Bollywood URL
  },
  {
    // 10:00 to 16:00 - Lofi Chill
    startHour: 10,
    startMinute: 0,
    endHour: 16,
    endMinute: 0,
    genre: 'Lofi & Chillhop',
    artist: 'Focus Vibes',
    streamUrl: 'https://play.streamafrica.net/lofi' // Example Lofi URL
  },
  {
    // 16:00 to 21:00 - Bangla Melody
    startHour: 16,
    startMinute: 0,
    endHour: 21,
    endMinute: 0,
    genre: 'Bangla Melody',
    artist: 'Soft Acoustic',
    streamUrl: 'https://stream-155.zeno.fm/f3wvbbqmdg8uv?zs=87y36t7gToWfI4TjU-Zrzw' // User's earlier Bangla stream URL
  },
  {
    // 21:00 to 00:00 - Jazz/Hip-Hop
    startHour: 21,
    startMinute: 0,
    endHour: 24, // Midnight edge case
    endMinute: 0,
    genre: 'Jazz & Hip-Hop',
    artist: 'Night Vibes',
    streamUrl: 'https://stream-160.zeno.fm/0a53v5m6f5zuv?zs=Vf17vNlCQ_S5aN8U7OqM_A' // Example Jazz URL
  }
];

export function getActiveScheduledStream(now: Date): ScheduleSlot | null {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  for (const slot of DAILY_SCHEDULE) {
    const startTimeInMinutes = slot.startHour * 60 + slot.startMinute;
    const endTimeInMinutes = slot.endHour * 60 + slot.endMinute;

    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
      return slot;
    }
  }
  return null;
}
