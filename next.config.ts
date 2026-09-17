import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder photos used by src/lib/mock-data.ts
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
