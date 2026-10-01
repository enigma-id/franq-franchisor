import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery,
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    /** GET /customer - List customers */
    getCustomers: builder.query({
      query: (params) => ({
        url: "/customer",
        method: "GET",
        params,
      }),
    }),

    /** GET /customer/:id - Get customer detail */
    getCustomer: builder.query({
      query: ({ id, ...params }) => ({
        url: `/customer/${id}`,
        method: "GET",
        params,
      }),
    }),

    /** POST /customer - Create customer */
    createCustomer: builder.mutation({
      query: (payload) => ({
        url: "/customer",
        method: "POST",
        body: payload,
      }),
    }),

    /** PUT /customer/:id - Update customer */
    updateCustomer: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/customer/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** DELETE /customer/:id - Delete customer */
    deleteCustomer: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/customer/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    /** PUT /customer/:id/activate */
    activateCustomer: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/customer/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    /** PUT /customer/:id/deactivate */
    deactivateCustomer: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/customer/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetCustomersQuery,
  useLazyGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useActivateCustomerMutation,
  useDeactivateCustomerMutation,
} = customerApi;
