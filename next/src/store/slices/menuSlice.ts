// store/menuSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { MenuState } from '@/types/menu';


const initialState: MenuState = {
    isMenuOpen: false,
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        toggleMenu(state) {
            state.isMenuOpen = !state.isMenuOpen;
        },
        openMenu(state) {
            state.isMenuOpen = true;
        },
        closeMenu(state) {
            state.isMenuOpen = false;
        },
    },
});

export const { toggleMenu, openMenu, closeMenu } = menuSlice.actions;
export default menuSlice.reducer;
