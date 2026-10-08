"use client";

import { useState } from "react";
import { company, properties, whatsappLink } from "@/content/properties";

/**
 * Composes a message for WhatsApp or the visitor's email app. When a name and
 * phone number are given, the enquiry is also saved so it shows up in /admin.
 */
export default function EnquiryForm({ defaultSlug }: { defaultSlug?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [slug, setSlug] = useState(defaultSlug ?? properties[0].slug);
  const [interest, setInterest] = useState("Book a viewing");
  const [note, setNote] = useState("");

  // Record the enquiry for the sales team, then let the link open WhatsApp or email as usual.
  const saveLead = () => {
    if (!name.trim() || phone.replace(/\D/g, "").length < 7) return;
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, source: "web", propertySlug: slug, interest, note }),
      keepalive: true,
    }).catch(() => {});
  };

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
        Phone number
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="07xx xxx xxx"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
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
        <a className="btn btn--gold" href={whatsappLink(message)} target="_blank" rel="noopener" onClick={saveLead}>
          Send on WhatsApp
        </a>
        <a className="btn btn--ghost" href={mailto} onClick={saveLead}>
          Send by email
        </a>
      </div>
      <p className="form__consent">
        By sending, you agree that Three Star Towers may contact you about this enquiry. See our{" "}
        <a href="/privacy">privacy notice</a>.
      </p>
    </form>
  );
}
