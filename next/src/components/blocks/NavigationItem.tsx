import React, { ReactNode } from 'react';
import Link from 'next/link';

type NavigationItemProps = {
    settings: {
        style?: { fields?: React.CSSProperties };
        content?: {
            fields?: {
                link?: string;
                text?: string;
                borderRadious?: string;
            };
        };
    };
    children: ReactNode;
};

export default function NavigationItem({ settings, children }: NavigationItemProps) {
    const style = settings?.style?.fields || {};
    const {
        link = '#',
        text = 'Item',
        borderRadious = '0',
    } = settings?.content?.fields || {};

    const isExternal = link.startsWith('http');

    return (
        <div style={{ ...style, borderRadius: borderRadious }}>
            {isExternal ? (
                <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {text}
                </a>
            ) : (
                <Link href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {text}
                </Link>
            )}
            {children && <div style={{ paddingLeft: '15px' }}>{children}</div>}
        </div>
    );
}
