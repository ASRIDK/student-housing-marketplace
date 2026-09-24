import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not generate AGENTS.md / CLAUDE.md on `next dev`.
  agentRules: false,
  images: {
    remotePatterns: [
      // Placeholder photos used by src/lib/mock-data.ts
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
