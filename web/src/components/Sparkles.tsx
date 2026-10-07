"use client";

import { useEffect, useRef } from "react";

/** Slow-drifting, twinkling gold dust. Purely decorative. */
export default function Sparkles({ density = 70 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.round(density * Math.min(1, w / 1200));
    const motes = Array.from({ length: Math.max(24, count) }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      speed: 0.004 + Math.random() * 0.012,
      drift: (Math.random() - 0.5) * 0.006,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.6 + Math.random() * 1.8,
      star: Math.random() < 0.16,
    }));

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const t = time / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        const y = (((m.y - t * m.speed) % 1) + 1) % 1;
        const x = (((m.x + t * m.drift) % 1) + 1) % 1;
        const a = 0.15 + 0.85 * Math.pow(0.5 + 0.5 * Math.sin(t * m.twinkle + m.phase), 3);
        const px = x * w;
        const py = y * h;
        ctx.globalAlpha = a;
        ctx.fillStyle = "#f0dc9c";
        ctx.shadowColor = "#e6c35c";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, m.r, 0, Math.PI * 2);
        ctx.fill();
        if (m.star) {
          const len = m.r * 6 * a;
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "#f6e7b4";
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(px - len, py);
          ctx.lineTo(px + len, py);
          ctx.moveTo(px, py - len);
          ctx.lineTo(px, py + len);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return <canvas ref={ref} className="sparkles" aria-hidden="true" />;
}
