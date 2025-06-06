import React, { useEffect, useRef, useState,useCallback } from 'react';
import NextImage from 'next/image';
import { getBaseUrl } from '@/constants/config';

type ImageProps = {
    settings?: {
        style?: React.CSSProperties;
        content?: {
            classes?: string;
            src?: string;
            alt?: string;
            link?: string;
        };
    };
};

export default function Image({ settings }: ImageProps) {
    let BaseConfig = getBaseUrl();
    BaseConfig = 'https://asakala.shop';

    const style = settings?.style || {};
    const classes = settings?.content?.classes || '';
    let src = settings?.content?.src || '';
    const alt = settings?.content?.alt || 'image';
    const link = settings?.content?.link || undefined;

    // Normalize src
    src = src
        ? src.startsWith('/')
            ? BaseConfig + src
            : `${BaseConfig}/${src}`
        : '/default.jpg';

    const [imgSrc, setImgSrc] = useState(() => {
        const baseUrlFromWindow = typeof window !== 'undefined' && (window as any).BASE_URL;
        const baseUrlFromEnv = process.env.NEXT_PUBLIC_BASE_URL || '';
        const baseUrl = baseUrlFromWindow || baseUrlFromEnv;

        if (!src) return '/default.jpg';
        if (src.startsWith('http')) return src;

        return `${baseUrl.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
    });
    const anchorRef = useRef<HTMLAnchorElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const wrapperRef = link ? anchorRef : divRef;

    // const wrapperRef = useRef<HTMLElement>(null);
    const [parentSize, setParentSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    const updateSize = useCallback(() => {
        const parent = wrapperRef.current?.parentElement;
        if (!parent) return;

        const rect = parent.getBoundingClientRect();
        setParentSize({
            width: rect.width || 300,
            height: rect.height || 200,
        });
    }, [wrapperRef]);

    useEffect(() => {
        updateSize();

        const parent = wrapperRef.current?.parentElement;
        if (!parent) return;

        const observer = new ResizeObserver(updateSize);
        observer.observe(parent);

        return () => observer.disconnect();
    }, [updateSize, wrapperRef]);

    const width = parentSize.width || 300;
    const height = parentSize.height || 200;

    const ImageElement = (
        <NextImage
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            onError={() => setImgSrc('/default.jpg')}
            className={classes}
            style={{
                display: 'block',
                position: 'relative',
                overflow: 'hidden',
                objectFit: 'cover',
                ...style,
            }}
            unoptimized
        />
    );

    return link ? (
        <a
            href={link}
            ref={anchorRef}
            style={{ display: 'block', position: 'relative', overflow: 'hidden', ...style }}
            className={classes}
        >
            {ImageElement}
        </a>
    ) : (
        <div ref={divRef} style={{ display: 'block', ...style }}>
            {ImageElement}
        </div>
    );
}
