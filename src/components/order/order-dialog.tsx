"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { Product } from "@/data/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ORDER_DIALOG_TITLE_ID } from "./dialog-ids";

// The form (react-hook-form + zod) is only downloaded when it's needed, keeping it out of the first page load.
const loadOrderForm = () => import("./order-form");
const OrderForm = lazy(() => loadOrderForm().then((module) => ({ default: module.OrderForm })));

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
      {/* Start the download on hover or focus, so the form is usually ready by the time of the click. */}
      <Button
        className="w-full md:w-auto md:px-10"
        onPointerEnter={loadOrderForm}
        onFocus={loadOrderForm}
        onClick={() => setIsOpen(true)}
      >
        Add to order
      </Button>

      {/* Native <dialog> + showModal(): focus containment, inert page, Escape to close. */}
      <dialog
        ref={dialogRef}
        aria-labelledby={ORDER_DIALOG_TITLE_ID}
        // Every close path (Escape, close button, Back to product) lands here; unmounting resets the form.
        onClose={() => setIsOpen(false)}
        className={cn(
          "order-dialog flex-col overflow-hidden bg-surface text-ink shadow-sheet open:flex backdrop:bg-black/50",
          // Below 768px: sheet fixed to the bottom, full width
          "fixed inset-x-0 top-auto bottom-0 m-0 max-h-[92dvh] w-full max-w-none rounded-t-[20px]",
          // 768px and up: centred modal, at most 480px wide
          "md:inset-0 md:m-auto md:h-fit md:max-h-[88dvh] md:w-[calc(100%-2rem)] md:max-w-[480px] md:rounded-[20px] md:shadow-2xl",
        )}
      >
        {/* Grab handle: signals a bottom sheet on mobile. Decorative only. */}
        <span aria-hidden className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-disabled md:hidden" />
        {isOpen && (
          <Suspense
            fallback={
              <p role="status" className="px-6 py-10 text-center text-muted">
                Loading…
              </p>
            }
          >
            <OrderForm product={product} onClose={close} />
          </Suspense>
        )}
      </dialog>
    </>
  );
}
