import { Container } from "@/components/layout/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetails } from "@/components/product/product-details";

export default function ProductPage() {
  return (
    <main className="flex-1 pt-4 pb-16 sm:pt-8 md:pt-12 lg:pt-16 lg:pb-24">
      <Container className="grid gap-8 md:grid-cols-2 md:items-start md:gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <ProductGallery />
        <ProductDetails />
      </Container>
    </main>
  );
}
