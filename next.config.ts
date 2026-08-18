import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking attacks
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing (old-school attack)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block XSS in older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Control referrer data sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Strict HTTPS - tells browsers never to use HTTP (HSTS)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Restrict dangerous browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Content Security Policy — the main shield against XSS, data injection, prompt injection via content
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Allow Next.js inline scripts and our own scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Allow our own styles + Google Fonts (for future use)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Only allow images from our own domain and data URIs
      "img-src 'self' data: blob:",
      // Allow fonts from Google and self
      "font-src 'self' https://fonts.gstatic.com",
      // CRITICAL: Only allow audio streams from our own API proxy and trusted radio CDNs
      "media-src 'self' blob: https://stream.zeno.fm http://localhost:8000 https://*.trycloudflare.com https://*.somafm.com https://*.bbcmedia.co.uk https://*.talksport.com http://listen.181fm.com https://*.desizoneradio.com https://*.uber.radio https://*.surfernetwork.com",
      // Allow connections to our own API routes only
      "connect-src 'self' https://stream.zeno.fm http://localhost:8000 https://*.trycloudflare.com https://*.somafm.com https://*.bbcmedia.co.uk https://*.talksport.com http://listen.181fm.com https://*.desizoneradio.com https://*.uber.radio https://*.surfernetwork.com",
      // Never allow framing from other sites
      "frame-ancestors 'none'",
      // Prevent form submissions to external sites
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to ALL routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
