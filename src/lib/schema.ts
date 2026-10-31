import { SITE_URL, type Business } from "./content";
import { fullAddress, toIntl } from "./format";

/** Restaurant + LocalBusiness structured data, built from the same CMS content as the page. */
export function businessJsonLd(b: Business, image?: string | null) {
  const sameAs = [b.instagramUrl, b.facebookUrl].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Restaurant"],
    "@id": `${SITE_URL}/#business`,
    name: b.name,
    description:
      "Independent, owner-run neighbourhood cafe in Brixton, Johannesburg serving breakfast, brunch and lunch, locally roasted coffee, and a courtyard for events and venue hire.",
    url: SITE_URL,
    telephone: `+${toIntl(b.phoneGeneral)}`,
    email: b.email,
    servesCuisine: ["Cafe", "Breakfast", "Brunch", "Coffee"],
    hasMenu: `${SITE_URL}/menu`,
    acceptsReservations: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.streetAddress,
      addressLocality: b.suburb,
      addressRegion: "Gauteng",
      postalCode: b.postalCode,
      addressCountry: "ZA",
    },
    hasMap: `https://www.google.com/maps?q=${encodeURIComponent(fullAddress(b))}`,
    openingHoursSpecification: b.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...h.dayCodes],
      opens: h.opens,
      closes: h.closes,
    })),
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
