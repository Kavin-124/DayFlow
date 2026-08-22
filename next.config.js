/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/api/**/*': ['./prisma/dev.db', './prisma/**/*'],
  },
};

module.exports = nextConfig;
