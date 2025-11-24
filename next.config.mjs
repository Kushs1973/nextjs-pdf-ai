/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells Vercel: "Don't try to compress this tool, run it raw."
  serverExternalPackages: ['pdf-parse'], 
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
