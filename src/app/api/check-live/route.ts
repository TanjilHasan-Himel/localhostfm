import { NextResponse } from 'next/server';

export async function GET() {
  const streamUrl = process.env.STREAM_URL;

  if (!streamUrl) {
    return NextResponse.json({ isLive: false });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout

    // Request the stream url
    const res = await fetch(streamUrl, {
      signal: controller.signal,
      headers: {
        'Range': 'bytes=0-0', // Request minimum data
      },
    });

    clearTimeout(timeoutId);
    
    // We only need the headers to know if it's active (200 OK)
    // Abort immediately so we don't download the infinite audio stream!
    controller.abort();

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('audio') || contentType.includes('ogg')) {
        return NextResponse.json({ isLive: true });
      } else {
        // Probably a Cloudflare HTML error page
        return NextResponse.json({ isLive: false });
      }
    } else {
      return NextResponse.json({ isLive: false });
    }
  } catch (error) {
    // If connection refused, timeout, or aborted -> not live
    return NextResponse.json({ isLive: false });
  }
}
