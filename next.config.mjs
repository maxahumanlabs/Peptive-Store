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
  async rewrites() {
    return [
      // "All Peptides" menu uses /all but serves the products listing page
      { source: '/all', destination: '/products' },
      // "Oral Peptides" menu uses /oral but serves the oral-peptides page
      { source: '/oral', destination: '/oral-peptides' },
    ];
  },
};

export default nextConfig;
