import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use empty turbopack config to suppress the warning.
  // pixi.js and pixi-live2d-display are imported dynamically (client-side only)
  // via 'use client' + dynamic import, so Turbopack handles them fine.
  turbopack: {},
};

export default nextConfig;
