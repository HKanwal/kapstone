/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  headers: () => [
    {
      source: '/notifications',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],
};

const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  ...nextConfig,
});
