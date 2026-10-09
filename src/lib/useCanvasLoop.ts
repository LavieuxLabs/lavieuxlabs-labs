import { useEffect, useRef, type RefObject } from "react";

export type CanvasFrame = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  /** Seconds since the loop started (frozen at a pleasant pose under reduced motion). */
  time: number;
  /** Seconds since the previous frame, clamped so a backgrounded tab doesn't cause a jump. */
  dt: number;
  /** Pointer position relative to the canvas centre, normalised to roughly -1…1. */
  pointer: { x: number; y: number; active: boolean };
};

const REDUCED_MOTION_TIME = 7;

/**
 * Shared lifecycle for the hero canvases: DPR-aware sizing, a rAF loop that only runs while the
 * canvas is on screen and the tab is visible, pointer tracking, and a single static frame for
 * users who prefer reduced motion.
 */
export function useCanvasLoop(canvasRef: RefObject<HTMLCanvasElement | null>, render: (frame: CanvasFrame) => void) {
  const renderRef = useRef(render);

  useEffect(() => {
    renderRef.current = render;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let time = reducedMotion ? REDUCED_MOTION_TIME : 0;
    let inView = false;

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      renderRef.current({ ctx, width, height, time, dt, pointer });
    };

    const loop = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      time += dt;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reducedMotion || raf || !inView || document.hidden || !width) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      // Small screens get a lower backing-store ratio: the visuals are soft anyway and it halves fill cost.
      const maxDpr = width < 480 ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion || !raf) draw(0);
      start();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointer.active = Math.abs(pointer.x) <= 1.4 && Math.abs(pointer.y) <= 1.4;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { rootMargin: "100px" },
    );
    intersectionObserver.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [canvasRef]);
}
