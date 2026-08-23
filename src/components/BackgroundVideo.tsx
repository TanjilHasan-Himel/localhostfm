'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function BackgroundVideo() {
  const [isDay, setIsDay] = useState<boolean | null>(null);
  const [isLowSpec, setIsLowSpec] = useState<boolean>(false);

  useEffect(() => {
    // Detect low-end device or slow network
    if (typeof window !== 'undefined') {
      const connection = (navigator as any).connection;
      const isSlowNetwork = connection && (connection.saveData || connection.effectiveType?.includes('2g') || connection.effectiveType === '3g');
      const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4;
      const isLowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      
      if (isSlowNetwork || isLowMemory || isLowCores) {
        setIsLowSpec(true);
        document.documentElement.classList.add('low-spec-mode');
      }
    }

    // Function to calculate and set the background based on Dhaka time
    const updateTheme = () => {
      const now = new Date();
      const dhakaTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
      const dhakaNow = new Date(dhakaTimeStr);
      
      const hour = dhakaNow.getHours();
      const minute = dhakaNow.getMinutes();
      const timeInMinutes = hour * 60 + minute;

      // 6:01 AM (6 * 60 + 1 = 361) to 6:59 PM (18 * 60 + 59 = 1139) -> Day Theme
      if (timeInMinutes >= 361 && timeInMinutes <= 1139) {
        setIsDay(true);
      } else {
        setIsDay(false);
      }
    };

    updateTheme();
    
    // Check every minute if the background needs to change
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  // Avoid hydration mismatch by not rendering anything until mounted
  if (isDay === null) return <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black/90"></div>;

  return (
    <>
      {/* MOBILE BACKGROUND (Image only, day or night) */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 block md:hidden bg-black/90">
        <Image 
          src={isDay ? "/bg_images/phone/bg_day_mobile.jpg" : "/bg_images/phone/bg_night_mobile.jpg"}
          alt="Mobile Background"
          fill
          quality={70}
          priority
          className="object-cover"
        />
      </div>

      {/* PC/LAPTOP BACKGROUND (Image for day, Video for night - unless low spec) */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 hidden md:block bg-black/90">
        {isDay ? (
          <Image 
            src="/bg_images/laptop and pc/bg_day_pc.jpg"
            alt="PC Day Background"
            fill
            quality={80}
            priority
            className="object-cover"
          />
        ) : isLowSpec ? (
          <Image 
            src="/bg_images/laptop and pc/bg_night_pc.jpg"
            alt="PC Night Background"
            fill
            quality={80}
            priority
            className="object-cover"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src="/bg_video/bgv_1_night.mp4.mp4"
          />
        )}
      </div>
    </>
  );
}
