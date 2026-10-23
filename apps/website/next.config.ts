import type { NextConfig } from "next";

// The website is the single entry point: these apps run on their own ports but
// are reached through this one under the same path (Next.js multi-zones). Each
// sets a matching basePath in its own next.config.ts.
const zones = {
  talent: process.env.TALENT_URL ?? "http://localhost:3001",
  admin: process.env.ADMIN_URL ?? "http://localhost:3002",
  employers: process.env.EMPLOYERS_URL ?? "http://localhost:3003",
};

const nextConfig: NextConfig = {
  async rewrites() {
    return Object.entries(zones).flatMap(([zone, origin]) => [
      { source: `/${zone}`, destination: `${origin}/${zone}` },
      { source: `/${zone}/:path+`, destination: `${origin}/${zone}/:path+` },
    ]);
  },
};

export default nextConfig;
