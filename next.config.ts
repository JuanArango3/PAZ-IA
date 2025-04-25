import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
    experimental: {
        serverActions: {
            allowedOrigins: ["pazia.jmarango.me"],
        },
    },
};

export default nextConfig;
