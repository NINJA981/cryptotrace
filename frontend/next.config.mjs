/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents double-render issues with cytoscape canvas in dev
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/landing.html',
      },
    ];
  },
};

export default nextConfig;
