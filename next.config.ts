import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // If deploying to <username>.github.io/<repo-name>, uncomment and set:
  basePath: "/DevTrack",
  assetPrefix: "/DevTrack/",
  images: { unoptimized: true },
};

export default nextConfig;
