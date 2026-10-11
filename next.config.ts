import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
