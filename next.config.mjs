/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
