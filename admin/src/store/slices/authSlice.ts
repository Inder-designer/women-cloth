import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/status');
      if (response.data.authenticated) {
        return response.data.data.user;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Check auth failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Check Auth
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload;
      } else {
        state.isAuthenticated = false;
        state.user = null;
      }
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
