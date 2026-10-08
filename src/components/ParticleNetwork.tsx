"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Base drift the particle relaxes back to after pointer disturbance.
  bvx: number;
  bvy: number;
  r: number;
  hub: boolean;
  phase: number;
};

// A signal travelling along an edge — the "synapse firing" effect.
type Signal = {
  from: number;
  to: number;
  t: number;
  speed: number;
  hops: number;
};

type ParticleNetworkProps = {
  className?: string;
  density?: number;
  linkDistance?: number;
};

const NODE_RGB = "153, 246, 228";
const LINK_RGB = "94, 234, 212";
const SIGNAL_RGB = "110, 231, 183";
const POINTER_RADIUS = 170;
const MAX_SIGNALS = 14;
const MAX_HOPS = 5;

export default function ParticleNetwork({
  className = "",
  density = 1,
  linkDistance = 132,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const linkSq = linkDistance * linkDistance;
    const pointer = { x: 0, y: 0, active: false };

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let signals: Signal[] = [];
    let frame = 0;
    let raf = 0;
    let inView = true;

    const targetCount = () =>
      Math.round(Math.min(150, Math.max(34, (width * height) / 10500)) * density);

    const seed = () => {
      particles = Array.from({ length: targetCount() }, () => {
        const hub = Math.random() < 0.08;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.08 + Math.random() * 0.22;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          bvx: vx,
          bvy: vy,
          r: hub ? 2 + Math.random() * 1.2 : 0.7 + Math.random() * 1.1,
          hub,
          phase: Math.random() * Math.PI * 2,
        };
      });
      signals = [];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Only reseed on significant size changes so mobile toolbar resizes don't reset the field.
      const target = targetCount();
      if (Math.abs(target - particles.length) > target * 0.2) {
        seed();
      } else {
        for (const p of particles) {
          p.x = Math.min(p.x, width);
          p.y = Math.min(p.y, height);
        }
      }
      if (reducedMotion) draw();
    };

    const neighborsOf = (i: number) => {
      const a = particles[i];
      const out: number[] = [];
      for (let j = 0; j < particles.length; j++) {
        if (j === i) continue;
        const dx = a.x - particles[j].x;
        const dy = a.y - particles[j].y;
        if (dx * dx + dy * dy < linkSq) out.push(j);
      }
      return out;
    };

    const fire = (from?: number, hops = 0) => {
      if (!particles.length || signals.length >= MAX_SIGNALS) return;
      const start = from ?? Math.floor(Math.random() * particles.length);
      const options = neighborsOf(start);
      if (!options.length) return;
      const to = options[Math.floor(Math.random() * options.length)];
      signals.push({ from: start, to, t: 0, speed: 0.014 + Math.random() * 0.016, hops });
    };

    const update = () => {
      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d > 0 && d < POINTER_RADIUS) {
            const force = (1 - d / POINTER_RADIUS) * 0.035;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }
        p.vx += (p.bvx - p.vx) * 0.02;
        p.vy += (p.bvy - p.vy) * 0.02;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) {
          p.vx *= -1;
          p.bvx *= -1;
          p.x = Math.max(0, Math.min(width, p.x));
        }
        if (p.y < 0 || p.y > height) {
          p.vy *= -1;
          p.bvy *= -1;
          p.y = Math.max(0, Math.min(height, p.y));
        }
      }

      const next: Signal[] = [];
      const chained: number[] = [];
      for (const s of signals) {
        s.t += s.speed;
        const a = particles[s.from];
        const b = particles[s.to];
        const stretched = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 > linkSq * 1.3;
        if (s.t >= 1) {
          if (s.hops < MAX_HOPS && Math.random() < 0.72) chained.push(s.to, s.hops + 1);
        } else if (!stretched) {
          next.push(s);
        }
      }
      signals = next;
      for (let i = 0; i < chained.length; i += 2) fire(chained[i], chained[i + 1]);

      frame++;
      if (frame % 32 === 0) fire();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= linkSq) continue;
          const alpha = (1 - Math.sqrt(d2) / linkDistance) * 0.2;
          ctx.strokeStyle = `rgba(${LINK_RGB}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (pointer.active) {
        ctx.lineWidth = 0.8;
        for (const p of particles) {
          const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (d >= POINTER_RADIUS) continue;
          ctx.strokeStyle = `rgba(${SIGNAL_RGB}, ${((1 - d / POINTER_RADIUS) * 0.45).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      for (const s of signals) {
        const a = particles[s.from];
        const b = particles[s.to];
        const x = a.x + (b.x - a.x) * s.t;
        const y = a.y + (b.y - a.y) * s.t;
        const fade = Math.sin(s.t * Math.PI);

        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${SIGNAL_RGB}, ${(0.35 * fade).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 9);
        glow.addColorStop(0, `rgba(${SIGNAL_RGB}, ${(0.55 * fade).toFixed(3)})`);
        glow.addColorStop(1, `rgba(${SIGNAL_RGB}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(236, 253, 245, ${fade.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of particles) {
        const twinkle = 0.6 + 0.4 * Math.sin(frame * 0.02 + p.phase);
        if (p.hub) {
          ctx.fillStyle = `rgba(${NODE_RGB}, ${(0.07 * twinkle).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${NODE_RGB}, ${((p.hub ? 0.9 : 0.5) * twinkle).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      update();
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reducedMotion || raf || !inView || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active =
        pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    };

    const onPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) pointer.active = false;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    intersectionObserver.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, linkDistance]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
}
