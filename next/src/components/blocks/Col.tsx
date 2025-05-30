import React, { ReactNode } from 'react';
import { getResponsiveClass } from '@/utils';

type ColProps = {
    settings: {
        style?: {
            fields?: React.CSSProperties;
        };
        content?: {
            fields?: {
                classes?:string;
            };
        };
        responsive?: {
            showInMobile?: boolean;
            showInDesktop?: boolean;
        };
    };
    children: ReactNode;
};

export default function Col({ settings, children }: ColProps) {
    let classes = settings?.content?.fields?.classes || '';
    const style = settings?.style?.fields || {};
    const responsive = settings?.responsive;
    const visibilityClasses = getResponsiveClass(responsive);

    return (
        <div className={`${visibilityClasses} col ${classes}`} style={style}>
            {children}
        </div>
    );
}
