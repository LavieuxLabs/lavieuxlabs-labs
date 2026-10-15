import { MARK_PATHS, MARK_STROKE, MARK_VIEWBOX } from "@/lib/logoMark";

type LogoMarkProps = {
  /** Rendered width and height in px. */
  size?: number;
  className?: string;
};

// Line drawing in currentColor: set the colour with a text-* class (the spine is text-titanium).
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
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
