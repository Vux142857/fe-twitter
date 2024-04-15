/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    customKey: "my-value",
    SERVER: "http://localhost:3000",
    JWT_SECRET_ACCESS_TOKEN: "@vu150802",
    JWT_SECRET_REFRESH_TOKEN: "@vu140923",
    NEXTAUTH_SECRET: "@vu070802",
    CLIENT: "http://localhost:3001",
    WORKER: "http://localhost:3002",
  },
  images: {
    domains: [
      "localhost",
      "mytwt-api.xyz",
      "png.pngtree.com",
      "mytweets-bucket.s3.ap-southeast-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
