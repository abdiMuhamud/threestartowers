"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "/developments", label: "Developments" },
  { href: "/#locations", label: "Locations" },
  { href: "/#interiors", label: "Interiors" },
  { href: "/#payment", label: "Payment plan" },
  { href: "/#app", label: "Mobile app" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Only the home page has a dark hero behind the header.
  const overDark = pathname === "/" && !scrolled && !open;

  return (
    <header className={`header${scrolled || open ? " header--solid" : ""}${overDark ? " header--dark" : ""}`}>
      <div className="container header__row">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Logo className="brand__mark" light={overDark} />
          <span className="brand__text">
            Three Star Towers
            <small>Limited</small>
          </span>
        </Link>
        <nav className={`nav${open ? " nav--open" : ""}`} aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn--gold btn--sm" onClick={() => setOpen(false)}>
            Book a viewing
          </Link>
        </nav>
        <button
          className="burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
