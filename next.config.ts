import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "cinemago-user-one.vercel.app",
          },
        ],
        destination: "https://cinema-go-vn.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
