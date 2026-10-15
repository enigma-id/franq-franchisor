import { useDispatch, useSelector } from "react-redux";

import { useLazyDownloadTableDataQuery, useLazyGetTableDataQuery } from "./api";
import {
  initialized,
  setFilter,
  setLimit,
  setPage,
  setSearch,
  setSorting,
  setTable,
  resetFilter,
} from "./slice";

import type { RootState } from "../store";
import type { TableState, TableConfig } from "./const";
import type { PaginatedResponse, ApiResponse } from "../types/api";
import { useEffect, useCallback, useRef } from "react";
import { logger } from "@/utils/logger";
import {
  TableWrapper,
  TableRender,
  TablePagination,
  TableTool,
} from "../../components/ui/table";

/**
 * Custom hook for table state management and data fetching
 * Provides table operations: pagination, sorting, filtering, searching
 *
 * @template T - Type of table row data
 * @param name - Unique identifier for the table instance
 * @param config - Table configuration (columns, URL, filters, etc.)
 * @returns Table hook with render components and control functions
 *
 * @example
 * ```tsx
 * const Table = useTable<Client>("client-table", {
 *   url: "/client",
 *   columns: { ... },
 *   onReload: () => Table.boot()
 * });
 *
 * return (
 *   <>
 *     <Table.Tools />
 *     <Table.Render />
 *     <Table.Pagination />
 *   </>
 * );
 * ```
 */
const useTable = <T = unknown,>(
  name: string,
  config: TableConfig<T> | TableConfig<unknown>,
) => {
  const dispatch = useDispatch();
  const TableState = useSelector(
    (state: RootState) => state?.table?.data[name],
  );

  // Ref ke state tabel terbaru — dibaca di DALAM callback (bukan saat render)
  // supaya callback-nya bisa punya identitas stabil tanpa closure yang stale.
  const tableStateRef = useRef<TableState<T> | undefined>(undefined);
  useEffect(() => {
    tableStateRef.current = TableState as TableState<T> | undefined;
  }, [TableState]);

  const [triggerFetch] = useLazyGetTableDataQuery();
  const [triggerDownload] = useLazyDownloadTableDataQuery();

  const fetchData = useCallback(
    async (state: TableState<T>) => {
      try {
        const res = (await triggerFetch({
          url: state.url,
          table: state as TableState<unknown>,
        }).unwrap()) as PaginatedResponse<T> | ApiResponse<T[]>;

        const isSuccess = res?.message === "success";

        // Handle nested data extraction via dataKey (e.g., "session_data")
        let data: T[];
        let total: number;

        if (
          state.dataKey &&
          isSuccess &&
          typeof res?.data === "object" &&
          res?.data !== null
        ) {
          // Extract nested array from response
          const responseData = res.data as unknown as Record<string, unknown>;
          const nestedData = responseData[state.dataKey];
          data = Array.isArray(nestedData) ? (nestedData as T[]) : [];
          total = data.length;
        } else {
          // Standard array response
          data = isSuccess && Array.isArray(res?.data) ? (res.data as T[]) : [];
          total =
            isSuccess && "meta" in res && res.meta?.total
              ? (res.meta.total as number)
              : 0;
        }

        const isEmpty = total === 0;

        dispatch(
          setTable({
            name,
            table: {
              ...state,
              ...res,
              payload: res?.data,
              data,
              total,
              isEmpty,
            } as TableState<unknown>,
          }),
        );
      } catch (err) {
        logger.error(`Failed to fetch table data for ${name}`, err);

        dispatch(
          setTable({
            name,
            table: {
              ...state,
              data: [],
              total: 0,
              isEmpty: true,
            } as TableState<unknown>,
          }),
        );
      }
    },
    [name, dispatch, triggerFetch],
  );

  // Use ref to track if boot has been called to prevent infinite loops
  const hasBootedRef = useRef(false);
  const configUrlRef = useRef<string | undefined>(config?.url);

  const boot = useCallback(() => {
    const merged: TableState<T> = {
      ...config,
      ...(TableState || ({} as TableState<T>)),
      filter: {
        ...(TableState?.filter || {}),
        ...(config?.filter || {}), // config override tableState
      },
      data: (TableState?.data as T[] | null) || null,
      total: TableState?.total || 0,
      page:
        typeof TableState?.page === "number"
          ? TableState.page
          : typeof config.page === "number"
            ? config.page
            : 1,
      limit:
        typeof TableState?.limit === "number"
          ? TableState.limit
          : typeof config.limit === "number"
            ? config.limit
            : 25,
      sorting:
        typeof TableState?.sorting === "string"
          ? TableState.sorting
          : typeof config.sorting === "string"
            ? config.sorting
            : "",
      queryString: TableState?.queryString || "",
      textSearch: TableState?.textSearch || "",
      isEmpty: TableState?.isEmpty || false,
      showFilter: TableState?.showFilter || false,
      loading: TableState?.loading || false,
    };

    dispatch(initialized({ name, config: merged as TableState<unknown> }));
    fetchData(merged);
  }, [config, TableState, name, dispatch, fetchData]);

  useEffect(() => {
    // Only boot if URL changed or hasn't booted yet
    const urlChanged = configUrlRef.current !== config?.url;
    if (!hasBootedRef.current || urlChanged) {
      hasBootedRef.current = true;
      configUrlRef.current = config?.url;
      boot();
    }
    // Note: boot is intentionally not in dependencies to prevent infinite loops
    // It will use the latest config and TableState via closure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.url]);

  const refetch = useCallback(() => {
    if (!TableState) return;
    fetchData(TableState as TableState<T>);
  }, [TableState, fetchData]);

  const updateAndFetch = useCallback(
    (updates: Partial<TableState<T>>) => {
      const current = tableStateRef.current;
      if (!current) return;

      // Only update if there are actual changes to prevent unnecessary re-renders
      const hasChanges = Object.keys(updates).some((key) => {
        const updateKey = key as keyof TableState<T>;
        const currentValue = current[updateKey];
        const newValue = updates[updateKey];

        // Deep comparison for objects/arrays
        if (typeof currentValue === "object" && typeof newValue === "object") {
          return JSON.stringify(currentValue) !== JSON.stringify(newValue);
        }

        return currentValue !== newValue;
      });

      if (!hasChanges) return;

      const newState = { ...current, ...updates } as TableState<T>;
      fetchData(newState);
    },
    [fetchData],
  );

  const onPageChange = useCallback(
    (page: number) => {
      dispatch(setPage({ name, page }));
      updateAndFetch({ page });
    },
    [name, dispatch, updateAndFetch],
  );

  const onLimitChange = useCallback(
    (limit: number) => {
      dispatch(setLimit({ name, limit }));
      // Ganti jumlah baris/halaman → balik ke page 1.
      updateAndFetch({ limit, page: 1 });
    },
    [name, dispatch, updateAndFetch],
  );

  const onSorted = useCallback(
    (sorting: string) => {
      dispatch(setSorting({ name, sorting }));
      updateAndFetch({ sorting });
    },
    [name, dispatch, updateAndFetch],
  );

  const onSearched = useCallback(
    (text: string) => {
      dispatch(setSearch({ name, text }));
      // Reset ke page 1 saat search berubah — kalau tidak, request masih meminta
      // halaman lama (mis. page 4) padahal hasil search-nya beda.
      updateAndFetch({ textSearch: text, page: 1 });
    },
    [name, dispatch, updateAndFetch],
  );

  const onFilter = useCallback(
    (field: string | Record<string, unknown>, value?: unknown) => {
      if (!TableState) return;

      let newFilter: Record<string, unknown> = {
        ...(TableState.lockedFilter || {}), // Always include locked filters
        ...(TableState.filter || {}),
      };

      if (typeof field === "object") {
        // bulk update
        newFilter = { ...newFilter, ...field };
      } else {
        // single field
        newFilter[field] = value;
      }

      dispatch(
        setFilter({
          name,
          field, // bisa string atau object
          value,
        }),
      );

      updateAndFetch({ filter: newFilter, page: 1 });
    },
    [name, TableState, dispatch, updateAndFetch],
  );

  const onDownload = useCallback(() => {
    const current = tableStateRef.current;
    if (!current) return;
    triggerDownload({
      url: current.url,
      table: current as TableState<unknown>,
    });
  }, [triggerDownload]);

  const onClearFilters = useCallback(() => {
    dispatch(resetFilter({ name }));
    const current = tableStateRef.current;
    const newState = {
      ...current,
      filter: {
        ...(current?.lockedFilter || {}),
        ...(current?.filter?.periode ? { periode: current.filter.periode } : {}),
      },
      textSearch: "",
      page: 1,
    } as TableState<T>;
    fetchData(newState);
  }, [name, dispatch, fetchData]);

  // Render di-render sebagai <Table.Render>. Identitasnya dijaga stabil supaya body
  // tabel (termasuk container scroll-nya) tidak remount tiap page re-render —
  // remount bikin posisi scroll lompat ke atas (mis. setelah toggle aktif/nonaktif
  // di baris paling bawah). Data dibaca langsung dari store agar tetap fresh
  // meskipun identitas komponennya stabil.
  const Render = useCallback(
    function Render({
      emptyTitle,
      emptyDescription,
    }: {
      emptyTitle?: string;
      emptyDescription?: string;
    } = {}) {
      const state = useSelector(
        (s: RootState) => s?.table?.data[name],
      ) as TableState<T> | undefined;
      if (!state) return null;

      return (
        <TableWrapper>
          <TableRender
            name={name}
            columns={config?.columns}
            rows={state.data as T[] | null}
            dynamicColumns={config?.dynamicColumns}
            onSorted={onSorted}
            onRowClick={config?.onRowClick}
            onClearFilters={onClearFilters}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </TableWrapper>
      );
    },
    [
      name,
      config?.columns,
      config?.dynamicColumns,
      config?.onRowClick,
      onSorted,
      onClearFilters,
    ],
  );

  const Pagination = useCallback(
    () => (
      <TablePagination
        name={name}
        onChangePage={onPageChange}
        onChangeLimit={onLimitChange}
      />
    ),
    [name, onPageChange, onLimitChange],
  );

  // Tools di-render sebagai <Table.Tools>. Kalau identitas fungsinya berubah tiap
  // render, React me-remount subtree-nya setiap page re-render (mis. saat debounce
  // search commit) → input search kehilangan fokus/value ("auto close"). Karena
  // `onSearched`/`onDownload` identitasnya sudah stabil, `Tools` ikut stabil.
  const Tools = useCallback(
    ({
      children,
      downloadable,
      hideSearch,
    }: {
      children?: React.ReactNode;
      downloadable?: boolean;
      hideSearch?: boolean;
    }) => (
      <TableTool
        name={name}
        onSearch={onSearched}
        downloadable={downloadable}
        onDownload={onDownload}
        hideSearch={hideSearch}
      >
        {children}
      </TableTool>
    ),
    [name, onSearched, onDownload],
  );

  return {
    Render,
    Tools,
    Pagination,
    filter: onFilter,
    boot,
    State: TableState,
    refetch,
  };
};

export default useTable;
