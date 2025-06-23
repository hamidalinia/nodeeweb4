// pages/_app.tsx
import React , {useState,useEffect} from 'react';
import App from 'next/app';
import { appWithTranslation } from 'next-i18next';
import i18n from './../../next-i18next.config';
import type { AppProps } from 'next/app';
import { wrapper } from '@/store'; // ✅ from next-redux-wrapper
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorBoundary } from 'react-error-boundary';
import ThemedApp from '@/components/ThemedApp';
import { setApiStore } from '@/functions/api'; // Import setApiStore
import { AppStore } from '@/store'; // Import AppStore type
import { Provider } from 'react-redux';
import '../styles/globals.css';
import '../styles/rtl.css';
import '@splidejs/splide/dist/css/splide.min.css';

interface ExtendedAppProps extends AppProps {
    theme?: any;
}

function MyApp({ Component, pageProps, theme }: ExtendedAppProps) {

    const { store, props } = wrapper.useWrappedStore({ Component, pageProps });
    const [persistor, setPersistor] = useState<any>(null); // Use state instead of useMemo


    // const persistor = typeof window !== 'undefined' ? persistStore(store) : null;
    {/*<Provider store={store}>*/}
    {/*</Provider>*/}

    // Client-side persistor only
    useEffect(() => {
        // Set store reference for API
        setApiStore(store as AppStore);
        // Only create persistor on client-side
        if (typeof window !== 'undefined' && store) {
            setPersistor(persistStore(store));
        }
        if (typeof window !== 'undefined' && store) {
            // @ts-ignore: Use the persistor attached to the store
            setPersistor(store.__persistor);
        }
    }, [store]);

    return (
        <Provider store={store}>
            {persistor ? (
                <PersistGate loading={null} persistor={persistor}>
                    <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
                        <ThemedApp Component={Component} pageProps={pageProps} serverTheme={theme} />
                    </ErrorBoundary>
                </PersistGate>
            ) : (
                // Render without PersistGate on server-side
                <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
                    <ThemedApp Component={Component} pageProps={pageProps} serverTheme={theme} />
                </ErrorBoundary>
            )}
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

export default appWithTranslation(MyApp, i18n);