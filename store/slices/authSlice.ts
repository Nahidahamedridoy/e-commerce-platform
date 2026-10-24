import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiUser } from "@/lib/api/types";
import { setStoredAuth, clearStoredAuth, getStoredToken, getStoredUser } from "@/lib/api/client";

export interface AuthState {
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initAuthFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const token = getStoredToken();
        const user = getStoredUser<ApiUser>();
        if (token && user) {
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
        }
      }
      state.isInitialized = true;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: ApiUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      setStoredAuth(action.payload.token, action.payload.user);
    },
    updateUser: (state, action: PayloadAction<ApiUser>) => {
      state.user = action.payload;
      if (state.token) {
        setStoredAuth(state.token, action.payload);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearStoredAuth();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  initAuthFromStorage,
  setCredentials,
  updateUser,
  logout,
  setLoading,
  setError,
} = authSlice.actions;

export default authSlice.reducer;
