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
      // Mimic a real browser to prevent radio servers from dropping the connection
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Icy-MetaData': '1', // Important for shoutcast/icecast
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
