import { baseApi } from './baseApi';

// Order item interface
export interface OrderItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    images: { url: string; alt: string }[];
  };
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  total: number;
}

// Order interface
export interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Orders API endpoints
export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all user orders
    getMyOrders: builder.query<
      {
        orders: Order[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalOrders: number;
          limit: number;
        };
      },
      { page?: number; limit?: number; status?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.status) queryParams.append('status', params.status);
        return `/orders/my-orders?${queryParams.toString()}`;
      },
      providesTags: ['Orders'],
    }),

    // Get order by ID
    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),

    // Create new order
    createOrder: builder.mutation<
      Order,
      {
        items: { product: string; quantity: number; size?: string; color?: string; price: number }[];
        shippingAddress: {
          street: string;
          city: string;
          state: string;
          zipCode: string;
          country: string;
          phone: string;
        };
        paymentMethod: string;
        notes?: string;
      }
    >({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Orders', 'Cart'],
    }),

    // Cancel order
    cancelOrder: builder.mutation<Order, string>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

// Export hooks
export const {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
} = ordersApi;
