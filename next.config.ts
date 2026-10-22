import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // The floating dev badge sits on top of the deck's Play button.
  devIndicators: false,
  transpilePackages: ["three"],
  experimental: { optimizePackageImports: ["motion", "@react-three/drei"] },
};

export default config;
