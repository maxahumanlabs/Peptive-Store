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
      // Canonical category URLs — used in ads and menu links
      { source: '/collections/all', destination: '/collections/all/products' },
      { source: '/collections/oral-peptide-supplements', destination: '/oral-peptides' },
    ];
  },
  async redirects() {
    return [
      // Old short URLs → canonical /collections/* (preserves ad / share traffic)
      { source: '/all', destination: '/collections/all', permanent: true },
      { source: '/oral', destination: '/collections/oral-peptide-supplements', permanent: true },
      { source: '/products', destination: '/collections/all/products', permanent: true },
      { source: '/products/:slug*', destination: '/collections/all/products/:slug*', permanent: true },
    ];
  },
};

export default nextConfig;
