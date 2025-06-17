/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for your DApp
  distDir: 'out', // Explicit output directory
  images: {
    unoptimized: true, // Required for static exports
  },
  // Optional: Enable Webpack 5 (better for pnpm)
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};


export default nextConfig;