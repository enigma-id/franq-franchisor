import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const paymentMethodApi = createApi({
  reducerPath: "paymentMethodApi",
  baseQuery,
  tagTypes: ["PaymentMethod"],
  endpoints: (builder) => ({
    getPaymentMethods: builder.query({
      query: (params) => ({
        url: "/payment/method",
        method: "GET",
        params,
      }),
    }),

    getPaymentMethod: builder.query({
      query: ({ id, ...params }) => ({
        url: `/payment/method/${id}`,
        method: "GET",
        params,
      }),
    }),

    createPaymentMethod: builder.mutation({
      query: (payload) => ({
        url: "/payment/method",
        method: "POST",
        body: payload,
      }),
    }),

    updatePaymentMethod: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/payment/method/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    deletePaymentMethod: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/payment/method/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),

    activatePaymentMethod: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/payment/method/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
    }),

    deactivatePaymentMethod: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/payment/method/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
    }),

    updatePaymentMethodOutletType: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/payment/method/${id}/outlet-type`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetPaymentMethodsQuery,
  useLazyGetPaymentMethodQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useActivatePaymentMethodMutation,
  useDeactivatePaymentMethodMutation,
  useUpdatePaymentMethodOutletTypeMutation,
} = paymentMethodApi;
