import React, { ReactNode } from 'react';
import { getResponsiveClass } from '@/utils';

type ColProps = {
    settings: {
        style?:  React.CSSProperties;
        content?: {
                classes?:string;
        };
        responsive?: {
            showInMobile?: boolean;
            showInDesktop?: boolean;
        };
    };
    children: ReactNode;
};

export default function Col({ settings, children }: ColProps) {
    let classes = settings?.content?.classes || '';
    const style = settings?.style || {};
    const responsive = settings?.responsive;
    const visibilityClasses = getResponsiveClass(responsive);

    return (
        <div className={`${visibilityClasses} col ${classes}`} style={style}>
            {children}
        </div>
    );
}
