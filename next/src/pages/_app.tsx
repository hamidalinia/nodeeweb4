// pages/_app.tsx
import React from 'react';
import App from 'next/app';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { store } from '@/store';
import ThemedApp from '@/components/ThemedApp';
import '../styles/globals.css';
import '@splidejs/splide/dist/css/splide.min.css';


interface ExtendedAppProps extends AppProps {
    theme?: any;
}

function MyApp({ Component, pageProps, theme }: ExtendedAppProps) {
    return (
        <Provider store={store}>
            <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
                <ThemedApp Component={Component} pageProps={pageProps} serverTheme={theme} />
            </ErrorBoundary>
        </Provider>
    );
}

MyApp.getInitialProps = async (appContext: any) => {
    const appProps = await App.getInitialProps(appContext);
    let theme = null;

    if (typeof window === 'undefined') {
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        if (BASE_URL) {
            try {
                const res = await fetch(`${BASE_URL}/theme`);
                theme = await res.json();
            } catch (error) {
                console.error(`SSR theme fetch error:`, error);
            }
        }
    }

    return { ...appProps, theme };
};

export default MyApp;
