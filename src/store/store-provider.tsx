"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

export function StoreProvider({ children }: { children: ReactNode }) {
  // Lazy initial state: the store is created once per mount.
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
