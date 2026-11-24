import type { MetadataRoute } from "next";
import { properties } from "@/content/properties";
import { destinations } from "@/content/destinations";
import { guides } from "@/content/guides";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["", "/stays", "/destinations", "/journal", "/concierge", "/how-it-works", "/about", "/contact", "/accessibility", "/privacy", "/terms"];
  return [
    ...fixed.map((p) => ({ url: `${site.url}${p}` })),
    ...properties.map((p) => ({ url: `${site.url}/stays/${p.slug}` })),
    ...destinations.map((d) => ({ url: `${site.url}/destinations/${d.slug}` })),
    ...guides.map((g) => ({ url: `${site.url}/journal/${g.slug}`, lastModified: g.updated })),
  ];
}
