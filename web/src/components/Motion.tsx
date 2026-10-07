"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide motion driven by data attributes, so pages stay server components:
 *  - [data-reveal]   fades/slides in when scrolled into view
 *  - [data-count]    counts up to its number when revealed
 *  - [data-tilt]     3D tilt + glare that follows the pointer
 *  - [data-parallax] drifts vertically with scroll (value = speed, e.g. "0.12")
 */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduce) {
      reveals.forEach((el) => el.classList.add("in"));
      return;
    }

    const countUp = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1400);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("in");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          if (el.dataset.count) countUp(el);
          io.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    reveals.forEach((el) => io.observe(el));

    // 3D tilt
    const cleanups: (() => void)[] = [];
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (finePointer) {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const max = Number(el.dataset.tilt) || 8;
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          el.style.setProperty("--ry", `${(x - 0.5) * 2 * max}deg`);
          el.style.setProperty("--rx", `${(0.5 - y) * 2 * max}deg`);
          el.style.setProperty("--gx", `${x * 100}%`);
          el.style.setProperty("--gy", `${y * 100}%`);
          el.classList.add("tilting");
        };
        const leave = () => {
          el.style.setProperty("--ry", "0deg");
          el.style.setProperty("--rx", "0deg");
          el.classList.remove("tilting");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    // Scroll parallax
    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of layers) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const offset = r.top + r.height / 2 - vh / 2;
        el.style.setProperty("--py", `${(-offset * Number(el.dataset.parallax)).toFixed(1)}px`);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    if (layers.length) {
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    return () => {
      io.disconnect();
      cleanups.forEach((fn) => fn());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
