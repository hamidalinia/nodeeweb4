import React, { ReactNode } from 'react';
import { getResponsiveClass } from '@/utils';

type RowProps = {
    settings: {
        style?: {
            fields?: React.CSSProperties;
        };
        responsive?: {
            showInMobile?: boolean;
            showInDesktop?: boolean;
        };
    };
    children: ReactNode;
};

export default function Row({ settings, children }: RowProps) {
    const style = settings?.style?.fields || {};
    const responsive = settings?.responsive || {};
    const visibilityClasses = getResponsiveClass(responsive);


    // flex-wrap
    return (
        <div className={`${visibilityClasses} row flex gap-4`} style={style}>
            {/*{JSON.stringify(responsive)}*/}
            {/*{JSON.stringify(visibilityClasses)}*/}
            {children}
        </div>
    );
}
