import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { SITE } from "@/config/site";
import { Container } from "./container";
import { IconButton } from "@/components/ui/icon-button";

const linkClass =
  "rounded-md text-[15px] text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink aria-[current=page]:text-ink";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-canvas/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          {/* Mobile menu: native <details> gives an accessible toggle with no client JS. */}
          <details className="group relative md:hidden">
            <summary className="-ml-2 grid size-11 cursor-pointer list-none place-items-center rounded-full hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-ink [&::-webkit-details-marker]:hidden">
              <Menu className="size-5 group-open:hidden" strokeWidth={1.6} aria-hidden />
              <X className="hidden size-5 group-open:block" strokeWidth={1.6} aria-hidden />
              <span className="sr-only">Menu</span>
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute left-0 top-13 w-56 rounded-xl border border-line bg-surface p-2 shadow-soft"
            >
              {SITE.nav.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={i === 0 ? "page" : undefined}
                  className="block rounded-lg px-3 py-2.5 text-[15px] text-ink hover:bg-canvas focus-visible:outline-2 focus-visible:outline-ink"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </details>

          <Link href="/" className="text-lg font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
            {SITE.name}
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {SITE.nav.map((item, i) => (
              <a key={item.label} href={item.href} aria-current={i === 0 ? "page" : undefined} className={linkClass}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="-mr-2 flex items-center">
          <IconButton aria-label="Search">
            <Search className="size-5" strokeWidth={1.6} aria-hidden />
          </IconButton>
          <IconButton aria-label="Shopping bag">
            <ShoppingBag className="size-5" strokeWidth={1.6} aria-hidden />
          </IconButton>
        </div>
      </Container>
    </header>
  );
}
