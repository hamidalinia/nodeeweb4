import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '@/types/user';



const initialState: UserState = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: [],
    token: '',
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<{
            firstName?: string;
            address?: any;
            lastName?: string;
            phoneNumber?: string;
            token?: string;
        }>) => {
            if (action.payload.firstName !== undefined) {
                state.firstName = action.payload.firstName;
            }
            if (action.payload.lastName !== undefined) {
                state.lastName = action.payload.lastName;
            }
            if (action.payload.phoneNumber !== undefined) {
                state.phoneNumber = action.payload.phoneNumber;
            }
            if (action.payload.token !== undefined) {
                state.token = action.payload.token;
            }
            state.isLoggedIn = true;
        },

        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isLoggedIn = !!action.payload; // Auto-set login status based on token presence
        },

        loginSuccess: (state, action: PayloadAction<{
            token: string;
            firstName?: string;
            lastName?: string;
            address?: any;
            phoneNumber: string;
        }>) => {
            state.token = action.payload?.token;
            state.firstName = action.payload?.firstName;
            state.lastName = action.payload?.lastName;
            state.phoneNumber = action.payload?.phoneNumber;
            state.isLoggedIn = true;
        },

        logout: (state) => {
            console.log("logout")
            state.token = '';
            state.firstName = '';
            state.lastName = '';
            state.phoneNumber = '';
            state.isLoggedIn = false;
        },

        // For partial updates
        updateProfile: (state, action: PayloadAction<{
            firstName?: string;
            lastName?: string;
            phoneNumber?: string;
        }>) => {
            if (action.payload.firstName !== undefined) {
                state.firstName = action.payload.firstName;
            }
            if (action.payload.lastName !== undefined) {
                state.lastName = action.payload.lastName;
            }
            if (action.payload.phoneNumber !== undefined) {
                state.phoneNumber = action.payload.phoneNumber;
            }
        }
    },
});

// Action creators
export const {
    setUserData,
    setToken,
    loginSuccess,
    logout,
    updateProfile
} = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user;
export const selectToken = (state: { user: UserState }) => state.user.token;
export const selectIsLoggedIn = (state: { user: UserState }) => state.user.isLoggedIn;

export default userSlice.reducer;