import { createSlice,PayloadAction } from '@reduxjs/toolkit';

import type { CartItem } from "@/types/cart";



const initialState: CartItem[] = [];


const cartSlice = createSlice({
    name: 'cart',
    // initialState: [],
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload;

            const exists = state.find(p =>
                p.id === item.id &&
                (item.type === 'normal' || (p.variation?.id === item.variation?.id))
            );

            if (exists) {
                if (!exists.oneItemPerOrder) {
                    exists.quantity += 1;
                }
            } else {
                state.push(item);
            }
        },
        removeFromCart: (state, action) => {
            return state.filter((item: any) => item.id !== action.payload);
        },
        clearCart: () => [],
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
