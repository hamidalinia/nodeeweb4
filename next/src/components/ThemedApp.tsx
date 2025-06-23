import { useEffect, useState } from 'react';
import type { RootState } from '@/store';
import { setThemeData, toggleThemeMode } from '@/store/slices/themeSlice';
import Head from 'next/head';
import Script from 'next/script';
import { Toaster } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { ThemeMode } from '@/types/themeMode';
import type { ThemeData } from '@/types/themeData';

interface ThemedAppProps {
    Component: any;
    pageProps: any;
    serverTheme?: ThemeData | null;
}

const ThemedApp = ({ Component, pageProps, serverTheme }: ThemedAppProps) => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector((state: RootState) => state.theme.mode);
    const [theme, setTheme] = useState<ThemeData | null>(serverTheme || null);
    const [isReady, setIsReady] = useState(!!serverTheme);

    const toggleModeWithName = (name: ThemeMode) => {
        // Pass just the mode string, not an object
        dispatch(toggleThemeMode(name));
    };

    useEffect(() => {
        if (theme) {
            // Pass the full theme object
            dispatch(setThemeData(theme));
        }
    }, [theme, dispatch]);

    useEffect(() => {
        const fetchTheme = async () => {
            const baseUrl = (window as any).BASE_URL;
            if (!theme && baseUrl) {
                try {
                    const res = await fetch(`${baseUrl}/theme`);
                    const data = await res.json();
                    setTheme(data);
                    // Ensure we're passing just the mode string
                    toggleModeWithName(data?.mode || 'light');
                } catch (error) {
                    console.error('Client theme fetch error:', error);
                } finally {
                    setIsReady(true);
                }
            } else {
                setIsReady(true);
            }
        };

        if (typeof window !== 'undefined') {
            fetchTheme();
        }
    }, [theme]);

    useEffect(() => {
        // Handle possible null/undefined mode
        const effectiveMode = mode || 'light';
        document.documentElement.classList.toggle('dark', effectiveMode === 'dark');
    }, [mode]);

    const toggleMode = () => {
        // Toggle based on current mode
        const newMode = mode === 'dark' ? 'light' : 'dark';
        dispatch(toggleThemeMode(newMode));
    };

    if (!isReady) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
                <span className="text-lg animate-pulse">در حال بارگذاری...</span>
            </div>
        );
    }

    return (
        <>
            <Script src="/site_setting/config.js" strategy="beforeInteractive" />
            <Component
                {...pageProps}
                theme={theme}
                mode={mode}
                toggleMode={toggleMode}
            />
            <Toaster />
        </>
    );
};

export default ThemedApp;