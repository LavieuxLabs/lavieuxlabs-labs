import type { ReactNode } from "react";

/**
 * Above-the-fold entrance: the same rise and fade as Reveal, but in CSS (`hero-reveal`, globals.css), so
 * the hero text paints with the server HTML instead of waiting for hydration. Reveal's JS start state
 * (opacity 0 until framer-motion runs) held the hero paragraph, the LCP element, back by ~6 s on a slow
 * mobile profile. Reduced motion turns the animation off in CSS.
 */
export default function HeroReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={`hero-reveal ${className}`} style={delay ? { animationDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}
