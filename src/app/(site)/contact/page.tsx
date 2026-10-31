import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Motion";
import { getBusiness } from "@/lib/content";
import { directionsHref, fullAddress, mailHref, mapsEmbedSrc, telHref } from "@/lib/format";
import { reservationHref, venueEnquiryHref } from "@/lib/links";

export const metadata: Metadata = {
  title: "Find Us & Contact | 29 Chiswick Street, Brixton",
  description:
    "Visit Breezeblock Cafe at 29 Chiswick Street, Brixton, Johannesburg. Opening hours, phone numbers, directions and reservation enquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Find Us | Breezeblock Cafe, Brixton",
    description: "29 Chiswick Street, Brixton, Johannesburg. Open seven days a week.",
    url: "/contact",
  },
};

export default async function ContactPage() {
  const b = await getBusiness();
  const address = fullAddress(b);
  return (
    <>
      <section className="on-dark bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
          <p className="eyebrow text-cream/70">Find us</p>
          <h1 className="display mt-4 text-[clamp(3rem,8vw,7rem)]">Right here in Brixton.</h1>
          <p className="mt-7 max-w-xl text-lg text-cream/85">Feel free to contact us for more details or a booking. All are welcome.</p>
        </div>
      </section>

      <section id="visit" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="space-y-10 lg:col-span-5">
            <div>
              <h2 className="eyebrow flex items-center gap-2 text-clay"><MapPin aria-hidden className="size-4" />Address</h2>
              <address className="mt-3 text-xl not-italic">{address}.</address>
              <div className="mt-5"><Button href={directionsHref(address)}>Get Directions</Button></div>
            </div>
            <div>
              <h2 className="eyebrow flex items-center gap-2 text-clay"><Clock aria-hidden className="size-4" />Opening hours</h2>
              <dl className="mt-3 space-y-1.5 text-lg">
                {b.hours.map((x) => (
                  <div key={x.days} className="flex gap-4"><dt className="w-40 font-semibold">{x.days}</dt><dd className="tabular-nums">{x.opens}–{x.closes}</dd></div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="eyebrow flex items-center gap-2 text-clay"><Phone aria-hidden className="size-4" />Call us</h2>
              <p className="mt-3 text-lg">
                <a href={telHref(b.phoneGeneral)} className="font-semibold underline decoration-clay/40 underline-offset-4 hover:decoration-clay">{b.phoneGeneral}</a>
                <span className="block text-sm text-charcoal/70">General enquiries &amp; reservations</span>
              </p>
              <p className="mt-4 text-lg">
                <a href={telHref(b.phoneEvents)} className="font-semibold underline decoration-clay/40 underline-offset-4 hover:decoration-clay">{b.phoneEvents}</a>
                <span className="block text-sm text-charcoal/70">{b.eventsContactName} · venue hire &amp; events</span>
              </p>
            </div>
            <div>
              <h2 className="eyebrow flex items-center gap-2 text-clay"><Mail aria-hidden className="size-4" />Email</h2>
              <p className="mt-3 text-lg"><a href={mailHref(b.email)} className="font-semibold underline decoration-clay/40 underline-offset-4 hover:decoration-clay">{b.email}</a></p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href={reservationHref(b)} icon={<MessageCircle aria-hidden className="size-4" />}>Reservation Enquiry</Button>
              <Button href={venueEnquiryHref(b)} variant="outline">Venue Hire Enquiry</Button>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7">
            <div className="aspect-[4/3] w-full overflow-hidden bg-sand lg:aspect-auto lg:h-full lg:min-h-[32rem]">
              <iframe title={`Map showing ${b.name}, ${address}`} src={mapsEmbedSrc(address)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full border-0" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
