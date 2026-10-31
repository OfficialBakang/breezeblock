import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { MenuBrowser } from "@/components/MenuBrowser";
import { Reveal } from "@/components/Motion";
import { getBusiness, getMenu } from "@/lib/content";
import { telHref } from "@/lib/format";
import { reservationHref } from "@/lib/links";

export const metadata: Metadata = {
  title: "Menu | Breakfast, Lunch & Coffee in Brixton",
  description:
    "Browse the Breezeblock Cafe menu: Meppel pancakes, huevos rancheros, Eggs Mirza, sandwiches, burgers, salads, locally roasted coffee, wine, beer and cocktails in Brixton, Johannesburg.",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: "Menu | Breezeblock Cafe, Brixton",
    description: "Breakfast, brunch, lunch, coffee and drinks at Breezeblock Cafe in Brixton, Johannesburg.",
    url: "/menu",
  },
};

export default async function MenuPage() {
  const [b, categories] = await Promise.all([getBusiness(), getMenu()]);
  return (
    <>
      <section className="on-dark bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
          <p className="eyebrow text-cream/70">The menu</p>
          <h1 className="display mt-4 max-w-4xl text-[clamp(3rem,8vw,7rem)]">Food &amp; drinks, made to linger over.</h1>
          <p className="mt-7 max-w-xl text-lg text-cream/85">
            Unpretentious, flavourful, home-style food inspired by global flavours, with vegetarian and vegan options,
            alongside locally roasted coffee and a licensed bar.
          </p>
          <p className="mt-6 max-w-xl border-l-2 border-terracotta pl-4 text-[0.95rem] text-cream/80">{b.menuNotice}</p>
        </div>
      </section>

      <MenuBrowser categories={categories} />

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal className="grid gap-8 border-t border-forest/20 pt-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="display text-[clamp(2.2rem,4.5vw,3.8rem)] text-forest">Planning a visit?</h2>
            <p className="mt-4 max-w-lg text-lg">
              Call us on{" "}
              <a href={telHref(b.phoneGeneral)} className="font-semibold text-clay underline underline-offset-4">
                {b.phoneGeneral}
              </a>{" "}
              for reservations or the latest on what&rsquo;s available.
            </p>
            <p className="mt-4 max-w-lg text-sm text-charcoal/70">{b.menuNotice}</p>
          </div>
          <div className="flex flex-wrap items-start gap-3 md:col-span-5 md:justify-end">
            <Button href={telHref(b.phoneGeneral)} icon={<Phone aria-hidden className="size-4" />}>
              Call to reserve
            </Button>
            <Button href={reservationHref(b)} variant="outline">
              Reservation enquiry
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
