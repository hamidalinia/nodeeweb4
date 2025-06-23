import type { ResponsiveSetting } from '@/types/responsiveSetting';
import { logout } from '@/store/slices/userSlice'; // Import logout action
import { AppDispatch } from '@/store'; // Import AppDispatch type


export const PriceFormat = (p = 0) =>
    p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatPrice = (price: number | string | null,  currency: string) => {
    if (!price) return '';
    return `${price.toLocaleString()} ${currency || ''}`;
};
export const NormalizePrice = (p?: string | number): number => {
    if (!p) return 0;
    if (typeof p === 'string') {
        return Number(p.replace(/,/g, ''));
    }
    return p;
};



export function getResponsiveClass(responsive?: ResponsiveSetting): string {
    // Default to true if not specified
    responsive={
        showInMobile:null,
        showInDesktop:null,
        ...responsive
    }
    const showInMobile = responsive?.showInMobile === true;
    const showInDesktop = responsive?.showInDesktop === true;
    let prefix= '';
    if (!showInMobile && showInDesktop) {
        // console.log("!showInMobile && showInDesktop",responsive)

        return prefix+' hidden md:flex'; // hidden on mobile, shown on desktop
    }

    if (showInMobile && !showInDesktop) {
        // console.log("showInMobile && !showInDesktop",responsive)

        return prefix+' md:hidden'; // shown on mobile, hidden on desktop
    }

    if (!showInMobile && !showInDesktop) {
        // console.log("!showInMobile && !showInDesktop",responsive)

        return prefix+' '; // hidden on all devices
    }
    // console.log("all",responsive)

    return prefix+' '; // visible everywhere
}


// Get token from localStorage directly
export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;

    try {
        const serializedState = localStorage.getItem('persist:root');
        if (!serializedState) return null;

        const parsedState = JSON.parse(serializedState);
        const userState = JSON.parse(parsedState.user);
        return userState.token || null;
    } catch (error) {
        console.error('Failed to get token from localStorage', error);
        return null;
    }
};



export const checkCodeMeli = (code: string) => {
    if (!code) return;
    let L = code.length;

    if (L < 8 || parseInt(code, 10) == 0) return false;
    code = ('0000' + code).substr(L + 4 - 10);
    if (parseInt(code.substr(3, 6), 10) == 0) return false;
    let c = parseInt(code.substr(9, 1), 10);
    let s = 0;
    for (let i = 0; i < 9; i++) s += parseInt(code.substr(i, 1), 10) * (10 - i);
    s = s % 11;
    return (s < 2 && c == s) || (s >= 2 && c == 11 - s);
    return true;
};

export const isPersianText=(str: string)=> {
    let p = /^[\u0600-\u06FF\s]+$/;

    if (!p.test(str)) {
        return false;
    } else {
        return true;
    }
}

export const clearToken = (dispatch: AppDispatch): void => {
    dispatch(logout());
};