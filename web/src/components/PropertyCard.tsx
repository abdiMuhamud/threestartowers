import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import { formatKesShort, fromPrice, type Property } from "@/content/properties";

export const img = (key: string) => `/images/${key}.jpg`;

/** Branded stand-in for developments whose renders have not been published yet. */
export function ComingSoonArt({ area }: { area: string }) {
  return (
    <div className="soon-art">
      <Logo className="soon-art__mark" light />
      <span className="soon-art__area">{area}</span>
      <span className="soon-art__label">Rosewood · Coming soon</span>
    </div>
  );
}

export default function PropertyCard({ property: p, delay = 0 }: { property: Property; delay?: number }) {
  const from = fromPrice(p);
  const beds = p.unitTypes.map((u) => u.bedrooms);

  return (
    <Link
      href={`/developments/${p.slug}`}
      className="card"
      data-reveal
      data-tilt="7"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="card__media">
        {p.hero ? (
          <Image src={img(p.hero)} alt={p.name} fill sizes="(max-width: 700px) 92vw, 420px" />
        ) : (
          <ComingSoonArt area={p.area} />
        )}
        <span className={`badge${p.status === "selling" ? " badge--live" : ""}`}>
          {p.status === "selling" ? "Now selling" : "Coming soon"}
        </span>
        <span className="card__glare" />
      </div>
      <div className="card__body">
        <span className="eyebrow">{p.area} · Mombasa</span>
        <h3>{p.name}</h3>
        <p>{p.summary}</p>
        <div className="card__foot">
          <span className="card__price">{from ? `From ${formatKesShort(from)}` : "Register interest"}</span>
          {beds.length > 0 && (
            <span className="card__spec">
              {Math.min(...beds)} – {Math.max(...beds)} bedrooms
            </span>
          )}
          <span className="card__arrow" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
