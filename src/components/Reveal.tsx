"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/**
 * Rise-and-fade on first scroll into view. The server HTML renders the content visible, so whatever is
 * in the first viewport paints without waiting for JavaScript (an opacity-0 start state held the largest
 * contentful paint back until hydration, ~6 s on a slow mobile profile). On hydration, before the browser
 * paints, content that is still below the fold is hidden at once and then animates in when scrolled to.
 */
export default function Reveal({ children, className, delay = 0, y = 16 }: RevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [deferred, setDeferred] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    // Runs before paint, so below-the-fold content never flashes visible after hydration.
    if (r.top >= window.innerHeight || r.bottom <= 0) setDeferred(true);
  }, [reduced]);

  const hidden = deferred && !inView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={hidden ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      transition={hidden ? { duration: 0 } : { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
