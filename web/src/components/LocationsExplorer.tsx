"use client";

import Link from "next/link";
import { useState } from "react";
import MapView from "./MapView";
import { directionsLink, formatKesShort, fromPrice, properties } from "@/content/properties";

export default function LocationsExplorer() {
  const [active, setActive] = useState<string>();

  return (
    <div className="locations">
      <ul className="locations__list">
        {properties.map((p) => {
          const from = fromPrice(p);
          return (
            <li key={p.slug}>
              <button
                className={`loc${active === p.slug ? " loc--active" : ""}`}
                onClick={() => setActive(p.slug)}
                aria-pressed={active === p.slug}
              >
                <span className="loc__area">{p.area}</span>
                <span className="loc__name">{p.name}</span>
                <span className="loc__meta">
                  {p.address} · {from ? `from ${formatKesShort(from)}` : "Coming soon"}
                </span>
              </button>
              {active === p.slug && (
                <div className="loc__actions">
                  <Link href={`/developments/${p.slug}`}>View residence</Link>
                  <a href={directionsLink(p)} target="_blank" rel="noopener">
                    Get directions
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <MapView properties={properties} active={active} onSelect={setActive} className="locations__map" />
    </div>
  );
}
