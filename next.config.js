// next.config.js - CLEAN VERSION FOR NEXT.JS 15
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // ❌ REMOVE THIS LINE: swcMinify: true, (deprecated in Next.js 15)
}

module.exports = nextConfig
