// components/ThemedApp.tsx
import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { setThemeData,toggleThemeMode } from '@/store/slices/themeSlice';
import Head from 'next/head';
import Script from 'next/script';
import { Toaster } from 'sonner';
import {useAppDispatch,useAppSelector} from '@/store/hooks';

interface ThemedAppProps {
    Component: any;
    pageProps: any;
    serverTheme?: any;
}

const ThemedApp = ({ Component, pageProps, serverTheme }: ThemedAppProps) => {
    const dispatch = useAppDispatch();
    const mode=useAppSelector((state: RootState) => {console.log("state",state);return state.theme.mode});
    console.log("mode",mode)
    const [theme, setTheme] = useState(serverTheme || null);
    // const [mode, setMode] = useState<'light' | 'dark'>(serverTheme?.mode || 'light');
    const [isReady, setIsReady] = useState(!!serverTheme);


    const toggleModeWithName = (name) => {
        dispatch(toggleThemeMode(name));

    };

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
        console.log("mode changed",mode)
        document.documentElement.classList.toggle('dark', mode === 'dark');
    }, [mode]);

    const toggleMode = () => {
        // setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
        // setMode((prev) => (mode === 'dark' ? 'light' : 'dark'));
        dispatch(toggleThemeMode(mode === 'dark' ? 'light' : 'dark'));

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
            {/*<Head>*/}
                {/*<title>AsaKala</title>*/}
                {/*<meta name="viewport" content="width=device-width, initial-scale=1.0" />*/}
            {/*</Head>*/}
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
