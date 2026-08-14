import { NextResponse } from 'next/server';

/**
 * SECURE API ROUTE: /api/stream-url
 * 
 * SECURITY: The stream URL is stored in the server-side environment variable
 * STREAM_URL (set in .env.local or Vercel dashboard).
 * It is NEVER exposed to the client JS bundle.
 * The client only ever receives the URL via this API call, which is rate-limited
 * by our middleware. A hacker inspecting the network tab will only see:
 * GET /api/stream-url → { url: "..." }
 * But this can be further secured with auth tokens if needed.
 */
export async function GET() {
  // Pull stream URL from server-side env only
  const streamUrl = process.env.STREAM_URL || 'https://stream.zeno.fm/f3wvbbqmdg8uv';

  // Validate it's a legitimate URL before returning (prevents env poisoning)
  try {
    new URL(streamUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid stream URL configured' }, { status: 500 });
  }

  return NextResponse.json(
    { url: streamUrl },
    {
      status: 200,
      headers: {
        // Do not cache this response
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
