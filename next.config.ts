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
        destination: `https://food-hub-backend-ykcc.onrender.com/auth/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `https://food-hub-backend-ykcc.onrender.com/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
