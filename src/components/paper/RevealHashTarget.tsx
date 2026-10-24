"use client";

import { useEffect } from "react";

/**
 * Opens a closed <details> that holds the URL fragment's target, then scrolls the target into view. A cold
 * load does this natively; a client-side navigation (next/link) or a hash change on the same page does not.
 */
export default function RevealHashTarget() {
  useEffect(() => {
    const reveal = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      const details = target?.closest("details");
      if (!target || !details || details.open) return;
      details.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  return null;
}
