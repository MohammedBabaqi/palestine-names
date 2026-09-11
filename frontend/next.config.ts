import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  },
  // Ensure Three.js and R3F work correctly with Next.js
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  // Allow WebGL in experimental features
  experimental: {
    optimizePackageImports: ['framer-motion', 'zustand'],
  },
};

export default nextConfig;
