// ./store/index.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    PersistConfig
} from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { createWrapper } from 'next-redux-wrapper';

// Import your reducers and state types
import userReducer from '@/store/slices/userSlice';
import { UserState } from '@/types/user';
import cartReducer from '@/store/slices/cartSlice';
import { CartItem } from '@/types/cart';
import themeReducer from '@/store/slices/themeSlice';
import { ThemeData } from '@/types/themeData';
import menuReducer from '@/store/slices/menuSlice';
import { MenuState } from '@/types/menu';

// Define state types
type NonPersistedRootState = {
    user: UserState;
    theme: ThemeData;
    cart: CartItem[];
    menu: MenuState;
};

// Combine your reducers
const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer,
    cart: cartReducer,
    menu: menuReducer,
});



const createNoopStorage = () => {
    return {
        getItem(_key: string) {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: string) {
            return Promise.resolve(value);
        },
        removeItem(_key: string) {
            return Promise.resolve();
        },
    };
};

const storage =
    typeof window !== "undefined"
        ? createWebStorage("local")
        : createNoopStorage();



// Persist config with proper typing
const persistConfig: PersistConfig<NonPersistedRootState> = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['cart', 'user', 'menu', 'theme'],
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create makeStore function for next-redux-wrapper
const makeStore = () => {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
        devTools: process.env.NODE_ENV !== 'production',
    });

    // Only create persistor on client-side
    if (typeof window !== 'undefined') {
        persistStore(store);
    }

    return store;
};

// Export wrapper and types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export { removeFromCart } from './slices/cartSlice';


export const wrapper = createWrapper<AppStore>(makeStore);