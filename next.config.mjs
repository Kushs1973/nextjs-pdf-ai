/** @type {import('next').NextConfig} */
const nextConfig = {
  // We removed the external packages rule so Vercel will now bundle the tool correctly.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
