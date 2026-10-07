import Image from "next/image";
import Link from "next/link";
import Sparkles from "@/components/Sparkles";
import PropertyCard, { img } from "@/components/PropertyCard";
import LocationsExplorer from "@/components/LocationsExplorer";
import EnquiryForm from "@/components/EnquiryForm";
import Logo from "@/components/Logo";
import StoreBadges from "@/components/StoreBadges";
import { company, formatKes, formatKesShort, fromPrice, properties } from "@/content/properties";

const flagship = properties[0];
const areas = ["Stadium", "Nyali", "Kizingo", "Nyali Beach"];

const interiors = [
  { image: "rosewood-stadium/lounge", title: "Lounge", text: "Floor-to-ceiling glazing and warm, layered textures." },
  { image: "rosewood-stadium/dining", title: "Dining", text: "Open-plan entertaining with skyline views." },
  { image: "rosewood-stadium/bedroom", title: "Master bedroom", text: "A private retreat with its own balcony." },
  { image: "rosewood-stadium/kitchen", title: "Kitchen", text: "Granite countertops and full-height storage." },
  { image: "rosewood-stadium/bedroom-suite", title: "Master suite", text: "Effortless style and a true sense of home." },
];

export default function Home() {
  const from = fromPrice(flagship)!;

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="hero">
        <div className="hero__glow" />
        <Sparkles />
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="eyebrow eyebrow--gold hero__in" style={{ animationDelay: "0.1s" }}>
              Mombasa · Kenya
            </span>
            <h1 className="hero__title">
              <span className="hero__line">
                <span style={{ animationDelay: "0.2s" }}>Elevated living</span>
              </span>
              <span className="hero__line">
                <span style={{ animationDelay: "0.35s" }}>
                  on the <em className="shimmer">Kenyan coast</em>
                </span>
              </span>
            </h1>
            <p className="hero__lede hero__in" style={{ animationDelay: "0.6s" }}>
              Three Star Towers develops premium residences in Mombasa&rsquo;s most sought-after addresses. Discover the
              Rosewood collection — four towers across Stadium, Nyali, Kizingo and the beachfront.
            </p>
            <div className="hero__cta hero__in" style={{ animationDelay: "0.75s" }}>
              <Link href="/developments" className="btn btn--gold">
                Explore residences
              </Link>
              <Link href="/#locations" className="btn btn--line">
                View on the map
              </Link>
            </div>
            <ul className="hero__areas hero__in" style={{ animationDelay: "0.9s" }}>
              {areas.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <div className="scene hero__in" data-tilt="9" style={{ animationDelay: "0.3s" }}>
            <div className="scene__ring" />
            <div className="scene__frame">
              <Image
                src={img("rosewood-stadium/tower-front")}
                alt="Rosewood Residence Stadium at dusk"
                fill
                priority
                sizes="(max-width: 900px) 80vw, 460px"
              />
              <span className="scene__sheen" />
            </div>
            <div className="scene__thumb">
              <Image src={img("rosewood-stadium/lounge")} alt="" fill sizes="200px" />
            </div>
            <div className="chip chip--price">
              <small>Now selling · from</small>
              <strong>{formatKesShort(from)}</strong>
            </div>
            <div className="chip chip--place">
              <span className="chip__dot" />
              <span>
                <strong>Rosewood Stadium</strong>
                <small>15 floors · 45 residences</small>
              </span>
            </div>
          </div>
        </div>
        <a href="#collection" className="hero__scroll" aria-label="Scroll to content">
          <span />
        </a>
      </section>

      {/* ───────── Numbers ───────── */}
      <section className="stats">
        <div className="container stats__row" data-reveal>
          <div>
            <strong data-count="4">4</strong>
            <span>Rosewood towers</span>
          </div>
          <div>
            <strong data-count="3">3</strong>
            <span>Prime neighbourhoods</span>
          </div>
          <div>
            <strong data-count="45">45</strong>
            <span>Residences at Stadium</span>
          </div>
          <div>
            <strong data-count="15">15</strong>
            <span>Floors of skyline views</span>
          </div>
        </div>
      </section>

      {/* ───────── Flagship ───────── */}
      <section className="section flagship">
        <div className="container flagship__grid">
          <div className="stack" data-reveal data-tilt="6">
            <div className="stack__main">
              <Image src={img("rosewood-stadium/tower-angle")} alt="Rosewood Residence Stadium" fill sizes="(max-width: 900px) 90vw, 520px" />
              <span className="card__glare" />
            </div>
            <div className="stack__float" data-parallax="0.08">
              <Image src={img("rosewood-stadium/aerial")} alt="Aerial view of the tower" fill sizes="260px" />
            </div>
            <div className="stack__seal">
              <Logo />
            </div>
          </div>
          <div data-reveal>
            <span className="eyebrow">Now selling · Stadium area</span>
            <h2>
              Rosewood Residence <em>Stadium</em>
            </h2>
            <p className="lede">{flagship.tagline}</p>
            <p>{flagship.description[0]}</p>
            <div className="units">
              {flagship.unitTypes.map((u) => (
                <div className="unit" key={u.id}>
                  <span className="unit__beds">{u.bedrooms}</span>
                  <div>
                    <strong>{u.name}</strong>
                    <span>
                      {u.sizeSqft.toLocaleString()} sq ft · {u.units} residences
                    </span>
                    <span className="unit__price">from {formatKes(u.pricing[0].price)}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href={`/developments/${flagship.slug}`} className="btn btn--brown">
              View floor plans &amp; pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Collection ───────── */}
      <section className="section section--sand" id="collection">
        <div className="container">
          <header className="section__head" data-reveal>
            <span className="eyebrow">The Rosewood collection</span>
            <h2>
              Four addresses. <em>One standard.</em>
            </h2>
            <p>From the heart of the island to the Indian Ocean shoreline.</p>
          </header>
          <div className="cards">
            {properties.map((p, i) => (
              <PropertyCard key={p.slug} property={p} delay={i * 90} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Map ───────── */}
      <section className="section" id="locations">
        <div className="container">
          <header className="section__head" data-reveal>
            <span className="eyebrow">Locations</span>
            <h2>
              Find us across <em>Mombasa</em>
            </h2>
            <p>Select a residence to fly to it on the live map and get directions.</p>
          </header>
          <div data-reveal>
            <LocationsExplorer />
          </div>
        </div>
      </section>

      {/* ───────── Interiors ───────── */}
      <section className="section section--dark" id="interiors">
        <Sparkles density={36} />
        <div className="container">
          <header className="section__head" data-reveal>
            <span className="eyebrow eyebrow--gold">Interiors</span>
            <h2>
              Find your place of <em className="shimmer">calm</em>
            </h2>
            <p>Effortless style, warm interiors, and a true sense of home.</p>
          </header>
          <div className="mosaic">
            {interiors.map((it, i) => (
              <figure key={it.image} className={`tile tile--${i + 1}`} data-reveal data-tilt="6" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="tile__img">
                  <Image src={img(it.image)} alt={it.title} fill sizes="(max-width: 800px) 92vw, 600px" />
                </div>
                <span className="card__glare" />
                <figcaption>
                  <strong>{it.title}</strong>
                  <span>{it.text}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Amenities ───────── */}
      <section className="section">
        <div className="container amenities">
          <header className="section__head section__head--left" data-reveal>
            <span className="eyebrow">Amenities</span>
            <h2>
              Elevated living with <em>every convenience</em>
            </h2>
            <p>Security, comfort and reliability are designed into every Rosewood tower.</p>
          </header>
          <ul className="amenities__list">
            {flagship.amenities.map((a, i) => (
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

      {/* ───────── Payment plan ───────── */}
      <section className="section section--sand" id="payment">
        <div className="container">
          <header className="section__head" data-reveal>
            <span className="eyebrow">Payment plan</span>
            <h2>
              Own it in <em>three simple steps</em>
            </h2>
            <p>A construction-linked plan for Rosewood Residence Stadium.</p>
          </header>
          <div className="plan" data-reveal>
            {flagship.paymentPlan!.map((s, i) => (
              <div className="plan__step" key={s.label} style={{ flexGrow: s.percent, transitionDelay: `${i * 160}ms` }}>
                <div className="plan__bar" />
                <strong>
                  <span data-count={s.percent}>{s.percent}</span>%
                </strong>
                <span className="plan__label">{s.label}</span>
                <span className="plan__note">{s.note}</span>
              </div>
            ))}
          </div>
          <p className="fineprint" data-reveal>
            Example: a 2-bedroom residence on floors 1–5 at {formatKes(6_500_000)} is {formatKes(1_950_000)} deposit,{" "}
            {formatKes(3_900_000)} over construction and {formatKes(650_000)} at handover. {flagship.priceNote}
          </p>
        </div>
      </section>

      {/* ───────── App ───────── */}
      <section className="section app" id="app">
        <div className="container app__grid">
          <div data-reveal>
            <span className="eyebrow">Mobile app</span>
            <h2>
              Rosewood, <em>in your pocket</em>
            </h2>
            <p className="lede">Browse every residence, compare floor plans and prices, and find each tower on the map.</p>
            <ul className="ticks">
              <li>Browse listings by neighbourhood</li>
              <li>Floor plans, galleries and live pricing bands</li>
              <li>Maps and one-tap directions to every site</li>
              <li>Save favourites and book a viewing in seconds</li>
            </ul>
            <StoreBadges />
          </div>
          <div className="phone-wrap" data-reveal data-tilt="10">
            <div className="phone">
              <div className="phone__notch" />
              <div className="phone__screen">
                <span className="phone__hello">Karibu</span>
                <strong className="phone__title">Find Your Next Home</strong>
                <div className="phone__pills">
                  <span className="on">All</span>
                  <span>Stadium</span>
                  <span>Nyali</span>
                  <span>Kizingo</span>
                </div>
                <div className="phone__card">
                  <div className="phone__img">
                    <Image src={img("rosewood-stadium/tower-angle")} alt="" fill sizes="260px" />
                    <span>● Now selling</span>
                  </div>
                  <div className="phone__row">
                    <strong>Rosewood Stadium</strong>
                    <strong>{formatKesShort(from)}</strong>
                  </div>
                  <small>Luhar Wadha St, Stadium Area</small>
                </div>
                <div className="phone__card phone__card--peek">
                  <div className="phone__img">
                    <Image src={img("rosewood-stadium/lounge")} alt="" fill sizes="260px" />
                  </div>
                </div>
                <div className="phone__tabs">
                  <span className="on">Home</span>
                  <span>Explore</span>
                  <span>Saved</span>
                  <span>Contact</span>
                </div>
              </div>
            </div>
            <div className="phone__halo" />
          </div>
        </div>
      </section>

      {/* ───────── Contact ───────── */}
      <section className="section section--dark contact" id="contact">
        <Sparkles density={30} />
        <div className="container contact__grid">
          <div data-reveal>
            <span className="eyebrow eyebrow--gold">Book a unit</span>
            <h2>
              Let&rsquo;s find <em className="shimmer">your residence</em>
            </h2>
            <p>Our sales team will walk you through availability, floor plans and the payment plan.</p>
            <div className="contact__lines">
              {company.phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="contact__phone">
                  {p}
                </a>
              ))}
              <span>{company.emails.join(" · ")}</span>
              <span>Sales office: {company.salesOffice}</span>
            </div>
          </div>
          <div className="contact__card" data-reveal>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
