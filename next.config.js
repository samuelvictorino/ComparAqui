/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',  // Importante para build estático
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/compar-aqui' : ''
}

module.exports = nextConfig
