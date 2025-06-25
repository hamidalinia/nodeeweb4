import { ThemeMode } from '@/types/themeMode';
import { ThemeData } from '@/types/themeData';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: ThemeData = {
    mode:'light',
    data: null,
    tax: false,
taxAmount: '0',
currency: 'Toman'
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeData: (state, action: PayloadAction<ThemeData | null>) => {
            console.log("setThemeData",action.payload)
            // state = action.payload;
            // state.mode = 'dark';
        },
        toggleThemeMode: (state, action: PayloadAction<ThemeMode>) => {
            console.log("toggleThemeMode",state,action.payload)
            state.mode = action.payload;
        },
    },
});

export const { setThemeData,toggleThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
