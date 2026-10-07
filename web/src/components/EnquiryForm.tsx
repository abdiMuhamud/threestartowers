"use client";

import { useState } from "react";
import { company, properties, whatsappLink } from "@/content/properties";

/**
 * There is no backend yet: the form composes a message and hands it to
 * WhatsApp or the visitor's email app, addressed to the sales team.
 */
export default function EnquiryForm({ defaultSlug }: { defaultSlug?: string }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState(defaultSlug ?? properties[0].slug);
  const [interest, setInterest] = useState("Book a viewing");
  const [note, setNote] = useState("");

  const property = properties.find((p) => p.slug === slug)!;
  const message =
    `Hello Three Star Towers, my name is ${name || "…"}. ` +
    `I'm interested in ${property.name} (${interest.toLowerCase()}).` +
    (note ? ` ${note}` : "");
  const mailto = `mailto:${company.emails[0]}?subject=${encodeURIComponent(
    `Enquiry: ${property.name}`,
  )}&body=${encodeURIComponent(message)}`;

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <label>
        Your name
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" />
      </label>
      <label>
        Residence
        <select value={slug} onChange={(e) => setSlug(e.target.value)}>
          {properties.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        I would like to
        <select value={interest} onChange={(e) => setInterest(e.target.value)}>
          <option>Book a viewing</option>
          <option>Receive the price list</option>
          <option>Discuss the payment plan</option>
          <option>Register my interest</option>
        </select>
      </label>
      <label>
        Anything else? <span className="optional">(optional)</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Preferred floor, unit type, timing…" />
      </label>
      <div className="form__actions">
        <a className="btn btn--gold" href={whatsappLink(message)} target="_blank" rel="noopener">
          Send on WhatsApp
        </a>
        <a className="btn btn--ghost" href={mailto}>
          Send by email
        </a>
      </div>
    </form>
  );
}
