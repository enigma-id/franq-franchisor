import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/services/baseQuery";

export const regionApi = createApi({
  reducerPath: "regionApi",
  baseQuery,
  endpoints: (builder) => ({
    getRegion: builder.query({
      query: (params) => ({
        url: `/regions/search`,
        method: "GET",
        params,
      }),
    }),
  }),
});

// export hooks RTK Query
export const { useLazyGetRegionQuery } = regionApi;
