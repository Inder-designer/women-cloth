import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  avatar?: string;
  role: string;
  isActive: boolean;
  preferences: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllCustomers = createAsyncThunk(
  'customers/fetchAllCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users');
      return response.data.data.users;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch All Customers
    builder.addCase(fetchAllCustomers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllCustomers.fulfilled, (state, action) => {
      state.loading = false;
      state.customers = action.payload;
    });
    builder.addCase(fetchAllCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default customersSlice.reducer;
