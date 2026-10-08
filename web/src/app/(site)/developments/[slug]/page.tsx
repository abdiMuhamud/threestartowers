import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MapView from "@/components/MapView";
import EnquiryForm from "@/components/EnquiryForm";
import { ComingSoonArt, img } from "@/components/PropertyCard";
import TourIcon from "@/components/TourIcon";
import {
  directionsLink,
  formatKes,
  formatKesShort,
  fromPrice,
  getProperty,
  properties,
  sqftToSqm,
} from "@/content/properties";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => properties.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProperty((await params).slug);
  return p ? { title: p.name, description: p.summary } : {};
}

export default async function Development({ params }: Props) {
  const p = getProperty((await params).slug);
  if (!p) notFound();

  const from = fromPrice(p);
  const selling = p.status === "selling";

  return (
    <>
      <section className="detail-hero">
        <div className="container detail-hero__grid">
          <div className="hero__in">
            <Link href="/developments" className="back">
              ← All developments
            </Link>
            <br />
            <span className="eyebrow" style={{ marginTop: 22 }}>
              {selling ? "Now selling" : "Coming soon"} · {p.area}
            </span>
            <h1>{p.name}</h1>
            <p className="lede">{p.tagline}</p>
            {p.description.map((d) => (
              <p key={d} style={{ marginBottom: 12 }}>
                {d}
              </p>
            ))}
            <div className="facts">
              {from && <span>From {formatKesShort(from)}</span>}
              {p.floors && <span>{p.floors} floors</span>}
              {p.totalUnits && <span>{p.totalUnits} residences</span>}
              <span>{p.address}</span>
            </div>
            <div className="hero__cta" style={{ margin: 0 }}>
              <a href="#enquire" className="btn btn--brown">
                {selling ? "Book a viewing" : "Register interest"}
              </a>
              {p.tour && (
                <Link href={`/tour/${p.slug}`} className="btn btn--ghost">
                  <TourIcon /> Virtual tour
                </Link>
              )}
            </div>
          </div>
          {p.hero ? (
            <div className="detail-hero__media hero__in" data-tilt="7" style={{ animationDelay: "0.2s" }}>
              <div>
                <Image src={img(p.hero)} alt={p.name} fill priority sizes="(max-width: 980px) 92vw, 560px" />
              </div>
              <span className="card__glare" style={{ borderRadius: "inherit" }} />
            </div>
          ) : (
            <div className="soon-panel hero__in" style={{ animationDelay: "0.2s" }}>
              <ComingSoonArt area={p.area} />
            </div>
          )}
        </div>
      </section>

      {p.unitTypes.length > 0 && (
        <section className="section">
          <div className="container">
            <header className="section__head" data-reveal>
              <span className="eyebrow">Floor plans &amp; pricing</span>
              <h2>
                Choose your <em>residence</em>
              </h2>
            </header>
            <div className="plans">
              {p.unitTypes.map((u) => (
                <article className="plan-card" key={u.id} data-reveal>
                  <h3>
                    {u.name}
                    <span>
                      {u.sizeSqft.toLocaleString()} sq ft · {sqftToSqm(u.sizeSqft)} m² · {u.units} residences
                    </span>
                  </h3>
                  {u.plan && (
                    <div className="plan-card__img">
                      <Image src={img(u.plan)} alt={`${u.name} 3D floor plan`} fill sizes="(max-width: 980px) 92vw, 540px" />
                    </div>
                  )}
                  <ul className="rooms">
                    {u.rooms.map((r, i) => (
                      <li key={`${r}-${i}`}>{r}</li>
                    ))}
                  </ul>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Floor</th>
                          <th>Price</th>
                          {p.paymentPlan?.map((s) => (
                            <th key={s.label}>
                              {s.percent}% {s.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {u.pricing.map((b) => (
                          <tr key={b.floors}>
                            <td>{b.floors}</td>
                            <td className="price">{formatKes(b.price)}</td>
                            {p.paymentPlan?.map((s) => (
                              <td key={s.label}>{((b.price * s.percent) / 100).toLocaleString("en-KE")}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              ))}
            </div>
            {p.priceNote && <p className="fineprint">{p.priceNote} Ground and basement floors are parking.</p>}
          </div>
        </section>
      )}

      {p.gallery.length > 0 && (
        <section className="section section--sand">
          <div className="container">
            <header className="section__head" data-reveal>
              <span className="eyebrow">Gallery</span>
              <h2>
                A closer <em>look</em>
              </h2>
            </header>
            <div className="gallery">
              {p.gallery.map((g) => (
                <figure key={g.image} data-reveal>
                  <Image src={img(g.image)} alt={g.caption} width={900} height={700} sizes="(max-width: 700px) 92vw, 400px" />
                  <figcaption>{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container two-col">
          <div data-reveal>
            <span className="eyebrow">Location</span>
            <h2>
              {p.area}, <em>Mombasa</em>
            </h2>
            <p>{p.address}</p>
            {p.nearby.length > 0 && (
              <ul className="nearby" style={{ marginTop: 20 }}>
                {p.nearby.map((n) => (
                  <li key={n.place}>
                    <span>{n.place}</span>
                    <span>{n.time}</span>
                  </li>
                ))}
              </ul>
            )}
            <a href={directionsLink(p)} target="_blank" rel="noopener" className="btn btn--ghost" style={{ marginTop: 26 }}>
              Get directions
            </a>
            {p.coordsApproximate && <p className="note">The pin marks the neighbourhood; contact sales for the exact site.</p>}
          </div>
          <div data-reveal>
            <MapView properties={[p]} zoom={15} className="map--detail" />
          </div>
        </div>
      </section>

      {p.amenities.length > 0 && (
        <section className="section section--sand">
          <div className="container amenities">
            <header className="section__head section__head--left" data-reveal>
              <span className="eyebrow">Amenities</span>
              <h2>
                Every <em>convenience</em>
              </h2>
            </header>
            <ul className="amenities__list">
              {p.amenities.map((a, i) => (
                <li key={a} data-reveal style={{ transitionDelay: `${i * 45}ms` }}>
                  <span className="star" aria-hidden="true">
                    ★
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section section--dark contact" id="enquire">
        <div className="container contact__grid">
          <div data-reveal>
            <span className="eyebrow eyebrow--gold">{selling ? "Book a unit" : "Be first to know"}</span>
            <h2>
              Enquire about <em className="shimmer">{p.area}</em>
            </h2>
            <p>Send us a message and our sales team will get back to you with availability and next steps.</p>
          </div>
          <div className="contact__card" data-reveal>
            <EnquiryForm defaultSlug={p.slug} />
          </div>
        </div>
      </section>
    </>
  );
}
