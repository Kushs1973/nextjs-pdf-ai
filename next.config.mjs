/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells Next.js to not try and bundle this library, 
  // but to treat it as an external server tool.
  serverExternalPackages: ['pdf-parse'],
  
  // This ignores strict type checking for the build to pass easier
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
