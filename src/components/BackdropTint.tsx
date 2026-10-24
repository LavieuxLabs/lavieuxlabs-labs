"use client";

import { usePathname } from "next/navigation";
import { stripLocale } from "@/i18n/config";

// Page-level atmosphere on the ground layer itself (under the grid, above the optical vignette). The steel vignette
// (`backdrop-steel`) was for the legal pages, which now sit on the opaque paper surface like every other content
// page; no route uses a tint at the moment. Add a path here only for a page that stays on the dark ground.
const TINTED: { prefix: string; tint: string }[] = [];

export default function BackdropTint() {
  const path = stripLocale(usePathname());
  const tint = TINTED.find((t) => path.startsWith(t.prefix))?.tint ?? null;
  if (!tint) return null;
  return <div className={`${tint} fixed inset-0 -z-20`} />;
}
