import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.10"],
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
