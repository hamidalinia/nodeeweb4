import type { ResponsiveSetting } from '@/types/responsiveSetting';


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
    const showInMobile = responsive?.showInMobile === true;
    const showInDesktop = responsive?.showInDesktop === true;
    let prefix= '';
    if (!showInMobile && showInDesktop) {
        return prefix+' hidden md:flex'; // hidden on mobile, shown on desktop
    }

    if (showInMobile && !showInDesktop) {
        return prefix+' md:hidden'; // shown on mobile, hidden on desktop
    }

    if (!showInMobile && !showInDesktop) {
        return prefix+' '; // hidden on all devices
    }

    return prefix+' '; // visible everywhere
}