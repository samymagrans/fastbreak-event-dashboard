/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  output: "standalone", // ✅ ensures server rendering instead of static export
  reactStrictMode: true,
};

module.exports = nextConfig;
