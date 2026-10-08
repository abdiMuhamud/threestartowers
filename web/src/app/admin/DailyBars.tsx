"use client";

import { useState } from "react";

type Point = { day: string; value: number };

const W = 560;
const H = 180;
const PAD = { top: 12, right: 8, bottom: 22, left: 30 };

const label = (day: string) =>
  new Date(`${day}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/** One measure per day for the last 30 days. Single series, so the heading names it and there is no legend. */
export default function DailyBars({ title, unit, points }: { title: string; unit: string; points: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const max = Math.max(1, ...points.map((p) => p.value));
  const top = max <= 4 ? 4 : Math.ceil(max / 4) * 4;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / points.length;
  const barW = Math.max(2, slot - 2); // 2px surface gap between neighbours
  const y = (v: number) => PAD.top + plotH - (v / top) * plotH;
  const total = points.reduce((sum, p) => sum + p.value, 0);
  const active = hover === null ? null : points[hover];

  return (
    <figure className="chart">
      <figcaption>
        <strong>{title}</strong>
        <span>
          {active ? `${label(active.day)}: ${active.value} ${unit}` : `${total} ${unit} in the last 30 days`}
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: ${total} ${unit} in the last 30 days`} onMouseLeave={() => setHover(null)}>
        {[0, top / 2, top].map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(tick)} y2={y(tick)} className="chart__grid" />
            <text x={PAD.left - 8} y={y(tick) + 4} textAnchor="end" className="chart__tick">
              {tick}
            </text>
          </g>
        ))}
        {points.map((p, i) => {
          const x = PAD.left + i * slot + (slot - barW) / 2;
          const h = Math.max(p.value > 0 ? 2 : 0, plotH - (y(p.value) - PAD.top));
          const r = Math.min(4, barW / 2, h);
          return (
            <g key={p.day} onMouseEnter={() => setHover(i)}>
              {/* Full-height hit area so thin or empty days are still easy to hover. */}
              <rect x={PAD.left + i * slot} y={PAD.top} width={slot} height={plotH} fill="transparent" />
              {h > 0 && (
                <path
                  className={`chart__bar${hover === i ? " is-active" : ""}`}
                  d={`M${x},${PAD.top + plotH} v${-(h - r)} q0,${-r} ${r},${-r} h${barW - 2 * r} q${r},0 ${r},${r} v${h - r} z`}
                />
              )}
            </g>
          );
        })}
        {[0, Math.floor(points.length / 2), points.length - 1].map((i) => (
          <text
            key={i}
            x={PAD.left + i * slot + slot / 2}
            y={H - 6}
            textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
            className="chart__tick"
          >
            {label(points[i].day)}
          </text>
        ))}
      </svg>
    </figure>
  );
}
