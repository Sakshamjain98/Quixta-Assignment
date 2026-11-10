import Image from "next/image";
import shelfPhoto from "../../../public/images/linden-shelf.jpg";
import { PRODUCT } from "@/constants/product";

export function ProductGallery() {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#e4e6e5] md:sticky md:top-24">
      <Image
        src={shelfPhoto}
        alt={`${PRODUCT.name} mounted on a pale wall, holding a pressed fern frame, prints, and vintage books`}
        priority
        quality={90}
        placeholder="blur"
        sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
        // The shelf sits at the right edge of the photo; keep it in frame when cropped.
        className="aspect-square w-full object-cover object-right md:aspect-[4/5]"
      />
    </div>
  );
}
