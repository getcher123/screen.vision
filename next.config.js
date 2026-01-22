/** @type {import('next').NextConfig} */
// next.config.js
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName =
  process.env.GITHUB_REPOSITORY?.split("/")?.[1] ||
  process.env.NEXT_PUBLIC_BASE_PATH ||
  "";
const basePath = isGithubPages && repoName ? `/${repoName}` : "";

const nextConfig = {
  ...(isGithubPages
    ? {
        output: "export",
        trailingSlash: true,
        basePath,
        assetPrefix: basePath,
        images: { unoptimized: true },
      }
    : {
        async rewrites() {
          return [
            {
              source: "/relay/static/:path*",
              destination: "https://us-assets.i.posthog.com/static/:path*",
            },
            {
              source: "/relay/:path*",
              destination: "https://us.i.posthog.com/:path*",
            },
          ];
        },
      }),
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
