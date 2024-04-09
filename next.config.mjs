/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    customKey: "my-value",
    SERVER: "https://mytwt-api.xyz",
    JWT_SECRET_ACCESS_TOKEN: "@vu150802",
    JWT_SECRET_REFRESH_TOKEN: "@vu140923",
    NEXTAUTH_SECRET: "@vu070802",
    CLIENT: "https://mytweet.one",
  },
  images: {
    domains: [
      "localhost",
      "mytwt-api.xyz",
      "png.pngtree.com",
      "mytweets-bucket.s3.ap-southeast-1.amazonaws.com",
    ],
  }
};

export default nextConfig;
