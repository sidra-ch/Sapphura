/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['zeesy.pk', 'cdn.shopify.com', 'res.cloudinary.com'],
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
