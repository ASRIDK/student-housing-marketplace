import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not generate AGENTS.md / CLAUDE.md on `next dev`.
  agentRules: false,
  images: {
    remotePatterns: [
      // Stand-in apartment photography used by src/lib/mock-data.ts, until
      // students upload their own through the form.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
