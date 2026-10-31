import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone, Sofa, Sprout, BookOpen, Wifi, Users } from "lucide-react";
import { Button, TextLink } from "@/components/Button";
import { Photo } from "@/components/Photo";
import { HeroStage, ImageReveal, Parallax, Reveal } from "@/components/Motion";
import { getBusiness, getHome, getPhotos, getSignatureDishes } from "@/lib/content";
import { directionsHref, fullAddress, mapsEmbedSrc, telHref } from "@/lib/format";
import { reservationHref, venueEnquiryHref } from "@/lib/links";

export const metadata: Metadata = {
  title: { absolute: "Breezeblock Cafe | Neighbourhood Cafe in Brixton, Johannesburg" },
  description:
    "Discover Breezeblock Cafe in Brixton, Johannesburg. Enjoy delicious breakfast, brunch, lunch, locally roasted coffee and our beautiful courtyard. Visit us today.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Breezeblock Cafe | Neighbourhood Cafe in Brixton, Johannesburg",
    description:
      "Breakfast, brunch, lunch, locally roasted coffee and a courtyard oasis in Brixton, Johannesburg.",
    url: "/",
  },
};

const stayIcons = [Wifi, Sofa, BookOpen, Sprout, Users];

export default async function HomePage() {
  const [b, h, photos, dishes] = await Promise.all([
    getBusiness(),
    getHome(),
    getPhotos(),
    getSignatureDishes(),
  ]);
  const address = fullAddress(b);
  const [lead, ...rest] = dishes;

  return (
    <>
      {/* 1 · HERO */}
      <section className="on-dark relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-forest text-cream md:min-h-[calc(100svh-5rem)]">
        <HeroStage
          contentClassName="mx-auto w-full max-w-7xl px-5 pb-14 pt-32 md:px-8 md:pb-20"
          media={
            <>
              <Photo
                src={photos.hero.src}
                alt={photos.hero.alt}
                label="Courtyard"
                priority
                sizes="100vw"
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/35 to-forest/25" />
            </>
          }
        >
          {[
            <p key="loc" className="eyebrow mb-6 flex items-center gap-3 text-cream/90">
              <span aria-hidden className="h-px w-10 bg-terracotta" />
              Brixton, Johannesburg.
            </p>,
            <h1
              key="h1"
              className="display max-w-5xl text-[clamp(3.1rem,9vw,8rem)] font-medium"
            >
              {h.heroHeadline}
            </h1>,
            <p key="p" className="mt-6 max-w-xl text-lg text-cream/90 md:text-xl">
              {h.heroText}
            </p>,
            <div key="cta" className="mt-9 flex flex-wrap gap-3">
              <Button href="/menu" variant="light">
                Explore Our Menu
              </Button>
              <Button href="/contact#visit" variant="ghost-light">
                Find Us
              </Button>
            </div>,
          ]}
        </HeroStage>
      </section>

      {/* 2 · BRAND INTRODUCTION */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="relative lg:col-span-5">
            <ImageReveal>
              <Photo
                src={photos.intro.src}
                alt={photos.intro.alt}
                label="Interior"
                className="aspect-[4/5] w-full"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </ImageReveal>
            <div
              aria-hidden
              className="absolute -bottom-8 right-4 flex size-32 rotate-[-8deg] flex-col items-center justify-center rounded-full border border-forest bg-cream text-center text-forest md:-right-8"
            >
              <span className="eyebrow text-[0.6rem]">Made for</span>
              <span className="display text-3xl italic">Brixton</span>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="eyebrow text-clay">Who we are</p>
              <h2 className="display mt-4 text-[clamp(2.6rem,5.5vw,5rem)] text-forest">
                {h.introHeadline}
              </h2>
            </Reveal>
            <div className="mt-8 space-y-5 text-lg text-charcoal/90">
              {h.introBody.map((p, i) => (
                <Reveal key={i} delay={0.08 * (i + 1)}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.25} className="mt-9">
              <TextLink href="/our-story">Read our story</TextLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 · THE COURTYARD */}
      <section className="on-dark bg-forest py-24 text-cream md:py-36">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow text-cream/70">The courtyard</p>
              <h2 className="display mt-4 text-[clamp(2.8rem,7vw,6.5rem)]">{h.courtyardHeadline}</h2>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5">
              <p className="text-lg text-cream/85">{h.courtyardText}</p>
            </Reveal>
          </div>

          <Reveal className="mt-14">
            <Parallax className="aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]" strength={9}>
              <Photo
                src={photos.courtyardLarge.src}
                alt={photos.courtyardLarge.alt}
                label="Courtyard"
                tone="sand"
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="h-full w-full"
              />
            </Parallax>
          </Reveal>

          <div className="mt-6 grid gap-6 md:grid-cols-12 md:gap-8">
            <ImageReveal className="md:col-span-5">
              <Photo
                src={photos.courtyardA.src}
                alt={photos.courtyardA.alt}
                label="Succulent garden"
                tone="sand"
                className="aspect-[4/5] w-full"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </ImageReveal>
            <div className="flex flex-col justify-between gap-10 md:col-span-7 md:pt-24">
              <ImageReveal delay={0.1}>
                <Photo
                  src={photos.courtyardB.src}
                  alt={photos.courtyardB.alt}
                  label="Fish pond & tile mural"
                  tone="sand"
                  className="aspect-[4/3] w-full"
                  sizes="(min-width: 768px) 55vw, 100vw"
                />
              </ImageReveal>
              <Reveal>
                <ul className="flex flex-wrap gap-x-6 gap-y-3 text-cream/90">
                  {h.courtyardFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span aria-hidden className="size-1.5 rounded-full bg-terracotta" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button href="/gallery" variant="light">
                    Explore Our Space
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · FOOD */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-clay">From our kitchen</p>
          <h2 className="display mt-4 text-[clamp(2.6rem,6vw,5.5rem)] text-forest">{h.foodHeadline}</h2>
        </Reveal>

        {lead && (
          <article className="mt-16 grid items-center gap-8 border-t border-forest/20 pt-10 lg:grid-cols-12 lg:gap-12">
            <ImageReveal className="lg:col-span-7">
              <Photo
                src={lead.photo}
                alt={lead.photoAlt}
                label={lead.name}
                tone="sand"
                className="aspect-[4/3] w-full"
                sizes="(min-width: 1024px) 58vw, 100vw"
              />
            </ImageReveal>
            <Reveal className="lg:col-span-5">
              <DishText n="01" dish={lead} large />
            </Reveal>
          </article>
        )}

        <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {rest.map((d, i) => (
            <article key={d.name} className={i % 2 === 1 ? "md:mt-20" : ""}>
              <ImageReveal>
                <Photo
                  src={d.photo}
                  alt={d.photoAlt}
                  label={d.name}
                  tone="sand"
                  className="aspect-[4/3] w-full"
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
              </ImageReveal>
              <Reveal className="mt-6">
                <DishText n={String(i + 2).padStart(2, "0")} dish={d} />
              </Reveal>
            </article>
          ))}
        </div>

        <Reveal className="mt-20 flex justify-center">
          <Button href="/menu">See the full menu</Button>
        </Reveal>
      </section>

      {/* 5 · COFFEE */}
      <section className="bg-sand py-24 md:py-36">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-12 lg:gap-8">
          <div className="relative lg:col-span-6">
            <ImageReveal>
              <Photo
                src={photos.coffee.src}
                alt={photos.coffee.alt}
                label="Coffee"
                className="aspect-[4/5] w-full lg:w-[78%]"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </ImageReveal>
            <ImageReveal delay={0.15} className="absolute -bottom-10 right-0 hidden w-[48%] lg:block">
              <Photo
                src={photos.coffeeSecondary.src}
                alt={photos.coffeeSecondary.alt}
                label="Espresso"
                tone="sand"
                className="aspect-square w-full border-8 border-sand"
                sizes="25vw"
              />
            </ImageReveal>
          </div>
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-forest">Coffee culture</p>
              <h2 className="display mt-4 text-[clamp(2.6rem,5.5vw,5rem)] text-forest">
                {h.coffeeHeadline}
              </h2>
            </Reveal>
            <div className="mt-8 space-y-4 text-lg">
              {h.coffeeBody.map((p, i) => (
                <Reveal key={i} delay={0.06 * (i + 1)}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <ul className="mt-9 max-w-md space-y-3 text-forest">
                {h.coffeeHighlights.map((c) => (
                  <li key={c.name} className="flex items-baseline gap-3">
                    <span className="display text-2xl">{c.name}</span>
                    <span aria-hidden className="leader" />
                    <span className="font-semibold tabular-nums">{c.price}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button href="/menu#coffee">Discover Our Menu</Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 · A PLACE TO STAY AWHILE */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-clay">Stay awhile</p>
            <h2 className="display mt-4 text-[clamp(2.6rem,5.5vw,5rem)] text-forest">{h.stayHeadline}</h2>
            <Photo
              src={photos.stay.src}
              alt={photos.stay.alt}
              label="Seating"
              className="mt-10 hidden aspect-[4/3] w-full lg:block"
              sizes="40vw"
            />
          </Reveal>
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:pt-4">
            {h.stayPoints.map((p, i) => {
              const Icon = stayIcons[i % stayIcons.length];
              return (
                <li key={p.title} className="border-t border-forest/25 pt-5">
                  <Reveal delay={0.05 * i}>
                    <Icon aria-hidden className="size-6 text-clay" strokeWidth={1.5} />
                    <h3 className="display mt-4 text-[1.9rem] text-forest">{p.title}</h3>
                    <p className="mt-2 text-charcoal/85">{p.text}</p>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 7 · EVENTS & VENUE HIRE */}
      <section className="on-dark bg-forest py-24 text-cream md:py-36">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-cream/70">Events &amp; venue hire</p>
              <h2 className="display mt-4 text-[clamp(2.6rem,6vw,5.5rem)]">{h.eventsHeadline}</h2>
              <p className="mt-7 max-w-xl text-lg text-cream/85">{h.eventsBody}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="display mt-10 flex flex-wrap gap-x-3 gap-y-1 text-[clamp(1.5rem,2.6vw,2.2rem)] leading-snug text-cream/95">
                {h.eventTypes.map((t, i) => (
                  <li key={t} className="flex items-center gap-3">
                    {t}
                    {i < h.eventTypes.length - 1 && (
                      <span aria-hidden className="text-terracotta">
                        ·
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-11 flex flex-wrap gap-3">
                <Button href={venueEnquiryHref(b)} variant="light">
                  Enquire About Venue Hire
                </Button>
                <Button href="/events" variant="ghost-light">
                  Venue hire details
                </Button>
              </div>
            </Reveal>
          </div>
          <ImageReveal className="lg:col-span-5">
            <Photo
              src={photos.events.src}
              alt={photos.events.alt}
              label="Events"
              tone="sand"
              className="aspect-[4/5] w-full"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </ImageReveal>
        </div>
      </section>

      {/* 8 · LOCATION */}
      <section id="visit" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-clay">Visit us</p>
              <h2 className="display mt-4 text-[clamp(2.6rem,5.5vw,5rem)] text-forest">{h.locationHeadline}</h2>
              <address className="mt-8 flex gap-3 text-xl not-italic text-charcoal">
                <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-clay" />
                <span>{address}.</span>
              </address>
              <p className="mt-3 text-charcoal/80">{h.locationText}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 flex gap-3">
                <Clock aria-hidden className="mt-1 size-5 shrink-0 text-clay" />
                <dl className="space-y-2">
                  {b.hours.map((x) => (
                    <div key={x.days} className="flex gap-4">
                      <dt className="w-36 font-semibold">{x.days}</dt>
                      <dd className="tabular-nums">
                        {x.opens}–{x.closes}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="mt-6 flex items-center gap-3">
                <Phone aria-hidden className="size-5 text-clay" />
                <a href={telHref(b.phoneGeneral)} className="font-semibold underline decoration-clay/40 underline-offset-4 hover:decoration-clay">
                  {b.phoneGeneral}
                </a>
                <span className="text-sm text-charcoal/70">General &amp; reservations</span>
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={directionsHref(address)}>Get Directions</Button>
                <Button
                  href={reservationHref(b)}
                  variant="outline"
                  icon={<MessageCircle aria-hidden className="size-4" />}
                >
                  Reservation Enquiry
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7">
            <div className="aspect-[4/3] w-full overflow-hidden bg-sand lg:aspect-auto lg:h-full lg:min-h-[28rem]">
              <iframe
                title={`Map showing ${b.name}, ${address}`}
                src={mapsEmbedSrc(address)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function DishText({
  n,
  dish,
  large,
}: {
  n: string;
  dish: { name: string; description: string; price: string; note: string };
  large?: boolean;
}) {
  return (
    <>
      <p className="eyebrow text-clay">{n}</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className={`display text-forest ${large ? "text-[clamp(2.4rem,4.4vw,4rem)]" : "text-[clamp(2rem,3vw,2.7rem)]"}`}>
          {dish.name}
        </h3>
        {dish.price && <span className="font-semibold tabular-nums text-clay">{dish.price}</span>}
      </div>
      {dish.note && <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-charcoal/65">{dish.note}</p>}
      <p className={`mt-3 max-w-md text-charcoal/85 ${large ? "text-lg" : ""}`}>{dish.description}</p>
      <p className="mt-4">
        <TextLink href="/menu">On the menu</TextLink>
      </p>
    </>
  );
}
