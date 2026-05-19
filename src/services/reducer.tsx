import { combineReducers } from "@reduxjs/toolkit";
import type { Reducer, UnknownAction } from "redux";

import { authApi } from "./auth/api";
import { userApi } from "./user/api";
import { purchaseApi } from "./purchase/api";
import { dashboardApi } from "./dashboard/api";
import { salesApi } from "./sales/api";
import { reportApi } from "./report/api";
import { tableApi } from "./table/api";
import { outletApi } from "./outlet/api";
import { authReducer, signout } from "./auth/slice";
import { formReducer } from "./form/slice";
import { tableReducer } from "./table/slice";

// Split setting APIs
import { franchiseApi } from "./franchise/api";
import { inventoryApi } from "./inventory/api";
import { catalogApi } from "./catalog/api";
import { posApi } from "./pos/api";
import { regionApi } from "./region/api";

const appReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
  table: tableReducer,

  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [salesApi.reducerPath]: salesApi.reducer,
  [reportApi.reducerPath]: reportApi.reducer,
  [tableApi.reducerPath]: tableApi.reducer,
  [outletApi.reducerPath]: outletApi.reducer,

  // Split setting APIs
  [franchiseApi.reducerPath]: franchiseApi.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
  [catalogApi.reducerPath]: catalogApi.reducer,
  [posApi.reducerPath]: posApi.reducer,
  [regionApi.reducerPath]: regionApi.reducer,
});

type AppState = ReturnType<typeof appReducer>;

export const apiMiddlewares = [
  authApi.middleware,
  userApi.middleware,
  dashboardApi.middleware,
  purchaseApi.middleware,
  salesApi.middleware,
  reportApi.middleware,
  tableApi.middleware,
  outletApi.middleware,

  // Split setting APIs
  franchiseApi.middleware,
  inventoryApi.middleware,
  catalogApi.middleware,
  posApi.middleware,
  regionApi.middleware,
];

export const rootReducer: Reducer<AppState, UnknownAction> = (
  state,
  action,
) => {
  if (action.type === signout.type) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("persist:root");
    }
    state = undefined;
  }
  return appReducer(state, action);
};
