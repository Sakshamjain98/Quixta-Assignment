"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrderForm } from "./order-form";
import { ORDER_DIALOG_TITLE_ID } from "./dialog-ids";

interface OrderDialogProps {
  product: Product;
}

export function OrderDialog({ product }: OrderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Open after the contents mount, so the browser can focus the first control.
  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
  }, [isOpen]);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <Button className="w-full md:w-auto" onClick={() => setIsOpen(true)}>
        Add to order
      </Button>

      {/* Native <dialog> + showModal(): focus containment, inert page, Escape to close. */}
      <dialog
        ref={dialogRef}
        aria-labelledby={ORDER_DIALOG_TITLE_ID}
        // Every close path (Escape, close button, Back to product) lands here; unmounting resets the form.
        onClose={() => setIsOpen(false)}
        className={cn(
          "order-dialog flex-col overflow-hidden bg-surface text-ink shadow-sheet open:flex backdrop:bg-black/40",
          // Below 768px: sheet fixed to the bottom, full width
          "fixed inset-x-0 top-auto bottom-0 m-0 max-h-[92dvh] w-full max-w-none rounded-t-2xl",
          // 768px and up: centred modal, at most 480px wide
          "md:inset-0 md:m-auto md:h-fit md:max-h-[88dvh] md:w-[calc(100%-2rem)] md:max-w-[480px] md:rounded-2xl",
        )}
      >
        {/* Grab handle: signals a bottom sheet on mobile. Decorative only. */}
        <span aria-hidden className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-disabled md:hidden" />
        {isOpen && <OrderForm product={product} onClose={close} />}
      </dialog>
    </>
  );
}
