import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const regionApi = createApi({
  reducerPath: "regionApi",
  baseQuery,
  tagTypes: ["Region"],
  endpoints: (builder) => ({
    // ── /region/province ──

    /**
     * GET /region/province
     * List provinces
     */
    getProvinces: builder.query({
      query: (params) => ({
        url: "/region/province",
        method: "GET",
        params,
      }),
    }),

    // ── /region/regency ──

    /**
     * GET /region/regency/:id
     * List regencies by province id
     */
    getRegencies: builder.query({
      query: ({ id, ...params }) => ({
        url: `/region/regency/${id}`,
        method: "GET",
        params,
      }),
    }),

    // ── /region/district ──

    /**
     * GET /region/district/:id
     * List districts by regency id
     */
    getDistricts: builder.query({
      query: ({ id, ...params }) => ({
        url: `/region/district/${id}`,
        method: "GET",
        params,
      }),
    }),

    // ── /region/village ──

    /**
     * GET /region/village/:id
     * List villages by district id
     */
    getVillages: builder.query({
      query: ({ id, ...params }) => ({
        url: `/region/village/${id}`,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetProvincesQuery,
  useLazyGetRegenciesQuery,
  useLazyGetDistrictsQuery,
  useLazyGetVillagesQuery,
} = regionApi;
