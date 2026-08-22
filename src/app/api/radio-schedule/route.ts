import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ScheduleBlock {
  url: string;
  title: string;
  artist: string;
  mode: 'live' | 'scheduled';
  offset?: number;
}

// Arrays for rotating links based on the day
const hindiLinks = [
  { url: 'http://node-12.zeno.fm/60ef4p33vxquv', name: 'Bollywood Classic Hours' },
  { url: 'http://192.99.8.192:5032/', name: 'Hindi Hits' },
  { url: 'https://www.desizoneradio.com/relay1', name: 'DesiZone Radio' },
  { url: 'https://stream.zeno.fm/jmi0hwxrgmauv', name: 'Global Hits & Bollywood' }
];

const englishLinks = [
  { url: 'http://live.powerhitz.com/hitlist', name: 'PowerHitz Top 40' },
  { url: 'http://listen.181fm.com/181-awesome80s_128k.mp3', name: 'Awesome 80s' },
  { url: 'https://ice1.somafm.com/poptron-128-mp3', name: 'PopTron' },
  { url: 'http://listen.181fm.com/181-star90s_128k.mp3', name: 'Star 90s' },
  { url: 'http://live.powerhitz.com/officemix', name: 'Office Mix' },
  { url: 'https://ice1.somafm.com/indiepop-128-mp3', name: 'Indie Pop' },
  { url: 'http://listen.181fm.com/181-lite80s_128k.mp3', name: 'Lite 80s' }
];

// Helper to securely proxy links to avoid Mixed Content (HTTP on HTTPS)
const secureLink = (url: string) => `/api/stream?url=${encodeURIComponent(url)}`;

export async function GET() {
  const streamUrl = process.env.STREAM_URL;

  let isLiveStreamActive = false;

  // 1. Check if Mixxx Live Stream is active
  if (streamUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(streamUrl, {
        signal: controller.signal,
        headers: { 'Range': 'bytes=0-0' },
      });
      clearTimeout(timeoutId);
      controller.abort();
      
      if (res.ok) {
        isLiveStreamActive = true;
      }
    } catch (error) {
      isLiveStreamActive = false;
    }
  }

  if (isLiveStreamActive && streamUrl) {
    return NextResponse.json({
      isLive: true,
      block: {
        url: secureLink(streamUrl),
        title: 'ON AIR',
        artist: 'T Double H FM',
        mode: 'live'
      }
    });
  }

  // 2. Calculate current time in Dhaka
  const now = new Date();
  const dhakaTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
  const dhakaNow = new Date(dhakaTimeStr);
  
  const day = dhakaNow.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const hour = dhakaNow.getHours();
  const minute = dhakaNow.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  // Rotation Pickers
  const pickHindi = hindiLinks[day % hindiLinks.length];
  const pickEnglish = englishLinks[day % englishLinks.length];
  const isWeekend = day === 0 || day === 2 || day === 4; // Sun, Tue, Thu
  const isWeekday = day === 6 || day === 1 || day === 3; // Sat, Mon, Wed

  // Helper time converters
  const time = (h: number, m: number) => h * 60 + m;

  // Jingle Logic Check
  const isJingleTime = () => {
    // 7:15, 8:15, 9:00, 10:00, 11:00
    if (hour === 7 && minute === 15) return true;
    if (hour === 8 && minute === 15) return true;
    if (hour >= 9 && hour <= 11 && minute === 0) return true;
    return false;
  };

  // Helper function to resolve schedule blocks
  function getSchedule(mins: number): { block: ScheduleBlock | null, nextTitle: string, nextTime: string } {
    
    // 12:01 AM - 1:00 AM: First Night Hour
    if (mins >= time(0, 1) && mins < time(1, 1)) {
      return {
        block: { url: secureLink(pickHindi.url), title: 'First Night Hour', artist: pickHindi.name, mode: 'live' },
        nextTitle: '2nd Hour Show', nextTime: '1:01 AM'
      };
    } 
    // 1:01 AM - 2:00 AM: 2nd Hour Show
    else if (mins >= time(1, 1) && mins < time(2, 1)) {
      return {
        block: { url: secureLink(pickEnglish.url), title: '2nd Hour Show', artist: pickEnglish.name, mode: 'live' },
        nextTitle: 'Night OWL', nextTime: '2:01 AM'
      };
    }
    // 2:01 AM - 4:15 AM: Night OWL
    else if (mins >= time(2, 1) && mins < time(4, 15)) {
      let b: ScheduleBlock;
      // 2:30 AM - 3:00 AM: Jazz
      if (mins >= time(2, 30) && mins < time(3, 0)) {
        b = { url: secureLink('https://ice1.somafm.com/secretagent-128-mp3'), title: 'Night OWL (Jazz)', artist: 'Lounge & Jazz', mode: 'live' };
      } else {
        b = { url: secureLink('https://ice1.somafm.com/groovesalad-128-mp3'), title: 'Night OWL', artist: 'Relaxing Songs', mode: 'live' };
      }
      return { block: b, nextTitle: 'Quiet Time', nextTime: '4:15 AM' };
    }
    // 4:15 AM - 4:30 AM: Quiet Time (Blank)
    else if (mins >= time(4, 15) && mins < time(4, 30)) {
      return { block: null, nextTitle: 'Morning Routine', nextTime: '4:30 AM' }; // null stops the player
    }
    // 4:30 AM - 7:00 AM: Morning Routine
    else if (mins >= time(4, 30) && mins < time(7, 0)) {
      const scheduledStart = new Date(dhakaNow);
      scheduledStart.setHours(4, 30, 0, 0);
      const elapsedSeconds = (dhakaNow.getTime() - scheduledStart.getTime()) / 1000;
      let b: ScheduleBlock;
      if (elapsedSeconds < 24) {
        b = { url: '/audio/morning1.mp3', title: 'Durood e Ibrahimi', artist: 'The Best Durood Sharif', mode: 'scheduled', offset: elapsedSeconds };
      } else {
        b = { url: '/audio/morning2.mp3', title: 'Morning Routine', artist: 'T Double H FM', mode: 'scheduled', offset: elapsedSeconds - 24 };
      }
      return { block: b, nextTitle: 'Morning Sun', nextTime: '7:00 AM' };
    }
    // 7:00 AM - 12:00 PM: Morning Sun (Complex Logic)
    else if (mins >= time(7, 0) && mins < time(12, 1)) {
      let b: ScheduleBlock;

      if (isJingleTime()) {
        b = { url: '/audio/jingle.mp3', title: 'Morning Sun', artist: 'T Double H FM', mode: 'live' };
      } else if ((mins >= time(7, 0) && mins < time(7, 15)) || (mins >= time(8, 0) && mins < time(8, 15))) {
        // BBC News at 7:00-7:15 and 8:00-8:15
        b = { url: secureLink('https://stream.live.vc.bbcmedia.co.uk/bbc_world_service'), title: 'BBC News', artist: 'BBC World Service', mode: 'live' };
      } else {
        // Rotated Hits
        b = { url: secureLink(pickEnglish.url), title: 'Morning Sun', artist: pickEnglish.name, mode: 'live' };
      }
      return { block: b, nextTitle: 'Modhanno Somoy', nextTime: '12:01 PM' };
    }
    // 12:01 PM - 3:00 PM: Modhanno Somoy
    else if (mins >= time(12, 1) && mins < time(15, 1)) {
      return {
        block: { url: secureLink(pickHindi.url), title: 'Modhanno Somoy', artist: pickHindi.name, mode: 'live' },
        nextTitle: 'Afternoon Vibe', nextTime: '3:01 PM'
      };
    }
    // 3:01 PM - 6:00 PM: Afternoon Vibe
    else if (mins >= time(15, 1) && mins < time(18, 1)) {
      let b: ScheduleBlock;
      if (isWeekday) {
        b = { url: secureLink('https://www.desizoneradio.com/relay1'), title: 'DesiZone Hits', artist: 'Afternoon Vibe', mode: 'live' };
      } else if (isWeekend) {
        b = { url: secureLink('https://drive.uber.radio/uber/bollywood2010s/icecast.audio'), title: 'Bollywood 2010s', artist: 'Afternoon Vibe', mode: 'live' };
      } else {
        b = { url: secureLink('https://radio.talksport.com/stream'), title: 'Live Sports Update', artist: 'talkSPORT', mode: 'live' };
      }
      return { block: b, nextTitle: 'Global Sports Hour', nextTime: '6:01 PM' };
    }
    // 6:01 PM - 8:00 PM: Global Sports Hour
    else if (mins >= time(18, 1) && mins < time(20, 0)) {
      return {
        block: { url: secureLink('https://radio.talksport.com/stream'), title: 'Live Sports Update', artist: 'talkSPORT', mode: 'live' },
        nextTitle: 'Prime Time News', nextTime: '8:00 PM'
      };
    }
    // 8:00 PM - 8:30 PM: Prime Time News
    else if (mins >= time(20, 0) && mins < time(20, 31)) {
      return {
        block: { url: secureLink('https://stream.live.vc.bbcmedia.co.uk/bbc_world_service'), title: 'Prime Time News', artist: 'BBC World Service', mode: 'live' },
        nextTitle: 'Evening Pop Culture', nextTime: '8:31 PM'
      };
    }
    // 8:31 PM - 10:00 PM: Evening Pop Culture
    else if (mins >= time(20, 31) && mins < time(22, 1)) {
      let b: ScheduleBlock;
      if (isWeekday) {
        b = { url: secureLink(pickEnglish.url), title: 'Pop Music', artist: 'Evening Pop Culture', mode: 'live' };
      } else {
        b = { url: secureLink(pickHindi.url), title: 'Bollywood Hits', artist: 'Evening Pop Culture', mode: 'live' };
      }
      return { block: b, nextTitle: 'Night Musics', nextTime: '10:01 PM' };
    }
    // 10:01 PM - 12:00 AM: Night Musics
    else {
      let b: ScheduleBlock;
      if (day === 5) { // Friday
        b = { url: secureLink('https://stream.zeno.fm/jmi0hwxrgmauv'), title: 'Friday Night', artist: 'Night Musics', mode: 'live' };
      } else {
        b = { url: secureLink('https://ice1.somafm.com/deepspaceone-128-mp3'), title: 'Neo-Soul & Lo-Fi', artist: 'Night Musics', mode: 'live' };
      }
      return { block: b, nextTitle: 'First Night Hour', nextTime: '12:01 AM' };
    }
  }

  const { block: currentBlock, nextTitle, nextTime } = getSchedule(timeInMinutes);

  return NextResponse.json({
    isLive: false,
    block: currentBlock,
    nextBlock: { title: nextTitle, time: nextTime },
    dhakaTime: { hour, minute }
  });
}
