import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
