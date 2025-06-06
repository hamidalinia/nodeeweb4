// types/block.ts
import React from 'react';
import {ResponsiveSetting} from './responsiveSetting'
// interface ResponsiveSettings {
//     showInMobile?: boolean | null;
//     showInDesktop?: boolean | null;
// }

export type Block = {
    id: string;
    type: string;
    settings: {
        content?: any;
        style?: React.CSSProperties;
        responsive?: ResponsiveSetting | any; // More flexible but still supports the specific type
    };
    customQuery?: string;
    children?: Block[];
    fetchedProducts?: any;
    fetchedPosts?: any;
};
