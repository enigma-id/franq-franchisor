import { combineReducers } from "@reduxjs/toolkit";
import type { Reducer, UnknownAction } from "redux";

import { authApi } from "./auth/api";
import { dashboardApi } from "./dashboard/api";
import { outletApi } from "./outlet/api";
import { regionApi } from "./region/api";
import { posApi } from "./pos/api";
import { paymentMethodApi } from "./payment-method/api";
import { memberTopupBonusApi } from "./member/api";
import { purchaseApi } from "./purchase/api";
import { supplierApi } from "./supplier/api";
import { salesApi } from "./sales/api";
import { productionApi } from "./production/api";
import { demandApi } from "./demand/api";
import { warehouseApi } from "./warehouse/api";
import { authReducer, signout } from "./auth/slice";
import { formReducer } from "./form/slice";
import { tableReducer } from "./table/slice";
import { tableApi } from "./table/api";
import { reportApi } from "./report/api";
import { inventoryApi } from "./inventory/api";
import { uploadApi } from "./upload/api";
import { withdrawalApi } from "./withdrawal/api";
import { b2bApi } from "./b2b/api";
import { franchisorApi } from "./franchisor/api";
import { franchiseApi } from "./franchise/api";
import { outletTopupApi } from "./outletTopup/api";
import { userApi } from "./user/api";
import { userGroupApi } from "./usergroup/api";
import { permissionApi } from "./permission/api";

const appReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
  table: tableReducer,

  [authApi.reducerPath]: authApi.reducer,
  [tableApi.reducerPath]: tableApi.reducer,
  [outletApi.reducerPath]: outletApi.reducer,
  [posApi.reducerPath]: posApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [paymentMethodApi.reducerPath]: paymentMethodApi.reducer,
  [memberTopupBonusApi.reducerPath]: memberTopupBonusApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [supplierApi.reducerPath]: supplierApi.reducer,
  [salesApi.reducerPath]: salesApi.reducer,
  [productionApi.reducerPath]: productionApi.reducer,
  [demandApi.reducerPath]: demandApi.reducer,
  [warehouseApi.reducerPath]: warehouseApi.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
  [regionApi.reducerPath]: regionApi.reducer,
  [reportApi.reducerPath]: reportApi.reducer,
  [uploadApi.reducerPath]: uploadApi.reducer,
  [withdrawalApi.reducerPath]: withdrawalApi.reducer,
  [b2bApi.reducerPath]: b2bApi.reducer,
  [franchisorApi.reducerPath]: franchisorApi.reducer,
  [franchiseApi.reducerPath]: franchiseApi.reducer,
  [outletTopupApi.reducerPath]: outletTopupApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [userGroupApi.reducerPath]: userGroupApi.reducer,
  [permissionApi.reducerPath]: permissionApi.reducer,
});

type AppState = ReturnType<typeof appReducer>;

export const apiMiddlewares = [
  authApi.middleware,
  purchaseApi.middleware,
  dashboardApi.middleware,
  salesApi.middleware,
  productionApi.middleware,
  demandApi.middleware,
  warehouseApi.middleware,
  tableApi.middleware,
  outletApi.middleware,
  posApi.middleware,
  paymentMethodApi.middleware,
  memberTopupBonusApi.middleware,
  inventoryApi.middleware,
  regionApi.middleware,
  supplierApi.middleware,
  reportApi.middleware,
  uploadApi.middleware,
  withdrawalApi.middleware,
  b2bApi.middleware,
  franchisorApi.middleware,
  franchiseApi.middleware,
  outletTopupApi.middleware,
  userApi.middleware,
  userGroupApi.middleware,
  permissionApi.middleware,
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
