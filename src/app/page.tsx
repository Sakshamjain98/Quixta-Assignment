import { ProductView } from "@/components/product/product-view";

export default function ProductPage() {
  return (
    <main className="mx-auto flex w-full max-w-[960px] flex-1 flex-col px-4 py-6 md:justify-center md:py-16 lg:px-0">
      <ProductView />
    </main>
  );
}
