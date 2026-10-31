/** Small, pure helpers for contact links and formatting. Safe for client and server. */

export const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/** "078 175 2556" -> "27781752556" (South African numbers). */
export function toIntl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("27")) return digits;
  if (digits.startsWith("0")) return `27${digits.slice(1)}`;
  return digits;
}

export const telHref = (phone: string) => `tel:+${toIntl(phone)}`;

export const waHref = (intlNumber: string, message?: string) =>
  `https://wa.me/${intlNumber.replace(/\D/g, "")}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export const mailHref = (email: string, subject?: string, body?: string) => {
  const q: string[] = [];
  if (subject) q.push(`subject=${encodeURIComponent(subject)}`);
  if (body) q.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}${q.length ? `?${q.join("&")}` : ""}`;
};

export const fullAddress = (b: {
  streetAddress: string;
  suburb: string;
  city: string;
  postalCode: string;
}) => `${b.streetAddress}, ${b.suburb}, ${b.city}, ${b.postalCode}`;

export const mapsEmbedSrc = (address: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

export const directionsHref = (address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

export const isExternal = (href: string) => /^https?:\/\//i.test(href);

export function formatEventDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
