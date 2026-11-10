"use client";

import { useGetProductQuery } from "@/store/product-api";
import { Button } from "@/components/ui/button";
import { ProductDetails } from "./product-details";

/** Reads the product through the RTK Query cache and shows the loading, error, or ready state. */
export function ProductView() {
  const { data: product, isLoading, isError, refetch } = useGetProductQuery();

  if (isLoading) {
    return (
      <p role="status" className="py-16 text-center text-muted">
        Loading product…
      </p>
    );
  }

  if (isError || !product) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-danger">Could not load the product</p>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
