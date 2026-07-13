/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import { rootReducer, apiMiddlewares } from "./reducer";

// Sync storage adapter for redux-persist (expects Promise-returning methods)
const createSyncStorage = () => {
  if (typeof window === "undefined") {
    return {
      getItem: () => Promise.resolve(null),
      setItem: (_key: string, value: any) => Promise.resolve(value),
      removeItem: () => Promise.resolve(),
    };
  }
  return {
    getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key: string, value: any) => {
      window.localStorage.setItem(key, value);
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
};

const storage = createSyncStorage();

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    "authApi",
    "dashboardApi",
    "purchaseApi",
    "salesApi",
    "reportApi",
    "tableApi",
    "outletApi",
    "posApi",
    "paymentMethodApi",
    "memberTopupBonusApi",
    "productionApi",
    "demandApi",
    "warehouseApi",
    "supplierApi",
    "inventoryApi",
    "regionApi",
    "withdrawalApi",
    "b2bApi",
    "franchisorApi",
    "outletTopupApi",
    "userApi",
    "userGroupApi",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(...apiMiddlewares),
});

const persistor = persistStore(store);
export { persistor, store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
