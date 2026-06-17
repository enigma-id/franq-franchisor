import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetProductionDemandQuery,
  useLazyGetItemDemandQuery,
} from "./api";

export const useDemand = createCrudHook({
  useLazyGetQuery: useLazyGetProductionDemandQuery,
  additionalQueries: {
    getItemDemand: useLazyGetItemDemandQuery,
    getProductionDemand: useLazyGetProductionDemandQuery,
  },
  entityName: "demand",
});
