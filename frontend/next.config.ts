import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repositoryName = "StartUp-Copilot";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        assetPrefix: `/${repositoryName}`,
        basePath: `/${repositoryName}`,
        images: {
          unoptimized: true
        },
        output: "export" as const
      }
    : {}),
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
  poweredByHeader: false
};

export default nextConfig;
