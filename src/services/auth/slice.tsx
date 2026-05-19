import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../types";

interface authState {
  authenticated: boolean;
  session: {
    token: string;
    user: User;
  } | null;
}

const initialState: authState = {
  authenticated: false,
  session: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.session = action.payload;
      state.authenticated = true;
    },
    logout: (state) => {
      state.session = null;
      state.authenticated = false;
    },
    session: (state, action) => {
      if (state.session) {
        state.session = {
          ...state.session,
          ...action.payload,
        };
      } else {
        state.session = action.payload;
      }
    },
  },
});

export const { setCredentials, logout, session } = authSlice.actions;
export const signout = logout;
export const authReducer = authSlice.reducer;
export default authSlice.reducer;
