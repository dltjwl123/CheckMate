import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://math-review-test.s3.ap-northeast-2.amazonaws.com/**"),
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.seonlim.site/:path*",
      },
    ];
  },
};

export default nextConfig;
