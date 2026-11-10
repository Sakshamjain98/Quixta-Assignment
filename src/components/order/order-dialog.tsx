"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderForm } from "./order-form";
import { cn } from "@/lib/utils";
import { ORDER_DIALOG_TITLE_ID } from "./dialog-layout";

export function OrderDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Open after the contents mount, so the browser can focus the first control.
  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
  }, [isOpen]);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <Button className="w-full" onClick={() => setIsOpen(true)}>
        <ShoppingBag className="size-4.5" strokeWidth={1.8} aria-hidden />
        Add to order
      </Button>

      {/* Native <dialog> + showModal(): focus containment, inert page, Escape to close. */}
      <dialog
        ref={dialogRef}
        aria-labelledby={ORDER_DIALOG_TITLE_ID}
        // Every close path (Escape, close button, Back to product) lands here; unmounting resets the form.
        onClose={() => setIsOpen(false)}
        className={cn(
          "order-dialog flex-col overflow-hidden bg-surface text-ink shadow-sheet open:flex",
          "backdrop:bg-ink/35 backdrop:backdrop-blur-[2px]",
          // Mobile: bottom sheet
          "fixed inset-x-0 top-auto bottom-0 m-0 max-h-[92dvh] w-full max-w-none rounded-t-2xl",
          // Tablet: centered modal
          "md:inset-0 md:m-auto md:h-fit md:max-h-[88dvh] md:w-[calc(100%-4rem)] md:max-w-2xl md:rounded-2xl",
          // Desktop: right-side drawer
          "lg:inset-y-0 lg:right-0 lg:left-auto lg:m-0 lg:h-dvh lg:max-h-none lg:w-120 lg:rounded-none lg:rounded-l-2xl",
        )}
      >
        {/* Grab handle: signals a bottom sheet on mobile. Decorative only. */}
        <span aria-hidden className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-disabled md:hidden" />
        {isOpen && <OrderForm onClose={close} />}
      </dialog>
    </>
  );
}
