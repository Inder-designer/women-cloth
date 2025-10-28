import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    slug: string;
  };
  name: string;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  trackingNumber?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/admin/all');
      return response.data.data.orders;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data.data.order;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async (
    { id, orderStatus, trackingNumber }: { id: string; orderStatus: string; trackingNumber?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/orders/${id}/status`, { orderStatus, trackingNumber });
      return response.data.data.order;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Orders
    builder.addCase(fetchAllOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchAllOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Order By ID
    builder.addCase(fetchOrderById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
    });
    builder.addCase(fetchOrderById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Order Status
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      const index = state.orders.findIndex((o) => o._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.currentOrder?._id === action.payload._id) {
        state.currentOrder = action.payload;
      }
    });
  },
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
