import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetProductsQuery,
  useLazyGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useActivateProductMutation,
  useDeactivateProductMutation,
} from "./api";
import type { ProductDetail } from "../types/product";

/**
 * Resource agregat `product` — pengganti CRUD menu (`usePOSMenu` create/update/detail).
 * Tidak ada `getPrices` di sini: endpoint harga channel hanya ada di `/pos/menu/price`.
 */
export const useProduct = createCrudHook<ProductDetail>({
  entityName: "product",
  useLazyGetQuery: useLazyGetProductsQuery,
  useLazyShowQuery: useLazyGetProductQuery,
  useCreateMutation: useCreateProductMutation,
  useUpdateMutation: useUpdateProductMutation,
  useRemoveMutation: useDeleteProductMutation,
  customOperations: {
    activate: { hook: useActivateProductMutation },
    deactivate: { hook: useDeactivateProductMutation },
  },
});
