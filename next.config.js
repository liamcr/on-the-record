/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "i.scdn.co",
      },
      {
        hostname: "on-the-record-images.s3.amazonaws.com",
      },
      {
        hostname: "on-the-record-images.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
