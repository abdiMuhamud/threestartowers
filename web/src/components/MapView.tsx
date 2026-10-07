"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { directionsLink, type Property } from "@/content/properties";

type Props = {
  properties: Property[];
  /** Slug to highlight and fly to. */
  active?: string;
  onSelect?: (slug: string) => void;
  zoom?: number;
  className?: string;
};

/** Live OpenStreetMap with a branded pin per development. */
export default function MapView({ properties, active, onSelect, zoom = 13, className }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<Record<string, Marker>>({});
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current || map.current) return;

      const m = L.map(el.current, { scrollWheelZoom: false, zoomControl: false });
      L.control.zoom({ position: "bottomright" }).addTo(m);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(m);

      for (const p of properties) {
        const icon = L.divIcon({
          className: "pin-wrap",
          html: `<div class="pin${p.status === "selling" ? " pin--live" : ""}"><span>${p.area}</span></div>`,
          iconSize: [0, 0],
        });
        const marker = L.marker([p.coords.lat, p.coords.lng], { icon, title: p.name }).addTo(m);
        marker.bindPopup(
          `<strong>${p.name}</strong><br>${p.address}${p.coordsApproximate ? "<br><em>Pin shows the neighbourhood</em>" : ""}` +
            `<br><a href="/developments/${p.slug}">View residence</a> · <a href="${directionsLink(p)}" target="_blank" rel="noopener">Directions</a>`,
          { offset: [0, -34] },
        );
        marker.on("click", () => onSelectRef.current?.(p.slug));
        markers.current[p.slug] = marker;
      }

      if (properties.length > 1) {
        m.fitBounds(L.latLngBounds(properties.map((p) => [p.coords.lat, p.coords.lng])), { padding: [70, 70] });
      } else if (properties[0]) {
        m.setView([properties[0].coords.lat, properties[0].coords.lng], zoom);
      }
      map.current = m;
    })();

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markers.current = {};
    };
  }, [properties, zoom]);

  useEffect(() => {
    const p = properties.find((x) => x.slug === active);
    const m = map.current;
    if (!p || !m) return;
    m.flyTo([p.coords.lat, p.coords.lng], 15, { duration: 1.1 });
    markers.current[p.slug]?.openPopup();
  }, [active, properties]);

  return <div ref={el} className={`map ${className ?? ""}`} />;
}
