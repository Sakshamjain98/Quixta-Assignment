"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/product";
import { Button } from "@/components/ui/button";
import { ProductDetails } from "./product-details";

type ProductState = { status: "loading" } | { status: "error" } | { status: "ready"; product: Product };

/** Fetches the product on the client and shows the loading, error, or ready state. */
export function ProductView() {
  const [state, setState] = useState<ProductState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/product", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`GET /api/product failed with ${res.status}`);
        return res.json() as Promise<Product>;
      })
      .then((product) => setState({ status: "ready", product }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" });
      });

    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }

  if (state.status === "loading") {
    return (
      <p role="status" className="py-16 text-center text-muted">
        Loading product…
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-danger">Could not load the product</p>
        <Button onClick={retry}>Try again</Button>
      </div>
    );
  }

  return <ProductDetails product={state.product} />;
}
