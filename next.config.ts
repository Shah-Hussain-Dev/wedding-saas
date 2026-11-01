import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      {
        source: "/templates/:slug",
        destination: "/preview/:slug",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
