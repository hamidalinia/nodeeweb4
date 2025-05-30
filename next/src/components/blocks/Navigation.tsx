import React, { ReactNode } from 'react';

type NavigationProps = {
    settings: {
        style?: { fields?: React.CSSProperties };
        content?: { fields?: { colCount?: number; type?: string; classes?: string; } };
    };
    children: ReactNode;
};

export default function Navigation({ settings, children }: NavigationProps) {
    const style = settings?.style?.fields || {};
    const navType = settings?.content?.fields?.type || 'simple';
    const classes = settings?.content?.fields?.classes || '';

    return (
        <nav
            className={classes}
            style={{
                display: 'flex',
                flexDirection: navType === 'simple' ? 'row' : 'column',
                gap: '10px',
                ...style,
            }}
        >
            {children}
        </nav>
    );
}
