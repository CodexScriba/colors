import type { NextConfig } from "next";

const nextConfig = {
  turbopack: {
    // Ensure Next.js treats this directory as the workspace root.
    root: process.cwd(),
  },
} satisfies NextConfig;

export default nextConfig;
