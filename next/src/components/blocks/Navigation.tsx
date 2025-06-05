import React, { ReactNode } from 'react';

type NavigationProps = {
    settings: {
        style?: React.CSSProperties;
        content?: { colCount?: number; type?: string; classes?: string; };
    };
    children: ReactNode;
};

export default function Navigation({ settings, children }: NavigationProps) {
    const style = settings?.style || {};
    const navType = settings?.content?.type || 'simple';
    const classes = settings?.content?.classes || '';

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
