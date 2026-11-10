import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product } from "@/data/product";

type ProductApiError = { status: number | "FETCH_ERROR" };

/**
 * RTK Query caches the product in the Redux store: it is fetched once and
 * reused by every component that asks for it until the cache entry expires.
 */
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fakeBaseQuery<ProductApiError>(),
  // The product rarely changes, so keep it for 5 minutes after the last subscriber leaves.
  keepUnusedDataFor: 300,
  endpoints: (build) => ({
    getProduct: build.query<Product, void>({
      // Plain fetch keeps the relative URL working in the browser and easy to mock in tests.
      async queryFn() {
        try {
          const res = await fetch("/api/product");
          if (!res.ok) return { error: { status: res.status } };
          return { data: (await res.json()) as Product };
        } catch {
          return { error: { status: "FETCH_ERROR" } };
        }
      },
    }),
  }),
});

export const { useGetProductQuery } = productApi;
