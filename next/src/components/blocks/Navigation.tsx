import React, { ReactNode } from 'react';
import { getResponsiveClass } from '@/utils';

type NavigationProps = {
    settings?: {
        style?: React.CSSProperties;
        content?: { colCount?: number; type?: string; classes?: string; };
        responsive?: {
            showInMobile?: boolean;
            showInDesktop?: boolean;
        };
    };
    children: ReactNode;
};

export default function Navigation({ settings, children }: NavigationProps) {
    const style = settings?.style || {};
    const navType = settings?.content?.type || 'simple';
    const responsive = settings?.responsive || {};
    const classes = settings?.content?.classes || '';
    const visibilityClasses = getResponsiveClass(responsive);
    const className = `${visibilityClasses} w-full max-w-screen-sm mx-auto ${classes}`.trim();

    return (
        <nav
            className={className}
            style={{
                flexDirection: navType === 'simple' ? 'row' : 'column',
                gap: '10px',
                ...style,
            }}
        >
            {children}
        </nav>
    );
}
