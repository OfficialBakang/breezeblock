"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GALLERY_CATEGORIES, type GalleryCategory, type GalleryPhoto } from "@/lib/gallery-types";
import { cn } from "@/lib/format";

const PLACEHOLDERS: { label: string; ratio: string }[] = [
  { label: "Courtyard", ratio: "aspect-[4/5]" },
  { label: "Interior", ratio: "aspect-[4/3]" },
  { label: "Food", ratio: "aspect-square" },
  { label: "Coffee", ratio: "aspect-[3/4]" },
  { label: "Events", ratio: "aspect-[4/3]" },
  { label: "People & Community", ratio: "aspect-[4/5]" },
];

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const available = GALLERY_CATEGORIES.filter((c) => photos.some((p) => p.category === c.value));
  const shown = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + shown.length) % shown.length)),
    [shown.length]
  );

  useEffect(() => {
    if (open === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  if (photos.length === 0) {
    return (
      <div>
        <p className="mb-8 max-w-xl border-l-2 border-terracotta pl-4 text-charcoal/80">
          Our photographs are on their way. Meanwhile, you can see what&rsquo;s happening day to day on our Instagram.
        </p>
        <div aria-hidden className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {PLACEHOLDERS.map((p) => (
            <div key={p.label} className={cn("ph ph-sand relative mb-4 break-inside-avoid", p.ratio)}>
              <span className="absolute bottom-3 left-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] opacity-80">
                Photo to come · {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const current = open !== null ? shown[open] : null;

  return (
    <div>
      <div role="group" aria-label="Filter photographs" className="mb-10 flex flex-wrap gap-2">
        {[{ value: "all" as const, label: "All" }, ...available].map((c) => (
          <button
            key={c.value}
            type="button"
            aria-pressed={filter === c.value}
            onClick={() => setFilter(c.value)}
            className={cn(
              "min-h-11 rounded-sm border px-4 text-[0.92rem] font-semibold transition-colors",
              filter === c.value
                ? "border-forest bg-forest text-cream"
                : "border-forest/40 text-forest hover:bg-forest/10"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {shown.map((p, i) => (
          <motion.li
            key={p.id}
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-4 break-inside-avoid"
          >
            <button
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
              className="group relative block w-full overflow-hidden bg-sand"
              aria-label={`Open photo: ${p.alt}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                loading={i < 3 ? "eager" : "lazy"}
                className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </button>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            className="on-dark fixed inset-0 z-[70] flex flex-col bg-charcoal/95 text-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <div className="flex items-center justify-between px-4 py-3 md:px-8" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm text-cream/70" aria-live="polite">
                {open! + 1} / {shown.length}
              </p>
              <button
                ref={closeBtn}
                type="button"
                onClick={close}
                className="inline-flex size-11 items-center justify-center rounded-sm hover:bg-cream/10"
              >
                <X aria-hidden className="size-6" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex max-h-full items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  sizes="100vw"
                  className="max-h-[calc(100svh-11rem)] w-auto max-w-full object-contain"
                />
              </motion.div>
              {shown.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      step(-1);
                    }}
                    className="absolute left-1 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-sm hover:bg-cream/10 md:left-5"
                  >
                    <ChevronLeft aria-hidden className="size-7" />
                    <span className="sr-only">Previous photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      step(1);
                    }}
                    className="absolute right-1 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-sm hover:bg-cream/10 md:right-5"
                  >
                    <ChevronRight aria-hidden className="size-7" />
                    <span className="sr-only">Next photo</span>
                  </button>
                </>
              )}
            </div>
            <p className="px-6 py-4 text-center text-sm text-cream/80" onClick={(e) => e.stopPropagation()}>
              {current.alt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
