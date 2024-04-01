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
  },
  images: {
    domains: [
      "localhost",
      "png.pngtree.com",
      "mytweets-bucket.s3.ap-southeast-1.amazonaws.com",
    ],
  },
  ignoreServerErrors: [
    /(data-new-gr-c-s-check-loaded)|(data-gr-ext-installed)/,
  ],
};

export default nextConfig;
