import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.glsl$/,
      use: [ 'webpack-glsl-loader' ]
    })
    return config
  }
};

export default nextConfig;
