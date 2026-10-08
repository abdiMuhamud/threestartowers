import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { company } from "@/content/properties";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${company.shortName} — Premium residences in Mombasa`,
    template: `%s — ${company.shortName}`,
  },
  description:
    "Three Star Towers develops premium apartments in Mombasa's most sought-after addresses: Stadium, Nyali, Kizingo and the Nyali beachfront. Explore the Rosewood Residences.",
};

export const viewport: Viewport = { themeColor: "#2a1b15" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Reveal animations only hide content once we know scripts are running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
