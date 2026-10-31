import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [["", 1], ["/menu", 0.9], ["/our-story", 0.7], ["/gallery", 0.7], ["/events", 0.8], ["/contact", 0.8]];
  return pages.map(([p, priority]) => ({ url: `${SITE_URL}${p}`, lastModified: new Date(), priority }));
}
