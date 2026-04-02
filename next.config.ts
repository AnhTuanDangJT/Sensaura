import type { NextConfig } from "next";
import path from "path";

// Pin Turbopack root to this repo so resolution stays stable (local dev + CI/Vercel).
const projectRoot = path.resolve(process.cwd());

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
