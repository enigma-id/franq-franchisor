import { createAction } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { TableState } from "./const";
import type { PaginatedResponse } from "../types/api";

export const $reset = createAction("Table/reset");

type BuildParamsProps = TableState & { downloadable?: boolean };

const buildParams = (table: BuildParamsProps) => {
  const params: Record<string, string | number | boolean> = {
    page: table.page,
    limit: table.limit,
    search: table.textSearch,
    order_by: table.sorting,
  };

  if (table.downloadable) {
    params.downloadable = true;
  }

  // hapus value kosong/null
  Object.keys(params).forEach((key) => {
    if (params[key] === "" || params[key] === 0 || params[key] === null) {
      delete params[key];
    }
  });

  // apply filter (including locked filters)
  const allFilters = {
    ...(table.lockedFilter || {}),
    ...(table.filter || {}),
  };

  for (const key in allFilters) {
    const value = allFilters[key];
    if (value !== "" && value !== null) {
      params[key] = Array.isArray(value) ? value.join(".") : String(value);
    }
  }

  return params;
};

export const tableApi = createApi({
  reducerPath: "tableApi",
  baseQuery,
  tagTypes: ["Table"],
  endpoints: (builder) => ({
    /** GET dynamic url - Get table data with pagination */
    getTableData: builder.query<
      PaginatedResponse<unknown>,
      { url: string; table: TableState<unknown> }
    >({
      query: ({ url, table }) => ({
        url,
        method: "GET",
        params: buildParams(table),
      }),
    }),

    /** GET dynamic url - Download table data */
    downloadTableData: builder.query<
      Blob,
      { url: string; table: TableState<unknown> }
    >({
      query: ({ url, table }) => {
        return {
          url,
          method: "GET",
          params: buildParams({ downloadable: true, ...table }),
        };
      },
    }),
  }),
});

export const { useLazyGetTableDataQuery, useLazyDownloadTableDataQuery } =
  tableApi;
