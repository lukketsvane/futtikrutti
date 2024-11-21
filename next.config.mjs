/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@splinetool/react-spline'],
  images: {
    domains: ['prod.spline.design'],
  },
}

export default nextConfig