import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const permissionApi = createApi({
  reducerPath: "permissionApi",
  baseQuery,
  tagTypes: ["Permission"],
  endpoints: (builder) => ({
    getPermissions: builder.query({
      query: (params) => ({
        url: "/permission",
        method: "GET",
        params,
      }),
      providesTags: ["Permission"],
    }),
  }),
});

export const { useLazyGetPermissionsQuery } = permissionApi;
