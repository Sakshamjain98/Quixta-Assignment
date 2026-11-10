import { Layers, Package, Store, Truck, Wrench, type LucideIcon } from "lucide-react";

// Purely visual: maps API option codes to icons. Unknown codes fall back to a generic box.
const ICONS: Record<string, LucideIcon> = {
  pickup: Store,
  delivery: Truck,
  assembly: Wrench,
  hardware: Layers,
};

export function getOptionIcon(code: string): LucideIcon {
  return ICONS[code] ?? Package;
}
