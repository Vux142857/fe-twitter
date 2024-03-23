/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    customKey: "my-value",
    SERVER: "http://localhost:3000",
    JWT_SECRET_ACCESS_TOKEN: "@vu150802",
    JWT_SECRET_REFRESH_TOKEN: "@vu140923",
    NEXTAUTH_SECRET: "@vu070802",
  },
  images: {
    domains: ["localhost", "png.pngtree.com"],
  },
};

export default nextConfig;
