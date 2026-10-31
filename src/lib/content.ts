import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import { createReader } from "@keystatic/core/reader";
import { imageSize } from "image-size";
import keystaticConfig from "../../keystatic.config";

/**
 * The only place that reads editable content. Pages ask for typed, ready-to-use
 * data; they never know whether a value came from the CMS or a fallback.
 */
const reader = createReader(process.cwd(), keystaticConfig);

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://breezeblock.co.za"
).replace(/\/$/, "");

const PUBLIC_DIR = path.join(process.cwd(), "public");

const publicFileExists = (src: string | null | undefined): src is string =>
  !!src && src.startsWith("/") && fs.existsSync(path.join(PUBLIC_DIR, src));

// ---------------------------------------------------------------- types
type Read<T extends () => Promise<unknown>> = NonNullable<Awaited<ReturnType<T>>>;
export type Business = Read<typeof reader.singletons.business.read>;
export type Home = Read<typeof reader.singletons.home.read>;
export type Story = Read<typeof reader.singletons.story.read>;
export type Announcement = Read<typeof reader.singletons.announcement.read>;

export type Pic = { src: string | null; alt: string };

export type MenuItem = {
  name: string;
  description: string;
  price: string;
  group: string;
  photo: string | null;
  photoAlt: string;
};
export type MenuCategory = {
  slug: string;
  name: string;
  kind: "food" | "drinks";
  intro: string;
  items: MenuItem[];
};

export { GALLERY_CATEGORIES } from "./gallery-types";
export type { GalleryCategory, GalleryPhoto } from "./gallery-types";
import type { GalleryCategory, GalleryPhoto } from "./gallery-types";

export type EventEntry = {
  slug: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string | null;
  imageAlt: string;
  linkLabel: string;
  linkHref: string;
};

// ------------------------------------------------- optional photo manifest
/**
 * `npm run fetch-photos` (see scripts/) downloads the cafe's own published
 * photographs into public/photos and records them here. It is optional: with
 * no manifest the site uses clearly-labelled placeholders until photographs
 * are uploaded through the admin.
 */
type Manifest = {
  slots?: Record<string, string>;
  gallery?: { file: string; category: GalleryCategory; alt: string }[];
};
const manifest = (): Manifest => {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(PUBLIC_DIR, "photos", "manifest.json"), "utf8")
    );
  } catch {
    return {};
  }
};
const slotSrc = (slot: string): string | null => {
  const file = manifest().slots?.[slot];
  const src = file ? `/photos/${file}` : null;
  return publicFileExists(src) ? src : null;
};
const resolve = (cms: string | null | undefined, slot?: string) =>
  publicFileExists(cms) ? cms : slot ? slotSrc(slot) : null;

export const hasLogo = () =>
  fs.existsSync(path.join(PUBLIC_DIR, "brand", "logo-white.png"));

// ----------------------------------------------------------------- getters
export const getBusiness = cache(async (): Promise<Business> => {
  const b = await reader.singletons.business.read();
  if (!b) throw new Error("Missing content/business.json");
  return b;
});

export const getHome = cache(async (): Promise<Home> => {
  const h = await reader.singletons.home.read();
  if (!h) throw new Error("Missing content/home.json");
  return h;
});

export const getStory = cache(async (): Promise<Story> => {
  const s = await reader.singletons.story.read();
  if (!s) throw new Error("Missing content/story.json");
  return s;
});

export const getAnnouncement = cache(async (): Promise<Announcement | null> => {
  const a = await reader.singletons.announcement.read();
  return a && a.enabled && a.text.trim() ? a : null;
});

export const getPhotos = cache(async () => {
  const p = (await reader.singletons.photos.read()) ?? ({} as never);
  const pic = (
    src: string | null | undefined,
    alt: string | null | undefined,
    fallbackAlt: string,
    slot?: string
  ): Pic => ({ src: resolve(src, slot), alt: alt?.trim() || fallbackAlt });
  const g = p as Record<string, string | null>;
  return {
    hero: pic(g.hero, g.heroAlt, "Breezeblock Cafe, Brixton", "hero"),
    intro: pic(g.intro, g.introAlt, "Inside Breezeblock Cafe", "intro"),
    courtyardLarge: pic(g.courtyardLarge, g.courtyardLargeAlt, "The Breezeblock courtyard", "courtyardLarge"),
    courtyardA: pic(g.courtyardA, g.courtyardAAlt, "The succulent garden", "courtyardA"),
    courtyardB: pic(g.courtyardB, g.courtyardBAlt, "The fish pond and tile mural", "courtyardB"),
    coffee: pic(g.coffee, g.coffeeAlt, "Coffee at Breezeblock Cafe", "coffee"),
    coffeeSecondary: pic(g.coffeeSecondary, g.coffeeSecondaryAlt, "A cup of coffee", "coffeeSecondary"),
    stay: pic(g.stay, g.stayAlt, "Seating at Breezeblock Cafe", "stay"),
    events: pic(g.events, g.eventsAlt, "The courtyard set up for an event", "events"),
    story: pic(g.story, g.storyAlt, "Breezeblock Cafe", "story"),
    storySecondary: pic(g.storySecondary, g.storySecondaryAlt, "Breezeblock Cafe detail", "storySecondary"),
  };
});
export type Photos = Awaited<ReturnType<typeof getPhotos>>;

/** Signature dishes with photos resolved (CMS upload first, fetched photo second). */
export const getSignatureDishes = cache(async () => {
  const home = await getHome();
  return home.signatureDishes.map((d) => ({
    ...d,
    photo: resolve(d.photo, `dish:${d.name}`),
    photoAlt: d.photoAlt || d.name,
  }));
});

export const getMenu = cache(async (): Promise<MenuCategory[]> => {
  const all = await reader.collections.menu.all();
  return all
    .map(({ slug, entry }) => ({
      slug,
      order: entry.order ?? 100,
      cat: {
        slug,
        name: entry.name,
        kind: entry.kind as "food" | "drinks",
        intro: entry.intro,
        items: entry.items
          .filter((i) => i.available)
          .map((i) => ({
            name: i.name,
            description: i.description,
            price: i.price,
            group: i.group,
            photo: resolve(i.photo),
            photoAlt: i.photoAlt || i.name,
          })),
      } satisfies MenuCategory,
    }))
    .sort((a, b) => a.order - b.order)
    .map((x) => x.cat)
    .filter((c) => c.items.length > 0);
});

const dims = (src: string) => {
  try {
    const { width, height } = imageSize(fs.readFileSync(path.join(PUBLIC_DIR, src)));
    if (width && height) return { width, height };
  } catch {
    /* fall through */
  }
  return { width: 1200, height: 800 };
};

export const getGallery = cache(async (): Promise<GalleryPhoto[]> => {
  const out: (GalleryPhoto & { order: number })[] = [];
  const entries = await reader.collections.gallery.all();
  for (const { slug, entry } of entries) {
    if (!publicFileExists(entry.image)) continue;
    out.push({
      id: slug,
      src: entry.image,
      alt: entry.alt || entry.title,
      category: entry.category as GalleryCategory,
      order: entry.order ?? 100,
      ...dims(entry.image),
    });
  }
  for (const [i, g] of (manifest().gallery ?? []).entries()) {
    const src = `/photos/${g.file}`;
    if (!publicFileExists(src)) continue;
    out.push({
      id: `site-${i}`,
      src,
      alt: g.alt,
      category: g.category,
      order: 1000 + i,
      ...dims(src),
    });
  }
  return out.sort((a, b) => a.order - b.order).map(({ order: _o, ...rest }) => rest);
});

export const getEvents = cache(async (): Promise<EventEntry[]> => {
  const all = await reader.collections.events.all();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Johannesburg" });
  return all
    .filter(({ entry }) => entry.date && entry.date >= today)
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      date: entry.date as string,
      time: entry.time,
      description: entry.description,
      image: resolve(entry.image),
      imageAlt: entry.imageAlt || entry.title,
      linkLabel: entry.linkLabel,
      linkHref: entry.linkHref,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
});
