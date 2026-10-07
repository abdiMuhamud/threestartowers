import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
import { company } from "@/content/properties";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a viewing or request the price list for the Rosewood Residences in Mombasa.",
};

export default function Contact() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>
            Book a <em>viewing</em>
          </h1>
          <p>Tell us which residence you are interested in and we will arrange the rest.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container two-col">
          <div className="contact__card" style={{ border: "1px solid var(--line)" }}>
            <EnquiryForm />
          </div>
          <div>
            <h3>Call us</h3>
            <ul className="nearby" style={{ marginBottom: 34 }}>
              {company.phones.map((p) => (
                <li key={p}>
                  <a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
                  <span>Sales</span>
                </li>
              ))}
            </ul>
            <h3>Email</h3>
            <ul className="nearby" style={{ marginBottom: 34 }}>
              {company.emails.map((e) => (
                <li key={e}>
                  <a href={`mailto:${e}`}>{e}</a>
                </li>
              ))}
            </ul>
            <h3>Visit</h3>
            <ul className="nearby">
              <li>
                <span>Head office</span>
                <span>{company.office}</span>
              </li>
              <li>
                <span>Sales office</span>
                <span style={{ whiteSpace: "normal", textAlign: "right" }}>{company.salesOffice}</span>
              </li>
              <li>
                <span>Post</span>
                <span>{company.poBox}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
