import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tourwithalpha.shop',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'admin.tourwithalpha.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
