// The `cn` helper shadcn-style components expect: merge conditional class
// names, and let a later Tailwind class beat an earlier one that sets the
// same property (so a `className` prop can override a component default).

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
