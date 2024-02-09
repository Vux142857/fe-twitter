/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    customKey: "my-value",
    SERVER: "http://localhost:3000",
    JWT_SECRET_ACCESS_TOKEN: "@vu150802",
    NEXTAUTH_SECRET: "@vu070802",
  },
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
