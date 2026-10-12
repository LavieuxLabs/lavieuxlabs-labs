"use client";

import { usePathname } from "next/navigation";
import { stripLocale } from "@/i18n/config";

// Page-level atmosphere on the ground layer itself (under the grid, above the optical vignette):
// home = both products' light drifting in from the top corners; about / legal = a deep steel and warm
// titanium vignette. Product pages carry their own hero ambient light, so they get none here.
export default function BackdropTint() {
  const path = stripLocale(usePathname());
  const tint =
    path === "/" ? "backdrop-dual" : path.startsWith("/about") || path.startsWith("/legal") ? "backdrop-steel" : null;
  if (!tint) return null;
  return <div className={`${tint} fixed inset-0 -z-20`} />;
}
