import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    role: null,
    isLoggedIn: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
    },
});

export const { setUser, logout, setRole } = authSlice.actions;
export default authSlice.reducer;
