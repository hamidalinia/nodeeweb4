import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the theme data
interface ThemeData {
    tax?: boolean;
    taxAmount?: string;
    currency?: string;
    // add other properties as needed
}

// Define the slice state type
interface ThemeState {
    data: ThemeData | null;


}

// Initialize with typed state
const initialState: ThemeState = {
    data: null,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeData: (state, action: PayloadAction<ThemeData | null>) => {
            state.data = action.payload;
        },
    },
});

export const { setThemeData } = themeSlice.actions;
export default themeSlice.reducer;
