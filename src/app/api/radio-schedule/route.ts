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
  { url: 'https://stream.zeno.fm/60ef4p33vxquv', name: 'Bollywood Classic Hours' },
  { url: 'https://stream.zeno.fm/jmi0hwxrgmauv', name: 'Hindi Hits' }, // Replaced 404 stream with a working one
  { url: 'https://radio.mellowbangla.com/stream', name: 'Mellow Bangla' },
  { url: 'https://stream.zeno.fm/jmi0hwxrgmauv', name: 'Global Hits & Bollywood' }
];

const englishLinks = [
  { url: 'https://live.powerhitz.com/hitlist', name: 'PowerHitz Top 40' },
  { url: 'https://listen.181fm.com/181-awesome80s_128k.mp3', name: 'Awesome 80s' },
  { url: 'https://ice1.somafm.com/poptron-128-mp3', name: 'PopTron' },
  { url: 'https://listen.181fm.com/181-star90s_128k.mp3', name: 'Star 90s' },
  { url: 'https://live.powerhitz.com/officemix', name: 'Office Mix' },
  { url: 'https://ice1.somafm.com/indiepop-128-mp3', name: 'Indie Pop' },
  { url: 'https://listen.181fm.com/181-lite80s_128k.mp3', name: 'Lite 80s' }
];

// Helper to securely proxy links to avoid Mixed Content (HTTP on HTTPS)
// Only proxies http:// links. https:// and local links (/audio) are returned directly.
const secureLink = (url: string) => {
  if (url.startsWith('http://')) {
    return `/api/stream?url=${encodeURIComponent(url)}`;
  }
  return url;
};

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
        nextTitle: '3rd Night Hour', nextTime: '2:01 AM'
      };
    }
    // 2:01 AM - 3:00 AM: 3rd Night Hour
    else if (mins >= time(2, 1) && mins < time(3, 1)) {
      let b: ScheduleBlock;
      if (day === 1 || day === 3) { // Monday, Wednesday
        b = { url: secureLink('https://radio.mellowbangla.com/stream'), title: '3rd Night Hour', artist: 'Mellow Bangla', mode: 'live' };
      } else {
        b = { url: secureLink('https://stream.zeno.fm/jmi0hwxrgmauv'), title: '3rd Night Hour', artist: '90s & Modern Hindi', mode: 'live' };
      }
      return { block: b, nextTitle: 'Night OWL', nextTime: '3:01 AM' };
    }
    // 3:01 AM - 4:15 AM: Night OWL
    else if (mins >= time(3, 1) && mins < time(4, 15)) {
      let b: ScheduleBlock;
      // 3:30 AM - 4:00 AM: Jazz
      if (mins >= time(3, 30) && mins < time(4, 0)) {
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

      if ((mins >= time(7, 0) && mins < time(7, 15)) || (mins >= time(7, 59) && mins < time(8, 15))) {
        // BBC News at 7:00-7:15 and 7:59-8:15
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
        nextTitle: 'Public Hour', nextTime: '3:01 PM'
      };
    }
    // 3:01 PM - 6:00 PM: Public Hour (Rotated Mixed Links)
    else if (mins >= time(15, 1) && mins < time(18, 1)) {
      let b: ScheduleBlock;
      // Rotate between English and Hindi based on the day
      if (day % 2 === 0) {
        b = { url: secureLink(pickHindi.url), title: 'Public Hour', artist: pickHindi.name, mode: 'live' };
      } else {
        b = { url: secureLink(pickEnglish.url), title: 'Public Hour', artist: pickEnglish.name, mode: 'live' };
      }
      return { block: b, nextTitle: 'Global Sports Hour', nextTime: '6:01 PM' };
    }
    // 6:01 PM - 7:59 PM: Global Sports Hour
    else if (mins >= time(18, 1) && mins < time(19, 59)) {
      return {
        block: { url: secureLink('https://radio.talksport.com/stream'), title: 'Global Sports Hour', artist: 'talkSPORT', mode: 'live' },
        nextTitle: 'Prime Time News', nextTime: '7:59 PM'
      };
    }
    // 7:59 PM - 8:30 PM: Prime Time News
    else if (mins >= time(19, 59) && mins < time(20, 31)) {
      return {
        block: { url: secureLink('https://stream.live.vc.bbcmedia.co.uk/bbc_world_service'), title: 'Prime Time News', artist: 'BBC World Service', mode: 'live' },
        nextTitle: 'Evening Pop Culture', nextTime: '8:31 PM'
      };
    }
    // 8:31 PM - 10:00 PM: Evening Pop Culture / Evening Tea Cup
    else if (mins >= time(20, 31) && mins < time(22, 1)) {
      let b: ScheduleBlock;
      if (day !== 2 && day !== 3) { // Sat, Sun, Mon, Thu, Fri
        b = { url: secureLink('https://stream.radiocaroline.net/;'), title: 'Evening Tea Cup', artist: 'Radio Caroline', mode: 'live' };
      } else {
        if (isWeekday) {
          b = { url: secureLink(pickEnglish.url), title: 'Evening Pop Culture', artist: pickEnglish.name, mode: 'live' };
        } else {
          b = { url: secureLink(pickHindi.url), title: 'Evening Pop Culture', artist: pickHindi.name, mode: 'live' };
        }
      }
      return { block: b, nextTitle: 'Night Musics', nextTime: '10:01 PM' };
    }
    // 10:01 PM - 12:00 AM: Night Musics / Bangla
    else {
      let b: ScheduleBlock;
      if (day === 6 || day === 3 || day === 4) { // Sat, Wed, Thu
        b = { url: secureLink('https://radio.mellowbangla.com/stream'), title: 'Night Musics', artist: 'Mellow Bangla', mode: 'live' };
      } else if (day === 1 || day === 0) { // Mon, Sun
        b = { url: secureLink('https://radio.mellowbangla.com/stream'), title: 'Night Musics', artist: 'Mellow Bangla', mode: 'live' };
      } else if (day === 5) { // Friday
        b = { url: secureLink('https://stream.zeno.fm/jmi0hwxrgmauv'), title: 'Friday Night', artist: 'Global Hits & Bollywood', mode: 'live' };
      } else { // Tuesday
        b = { url: secureLink('https://ice1.somafm.com/deepspaceone-128-mp3'), title: 'Night Musics', artist: 'Neo-Soul & Lo-Fi', mode: 'live' };
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
