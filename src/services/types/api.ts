// API Response Types
export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  total?: number;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
}

export interface ApiError {
  status?: number | "error";
  message?: string;
  validations?: Record<string, string[]>;
  data?: { message?: string; errors?: Record<string, string> };
}

// Type guards for franchisee-v2 response shape
export function isSuccessResponse<T>(res: unknown): res is ApiResponse<T> {
  return (
    typeof res === "object" &&
    res !== null &&
    "status" in res &&
    (res as ApiResponse<T>).status === "success"
  );
}

export function isPaginatedResponse<T>(
  res: unknown,
): res is PaginatedResponse<T> {
  return (
    isSuccessResponse<T[]>(res) &&
    "total" in res &&
    typeof (res as PaginatedResponse<T>).total === "number"
  );
}

export function isApiError(res: unknown): res is ApiError {
  return (
    typeof res === "object" &&
    res !== null &&
    "status" in res &&
    (res as ApiError).status === "error"
  );
}
