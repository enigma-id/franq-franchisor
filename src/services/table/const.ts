import type { ReactNode } from "react";

/**
 * Table column definition
 */
export interface TableColumn<T = unknown> {
  title: string;
  sortable?: boolean;
  headerClass?: string;
  class?: string;
  component?: (
    row: T | Partial<T> | Record<string, unknown> | unknown,
  ) => ReactNode;
  [key: string]: unknown;
}

/**
 * Table columns configuration
 */
export type TableColumns<T = unknown> = Record<string, TableColumn<T>>;

/**
 * Table configuration
 */
export interface TableConfig<T = unknown> {
  url: string;
  columns: TableColumns<T>;
  /** Function to generate dynamic columns based on row data */
  dynamicColumns?: (rows: T[]) => TableColumns<T>;
  filter?: Record<string, unknown>;
  /** Hardcoded filters that cannot be cleared by clearFilters */
  lockedFilter?: Record<string, unknown>;
  onReload?: () => void;
  onRowClick?: (row: T) => void;
  /** Key to extract nested array from response (e.g., "session_data" for cash control) */
  dataKey?: string;
  [key: string]: unknown;
}

/**
 * Table state
 */
export interface TableState<T = unknown> {
  url: string;
  columns: TableColumns<T>;
  filter: Record<string, unknown>;
  total: number;
  page: number;
  limit: number;
  sorting: string;
  queryString: string;
  textSearch: string;
  isEmpty: boolean;
  showFilter: boolean;
  data: T[] | null;
  loading: boolean;
  message?: string;
  lockedFilter?: Record<string, unknown>; // Hardcoded filters that cannot be cleared
  dataKey?: string; // Key to extract nested array from response
  payload?: any; // The original raw data object from the API
  dynamicColumns?: (rows: T[]) => TableColumns<T>;
  meta?: {
    total?: number;
    [key: string]: unknown;
  };
}

const tableState: TableState = {
  url: "",
  columns: {},
  filter: {},
  total: 0,
  page: 1,
  limit: 25,
  sorting: "",
  queryString: "",
  textSearch: "",
  isEmpty: false,
  showFilter: false,
  data: null,
  loading: false,
};

export default tableState;
