import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 keeps the smooth wall in the product photo free of JPEG banding.
    qualities: [75, 90],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
