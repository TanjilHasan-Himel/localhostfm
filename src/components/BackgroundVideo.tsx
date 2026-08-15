'use client';

import { useEffect, useState } from 'react';

export default function BackgroundVideo() {
  const [videoSrc, setVideoSrc] = useState<string>('');

  useEffect(() => {
    // Function to calculate and set the video based on Dhaka time
    const updateVideo = () => {
      const now = new Date();
      const dhakaTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
      const dhakaNow = new Date(dhakaTimeStr);
      
      const hour = dhakaNow.getHours();
      const minute = dhakaNow.getMinutes();
      const timeInMinutes = hour * 60 + minute;

      // 6:01 AM (6 * 60 + 1 = 361) to 6:59 PM (18 * 60 + 59 = 1139) -> bgv_1 (Day Theme)
      // Otherwise -> bgv_2 (Night Theme)
      if (timeInMinutes >= 361 && timeInMinutes <= 1139) {
        setVideoSrc('/video/bgv_1.mp4');
      } else {
        setVideoSrc('/video/bgv_2.mp4');
      }
    };

    updateVideo();
    
    // Check every minute if the background needs to change
    const interval = setInterval(updateVideo, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!videoSrc) return null;

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      src={videoSrc}
    />
  );
}
