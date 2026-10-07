import Link from "next/link";
import Logo from "./Logo";
import { company, properties } from "@/content/properties";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <div className="brand brand--light">
            <Logo className="brand__mark" light />
            <span className="brand__text">
              Three Star Towers
              <small>Limited</small>
            </span>
          </div>
          <p className="footer__lede">{company.strapline}. Home of the Rosewood Residences.</p>
        </div>
        <div>
          <h4>Developments</h4>
          <ul>
            {properties.map((p) => (
              <li key={p.slug}>
                <Link href={`/developments/${p.slug}`}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Visit</h4>
          <ul>
            <li>Head office: {company.office}</li>
            <li>Sales office: {company.salesOffice}</li>
            <li>{company.poBox}</li>
          </ul>
        </div>
        <div>
          <h4>Talk to us</h4>
          <ul>
            {company.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
              </li>
            ))}
            {company.emails.map((e) => (
              <li key={e}>
                <a href={`mailto:${e}`}>{e}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer__base">
        <span>
          © {new Date().getFullYear()} {company.name}
        </span>
        <span>
          Images are artist&rsquo;s impressions. Information is subject to change and does not constitute an offer or
          contract.
        </span>
      </div>
    </footer>
  );
}
