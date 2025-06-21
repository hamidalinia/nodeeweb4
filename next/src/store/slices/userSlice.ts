import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    firstName:'',
    lastName:'',
    phoneNumber:'',
    token:'',
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setData(state, action) {
            state.phoneNumber = action.payload.phoneNumber;
            state.isLoggedIn = true;
        },
        setToken(state, action) {
            console.log('setToken',action.payload)
            state.token = action.payload;
        },
        login(state, action) {
            state.name = action.payload.name;
            state.isLoggedIn = true;
        },
        logout(state) {
            state.name = '';
            state.isLoggedIn = false;
        },
    },
});

export const { login, logout,setToken } = userSlice.actions;
export default userSlice.reducer;
