/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'peptivepeptides.local',
      },
      {
        protocol: 'https',
        hostname: 'peptivepeptides.local',
      },
    ],
  },
};

export default nextConfig;
