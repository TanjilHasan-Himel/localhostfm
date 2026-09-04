import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "T Double H FM | Live Radio Online by Tanjil Hasan Himel",
  description: "Listen to T Double H FM, the best radio online curated by Tanjil Hasan Himel. Enjoy 24/7 live stream, BD radio, radio Bangladesh, and lofi beats. Your favorite online radio station.",
  authors: [{ name: "Tanjil Hasan Himel" }],
  keywords: [
    "radio", 
    "Tanjil hasan Himel", 
    "Tanjil Hasan Himel", 
    "radio bangladesh", 
    "radio online", 
    "bd radio", 
    "T Double H FM", 
    "online radio", 
    "live radio", 
    "bangladesh radio", 
    "lofi", 
    "live stream", 
    "music", 
    "broadcast"
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "T Double H FM",
  },
  openGraph: {
    title: "T Double H FM | BD Radio & Radio Online by Tanjil Hasan Himel",
    description: "Listen to T Double H FM, the ultimate live radio online curated by Tanjil Hasan Himel. Experience the best BD radio and radio Bangladesh streams 24/7.",
    url: "https://tdoubleh.fm",
    siteName: "T Double H FM",
    images: [
      {
        url: "/bg_images/laptop and pc/bg_day_pc.jpg",
        width: 1200,
        height: 630,
        alt: "T Double H FM Cover - Tanjil Hasan Himel",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "T Double H FM | BD Radio & Radio Online by Tanjil Hasan Himel",
    description: "Listen to T Double H FM, the ultimate live radio online curated by Tanjil Hasan Himel. Experience the best BD radio and radio Bangladesh streams 24/7.",
    images: ["/bg_images/laptop and pc/bg_day_pc.jpg"],
  },
  verification: {
    google: "oN3On5ty2PkDCVH0lDfClKwoRWtfLoTYfzccC-DUqdA",
  },
};

import { AudioProvider } from "@/context/AudioContext";
import BackgroundVideo from "@/components/BackgroundVideo";

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundVideo />
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
