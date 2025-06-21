export const globalTimerSet=60;
export const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return window.BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL!;
    }
    return process.env.NEXT_PUBLIC_BASE_URL!;
};

