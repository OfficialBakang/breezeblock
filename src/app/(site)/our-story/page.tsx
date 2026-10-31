import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { ImageReveal, Parallax, Reveal } from "@/components/Motion";
import { Photo } from "@/components/Photo";
import { getPhotos, getStory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Story | An Independent Neighbourhood Cafe in Brixton",
  description:
    "Breezeblock is an independent, owner-run cafe in Brixton, Johannesburg: a courtyard designed by artist Justin Brett, locally roasted coffee and home-style food inspired by global flavours.",
  alternates: { canonical: "/our-story" },
  openGraph: {
    title: "Our Story | Breezeblock Cafe, Brixton",
    description: "An independent, owner-run neighbourhood cafe built around good food, great coffee, art and community.",
    url: "/our-story",
  },
};

export default async function StoryPage() {
  const [s, photos] = await Promise.all([getStory(), getPhotos()]);
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8 md:pt-28">
        <p className="eyebrow text-clay">Our story</p>
        <h1 className="display mt-4 max-w-5xl text-[clamp(3.2rem,9vw,8rem)] text-forest">{s.headline}</h1>
        <p className="mt-8 max-w-2xl text-xl text-charcoal/90">{s.standfirst}</p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <Parallax className="aspect-[4/3] w-full md:aspect-[21/9]" strength={8}>
          <Photo src={photos.story.src} alt={photos.story.alt} label="Breezeblock" priority sizes="100vw" className="h-full w-full" />
        </Parallax>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-20 lg:col-span-7">
            {s.chapters.map((c, i) => (
              <Reveal key={c.title} className="grid gap-4 md:grid-cols-[5rem_1fr]">
                <span className="display text-5xl text-terracotta">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="display text-[clamp(2.1rem,3.6vw,3.2rem)] text-forest">{c.title}</h2>
                  <div className="mt-4 space-y-4 text-lg text-charcoal/90">
                    {c.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <ImageReveal>
                <Photo
                  src={photos.storySecondary.src}
                  alt={photos.storySecondary.alt}
                  label="Detail"
                  tone="sand"
                  className="aspect-[3/4] w-full"
                  sizes="(min-width: 1024px) 30vw, 100vw"
                />
              </ImageReveal>
              {s.pullQuote && <p className="display mt-8 text-4xl italic text-forest">&ldquo;{s.pullQuote}&rdquo;</p>}
            </div>
          </aside>
        </div>
      </section>

      <section className="on-dark bg-forest py-20 text-cream md:py-28">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8 px-5 md:px-8">
          <h2 className="display max-w-2xl text-[clamp(2.6rem,6vw,5rem)]">Come and see for yourself.</h2>
          <div className="flex flex-wrap gap-3">
            <Button href="/menu" variant="light">Explore Our Menu</Button>
            <Button href="/contact#visit" variant="ghost-light">Find Us</Button>
          </div>
        </div>
      </section>
    </>
  );
}
