import i18nConfig from "./next-i18next.config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
        ...i18nConfig,
    // output: 'standalone',

    /* config options here */
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3002',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
