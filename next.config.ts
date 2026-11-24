import type { NextConfig } from "next";

// Static export: every route is rendered to HTML at build time and served by
// Cloudflare Pages. Server work (forms, email, database) lives in /functions.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
