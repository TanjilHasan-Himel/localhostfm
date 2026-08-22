import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const streamUrl = searchParams.get('url');

  if (!streamUrl) {
    return new Response('Missing stream URL', { status: 400 });
  }

  try {
    // Fetch the external stream
    const response = await fetch(streamUrl, {
      // Avoid timeouts by not setting a signal or timeout on edge runtime
      headers: {
        'User-Agent': 'TDoubleHFM-Proxy/1.0',
        'Accept': '*/*',
      }
    });

    if (!response.ok || !response.body) {
      return new Response('Failed to connect to the upstream radio', { status: response.status });
    }

    // Pipe the response back to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*', // Optional, if you want to allow external embedding
      },
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return new Response('Proxy Error', { status: 500 });
  }
}
