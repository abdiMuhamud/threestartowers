import type { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import LocationsExplorer from "@/components/LocationsExplorer";
import { properties } from "@/content/properties";

export const metadata: Metadata = {
  title: "Developments",
  description: "Browse the Rosewood Residences by Three Star Towers across Stadium, Nyali, Kizingo and Nyali Beach.",
};

export default function Developments() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">The Rosewood collection</span>
          <h1>
            Our <em>developments</em>
          </h1>
          <p>Four Rosewood towers in Mombasa&rsquo;s premium neighbourhoods. One is selling now; three are on the way.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="cards">
            {properties.map((p, i) => (
              <PropertyCard key={p.slug} property={p} delay={i * 90} />
            ))}
          </div>
        </div>
      </section>
      <section className="section section--sand">
        <div className="container">
          <header className="section__head" data-reveal>
            <span className="eyebrow">On the map</span>
            <h2>
              Where to <em>find us</em>
            </h2>
          </header>
          <div data-reveal>
            <LocationsExplorer />
          </div>
        </div>
      </section>
    </>
  );
}
