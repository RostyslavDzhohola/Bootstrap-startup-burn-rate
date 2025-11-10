import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Multiple lockfiles warning is informational and can be safely ignored
  // Next.js will use the lockfile in the current directory
  experimental: {
    browserDebugInfoInTerminal: true,
  },
  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
