/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static export
  distDir: 'out', // Output directory (optional)
  images: {
    unoptimized: true // Required for static export
  },
  basePath: "", // For if you're deploying to a subpath
  trailingSlash: true, // Fixed typo, adds trailing slashes to URLs
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;