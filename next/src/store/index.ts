import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import themeReducer from './slices/themeSlice';
import menuReducer from './slices/menuSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        theme: themeReducer,
        cart: cartReducer,
        menu: menuReducer,
    },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
