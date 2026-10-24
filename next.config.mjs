/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack configuration for Next.js 16+
  turbopack: {
    resolveAlias: {
      canvas: false,
    },
  },
  // Keep webpack config for fallback
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
