import { baseApi } from './baseApi';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomersResponse {
  success: boolean;
  data: {
    users: Customer[];
  };
}

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query<CustomersResponse, void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [
              ...result.data.users.map(({ _id }) => ({ type: 'Customers' as const, id: _id })),
              { type: 'Customers', id: 'LIST' },
            ]
          : [{ type: 'Customers', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
} = customersApi;
