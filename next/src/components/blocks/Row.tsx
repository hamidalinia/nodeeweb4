import React, { ReactNode } from 'react';
import { getResponsiveClass } from '@/utils';

type RowProps = {
    settings?: {
        style?: React.CSSProperties;
        content?: {
            classes?: string;
        };
        responsive?: {
            showInMobile?: boolean;
            showInDesktop?: boolean;
        };
    };
    children: ReactNode;
};

export default function Row({ settings = {}, children }: RowProps) {
    // Destructure with defaults
    const { style = {}, content = {}, responsive = {} } = settings;
    const { classes = '' } = content;

    // Get visibility classes (always returns valid string)
    const visibilityClasses = getResponsiveClass(responsive);

    // Combine all classes
    const className = `${visibilityClasses} row flex gap-4 ${classes}`.trim();

    return (
        <div className={className} style={style}>
            {children}
        </div>
    );
}