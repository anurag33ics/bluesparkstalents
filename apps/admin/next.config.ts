import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Served under /admin on the website's port (Next.js multi-zones).
  basePath: "/admin",
};

export default nextConfig;
