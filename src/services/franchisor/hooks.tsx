import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetFranchisorQuery,
  useUpdateFranchisorMutation,
} from "./api";
import type { FranchisorDetail } from "../types";

export const useFranchisor = createCrudHook<FranchisorDetail>({
  entityName: "franchisor",
  useLazyShowQuery: useLazyGetFranchisorQuery,
  customOperations: {
    update: { hook: useUpdateFranchisorMutation },
  },
});
