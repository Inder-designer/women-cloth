import { baseApi } from './baseApi';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      images: string[];
    };
    quantity: number;
    size?: string;
    color?: string;
    price: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
  };
}

interface OrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
}

interface UpdateOrderStatusRequest {
  id: string;
  status: string;
  trackingNumber?: string;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<OrdersResponse, void>({
      query: () => '/orders/admin/all',
      providesTags: (result) =>
        result
          ? [
              ...result.data.orders.map(({ _id }) => ({ type: 'Orders' as const, id: _id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),
    getOrderById: builder.query<OrderResponse, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    updateOrderStatus: builder.mutation<OrderResponse, UpdateOrderStatusRequest>({
      query: ({ id, status, trackingNumber }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status, trackingNumber },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Orders', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
