import i18nConfig from "./next-i18next.config";
import type { NextConfig } from "next";
import TerserPlugin from 'terser-webpack-plugin';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
    ...i18nConfig,

    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['asakala.shop'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3002',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    webpack(config, { dev, isServer }) {
        // Only run this on client production build
        if (!dev && !isServer) {
            config.optimization.minimize = true;
            config.optimization.minimizer = [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true, // remove console.* calls
                            passes: 2,
                        },
                        format: {
                            comments: false, // remove comments
                        },
                    },
                    extractComments: false,
                }),
            ];
        }
        return config;
    },
};

// ✅ Wrap the config before exporting
export default withBundleAnalyzer(nextConfig);
