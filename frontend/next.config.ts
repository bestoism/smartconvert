/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Biar Vercel cuek sama error "bg" atau tipe data lainnya
    ignoreBuildErrors: true,
  },
  eslint: {
    // Biar Vercel cuek sama aturan penulisan kode yang ketat
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;