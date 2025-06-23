// types/themeData.ts
import {ThemeMode} from './themeMode'

export interface ThemeData {
    mode: ThemeMode;

    primaryColor?: string;
    secondaryColor?: string;

    tax?: boolean;
    taxAmount?: number | string;

    data?: any;

    // Extended properties from your object
    currency?: 'Toman' | string;
    factore_shop_name?: string;

    footer?: {
        maxWidth?: string;
        backgroundColor?: string;
        classes?: string;
        padding?: string;
        elements?: any[]; // You can define a specific type if you know the structure
    };

    header?: {
        maxWidth?: string;
        backgroundColor?: string;
        classes?: string;
        padding?: string;
        showInDesktop?: string;
        [key: string]: any; // fallback for additional unknown properties
    };

    language?: string;

    forumMode?: boolean;
    gameMode?: boolean;
    guestMode?: boolean;
    learnMode?: boolean;
    socialMode?: boolean;

    passwordAuthentication?: boolean;
    showPricesToPublic?: boolean;

    orderExtraFields?: any[]; // ideally define structure if known
    registerExtraFields?: any[];

    unitMass?: 'gram' | 'kg' | string;

    [key: string]: any; // allow other dynamic keys just in case
}
