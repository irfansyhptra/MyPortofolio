/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/testimonials/:path*",
        destination: "http://localhost:5000/api/testimonials/:path*",
      },
      {
        source: "/api/admin/testimonials/:path*",
        destination: "http://localhost:5000/api/admin/testimonials/:path*",
      },
    ];
  },
};

export default nextConfig;
