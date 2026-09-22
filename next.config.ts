import type { NextConfig } from "next";

const isExport = process.env.EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" } : {}),
  images: { unoptimized: true },
  devIndicators: false,
  allowedDevOrigins: ["172.28.64.1", "192.168.100.22", "192.168.56.1"],
};

export default nextConfig;