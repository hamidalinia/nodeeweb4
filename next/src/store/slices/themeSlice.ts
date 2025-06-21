import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the theme data
interface ThemeData {
    mode?: string;
    tax?: boolean;
    taxAmount?: string;
    currency?: string;
    // add other properties as needed
}

interface ThemeMode {
    mode?: string;
    // add other properties as needed
}

// Define the slice state type
interface ThemeState {


}

// Initialize with typed state
const initialState: ThemeState = {
    mode:'dark'
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeData: (state, action: PayloadAction<ThemeData | null>) => {
            console.log("setThemeData",action.payload)
            state = action.payload;
            state.mode = 'dark';
        },
        toggleThemeMode: (state, action: PayloadAction<ThemeMode | null>) => {
            console.log("toggleThemeMode",state,action.payload)
            state.mode = action.payload;
        },
    },
});

export const { setThemeData,toggleThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
