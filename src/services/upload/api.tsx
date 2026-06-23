import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

// ==============================
// RTK Query API Definition
// ==============================

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery,
  endpoints: (builder) => ({
    /**
     * POST /upload
     * Generate presigned URL untuk upload langsung ke S3
     */
    getPresignedURL: builder.mutation({
      query: (params: { filename: string; contentType: string }) => ({
        url: "/upload",
        method: "POST",
        body: params,
      }),
    }),
  }),
});

// Export RTK Query hooks
export const { useGetPresignedURLMutation } = uploadApi;
