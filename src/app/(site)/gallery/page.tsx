import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getBusiness, getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery | The Courtyard Cafe in Brixton, Johannesburg",
  description:
    "Take a look inside Breezeblock Cafe: our courtyard with its succulent garden, fish pond and tile mural, the interior, food, coffee and events in Brixton, Johannesburg.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery | Breezeblock Cafe, Brixton",
    description: "The courtyard, interior, food, coffee and events at Breezeblock Cafe.",
    url: "/gallery",
  },
};

export default async function GalleryPage() {
  const [b, photos] = await Promise.all([getBusiness(), getGallery()]);
  return (
    <>
      <section className="on-dark bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
          <p className="eyebrow text-cream/70">The courtyard &amp; gallery</p>
          <h1 className="display mt-4 max-w-4xl text-[clamp(3rem,8vw,7rem)]">Find your favourite corner.</h1>
          <p className="mt-7 max-w-xl text-lg text-cream/85">
            A succulent garden, a fish pond, a reclaimed tile mural and a room full of character. Here&rsquo;s a look
            around.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <GalleryGrid photos={photos} />
        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-forest/20 pt-10">
          <p className="display max-w-md text-3xl text-forest">Better in person.</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact#visit">Plan your visit</Button>
            {b.instagramUrl && (
              <Button href={b.instagramUrl} variant="outline">
                See more on Instagram
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
