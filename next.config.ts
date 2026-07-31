import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: false, // Temporarily enabled for local Push Notification testing
});

const nextConfig: NextConfig = {
  turbopack: {},
  allowedDevOrigins: ['192.168.1.172', 'localhost'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default withPWA(nextConfig);
