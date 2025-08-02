import type { NextConfig } from "next";

const baseURL = process.env.BACKEND_BASE_URL;
const S3URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

if (!baseURL || !S3URL) {
  throw new Error("필수 환경변수가 정의되어 있지 않습니다.");
}

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL(`${S3URL}/**`)],
  },
  async rewrites() {
    return [
      {
        source: "/api/s3/upload/:path*",
        destination: `${S3URL}/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${baseURL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
