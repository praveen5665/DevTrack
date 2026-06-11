import type { NextConfig } from "next";

const isExport = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isExport && {
    output: "export",
    images: { unoptimized: true },
    // If deploying to <username>.github.io/<repo-name>, uncomment:
    // basePath: "/repo-name",
    // assetPrefix: "/repo-name/",
  }),
};

export default nextConfig;
