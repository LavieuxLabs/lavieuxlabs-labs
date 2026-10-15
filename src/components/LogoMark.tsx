import { MARK_BODY, MARK_PLUS, MARK_PLUS_COLOR, MARK_STROKE, MARK_VIEWBOX } from "@/lib/logoMark";

type LogoMarkProps = {
  /** Rendered width and height in px. */
  size?: number;
  className?: string;
};

// Dual tone: the L body draws in currentColor (set with a text-* class; the spine is text-titanium), the
// plus always carries the mark violet with a faint fill of the same colour.
export default function LogoMark({ size = 28, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={MARK_VIEWBOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={MARK_STROKE}
      strokeLinejoin="miter"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {MARK_BODY.map((d) => (
        <path key={d} d={d} />
      ))}
      <path d={MARK_PLUS} stroke={MARK_PLUS_COLOR} fill={MARK_PLUS_COLOR} fillOpacity={0.15} />
    </svg>
  );
}
