import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TourViewer from "@/components/TourViewer";
import { getProperty, properties } from "@/content/properties";
import "./tour.css";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ app?: string }> };

export const generateStaticParams = () => properties.filter((p) => p.tour?.length).map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProperty((await params).slug);
  return p ? { title: `Virtual tour · ${p.name}`, description: `Look around ${p.name} room by room.` } : {};
}

export default async function Tour({ params, searchParams }: Props) {
  const p = getProperty((await params).slug);
  if (!p?.tour?.length) notFound();

  // The mobile app opens this page inside its own screen and supplies the back button.
  const inApp = (await searchParams).app === "1";

  return <TourViewer name={p.name} scenes={p.tour} backHref={inApp ? undefined : `/developments/${p.slug}`} />;
}
