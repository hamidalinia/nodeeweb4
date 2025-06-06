import React, {useState} from 'react';
import {getBaseUrl} from '@/constants/config';

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

export default function Image({settings}: ImageProps) {
    let BaseConfig = getBaseUrl()
    BaseConfig = 'https://asakala.shop'
    const style = settings?.style || {};
    const width = settings?.style?.width || undefined;
    const height = settings?.style?.width || undefined;
    const classes = settings?.content?.classes || '';
    let src = settings?.content?.src || '';
    const alt = settings?.content?.alt || 'image';
    const link = settings?.content?.link || undefined;
    src = src
        ? src.startsWith('/')
            ? BaseConfig + src
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
    if (link)
        return (
            <a className={`${classes}`} href={link} style={{display:'block',position: 'relative', overflow: 'hidden', ...style}}>
                <img
                    src={src}
                    alt={alt}
                    // layout="responsive"
                    width={width ? width : undefined}
                    height={height ? height : undefined}
                    onError={() => setImgSrc('/default.jpg')}
                    style={{objectFit: 'cover'}}
                />
            </a>
        );
    return (
            <img
                className={`${classes}`}
                src={src}
                alt={alt}
                // layout="responsive"
                width={width ? width : undefined}
                height={height ? height : undefined}
                onError={() => setImgSrc('/default.jpg')}
                style={{display:'block',position: 'relative', overflow: 'hidden', ...style}}
            />
    );
    // return (
    //     <div style={{position: 'relative', overflow: 'hidden', ...style}}>
    //         <img
    //             src={src}
    //             alt={alt}
    //             // layout="responsive"
    //             width={width ? width : undefined}
    //             height={height ? height : undefined}
    //             onError={() => setImgSrc('/default.jpg')}
    //             style={{objectFit: 'cover'}}
    //         />
    //     </div>
    // );
}
