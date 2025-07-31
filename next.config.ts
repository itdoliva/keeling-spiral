import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

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
const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
