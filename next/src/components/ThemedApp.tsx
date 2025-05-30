// components/ThemedApp.tsx
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setThemeData } from '@/store/slices/themeSlice';
import Head from 'next/head';
import Script from 'next/script';
import { Toaster } from 'sonner';

interface ThemedAppProps {
    Component: any;
    pageProps: any;
    serverTheme?: any;
}

const ThemedApp = ({ Component, pageProps, serverTheme }: ThemedAppProps) => {
    const dispatch = useDispatch();
    const [theme, setTheme] = useState(serverTheme || null);
    const [mode, setMode] = useState<'light' | 'dark'>(serverTheme?.mode || 'light');
    const [isReady, setIsReady] = useState(!!serverTheme);

    useEffect(() => {
        if (theme) {
            dispatch(setThemeData(theme));
        }
    }, [theme]);

    useEffect(() => {
        const fetchTheme = async () => {
            const baseUrl = (window as any).BASE_URL;
            if (!theme && baseUrl) {
                try {
                    const res = await fetch(`${baseUrl}/theme`);
                    const data = await res.json();
                    setTheme(data);
                    setMode(data?.mode || 'light');
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
        document.documentElement.classList.toggle('dark', mode === 'dark');
    }, [mode]);

    const toggleMode = () => {
        setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
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
            <Head>
                <title>AsaKala</title>
            </Head>
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
