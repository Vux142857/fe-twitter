/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    customKey: "my-value",
    HOST: "http://localhost:3000",
    JWT_SECRET_ACCESS_TOKEN: "@vu150802",
    NEXTAUTH_SECRET: "@vu070802",
  },
};

export default nextConfig;
