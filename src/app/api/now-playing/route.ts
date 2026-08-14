import { NextResponse } from 'next/server';

// This simulates a secure backend fetch where you might use secret API keys
// to get metadata about the currently playing track from your streaming server (e.g. Zeno, Icecast, etc.)
export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Dummy response
  const currentTrack = {
    title: 'Midnight Coding Sessions',
    artist: 'Localhost FM Chill',
    cover: '/bg.jpg', // Using the background image as the dummy cover art
  };

  return NextResponse.json(currentTrack);
}
