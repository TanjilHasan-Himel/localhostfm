import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ScheduleBlock {
  url: string;
  title: string;
  artist: string;
  mode: 'live' | 'scheduled';
  offset?: number;
}

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
        url: streamUrl,
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

  const isFriday = day === 5;
  const isWeekend = day === 0 || day === 2 || day === 4; // Sun, Tue, Thu
  const isWeekday = day === 6 || day === 1 || day === 3; // Sat, Mon, Wed

  let block: ScheduleBlock = {
    url: '',
    title: '',
    artist: '',
    mode: 'live'
  };

  // Helper time converters
  const time = (h: number, m: number) => h * 60 + m;

  // Helper function to resolve schedule blocks
  function getSchedule(mins: number): { block: ScheduleBlock, nextTitle: string, nextTime: string } {
    if (mins >= time(0, 1) && mins < time(4, 30)) {
      return {
        block: { url: 'https://ice1.somafm.com/u80s-128-mp3', title: 'Night Retro Block', artist: 'SomaFM 80s', mode: 'live' },
        nextTitle: 'Morning Routine', nextTime: '4:30 AM'
      };
    } else if (mins >= time(4, 30) && mins < time(7, 0)) {
      const scheduledStart = new Date(dhakaNow);
      scheduledStart.setHours(4, 30, 0, 0);
      const elapsedSeconds = (dhakaNow.getTime() - scheduledStart.getTime()) / 1000;
      let b: ScheduleBlock;
      if (elapsedSeconds < 24) {
        b = { url: '/audio/morning1.mp3', title: 'Durood e Ibrahimi', artist: 'The Best Durood Sharif', mode: 'scheduled', offset: elapsedSeconds };
      } else {
        b = { url: '/audio/morning2.mp3', title: 'Morning Routine', artist: 'T Double H FM', mode: 'scheduled', offset: elapsedSeconds - 24 };
      }
      return { block: b, nextTitle: 'Morning Vibe', nextTime: '7:00 AM' };
    } else if (mins >= time(7, 0) && mins < time(11, 1)) {
      let b: ScheduleBlock;
      if (mins >= time(8, 0) && mins <= time(8, 10)) {
        b = { url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', title: 'BBC News', artist: 'BBC World Service', mode: 'live' };
      } else if (isWeekday) {
        b = { url: 'https://ice1.somafm.com/poptron-128-mp3', title: 'Upbeat English Pop', artist: 'Morning Vibe', mode: 'live' };
      } else if (isWeekend) {
        b = { url: 'https://ice1.somafm.com/groovesalad-128-mp3', title: 'Acoustic Morning & Soft Chill', artist: 'Morning Vibe', mode: 'live' };
      } else {
        b = { url: 'https://www.desizoneradio.com/relay1', title: 'DesiZone Morning', artist: 'Morning Vibe', mode: 'live' };
      }
      return { block: b, nextTitle: 'Office Time', nextTime: '11:00 AM' };
    } else if (mins >= time(11, 1) && mins < time(15, 1)) {
      let b: ScheduleBlock;
      if (isWeekday) {
        b = { url: 'https://stream.zeno.fm/jmi0hwxrgmauv', title: 'Bollywood Blockbusters', artist: 'Office Time', mode: 'live' };
      } else if (isWeekend) {
        b = { url: 'https://ice1.somafm.com/indiepop-128-mp3', title: 'Global Top 40', artist: 'Office Time', mode: 'live' };
      } else {
        b = { url: 'https://ice1.somafm.com/poptron-128-mp3', title: 'Modern Electro-Pop', artist: 'Office Time', mode: 'live' };
      }
      return { block: b, nextTitle: 'Afternoon Vibe', nextTime: '3:00 PM' };
    } else if (mins >= time(15, 1) && mins < time(18, 1)) {
      let b: ScheduleBlock;
      if (isWeekday) {
        b = { url: 'https://www.desizoneradio.com/relay1', title: 'DesiZone Hits', artist: 'Afternoon Vibe', mode: 'live' };
      } else if (isWeekend) {
        b = { url: 'https://drive.uber.radio/uber/bollywood2010s/icecast.audio', title: 'Bollywood 2010s', artist: 'Afternoon Vibe', mode: 'live' };
      } else {
        b = { url: 'https://radio.talksport.com/stream', title: 'Live Sports Update', artist: 'talkSPORT', mode: 'live' };
      }
      return { block: b, nextTitle: 'Global Sports Hour', nextTime: '6:00 PM' };
    } else if (mins >= time(18, 1) && mins < time(20, 0)) {
      return {
        block: { url: 'https://radio.talksport.com/stream', title: 'Live Sports Update', artist: 'talkSPORT', mode: 'live' },
        nextTitle: 'Prime Time News', nextTime: '8:00 PM'
      };
    } else if (mins >= time(20, 0) && mins < time(20, 31)) {
      return {
        block: { url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', title: 'Prime Time News', artist: 'BBC World Service', mode: 'live' },
        nextTitle: 'Evening Pop Culture', nextTime: '8:30 PM'
      };
    } else if (mins >= time(20, 31) && mins < time(21, 1)) {
      let b: ScheduleBlock;
      if (isWeekday) {
        b = { url: 'https://ice1.somafm.com/secretagent-128-mp3', title: 'World Music', artist: 'Evening Pop Culture', mode: 'live' };
      } else if (isWeekend) {
        b = { url: 'https://stream.zeno.fm/jmi0hwxrgmauv', title: 'Global Hits & Bollywood', artist: 'Evening Pop Culture', mode: 'live' };
      } else {
        b = { url: 'https://ice1.somafm.com/poptron-128-mp3', title: 'New Release Friday', artist: 'Evening Pop Culture', mode: 'live' };
      }
      return { block: b, nextTitle: 'Late Night Classics', nextTime: '9:00 PM' };
    } else {
      // Late Night Classics (9:01 PM - 12:00 AM)
      let b: ScheduleBlock;
      if (isWeekday) {
        b = { url: 'https://www.desizoneradio.com/relay1', title: 'Late Night Hits', artist: 'Late Night Classics', mode: 'live' };
      } else if (isWeekend) {
        b = { url: 'https://stream.zeno.fm/jmi0hwxrgmauv', title: 'Hindi Retro', artist: 'Late Night Classics', mode: 'live' };
      } else {
        b = { url: 'https://ice1.somafm.com/deepspaceone-128-mp3', title: 'Neo-Soul & Deep House', artist: 'Late Night Classics', mode: 'live' };
      }
      return { block: b, nextTitle: 'Night Retro Block', nextTime: '12:00 AM' };
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
