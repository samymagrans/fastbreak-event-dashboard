/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',   // optional default
    },
  },
  output: 'standalone',
  reactStrictMode: true,
};

module.exports = nextConfig;
