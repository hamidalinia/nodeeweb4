import React, { useEffect, useRef, useState, useCallback } from 'react';
import NextImage from 'next/image';
import { getBaseUrl } from '@/constants/config';

type ImageProps = {
    settings?: {
        style?: React.CSSProperties;
        content?: {
            classes?: string;
            src?: string | null;
            alt?: string;
            link?: string;
        };
    };
};

export default function Image({ settings }: ImageProps) {
    const style = settings?.style || {};
    const classes = settings?.content?.classes || '';
    const alt = settings?.content?.alt || 'image';
    const link = settings?.content?.link || undefined;

    // Safely get and normalize the image source
    const getSafeSrc = (src: string | undefined | null): string => {
        const BaseConfig = 'https://asakala.shop'; // Consider making this configurable

        if (!src) return '/default.jpg';

        try {
            // Handle cases where src might be an object or other non-string
            const srcStr = typeof src === 'string' ? src : '/default.jpg';

            // Check if it's already a full URL
            if (/^https?:\/\//i.test(srcStr)) {
                return srcStr;
            }

            // Handle relative paths
            return srcStr.startsWith('/')
                ? BaseConfig + srcStr
                : `${BaseConfig}/${srcStr}`;
        } catch (error) {
            console.error('Error processing image src:', error);
            return '/default.jpg';
        }
    };

    const [imgSrc, setImgSrc] = useState(() => {
        const initialSrc = settings?.content?.src;
        return getSafeSrc(initialSrc);
    });

    const anchorRef = useRef<HTMLAnchorElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const wrapperRef = link ? anchorRef : divRef;
    const [parentSize, setParentSize] = useState({ width: 300, height: 200 });

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

    const ImageElement = (
        <NextImage
            src={imgSrc}
            alt={alt}
            width={parentSize.width}
            height={parentSize.height}
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