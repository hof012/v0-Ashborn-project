/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Explicitly set output to ensure Next.js detection
  output: "standalone",
  // Disable experimental features that might cause issues
  experimental: {
    appDir: true,
  },
  // Ensure TypeScript errors don't block deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure ESLint errors don't block deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
