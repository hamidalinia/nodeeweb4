import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer, Slide } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material';
import { HeadProvider } from 'react-head';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';

import { store, persistor } from '@/functions/store';

import App from '@/App';
import '@/i18n';
import { SaveData, fetchTheme } from '@/functions';
import AppLoading from '@/components/AppLoading';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-v4-rtl/dist/css/bootstrap-rtl.min.css';
// import bootstrap from 'bootstrap';
// import "shards-ui/dist/css/shards.min.css"
import '@/assets/styles/shards-dashboards.1.1.0.min.css';
import '@/assets/styles/global.css';
import '@/assets/styles/ltr.css';
import '@/assets/styles/rtl.css';
import '@splidejs/react-splide/css/skyblue';
// import store from '@/functions/store'
// import { initFirebase } from "@/components/push-notification";
import * as serviceWorker from './serviceWorkerRegistration';
import MuiTheme from './MuiTheme';

// store.dispatch(fetchCats());
// store.dispatch(siteStatus);

// @ts-ignore
store.dispatch(fetchTheme());

const container = document.getElementById('root');
const root = createRoot(container);
// fallback={<AppLoading />}
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={MuiTheme}>
        <HeadProvider>
          <Suspense >
            <App />
          </Suspense>
        </HeadProvider>
      </ThemeProvider>
      <ToastContainer
        theme="colored"
        transition={Slide}
        hideProgressBar
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </PersistGate>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
// initFirebase();
// requestForToken();

// setTimeout(() => {
//   console.log('setTimeout')
//   SaveData({ appUpdate: {} });
// }, 5000);

function clearCache() {
  if (typeof window === 'undefined') return;

  const CACHE_ID = process.env.REACT_APP_CACHE_ID;

  if (localStorage.CACHE_ID !== CACHE_ID) {
    console.warn('!! Cache found, going to clear. !!');
    localStorage.clear();
    window.location.reload();
    localStorage.CACHE_ID = CACHE_ID;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
  }
}
clearCache();

serviceWorker.unregister();
// serviceWorker.register({
//   onUpdate: (registration) => SaveData({ appUpdate: registration }),
// });
