// Talent is served under /talent on the website's port (Next.js multi-zones).
// Kept free of imports because next.config.ts loads it too.
export const basePath = "/talent";

// next/image does not add basePath to string sources, so files from public/ need it.
export function publicPath(path: string) {
  return `${basePath}${path}`;
}
