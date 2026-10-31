import type { Metadata } from "next";
import { CalendarDays, Mail, Phone } from "lucide-react";
import { Button, TextLink } from "@/components/Button";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ImageReveal, Reveal } from "@/components/Motion";
import { Photo } from "@/components/Photo";
import { getBusiness, getEvents, getHome, getPhotos } from "@/lib/content";
import { formatEventDate, mailHref, telHref } from "@/lib/format";
import { venueEnquiryHref } from "@/lib/links";

export const metadata: Metadata = {
  title: "Events & Venue Hire in Brixton, Johannesburg",
  description:
    "Hire Breezeblock Cafe's courtyard and interior for birthdays, engagements, corporate gatherings, book launches, music events and celebrations in Brixton, Johannesburg. We are licensed.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Events & Venue Hire | Breezeblock Cafe, Brixton",
    description: "A courtyard venue with character for celebrations, corporate gatherings and creative events.",
    url: "/events",
  },
};

export default async function EventsPage() {
  const [b, h, photos, upcoming] = await Promise.all([getBusiness(), getHome(), getPhotos(), getEvents()]);
  return (
    <>
      <section className="on-dark bg-forest text-cream">
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-cream/70">Events &amp; venue hire</p>
            <h1 className="display mt-4 text-[clamp(3rem,8vw,7rem)]">{h.eventsHeadline}</h1>
            <p className="mt-7 max-w-xl text-lg text-cream/85">{h.eventsBody}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="#enquire" variant="light">Send an enquiry</Button>
              <Button href={venueEnquiryHref(b)} variant="ghost-light">
                {b.eventsWhatsappConfirmed ? "WhatsApp us" : "Email us"}
              </Button>
            </div>
          </div>
          <ImageReveal className="lg:col-span-5">
            <Photo src={photos.events.src} alt={photos.events.alt} label="Events" tone="sand" priority className="aspect-[4/5] w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
          </ImageReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-6">
            <h2 className="display text-[clamp(2.4rem,4.5vw,4rem)] text-forest">What we host</h2>
            <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
              {h.eventTypes.map((t) => (
                <li key={t} className="border-t border-forest/20 py-3.5 text-lg">{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-lg lg:col-span-5 lg:col-start-8">
            <h2 className="display text-[clamp(2.4rem,4.5vw,4rem)] text-forest">About hiring the space</h2>
            <p>We have a liquor licence and are happy to host big groups for breakfasts, lunches, celebrations and private dinners. Audio-visual equipment can be provided if needed.</p>
            <p>We can provide halaal meals through an external caterer for any event, if required.</p>
            <p>Fundraisers, corporate events, musical performances, album launches and fashion shoots are all welcome. Tell us what you have in mind and we&rsquo;ll be happy to provide a quote.</p>
          </Reveal>
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="bg-sand py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <h2 className="display text-[clamp(2.4rem,4.5vw,4rem)] text-forest">Coming up</h2>
            <ul className="mt-10 grid gap-8 md:grid-cols-2">
              {upcoming.map((e) => (
                <li key={e.slug} className="grid gap-5 border-t border-forest/30 pt-6 sm:grid-cols-[9rem_1fr]">
                  {e.image ? (
                    <Photo src={e.image} alt={e.imageAlt} label={e.title} className="aspect-square w-full sm:w-36" sizes="150px" />
                  ) : (
                    <CalendarDays aria-hidden className="size-9 text-clay" strokeWidth={1.5} />
                  )}
                  <div>
                    <p className="eyebrow text-clay">{formatEventDate(e.date)}{e.time ? ` · ${e.time}` : ""}</p>
                    <h3 className="display mt-2 text-3xl text-forest">{e.title}</h3>
                    {e.description && <p className="mt-2 text-charcoal/85">{e.description}</p>}
                    {e.linkHref && e.linkLabel && <p className="mt-3"><TextLink href={e.linkHref}>{e.linkLabel}</TextLink></p>}
                  </div>
                </li>
              ))}
            </ul>
            {b.instagramUrl && <p className="mt-10 text-charcoal/80">More happenings on <TextLink href={b.instagramUrl}>Instagram</TextLink>.</p>}
          </div>
        </section>
      )}

      <section id="enquire" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="display text-[clamp(2.4rem,4.5vw,4rem)] text-forest">Make an enquiry</h2>
            <p className="mt-5 text-lg">Tell us about your event and we&rsquo;ll come back to you. Enquiries are subject to confirmation and availability.</p>
            <div className="mt-8 space-y-4">
              <p className="flex gap-3"><Phone aria-hidden className="mt-1 size-5 shrink-0 text-clay" />
                <span><a href={telHref(b.phoneEvents)} className="font-semibold underline decoration-clay/40 underline-offset-4 hover:decoration-clay">{b.phoneEvents}</a><br /><span className="text-sm text-charcoal/70">{b.eventsContactName}, venue hire &amp; events</span></span></p>
              <p className="flex gap-3"><Mail aria-hidden className="mt-1 size-5 shrink-0 text-clay" />
                <a href={mailHref(b.email, "Venue hire enquiry")} className="font-semibold underline decoration-clay/40 underline-offset-4 hover:decoration-clay">{b.email}</a></p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <EnquiryForm eventTypes={h.eventTypes} phone={b.phoneEvents} email={b.email} fallbackHref={mailHref(b.email, "Venue hire enquiry")} />
          </div>
        </div>
      </section>
    </>
  );
}
