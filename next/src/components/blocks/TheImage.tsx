import React, { useState } from 'react';
import NextImage from 'next/image';

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
    const style = settings?.style?.fields || {};
    const src = settings?.content?.fields?.src || '';
    const alt = settings?.content?.fields?.alt || 'image';

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
            <NextImage
                src={imgSrc}
                alt={alt}
                // layout="responsive"
                width={500}
                height={300}
                onError={() => setImgSrc('/default.jpg')}
                style={{ objectFit: 'cover' }}
            />
        </div>
    );
}
