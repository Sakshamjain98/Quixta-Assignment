"use client";

import { useGetProductQuery } from "@/store/product-api";
import { Button } from "@/components/ui/button";
import { ProductDetails } from "./product-details";

/** Reads the product through the RTK Query cache and shows the loading, error, or ready state. */
export function ProductView() {
  const { data: product, isLoading, isError, refetch } = useGetProductQuery();

  if (isLoading) {
    return (
      <div className="grid gap-7 md:grid-cols-2 md:items-center md:gap-12">
        {/* Same footprint as the loaded page, so nothing jumps when the product arrives. */}
        <div aria-hidden className="aspect-[4/3] w-full animate-pulse rounded-md bg-wall motion-reduce:animate-none" />
        <p role="status" className="text-muted">
          Loading product…
        </p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div role="alert" className="mx-auto flex max-w-sm flex-col items-center gap-2 py-16 text-center">
        <p className="text-lg font-semibold text-danger">Could not load the product</p>
        <p className="text-sm text-muted">Check your connection, then try again.</p>
        <Button className="mt-4" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
