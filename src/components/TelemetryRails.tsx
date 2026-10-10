// Persistent telemetry rails: two 1px vertical guides from the top of the page to the footer, on the
// edges of the max-w-7xl content box (utilities rail-left / rail-right in globals.css). They keep long
// pages reading as one continuous instrument instead of separate blocks. Rendered once in SiteShell;
// the footer's opaque plate ends them. RailMarker places coordinate marks on the same x at the start
// of a section. Decorative only: aria-hidden, no motion, hidden in print.

export default function TelemetryRails() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 print:hidden">
      <div className="rail-left absolute inset-y-0 w-px bg-white/[0.03]" />
      <div className="rail-right absolute inset-y-0 w-px bg-white/[0.03]" />
    </div>
  );
}

/** Crosshair, three hairline ticks and a dot, centred on the rail. */
function Mark() {
  return (
    <svg width="13" height="44" viewBox="0 0 13 44" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6.5 1v11M1 6.5h11" />
      <path d="M4.5 20.5h4M4.5 26.5h4M4.5 32.5h4" />
      <circle cx="6.5" cy="40.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Coordinate marks on both rails. Inside a full-width positioned section (`scope="section"`), pass
 * the offset that lines it up with the section's first line (e.g. "top-24 sm:top-32" for
 * py-24 sm:py-32). Inside a positioned max-w-7xl container (`scope="container"`, for vertically
 * centred content), it sits on the container's first line: the container edge is the rail once the
 * viewport exceeds 80rem + 2 × 0.5rem; below that the rail is 0.5rem inside it.
 */
export function RailMarker({ className = "", scope = "section" }: { className?: string; scope?: "section" | "container" }) {
  const left = scope === "section" ? "rail-left" : "left-2 min-[81rem]:left-0";
  const right = scope === "section" ? "rail-right" : "right-2 min-[81rem]:right-0";
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 text-white/[0.1] print:hidden ${className}`}>
      <span className={`${left} absolute -translate-x-1/2`}>
        <Mark />
      </span>
      <span className={`${right} absolute translate-x-1/2`}>
        <Mark />
      </span>
    </div>
  );
}
