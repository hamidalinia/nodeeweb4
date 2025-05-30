import React, { useState } from 'react';
import NextImage from 'next/image';
import { getBaseUrl } from '@/constants/config';

type ImageProps = {
    settings: {
        style?: {
            fields?: React.CSSProperties;
        };
        content?: {
            fields?: {
                src?: string;
                alt?: string;
            };
        };
    };
};

export default function Image({ settings }: ImageProps) {
    let BaseConfig=getBaseUrl()
    BaseConfig='https://asakala.shop'
    const style = settings?.style?.fields || {};
    const width = settings?.style?.fields?.width || null;
    const height = settings?.style?.fields?.width || null;
    let src = settings?.content?.fields?.src || '';
    const alt = settings?.content?.fields?.alt || 'image';
    src=src
        ? src.startsWith('/')
        ? BaseConfig+src
        : `${BaseConfig}/${src}`
        : '/default.jpg'
    const [imgSrc, setImgSrc] = useState(() => {
        const baseUrlFromWindow = typeof window !== 'undefined' && (window as any).BASE_URL;
        const baseUrlFromEnv = process.env.NEXT_PUBLIC_BASE_URL || '';
        const baseUrl = baseUrlFromWindow || baseUrlFromEnv;

        if (!src) return '/default.jpg';
        if (src.startsWith('http')) return src;

        return `${baseUrl.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
    });

    return (
        <div style={{ position: 'relative', ...style }}>
            <img
                src={src}
                alt={alt}
                // layout="responsive"
                width={width ? width : null}
                height={height ? height : null}
                onError={() => setImgSrc('/default.jpg')}
                style={{ objectFit: 'cover' }}
            />
        </div>
    );
}
