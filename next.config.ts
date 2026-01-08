import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tourwithalpha.shop',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
