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
  title: "tdoubleh fm",
  description: "Welcome to T Double H FM, the ultimate live radio station curated by Tanjil Hasan Himel. Enjoy 24/7 lofi beats, morning routines, and live broadcasts.",
  authors: [{ name: "Tanjil Hasan Himel" }],
  keywords: ["radio", "T Double H FM", "lofi", "live stream", "Tanjil Hasan Himel", "music", "broadcast"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "T Double H FM",
  },
  openGraph: {
    title: "T Double H FM | Live 24/7 Radio",
    description: "Welcome to T Double H FM, the ultimate live radio station curated by Tanjil Hasan Himel. Enjoy 24/7 lofi beats, morning routines, and live broadcasts.",
    url: "https://tdoubleh.fm",
    siteName: "T Double H FM",
    images: [
      {
        url: "/bg_images/laptop and pc/bg_day_pc.jpg",
        width: 1200,
        height: 630,
        alt: "T Double H FM Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "T Double H FM | Live 24/7 Radio",
    description: "Welcome to T Double H FM, curated by Tanjil Hasan Himel.",
    images: ["/bg_images/laptop and pc/bg_day_pc.jpg"],
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
