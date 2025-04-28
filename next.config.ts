import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Configure static HTML export
  distDir: 'out', // Set output directory to ./out/
  basePath: '/games/original/meme-match',
  images: { unoptimized: true }
};

export default nextConfig;
