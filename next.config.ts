import type { NextConfig } from "next";

const isExport = process.env.EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" } : {}),
  images: { unoptimized: true },
};

export default nextConfig;