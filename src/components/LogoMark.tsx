import { MARK_BODY, MARK_COLOR, MARK_PLUS, MARK_STROKE, MARK_VIEWBOX } from "@/lib/logoMark";

type LogoMarkProps = {
  /** Rendered width and height in px. */
  size?: number;
  className?: string;
};

// The whole mark is one colour (MARK_COLOR); the plus adds a faint fill of the same colour.
export default function LogoMark({ size = 28, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={MARK_VIEWBOX}
      fill="none"
      stroke={MARK_COLOR}
      strokeWidth={MARK_STROKE}
      strokeLinejoin="miter"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {MARK_BODY.map((d) => (
        <path key={d} d={d} />
      ))}
      <path d={MARK_PLUS} fill={MARK_COLOR} fillOpacity={0.15} />
    </svg>
  );
}
