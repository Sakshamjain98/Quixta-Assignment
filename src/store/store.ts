import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./product-api";

/** A new store per browser session (and per test), never shared across server requests. */
export function makeStore() {
  return configureStore({
    reducer: { [productApi.reducerPath]: productApi.reducer },
    middleware: (getDefault) => getDefault().concat(productApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
